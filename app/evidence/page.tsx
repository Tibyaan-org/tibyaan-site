import type { Metadata } from "next";
import Link from "next/link";
import { Section, Eyebrow, H2, PageHeader, ExtLink, Arrow, IC } from "../_components/ui";
import { RECORD, BENCHMARKS, LINKS } from "../_content/claims";

export const metadata: Metadata = {
  title: "Evidence",
  description: `Benchmark results for Tibyaan: ${RECORD.verifiedTools} verified tools and zero wrong bindings ${RECORD.scope}. The numbers for the two public benchmarks link to their dated experiment ledgers.`,
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
        These results were measured {RECORD.scope}. The numbers for the two public benchmarks link
        to the dated experiment ledgers in the repository that produced them. The third benchmark
        is private, so its row has no public ledger.
      </PageHeader>

      {/* the table */}
      <Section id="benchmarks">
        <Eyebrow>The three benchmarks</Eyebrow>
        <H2>Results by application</H2>
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
        <H2>What these numbers mean for your application</H2>
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="card space-y-4 p-7 text-[15.5px] leading-relaxed text-fg-soft">
            <div className="label">Coverage varies</div>
            <p>
              Tibyaan discovers more when services return entities and less when they return view
              objects, so coverage depends on how an application is written. In the ERP app it
              discovers {erp.capabilities} capabilities over {erp.entities} entities. In the
              view-heavy PMS app it discovers {pms.capabilities} over {pms.entities}. Two of the three
              apps share an author, so they aren't independent samples. Your number could land
              anywhere in that range.
            </p>
            <p>
              The result that carries over is the last column, which shows zero wrong bindings on
              every run, on all three applications. Scan your own application to see your number
              before you decide.
            </p>
          </div>
          <div className="card space-y-4 p-7 text-[15.5px] leading-relaxed text-fg-soft">
            <div className="label" style={{ color: "var(--accent)" }}>
              What mis-bound 0 means
            </div>
            <p>
              Every generated tool is bound to a method that Tibyaan has verified backs it, so a
              tool doesn't call the wrong method or read the wrong entity's data. This is a
              correctness guarantee about what each tool does.
            </p>
            <p>
              It doesn't cover access control. Tibyaan doesn't authenticate callers or authorize
              actions, so you need to gate the endpoint yourself (see{" "}
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
        <Eyebrow>Fixed in 0.3.0</Eyebrow>
        <H2>One wrong binding was found in 0.2.0</H2>
        <div className="mt-8 max-w-[74ch] space-y-5 text-[16px] leading-relaxed text-fg-soft">
          <p>
            In 0.2.0, the code path that discovers entity-returning reads matched on the method
            signature only. On a fourth application, outside the three benchmarks above, this bound a
            read-by-id tool to a method that filters by a foreign key and returns the first hit.
          </p>
          <p>
            0.3.0 fixes this. Both discovery paths now share one check that the method body loads by
            primary key, and that check can only remove candidates. If a tool disappeared from your
            manifest after you upgraded, this is the reason, and the earlier binding wasn't safe to
            rely on. The <IC>mis-bound 0</IC> results on this page were measured with the current
            rules. The full account is in the{" "}
            <ExtLink href={LINKS.changelog} className="prose-link">
              changelog
            </ExtLink>
            .
          </p>
        </div>
      </Section>

      {/* redaction + sources */}
      <Section id="sources" tint>
        <Eyebrow>The private benchmark and the sources</Eyebrow>
        <div className="max-w-[74ch] space-y-5 text-[16px] leading-relaxed text-fg-soft">
          <p>
            The third row is a real multi-module enterprise Spring application. It is private by
            agreement, so this page describes it by counts and shapes only and leaves out its name,
            domain, and industry. Its modules reuse entity names, and keying entities by simple class
            name couldn't produce valid output for it. Entity keying was changed for this
            application, and Tibyaan now emits valid output for it, with{" "}
            {enterprise.capabilities} verified capabilities and zero wrong bindings.
          </p>
          <p>
            The two public benchmarks link to their full per-entity ledgers above. Each ledger lists
            every discovered capability with its binding, and every refusal with its reason.
            The public benchmark numbers on this page come from those dated records.
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
