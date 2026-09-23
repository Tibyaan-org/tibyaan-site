import type { Metadata } from "next";
import Link from "next/link";
import { DocPage, Steps, Step, Callout, DocTable } from "../../_components/docs/doc";
import { CodeBlock, IC, Arrow } from "../../_components/ui";
import { REQUIREMENTS, LINKS, META } from "../../_content/claims";

export const metadata: Metadata = {
  title: "Quickstart",
  description:
    "Check the requirements, run a read-only scan, read your survey, add two entries to your build, connect an agent, and restrict access to the endpoint.",
  alternates: { canonical: "/docs/getting-started/" },
};

const JAR = `tibyan-cli-${META.cliVersionExample}-jar-with-dependencies.jar`;

export default function GettingStarted() {
  return (
    <DocPage
      href="/docs/getting-started/"
      title="Quickstart"
      lead="This guide starts with a read-only scan of your application, so you can see what Tibyaan finds before you change anything. If the result is useful, you add one dependency and one build plugin to your pom.xml, then connect an agent."
      toc={[
        { id: "range", label: "1. Check the requirements" },
        { id: "preview", label: "2. Run a read-only scan" },
        { id: "survey", label: "3. Read your survey" },
        { id: "adopt", label: "4. Add Tibyaan to your build" },
        { id: "connect", label: "5. Connect an agent" },
        { id: "security", label: "6. Restrict access to the endpoint" },
      ]}
    >
      <Steps>
        <Step n={1} id="range" title="Check the requirements">
          <p>Check these before you change anything in your project.</p>
          <DocTable head={["Requirement", "Detail"]} rows={REQUIREMENTS.map((r) => [<strong key={r.k}>{r.k}</strong>, r.v])} />
          <p>
            A Spring Boot 2.x or Java 8 backend can't host the runtime as-is. You can still run the
            scan in the next step, which reads any Java source tree and needs only Java 17.
          </p>
        </Step>

        <Step n={2} id="preview" title="Run a read-only scan">
          <p>
            Download the self-contained CLI from Maven Central and point it at your application.
            The scan only reads source files. It doesn't write to your project or touch your build.
          </p>
          <CodeBlock
            label="shell"
            lang="shell"
            caption={`The CLI jar is published on Maven Central (${META.groupId}, v${META.cliVersionExample}).`}
          >{`# Download the CLI jar from Maven Central (once):
curl -O ${LINKS.cliJar}

# Survey your application. This only reads source; it writes nothing:
java -jar ${JAR} scan /path/to/your-app`}</CodeBlock>
          <p>
            The scan prints the discovered capabilities, every refusal with its reason, and
            a totals line that includes <IC>mis-bound 0</IC>. If it finds nothing useful for your
            app, you can stop here without having changed your build.
          </p>
          <Callout title="Multi-module applications">
            <p>
              Point the scan at the reactor root instead of a single module, because discovery only
              sees the files you scan. See{" "}
              <Link href="/docs/multi-module/" className="prose-link">
                Multi-module applications
              </Link>
              .
            </p>
          </Callout>
          <details className="mt-5">
            <summary className="cursor-pointer text-[14.5px] font-medium text-fg">
              Build the CLI from source
            </summary>
            <CodeBlock label="shell" lang="shell">{`# From a checkout of the v${META.cliVersionExample} tag (a main checkout builds a -SNAPSHOT jar):
mvn -pl tibyan-cli -am -DskipTests package
java -jar tibyan-cli/target/${JAR} scan /path/to/your-app`}</CodeBlock>
          </details>
        </Step>

        <Step n={3} id="survey" title="Read your survey">
          <p>
            A layered application produces a set of verified capabilities and a list of refusals,
            each with its reason. A long list of refusals is expected. The count to check is{" "}
            <IC>mis-bound</IC>, which must stay 0.
          </p>
          <p>
            To save the survey as a Markdown report you can share, add <IC>--report</IC>:
          </p>
          <CodeBlock label="shell" lang="shell">{`# The same survey as a shareable Markdown report:
java -jar ${JAR} scan /path/to/your-app --report survey.md`}</CodeBlock>
          <p>
            <Link href="/docs/reading-your-survey/" className="link-arrow">
              What each line and refusal cause means <Arrow />
            </Link>
          </p>
        </Step>

        <Step n={4} id="adopt" title="Add Tibyaan to your build">
          <p>
            Add the runtime dependency. It hosts the MCP server inside your application's own
            context:
          </p>
          <CodeBlock label="pom.xml (dependency)" lang="xml">{`<dependency>
  <groupId>${META.groupId}</groupId>
  <artifactId>tibyan-runtime-spring</artifactId>
  <version>${META.version}</version>
</dependency>`}</CodeBlock>
          <p>
            Then add the build plugin. It generates the manifest from your source at build time and
            puts it on the classpath, so you don't commit the manifest by hand:
          </p>
          <CodeBlock label="pom.xml (build plugin)" lang="xml">{`<plugin>
  <groupId>${META.groupId}</groupId>
  <artifactId>tibyan-maven-plugin</artifactId>
  <version>${META.version}</version>
  <executions>
    <execution>
      <goals><goal>generate</goal></goals>
    </execution>
  </executions>
</plugin>`}</CodeBlock>
          <p>
            Build the project. The plugin writes the manifest to{" "}
            <IC wrap>target/classes/tibyan/capabilities.json</IC>:
          </p>
          <CodeBlock label="shell" lang="shell">{`mvn package
java -jar target/your-app.jar`}</CodeBlock>
          <p>
            By default, the plugin skips any source file it can't parse and logs the file name at
            WARN, so adopting Tibyaan doesn't break your build. For CI, set{" "}
            <IC>-Dtibyan.strict=true</IC> to fail the build on any unparseable file. Details are in
            the{" "}
            <Link href="/docs/maven-plugin/" className="prose-link">
              Maven plugin reference
            </Link>
            .
          </p>
        </Step>

        <Step n={5} id="connect" title="Connect an agent">
          <p>
            The runtime finds the manifest on the classpath automatically. You don't need a launch
            property or an MCP block in <IC>application.yml</IC>. The MCP server is available at{" "}
            <IC>http://localhost:8080/sse</IC>. Check that it responds, then register it with your
            client:
          </p>
          <CodeBlock
            label="shell"
            lang="shell"
            caption="This flow is tested end to end. An out-of-process client completes initialize, tools/list, and a tools/call over the network against the example app."
          >{`# The server should immediately send an "endpoint" event:
curl -N http://localhost:8080/sse

# Claude Code speaks SSE directly:
claude mcp add --transport sse my-legacy-app http://localhost:8080/sse`}</CodeBlock>
          <p>
            A stdio-only client such as Claude Desktop connects through a bridge. The full steps
            are in{" "}
            <Link href="/docs/connecting/" className="prose-link">
              Connect an MCP client
            </Link>
            .
          </p>
        </Step>

        <Step n={6} id="security" title="Restrict access to the endpoint">
          <p>
            The generated server runs inside your application's process and calls your service
            methods against your application's data. v1 serves read-only capabilities. Writes are
            left out during discovery and are never generated into the manifest. v1 adds no
            authentication of its own.
          </p>
          <Callout title="Treat /sse like an unauthenticated admin console">
            <p>
              Bind it to localhost, or keep it behind your existing network controls, a VPN, or an
              authenticating reverse proxy you operate. Tibyaan's verification covers which method
              each tool is bound to. It doesn't authenticate callers or authorize actions, so
              access control is your responsibility.
            </p>
          </Callout>
          <p>
            <Link href="/docs/security/" className="link-arrow">
              Read the security page <Arrow />
            </Link>
          </p>
        </Step>
      </Steps>
    </DocPage>
  );
}
