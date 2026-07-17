import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { Section, Eyebrow, H2, Frame } from "./_components/ui";
import { RECORD, BENCHMARKS, BOUNDARIES, REQUIREMENTS, LINKS, META } from "./_content/claims";
import { SURVEY_PROVENANCE } from "./_content/survey";
import {
  MCP_SNIPPET,
  MCP_PROVENANCE,
  OPENAPI_SNIPPET,
  OPENAPI_PROVENANCE,
} from "./_content/artifacts";

// The verbatim survey excerpt is read from a text file at build time (this is a
// server component; static export runs it during `next build`) and rendered as an
// escaped text node. No JS string literal, so no character in the output can break
// the page. See app/_content/generated/README.md for the regeneration contract.
const SURVEY_TEXT = fs
  .readFileSync(path.join(process.cwd(), "app/_content/generated/erp-survey.txt"), "utf8")
  .replace(/\n+$/, "");

// Presentation-only line colouriser: colours a monospace block by each line's
// leading glyph. It never changes a character of the text.
function Coded({ text }: { text: string }) {
  return (
    <pre className="code">
      {text.split("\n").map((line, i) => {
        const t = line.trimStart();
        let color = "var(--color-code-fg)";
        if (t.startsWith("+")) color = "var(--color-success)";
        else if (t.startsWith("-")) color = "var(--color-sienna-soft)";
        else if (t.startsWith("~") || t.startsWith("*") || t.startsWith("...")) color = "var(--color-comment)";
        else if (t.startsWith("Totals:") || t.startsWith("List-refused") || t.startsWith("Failed") || t.startsWith("Discovered"))
          color = "var(--color-ink-muted)";
        return (
          <span key={i} style={{ color }}>
            {line + "\n"}
          </span>
        );
      })}
    </pre>
  );
}

