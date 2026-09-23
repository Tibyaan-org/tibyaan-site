import type { Metadata } from "next";
import Link from "next/link";
import { Section, Eyebrow, H2, PageHeader, ExtLink, Arrow } from "../_components/ui";
import { LINKS } from "../_content/claims";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "How Tibyaan reads a Spring application, which read operations it can verify, what it leaves out, and what you add to your build to adopt it.",
  alternates: { canonical: "/how-it-works/" },
};

// The pipeline, as boxes. Purely explanatory: no numbers, no tool output.
const PIPELINE = [
  { k: "Your source", v: "The Spring application your team already maintains. Tibyaan reads it and doesn't modify it." },
  { k: "One verified model", v: "The entities and the read operations that Tibyaan can verify from code structure. Everything else is refused and listed by name." },
  { k: "Generated outputs", v: "An MCP tool manifest and an OpenAPI 3.0 document, both generated from the same model." },
  { k: "Served in place", v: "A runtime inside your own app serves the tools and calls your existing methods." },
];

export default function HowItWorks() {
  return (
    <>
      <PageHeader eyebrow="How it works" title="From Spring source code to agent tools">
        Tibyaan reads the Spring backend you already run, verifies which read operations are safe
        to expose, and serves them to agents from inside your application. Your code stays as it
        is. This page explains each step.
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
        <Eyebrow>The model</Eyebrow>
        <H2>One model of your application generates every output</H2>
        <div className="mt-8 max-w-[74ch] space-y-5 text-[16.5px] leading-relaxed text-fg-soft">
          <p>
            Tibyaan reads your source and records the business objects it finds and the read
            operations over them, in a format that isn't tied to any framework. From that one
            description it generates the outputs an agent or a client needs. Today those are an MCP
            server (MCP is the open protocol agents use to call tools) and an OpenAPI document.
          </p>
          <p>
            Both outputs come from the same description, so they can't disagree with each other.
            Each build regenerates them from the current state of your source, and the same input
            always produces the same output.
          </p>
        </div>
      </Section>

      {/* what proof means */}
      <Section id="proof" tint>
        <Eyebrow>Verification</Eyebrow>
        <H2>Which reads are exposed and which are refused</H2>
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            {
              h: "Exposed",
              tone: "var(--ok)",
              b: "A read is exposed when Tibyaan can verify what it does from a framework contract. A standard repository load by primary key qualifies because the framework guarantees that behavior. A method that only happens to be named getById doesn't qualify.",
            },
            {
              h: "Refused, ambiguous",
              tone: "var(--accent)",
              b: "When two methods both fit the shape of the read, Tibyaan refuses the read instead of picking one. For example, an entity that has both findById and findByUsername is refused.",
            },
            {
              h: "Refused, unverifiable",
              tone: "var(--accent)",
              b: "When the code structure doesn't show what a read means, the read is refused. A check between the load and the return could be an authorization rule. Tibyaan can't tell, so it leaves the read out.",
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
          Method names, parameter names, and comments are never used as evidence. They are easy to
          get wrong, so a tool that agents rely on shouldn't depend on them.
        </p>
      </Section>

      {/* the ceiling */}
      <Section id="ceiling">
        <Eyebrow>Limits</Eyebrow>
        <H2>What Tibyaan can't verify</H2>
        <div className="mt-8 max-w-[74ch] space-y-5 text-[16.5px] leading-relaxed text-fg-soft">
          <p>
            Today Tibyaan verifies unfiltered reads by id and unfiltered lists. Most of an
            application's read API is filtered reads, such as searches and category lookups, and
            Tibyaan can't verify what a filter means from code structure. An agent acts on whatever
            a tool description says, so Tibyaan refuses filtered reads.
          </p>
          <p>
            Some refused reads can be covered by attestation. A named person states what the read
            selects or returns, in a file that is committed and reviewed. Tibyaan labels the
            resulting capability as human-attested everywhere it appears and never counts it as
            verified. The attestation is fingerprinted to the code it was written against, and if
            that code changes, Tibyaan refuses the capability and reports it.
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
        <Eyebrow>Adoption</Eyebrow>
        <H2>What you add to your application</H2>
        <div className="mt-8 max-w-[74ch] space-y-5 text-[16.5px] leading-relaxed text-fg-soft">
          <p>
            You add one runtime dependency and one build plugin to your application. Your own build
            generates the manifest from your source and places it on the classpath. The server runs
            inside your application's process and calls your existing methods. Nothing at runtime
            depends on a Tibyaan service or on vendor infrastructure, and nothing is metered.
          </p>
          <p>
            To remove Tibyaan, delete the two build-file entries. Your original code is never
            changed.
          </p>
        </div>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Link href="/docs/getting-started/" className="btn btn-primary">
            Go to the quickstart
            <Arrow />
          </Link>
          <Link href="/docs/" className="btn btn-ghost">
            Read the docs
          </Link>
        </div>
        <p className="mt-8 text-[14px] text-muted">
          The full design, in seventeen volumes, and the dated benchmark ledgers are in the{" "}
          <ExtLink href={LINKS.docs} className="prose-link">
            repository
          </ExtLink>
          .
        </p>
      </Section>
    </>
  );
}
