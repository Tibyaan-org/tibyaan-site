import type { Metadata } from "next";
import Link from "next/link";
import { DocPage, H2 } from "../../_components/docs/doc";
import { CodeBlock, IC } from "../../_components/ui";
import { LINKS, META } from "../../_content/claims";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Short answers to what surprises people the first time they run Tibyaan: why only one tool, why scan shows more than generate, what the generated .java files are, and more.",
  alternates: { canonical: "/docs/faq/" },
};

const JAR = `tibyan-cli-${META.cliVersionExample}-jar-with-dependencies.jar`;

export default function Faq() {
  return (
    <DocPage
      href="/docs/faq/"
      title="First-run questions"
      lead="Short answers to the things that surprise people the first time they run Tibyaan. Most of them are the tool working as designed, not failing."
      toc={[
        { id: "one-tool", label: "I got only one tool" },
        { id: "scan-more", label: "scan shows more than generate" },
        { id: "java-files", label: "The generated .java files" },
        { id: "module-field", label: "The module field" },
        { id: "vanished", label: "A tool vanished after upgrading" },
        { id: "need-cli", label: "Do I need the CLI?" },
        { id: "path", label: "The intended path" },
      ]}
      source={{ label: "docs/FAQ.md", href: LINKS.faqDoc }}
    >
      <H2 id="one-tool">I ran generate and got only one tool. Where are my other reads?</H2>
      <p>
        By design. Tibyaan exposes only capabilities it can prove, structurally, from your source,
        and today that means read-by-id and the unfiltered list. Everything else is refused on
        purpose, not missed:
      </p>
      <ul>
        <li>
          <strong>Writes (create, update, delete)</strong> are refused at the discovery level. They
          are never considered for the manifest.
        </li>
        <li>
          <strong>Filtered reads</strong> (<IC>findByStatus</IC>, <IC>search</IC>, and the like) are
          refused, because a parameter's meaning is a claim Tibyaan cannot verify from structure
          alone. You can carry one through{" "}
          <Link href="/docs/attestation/" className="prose-link">
            attestation
          </Link>
          .
        </li>
        <li>
          <strong>Custom paged result-set wrappers</strong> are not seen through by discovery.
        </li>
      </ul>
      <p>To see every decision the tool made, with its located reason, run the survey:</p>
      <CodeBlock label="shell" lang="shell">{`java -jar ${JAR} scan /path/to/your-app --report survey.md`}</CodeBlock>

      <H2 id="scan-more">Why does scan show more than generate, or the build plugin?</H2>
      <p>
        They serve two different jobs. <IC>scan</IC> is the survey: it prints the whole picture, for
        you, to decide whether to adopt. <IC>generate</IC> and the Maven plugin produce the
        artifact: they emit only the proven capabilities, because the manifest is what an agent
        will act on. A refusal is a deliberate absence from the artifact. See{" "}
        <Link href="/docs/reading-your-survey/" className="prose-link">
          Reading your survey
        </Link>
        .
      </p>

      <H2 id="java-files">The output folder has .java files. What do I do with them?</H2>
      <p>
        For the Spring adoption path, nothing. You do not compile them, copy them, or wire them in.
        The MCP backend produces the manifest and one generated tool class per capability: two
        materializations of the same contract for two hosting paths. Your running app plus the
        runtime dependency reads the manifest. The tool classes are for a separate, hand-hosted
        generated project, which adopting into an existing Spring app does not use.
      </p>

      <H2 id="module-field">The manifest module field names one module. Is that a bug?</H2>
      <p>
        No. The <IC>module</IC> field is just the name of the directory you scanned. If you pointed
        the tool at one module, you get that module's capabilities only, because discovery resolves
        against exactly the source you scan. To cover a whole application, scan the reactor root:
        see{" "}
        <Link href="/docs/multi-module/" className="prose-link">
          Multi-module applications
        </Link>
        .
      </p>

      <H2 id="vanished">A tool vanished from my manifest after upgrading to 0.3.0. Why?</H2>
      <p>
        0.3.0 added a by-primary-key proof to the path that discovers entity-returning reads, which
        previously matched on method signature alone. On a real application that path had bound a
        read-by-id tool to a method that filters by a foreign key and returns the first hit: a wrong
        binding, which now correctly refuses. If a tool disappeared, the previous binding was not
        safe to rely on. Re-read the survey's refusal ledger.
      </p>

      <H2 id="need-cli">Do I need the CLI if I use the Maven plugin?</H2>
      <p>
        No. The build plugin runs the same pipeline during your build and writes the manifest onto
        the classpath. The CLI is for previewing and inspecting read-only, before and independent
        of any build change. Use the CLI to decide, use the plugin to adopt. They generate identical
        output for the same source.
      </p>

      <H2 id="path">It felt hard to get started. What is the intended path?</H2>
      <ol>
        <li>
          <strong>Preview.</strong> Scan your app with <IC>--report</IC>. Read-only, changes
          nothing.
        </li>
        <li>
          <strong>Read the survey.</strong> Refusals are expected; the one number that must stay 0
          is <IC>mis-bound</IC>.
        </li>
        <li>
          <strong>Adopt</strong>, only if the preview convinced you: the runtime dependency and the
          build plugin, then <IC>mvn package</IC>.
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
        walks through all four with copy-paste commands.
      </p>
    </DocPage>
  );
}
