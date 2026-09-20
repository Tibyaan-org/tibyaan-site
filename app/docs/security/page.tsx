import type { Metadata } from "next";
import Link from "next/link";
import { DocPage, H2, Callout } from "../../_components/docs/doc";
import { IC } from "../../_components/ui";
import { LINKS } from "../../_content/claims";

export const metadata: Metadata = {
  title: "Security",
  description:
    "The v1 security posture, stated plainly: the generated layer executes real methods against real data, is read-only by design, adds no auth of its own, and the operator must gate the endpoint.",
  alternates: { canonical: "/docs/security/" },
};

export default function Security() {
  return (
    <DocPage
      href="/docs/security/"
      title="Security"
      lead="Read this before you expose anything. Tibyaan generates a layer that executes real code in your application. This page states plainly what that means, what v1 protects, and what it deliberately leaves to you."
      toc={[
        { id: "what", label: "What exposing tools does" },
        { id: "read-only", label: "The read-only boundary" },
        { id: "gate", label: "What you must gate" },
        { id: "declared", label: "Declared authorities" },
        { id: "attested", label: "Attested capabilities" },
        { id: "fail-loud", label: "What fail-loud protects" },
        { id: "report", label: "Reporting a vulnerability" },
      ]}
      source={{ label: "docs/SECURITY.md", href: LINKS.security }}
    >
      <H2 id="what">What exposing tools actually does</H2>
      <p>
        The generated MCP server runs inside your application's own process and calls your real
        service methods against your real data. A tool named <IC>getProduct</IC> invokes the actual{" "}
        <IC>ProductService#findById</IC> bean and returns the actual product.
      </p>
      <p>
        There is no sandbox and no copy: an agent that can reach the MCP endpoint can invoke every
        exposed capability with the same access your service methods already have.
      </p>

      <H2 id="read-only">The read-only boundary, and why it exists</H2>
      <p>
        v1 serves reads only. Write and action capabilities are refused at the discovery level, so a
        write is never generated into the manifest in the first place. This is deliberate: exposing
        a method that changes data to an autonomous agent is a different risk class from exposing a
        read, and it needs an explicit policy gate (which capabilities may be exposed, to whom,
        under what conditions) that v1 does not have.
      </p>
      <p>
        Until that gate exists, the honest default is to expose nothing that mutates state. If a
        future version adds writes, they will be off by default and gated, never silently enabled.
      </p>

      <H2 id="gate">What you must gate</H2>
      <p>
        The layer inherits your application's process, its database connections, and its data
        access. It does not add an authentication or authorization layer of its own. There is no
        auth in v1. That makes network exposure of the MCP endpoint your decision, and the most
        important one.
      </p>
      <ul>
        <li>
          Do not expose the MCP endpoint (<IC>/sse</IC> on the app's HTTP port) to an untrusted
          network. Treat it as you would an unauthenticated admin console.
        </li>
        <li>
          Bind it to localhost, or keep it behind your existing network controls, VPN, or an
          authenticating reverse proxy that you operate. Put your organization's existing
          authentication in front of it.
        </li>
        <li>
          A capability your app already protects with its own security is not automatically
          protected here, because the tool calls the service method directly. Assume every exposed
          read is reachable by anyone who can reach the endpoint, and gate the endpoint accordingly.
        </li>
      </ul>

      <H2 id="declared">The declared authority contract</H2>
      <p>
        The manifest can carry the security contract your application declares on its own
        endpoints: a capability may list <IC>requiredAuthorities</IC>, or be marked{" "}
        <IC>securityUnverifiable</IC> when a declaration exists that the tool could not compile
        completely. Neither being present is not a statement that the read is unprotected: URL-level
        rules in your security filter chain are invisible to this analysis.
      </p>
      <p>
        What does not change: the runtime still enforces nothing. The declared contract is carried
        so that your own enforcement layer, the gateway in front of the MCP endpoint, can apply it
        before invoking a capability. The three states are spelled out in the{" "}
        <Link href="/docs/runtime/#authorities" className="prose-link">
          runtime reference
        </Link>
        .
      </p>

      <H2 id="attested">Attested capabilities</H2>
      <p>
        A human-attested capability executes exactly like a verified one, with the same access. The
        label changes what the tool claims about a call, never how the call is made. The asserter
        owns the claim's truth; the tool guarantees faithful carriage, labeling, and loud
        invalidation when the code changes.
      </p>
      <p>
        Two defaults protect you: attested reads whose declared security the tool could not compile
        do not register, and boundary attestations do not register, unless you opt in. Setting{" "}
        <IC>tibyan.attested.expose=false</IC> gives a verified-only surface. See{" "}
        <Link href="/docs/attestation/#owns" className="prose-link">
          who owns what
        </Link>
        .
      </p>

      <H2 id="fail-loud">What fail-loud does and does not protect</H2>
      <p>
        The fail-loud, never-guess discipline protects the integrity of the mapping: a generated
        tool is bound only to a method Tibyaan structurally proved backs it, so a tool does not
        silently call the wrong method or the wrong entity's data. That is a correctness guarantee
        about what each tool does.
      </p>
      <Callout title="It is not an access-control guarantee">
        <p>
          Fail-loud does not authenticate callers, does not authorize actions, and does not
          rate-limit or audit. It ensures the tools are honest about what they do; it does not
          decide who may call them. That decision is yours, and it is the network and process
          boundary above.
        </p>
      </Callout>

      <H2 id="report">Reporting a vulnerability</H2>
      <p>
        Please report suspected security issues privately to the maintainer by{" "}
        <a href={LINKS.contact} className="prose-link">
          email
        </a>{" "}
        rather than opening a public issue, and allow reasonable time for a fix before any public
        disclosure.
      </p>
    </DocPage>
  );
}
