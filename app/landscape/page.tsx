import type { Metadata } from "next";
import Link from "next/link";
import { Section, Eyebrow, H2, Lead, ExtLink } from "../_components/ui";
import { LINKS } from "../_content/claims";

export const metadata: Metadata = {
  title: "Approach",
  description:
    "Two honest ways to make an existing system operable by AI agents: observe it from the outside, or prove it from the inside. Where each is the right choice, stated without a winner.",
  alternates: { canonical: "/landscape/" },
};

const AXES = [
  {
    axis: "Input",
    outside: "A running system you do not own and cannot see inside. All you can do is drive it and observe.",
    inside: "The source of a system you own, read as a white box.",
  },
  {
    axis: "Method",
    outside: "Infer the system's shape and actions, then empirically verify the inference works, discarding low-coverage results.",
    inside: "Prove each capability from framework contracts and code structure. Anything unprovable is refused with a located reason.",
  },
  {
    axis: "Truth model",
    outside: "Empirical: it worked when verified, and is re-verified over time as the system drifts.",
    inside: "Structural: the binding is proven from source, and regenerated from source at build time.",
  },
  {
    axis: "Failure mode",
    outside: "May occasionally act wrongly; relies on verification and recovery to catch and repair it. Coverage bought with a safety net.",
    inside: "Refuses at generation time when uncertain, so the failure surface is coverage, not correctness. Trust bought with a coverage ceiling.",
  },
  {
    axis: "Best domain",
    outside: "The open web and third-party systems with no API and no source.",
    inside: "Backends whose source the adopter owns.",
  },
];

export default function Landscape() {
  return (
    <>
      <header className="mx-auto max-w-[1160px] px-6 md:px-8">
        <div className="py-[clamp(56px,9vh,96px)]" style={{ borderBottom: "1px solid var(--color-border)" }}>
          <Eyebrow>Approach</Eyebrow>
          <h1
            className="m-0 max-w-[20ch] font-serif text-[clamp(38px,5.4vw,72px)] font-medium leading-[1.04]"
            style={{ letterSpacing: "-0.02em" }}
          >
            Two honest ways to make a system operable by agents.
          </h1>
          <Lead className="mt-7">
            To put an AI agent in front of an existing system, you can work from the outside, driving
            the running system and observing its behavior, or from the inside, reading the source you
            own and proving its structure. Tibyaan is the inside-out one. This page compares the two
            approaches at the category level, without naming any product, and without a winner.
          </Lead>
        </div>
      </header>

      {/* convergence */}
      <Section id="convergence">
        <Eyebrow>The shared conclusion</Eyebrow>
        <H2>Both roads lead to a small, typed, pre-verified tool interface.</H2>
        <div className="mt-8 max-w-[74ch] space-y-5 text-[16px] leading-relaxed text-body-strong">
          <p>
            Built independently, the outside-in and inside-out approaches reach the same shape: do not
            hand the agent the raw surface, whether that is a raw web page or raw code. Pre-map the
            system into a small, typed, verified-before-served set of tools, and expose it over MCP,
            the open protocol agents use to call tools.
          </p>
          <p>
            That two approaches converge on the same shape from opposite sides of the
            source-availability line is real evidence the shape of the idea is sound. It is not
            evidence of anything more, and this page does not stretch it into one.
          </p>
        </div>
      </Section>

      {/* the two approaches */}
      <Section id="axes" tint>
        <Eyebrow>Where they differ</Eyebrow>
        <H2>Outside-in observes. Inside-out proves.</H2>
        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <caption className="sr-only">
              The outside-in and inside-out approaches compared across input, method, truth model,
              failure mode, and best domain.
            </caption>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                <th scope="col" className="label py-3 pr-6 font-normal" style={{ textTransform: "none" }} />
                <th scope="col" className="label py-3 pr-6 font-normal" style={{ textTransform: "none" }}>
                  Outside-in (observe)
                </th>
                <th scope="col" className="label py-3 pr-6 font-normal" style={{ textTransform: "none", color: "var(--color-sienna)" }}>
                  Inside-out (prove), Tibyaan
                </th>
              </tr>
            </thead>
            <tbody>
              {AXES.map((a) => (
                <tr key={a.axis} style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <th scope="row" className="w-[120px] py-4 pr-6 text-left align-top">
                    <span className="label" style={{ textTransform: "none" }}>{a.axis}</span>
                  </th>
                  <td className="py-4 pr-6 align-top text-[14.5px] leading-relaxed text-body">{a.outside}</td>
                  <td className="py-4 pr-6 align-top text-[14.5px] leading-relaxed text-body">{a.inside}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* where each is right */}
      <Section id="right">
        <Eyebrow>Where each is the right choice</Eyebrow>
        <H2>Neither wins in the abstract. The input decides.</H2>
        <div className="mt-8 grid grid-cols-1 gap-x-16 gap-y-8 md:grid-cols-2">
          <div className="space-y-5 text-[16px] leading-relaxed text-body-strong">
            <p>
              For a system you cannot read, a third-party site with no API, black-box observation is
              not merely reasonable, it is the only option, and inferring then empirically verifying is
              the correct method: verification bounds the error of a guess that cannot be avoided.
            </p>
            <p>
              Tibyaan cannot run there at all. With no source to read, there is nothing to prove.
            </p>
          </div>
          <div className="space-y-5 text-[16px] leading-relaxed text-body-strong">
            <p>
              For a backend you own, the source is the ground truth, and reading it is strictly
              stronger evidence than observing behavior from outside. Structural proof removes the
              guess rather than bounding it.
            </p>
            <p>
              Which trade is right depends on blast radius. A failed consumer-web errand is retried and
              shrugged off, so coverage-with-recovery fits there. A business backend silently reading
              the wrong entity into an agent's context is the failure Tibyaan exists to never produce,
              so refusal-over-guessing fits here.
            </p>
          </div>
        </div>
        <p className="mt-10 max-w-[74ch] text-[15px] leading-relaxed text-muted">
          The full, sourced comparison against a specific external system, held to a stricter standard
          than this page (their claims marked as vendor claims, ours cited), lives in the repository:{" "}
          <ExtLink href={LINKS.landscapeDoc} className="footer-link underline">
            docs/competitive-landscape.md
          </ExtLink>
          .
        </p>
        <p className="mt-8">
          <Link href="/how-it-works/" className="btn-secondary text-[15px]">
            How the inside-out proof works
          </Link>
        </p>
      </Section>
    </>
  );
}
