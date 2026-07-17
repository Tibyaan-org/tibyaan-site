import type { Metadata } from "next";
import Link from "next/link";
import { Section, Eyebrow, H2, Lead, ExtLink } from "../../_components/ui";
import { LINKS } from "../../_content/claims";

export const metadata: Metadata = {
  title: "Security",
  description:
    "The v1 security posture, stated plainly: the generated layer executes real methods against real data, is read-only by design, adds no auth of its own, and the operator must gate the endpoint.",
  alternates: { canonical: "/docs/security/" },
};

export default function Security() {
  return (
    <>
      <header className="mx-auto max-w-[1160px] px-6 md:px-8">
        <div className="py-[clamp(56px,9vh,96px)]" style={{ borderBottom: "1px solid var(--color-border)" }}>
          <Eyebrow>Security posture (v1)</Eyebrow>
          <h1
            className="m-0 max-w-[22ch] font-serif text-[clamp(38px,5.4vw,72px)] font-medium leading-[1.04]"
            style={{ letterSpacing: "-0.02em" }}
          >
            Read this before you expose anything.
          </h1>
          <Lead className="mt-7">
            Tibyaan generates a layer that executes real code in your application. This page states
            plainly what that means, what v1 protects, and what it deliberately leaves to you. The
            authoritative text is{" "}
            <ExtLink href={LINKS.security} className="footer-link underline">
              docs/SECURITY.md
            </ExtLink>{" "}
            in the repository.
          </Lead>
        </div>
      </header>

      {/* what exposing does */}
      <Section id="what">
        <Eyebrow n="01">What exposing tools actually does</Eyebrow>
        <H2>Real methods, real data, in your own process.</H2>
        <div className="mt-8 max-w-[74ch] space-y-5 text-[16px] leading-relaxed text-body-strong">
          <p>
            The generated MCP server runs inside your application's own process and calls your real
            service methods against your real data. A tool named{" "}
            <span style={{ fontFamily: "var(--font-mono)" }}>getProduct</span> invokes the actual{" "}
            <span style={{ fontFamily: "var(--font-mono)" }}>ProductService#findById</span> bean and
            returns the actual product.
          </p>
          <p>
            There is no sandbox and no copy: an agent that can reach the MCP endpoint can invoke every
            exposed capability with the same access your service methods already have.
          </p>
        </div>
      </Section>

      {/* read-only boundary */}
      <Section id="read-only" tint>
        <Eyebrow n="02">The read-only boundary, and why it exists</Eyebrow>
        <H2>v1 serves reads only. Writes are refused at discovery, not merely turned off.</H2>
        <div className="mt-8 max-w-[74ch] space-y-5 text-[16px] leading-relaxed text-body-strong">
          <p>
            Write and action capabilities are refused at the discovery level, so a write is never
            generated into the manifest in the first place. This is deliberate: exposing a method that
            changes data to an autonomous agent is a different risk class from exposing a read, and it
            needs an explicit policy gate, which capabilities may be exposed, to whom, under what
            conditions, that v1 does not have.
          </p>
          <p>
            Until that gate exists, the honest default is to expose nothing that mutates state. If a
            future version adds writes, they will be off by default and gated, never silently enabled.
          </p>
        </div>
      </Section>

      {/* the gate is yours */}
      <Section id="gate">
        <Eyebrow n="03">What you must gate</Eyebrow>
        <H2>The layer inherits your process. It adds no auth of its own.</H2>
        <div className="mt-8 max-w-[74ch] space-y-5 text-[16px] leading-relaxed text-body-strong">
          <p>
            The layer inherits your application's process, its database connections, and its data
            access. It does not add an authentication or authorization layer of its own. There is no
            auth in v1. That makes network exposure of the MCP endpoint your decision, and the most
            important one.
          </p>
        </div>
        <ul className="mt-6 flex max-w-[74ch] flex-col gap-4">
          {[
            "Do not expose the MCP endpoint (/sse on the app's HTTP port) to an untrusted network. Treat it as you would an unauthenticated admin console.",
            "Bind it to localhost, or keep it behind your existing network controls, VPN, or an authenticating reverse proxy that you operate. Put your organization's existing authentication in front of it.",
            "A capability your app already protects with its own security is not automatically protected here, because the tool calls the service method directly. Assume every exposed read is reachable by anyone who can reach the endpoint, and gate the endpoint accordingly.",
          ].map((t, i) => (
            <li key={i} className="flex gap-3 text-[15.5px] leading-relaxed text-body">
              <span style={{ fontFamily: "var(--font-mono)", color: "var(--color-sienna)" }} aria-hidden="true">
                {"->"}
              </span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* fail-loud scope */}
      <Section id="fail-loud" tint>
        <Eyebrow n="04">What fail-loud does and does not protect</Eyebrow>
        <H2>It guarantees the binding is honest. It does not decide who may call it.</H2>
        <div className="mt-8 max-w-[74ch] space-y-5 text-[16px] leading-relaxed text-body-strong">
          <p>
            The fail-loud, never-guess discipline protects the integrity of the mapping: a generated
            tool is bound only to a method Tibyaan structurally proved backs it, so a tool does not
            silently call the wrong method or the wrong entity's data. Across three real benchmark
            apps this held with zero wrong bindings. That is a correctness guarantee about what each
            tool does.
          </p>
          <p>
            It is not an access-control guarantee. Fail-loud does not authenticate callers, does not
            authorize actions, and does not rate-limit or audit. It ensures the tools are honest about
            what they do; it does not decide who may call them. That decision is yours, and it is the
            network and process boundary above.
          </p>
        </div>
        <p className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
          <Link href="/docs/getting-started/" className="btn-secondary text-[15px]">
            Back to getting started
          </Link>
          <a href={LINKS.contact} className="btn-secondary text-[15px]">
            Report a vulnerability
          </a>
        </p>
      </Section>
    </>
  );
}
