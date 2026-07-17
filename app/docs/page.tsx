import type { Metadata } from "next";
import Link from "next/link";
import { Section, Eyebrow, Lead, ExtLink } from "../_components/ui";
import { LINKS } from "../_content/claims";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Where everything lives: the adopter guides on this site, and the full seventeen-volume design and the dated benchmark ledgers in the repository.",
  alternates: { canonical: "/docs/" },
};

const ONSITE = [
  { label: "Get started", href: "/docs/getting-started/", blurb: "The honest quickstart: preview read-only, adopt with two build entries, connect an agent." },
  { label: "Security", href: "/docs/security/", blurb: "What the generated layer executes, the read-only boundary, and why gating the endpoint is your job." },
  { label: "Evidence", href: "/evidence/", blurb: "The three benchmarks, the numbers, and links to the dated ledgers that produced them." },
  { label: "How it works", href: "/how-it-works/", blurb: "The map, what proof means here, where the proof stops, and what adoption physically is." },
];

const REPO = [
  { label: "Commands manual", href: LINKS.commands, blurb: "Every way to invoke Tibyaan: the CLI, the Maven plugin, the runtime, and the build commands." },
  { label: "Connecting an MCP client", href: LINKS.connecting, blurb: "The handshake, a curl smoke test, a scripted check, and the Claude Desktop bridge config." },
  { label: "Design volumes and ledgers", href: LINKS.docs, blurb: "The full seventeen-volume design, the ADRs, and the dated per-app benchmark ledgers." },
  { label: "Source on GitHub", href: LINKS.github, blurb: "The whole thing: read it, build it, open an issue." },
];

export default function Docs() {
  return (
    <>
      <header className="mx-auto max-w-[1160px] px-6 md:px-8">
        <div className="py-[clamp(56px,9vh,96px)]" style={{ borderBottom: "1px solid var(--color-border)" }}>
          <Eyebrow>Documentation</Eyebrow>
          <h1
            className="m-0 max-w-[20ch] font-serif text-[clamp(38px,5.4vw,72px)] font-medium leading-[1.04]"
            style={{ letterSpacing: "-0.02em" }}
          >
            Everything, and where it lives.
          </h1>
          <Lead className="mt-7">
            The adopter path is on this site. The full design, all seventeen volumes and the dated
            benchmark ledgers, lives in the repository, linked and never mirrored here, so it never
            drifts from the source of truth.
          </Lead>
        </div>
      </header>

      <Section id="onsite">
        <Eyebrow n="01">On this site</Eyebrow>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {ONSITE.map((d) => (
            <Link key={d.href} href={d.href} className="card p-7 no-underline transition-colors">
              <div className="font-serif text-[21px] font-medium text-ink">{d.label}</div>
              <p className="mt-2 text-[14.5px] leading-relaxed text-body">{d.blurb}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section id="repo" tint>
        <Eyebrow n="02">In the repository</Eyebrow>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {REPO.map((d) => (
            <ExtLink key={d.href} href={d.href} className="card p-7 no-underline">
              <div className="font-serif text-[21px] font-medium text-ink">{d.label}</div>
              <p className="mt-2 text-[14.5px] leading-relaxed text-body">{d.blurb}</p>
            </ExtLink>
          ))}
        </div>
      </Section>
    </>
  );
}
