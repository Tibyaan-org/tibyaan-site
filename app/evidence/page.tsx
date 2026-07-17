import type { Metadata } from "next";
import Link from "next/link";
import { Section, Eyebrow, H2, Lead, ExtLink } from "../_components/ui";
import { RECORD, BENCHMARKS, LINKS } from "../_content/claims";

export const metadata: Metadata = {
  title: "Evidence",
  description:
    "The measured record: 31 verified tools across three real applications, zero wrong bindings on every run. Every number links to the dated experiment ledger that produced it.",
  alternates: { canonical: "/evidence/" },
};

// The public ledger for each benchmark. The private enterprise benchmark has none by rule.
const LEDGER: Record<string, string | null> = {
  erp: LINKS.erpLedger,
  pms: LINKS.pmsLedger,
  enterprise: null,
};

export default function Evidence() {
  return (
    <>
      <header className="mx-auto max-w-[1160px] px-6 md:px-8">
        <div className="py-[clamp(56px,9vh,96px)]" style={{ borderBottom: "1px solid var(--color-border)" }}>
          <Eyebrow>Evidence</Eyebrow>
          <h1
            className="m-0 max-w-[20ch] font-serif text-[clamp(38px,5.4vw,72px)] font-medium leading-[1.04]"
            style={{ letterSpacing: "-0.02em" }}
          >
            {RECORD.verifiedTools} verified tools. {RECORD.wrongBindings} wrong bindings.
          </h1>
          <Lead className="mt-7">
            The record is measured, not asserted, {RECORD.scope}. Every number on this page links to
            the dated experiment ledger in the repository that produced it.
          </Lead>
        </div>
      </header>

      {/* the table */}
      <Section id="benchmarks">
        <Eyebrow n="01">The three benchmarks</Eyebrow>
        <H2>Three real, unmodified applications.</H2>
        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <caption className="sr-only">
              Benchmark results by application: scale, discovered capabilities, wrong bindings, and
              the public ledger.
            </caption>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                {["Application", "Scale", "Capabilities", "Wrong bindings", "Ledger"].map((h) => (
                  <th
                    key={h}
                    scope="col"
                    className="label py-3 pr-6 font-normal"
                    style={{ textTransform: "none" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BENCHMARKS.map((b) => (
                <tr key={b.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <th scope="row" className="py-4 pr-6 text-left align-top font-normal">
                    <span className="text-[15px] font-medium text-ink">{b.label}</span>
                    <span className="mt-1 block text-[13px] font-normal text-muted">{b.note}</span>
                  </th>
                  <td className="py-4 pr-6 align-top text-[15px]" style={{ fontFamily: "var(--font-mono)" }}>
                    {"modules" in b ? `${b.modules} modules / ${b.entities} entities` : `${b.entities} entities`}
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
                  <td className="py-4 pr-6 align-top text-[14px]">
                    {LEDGER[b.id] ? (
                      <ExtLink href={LEDGER[b.id] as string} className="footer-link underline">
                        ledger
                      </ExtLink>
                    ) : (
                      <span className="text-muted">redacted</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* how to read it */}
      <Section id="reading" tint>
        <Eyebrow n="02">How to read these numbers</Eyebrow>
        <H2>Honestly. Coverage is idiom-bound; the guarantee is zero wrong bindings.</H2>
        <div className="mt-8 grid grid-cols-1 gap-x-16 gap-y-8 md:grid-cols-2">
          <div className="space-y-5 text-[16px] leading-relaxed text-body-strong">
            <p>
              The tool discovers well when a service returns entities and poorly when it returns view
              objects, so coverage depends on the application's idioms, not on effort. The ERP app
              discovers 25 of its 25 entities; the view-heavy PMS app discovers 2 of 43. Two of the
              three apps share an author, so the counts do not compound. Your number depends on your
              idioms and could land anywhere in that range.
            </p>
            <p>
              The one guarantee that transfers is the last column: zero wrong bindings, on every run
              of every phase, on all three applications. Preview your own app to see your real number
              before you decide.
            </p>
          </div>
          <div className="space-y-5 text-[16px] leading-relaxed text-body-strong">
            <p>
              What <span style={{ fontFamily: "var(--font-mono)" }}>mis-bound 0</span> means, exactly:
              every generated tool is bound to the method the source proves backs it, so a tool never
              silently calls the wrong method or the wrong entity's data. It is a correctness guarantee
              about what each tool does.
            </p>
            <p>
              It is not an access-control guarantee. Fail-loud does not authenticate callers or
              authorize actions; gating the endpoint is the operator's job (see{" "}
              <Link href="/docs/security/" className="footer-link underline">
                security
              </Link>
              ).
            </p>
          </div>
        </div>
      </Section>

      {/* redaction + sources */}
      <Section id="sources">
        <Eyebrow n="03">The private benchmark, and the sources</Eyebrow>
        <div className="max-w-[74ch] space-y-5 text-[16px] leading-relaxed text-body-strong">
          <p>
            The third row is a real multi-module enterprise Spring application, kept private by
            agreement and shown by counts and shapes only, never by name, domain, or industry. It is
            the app that Entity Identity was built for: it emits valid output that simple-name keying
            could not produce, at 4 verified capabilities with zero wrong bindings.
          </p>
          <p>
            The two public benchmarks link to their full per-entity ledgers above: every discovered
            capability with its binding, and every refusal with its located reason. Nothing here is
            summarized past what those dated records show.
          </p>
        </div>
        <p className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
          <ExtLink href={LINKS.erpLedger} className="btn-secondary text-[15px]">
            ERP ledger
          </ExtLink>
          <ExtLink href={LINKS.pmsLedger} className="btn-secondary text-[15px]">
            PMS ledger
          </ExtLink>
          <Link href="/docs/getting-started/" className="btn-secondary text-[15px]">
            Preview your own app
          </Link>
        </p>
      </Section>
    </>
  );
}
