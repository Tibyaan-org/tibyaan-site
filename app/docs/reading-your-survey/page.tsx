import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { DocPage, H2, Callout, DocTable } from "../../_components/docs/doc";
import { Frame, CodeBlock, IC, ExtLink } from "../../_components/ui";
import { Highlight } from "../../_components/Highlight";
import { REFUSAL_CAUSES, LINKS, META } from "../../_content/claims";
import { SURVEY_PROVENANCE } from "../../_content/survey";

export const metadata: Metadata = {
  title: "Reading your survey",
  description:
    "What every line of the tibyan scan output means: discovered reads, each refusal cause, skipped files, partial models, and the totals line ending in mis-bound 0.",
  alternates: { canonical: "/docs/reading-your-survey/" },
};

// Verbatim, read at build time. See app/_content/generated/README.md.
const SURVEY_TEXT = fs
  .readFileSync(path.join(process.cwd(), "app/_content/generated/erp-survey.txt"), "utf8")
  .replace(/\r\n/g, "\n")
  .replace(/\n+$/, "");

const JAR = `tibyan-cli-${META.cliVersionExample}-jar-with-dependencies.jar`;

export default function ReadingYourSurvey() {
  return (
    <DocPage
      href="/docs/reading-your-survey/"
      title="Reading your survey"
      lead="The survey is the whole picture: what Tibyaan can prove about your app, what it refused, and exactly why. It is written for you, to decide whether to adopt. Here is how to read it."
      toc={[
        { id: "example", label: "A real survey" },
        { id: "discovered", label: "Discovered" },
        { id: "refusals", label: "Refusal causes" },
        { id: "totals", label: "The totals line" },
        { id: "report", label: "A shareable report" },
        { id: "scan-vs-generate", label: "scan versus generate" },
      ]}
      source={{ label: "docs/CLI.md", href: LINKS.cliDoc }}
    >
      <H2 id="example">A real survey</H2>
      <p>
        This is the output of a real scan, unedited. Lines that start with <IC>+</IC> are proven
        reads. Lines that start with <IC>-</IC> are refusals, each with its cause in brackets and a
        located reason.
      </p>
      <Frame
        barLabel={SURVEY_PROVENANCE.command}
        flat
        caption={
          <>
            Unedited output of the ERP benchmark survey ({SURVEY_PROVENANCE.date}). Elisions are
            marked in the text and only shorten the discovered lists; every refusal is shown in
            full. The per-entity ledger is{" "}
            <ExtLink href={LINKS.erpLedger} className="prose-link">
              public
            </ExtLink>
            .
          </>
        }
      >
        <pre className="code code-scroll">
          <code>
            <Highlight text={SURVEY_TEXT} lang="survey" />
          </code>
        </pre>
      </Frame>

      <H2 id="discovered">Discovered</H2>
      <p>
        A discovered line names the capability, the entity, and the binding: the real class and
        method the tool will call. Two kinds of read are discovered today.
      </p>
      <ul>
        <li>
          <strong>by-id</strong>: a read of one entity by its primary key, for example{" "}
          <IC>getContact</IC> bound to <IC>ContactServiceImpl#findById</IC>.
        </li>
        <li>
          <strong>list</strong>: the unfiltered list of an entity, for example <IC>listAccount</IC>{" "}
          bound to <IC>AccountServiceImpl#findAll</IC>. A <IC>(paged)</IC> mark means the read
          returns a page, and the generated description says the page envelope is not modeled.
        </li>
      </ul>
      <p>
        A <IC>(partial: N fields skipped)</IC> mark means some fields of the source entity are not
        represented in the model. The binding is still proven. The omission is disclosed rather than
        hidden: the generated OpenAPI schema names the fields that were left out.
      </p>

      <H2 id="refusals">Refusal causes</H2>
      <p>
        Every refusal carries one cause. None of them is an error in your code: each is the tool
        declining to guess.
      </p>
      <DocTable
        head={["Cause", "What it means"]}
        rows={REFUSAL_CAUSES.map((c) => [<IC key={c.code}>{c.code}</IC>, c.plain])}
      />
      <p>
        Files that would not parse are listed separately as skipped-by-parse, each one named. The
        scan never aborts on a bad file, and a partial result never passes itself off as a complete
        one.
      </p>
      <Callout title="What is never discovered, by design">
        <p>
          Writes and actions, and filtered reads such as <IC>findByStatus</IC> or <IC>search</IC>.
          A filter's meaning is a claim the tool cannot verify from structure, so it is not
          presented as verified. A person can carry such a read through{" "}
          <Link href="/docs/attestation/" className="prose-link">
            attestation
          </Link>
          .
        </p>
      </Callout>

      <H2 id="totals">The totals line</H2>
      <p>The last line summarises the run:</p>
      <CodeBlock label="totals" copy={false}>{`discovered N (by-id A, list B), failed, list-refused, skipped-by-parse, partial, mis-bound`}</CodeBlock>
      <DocTable
        head={["Field", "Read it as"]}
        rows={[
          [<IC key="1">discovered</IC>, "Proven reads, split into by-id and list. These are what would ship."],
          [<IC key="2">failed</IC>, "Entities whose read-by-id was refused, broken down by cause."],
          [<IC key="3">list-refused</IC>, "Entities whose list read was refused."],
          [<IC key="4">skipped-by-parse</IC>, "Source files that could not be parsed. Each is named above."],
          [<IC key="5">partial</IC>, "Entities modeled with some fields left out, with the count of fields skipped."],
          [
            <IC key="6">mis-bound</IC>,
            "Tools bound to the wrong method. This is the absolute bar: it must be 0, on every run.",
          ],
        ]}
      />
      <p>
        When your project has an attestations file, the survey also reports attested entries and
        drafts as their own classes. They are counted apart and never summed into the discovered
        total.
      </p>

      <H2 id="report">A shareable report</H2>
      <p>
        Add <IC>--report</IC> to write the same survey as Markdown: a summary table, the operable
        subset with its bindings, the refusals grouped with their located reasons, and the single
        most common blocker. It is read-only, like the scan itself.
      </p>
      <CodeBlock label="shell" lang="shell">{`java -jar ${JAR} scan /path/to/your-app --report survey.md`}</CodeBlock>
      <p>
        If you ran the preview on a real application, the maintainer would like to see the numbers:
        every real survey shapes what gets built next. The address is on the{" "}
        <Link href="/docs/security/" className="prose-link">
          security page
        </Link>
        .
      </p>

      <H2 id="scan-vs-generate">scan versus generate</H2>
      <p>They do two different jobs, which is why one shows more than the other.</p>
      <ul>
        <li>
          <strong>scan is the survey.</strong> It prints everything: every discovered capability,
          every refusal with its cause, every skipped file.
        </li>
        <li>
          <strong>generate and the Maven plugin produce the artifact.</strong> They emit only the
          proven capabilities, because the manifest is what an agent will act on. A refusal is a
          deliberate absence from the artifact.
        </li>
      </ul>
      <p>
        If you only ran <IC>generate</IC> and wonder where a read went, run <IC>scan</IC> to see the
        reason.
      </p>
    </DocPage>
  );
}
