import type { Metadata } from "next";
import Link from "next/link";
import { DocPage, H2 } from "../../_components/docs/doc";
import { CodeBlock, IC } from "../../_components/ui";
import { LINKS, META } from "../../_content/claims";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions from a first run of Tibyaan: why you got only one tool, why scan shows more than generate, what the generated .java files are for, and more.",
  alternates: { canonical: "/docs/faq/" },
};

const JAR = `tibyan-cli-${META.cliVersionExample}-jar-with-dependencies.jar`;

export default function Faq() {
  return (
    <DocPage
      href="/docs/faq/"
      title="First-run questions"
      lead="Short answers to common questions from a first run of Tibyaan. Most of them describe expected behavior."
      toc={[
        { id: "one-tool", label: "I got only one tool" },
        { id: "scan-more", label: "scan shows more than generate" },
        { id: "java-files", label: "The generated .java files" },
        { id: "module-field", label: "The module field" },
        { id: "vanished", label: "A tool disappeared after upgrading" },
        { id: "need-cli", label: "Do I need the CLI?" },
        { id: "path", label: "The intended path" },
      ]}
      source={{ label: "docs/FAQ.md", href: LINKS.faqDoc }}
    >
      <H2 id="one-tool">I ran generate and got only one tool. Where are my other reads?</H2>
      <p>
        This is expected. Tibyaan exposes only the capabilities it can verify from the structure of
        your source, and today that means read-by-id and the unfiltered list. Everything else is
        left out:
      </p>
      <ul>
        <li>
          <strong>Writes (create, update, delete)</strong> are left out during discovery and are
          never considered for the manifest.
        </li>
        <li>
          <strong>Filtered reads</strong> (<IC>findByStatus</IC>, <IC>search</IC>, and the like)
          aren't discovered, because Tibyaan can't verify what a parameter means from the code's
          structure. You can add one through{" "}
          <Link href="/docs/attestation/" className="prose-link">
            attestation
          </Link>
          .
        </li>
        <li>
          <strong>Reads that return a custom paged result-set wrapper</strong> aren't discovered,
          because discovery doesn't look inside the wrapper.
        </li>
      </ul>
      <p>To see every decision the tool made and the reason for it, run a scan with a report:</p>
      <CodeBlock label="shell" lang="shell">{`java -jar ${JAR} scan /path/to/your-app --report survey.md`}</CodeBlock>

      <H2 id="scan-more">Why does scan show more than generate or the build plugin?</H2>
      <p>
        They have different jobs. <IC>scan</IC> produces the survey, which shows everything it
        found so you can decide whether to adopt. <IC>generate</IC> and the Maven plugin produce
        the output files. They emit only the verified capabilities, because the manifest is what an
        agent will act on, so refused reads are left out. See{" "}
        <Link href="/docs/reading-your-survey/" className="prose-link">
          Reading your survey
        </Link>
        .
      </p>

      <H2 id="java-files">The output folder has .java files. What do I do with them?</H2>
      <p>
        If you're adopting into an existing Spring app, you don't need them. You don't compile them,
        copy them, or wire them in. The MCP backend produces the manifest and one generated tool class
        per capability. Both describe the same capabilities, for two different ways of hosting
        them. The runtime dependency in your running app reads the manifest. The tool classes are
        for a separate, hand-hosted generated project, which this adoption path doesn't use.
      </p>

      <H2 id="module-field">The manifest module field names one module. Is that a bug?</H2>
      <p>
        No. The <IC>module</IC> field is the name of the directory you scanned. If you pointed the
        tool at one module, you get only that module's capabilities, because discovery only sees
        the source you scan. To cover a whole application, scan the reactor root. See{" "}
        <Link href="/docs/multi-module/" className="prose-link">
          Multi-module applications
        </Link>
        .
      </p>

      <H2 id="vanished">A tool disappeared from my manifest after upgrading to 0.3.0. Why?</H2>
      <p>
        0.3.0 added a by-primary-key check to the path that discovers entity-returning reads, which
        previously matched on method signature alone. On a fourth application, outside the three
        benchmarks, that path had bound a read-by-id tool to a method that filters by a foreign key
        and returns the first hit. That
        was a wrong binding, and it is now refused. If a tool disappeared, its previous binding
        wasn't safe to rely on. Run the scan again and check the list of refusals.
      </p>

      <H2 id="need-cli">Do I need the CLI if I use the Maven plugin?</H2>
      <p>
        No. The build plugin runs the same pipeline during your build and writes the manifest onto
        the classpath. The CLI lets you preview and inspect an app read-only, before and
        independently of any build change. Use the CLI to decide whether to adopt, and the plugin
        once you have. Both generate identical output for the same source.
      </p>

      <H2 id="path">It felt hard to get started. What is the intended path?</H2>
      <ol>
        <li>
          <strong>Preview.</strong> Scan your app with <IC>--report</IC>. The scan is read-only.
        </li>
        <li>
          <strong>Read the survey.</strong> Refusals are expected. The count to check is{" "}
          <IC>mis-bound</IC>, which must stay 0.
        </li>
        <li>
          <strong>Adopt</strong> if the survey is useful. Add the runtime dependency and the build
          plugin, then run <IC>mvn package</IC>.
        </li>
        <li>
          <strong>Connect</strong> an agent to <IC>http://localhost:8080/sse</IC>.
        </li>
      </ol>
      <p>
        The{" "}
        <Link href="/docs/getting-started/" className="prose-link">
          quickstart
        </Link>{" "}
        walks through all four steps with commands you can copy.
      </p>
    </DocPage>
  );
}
