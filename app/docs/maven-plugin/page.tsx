import type { Metadata } from "next";
import Link from "next/link";
import { DocPage, H2, Callout, DocTable } from "../../_components/docs/doc";
import { CodeBlock, IC, ExtLink } from "../../_components/ui";
import { LINKS, META } from "../../_content/claims";

export const metadata: Metadata = {
  title: "Maven plugin",
  description:
    "The tibyan-maven-plugin generate goal: bound execution, one-off invocation, parameters, and the resilient and strict modes.",
  alternates: { canonical: "/docs/maven-plugin/" },
};

export default function MavenPlugin() {
  return (
    <DocPage
      href="/docs/maven-plugin/"
      title="Maven plugin"
      lead="The build plugin runs the same pipeline the CLI runs, during your application's build, and writes the tool manifest onto the classpath. Nothing is committed by hand, and rebuilding regenerates it from whatever your source now says."
      toc={[
        { id: "bound", label: "Bound execution" },
        { id: "one-off", label: "One-off invocation" },
        { id: "behavior", label: "What the goal does" },
        { id: "parameters", label: "Parameters" },
        { id: "strict", label: "Resilient and strict" },
        { id: "multi-module", label: "Multi-module builds" },
      ]}
      source={{ label: "docs/COMMANDS.md, section 3", href: LINKS.commands }}
    >
      <H2 id="bound">Bound execution (recommended)</H2>
      <p>
        Add the plugin to your application's <IC>pom.xml</IC>. Its <IC>generate</IC> goal binds to
        the <IC>generate-resources</IC> phase by default, so a normal <IC>mvn package</IC> produces
        the manifest.
      </p>
      <CodeBlock label="pom.xml" lang="xml">{`<plugin>
  <groupId>${META.groupId}</groupId>
  <artifactId>tibyan-maven-plugin</artifactId>
  <version>${META.version}</version>
  <executions>
    <execution>
      <goals><goal>generate</goal></goals>
    </execution>
  </executions>
</plugin>`}</CodeBlock>
      <CodeBlock label="shell" lang="shell">{`mvn package`}</CodeBlock>

      <H2 id="one-off">One-off invocation</H2>
      <p>Run the goal directly with its fully qualified coordinates, with no pom change:</p>
      <CodeBlock label="shell" lang="shell">{`mvn ${META.groupId}:tibyan-maven-plugin:${META.version}:generate`}</CodeBlock>
      <p>
        The short form <IC>mvn tibyan:generate</IC> also works if the plugin group is on your Maven
        plugin search path.
      </p>

      <H2 id="behavior">What the goal does</H2>
      <DocTable
        head={["Behavior", "Detail"]}
        rows={[
          ["Default phase", <IC key="1">generate-resources</IC>],
          ["Output", <><IC wrap>tibyan/capabilities.json</IC> in the classpath output directory (<IC wrap>target/classes</IC>).</>],
          [
            "Resilience",
            "Resilient by default: an unparseable file is skipped and named at WARN, and the manifest is generated from what was discovered. A partial manifest is disclosed loudly.",
          ],
          [
            "Zero capabilities",
            <>If nothing is discovered, the build succeeds but logs a WARN telling you to run <IC>tibyan scan</IC> to see why.</>,
          ],
          ["Hard failures", "A genuinely invalid model, or an unwalkable source root, still fails the build."],
        ]}
      />

      <H2 id="parameters">Parameters</H2>
      <p>
        Each parameter has a <IC>-D</IC> property for command-line override.
      </p>
      <DocTable
        head={["Parameter", "Property", "Default", "Purpose"]}
        rows={[
          [<IC key="a">sourceRoot</IC>, <IC key="b">tibyan.sourceRoot</IC>, <IC key="c" wrap>{"${project.basedir}"}</IC>, "The source root to scan."],
          [
            <IC key="a">outputDirectory</IC>,
            <IC key="b">tibyan.outputDirectory</IC>,
            <IC key="c" wrap>{"${project.build.outputDirectory}"}</IC>,
            "Where the manifest is written.",
          ],
          [
            <IC key="a">workDirectory</IC>,
            <IC key="b">tibyan.workDirectory</IC>,
            <IC key="c" wrap>{"${project.build.directory}/tibyan-generate"}</IC>,
            "Intermediate directory for the backend's full output.",
          ],
          [
            <IC key="a">strict</IC>,
            <IC key="b">tibyan.strict</IC>,
            <IC key="c">false</IC>,
            "When true, any unparseable file or hard failure fails the build.",
          ],
        ]}
      />

      <H2 id="strict">Resilient and strict</H2>
      <p>
        The default is built so that adopting the plugin never breaks a build on a bad file. For a
        CI gate, turn strictness on:
      </p>
      <CodeBlock label="shell" lang="shell">{`mvn package                        # resilient default
mvn package -Dtibyan.strict=true   # fail the build on any unparseable file (CI gate)`}</CodeBlock>
      <Callout title="Keep versions together">
        <p>
          Keep the runtime dependency and the plugin at the same version. Before 1.0.0, treat every
          minor bump as potentially breaking: the manifest format is additive where possible but
          not yet stable. The{" "}
          <ExtLink href={LINKS.changelog} className="prose-link">
            changelog
          </ExtLink>{" "}
          lists what an adopter should read before upgrading.
        </p>
      </Callout>

      <H2 id="multi-module">Multi-module builds</H2>
      <p>
        In a reactor, <IC>sourceRoot</IC> defaults to the single module the plugin runs in, which is
        usually not what you want. Point it at the reactor root so one manifest covers every module,
        on the classpath of the module that runs. The recipe is in{" "}
        <Link href="/docs/multi-module/" className="prose-link">
          Multi-module applications
        </Link>
        .
      </p>
    </DocPage>
  );
}
