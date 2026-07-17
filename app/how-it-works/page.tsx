import type { Metadata } from "next";
import Link from "next/link";
import { Section, Eyebrow, H2 } from "../_components/ui";
import { LINKS } from "../_content/claims";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "What Tibyaan extracts, what proof means here, where the proof stops, and what adoption physically is.",
};

export default function HowItWorks() {
  return (
    <>
      <header className="mx-auto max-w-[1160px] px-6 md:px-8">
        <div className="py-[clamp(56px,9vh,96px)]" style={{ borderBottom: "1px solid var(--color-border)" }}>
          <Eyebrow>How it works</Eyebrow>
          <h1 className="m-0 max-w-[20ch] font-serif text-[clamp(38px,5.4vw,72px)] font-medium leading-[1.04]" style={{ letterSpacing: "-0.02em" }}>
            One verified map. Many outputs. Nothing guessed.
          </h1>
          <p className="mt-7 max-w-[62ch] text-[18px] leading-relaxed text-muted">
            The thirty-second version: Tibyaan reads the Spring backend you already run, proves which
            read operations are safe to expose, and serves them to AI agents in place, without
            changing your code. This page is the level beneath that, in plain terms.
          </p>
        </div>
      </header>

      {/* the map */}
      <Section id="map">
        <Eyebrow n="01">The map</Eyebrow>
        <H2>It builds one neutral description, and generates everything from it.</H2>
        <div className="mt-8 max-w-[74ch] space-y-5 text-[16.5px] leading-relaxed text-[#3a352d]">
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
        <Eyebrow n="02">What proof means here</Eyebrow>
        <H2>Structure decides, or nothing does.</H2>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              h: "Exposed",
              tone: "var(--color-success)",
              b: "A read is exposed when a framework contract proves it. A standard repository load by primary key is a load by primary key by contract, not because a method happens to be named getById.",
            },
            {
              h: "Refused, ambiguous",
              tone: "var(--color-sienna)",
              b: "When two methods both fit the shape of the read, the tool refuses rather than pick one. A real example: an entity with both findById and findByUsername is refused, not guessed.",
            },
            {
              h: "Refused, unprovable",
              tone: "var(--color-sienna)",
              b: "When meaning is not in the structure, it is refused. A check sitting between the load and the return could be an authorization rule; the tool cannot tell, so it will not claim.",
            },
          ].map((c) => (
            <div key={c.h} className="card p-7">
              <div className="mb-3" style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: c.tone }}>
                {c.h}
              </div>
              <p className="m-0 text-[14.5px] leading-relaxed text-[#4a443a]">{c.b}</p>
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
        <Eyebrow n="03">Where the proof stops</Eyebrow>
        <H2>A structural tool tops out at what structure can prove, and says so.</H2>
        <div className="mt-8 max-w-[74ch] space-y-5 text-[16.5px] leading-relaxed text-[#3a352d]">
          <p>
            Today that means unfiltered reads by id and unfiltered lists. The filtered majority of a
            real application's read API, the searches and the category lookups, is beyond structural
            proof: a filter's meaning is a claim, and a claim in a tool description is something an
            agent acts on. So the tool refuses it rather than present a guess as verified.
          </p>
          <p>
            Where that boundary can move honestly, it is designed and waiting. A human can attest to
            a capability the structure cannot prove, and it would be carried as exactly that, human
            attested, never as verified. That work is built when a real adopter hits the boundary,
            not before.
          </p>
        </div>
      </Section>

      {/* in place */}
      <Section id="in-place" tint>
        <Eyebrow n="04">In place, at build time</Eyebrow>
        <H2>Adoption is a dependency and a build step. Nothing is hosted by us.</H2>
        <div className="mt-8 max-w-[74ch] space-y-5 text-[16.5px] leading-relaxed text-[#3a352d]">
          <p>
            You add one runtime dependency and one build plugin to your application. Your own build
            generates the tool manifest from your source and places it on the classpath. The server
            runs inside your application's own process and calls your real methods. There is no
            Tibyaan service in the path at runtime, nothing metered, no vendor infrastructure.
          </p>
          <p>
            Remove the two entries from your build file and the layer is gone. Your original code was
            never touched.
          </p>
        </div>
        <p className="mt-8">
          <Link href="/docs/getting-started/" className="btn-primary text-[15px]">
            See the real quickstart
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="var(--color-limestone)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </p>
        <p className="mt-6 text-[14px] text-muted">
          The full design, all seventeen volumes and the dated benchmark ledgers, lives in the{" "}
          <a href={LINKS.docs} target="_blank" rel="noopener noreferrer" className="underline">
            repository
          </a>
          .
        </p>
      </Section>
    </>
  );
}
