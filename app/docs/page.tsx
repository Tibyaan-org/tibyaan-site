import type { Metadata } from "next";
import Link from "next/link";
import { DocPage, H2, Callout, DocTable } from "../_components/docs/doc";
import { IC, ExtLink, Arrow } from "../_components/ui";
import { DOCS_NAV } from "../_content/docs-nav";
import { LINKS, META } from "../_content/claims";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "An overview of Tibyaan: the three states a read can end up in, the four parts you work with, and where to start in the docs.",
  alternates: { canonical: "/docs/" },
};

export default function Docs() {
  return (
    <DocPage
      href="/docs/"
      title="Introduction"
      lead="Tibyaan reads the source of a Spring application you already run, works out which read operations it can verify, and serves them to AI agents over MCP from inside your app. These docs take you from a read-only scan to a connected agent."
      toc={[
        { id: "what", label: "What it is" },
        { id: "states", label: "Verified, refused, attested" },
        { id: "surfaces", label: "The four parts" },
        { id: "path", label: "The intended path" },
        { id: "map", label: "Everything in the docs" },
        { id: "deep", label: "Design documents" },
      ]}
    >
      <H2 id="what">What it is</H2>
      <p>
        Tibyaan is a build-time tool and a small runtime. The tool parses your application's source
        and builds a model of the entities and read operations it can verify. From that model it
        generates two outputs: an MCP tool manifest and an OpenAPI 3.0 document. The runtime is a
        dependency you add to your Spring Boot app. It reads the manifest at startup and serves one
        MCP tool per capability, and each tool calls the service method it is bound to.
      </p>
      <p>
        Tibyaan doesn't modify your code, and no hosted Tibyaan service is involved at runtime. To
        remove it, delete the dependency and the build plugin.
      </p>

      <H2 id="states">Verified, refused, attested</H2>
      <p>Every read Tibyaan looks at ends up in one of three states.</p>
      <DocTable
        head={["State", "What it means", "What ships"]}
        rows={[
          [
            <strong key="a">Verified</strong>,
            "The code's structure shows which method backs the read, which entity it reads, and what it returns. Today this covers read-by-id and the unfiltered list.",
            "A verified tool, in the manifest and the OpenAPI document.",
          ],
          [
            <strong key="b">Refused</strong>,
            "The code's structure doesn't settle the case. For example, there is no backing method, there are two candidate methods, there is no usable identifier, or the read has a filter whose meaning can't be checked from the code.",
            "Nothing. The survey lists the read with the reason.",
          ],
          [
            <strong key="c">Attested</strong>,
            "A named person states what a refused read means, in a committed file. The tool still checks everything else about the read and fingerprints the code the statement was made against.",
            <>
              A tool whose name starts with <IC>attested_</IC>. It is labeled human-attested
              wherever it appears and isn't counted as verified.
            </>,
          ],
        ]}
      />
      <Callout title="Expect refusals">
        <p>
          A large, layered application produces a small set of verified capabilities and a long
          list of refusals, each with its reason. This is expected. The count to check is{" "}
          <IC>mis-bound</IC>, which must stay 0.
        </p>
      </Callout>

      <H2 id="surfaces">The four parts</H2>
      <DocTable
        head={["Part", "You use it to", "Entry point"]}
        rows={[
          [
            <Link key="cli" href="/docs/cli/" className="prose-link">CLI</Link>,
            "Run a read-only scan of an app, and generate the output files by hand.",
            <IC key="c1" wrap>{`java -jar tibyan-cli-${META.version}-jar-with-dependencies.jar`}</IC>,
          ],
          [
            <Link key="mp" href="/docs/maven-plugin/" className="prose-link">Maven plugin</Link>,
            "Generate the manifest during your build.",
            <IC key="c2">tibyan-maven-plugin</IC>,
          ],
          [
            <Link key="rt" href="/docs/runtime/" className="prose-link">Spring runtime</Link>,
            "Host the MCP server inside your app's own process.",
            <IC key="c3">tibyan-runtime-spring</IC>,
          ],
          [
            <Link key="at" href="/docs/attestation/" className="prose-link">Attestations file</Link>,
            "Add reads the tool can't verify, as reviewed human attestations.",
            <IC key="c4">tibyan/attestations.json</IC>,
          ],
        ]}
      />
      <p>
        Most adopters don't use the CLI in production. The plugin runs the same pipeline during
        your build, and the runtime serves what it produced. Use the CLI to preview an app and to
        inspect the results.
      </p>

      <H2 id="path">The intended path</H2>
      <ol>
        <li>
          <strong>Preview.</strong> Run <IC>scan</IC> against your source. The scan is read-only.
        </li>
        <li>
          <strong>Read the survey.</strong> If it finds nothing useful for your app, you can stop
          here without having changed your build.
        </li>
        <li>
          <strong>Adopt.</strong> Add the runtime dependency and the build plugin to your{" "}
          <IC>pom.xml</IC>, then run <IC>mvn package</IC>.
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

      <H2 id="deep">Design documents</H2>
      <p>
        These pages cover what you need to adopt Tibyaan. The full design (seventeen volumes), the
        architecture decisions, and the dated benchmark ledgers are in the{" "}
        <ExtLink href={LINKS.docs} className="prose-link">
          repository
        </ExtLink>
        . This site links to them, so there is only one copy to keep up to date. Release notes are
        in the{" "}
        <ExtLink href={LINKS.changelog} className="prose-link">
          changelog
        </ExtLink>
        .
      </p>
    </DocPage>
  );
}
