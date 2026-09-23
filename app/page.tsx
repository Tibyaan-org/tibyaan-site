import fs from "node:fs";
import path from "node:path";
import type { ReactNode } from "react";
import Link from "next/link";
import { Section, Eyebrow, H2, Frame, CodeBlock, ExtLink, Arrow, IC } from "./_components/ui";
import { Highlight } from "./_components/Highlight";
import { CopyButton } from "./_components/CopyButton";
import { HeroShowcase } from "./_components/HeroShowcase";
import {
  RECORD,
  BENCHMARKS,
  BOUNDARIES,
  REQUIREMENTS,
  ERP_SURVEY,
  LINKS,
  META,
} from "./_content/claims";
import { SURVEY_PROVENANCE, HANDSHAKE_PROVENANCE } from "./_content/survey";
import {
  MCP_SNIPPET,
  MCP_PROVENANCE,
  OPENAPI_SNIPPET,
  OPENAPI_PROVENANCE,
} from "./_content/artifacts";
import { DOCS_FLAT } from "./_content/docs-nav";

// Verbatim tool output is read from text files at build time (this is a server
// component; static export runs it during `next build`) and rendered as escaped text
// nodes. No JS string literal, so no character in the output can break the page.
// See app/_content/generated/README.md for the regeneration contract.
function readGenerated(name: string) {
  return fs
    .readFileSync(path.join(process.cwd(), "app/_content/generated", name), "utf8")
    .replace(/\r\n/g, "\n")
    .replace(/\n+$/, "");
}
const SURVEY_TEXT = readGenerated("erp-survey.txt");
const HANDSHAKE_TEXT = readGenerated("mcp-handshake.txt");

// The one refusal the page talks about, lifted from the verbatim survey by its
// prefix, never retyped. If the survey file ever stops containing it the build fails.
const USER_REFUSAL = (() => {
  const line = SURVEY_TEXT.split("\n").find((l) => l.trimStart().startsWith("- User [AMBIGUOUS_BINDING]"));
  if (!line) throw new Error("erp-survey.txt no longer contains the User refusal the home page cites");
  return line.trimStart();
})();

const SCAN_COMMAND = `java -jar tibyan-cli-${META.cliVersionExample}-jar-with-dependencies.jar scan /path/to/your-app`;

/* ---------- small inline icons (1.75 stroke, 24 grid, per the brand identity) ---------- */
function Icon({ children }: { children: ReactNode }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}
const ICONS = {
  eye: (
    <Icon>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="2.8" />
    </Icon>
  ),
  lock: (
    <Icon>
      <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
    </Icon>
  ),
  pin: (
    <Icon>
      <path d="M12 21s6.5-5.6 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 15.4 12 21 12 21z" />
      <circle cx="12" cy="10.5" r="2.3" />
    </Icon>
  ),
  check: (
    <Icon>
      <path d="M12 3l7.5 3v5.5c0 4.6-3.2 8-7.5 9.5-4.3-1.5-7.5-4.9-7.5-9.5V6L12 3z" />
      <path d="M9 12l2.2 2.2 4-4.2" />
    </Icon>
  ),
  x: (
    <Icon>
      <path d="M6 6l12 12M18 6L6 18" />
    </Icon>
  ),
};

