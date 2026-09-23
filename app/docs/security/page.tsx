import type { Metadata } from "next";
import Link from "next/link";
import { DocPage, H2, Callout } from "../../_components/docs/doc";
import { IC } from "../../_components/ui";
import { LINKS } from "../../_content/claims";

export const metadata: Metadata = {
  title: "Security",
  description:
    "The v1 security model. The generated layer calls your application's own service methods against its own data, serves reads only, and adds no authentication of its own. You must gate the endpoint yourself.",
  alternates: { canonical: "/docs/security/" },
};

export default function Security() {
  return (
    <DocPage
      href="/docs/security/"
      title="Security"
      lead="Read this page before you expose anything. Tibyaan generates a layer that runs code inside your application. This page explains what that means, what v1 protects, and what it leaves to you."
      toc={[
        { id: "what", label: "What exposing tools does" },
        { id: "read-only", label: "Why v1 is read-only" },
        { id: "gate", label: "What you must gate" },
        { id: "declared", label: "Declared authorities" },
        { id: "attested", label: "Attested capabilities" },
        { id: "fail-loud", label: "What verification does and doesn't cover" },
        { id: "report", label: "Reporting a vulnerability" },
      ]}
      source={{ label: "docs/SECURITY.md", href: LINKS.security }}
    >
      <H2 id="what">What exposing tools does</H2>
      <p>
        The generated MCP server runs inside your application's own process and calls your service
        methods against your data. A tool named <IC>getProduct</IC> invokes your{" "}
        <IC>ProductService#findById</IC> bean and returns the product it loads.
      </p>
      <p>
        There is no sandbox and no copy of the data. An agent that can reach the MCP endpoint can
        invoke every exposed capability with the same access your service methods already have.
      </p>

      <H2 id="read-only">Why v1 is read-only</H2>
      <p>
        v1 serves reads only. Writes and actions are left out during discovery, so a write never
        reaches the manifest. Exposing a method that changes data to an autonomous
        agent is a different class of risk from exposing a read. It needs an explicit policy gate
        (which capabilities may be exposed, to whom, and under what conditions), and v1 doesn't
        have one.
      </p>
      <p>
        Until that gate exists, Tibyaan exposes nothing that changes state. If a future version
        adds writes, they will be gated and off by default, so they won't be enabled unless you
        turn them on.
      </p>

      <H2 id="gate">What you must gate</H2>
      <p>
        The layer inherits your application's process, its database connections, and its data
        access. It doesn't add an authentication or authorization layer of its own. There is no
        authentication in v1. Whether the MCP endpoint is reachable over the network is your
        decision, and it is the most important one.
      </p>
      <ul>
        <li>
          Don't expose the MCP endpoint (<IC>/sse</IC> on the app's HTTP port) to an untrusted
          network. Treat it as you would an unauthenticated admin console.
        </li>
        <li>
          Bind it to localhost, or keep it behind your existing network controls, VPN, or an
          authenticating reverse proxy that you operate. Put your organization's existing
          authentication in front of it.
        </li>
        <li>
          A capability your app already protects with its own security isn't automatically
          protected here, because the tool calls the service method directly. Assume every exposed
          read is reachable by anyone who can reach the endpoint, and gate the endpoint accordingly.
        </li>
      </ul>

      <H2 id="declared">Declared authorities</H2>
      <p>
        The manifest can carry the security contract your application declares on its own
        endpoints. A capability may list <IC>requiredAuthorities</IC>, or it may be marked{" "}
        <IC>securityUnverifiable</IC> when a declaration exists that the tool couldn't compile
        completely. If a capability has neither, that doesn't mean the read is unprotected,
        because this analysis can't see URL-level rules in your security filter chain.
      </p>
      <p>
        The runtime still enforces nothing. The manifest carries the declared contract so that your
        own enforcement layer, the gateway in front of the MCP endpoint, can apply it before it
        invokes a capability. The three states are described in the{" "}
        <Link href="/docs/runtime/#authorities" className="prose-link">
          runtime reference
        </Link>
        .
      </p>

      <H2 id="attested">Attested capabilities</H2>
      <p>
        A human-attested capability runs the same way as a verified one, with the same access. The
        label changes what the tool claims about a call. It doesn't change how the call is made.
        The person who asserted the claim is responsible for whether it is true. The tool
        guarantees that the claim ships unchanged, that it is labeled as human-attested, and that
        it is refused with an error when the code it covers changes.
      </p>
      <p>
        Two defaults limit what is exposed. Attested reads whose declared security the tool
        couldn't compile don't register unless you opt in, and neither do boundary attestations.
        Setting{" "}
        <IC>tibyan.attested.expose=false</IC> exposes verified capabilities only. See{" "}
        <Link href="/docs/attestation/#owns" className="prose-link">
          who owns what
        </Link>
        .
      </p>

      <H2 id="fail-loud">What verification does and doesn't cover</H2>
      <p>
        When Tibyaan can't verify a binding from the code structure, it refuses the read. This
        protects the mapping between tools and methods. A generated tool is bound
        only to a method that Tibyaan has verified backs it, so a tool doesn't call the wrong
        method or return the wrong entity's data. This is a correctness guarantee about what each
        tool does.
      </p>
      <Callout title="Verification isn't access control">
        <p>
          Verification doesn't authenticate callers, authorize actions, rate-limit, or audit. It
          makes sure each tool does what it says it does. It doesn't decide who may call the
          tools. That decision is yours, and you enforce it at the network and process boundary
          described above.
        </p>
      </Callout>

      <H2 id="report">Reporting a vulnerability</H2>
      <p>
        Please report suspected security issues privately to the maintainer by{" "}
        <a href={LINKS.contact} className="prose-link">
          email
        </a>
        . Don't open a public issue for them, and allow reasonable time for a fix before any
        public disclosure.
      </p>
    </DocPage>
  );
}
