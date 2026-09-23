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
      lead="The runtime is a single dependency. It hosts the generated MCP server inside your application's process, finds the manifest that the Maven plugin produced, and registers one tool per capability. Each tool calls the service method its capability is bound to."
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
        Run your application as usual. You don't need a launch property or an MCP block in{" "}
        <IC>application.yml</IC>, because the runtime finds the manifest on the classpath and
        registers the tools.
      </p>
      <CodeBlock label="shell" lang="shell">{`java -jar target/your-app.jar`}</CodeBlock>
      <p>
        The MCP server is served over HTTP with Server-Sent Events at{" "}
        <IC wrap>{"http://<host>:<port>/sse"}</IC>, on your application's own HTTP port (8080 by
        default). Point an MCP client that speaks the HTTP and SSE transport at it. A stdio-only
        client needs a bridge. See{" "}
        <Link href="/docs/connecting/" className="prose-link">
          Connect an MCP client
        </Link>
        .
      </p>

      <H2 id="discovery">Manifest discovery order</H2>
      <p>
        The runtime looks for the manifest in the order below. If it finds none, it fails with an
        error instead of starting with an empty tool list.
      </p>
      <ol>
        <li>
          The location in <IC>tibyan.capabilities</IC>, if you set one. If the property is set but
          nothing resolves there, the runtime fails with an error and doesn't fall through to the
          defaults.
        </li>
        <li>
          <IC wrap>classpath:/tibyan/capabilities.json</IC>, where the Maven plugin writes it.
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
            "Set to false to expose verified capabilities only. No attested capability is registered.",
          ],
          [
            <IC key="3" wrap>tibyan.attested.exposeSecurityUnverifiable</IC>,
            <IC key="d3">false</IC>,
            "Attested reads whose declared security the tool couldn't compile aren't registered unless you opt in. Opt in only after you have resolved what their declared security means.",
          ],
          [
            <IC key="4">tibyan.attested.exposeBoundary</IC>,
            <IC key="d4">false</IC>,
            "Boundary attestations (remote delegations) aren't registered unless you opt in.",
          ],
        ]}
      />
      <CodeBlock label="shell" lang="shell">{`# Run against a manifest produced by the CLI, sitting outside the classpath:
java "-Dtibyan.capabilities=file:generated/tibyan/capabilities.json" -jar target/your-app.jar`}</CodeBlock>
      <p>
        On Windows PowerShell, quote the whole property, as shown. The three{" "}
        <IC>tibyan.attested.*</IC> switches only matter if your project has an{" "}
        <Link href="/docs/attestation/" className="prose-link">
          attestations file
        </Link>
        .
      </p>

      <H2 id="inputs">How inputs are bound</H2>
      <p>
        The runtime binds each call's arguments to the target method's declared parameter types, so
        a capability with an enum or date parameter is invoked like any other. When an input has a
        closed set of values, read from an enum declared in your own source, both the manifest and
        the OpenAPI document render it as a closed set. The runtime rejects an illegal value before
        it invokes the method, and the error names the legal values.
      </p>

      <H2 id="authorities">Declared authorities</H2>
      <p>
        The manifest can carry the security contract that your application declares on its own
        endpoints. Each capability is in one of three states:
      </p>
      <DocTable
        head={["In the manifest", "Meaning"]}
        rows={[
          [
            <IC key="1">requiredAuthorities</IC>,
            "Your application declares that a caller must hold at least one of these authorities for this read. The tool copies the declaration into the manifest and doesn't enforce it.",
          ],
          [
            <IC key="2">securityUnverifiable</IC>,
            "A security declaration exists that the tool couldn't compile completely. Treat the capability as gated until a person resolves what the declaration means.",
          ],
          [
            "Neither",
            "No method-security declaration was found on the read or its controller endpoints. This doesn't mean the read is unprotected, because the analysis can't see URL-level rules in your security filter chain.",
          ],
        ]}
      />
      <p>
        The manifest carries the declared contract so that your own enforcement layer (the gateway
        or orchestration in front of the MCP endpoint) can apply it before a capability is invoked.
      </p>

      <H2 id="security">Security</H2>
      <Callout title="The runtime doesn't enforce security">
        <p>
          The runtime calls your service bean directly and doesn't go through your controller, so
          your HTTP security is bypassed. The generated server runs your service methods against
          your application's live data and adds no authentication of its own. Gating{" "}
          <IC>/sse</IC> is your responsibility. Read{" "}
          <Link href="/docs/security/" className="prose-link">
            Security
          </Link>{" "}
          before you expose it.
        </p>
      </Callout>
    </DocPage>
  );
}
