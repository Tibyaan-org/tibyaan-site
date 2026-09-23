import type { Metadata } from "next";
import Link from "next/link";
import { DocPage, H2, Callout } from "../../_components/docs/doc";
import { CodeBlock, IC } from "../../_components/ui";
import { LINKS, META } from "../../_content/claims";

export const metadata: Metadata = {
  title: "Multi-module applications",
  description:
    "How scan scope works, how to preview a whole Maven reactor read-only, and how to wire the build plugin so one manifest covers the modules your app serves.",
  alternates: { canonical: "/docs/multi-module/" },
};

const JAR = `tibyan-cli-${META.cliVersionExample}-jar-with-dependencies.jar`;

export default function MultiModule() {
  return (
    <DocPage
      href="/docs/multi-module/"
      title="Multi-module applications"
      lead="Scan a multi-module application once, from its root, instead of one module at a time. Tibyaan reads the whole application and produces one manifest that covers every module. If you scanned a single module and saw only that module's capabilities, this page explains why and how to fix it."
      toc={[
        { id: "scope", label: "How scan scope works" },
        { id: "preview", label: "Preview the whole application" },
        { id: "adopt", label: "Point the plugin at the reactor root" },
        { id: "cost", label: "Scope and cost" },
        { id: "same-name", label: "Same entity name in two modules" },
      ]}
      source={{ label: "docs/MULTI-MODULE.md", href: LINKS.multiModuleDoc }}
    >
      <H2 id="scope">How scan scope works</H2>
      <p>
        <IC>{"tibyan scan <path>"}</IC> walks the entire directory tree under the path you give it
        and reads every <IC>.java</IC> file it finds. It skips only build and tooling directories (
        <IC>target</IC>, <IC>build</IC>, <IC>out</IC>, <IC>bin</IC>, <IC>.git</IC>, <IC>.idea</IC>,{" "}
        <IC>.mvn</IC>), and it doesn't stop at module boundaries. This has two consequences.
      </p>
      <ol>
        <li>
          <strong>One scanned root produces one manifest.</strong> The <IC>module</IC> field in the
          manifest is the name of the directory you scanned. It is only a label for the source
          root.
        </li>
        <li>
          <strong>Discovery only sees the files you scan.</strong> Types in modules you didn't
          scan are treated as external library types, the same as <IC>java.util.List</IC>. A read
          whose entity, repository, or return type lives outside the scanned root isn't
          discovered.
        </li>
      </ol>
      <p>
        This is why scanning module by module and scanning the whole application can give different
        results. Neither result is a bug, because each run resolves types only from the source it
        was given. Scan at the scope you intend to serve.
      </p>

      <H2 id="preview">Preview the whole application</H2>
      <p>
        Point the CLI at the reactor root, the same way you would for a single module. The scan
        reads your source and writes nothing:
      </p>
      <CodeBlock label="shell" lang="shell">{`java -jar ${JAR} scan /path/to/your-reactor-root --report survey.md`}</CodeBlock>
      <p>
        When a single-module scan and a reactor scan disagree, the refusal lines in the survey give
        the cause. The most common cross-module cause is an ambiguous simple type name. If two
        modules declare a type with the same simple name and a service refers to it by that bare
        name, Tibyaan can't tell which one is meant, so it refuses the read. A single module
        scanned on its own has no such ambiguity, so a read can be discovered there and refused at
        the wider scope, or the reverse.
      </p>

      <H2 id="adopt">Point the plugin at the reactor root</H2>
      <p>
        The build plugin runs once per module it is bound to, and by default it scans only that
        module. For a multi-module application you want one manifest that covers the domain modules
        your app serves, on the classpath of the module that runs.
      </p>
      <ol>
        <li>
          <strong>
            Put the runtime dependency and the build plugin in the module that produces your
            runnable boot jar
          </strong>
          , the one with <IC>spring-boot-maven-plugin</IC>. That module's classpath is where the
          runtime looks for the manifest at startup.
        </li>
        <li>
          <strong>Point the plugin's sourceRoot at the reactor root</strong>, so it scans across
          module boundaries into one manifest:
        </li>
      </ol>
      <CodeBlock label="pom.xml (the runnable module)" lang="xml">{`<plugin>
  <groupId>${META.groupId}</groupId>
  <artifactId>tibyan-maven-plugin</artifactId>
  <version>${META.version}</version>
  <configuration>
    <sourceRoot>\${maven.multiModuleProjectDirectory}</sourceRoot>
  </configuration>
  <executions>
    <execution>
      <goals><goal>generate</goal></goals>
    </execution>
  </executions>
</plugin>`}</CodeBlock>
      <p>
        To confirm it resolved to the root you expect, check the <IC>module</IC> field of the
        generated <IC wrap>target/classes/tibyan/capabilities.json</IC>. It will be your reactor
        root's directory name. If it doesn't resolve correctly (it depends on where you invoke
        Maven and on your reactor layout), set an explicit path instead:
      </p>
      <CodeBlock label="shell" lang="shell">{`mvn package -Dtibyan.sourceRoot=/absolute/path/to/your-reactor-root`}</CodeBlock>
      <Callout title="Preview before you adopt">
        <p>
          Run the CLI scan at the same root you plan to configure, and read the survey before you
          decide to adopt. The plugin runs the identical scan, so what the preview shows at a given
          root is what the plugin will generate at that root.
        </p>
      </Callout>

      <H2 id="cost">Scope and cost</H2>
      <p>
        Scanning the whole reactor reads every module's source at build time. The scan is read-only
        and parses source without compiling it, but the manifest then reflects every module in
        scope. If you want to expose only one bounded context, scan only that context's source
        root. Match the scan scope to what you intend to serve.
      </p>

      <H2 id="same-name">Same entity name in two modules</H2>
      <p>
        Tibyaan keys entities by fully qualified class name, so two modules can reuse a simple
        entity name, for example <IC>billing.Invoice</IC> and <IC>sales.Invoice</IC>. Both are kept
        as distinct entities, with disambiguated display names.
      </p>
      <p>
        The exception is a split-package clash, where two source files under the scanned root
        declare the same fully qualified name. In that case the scan fails with an error that gives
        the location and names the clashing key, and the two declarations aren't merged. This can
        only happen when a scan spans modules. See also the{" "}
        <Link href="/docs/faq/" className="prose-link">
          FAQ
        </Link>
        .
      </p>
    </DocPage>
  );
}
