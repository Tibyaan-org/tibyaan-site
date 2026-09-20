import type { Metadata } from "next";
import Link from "next/link";
import { Section, Eyebrow, H2, PageHeader, ExtLink, Arrow } from "../_components/ui";
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
      <PageHeader eyebrow="Approach" title="Two honest ways to make a system operable by agents.">
        To put an AI agent in front of an existing system, you can work from the outside, driving
        the running system and observing its behavior, or from the inside, reading the source you
        own and proving its structure. Tibyaan is the inside-out one. This page compares the two
        approaches at the category level, without naming any product, and without a winner.
      </PageHeader>

      {/* convergence */}
      <Section id="convergence">
        <Eyebrow>The shared conclusion</Eyebrow>
        <H2>Both roads lead to a small, typed, pre-verified tool interface.</H2>
        <div className="mt-8 max-w-[74ch] space-y-5 text-[16px] leading-relaxed text-fg-soft">
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
        <div className="card mt-10 overflow-x-auto">
          <table className="doc-table min-w-[760px]">
            <caption className="sr-only">
              The outside-in and inside-out approaches compared across input, method, truth model,
              failure mode, and best domain.
            </caption>
            <thead>
              <tr>
                <th scope="col" />
                <th scope="col">Outside-in (observe)</th>
                <th scope="col" style={{ color: "var(--accent)" }}>
                  Inside-out (prove), Tibyaan
                </th>
              </tr>
            </thead>
            <tbody>
              {AXES.map((a) => (
                <tr key={a.axis}>
                  <th
                    scope="row"
                    className="w-[130px] text-left align-top"
                    style={{ padding: "0.75rem 1rem", borderBottom: "1px solid var(--line)", background: "transparent", color: "var(--fg)", fontFamily: "var(--font-sans)", fontSize: "0.875rem", letterSpacing: 0, textTransform: "none", fontWeight: 600 }}
                  >
                    {a.axis}
                  </th>
                  <td>{a.outside}</td>
                  <td>{a.inside}</td>
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
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="card space-y-4 p-7 text-[15.5px] leading-relaxed text-fg-soft">
            <div className="label">A system you cannot read</div>
            <p>
              For a system you cannot read, a third-party site with no API, black-box observation is
              not merely reasonable, it is the only option, and inferring then empirically verifying is
              the correct method: verification bounds the error of a guess that cannot be avoided.
            </p>
            <p>
              Tibyaan cannot run there at all. With no source to read, there is nothing to prove.
            </p>
          </div>
          <div className="card space-y-4 p-7 text-[15.5px] leading-relaxed text-fg-soft">
            <div className="label" style={{ color: "var(--accent)" }}>A backend you own</div>
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
          <ExtLink href={LINKS.landscapeDoc} className="prose-link">
            docs/competitive-landscape.md
          </ExtLink>
          .
        </p>
        <p className="mt-8">
          <Link href="/how-it-works/" className="link-arrow text-[15px]">
            How the inside-out proof works <Arrow />
          </Link>
        </p>
      </Section>
    </>
  );
}
