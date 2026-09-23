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
    "What each part of the tibyan scan output means: discovered reads, refusal causes, skipped files, partial models, and the totals line ending in mis-bound 0.",
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
      lead="The survey is the output of a scan. It lists the reads Tibyaan verified in your app, the reads it refused, and the reason for each refusal. This page explains each part so you can decide whether to adopt."
      toc={[
        { id: "example", label: "Example survey" },
        { id: "discovered", label: "Discovered" },
        { id: "refusals", label: "Refusal causes" },
        { id: "totals", label: "The totals line" },
        { id: "report", label: "Markdown report" },
        { id: "scan-vs-generate", label: "scan versus generate" },
      ]}
      source={{ label: "docs/CLI.md", href: LINKS.cliDoc }}
    >
      <H2 id="example">Example survey</H2>
      <p>
        This is the unedited output of a scan. Lines that start with <IC>+</IC> are verified reads.
        Lines that start with <IC>-</IC> are refusals, each with its cause in brackets, followed by
        the reason.
      </p>
      <Frame
        barLabel={SURVEY_PROVENANCE.command}
        flat
        caption={
          <>
            Unedited output of the ERP benchmark survey ({SURVEY_PROVENANCE.date}). Elisions are
            marked in the text and only shorten the discovered lists. Every refusal is shown in
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
        A discovered line names the capability, the entity, and the binding, which is the class and
        method the tool will call. Two kinds of read are discovered today:
      </p>
      <ul>
        <li>
          <strong>by-id</strong>: a read of one entity by its primary key, for example{" "}
          <IC>getContact</IC> bound to <IC>ContactServiceImpl#findById</IC>.
        </li>
        <li>
          <strong>list</strong>: the unfiltered list of an entity, for example <IC>listAccount</IC>{" "}
          bound to <IC>AccountServiceImpl#findAll</IC>. A <IC>(paged)</IC> mark means the read
          returns a page, and the generated description says the total count and page envelope
          aren't modeled.
        </li>
      </ul>
      <p>
        A <IC>(partial: N fields skipped)</IC> mark means some fields of the source entity aren't
        represented in the model. The binding is still verified, and the generated OpenAPI schema
        names the fields that were left out.
      </p>

      <H2 id="refusals">Refusal causes</H2>
      <p>
        Every refusal has one cause. A refusal doesn't mean there is an error in your code. It
        means the tool couldn't verify the read from the code's structure, so it left the read out.
      </p>
      <DocTable
        head={["Cause", "What it means"]}
        rows={REFUSAL_CAUSES.map((c) => [<IC key={c.code}>{c.code}</IC>, c.plain])}
      />
      <p>
        Files that can't be parsed are listed separately as skipped-by-parse, each by name. The
        scan keeps going when a file can't be parsed, and it reports the skipped files so you can
        see that the result is incomplete.
      </p>
      <Callout title="What discovery leaves out">
        <p>
          Discovery leaves out writes and actions. It also leaves out filtered reads such as{" "}
          <IC>findByStatus</IC> or <IC>search</IC>. The tool can't verify what a filter means from
          the code's structure, so it doesn't present a filtered read as verified. A person can add
          such a read through{" "}
          <Link href="/docs/attestation/" className="prose-link">
            attestation
          </Link>
          .
        </p>
      </Callout>

      <H2 id="totals">The totals line</H2>
      <p>The last line summarizes the run:</p>
      <CodeBlock label="totals" copy={false}>{`discovered N (by-id A, list B), failed, list-refused, skipped-by-parse, partial, mis-bound`}</CodeBlock>
      <DocTable
        head={["Field", "Read it as"]}
        rows={[
          [<IC key="1">discovered</IC>, "Verified reads, split into by-id and list. These are the capabilities that would ship."],
          [<IC key="2">failed</IC>, "Entities whose read-by-id was refused, broken down by cause."],
          [<IC key="3">list-refused</IC>, "Entities whose list read was refused."],
          [<IC key="4">skipped-by-parse</IC>, "Source files that couldn't be parsed. Each one is named earlier in the output."],
          [<IC key="5">partial</IC>, "Entities modeled with some fields left out, with the count of fields skipped."],
          [
            <IC key="6">mis-bound</IC>,
            "Tools bound to the wrong method. This must be 0 on every run.",
          ],
        ]}
      />
      <p>
        When your project has an attestations file, the survey also reports attested entries and
        drafts as their own classes. They are counted separately and are never added to the
        discovered total.
      </p>

      <H2 id="report">Markdown report</H2>
      <p>
        Add <IC>--report</IC> to write the same survey as a Markdown file. The report contains a
        summary table, the discovered capabilities with their bindings, the grouped refusals with
        their reasons, and the most common blocker. Writing the report is read-only, like the scan
        itself.
      </p>
      <CodeBlock label="shell" lang="shell">{`java -jar ${JAR} scan /path/to/your-app --report survey.md`}</CodeBlock>
      <p>
        If you run the scan on your own application, the maintainer would like to see the numbers,
        because survey results help decide what gets built next. The address is on the{" "}
        <Link href="/docs/security/" className="prose-link">
          security page
        </Link>
        .
      </p>

      <H2 id="scan-vs-generate">scan versus generate</H2>
      <p>
        The two commands have different jobs, so <IC>scan</IC> shows more than <IC>generate</IC>.
      </p>
      <ul>
        <li>
          <strong>scan produces the survey.</strong> It prints every discovered capability, every
          refusal with its cause, and every skipped file.
        </li>
        <li>
          <strong>generate and the Maven plugin produce the output files.</strong> They emit only
          the verified capabilities, because the manifest is what an agent will act on. Refused
          reads are left out of it.
        </li>
      </ul>
      <p>
        If you ran only <IC>generate</IC> and a read you expected is missing, run <IC>scan</IC> to
        see the reason.
      </p>
    </DocPage>
  );
}
