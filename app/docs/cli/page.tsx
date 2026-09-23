import type { Metadata } from "next";
import Link from "next/link";
import { DocPage, H2, H3, Callout, DocTable } from "../../_components/docs/doc";
import { CodeBlock, IC } from "../../_components/ui";
import { LINKS, META } from "../../_content/claims";

export const metadata: Metadata = {
  title: "CLI reference",
  description:
    "Reference for the tibyan command-line tool. Covers scan, generate, attest, validate, and version, with synopsis, options, output, and exit codes.",
  alternates: { canonical: "/docs/cli/" },
};

const JAR = `tibyan-cli-${META.cliVersionExample}-jar-with-dependencies.jar`;

export default function Cli() {
  return (
    <DocPage
      href="/docs/cli/"
      title="CLI reference"
      lead="The tibyan command-line tool scans a Spring application's source and generates artifacts from the result. It is the manual counterpart to the Maven plugin, which runs the same steps during your build. The CLI reads your source code and doesn't change it."
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
        The CLI is a single self-contained jar on Maven Central. Java 17 is the only requirement,
        and the CLI doesn't run your application.
      </p>
      <CodeBlock label="shell" lang="shell">{`curl -O ${LINKS.cliJar}`}</CodeBlock>
      <p>
        Run it as <IC>java -jar &lt;jar&gt; &lt;command&gt; [options]</IC>. To keep commands
        short, define a wrapper function. The examples on this page use it.
      </p>
      <CodeBlock label="bash / zsh" lang="shell">{`TIBYAN="/path/to/${JAR}"
tibyan() { java -jar "$TIBYAN" "$@"; }`}</CodeBlock>
      <CodeBlock label="PowerShell" lang="shell">{`$TIBYAN = "C:\\path\\to\\${JAR}"
function tibyan { java -jar $TIBYAN @args }`}</CodeBlock>

      <H2 id="commands">Commands at a glance</H2>
      <DocTable
        head={["Command", "Purpose"]}
        rows={[
          [<IC key="1">scan</IC>, "Scan an application's source and print the survey. A file that can't be parsed is skipped and listed, and the scan continues."],
          [<IC key="2">generate</IC>, "Generate a backend (MCP or OpenAPI) from a model file, or by scanning a path (strict)."],
          [<IC key="3">attest</IC>, "Stamp fingerprints into the attestations file, or confirm one drafted entry."],
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
      <p>All commands use the same exit codes.</p>
      <DocTable
        head={["Code", "Meaning"]}
        rows={[
          [<IC key="0">0</IC>, "Success."],
          [<IC key="1">1</IC>, "Usage error: bad or missing arguments, or an unknown backend."],
          [<IC key="2">2</IC>, "Validation failure: the model didn't pass semantic validation, so no artifact was written."],
          [<IC key="3">3</IC>, "Provider or backend error: the source is missing or unwalkable, or generation failed."],
        ]}
      />

      <H2 id="scan">tibyan scan</H2>
      <p>
        Reads an application's source and prints a survey of what it found. The scan is resilient,
        which means an unparseable file doesn't stop it. It walks the whole source tree, classifies
        every entity it can read, and lists every file it can't parse. A capability whose binding
        the tool can't verify is listed as a refusal and left out of the model.
      </p>
      <CodeBlock label="synopsis" copy={false}>{`tibyan scan <path> [--out <ir.json>] [--report <report.md>]`}</CodeBlock>
      <DocTable
        head={["Name", "Required", "Description"]}
        rows={[
          [<IC key="1">{"<path>"}</IC>, "yes", "Path to the application's source root."],
          [
            <IC key="2">{"--out <ir.json>"}</IC>,
            "no",
            "Write the discovered model as JSON. The file is written only if the model validates. Otherwise nothing is written and the command exits 2. The survey still prints.",
          ],
          [
            <IC key="3">{"--report <report.md>"}</IC>,
            "no",
            "Write the survey as a Markdown file. It contains a summary table, the discovered capabilities with their bindings, the refusals grouped by reason, each with its location, and the most common blocker. You can use it with or without --out.",
          ],
        ]}
      />
      <p>
        Exit codes: <IC>0</IC> means the survey completed, even if it discovered nothing.{" "}
        <IC>2</IC> means <IC>--out</IC> was given but the model didn't validate. <IC>3</IC> means
        the path is missing, isn't a directory, or can't be walked. For how to read the output,
        see{" "}
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
        Generates a backend from a model file, or from a path that it scans first. When you pass a{" "}
        <IC>{"<path>"}</IC>, the command uses the strict provider instead of the resilient scan. An
        unparseable file or an unresolvable binding stops it with an error, and no partial artifact
        is written. Generation is deterministic, so the same model always produces the same files.
      </p>
      <CodeBlock label="synopsis" copy={false}>{`tibyan generate --backend <mcp|openapi> --out <dir> (--ir <ir.json> | <path>)`}</CodeBlock>
      <DocTable
        head={["Name", "Required", "Description"]}
        rows={[
          [<IC key="1">{"--backend <backend>"}</IC>, "yes", "mcp or openapi."],
          [<IC key="2">{"--out <dir>"}</IC>, "yes", "Output directory for the generated files."],
          [<IC key="3">{"--ir <ir.json>"}</IC>, "either this", "Model JSON file to read."],
          [<IC key="4">{"<path>"}</IC>, "or this", "Path to scan (strict) when --ir isn't given."],
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
        Exit codes: <IC>1</IC> means the backend is unknown, or neither <IC>--ir</IC> nor a path
        was given. <IC>2</IC> means the model didn't validate. <IC>3</IC> means a provider or
        backend error.
      </p>
      <CodeBlock label="examples" lang="shell">{`tibyan generate --backend mcp     --ir app.ir.json --out ./generated
tibyan generate --backend openapi --ir app.ir.json --out ./generated
tibyan generate --backend openapi --out ./generated /path/to/app   # scan directly (strict)`}</CodeBlock>
      <Callout title="The generated .java files">
        <p>
          The MCP backend also writes one tool class per capability. If you use the Spring runtime,
          you can ignore them, because the runtime reads the manifest. They are for a standalone
          generated project that is hosted separately.
        </p>
      </Callout>

      <H2 id="attest">tibyan attest</H2>
      <p>
        The <IC>attest</IC> command has two actions, and both work on your committed{" "}
        <IC>tibyan/attestations.json</IC>. Neither action writes the text of a claim, which always
        comes from a person. For the concepts, see{" "}
        <Link href="/docs/attestation/" className="prose-link">
          Attestation
        </Link>
        .
      </p>
      <CodeBlock label="synopsis" copy={false}>{`tibyan attest <path> [--date <yyyy-mm-dd>]
tibyan attest <path> --confirm <target> --by <name>`}</CodeBlock>
      <H3>Stamping (the default action)</H3>
      <p>
        Stamping computes the structural fingerprint of each entry's slice of the current code and
        writes it back to the file. Pass <IC>--date</IC> to also record the assertion date. Stamping
        is the only action that writes a fingerprint, so a fingerprint is always computed from the
        code it pins. A hand-written entry without a fingerprint is rejected when the file is read,
        and the tool doesn't fill the fingerprint in.
      </p>
      <CodeBlock label="shell" lang="shell">{`tibyan attest /path/to/app --date 2026-09-01`}</CodeBlock>
      <H3>Confirming a draft</H3>
      <p>
        An entry whose <IC>origin</IC> is <IC>ai-draft</IC> is a proposal, and no capability is
        generated from it. It becomes a claim only when a person confirms it:
      </p>
      <CodeBlock label="shell" lang="shell">{`tibyan attest /path/to/app \\
  --confirm "com.example.TenantServiceImpl#getAllByFilter(String,Integer)" \\
  --by a.reviewer`}</CodeBlock>
      <p>
        This changes the origin of that one entry to <IC>ai-drafted-human-confirmed</IC> and records
        the required <IC>--by</IC> name in <IC>assertedBy</IC>. Afterwards, stamp the file and scan
        again. There is no confirm-all option, so you confirm each draft separately.
      </p>
      <p>
        Exit codes: <IC>0</IC> means the file was stamped, or the named draft was confirmed.{" "}
        <IC>1</IC> means <IC>--confirm</IC> didn't apply (no such target, not a draft, or no{" "}
        <IC>--by</IC>). <IC>3</IC> means the path is missing or can't be walked.
      </p>

      <H2 id="validate">tibyan validate</H2>
      <p>
        Validates a model JSON file against the semantic rules without generating anything. Use it
        before you pass a hand-edited or externally produced file to <IC>generate</IC>.
      </p>
      <CodeBlock label="shell" lang="shell">{`tibyan validate --ir app.ir.json`}</CodeBlock>
      <p>
        Exit codes: <IC>0</IC> means the file is valid, and a one-line summary prints. <IC>2</IC>{" "}
        means it is invalid, and the errors print with their locations. <IC>3</IC> means the file
        can't be read or parsed.
      </p>

      <H2 id="version">tibyan version</H2>
      <p>
        Prints the tool version and the model schema version. <IC>tibyan --version</IC> prints only
        the tool line.
      </p>

      <H2 id="session">A typical session</H2>
      <CodeBlock label="shell" lang="shell">{`tibyan scan /path/to/app --report report.md        # 1. what is operable, what is refused, and why
tibyan scan /path/to/app --out app.ir.json         # 2. write the model when the survey looks right
tibyan validate --ir app.ir.json                   # 3. optional; generate validates too
tibyan generate --backend mcp     --ir app.ir.json --out ./generated
tibyan generate --backend openapi --ir app.ir.json --out ./generated`}</CodeBlock>
      <p>
        In most projects the{" "}
        <Link href="/docs/maven-plugin/" className="prose-link">
          Maven plugin
        </Link>{" "}
        runs these steps for you during the build. The CLI and the plugin generate identical output
        for the same source.
      </p>
    </DocPage>
  );
}
