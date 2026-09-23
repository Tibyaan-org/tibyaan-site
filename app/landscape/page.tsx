import type { Metadata } from "next";
import Link from "next/link";
import { Section, Eyebrow, H2, PageHeader, ExtLink, Arrow } from "../_components/ui";
import { LINKS } from "../_content/claims";

export const metadata: Metadata = {
  title: "Approach",
  description:
    "A comparison of two ways to make an existing system usable by AI agents: observing the running system from the outside, or verifying it from its source code. It also covers where each approach fits.",
  alternates: { canonical: "/landscape/" },
};

const AXES = [
  {
    axis: "Input",
    outside: "A running system that you don't own and can't see inside. You can only drive it and observe what it does.",
    inside: "The source code of a system you own, which the tool reads directly.",
  },
  {
    axis: "Method",
    outside: "Infer the system's structure and actions, test that the inference works, and discard results with low coverage.",
    inside: "Verify each capability from framework contracts and code structure. Anything that can't be verified is refused, with the reason.",
  },
  {
    axis: "Truth model",
    outside: "The evidence is empirical. A result worked when it was tested, and it is tested again over time as the system changes.",
    inside: "The evidence is structural. Each binding is verified from the source and regenerated from the source at build time.",
  },
  {
    axis: "Failure mode",
    outside: "Can occasionally take a wrong action, and relies on verification and recovery to catch and repair it. The benefit is broader coverage.",
    inside: "Refuses at generation time when it is uncertain, so its failures are missing capabilities instead of wrong ones. The cost is a limit on coverage.",
  },
  {
    axis: "Best domain",
    outside: "The open web and third-party systems that have no API and no source available.",
    inside: "Backends whose source code you own.",
  },
];

export default function Landscape() {
  return (
    <>
      <PageHeader eyebrow="Approach" title="Two ways to make an existing system usable by agents">
        To put an AI agent in front of an existing system, you can work from the outside by driving
        the running system and observing its behavior, or from the inside by reading the source you
        own and verifying its structure. Tibyaan takes the inside-out approach. This page compares
        the two approaches in general terms. It doesn't name any product or pick a winner.
      </PageHeader>

      {/* convergence */}
      <Section id="convergence">
        <Eyebrow>What they share</Eyebrow>
        <H2>Both approaches arrive at a small, typed, pre-verified tool interface</H2>
        <div className="mt-8 max-w-[74ch] space-y-5 text-[16px] leading-relaxed text-fg-soft">
          <p>
            The outside-in and inside-out approaches were built independently, and they reach the
            same design. Neither one hands the agent the raw surface, whether that is a web page or
            source code. Both map the system ahead of time into a small, typed set of tools that
            are verified before they are served, and both expose those tools over MCP, the open
            protocol agents use to call tools.
          </p>
          <p>
            Two approaches reaching the same design, one with access to the source and one without,
            is some evidence that the design is sound. It isn't evidence of anything beyond that.
          </p>
        </div>
      </Section>

      {/* the two approaches */}
      <Section id="axes" tint>
        <Eyebrow>Comparison</Eyebrow>
        <H2>How the two approaches differ</H2>
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
                  Inside-out (verify), Tibyaan
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
        <Eyebrow>When to use which</Eyebrow>
        <H2>The right approach depends on whether you can read the source</H2>
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="card space-y-4 p-7 text-[15.5px] leading-relaxed text-fg-soft">
            <div className="label">A system you can't read</div>
            <p>
              For a system you can't read, such as a third-party site with no API, observing it as a
              black box is the only option. Inferring its behavior and then testing the inference is
              the correct method there, because the guess can't be avoided and verification limits
              how wrong it can be.
            </p>
            <p>
              Tibyaan can't run on a system like that, because it has no source to read.
            </p>
          </div>
          <div className="card space-y-4 p-7 text-[15.5px] leading-relaxed text-fg-soft">
            <div className="label" style={{ color: "var(--accent)" }}>A backend you own</div>
            <p>
              For a backend you own, the source code defines what the system does, and reading it
              gives stronger evidence than observing behavior from outside. Verifying from code
              structure removes the guess, while testing from outside can only limit how wrong it
              is.
            </p>
            <p>
              Which trade-off is right depends on how much damage a mistake can do. A failed task on
              a consumer website can be retried at little cost, so broad coverage with recovery fits
              there. In a business backend, reading the wrong entity into an agent's context without
              anyone noticing is the failure Tibyaan is built to prevent, so refusing uncertain reads
              fits here.
            </p>
          </div>
        </div>
        <p className="mt-10 max-w-[74ch] text-[15px] leading-relaxed text-muted">
          The repository has a full, sourced comparison against a specific external system. It marks
          that system's claims as vendor claims and cites the sources for Tibyaan's. See{" "}
          <ExtLink href={LINKS.landscapeDoc} className="prose-link">
            docs/competitive-landscape.md
          </ExtLink>
          .
        </p>
        <p className="mt-8">
          <Link href="/how-it-works/" className="link-arrow text-[15px]">
            How the inside-out approach works <Arrow />
          </Link>
        </p>
      </Section>
    </>
  );
}
