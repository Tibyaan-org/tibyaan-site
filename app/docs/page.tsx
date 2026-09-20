import type { Metadata } from "next";
import Link from "next/link";
import { DocPage, H2, Callout, DocTable } from "../_components/docs/doc";
import { IC, ExtLink, Arrow } from "../_components/ui";
import { DOCS_NAV } from "../_content/docs-nav";
import { LINKS, META } from "../_content/claims";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "What Tibyaan is, the three states a capability can be in, the four surfaces you use, and the path through the docs.",
  alternates: { canonical: "/docs/" },
};

export default function Docs() {
  return (
    <DocPage
      href="/docs/"
      title="Introduction"
      lead="Tibyaan reads a Spring application you already run, proves which read operations are safe to hand to an AI agent, and serves them over MCP from inside your own app. These docs take you from a read-only preview to a connected agent."
      toc={[
        { id: "what", label: "What it is" },
        { id: "states", label: "Proven, refused, attested" },
        { id: "surfaces", label: "The four surfaces" },
        { id: "path", label: "The intended path" },
        { id: "map", label: "Everything in the docs" },
        { id: "deep", label: "The design record" },
      ]}
    >
      <H2 id="what">What it is</H2>
      <p>
        Tibyaan is a build-time tool and a small runtime. The tool parses your application's source,
        builds a neutral model of the entities and read operations it can prove, and generates two
        outputs from that one model: an MCP tool manifest and an OpenAPI 3.0 document. The runtime is
        a dependency inside your Spring Boot app that reads the manifest at startup and serves one
        MCP tool per capability, each calling the real service method it is bound to.
      </p>
      <p>
        Your code is never modified. Nothing is hosted by anyone else: there is no Tibyaan service
        in the path at runtime. Remove the dependency and the build plugin and the layer is gone.
      </p>

      <H2 id="states">Proven, refused, attested</H2>
      <p>Every read Tibyaan looks at ends up in exactly one of three states.</p>
      <DocTable
        head={["State", "What it means", "What ships"]}
        rows={[
          [
            <strong key="a">Proven</strong>,
            "The code's structure shows which real method backs the read, on which entity, returning what. Today that covers read-by-id and the unfiltered list.",
            "A verified tool, in the manifest and the OpenAPI document.",
          ],
          [
            <strong key="b">Refused</strong>,
            "The structure does not decide the case: no backing method, two candidates, no usable identifier, a filter whose meaning is a claim. The tool never guesses.",
            "Nothing. The survey names the read, the reason, and the file.",
          ],
          [
            <strong key="c">Attested</strong>,
            "A named person asserts what a refused read means, in a committed file. The tool still proves everything around the claim and fingerprints the code it was asserted against.",
            <>
              A tool whose name starts with <IC>attested_</IC>, labeled human-attested everywhere,
              never counted as verified.
            </>,
          ],
        ]}
      />
      <Callout title="Expect refusals">
        <p>
          A large, layered application becomes a small verified subset plus a long, named list of
          refusals. That is the tool working. The number to watch is <IC>mis-bound</IC>, and it must
          stay 0.
        </p>
      </Callout>

      <H2 id="surfaces">The four surfaces</H2>
      <DocTable
        head={["Surface", "You use it to", "Entry point"]}
        rows={[
          [
            <Link key="cli" href="/docs/cli/" className="prose-link">CLI</Link>,
            "Survey an app read-only, and produce artifacts by hand.",
            <IC key="c1" wrap>{`java -jar tibyan-cli-${META.version}-jar-with-dependencies.jar`}</IC>,
          ],
          [
            <Link key="mp" href="/docs/maven-plugin/" className="prose-link">Maven plugin</Link>,
            "Generate the manifest automatically at build time.",
            <IC key="c2">tibyan-maven-plugin</IC>,
          ],
          [
            <Link key="rt" href="/docs/runtime/" className="prose-link">Spring runtime</Link>,
            "Host the MCP server inside your app's own process.",
            <IC key="c3">tibyan-runtime-spring</IC>,
          ],
          [
            <Link key="at" href="/docs/attestation/" className="prose-link">Attestations file</Link>,
            "Carry reads the tool cannot prove, as reviewed human claims.",
            <IC key="c4">tibyan/attestations.json</IC>,
          ],
        ]}
      />
      <p>
        Most adopters never touch the CLI in production. The plugin runs the same pipeline during
        your build, and the runtime serves what it produced. The CLI is for the preview, for
        surveys, and for inspection.
      </p>

      <H2 id="path">The intended path</H2>
      <ol>
        <li>
          <strong>Preview.</strong> Run <IC>scan</IC> against your source. It is read-only and
          changes nothing.
        </li>
        <li>
          <strong>Read the survey.</strong> Decide from the evidence. If it discovers nothing
          useful, stop: you have spent no build changes to learn it.
        </li>
        <li>
          <strong>Adopt.</strong> Add the runtime dependency and the build plugin to your{" "}
          <IC>pom.xml</IC>, then <IC>mvn package</IC>.
        </li>
        <li>
          <strong>Connect</strong> an agent to <IC>http://localhost:8080/sse</IC>, after you have
          read the security page.
        </li>
      </ol>
      <p>
        <Link href="/docs/getting-started/" className="link-arrow">
          Start the quickstart <Arrow />
        </Link>
      </p>

      <H2 id="map">Everything in the docs</H2>
      {DOCS_NAV.map((g) => (
        <div key={g.heading} className="mt-7">
          <div className="label">{g.heading}</div>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {g.links
              .filter((l) => l.href !== "/docs/")
              .map((l) => (
                <Link key={l.href} href={l.href} className="card block p-5 no-underline">
                  <div className="text-[15px] font-semibold text-fg">{l.title}</div>
                  <div className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{l.blurb}</div>
                </Link>
              ))}
          </div>
        </div>
      ))}

      <H2 id="deep">The design record</H2>
      <p>
        These pages are the adopter-facing layer. The full design, seventeen volumes, the
        architecture decisions, and the dated benchmark ledgers, lives in the{" "}
        <ExtLink href={LINKS.docs} className="prose-link">
          repository
        </ExtLink>{" "}
        and is linked rather than mirrored, so it cannot drift from the source of truth. Release
        notes are in the{" "}
        <ExtLink href={LINKS.changelog} className="prose-link">
          changelog
        </ExtLink>
        .
      </p>
    </DocPage>
  );
}
