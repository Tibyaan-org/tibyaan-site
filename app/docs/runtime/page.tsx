import type { Metadata } from "next";
import Link from "next/link";
import { DocPage, H2, Callout, DocTable } from "../../_components/docs/doc";
import { CodeBlock, IC } from "../../_components/ui";
import { LINKS, META } from "../../_content/claims";

export const metadata: Metadata = {
  title: "Spring runtime",
  description:
    "How tibyan-runtime-spring finds the manifest, serves the MCP tools inside your application, validates inputs, and which properties control exposure.",
  alternates: { canonical: "/docs/runtime/" },
};

export default function Runtime() {
  return (
    <DocPage
      href="/docs/runtime/"
      title="Spring runtime"
      lead="The runtime is one dependency. It hosts the generated MCP server inside your application's own process, finds the manifest the build plugin produced, and registers one tool per capability, each calling your real service method."
      toc={[
        { id: "dependency", label: "The dependency" },
        { id: "launch", label: "Launching" },
        { id: "discovery", label: "Manifest discovery order" },
        { id: "properties", label: "Runtime properties" },
        { id: "inputs", label: "How inputs are bound" },
        { id: "authorities", label: "Declared authorities" },
        { id: "security", label: "Security" },
      ]}
      source={{ label: "docs/COMMANDS.md, section 4", href: LINKS.commands }}
    >
      <H2 id="dependency">The dependency</H2>
      <CodeBlock label="pom.xml" lang="xml">{`<dependency>
  <groupId>${META.groupId}</groupId>
  <artifactId>tibyan-runtime-spring</artifactId>
  <version>${META.version}</version>
</dependency>`}</CodeBlock>
      <p>The host application must be Spring Boot 3.x on Java 17 or later.</p>

      <H2 id="launch">Launching</H2>
      <p>
        Run your application as usual. No launch property and no MCP block in{" "}
        <IC>application.yml</IC> are needed: the runtime finds the manifest on the classpath and
        registers the tools.
      </p>
      <CodeBlock label="shell" lang="shell">{`java -jar target/your-app.jar`}</CodeBlock>
      <p>
        The MCP server is served over HTTP with Server-Sent Events at{" "}
        <IC wrap>{"http://<host>:<port>/sse"}</IC>, on your application's own HTTP port (8080 by
        default). Point an MCP client that speaks the HTTP and SSE transport at it. A stdio-only
        client needs a bridge: see{" "}
        <Link href="/docs/connecting/" className="prose-link">
          Connect an MCP client
        </Link>
        .
      </p>

      <H2 id="discovery">Manifest discovery order</H2>
      <p>
        The runtime looks for the manifest in a fixed order, and fails loudly if it finds none. It
        will not start silently serving nothing.
      </p>
      <ol>
        <li>
          An explicit <IC>tibyan.capabilities</IC> location, if you set one. If it is set but
          nothing resolves there, that is a loud failure, not a fall-through to the defaults.
        </li>
        <li>
          <IC wrap>classpath:/tibyan/capabilities.json</IC>, where the build plugin puts it.
        </li>
        <li>
          <IC wrap>file:tibyan/capabilities.json</IC>, relative to the working directory.
        </li>
      </ol>

      <H2 id="properties">Runtime properties</H2>
      <DocTable
        head={["Property", "Default", "Effect"]}
        rows={[
          [
            <IC key="1">tibyan.capabilities</IC>,
            "unset",
            <>Point the runtime at a specific manifest, overriding the default locations. Accepts Spring resource locations (<IC>classpath:</IC>, <IC>file:</IC>).</>,
          ],
          [
            <IC key="2">tibyan.attested.expose</IC>,
            <IC key="d2">true</IC>,
            "Set to false for a verified-only surface: no attested capability is registered at all.",
          ],
          [
            <IC key="3" wrap>tibyan.attested.exposeSecurityUnverifiable</IC>,
            <IC key="d3">false</IC>,
            "Attested reads whose declared security the tool could not compile do not register unless you opt in, once you have resolved what their declared security means.",
          ],
          [
            <IC key="4">tibyan.attested.exposeBoundary</IC>,
            <IC key="d4">false</IC>,
            "Boundary attestations (remote delegations) do not register unless you opt in.",
          ],
        ]}
      />
      <CodeBlock label="shell" lang="shell">{`# Run against a manifest produced by the CLI, sitting outside the classpath:
java "-Dtibyan.capabilities=file:generated/tibyan/capabilities.json" -jar target/your-app.jar`}</CodeBlock>
      <p>
        On Windows PowerShell, quote the whole property, as shown. The three{" "}
        <IC>tibyan.attested.*</IC> switches only matter if your project carries an{" "}
        <Link href="/docs/attestation/" className="prose-link">
          attestations file
        </Link>
        .
      </p>

      <H2 id="inputs">How inputs are bound</H2>
      <p>
        The runtime binds each call's arguments to the target method's declared parameter types. A
        capability with an enum or date parameter invokes normally. When an input carries a closed
        set of values, read from an enum declared in your own source, both the manifest and the
        OpenAPI document render it as a closed set, and the runtime refuses an illegal value before
        invoking, naming the legal values.
      </p>

      <H2 id="authorities">Declared authorities</H2>
      <p>
        The manifest can carry the security contract your application declares on its own
        endpoints. Read the three states precisely:
      </p>
      <DocTable
        head={["In the manifest", "Meaning"]}
        rows={[
          [
            <IC key="1">requiredAuthorities</IC>,
            "Your application declares that a caller must hold at least one of these authorities for this read. The tool carries the declaration; it does not enforce it.",
          ],
          [
            <IC key="2">securityUnverifiable</IC>,
            "A security declaration exists that the tool could not compile completely. Treat the capability as gated until a person resolves what the declaration means.",
          ],
          [
            "Neither",
            "No method-security declaration was found on the read or its controller endpoints. This is not a statement that the read is unprotected: URL-level rules in your security filter chain are invisible to this analysis.",
          ],
        ]}
      />
      <p>
        The declared contract is carried so that your own enforcement layer, the gateway or
        orchestration in front of the MCP endpoint, can apply it before invoking a capability.
      </p>

      <H2 id="security">Security</H2>
      <Callout title="The runtime enforces nothing">
        <p>
          The adapter calls your service bean directly, not your controller, so your HTTP security
          is bypassed. The generated server executes real methods against real data and adds no
          authentication of its own. Gating <IC>/sse</IC> is your responsibility. Read{" "}
          <Link href="/docs/security/" className="prose-link">
            Security
          </Link>{" "}
          before you expose it.
        </p>
      </Callout>
    </DocPage>
  );
}
