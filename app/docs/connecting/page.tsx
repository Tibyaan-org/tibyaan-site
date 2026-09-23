import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { DocPage, H2, H3, Callout } from "../../_components/docs/doc";
import { CodeBlock, Frame, IC } from "../../_components/ui";
import { LINKS } from "../../_content/claims";
import { HANDSHAKE_PROVENANCE } from "../../_content/survey";

export const metadata: Metadata = {
  title: "Connect an MCP client",
  description:
    "What the runtime serves, how to confirm it works with curl and a scripted handshake, and how to point Claude Code, Claude Desktop, or another MCP client at it.",
  alternates: { canonical: "/docs/connecting/" },
};

// Verbatim, read at build time. See app/_content/generated/README.md.
const HANDSHAKE_TEXT = fs
  .readFileSync(path.join(process.cwd(), "app/_content/generated/mcp-handshake.txt"), "utf8")
  .replace(/\r\n/g, "\n")
  .replace(/\n+$/, "");

export default function Connecting() {
  return (
    <DocPage
      href="/docs/connecting/"
      title="Connect an MCP client"
      lead="Once the runtime dependency is in your application and the manifest is on the classpath, your app hosts an MCP server in its own process. This page shows what it serves, how to confirm it works, and how to point a client at it."
      toc={[
        { id: "serves", label: "What the runtime serves" },
        { id: "verified", label: "How the connection is tested" },
        { id: "smoke", label: "Confirm it yourself" },
        { id: "claude-code", label: "Claude Code" },
        { id: "stdio", label: "Claude Desktop and stdio clients" },
        { id: "transport", label: "Transport caveat" },
        { id: "before", label: "Before you expose it" },
      ]}
      source={{ label: "docs/CONNECTING-AN-MCP-CLIENT.md", href: LINKS.connecting }}
    >
      <H2 id="serves">What the runtime serves</H2>
      <ul>
        <li>
          An MCP server on the same HTTP port as your application, over the Server-Sent Events
          transport.
        </li>
        <li>
          The SSE endpoint is <IC wrap>{"http://<host>:<port>/sse"}</IC>. The session's message
          endpoint is issued to the client as the first SSE event, at{" "}
          <IC wrap>/mcp/message?sessionId=...</IC>
        </li>
        <li>
          One MCP tool per capability. Each tool calls the service method its capability is bound
          to.
        </li>
      </ul>

      <H2 id="verified">How the connection is tested</H2>
      <p>The path from an MCP client to a service method is tested in two ways.</p>
      <ul>
        <li>
          <strong>In process, on every build.</strong> An integration test boots a Spring context
          and the MCP server, without mocks, and runs <IC>initialize</IC>, <IC>tools/list</IC>, and{" "}
          <IC>tools/call</IC> against the service bean.
        </li>
        <li>
          <strong>Out of process, over the network.</strong> The example app was launched as a
          normal jar, and an external client ran the full handshake. This is the output as it
          was recorded:
        </li>
      </ul>
      <Frame
        barLabel={HANDSHAKE_PROVENANCE.command}
        flat
        caption={
          <>
            Recorded {HANDSHAKE_PROVENANCE.date} against the in-repo example app. The returned
            product is the row that <IC>ProductService.findById</IC> read from the app's store. It
            isn't a test fixture. The version string is the one that run printed.
          </>
        }
      >
        <pre className="code">
          <code>{HANDSHAKE_TEXT}</code>
        </pre>
      </Frame>
      <p>
        These tests cover the protocol and the network path. They don't cover the configuration of
        any specific desktop client, because that is a GUI step on your machine. The client setup
        below is the standard approach, but check it against your client's current version.
      </p>

      <H2 id="smoke">Confirm it yourself</H2>
      <H3>A one-line smoke test</H3>
      <p>
        With the app running, open the SSE stream. The server should immediately send an{" "}
        <IC>endpoint</IC> event naming the session's message URL, which shows that the MCP server is
        running and speaking the protocol. The stream stays open by design, so press Ctrl-C to stop.
      </p>
      <CodeBlock label="shell" lang="shell">{`curl -N http://localhost:8080/sse
# event: endpoint
# data: /mcp/message?sessionId=...`}</CodeBlock>
      <H3>A full handshake</H3>
      <p>
        The repository includes <IC>scripts/verify-mcp-sse.py</IC>, which runs the whole flow using
        only the Python standard library. It opens the stream, reads the endpoint, and sends{" "}
        <IC>initialize</IC>, <IC>tools/list</IC>, and one <IC>tools/call</IC>. To run it against
        your own app, edit the <IC>BASE</IC> URL and change the final call to one of your
        discovered tools.
      </p>
      <CodeBlock label="shell" lang="shell">{`python scripts/verify-mcp-sse.py`}</CodeBlock>

      <H2 id="claude-code">Claude Code (direct SSE)</H2>
      <p>Claude Code connects to an SSE server directly. With your app running, register it once:</p>
      <CodeBlock label="shell" lang="shell">{`claude mcp add --transport sse my-legacy-app http://localhost:8080/sse
claude mcp list`}</CodeBlock>
      <p>
        Inside a session, <IC>/mcp</IC> shows the connected servers, and each capability appears as
        a tool named <IC wrap>{"mcp__my-legacy-app__<capability>"}</IC>. You don't need to type
        that name. Ask in plain language and the agent calls the tool. For the example app, "get
        product 5" makes the agent call <IC>getProduct</IC> with <IC>id</IC> 5 and read back the
        row from the app's store. To scope the server to one project, add it to a project{" "}
        <IC>.mcp.json</IC> instead of your user config.
      </p>

      <H2 id="stdio">Claude Desktop and other stdio-only clients</H2>
      <p>
        Clients that speak only the stdio transport reach a remote SSE server through a bridge. The
        common one is <IC>mcp-remote</IC>, launched over stdio:
      </p>
      <CodeBlock label="claude_desktop_config.json" lang="json">{`{
  "mcpServers": {
    "my-legacy-app": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "http://localhost:8080/sse"]
    }
  }
}`}</CodeBlock>
      <p>
        Client configuration formats change faster than this project does, so check the command
        names and config format against your client's current documentation.
      </p>

      <H2 id="transport">Transport caveat</H2>
      <p>
        The runtime serves the HTTP and SSE transport. The MCP ecosystem has been moving toward the
        newer Streamable HTTP transport. If your client supports only Streamable HTTP, you need a
        bridge like the one above. Streamable HTTP support in the runtime is a candidate for later
        work and isn't part of v1.
      </p>

      <H2 id="before">Before you expose it</H2>
      <Callout title="Read the security page first">
        <p>
          The MCP endpoint has no authentication of its own, and it calls your service methods
          against your application's live data. Bind it to localhost or keep it behind your own
          network controls. See{" "}
          <Link href="/docs/security/" className="prose-link">
            Security
          </Link>
          .
        </p>
      </Callout>
    </DocPage>
  );
}
