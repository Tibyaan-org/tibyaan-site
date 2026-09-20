import type { Metadata } from "next";
import Link from "next/link";
import { Section, Eyebrow, H2, PageHeader, ExtLink, Arrow } from "../_components/ui";
import { LINKS } from "../_content/claims";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "What Tibyaan extracts, what proof means here, where the proof stops, and what adoption physically is.",
  alternates: { canonical: "/how-it-works/" },
};

// The pipeline, as boxes. Purely explanatory: no numbers, no tool output.
const PIPELINE = [
  { k: "Your source", v: "The Spring application your team already maintains. Read, never modified." },
  { k: "One verified model", v: "Entities and the read operations structure can prove. Everything else is refused, by name." },
  { k: "Generated outputs", v: "An MCP tool manifest and an OpenAPI 3.0 document, from the same model." },
  { k: "Served in place", v: "A runtime inside your own app serves the tools and calls your real methods." },
];

export default function HowItWorks() {
  return (
    <>
      <PageHeader eyebrow="How it works" title="One verified map. Many outputs. Nothing guessed.">
        Tibyaan reads the Spring backend you already run, proves which read operations are safe to
        expose, and serves them to agents in place, without touching your code. The rest of this
        page is how.
      </PageHeader>

      {/* the pipeline */}
      <section style={{ borderTop: "1px solid var(--line)", background: "var(--bg-soft)" }}>
        <div className="container-x py-12">
          <ol className="m-0 grid list-none grid-cols-1 gap-3 p-0 md:grid-cols-4">
            {PIPELINE.map((p, i) => (
              <li key={p.k} className="card relative p-6">
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--accent)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="mt-2 text-[16px] font-semibold text-fg">{p.k}</div>
                <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{p.v}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* the map */}
      <Section id="map">
        <Eyebrow>The map</Eyebrow>
        <H2>It builds one neutral description, and generates everything from it.</H2>
        <div className="mt-8 max-w-[74ch] space-y-5 text-[16.5px] leading-relaxed text-fg-soft">
          <p>
            Tibyaan reads your source and writes down the business objects it finds and the read
            operations over them, in a form that belongs to no framework. That single description is
            the asset. From it, the tool generates the outputs an agent or a client needs: today an
            MCP server (the open protocol agents use to call tools) and an OpenAPI document.
          </p>
          <p>
            Because both come from the same description, they cannot disagree, and rebuilding
            regenerates them from whatever your source now says. The same input always produces the
            same output.
          </p>
        </div>
      </Section>

      {/* what proof means */}
      <Section id="proof" tint>
        <Eyebrow>What proof means here</Eyebrow>
        <H2>Structure decides, or nothing does.</H2>
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            {
              h: "Exposed",
              tone: "var(--ok)",
              b: "A read is exposed when a framework contract proves it. A standard repository load by primary key is a load by primary key by contract, not because a method happens to be named getById.",
            },
            {
              h: "Refused, ambiguous",
              tone: "var(--accent)",
              b: "When two methods both fit the shape of the read, the tool refuses rather than pick one. A real example: an entity with both findById and findByUsername is refused, not guessed.",
            },
            {
              h: "Refused, unprovable",
              tone: "var(--accent)",
              b: "When meaning is not in the structure, it is refused. A check sitting between the load and the return could be an authorization rule; the tool cannot tell, so it will not claim.",
            },
          ].map((c) => (
            <div key={c.h} className="card p-7">
              <h3 className="font-normal" style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: c.tone }}>
                {c.h}
              </h3>
              <p className="mt-3 text-[14.5px] leading-relaxed text-fg-soft">{c.b}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-[74ch] text-[15.5px] leading-relaxed text-muted">
          Method names, parameter names, and comments carry no weight anywhere in this. They are the
          easiest thing to get wrong, and a tool an agent trusts cannot lean on them.
        </p>
      </Section>

      {/* the ceiling */}
      <Section id="ceiling">
        <Eyebrow>Where the proof stops</Eyebrow>
        <H2>A structural tool tops out at what structure can prove, and says so.</H2>
        <div className="mt-8 max-w-[74ch] space-y-5 text-[16.5px] leading-relaxed text-fg-soft">
          <p>
            Today that means unfiltered reads by id and unfiltered lists. The filtered majority of a
            real application's read API, the searches and the category lookups, is beyond structural
            proof: a filter's meaning is a claim, and a claim in a tool description is something an
            agent acts on. So the tool refuses it rather than present a guess as verified.
          </p>
          <p>
            Where that boundary can move honestly, it moves by a person's word, never by a guess. A
            named human can attest what a refused read selects or returns, in a committed, reviewed
            file. The tool carries it as exactly that: human-attested, labeled on every surface,
            never counted as verified, fingerprinted to the code it was asserted against, and refused
            loudly the moment that code changes.
          </p>
        </div>
        <p className="mt-8">
          <Link href="/docs/attestation/" className="link-arrow text-[15px]">
            How attestation works <Arrow />
          </Link>
        </p>
      </Section>

      {/* in place */}
      <Section id="in-place" tint>
        <Eyebrow>In place, at build time</Eyebrow>
        <H2>Adoption is a dependency and a build step. Nothing is hosted by us.</H2>
        <div className="mt-8 max-w-[74ch] space-y-5 text-[16.5px] leading-relaxed text-fg-soft">
          <p>
            You add one runtime dependency and one build plugin to your application. Your own build
            generates the tool manifest from your source and places it on the classpath. The server
            runs inside your application's own process and calls your real methods. There is no
            Tibyaan service in the path at runtime, nothing metered, no vendor infrastructure.
          </p>
          <p>
            Remove the two build-file entries and the layer is gone. You never touched your original
            code.
          </p>
        </div>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Link href="/docs/getting-started/" className="btn btn-primary">
            See the real quickstart
            <Arrow />
          </Link>
          <Link href="/docs/" className="btn btn-ghost">
            Read the docs
          </Link>
        </div>
        <p className="mt-8 text-[14px] text-muted">
          The full design, all seventeen volumes and the dated benchmark ledgers, lives in the{" "}
          <ExtLink href={LINKS.docs} className="prose-link">
            repository
          </ExtLink>
          .
        </p>
      </Section>
    </>
  );
}