export default function Home() {
  return (
    <>
      {/* 1 HERO: the hook. Differentiator in the headline, real output in the first screen. */}
      <header className="relative overflow-hidden">
        <div className="hero-backdrop" aria-hidden="true" />
        <div className="container-x relative">
          <div className="flex flex-col items-center pb-14 pt-[clamp(56px,9vh,104px)] text-center">
            <ExtLink href={LINKS.changelog} className="chip mb-8">
              <span className="chip-tag">v{META.version}</span>
              <span>The attestation release is on Maven Central</span>
              <Arrow size={13} />
            </ExtLink>

            <h1
              className="display max-w-[21ch] text-[clamp(38px,6vw,76px)] text-fg"
            >
              Connect AI agents to the Spring backend{" "}
              <span className="accent-serif">you already run</span>
            </h1>

            <p
              className="mt-7 max-w-[60ch] text-[clamp(16.5px,1.5vw,19px)] leading-relaxed text-muted"
            >
              Tibyaan reads your Spring application's source and turns the read operations it can
              verify into MCP tools, served from inside your own app. Anything it can't verify is
              left out, and the scan output tells you why. Your code stays as it is.
            </p>

            <div
              className="mt-9 flex flex-wrap items-center justify-center gap-3"
            >
              <Link href="/docs/getting-started/" className="btn btn-primary">
                Get started
                <Arrow />
              </Link>
              <Link href="/docs/" className="btn btn-ghost">
                Read the docs
              </Link>
            </div>

            <div className="mt-6 w-full max-w-[740px]">
              <div className="cmdline" dir="ltr">
                <span aria-hidden="true" style={{ color: "var(--accent)" }}>
                  $
                </span>
                <span className="cmdline-text flex-1 text-left">{SCAN_COMMAND}</span>
                <CopyButton text={SCAN_COMMAND} />
              </div>
              <p className="mt-2.5 text-[12.5px] text-faint">
                The scan is read-only. It only needs Java 17 and writes nothing to your project.
              </p>
            </div>
          </div>

          {/* the three-step window: every panel is verbatim recorded output */}
          <div className="mx-auto max-w-[1020px] pb-16">
            <HeroShowcase
              tabs={[
                {
                  key: "scan",
                  label: "Scan your source",
                  title: SURVEY_PROVENANCE.command,
                  isCommand: true,
                  panel: (
                    <pre className="code code-scroll">
                      <code>
                        <Highlight text={SURVEY_TEXT} lang="survey" />
                      </code>
                    </pre>
                  ),
                  caption: (
                    <>
                      Unedited output of the ERP benchmark survey ({SURVEY_PROVENANCE.date}). Elisions
                      are marked in the text and only shorten the discovered lists. Every refusal is
                      shown in full. The per-entity ledger is{" "}
                      <ExtLink href={LINKS.erpLedger} className="prose-link">
                        public
                      </ExtLink>
                      .
                    </>
                  ),
                },
                {
                  key: "generate",
                  label: "Generate the manifest",
                  title: `tibyan/capabilities.json (two of the ${ERP_SURVEY.discovered} entries)`,
                  isCommand: false,
                  panel: (
                    <pre className="code code-scroll">
                      <code>
                        <Highlight text={MCP_SNIPPET} lang="json" />
                      </code>
                    </pre>
                  ),
                  caption: (
                    <>
                      From the MCP manifest generated for the same application.{" "}
                      {MCP_PROVENANCE.tool}, {MCP_PROVENANCE.date}. Each tool names the method it is
                      bound to.
                    </>
                  ),
                },
                {
                  key: "call",
                  label: "Call a tool from an agent",
                  title: HANDSHAKE_PROVENANCE.command,
                  isCommand: true,
                  panel: (
                    <pre className="code code-scroll">
                      <code>{HANDSHAKE_TEXT}</code>
                    </pre>
                  ),
                  caption: (
                    <>
                      Recorded {HANDSHAKE_PROVENANCE.date} with an out-of-process client calling the
                      in-repo example app over the network. The product in the response is the row
                      read by the app's service method. It doesn't come from a fixture.
                    </>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </header>

      {/* 2 THE RECORD + TRUST BAND */}
      <section style={{ borderTop: "1px solid var(--line)", background: "var(--bg-soft)" }}>
        <div className="container-x py-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[auto_1fr] lg:gap-16">
            <div className="flex items-end gap-8">
              {[
                { n: RECORD.verifiedTools, l: "verified tools" },
                { n: RECORD.applications, l: "benchmark applications" },
                { n: RECORD.wrongBindings, l: "wrong bindings", accent: true },
              ].map((s) => (
                <div key={s.l}>
                  <div
                    className="text-[44px] font-semibold leading-none"
                    style={{ letterSpacing: "-0.04em", color: s.accent ? "var(--accent)" : "var(--fg)" }}
                  >
                    {s.n}
                  </div>
                  <div className="label mt-2">{s.l}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
              {[
                { i: ICONS.eye, t: "Reads your source code and doesn't modify it." },
                { i: ICONS.lock, t: "Exposes read operations only. Writes are left out during discovery, so no tool is generated for them." },
                { i: ICONS.pin, t: "Leaves out anything it can't verify and reports the reason." },
                { i: ICONS.check, t: `Zero wrong bindings ${RECORD.scope}.` },
              ].map((x) => (
                <div key={x.t} className="flex items-start gap-3">
                  <span className="icon-tile" style={{ width: 32, height: 32 }}>
                    {x.i}
                  </span>
                  <span className="pt-1 text-[14px] leading-snug text-fg-soft">{x.t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3 THE PROBLEM */}
      <Section id="problem">
        <Eyebrow>The problem</Eyebrow>
        <H2>Connecting an agent to an existing backend is hard</H2>
        <p className="mt-5 max-w-[62ch] text-[16.5px] leading-relaxed text-muted">
          Most business software was built before AI agents existed. There are three common ways to
          put an agent in front of a system like that, and each has a serious drawback.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            {
              h: "Rewrite it",
              b: "You rebuild the system so it speaks a modern protocol. A rewrite is slow, expensive and risky, and most of the time it isn't needed.",
            },
            {
              h: "Hand-build every connection",
              b: "You write an integration by hand for each thing an agent might need. The work doesn't end, and each integration goes out of date when the system changes.",
            },
            {
              h: "Let the agent improvise",
              b: "You point an agent at the system directly. This is the dangerous option, because the agent can call the wrong operation based on a wrong assumption and you have no way to know it did.",
            },
          ].map((c) => (
            <div key={c.h} className="card p-7">
              <span className="icon-tile" style={{ color: "var(--muted)" }}>
                {ICONS.x}
              </span>
              <h3 className="mt-5 text-[18px] font-semibold">{c.h}</h3>
              <p className="mt-2.5 text-[14.5px] leading-relaxed text-muted">{c.b}</p>
            </div>
          ))}
        </div>
        <div
          className="mt-4 flex flex-col gap-5 rounded-[14px] p-7 md:flex-row md:items-center md:justify-between"
          style={{ border: "1px solid var(--accent-line)", background: "var(--accent-soft)" }}
        >
          <div className="flex items-start gap-4">
            <span className="icon-tile">{ICONS.check}</span>
            <div>
              <h3 className="text-[18px] font-semibold">What Tibyaan does instead</h3>
              <p className="mt-2 max-w-[68ch] text-[14.5px] leading-relaxed text-fg-soft">
                Your backend already has methods that look up a customer, an order or an invoice.
                Tibyaan reads the code your team maintains and exposes a read only when the code
                structure shows which method backs it and what it returns. The resulting set of tools
                covers part of your system, and each tool is bound to a method Tibyaan verified.
              </p>
            </div>
          </div>
          <Link href="/how-it-works/" className="link-arrow flex-none text-[14.5px]">
            How it works <Arrow />
          </Link>
        </div>
      </Section>

      {/* 4 HOW IT WORKS */}
      <Section id="how" tint>
        <Eyebrow>How it works</Eyebrow>
        <H2>From source code to MCP tools in four steps</H2>
        <div
          className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-[14px] sm:grid-cols-2 lg:grid-cols-4"
          style={{ background: "var(--line)", border: "1px solid var(--line)" }}
        >
          {[
            {
              n: "01",
              t: "Read",
              b: "Tibyaan parses your source and maps the entities and read operations it finds. Any file it can't parse is skipped and listed by name.",
            },
            {
              n: "02",
              t: "Verify",
              b: "Each candidate read needs evidence in the code structure: the method that backs it, on the repository of the entity it reads. Naming conventions aren't used as evidence.",
            },
            {
              n: "03",
              t: "Include or refuse",
              b: "A read that passes becomes a verified tool. A read Tibyaan can't verify is refused, and the scan output gives the reason. On a large app, expect most reads to be refused.",
            },
            {
              n: "04",
              t: "Serve",
              b: "Your build generates the manifest from your source, and a small runtime inside your app serves the tools to agents over MCP. The same model also produces an OpenAPI document.",
            },
          ].map((s) => (
            <div key={s.n} className="flex min-h-[220px] flex-col gap-3 p-7" style={{ background: "var(--surface)" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--accent)" }}>{s.n}</span>
              <h3 className="text-[18px] font-semibold">{s.t}</h3>
              <p className="m-0 text-[14px] leading-relaxed text-muted">{s.b}</p>
            </div>
          ))}
        </div>

        {/* adoption, physically: two entries in a build file */}
        <div className="mt-14 grid grid-cols-1 items-center gap-x-16 gap-y-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <h3 className="text-[24px] font-semibold leading-tight" style={{ letterSpacing: "-0.03em" }}>
              Add two entries to your build file
            </h3>
            <p className="mt-4 text-[15.5px] leading-relaxed text-muted">
              You add a runtime dependency and a build plugin. Your build generates the manifest
              from your source, and the MCP server runs inside your application's process and calls
              your existing methods. To remove Tibyaan, delete the two entries. Your source code
              isn't modified at any point.
            </p>
            <p className="mt-6">
              <Link href="/docs/getting-started/" className="link-arrow text-[15px]">
                Follow the quickstart <Arrow />
              </Link>
            </p>
          </div>
          <CodeBlock label="pom.xml" lang="xml" flat={false}>{`<dependency>
  <groupId>${META.groupId}</groupId>
  <artifactId>tibyan-runtime-spring</artifactId>
  <version>${META.version}</version>
</dependency>

<plugin>
  <groupId>${META.groupId}</groupId>
  <artifactId>tibyan-maven-plugin</artifactId>
  <version>${META.version}</version>
  <executions>
    <execution>
      <goals><goal>generate</goal></goals>
    </execution>
  </executions>
</plugin>`}</CodeBlock>
        </div>
      </Section>

      {/* 5 A REAL SURVEY: refusals are the product */}
      <Section id="survey">
        <div className="grid grid-cols-1 gap-x-16 gap-y-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <Eyebrow>An example survey</Eyebrow>
            <H2>What refused reads look like</H2>
            <p className="mt-6 text-[15.5px] leading-relaxed text-fg-soft">
              A survey is the output of a scan. For a large application, expect a verified subset of
              tools and a list that names each refused read, with the reason. On the ERP benchmark
              Tibyaan found{" "}
              <strong>{ERP_SURVEY.discovered}</strong> capabilities and refused{" "}
              <strong>{ERP_SURVEY.failed + ERP_SURVEY.listRefused}</strong> reads, each listed by
              name, with no wrong binding.
            </p>
            <p className="mt-4 text-[15.5px] leading-relaxed text-fg-soft">
              Take <IC>User</IC> as an example. Two methods both fit the shape of a read-by-id, so
              Tibyaan refused the read instead of picking one. Refusals like this are expected. The
              count to check is <IC>mis-bound</IC>, which is{" "}
              <span style={{ color: "var(--accent)" }}>0</span> here.
            </p>
            <p className="mt-7">
              <Link href="/docs/reading-your-survey/" className="link-arrow text-[15px]">
                Learn to read a survey <Arrow />
              </Link>
            </p>
          </div>
          <div className="min-w-0 self-center">
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[14px]" style={{ background: "var(--line)", border: "1px solid var(--line)" }}>
              {[
                { n: ERP_SURVEY.discovered, l: "discovered", c: "var(--ok)" },
                { n: ERP_SURVEY.failed, l: "refused, each named", c: "var(--fg)" },
                { n: ERP_SURVEY.listRefused, l: "list refused", c: "var(--fg)" },
                { n: ERP_SURVEY.misBound, l: "mis-bound", c: "var(--accent)" },
              ].map((s) => (
                <div key={s.l} className="p-6" style={{ background: "var(--surface)" }}>
                  <div className="text-[36px] font-semibold leading-none" style={{ letterSpacing: "-0.04em", color: s.c }}>
                    {s.n}
                  </div>
                  <div className="label mt-2.5">{s.l}</div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Frame
                barLabel="the User refusal, verbatim"
                flat
                caption={
                  <>
                    One line from the same unedited survey ({SURVEY_PROVENANCE.date}). The four
                    figures above come from its Totals line. The full output is in the first tab at
                    the top of this page.
                  </>
                }
              >
                <pre className="code" style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
                  <code>
                    <Highlight text={USER_REFUSAL} lang="survey" />
                  </code>
                </pre>
              </Frame>
            </div>
          </div>
        </div>
      </Section>

      {/* 6 WHAT IT GENERATES */}
      <Section id="output" tint>
        <Eyebrow>What it generates</Eyebrow>
        <H2>The generated files state their own limits</H2>
        <p className="mt-5 max-w-[68ch] text-[16px] leading-relaxed text-muted">
          One verified model produces an MCP server and an OpenAPI document. The description of a
          list read says that the total count and page envelope aren't modeled, and the schema of a
          partial entity names the fields it doesn't represent. Both snippets below are copied from files the tool
          generated.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2">
          <Frame
            barLabel="tibyan/capabilities.json"
            caption={
              <>
                From the generated MCP manifest. {MCP_PROVENANCE.tool}, {MCP_PROVENANCE.date}. The
                second description states what the tool doesn't model.
              </>
            }
          >
            <pre className="code">
              <code>
                <Highlight text={MCP_SNIPPET} lang="json" />
              </code>
            </pre>
          </Frame>
          <Frame
            barLabel="openapi.json"
            caption={
              <>
                From the generated OpenAPI 3.0 document. {OPENAPI_PROVENANCE.tool}, {OPENAPI_PROVENANCE.date}.
                The description lists the source fields that aren't represented.
              </>
            }
          >
            <pre className="code">
              <code>
                <Highlight text={OPENAPI_SNIPPET} lang="json" />
              </code>
            </pre>
          </Frame>
        </div>
      </Section>

      {/* 7 WHAT IT DOES NOT DO (placed high, per the credibility play) */}
      <Section id="boundary">
        <Eyebrow>Current limits</Eyebrow>
        <H2>What Tibyaan doesn't do yet</H2>
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          {BOUNDARIES.map((b) => (
            <div key={b.k} className="card p-7">
              <h3 className="font-normal" style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--accent)" }}>
                {b.k}
              </h3>
              <p className="mt-3 text-[14.5px] leading-relaxed text-fg-soft">{b.v}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-[74ch] text-[15px] leading-relaxed text-muted">
          For a read that Tibyaan can't verify from the code structure, you can use{" "}
          <Link href="/docs/attestation/" className="prose-link">
            attestation
          </Link>
          . A named person asserts what the read means in a file that is committed and reviewed.
          Tibyaan ships the claim word for word, labels it as human-attested everywhere it appears,
          and counts it separately from the verified tools. If the code the claim was
          written against changes, Tibyaan refuses the claim with an error.
        </p>
      </Section>

      {/* 8 THE EVIDENCE */}
      <Section id="evidence" tint>
        <Eyebrow>Evidence</Eyebrow>
        <H2>Results on {RECORD.applications} benchmark applications</H2>
        <div className="card mt-10 overflow-x-auto">
          <table className="doc-table min-w-[680px]">
            <thead>
              <tr>
                {["Application", "Entities", "Capabilities", "Wrong bindings"].map((h) => (
                  <th key={h} scope="col">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BENCHMARKS.map((b) => (
                <tr key={b.id}>
                  <td>
                    <div className="text-[14.5px] font-medium text-fg">{b.label}</div>
                    <div className="mt-1 text-[13px] text-muted">{b.note}</div>
                  </td>
                  <td style={{ fontFamily: "var(--font-mono)" }}>
                    {"modules" in b ? `${b.modules} modules / ${b.entities}` : b.entities}
                  </td>
                  <td style={{ fontFamily: "var(--font-mono)" }}>
                    {"byId" in b ? `${b.capabilities} (${b.byId} by-id, ${b.list} list)` : b.capabilities}
                  </td>
                  <td style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}>{b.misBound}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-8 max-w-[76ch] text-[15px] leading-relaxed text-fg-soft">
          Together the three benchmark applications produced {RECORD.verifiedTools} verified tools
          and {RECORD.wrongBindings} wrong bindings. Coverage depends on how an application is
          written. Two of the three apps share an author, each app's capabilities were discovered
          through different rules, and the number for your app could land anywhere in the range
          shown in the table. The result that carries over is zero wrong bindings on every run, on
          all three applications. The third row is a real multi-module enterprise Spring
          application, kept private and shown by counts and shapes only. Run a scan on your own app
          to see your number before you decide.
        </p>
        <p className="mt-6">
          <Link href="/evidence/" className="link-arrow text-[15px]">
            See the full results and ledgers <Arrow />
          </Link>
        </p>
      </Section>

      {/* 9 DOCS */}
      <Section id="docs">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>Documentation</Eyebrow>
            <H2>Guides for running Tibyaan on your own app</H2>
          </div>
          <Link href="/docs/" className="link-arrow text-[15px]">
            Browse all docs <Arrow />
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DOCS_FLAT.filter((d) =>
            [
              "/docs/getting-started/",
              "/docs/reading-your-survey/",
              "/docs/connecting/",
              "/docs/cli/",
              "/docs/attestation/",
              "/docs/security/",
            ].includes(d.href),
          ).map((d) => (
            <Link key={d.href} href={d.href} className="card block p-6 no-underline">
              <div className="flex items-center justify-between gap-3 text-[16px] font-semibold text-fg">
                {d.title}
                <span className="text-muted">
                  <Arrow />
                </span>
              </div>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">{d.blurb}</p>
            </Link>
          ))}
        </div>
      </Section>

      {/* 10 REQUIREMENTS */}
      <Section id="requirements" tint>
        <Eyebrow>Requirements</Eyebrow>
        <H2>v1 doesn't support every Spring backend</H2>
        <div className="card mt-10 overflow-hidden">
          {REQUIREMENTS.map((r, i) => (
            <div
              key={r.k}
              className="grid grid-cols-1 gap-x-6 gap-y-1 px-6 py-5 md:grid-cols-[minmax(170px,1fr)_3fr]"
              style={{ borderTop: i === 0 ? "none" : "1px solid var(--line)" }}
            >
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--muted)" }}>{r.k}</span>
              <span className="text-[15px] text-fg">{r.v}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* 11 CLOSING CTA */}
      <section className="relative overflow-hidden" style={{ borderTop: "1px solid var(--line)" }}>
        <div className="hero-backdrop" aria-hidden="true" />
        <div className="container-x relative py-[clamp(80px,12vh,136px)] text-center">
          <h2 className="display mx-auto max-w-[18ch] text-[clamp(34px,4.8vw,62px)]">
            Try it on <span className="accent-serif">your own application</span>
          </h2>
          <p className="mx-auto mt-7 max-w-[60ch] text-[17px] leading-relaxed text-muted">
            The scan reads your source, writes nothing and doesn't touch your build files. It shows
            which reads Tibyaan would expose and which it would refuse, so you can decide based on
            your own code. If you've already run it, email your survey to the maintainer. Surveys
            from users' applications help decide what gets built next.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link href="/docs/getting-started/" className="btn btn-primary">
              Get started
              <Arrow />
            </Link>
            <a href={LINKS.contact} className="btn btn-ghost">
              Email your survey
            </a>
            <ExtLink href={LINKS.github} className="btn btn-ghost">
              Read the source on GitHub
            </ExtLink>
          </div>
        </div>
      </section>
    </>
  );
}
