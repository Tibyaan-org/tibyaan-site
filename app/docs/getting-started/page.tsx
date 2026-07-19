import type { Metadata } from "next";
import Link from "next/link";
import { Section, Eyebrow, H2, Frame, ExtLink } from "../../_components/ui";
import { REFUSAL_CAUSES, REQUIREMENTS, LINKS, META } from "../../_content/claims";

export const metadata: Metadata = {
  title: "Get started",
  description:
    "The honest quickstart: check you are in range, preview read-only, read your survey, adopt with two build entries, connect an agent, and gate the endpoint.",
  alternates: { canonical: "/docs/getting-started/" },
};

function Code({ label, children, caption }: { label: string; children: string; caption?: string }) {
  return (
    <Frame barLabel={label} caption={caption}>
      <pre className="code">{children}</pre>
    </Frame>
  );
}

export default function GettingStarted() {
  return (
    <>
      <header className="mx-auto max-w-[1160px] px-6 md:px-8">
        <div className="py-[clamp(56px,9vh,96px)]" style={{ borderBottom: "1px solid var(--color-border)" }}>
          <Eyebrow>Get started</Eyebrow>
          <h1 className="m-0 max-w-[20ch] font-serif text-[clamp(38px,5.4vw,72px)] font-medium leading-[1.04]" style={{ letterSpacing: "-0.02em" }}>
            Preview first. It changes nothing.
          </h1>
          <p className="mt-7 max-w-[62ch] text-[18px] leading-relaxed text-muted">
            Check you are in range, preview read-only, read your survey, then adopt only if it
            convinced you. Adoption is a dependency and a build step, not a rewrite.
          </p>
        </div>
      </header>

      {/* station 0 */}
      <Section id="range">
        <Eyebrow n="01">Are you in range?</Eyebrow>
        <H2>The gate comes first, before you invest anything.</H2>
        <div className="mt-8" style={{ borderTop: "1px solid var(--color-border)" }}>
          {REQUIREMENTS.map((r) => (
            <div
              key={r.k}
              className="grid grid-cols-1 gap-x-6 gap-y-1 py-5 md:grid-cols-[minmax(160px,1fr)_3fr]"
              style={{ borderBottom: "1px solid var(--color-border)" }}
            >
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--color-muted)" }}>{r.k}</span>
              <span className="text-[15px] text-ink">{r.v}</span>
            </div>
          ))}
        </div>
        <p className="mt-6 max-w-[72ch] text-[15px] leading-relaxed text-muted">
          A Spring Boot 2.x or Java 8 backend cannot host the runtime as-is, and we would rather tell
          you now than after you have edited your pom. The preview below, however, reads any Java
          source tree and needs only Java 17.
        </p>
      </Section>

      {/* station 1 */}
      <Section id="preview" tint>
        <Eyebrow n="02">Preview, read-only, zero risk</Eyebrow>
        <H2>Survey your application. It reads source and writes nothing.</H2>
        <p className="mt-6 max-w-[72ch] text-[16px] leading-relaxed text-body">
          Download the self-contained CLI from Maven Central and point it at your application. This
          only reads source: it never writes to your project, never touches your build, and cannot
          break anything.
        </p>
        <div className="mt-8 max-w-[860px]">
          <Code
            label="shell"
            caption={`The CLI jar is published on Maven Central (${META.groupId}, v${META.cliVersionExample}).`}
          >{`# Download the CLI jar from Maven Central (once):
curl -O ${LINKS.cliJar}

# Survey your application. This only reads source; it writes nothing:
java -jar tibyan-cli-${META.cliVersionExample}-jar-with-dependencies.jar scan /path/to/your-app`}</Code>
        </div>
        <p className="mt-6 max-w-[72ch] text-[15px] leading-relaxed text-muted">
          It prints the discovered capabilities, every refusal with its located reason, and the
          totals including <span style={{ fontFamily: "var(--font-mono)" }}>mis-bound 0</span>. If the
          preview discovers nothing useful for your app, stop here: you have spent no build changes to
          learn it. You can also produce an OpenAPI 3.0 document from the same read-only model.
        </p>
        <details className="mt-6 max-w-[72ch]">
          <summary className="cursor-pointer text-[15px] font-medium text-ink">Prefer to build the CLI from source?</summary>
          <div className="mt-4">
            <Code label="shell">{`# From a checkout of the v${META.cliVersionExample} tag (a main checkout builds a -SNAPSHOT jar):
mvn -pl tibyan-cli -am -DskipTests package
java -jar tibyan-cli/target/tibyan-cli-${META.cliVersionExample}-jar-with-dependencies.jar scan /path/to/your-app`}</Code>
          </div>
        </details>
      </Section>

      {/* station 2 */}
      <Section id="survey">
        <Eyebrow n="03">Read your survey</Eyebrow>
        <H2>Refusals are normal, and good. The number to watch is mis-bound.</H2>
        <p className="mt-6 max-w-[72ch] text-[16px] leading-relaxed text-body">
          A real, layered application turns into a precise verified subset plus a named ledger of
          refusals. That is the tool working, not failing. What each refusal means:
        </p>
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {REFUSAL_CAUSES.map((c) => (
            <div key={c.code} className="card p-6">
              <h3 className="mb-2 mt-0 font-normal" style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--color-sienna)" }}>
                {c.code}
              </h3>
              <p className="m-0 text-[14.5px] leading-relaxed text-body">{c.plain}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-[72ch] text-[15px] leading-relaxed text-muted">
          Add <span style={{ fontFamily: "var(--font-mono)" }}>--report survey.md</span> to write the
          same survey as a shareable Markdown map. The one number that must stay 0 is{" "}
          <span style={{ fontFamily: "var(--font-mono)" }}>mis-bound</span>.
        </p>
      </Section>

      {/* station 3 */}
      <Section id="adopt" tint>
        <Eyebrow n="04">Adopt</Eyebrow>
        <H2>Two entries in your build file, then build.</H2>
        <p className="mt-6 max-w-[72ch] text-[16px] leading-relaxed text-body">
          Once the preview convinces you, add the runtime dependency, which hosts the MCP server
          inside your app's own context, and the build plugin, which generates the manifest from your
          source at build time.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Code label="pom.xml (dependency)">{`<dependency>
  <groupId>io.github.tibyaan-org</groupId>
  <artifactId>tibyan-runtime-spring</artifactId>
  <version>${META.version}</version>
</dependency>`}</Code>
          <Code label="pom.xml (build plugin)">{`<plugin>
  <groupId>io.github.tibyaan-org</groupId>
  <artifactId>tibyan-maven-plugin</artifactId>
  <version>${META.version}</version>
  <executions>
    <execution>
      <goals><goal>generate</goal></goals>
    </execution>
  </executions>
</plugin>`}</Code>
        </div>
        <p className="mt-8 max-w-[72ch] text-[15px] leading-relaxed text-muted">
          The plugin is resilient by default: an unparseable source file is skipped and named at
          WARN, not fatal, so adopting Tibyaan does not break your build. Set{" "}
          <span style={{ fontFamily: "var(--font-mono)" }}>-Dtibyan.strict=true</span> to fail on any
          unparseable file for CI. Then build, and the plugin writes the manifest onto the classpath:
        </p>
        <div className="mt-6 max-w-[860px]">
          <Code label="shell">{`mvn package
java -jar target/your-app.jar`}</Code>
        </div>
      </Section>

      {/* station 4 */}
      <Section id="connect">
        <Eyebrow n="05">Connect an agent</Eyebrow>
        <H2>Your discovered tools appear over MCP, calling your real methods.</H2>
        <p className="mt-6 max-w-[72ch] text-[16px] leading-relaxed text-body">
          The runtime finds the manifest on the classpath automatically: no launch property, no MCP
          block in <span style={{ fontFamily: "var(--font-mono)" }}>application.yml</span>. The MCP
          server is served at <span style={{ fontFamily: "var(--font-mono)" }}>http://localhost:8080/sse</span>.
          Point any client that speaks the HTTP and SSE transport at it; a stdio-only client such as
          Claude Desktop connects through a bridge.
        </p>
        <div className="mt-8 max-w-[860px]">
          <Code
            label="shell (smoke test)"
            caption="Verified end to end: an out-of-process client completes initialize, tools/list, and a real tools/call over the network against the example app."
          >{`curl -N http://localhost:8080/sse`}</Code>
        </div>
        <p className="mt-6 max-w-[72ch] text-[15px] leading-relaxed text-muted">
          For the exact handshake, a scripted check, and the Claude Desktop bridge config, see{" "}
          <ExtLink href={LINKS.connecting} className="underline">
            Connecting an MCP client
          </ExtLink>
          .
        </p>
      </Section>

      {/* station 5 */}
      <Section id="security" tint>
        <Eyebrow n="06">Before you expose anything</Eyebrow>
        <H2>The endpoint runs real methods against real data. Gate it.</H2>
        <div className="mt-6 max-w-[74ch] space-y-5 text-[16px] leading-relaxed text-body-strong">
          <p>
            The generated server runs inside your application's process and calls your real service
            methods against your real data. v1 serves read-only capabilities: writes are refused at
            the discovery level, never generated into the manifest. But v1 adds no authentication of
            its own.
          </p>
          <p>
            That makes network exposure your decision, and the most important one. Treat the endpoint
            like an unauthenticated admin console: bind it to localhost, or keep it behind your
            existing network controls, a VPN, or an authenticating reverse proxy you operate. The
            fail-loud discipline guarantees each tool is bound to the method that backs it; it does
            not authenticate callers or authorize actions. That decision is yours.
          </p>
        </div>
        <p className="mt-8">
          <Link href="/docs/security/" className="btn-primary text-[15px]">
            Read the security posture in full
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="var(--color-limestone)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </p>
        <p className="mt-8 max-w-[72ch] text-[14px] leading-relaxed text-muted">
          The deep documentation, the seventeen design volumes and the dated benchmark ledgers, lives
          in the{" "}
          <ExtLink href={LINKS.docs} className="underline">
            repository
          </ExtLink>
          .
        </p>
      </Section>
    </>
  );
}
