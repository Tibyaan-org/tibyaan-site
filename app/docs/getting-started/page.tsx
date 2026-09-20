import type { Metadata } from "next";
import Link from "next/link";
import { DocPage, Steps, Step, Callout, DocTable } from "../../_components/docs/doc";
import { CodeBlock, IC, Arrow } from "../../_components/ui";
import { REQUIREMENTS, LINKS, META } from "../../_content/claims";

export const metadata: Metadata = {
  title: "Quickstart",
  description:
    "The honest quickstart: check you are in range, preview read-only, read your survey, adopt with two build entries, connect an agent, and gate the endpoint.",
  alternates: { canonical: "/docs/getting-started/" },
};

const JAR = `tibyan-cli-${META.cliVersionExample}-jar-with-dependencies.jar`;

export default function GettingStarted() {
  return (
    <DocPage
      href="/docs/getting-started/"
      title="Quickstart"
      lead="Preview first. It changes nothing. Check you are in range, survey your app read-only, read the result, and adopt only if it convinced you. Adoption is a dependency and a build step, not a rewrite."
      toc={[
        { id: "range", label: "1. Are you in range?" },
        { id: "preview", label: "2. Preview, read-only" },
        { id: "survey", label: "3. Read your survey" },
        { id: "adopt", label: "4. Adopt" },
        { id: "connect", label: "5. Connect an agent" },
        { id: "security", label: "6. Before you expose anything" },
      ]}
    >
      <Steps>
        <Step n={1} id="range" title="Are you in range?">
          <p>The gate comes first, before you invest anything.</p>
          <DocTable head={["Requirement", "Detail"]} rows={REQUIREMENTS.map((r) => [<strong key={r.k}>{r.k}</strong>, r.v])} />
          <p>
            A Spring Boot 2.x or Java 8 backend cannot host the runtime as-is, and we would rather
            tell you now than after you have edited your pom. The preview below, however, reads any
            Java source tree and needs only Java 17.
          </p>
        </Step>

        <Step n={2} id="preview" title="Preview, read-only, zero risk">
          <p>
            Download the self-contained CLI from Maven Central and point it at your application.
            This only reads source: it never writes to your project, never touches your build, and
            cannot break anything.
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
            It prints the discovered capabilities, every refusal with its located reason, and the
            totals including <IC>mis-bound 0</IC>. If the preview discovers nothing useful for your
            app, stop here: you have spent no build changes to learn it.
          </p>
          <Callout title="Multi-module application?">
            <p>
              Point the scan at the reactor root, not at one module. Discovery resolves against
              exactly the files you scan. See{" "}
              <Link href="/docs/multi-module/" className="prose-link">
                Multi-module applications
              </Link>
              .
            </p>
          </Callout>
          <details className="mt-5">
            <summary className="cursor-pointer text-[14.5px] font-medium text-fg">
              Prefer to build the CLI from source?
            </summary>
            <CodeBlock label="shell" lang="shell">{`# From a checkout of the v${META.cliVersionExample} tag (a main checkout builds a -SNAPSHOT jar):
mvn -pl tibyan-cli -am -DskipTests package
java -jar tibyan-cli/target/${JAR} scan /path/to/your-app`}</CodeBlock>
          </details>
        </Step>

        <Step n={3} id="survey" title="Read your survey">
          <p>
            A real, layered application turns into a precise verified subset plus a named ledger of
            refusals. That is the tool working, not failing. The one number that must stay 0 is{" "}
            <IC>mis-bound</IC>.
          </p>
          <CodeBlock label="shell" lang="shell">{`# The same survey as a shareable Markdown report:
java -jar ${JAR} scan /path/to/your-app --report survey.md`}</CodeBlock>
          <p>
            <Link href="/docs/reading-your-survey/" className="link-arrow">
              What every line and refusal cause means <Arrow />
            </Link>
          </p>
        </Step>

        <Step n={4} id="adopt" title="Adopt: two entries in your build file">
          <p>
            Once the preview convinces you, add the runtime dependency, which hosts the MCP server
            inside your app's own context:
          </p>
          <CodeBlock label="pom.xml (dependency)" lang="xml">{`<dependency>
  <groupId>${META.groupId}</groupId>
  <artifactId>tibyan-runtime-spring</artifactId>
  <version>${META.version}</version>
</dependency>`}</CodeBlock>
          <p>
            Then the build plugin, which generates the manifest from your source at build time and
            places it on the classpath, so nothing is committed by hand:
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
            Build, and the plugin writes <IC wrap>target/classes/tibyan/capabilities.json</IC>:
          </p>
          <CodeBlock label="shell" lang="shell">{`mvn package
java -jar target/your-app.jar`}</CodeBlock>
          <p>
            The plugin is resilient by default: an unparseable source file is skipped and named at
            WARN, not fatal, so adopting Tibyaan does not break your build. Set{" "}
            <IC>-Dtibyan.strict=true</IC> to fail on any unparseable file, for CI. Details are in
            the{" "}
            <Link href="/docs/maven-plugin/" className="prose-link">
              Maven plugin reference
            </Link>
            .
          </p>
        </Step>

        <Step n={5} id="connect" title="Connect an agent">
          <p>
            The runtime finds the manifest on the classpath automatically: no launch property, no
            MCP block in <IC>application.yml</IC>. The MCP server is served at{" "}
            <IC>http://localhost:8080/sse</IC>. Smoke-test it, then register it with your client:
          </p>
          <CodeBlock
            label="shell"
            lang="shell"
            caption="Verified end to end: an out-of-process client completes initialize, tools/list, and a real tools/call over the network against the example app."
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

        <Step n={6} id="security" title="Before you expose anything">
          <p>
            The generated server runs inside your application's process and calls your real service
            methods against your real data. v1 serves read-only capabilities: writes are refused at
            the discovery level, never generated into the manifest. But v1 adds no authentication
            of its own.
          </p>
          <Callout title="Treat /sse like an unauthenticated admin console">
            <p>
              Bind it to localhost, or keep it behind your existing network controls, a VPN, or an
              authenticating reverse proxy you operate. The fail-loud discipline guarantees each
              tool is bound to the method that backs it; it does not authenticate callers or
              authorize actions. That decision is yours.
            </p>
          </Callout>
          <p>
            <Link href="/docs/security/" className="link-arrow">
              Read the security posture in full <Arrow />
            </Link>
          </p>
        </Step>
      </Steps>
    </DocPage>
  );
}