export default function Home() {
  return (
    <>
      {/* 1 HERO */}
      <header className="mx-auto max-w-[1160px] px-6 md:px-8">
        <div className="flex flex-col items-center py-[clamp(56px,10vh,104px)] text-center">
          <div className="chip fade-up mb-8">
            <span className="label" style={{ textTransform: "none", letterSpacing: "0.04em" }}>
              Open source · {META.license} · Maven Central
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                color: "var(--color-sienna)",
              }}
            >
              v{META.version}
            </span>
          </div>

          <h1
            className="fade-up m-0 max-w-[16ch] font-serif text-[clamp(42px,7vw,84px)] font-medium leading-[1.0]"
            style={{ letterSpacing: "-0.025em", animationDelay: "0.06s" }}
          >
            AI agents for the backend you already run.{" "}
            <span style={{ color: "var(--color-sienna)" }}>Every tool proven, or refused.</span>
          </h1>

          <p
            className="fade-up mt-7 max-w-[62ch] text-[19px] leading-relaxed text-muted"
            style={{ animationDelay: "0.14s" }}
          >
            Tibyaan reads your Spring application's source and exposes only the operations it can
            prove: which real method backs each tool, on which entity, returning what. Everything it
            cannot prove, it refuses, with the reason and the file. Zero wrong bindings, on every
            run, on every application it has been measured on.
          </p>

          {/* static metric row, real numbers, no animation of the figures */}
          <div
            className="fade-up mt-9 flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.9rem",
              color: "var(--color-ink)",
              animationDelay: "0.2s",
            }}
          >
            <span>
              <strong style={{ fontWeight: 600 }}>{RECORD.verifiedTools}</strong> verified tools
            </span>
            <span style={{ color: "var(--color-hairline)" }}>·</span>
            <span>
              <strong style={{ fontWeight: 600 }}>{RECORD.applications}</strong> real applications
            </span>
            <span style={{ color: "var(--color-hairline)" }}>·</span>
            <span style={{ color: "var(--color-sienna)" }}>
              <strong style={{ fontWeight: 600 }}>{RECORD.wrongBindings}</strong> wrong bindings
            </span>
          </div>

          <div
            className="fade-up mt-9 flex flex-wrap items-center justify-center gap-4"
            style={{ animationDelay: "0.28s" }}
          >
            <Link href="/docs/getting-started/" className="btn-primary text-[15.5px]">
              Preview your app
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="var(--color-limestone)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <a href="#survey" className="btn-secondary text-[15.5px]">
              See a real survey
            </a>
          </div>
        </div>
      </header>

      {/* 2 TRUST BAND */}
      <section style={{ borderTop: "1px solid var(--color-border)", background: "var(--color-surface)" }}>
        <div className="mx-auto grid max-w-[1160px] grid-cols-1 gap-4 px-6 py-9 sm:grid-cols-2 md:px-8 lg:grid-cols-4">
          {[
            "Reads your source. Never modifies it.",
            "Read-only by design: writes are refused at discovery, not just disabled.",
            "Everything it cannot prove is refused with a located reason.",
            "Zero wrong bindings across every run on three real applications.",
          ].map((t) => (
            <div key={t} className="flex items-start gap-3">
              <span style={{ fontFamily: "var(--font-mono)", color: "var(--color-sienna)" }} aria-hidden="true">
                {"->"}
              </span>
              <span className="text-[13.5px] leading-snug text-[#4a443a]">{t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3 THE PROBLEM */}
      <Section id="problem">
        <Eyebrow n="01">The problem</Eyebrow>
        <H2>The software that runs the business predates the agent era.</H2>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              h: "Rewrite it",
              b: "Rebuild the system so it speaks a modern protocol. Expensive, slow, risky, and most of the time unnecessary.",
            },
            {
              h: "Hand-build every connection",
              b: "Wire up each thing an agent might need, by hand. The work never ends, and it falls out of date the moment the system changes.",
            },
            {
              h: "Let the agent improvise",
              b: "Point an agent at the system directly. The dangerous one: it can call the wrong thing and act on a wrong assumption, and nobody can be sure what it will do.",
            },
          ].map((c) => (
            <div key={c.h} className="card p-8">
              <h3 className="m-0 font-serif text-[21px] font-medium">{c.h}</h3>
              <p className="mt-3 text-[14.5px] leading-relaxed text-muted">{c.b}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 max-w-[70ch] text-[17px] leading-relaxed text-[#4a443a]">
          So the value stays locked in, and the bridge to modern AI stays missing. Tibyaan is a
          fourth option.
        </p>
      </Section>

      {/* 4 THE IDEA */}
      <Section id="idea" tint>
        <Eyebrow n="02">The idea</Eyebrow>
        <div className="grid grid-cols-1 gap-x-16 gap-y-8 md:grid-cols-[0.9fr_1.1fr]">
          <h2 className="font-serif text-[clamp(30px,3.4vw,44px)] font-medium leading-[1.06]">
            It never guesses.
          </h2>
          <div className="max-w-[62ch] space-y-5 text-[16.5px] leading-relaxed text-[#3a352d]">
            <p>
              Your backend already knows how to look up a customer, an order, an invoice. That
              knowledge is real, tested, and locked inside a system that predates AI agents.
            </p>
            <p>
              Tibyaan reads that system's source code, the same files your team maintains, and works
              out which of its read operations it can prove safe to hand to an AI agent. Proof here
              is literal: an operation is exposed only when the code's own structure shows exactly
              which real method backs it and exactly what that method returns. Where the structure
              leaves any doubt, Tibyaan refuses, out loud, with the reason and the file.
            </p>
            <p>
              What survives becomes a set of tools that AI agents already know how to call, served
              from inside your own application, hitting your real logic and your real data. Your code
              is never modified. The set is smaller than your system, and every entry in it is right.
            </p>
          </div>
        </div>
      </Section>

      {/* 5 A REAL SURVEY */}
      <Section id="survey">
        <Eyebrow n="03">A real survey</Eyebrow>
        <div className="grid grid-cols-1 gap-x-16 gap-y-10 lg:grid-cols-[1.15fr_0.85fr]">
          <Frame
            barLabel="tibyan scan examples/erp-backend"
            caption={
              <>
                Unedited output of the ERP benchmark survey ({SURVEY_PROVENANCE.date}), generated by{" "}
                {SURVEY_PROVENANCE.tool}. Elisions are marked in the text and only shorten the
                discovered lists; every refusal is shown in full. The full per-entity ledger is{" "}
                <a href={LINKS.erpLedger} target="_blank" rel="noopener noreferrer" className="underline">
                  public
                </a>
                .
              </>
            }
          >
            <pre className="code">
              <code>{SURVEY_TEXT}</code>
            </pre>
          </Frame>
          <div className="space-y-6 self-center">
            <H2>Refusals are the product working, not failing.</H2>
            <p className="text-[15.5px] leading-relaxed text-[#4a443a]">
              A large application does not turn into a hundred tools. It turns into a precise,
              verified subset plus a named ledger of everything Tibyaan declined to expose. Here it
              found <strong>25</strong> capabilities and named all <strong>9</strong> refusals, with
              no wrong binding.
            </p>
            <p className="text-[15.5px] leading-relaxed text-[#4a443a]">
              Look at <span style={{ fontFamily: "var(--font-mono)" }}>User</span>: two methods both
              fit the shape of a read-by-id, so Tibyaan refused rather than pick one. That refusal is
              the whole point. The number to watch is{" "}
              <span style={{ fontFamily: "var(--font-mono)" }}>mis-bound</span>, and it stays{" "}
              <span style={{ fontFamily: "var(--font-mono)", color: "var(--color-sienna)" }}>0</span>.
            </p>
          </div>
        </div>
      </Section>

      {/* 6 WHAT IT GENERATES */}
      <Section id="output" tint>
        <Eyebrow n="04">What it generates</Eyebrow>
        <H2>The honesty is legible in the output itself.</H2>
        <p className="mt-5 max-w-[70ch] text-[16px] leading-relaxed text-[#4a443a]">
          One verified model produces an MCP server and an OpenAPI document. The tool writes its own
          limits into what it generates: a list read says the page envelope is not modeled, a partial
          entity's schema names the fields it did not represent. Nothing here is retyped; both
          snippets are copied from files the current build really generated.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-x-16 gap-y-10 lg:grid-cols-2">
          <Frame
            barLabel="tibyan/capabilities.json"
            caption={
              <>
                From the real MCP manifest. {MCP_PROVENANCE.tool}, {MCP_PROVENANCE.date}. The
                second description is the tool disclosing what it does not model.
              </>
            }
          >
            <Coded text={MCP_SNIPPET} />
          </Frame>
          <Frame
            barLabel="openapi.json"
            caption={
              <>
                From the real OpenAPI 3.0 document. {OPENAPI_PROVENANCE.tool}, {OPENAPI_PROVENANCE.date}.
                The description states, in the artifact, exactly which source fields are not represented.
              </>
            }
          >
            <Coded text={OPENAPI_SNIPPET} />
          </Frame>
        </div>
      </Section>

      {/* 7 WHAT IT DOES NOT DO (placed high, per the credibility play) */}
      <Section id="boundary">
        <Eyebrow n="05">What it does not do yet</Eyebrow>
        <H2>Every one of these is a deliberate refusal-over-guessing boundary, not an oversight.</H2>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {BOUNDARIES.map((b) => (
            <div key={b.k} className="card p-7">
              <div
                className="mb-3"
                style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--color-sienna)" }}
              >
                {b.k}
              </div>
              <p className="m-0 text-[14.5px] leading-relaxed text-[#4a443a]">{b.v}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-[74ch] text-[15px] leading-relaxed text-muted">
          The path beyond this boundary is designed and waiting: explicitly human-attested
          capabilities, labeled as such, never guesses. It gets built when real adopters hit the
          boundary, not before.
        </p>
      </Section>

      {/* 8 THE EVIDENCE */}
      <Section id="evidence" tint>
        <Eyebrow n="06">The evidence</Eyebrow>
        <H2>{RECORD.verifiedTools} verified tools. {RECORD.wrongBindings} wrong bindings.</H2>
        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                {["Application", "Entities", "Capabilities", "Wrong bindings"].map((h) => (
                  <th key={h} className="label py-3 pr-6 font-normal" style={{ textTransform: "none" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BENCHMARKS.map((b) => (
                <tr key={b.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <td className="py-4 pr-6 align-top">
                    <div className="text-[15px] font-medium text-ink">{b.label}</div>
                    <div className="mt-1 text-[13px] text-muted">{b.note}</div>
                  </td>
                  <td className="py-4 pr-6 align-top text-[15px]" style={{ fontFamily: "var(--font-mono)" }}>
                    {"modules" in b ? `${b.modules} modules / ${b.entities}` : b.entities}
                  </td>
                  <td className="py-4 pr-6 align-top text-[15px]" style={{ fontFamily: "var(--font-mono)" }}>
                    {"byId" in b ? `${b.capabilities} (${b.byId} by-id, ${b.list} list)` : b.capabilities}
                  </td>
                  <td
                    className="py-4 pr-6 align-top text-[15px]"
                    style={{ fontFamily: "var(--font-mono)", color: "var(--color-sienna)" }}
                  >
                    {b.misBound}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-8 max-w-[76ch] text-[15px] leading-relaxed text-[#4a443a]">
          Read these numbers honestly. Coverage is idiom-bound: two of the three apps share an
          author, the apps discover through different rules, and your app's number depends on your
          idioms. It could land anywhere in that range. The one guarantee that transfers is zero
          wrong bindings. The third row is a real multi-module enterprise application, kept private
          and shown by counts and shapes only. Preview your own app to see your real number before
          you decide.
        </p>
      </Section>

      {/* 9 HOW IT WORKS */}
      <Section id="how">
        <Eyebrow n="07">How it works</Eyebrow>
        <H2>Read, prove, refuse or emit, serve.</H2>
        <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-xl sm:grid-cols-2 lg:grid-cols-4" style={{ background: "var(--color-border)", border: "1px solid var(--color-border)" }}>
          {[
            {
              n: "01",
              t: "Read",
              b: "Parses your source and maps the entities and read operations it finds. Files it cannot parse are skipped and named, never silently dropped.",
            },
            {
              n: "02",
              t: "Prove",
              b: "Each candidate needs structural evidence: the real method that backs it, on the real repository of the real entity. Names carry no weight.",
            },
            {
              n: "03",
              t: "Refuse or emit",
              b: "Undecidable cases are refused with a located reason. Decided cases become verified tools. On a large app, expect most to be refused.",
            },
            {
              n: "04",
              t: "Serve",
              b: "Your own build generates the manifest from your source. A small runtime inside your app serves the tools over MCP and as OpenAPI.",
            },
          ].map((s) => (
            <div key={s.n} className="flex min-h-[210px] flex-col gap-3.5 p-7" style={{ background: "var(--color-surface)" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--color-sienna)" }}>
                {s.n}
              </span>
              <h3 className="m-0 text-[19px] font-semibold">{s.t}</h3>
              <p className="m-0 text-[14px] leading-relaxed text-muted">{s.b}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-[15px] text-muted">
          <Link href="/how-it-works/" className="btn-secondary text-[15px]">
            The idea in full, and where the proof stops
          </Link>
        </p>
      </Section>

      {/* 10 REQUIREMENTS */}
      <Section id="requirements" tint>
        <Eyebrow n="08">Before you plan an adoption</Eyebrow>
        <H2>v1 does not fit every aging Spring backend. Here is the honest gate.</H2>
        <div className="mt-8" style={{ borderTop: "1px solid var(--color-border)" }}>
          {REQUIREMENTS.map((r) => (
            <div
              key={r.k}
              className="grid grid-cols-1 gap-x-6 gap-y-1 py-5 md:grid-cols-[minmax(160px,1fr)_3fr]"
              style={{ borderBottom: "1px solid var(--color-border)" }}
            >
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--color-muted)" }}>
                {r.k}
              </span>
              <span className="text-[15px] text-ink">{r.v}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* 11 CLOSING CTA */}
      <section style={{ borderTop: "1px solid var(--color-border)", background: "var(--color-ink)", color: "var(--color-limestone)" }}>
        <div className="mx-auto max-w-[1160px] px-6 py-[clamp(72px,11vh,120px)] md:px-8">
          <div className="mb-7 flex items-center gap-3">
            <span className="label" style={{ color: "var(--color-ink-faint)" }}>
              Start here
            </span>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--color-sienna-soft)" }} />
          </div>
          <h2 className="m-0 max-w-[18ch] font-serif text-[clamp(32px,4.4vw,60px)] font-medium leading-[1.04]">
            Preview your app. It reads your source and changes nothing.
          </h2>
          <p className="mt-7 max-w-[60ch] text-[17px] leading-relaxed" style={{ color: "var(--color-ink-muted)" }}>
            The preview is read-only: it writes nothing, touches no build file, and cannot break
            anything. It shows you exactly what Tibyaan would expose and what it would refuse, so you
            decide with the evidence in front of you. Ran it already? Send us your numbers: every
            real survey shapes what gets built next.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/docs/getting-started/"
              className="btn-primary text-[15.5px]"
              style={{ background: "var(--color-limestone)", color: "var(--color-ink)" }}
            >
              Get started
            </Link>
            <a
              href={LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[15.5px]"
              style={{ color: "var(--color-limestone)", borderBottom: "1.5px solid var(--color-ink-faint)", paddingBottom: 3, textDecoration: "none" }}
            >
              Read the source on GitHub
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
