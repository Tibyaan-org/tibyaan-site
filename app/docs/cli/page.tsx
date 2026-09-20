import type { Metadata } from "next";
import Link from "next/link";
import { DocPage, H2, H3, Callout, DocTable } from "../../_components/docs/doc";
import { CodeBlock, IC } from "../../_components/ui";
import { LINKS, META } from "../../_content/claims";

export const metadata: Metadata = {
  title: "CLI reference",
  description:
    "The tibyan command-line tool: scan, generate, attest, validate, and version, with synopsis, options, output, and exit codes.",
  alternates: { canonical: "/docs/cli/" },
};

const JAR = `tibyan-cli-${META.cliVersionExample}-jar-with-dependencies.jar`;

export default function Cli() {
  return (
    <DocPage
      href="/docs/cli/"
      title="CLI reference"
      lead="The tibyan command-line tool surveys a Spring application from source and generates artifacts by hand. It is the manual counterpart to the Maven plugin. Everything it does is read-only with respect to your application."
      toc={[
        { id: "install", label: "Getting the CLI" },
        { id: "commands", label: "Commands at a glance" },
        { id: "exit-codes", label: "Exit codes" },
        { id: "scan", label: "tibyan scan" },
        { id: "generate", label: "tibyan generate" },
        { id: "attest", label: "tibyan attest" },
        { id: "validate", label: "tibyan validate" },
        { id: "version", label: "tibyan version" },
        { id: "session", label: "A typical session" },
      ]}
      source={{ label: "docs/CLI.md", href: LINKS.cliDoc }}
    >
      <H2 id="install">Getting the CLI</H2>
      <p>
        The CLI ships as one self-contained jar on Maven Central. It needs only Java 17 and never
        runs your application.
      </p>
      <CodeBlock label="shell" lang="shell">{`curl -O ${LINKS.cliJar}`}</CodeBlock>
      <p>
        Invoke it as <IC>java -jar &lt;jar&gt; &lt;command&gt; [options]</IC>. To keep commands
        short, define a wrapper once. Every example below uses it.
      </p>
      <CodeBlock label="bash / zsh" lang="shell">{`TIBYAN="/path/to/${JAR}"
tibyan() { java -jar "$TIBYAN" "$@"; }`}</CodeBlock>
      <CodeBlock label="PowerShell" lang="shell">{`$TIBYAN = "C:\\path\\to\\${JAR}"
function tibyan { java -jar $TIBYAN @args }`}</CodeBlock>

      <H2 id="commands">Commands at a glance</H2>
      <DocTable
        head={["Command", "Purpose"]}
        rows={[
          [<IC key="1">scan</IC>, "Resiliently survey a system's source. Never aborts on a bad file."],
          [<IC key="2">generate</IC>, "Generate a backend (MCP or OpenAPI) from a model file, or by scanning a path (strict)."],
          [<IC key="3">attest</IC>, "Stamp fingerprints into the attestations file, and confirm one drafted entry."],
          [<IC key="4">validate</IC>, "Validate a model JSON file without generating."],
          [<IC key="5">version</IC>, "Print the tool and model schema versions."],
        ]}
      />
      <p>
        On any command, <IC>-h</IC> or <IC>--help</IC> prints usage (<IC>tibyan scan --help</IC>),
        and <IC>-V</IC> or <IC>--version</IC> prints the tool version. Running <IC>tibyan</IC> with
        no command prints the usage summary.
      </p>

      <H2 id="exit-codes">Exit codes</H2>
      <p>Every command uses one convention.</p>
      <DocTable
        head={["Code", "Meaning"]}
        rows={[
          [<IC key="0">0</IC>, "Success."],
          [<IC key="1">1</IC>, "Usage error: bad or missing arguments, or an unknown backend."],
          [<IC key="2">2</IC>, "Validation failure: the model did not pass semantic validation, so no artifact was written."],
          [<IC key="3">3</IC>, "Provider or backend error: the source is missing or unwalkable, or generation failed."],
        ]}
      />

      <H2 id="scan">tibyan scan</H2>
      <p>
        Read a system from source and survey it. This is the resilient path: it walks the entire
        source tree, parses collect-and-continue, classifies every entity it can read, and names
        every file it cannot parse. It never aborts on one unparseable file, and it never emits a
        wrong binding.
      </p>
      <CodeBlock label="synopsis" copy={false}>{`tibyan scan <path> [--out <ir.json>] [--report <report.md>]`}</CodeBlock>
      <DocTable
        head={["Name", "Required", "Description"]}
        rows={[
          [<IC key="1">{"<path>"}</IC>, "yes", "Path to the system (its source root) to scan."],
          [
            <IC key="2">{"--out <ir.json>"}</IC>,
            "no",
            "Write the discovered model as JSON. Written only if the model validates; otherwise nothing is written and the command exits 2. The survey still prints.",
          ],
          [
            <IC key="3">{"--report <report.md>"}</IC>,
            "no",
            "Write a human-readable Markdown survey: a summary table, the operable subset with its bindings, the grouped refusals with located reasons, and the single most common blocker. Independent of --out.",
          ],
        ]}
      />
      <p>
        Exit codes: <IC>0</IC> the survey completed, whatever it discovered, including zero;{" "}
        <IC>2</IC> <IC>--out</IC> was given but the model did not validate; <IC>3</IC> the path is
        missing, is not a directory, or cannot be walked. For how to read the output, see{" "}
        <Link href="/docs/reading-your-survey/" className="prose-link">
          Reading your survey
        </Link>
        .
      </p>
      <CodeBlock label="examples" lang="shell">{`tibyan scan /path/to/app                                      # survey to the console
tibyan scan /path/to/app --report report.md                   # shareable Markdown survey
tibyan scan /path/to/app --out app.ir.json                    # write the model (only if it validates)
tibyan scan /path/to/app --out app.ir.json --report report.md`}</CodeBlock>

      <H2 id="generate">tibyan generate</H2>
      <p>
        Generate a backend from a model file, or by scanning a path directly. Generating from a{" "}
        <IC>{"<path>"}</IC> uses the strict provider, not the resilient scan: it refuses any
        unparseable file or unresolvable binding rather than producing a partial artifact.
        Generation is deterministic: the same model in produces the same files out.
      </p>
      <CodeBlock label="synopsis" copy={false}>{`tibyan generate --backend <mcp|openapi> --out <dir> (--ir <ir.json> | <path>)`}</CodeBlock>
      <DocTable
        head={["Name", "Required", "Description"]}
        rows={[
          [<IC key="1">{"--backend <backend>"}</IC>, "yes", "mcp or openapi."],
          [<IC key="2">{"--out <dir>"}</IC>, "yes", "Output directory for the generated files."],
          [<IC key="3">{"--ir <ir.json>"}</IC>, "either this", "Model JSON file to read."],
          [<IC key="4">{"<path>"}</IC>, "or this", "Path to scan (strict) when --ir is not given."],
        ]}
      />
      <DocTable
        head={["Backend", "Files written"]}
        rows={[
          [<IC key="1">mcp</IC>, <><IC wrap>{"<out>/tibyan/capabilities.json"}</IC>, the MCP server manifest.</>],
          [<IC key="2">openapi</IC>, <><IC wrap>{"<out>/openapi.json"}</IC>, an OpenAPI 3.0 document.</>],
        ]}
      />
      <p>
        Exit codes: <IC>1</IC> unknown backend, or neither <IC>--ir</IC> nor a path was given;{" "}
        <IC>2</IC> the model did not validate; <IC>3</IC> provider or backend error.
      </p>
      <CodeBlock label="examples" lang="shell">{`tibyan generate --backend mcp     --ir app.ir.json --out ./generated
tibyan generate --backend openapi --ir app.ir.json --out ./generated
tibyan generate --backend openapi --out ./generated /path/to/app   # scan directly (strict)`}</CodeBlock>
      <Callout title="The generated .java files">
        <p>
          The MCP backend also writes one tool class per capability. For the Spring adoption path
          you do nothing with them: the runtime reads the manifest. They exist for a separately
          hosted, standalone generated project.
        </p>
      </Callout>

      <H2 id="attest">tibyan attest</H2>
      <p>
        Two actions on your committed <IC>tibyan/attestations.json</IC>. The tool never writes a
        claim's words in either action: the meaning is always the human's. The concepts are in{" "}
        <Link href="/docs/attestation/" className="prose-link">
          Attestation
        </Link>
        .
      </p>
      <CodeBlock label="synopsis" copy={false}>{`tibyan attest <path> [--date <yyyy-mm-dd>]
tibyan attest <path> --confirm <target> --by <name>`}</CodeBlock>
      <H3>Stamping (the default action)</H3>
      <p>
        Computes the structural fingerprint of each entry's slice over the current code and writes
        it back, with <IC>--date</IC> optionally stamping the assertion date. This is the only path
        that stamps a fingerprint, so a fingerprint always arrives together with the code it pins. A
        hand-authored entry without one is refused at intake rather than silently completed.
      </p>
      <CodeBlock label="shell" lang="shell">{`tibyan attest /path/to/app --date 2026-09-01`}</CodeBlock>
      <H3>Confirming a draft</H3>
      <p>
        An entry whose <IC>origin</IC> is <IC>ai-draft</IC> is a proposal, not a claim. It ships
        nothing. Confirming it is the human act that turns it into a claim:
      </p>
      <CodeBlock label="shell" lang="shell">{`tibyan attest /path/to/app \\
  --confirm "com.example.TenantServiceImpl#getAllByFilter(String,Integer)" \\
  --by a.reviewer`}</CodeBlock>
      <p>
        That rewrites exactly that entry's origin to <IC>ai-drafted-human-confirmed</IC> and records
        you in <IC>assertedBy</IC>. Then stamp it and re-scan. There is no confirm-all: a team with
        ten drafts reviews ten drafts.
      </p>
      <p>
        Exit codes: <IC>0</IC> the file was stamped, or the named draft was confirmed; <IC>1</IC>{" "}
        <IC>--confirm</IC> did not apply (no such target, not a draft, or no <IC>--by</IC>);{" "}
        <IC>3</IC> the path is missing or cannot be walked.
      </p>

      <H2 id="validate">tibyan validate</H2>
      <p>
        Validate a model JSON file against the semantic rules, without generating anything. Useful
        before feeding a hand-edited or externally produced file to <IC>generate</IC>.
      </p>
      <CodeBlock label="shell" lang="shell">{`tibyan validate --ir app.ir.json`}</CodeBlock>
      <p>
        Exit codes: <IC>0</IC> valid, and a one-line summary prints; <IC>2</IC> invalid, and the
        located errors print; <IC>3</IC> the file cannot be read or parsed.
      </p>

      <H2 id="version">tibyan version</H2>
      <p>
        Prints the tool version and the model schema version. <IC>tibyan --version</IC> prints just
        the tool line.
      </p>

      <H2 id="session">A typical session</H2>
      <CodeBlock label="shell" lang="shell">{`tibyan scan /path/to/app --report report.md        # 1. what is operable, what is refused, and why
tibyan scan /path/to/app --out app.ir.json         # 2. write the model when the survey looks right
tibyan validate --ir app.ir.json                   # 3. optional; generate validates too
tibyan generate --backend mcp     --ir app.ir.json --out ./generated
tibyan generate --backend openapi --ir app.ir.json --out ./generated`}</CodeBlock>
      <p>
        For most adopters the{" "}
        <Link href="/docs/maven-plugin/" className="prose-link">
          Maven plugin
        </Link>{" "}
        performs these steps automatically during the build. The CLI and the plugin generate
        identical output for the same source.
      </p>
    </DocPage>
  );
}
