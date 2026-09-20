import type { Metadata } from "next";
import Link from "next/link";
import { Section, Eyebrow, H2, PageHeader, ExtLink, Arrow, IC } from "../_components/ui";
import { RECORD, BENCHMARKS, LINKS } from "../_content/claims";

export const metadata: Metadata = {
  title: "Evidence",
  description: `The measured record: ${RECORD.verifiedTools} verified tools across three real benchmark applications, zero wrong bindings on every run. Every number links to the dated experiment ledger that produced it.`,
  alternates: { canonical: "/evidence/" },
};

// The public ledger for each benchmark. The private enterprise benchmark has none by rule.
const LEDGER: Record<string, string | null> = {
  erp: LINKS.erpLedger,
  pms: LINKS.pmsLedger,
  enterprise: null,
};

const erp = BENCHMARKS[0];
const pms = BENCHMARKS[1];
const enterprise = BENCHMARKS[2];

export default function Evidence() {
  return (
    <>
      <PageHeader
        eyebrow="Evidence"
        title={
          <>
            {RECORD.verifiedTools} verified tools.{" "}
            <span className="accent-serif">{RECORD.wrongBindings} wrong bindings.</span>
          </>
        }
      >
        The record is measured, not asserted, {RECORD.scope}. Every number on this page links to the
        dated experiment ledger in the repository that produced it.
      </PageHeader>

      {/* the table */}
      <Section id="benchmarks">
        <Eyebrow>The three benchmarks</Eyebrow>
        <H2>Three real applications.</H2>
        <div className="card mt-10 overflow-x-auto">
          <table className="doc-table min-w-[760px]">
            <caption className="sr-only">
              Benchmark results by application: scale, discovered capabilities, wrong bindings, and
              the public ledger.
            </caption>
            <thead>
              <tr>
                {["Application", "Scale", "Capabilities", "Wrong bindings", "Ledger"].map((h) => (
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
                    <span className="text-[14.5px] font-medium text-fg">{b.label}</span>
                    <span className="mt-1 block text-[13px] text-muted">{b.note}</span>
                  </td>
                  <td style={{ fontFamily: "var(--font-mono)" }}>
                    {"modules" in b ? `${b.modules} modules / ${b.entities} entities` : `${b.entities} entities`}
                  </td>
                  <td style={{ fontFamily: "var(--font-mono)" }}>
                    {"byId" in b ? `${b.capabilities} (${b.byId} by-id, ${b.list} list)` : b.capabilities}
                  </td>
                  <td style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}>{b.misBound}</td>
                  <td>
                    {LEDGER[b.id] ? (
                      <ExtLink href={LEDGER[b.id] as string} className="prose-link">
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
        <Eyebrow>How to read these numbers</Eyebrow>
        <H2>Honestly. Coverage is idiom-bound; the guarantee is zero wrong bindings.</H2>
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="card space-y-4 p-7 text-[15.5px] leading-relaxed text-fg-soft">
            <div className="label">Coverage varies</div>
            <p>
              The tool discovers well when a service returns entities and poorly when it returns view
              objects, so coverage depends on the application's idioms, not on effort. The ERP app
              discovers {erp.capabilities} capabilities over its {erp.entities} entities; the
              view-heavy PMS app discovers {pms.capabilities} over {pms.entities}. Two of the three
              apps share an author, so the counts do not compound. Your number depends on your idioms
              and could land anywhere in that range.
            </p>
            <p>
              The one guarantee that transfers is the last column: zero wrong bindings, on every run,
              on all three applications. Preview your own app to see your real number before you
              decide.
            </p>
          </div>
          <div className="card space-y-4 p-7 text-[15.5px] leading-relaxed text-fg-soft">
            <div className="label" style={{ color: "var(--accent)" }}>
              What mis-bound 0 means
            </div>
            <p>
              Every generated tool is bound to the method the source proves backs it, so a tool never
              silently calls the wrong method or the wrong entity's data. It is a correctness
              guarantee about what each tool does.
            </p>
            <p>
              It is not an access-control guarantee. Fail-loud does not authenticate callers or
              authorize actions; gating the endpoint is the operator's job (see{" "}
              <Link href="/docs/security/" className="prose-link">
                security
              </Link>
              ).
            </p>
          </div>
        </div>
      </Section>

      {/* the one that got through */}
      <Section id="found">
        <Eyebrow>On the record</Eyebrow>
        <H2>One wrong binding has been found. Here is what happened to it.</H2>
        <div className="mt-8 max-w-[74ch] space-y-5 text-[16px] leading-relaxed text-fg-soft">
          <p>
            In 0.2.0, the path that discovers entity-returning reads matched on a method's signature
            alone. On a fourth real application, outside the three benchmarks above, that bound a
            read-by-id tool to a method that filters by a foreign key and returns the first hit.
          </p>
          <p>
            0.3.0 closed it: both discovery paths now share one by-primary-key proof over the method
            body, and the rule can only remove candidates, never add one. If a tool vanished from
            your manifest after upgrading, this is why, and the earlier binding was not safe to rely
            on. The <IC>mis-bound 0</IC> record on this page is measured on the current rules. The
            account is in the{" "}
            <ExtLink href={LINKS.changelog} className="prose-link">
              changelog
            </ExtLink>
            .
          </p>
        </div>
      </Section>

      {/* redaction + sources */}
      <Section id="sources" tint>
        <Eyebrow>The private benchmark, and the sources</Eyebrow>
        <div className="max-w-[74ch] space-y-5 text-[16px] leading-relaxed text-fg-soft">
          <p>
            The third row is a real multi-module enterprise Spring application, kept private by
            agreement and shown by counts and shapes only, never by name, domain, or industry. It is
            the app that Entity Identity was built for: it emits valid output that simple-name keying
            could not produce, at {enterprise.capabilities} verified capabilities with zero wrong bindings.
          </p>
          <p>
            The two public benchmarks link to their full per-entity ledgers above: every discovered
            capability with its binding, and every refusal with its located reason. Nothing here is
            summarized past what those dated records show.
          </p>
        </div>
        <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3">
          <ExtLink href={LINKS.erpLedger} className="link-arrow text-[15px]">
            ERP ledger <Arrow />
          </ExtLink>
          <ExtLink href={LINKS.pmsLedger} className="link-arrow text-[15px]">
            PMS ledger <Arrow />
          </ExtLink>
          <Link href="/docs/getting-started/" className="link-arrow text-[15px]">
            Preview your own app <Arrow />
          </Link>
        </div>
      </Section>
    </>
  );
}
