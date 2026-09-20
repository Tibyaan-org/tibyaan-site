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
      lead="You do not scan a multi-module application one module at a time. You point Tibyaan at the whole application once, and it produces one manifest that covers every module. If you scanned a single module and saw only that module's capabilities, this is why, and this is the fix."
      toc={[
        { id: "scope", label: "How scan scope works" },
        { id: "preview", label: "Preview the whole application" },
        { id: "adopt", label: "Point the plugin at the reactor root" },
        { id: "cost", label: "Scope and cost" },
        { id: "same-name", label: "Two modules, one entity name" },
      ]}
      source={{ label: "docs/MULTI-MODULE.md", href: LINKS.multiModuleDoc }}
    >
      <H2 id="scope">How scan scope works</H2>
      <p>
        <IC>{"tibyan scan <path>"}</IC> walks the entire directory tree under the path you give it
        and reads every <IC>.java</IC> file it finds. It skips only build and tooling directories (
        <IC>target</IC>, <IC>build</IC>, <IC>out</IC>, <IC>bin</IC>, <IC>.git</IC>, <IC>.idea</IC>,{" "}
        <IC>.mvn</IC>). It does not stop at a module boundary. Two consequences follow.
      </p>
      <ol>
        <li>
          <strong>One scanned root produces one manifest.</strong> The <IC>module</IC> field in the
          manifest is simply the name of the directory you scanned. It is a label for the source
          root, nothing more.
        </li>
        <li>
          <strong>Discovery is resolved against exactly the files you scan.</strong> Types in
          modules you did not scan are treated as external library types, the same as{" "}
          <IC>java.util.List</IC>. A read whose entity, repository, or return type lives outside
          the scanned root is invisible.
        </li>
      </ol>
      <p>
        This is why scanning module by module and scanning the whole application can give different
        results. It is not a bug in either run; it is the direct meaning of "resolved from your own
        source". Scan at the scope you intend to serve.
      </p>

      <H2 id="preview">Preview the whole application</H2>
      <p>
        Point the CLI at the reactor root, exactly as you would a single module. This reads source
        and writes nothing:
      </p>
      <CodeBlock label="shell" lang="shell">{`java -jar ${JAR} scan /path/to/your-reactor-root --report survey.md`}</CodeBlock>
      <p>
        Where a single-module scan and a reactor scan disagree, the survey's refusal lines name the
        cause. The most common cross-module cause is an ambiguous simple type name: if two modules
        declare a type with the same simple name and a service references it by that bare name,
        Tibyaan refuses rather than guess which one is meant. A single module in isolation has no
        such ambiguity, so a read can be discovered there and refused at the wider scope, or the
        reverse.
      </p>

      <H2 id="adopt">Point the plugin at the reactor root</H2>
      <p>
        The build plugin runs once per module it is bound to, and by default scans only that module.
        For a multi-module application you want one manifest, covering the domain modules your app
        serves, on the classpath of the module that actually runs.
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
        Confirm it resolved to the root you expect by checking the <IC>module</IC> field of the
        generated <IC wrap>target/classes/tibyan/capabilities.json</IC>: it will be your reactor
        root's directory name. If it does not resolve correctly (it depends on where you invoke
        Maven and on your reactor layout), set an explicit path instead:
      </p>
      <CodeBlock label="shell" lang="shell">{`mvn package -Dtibyan.sourceRoot=/absolute/path/to/your-reactor-root`}</CodeBlock>
      <Callout title="Preview first, always">
        <p>
          Run the CLI scan at the same root you will configure, read the survey, and adopt only if
          it convinces you. The plugin runs the identical scan, so what the preview shows at a given
          root is what the plugin will generate at that root.
        </p>
      </Callout>

      <H2 id="cost">Scope and cost</H2>
      <p>
        Scanning the whole reactor reads every module's source at build time. That is read-only and
        it is source parsing, not compilation, but it does mean the manifest reflects every module
        in scope. If you deliberately want to expose only one bounded context, scan only that
        context's source root instead. Match the scan scope to what you intend to serve.
      </p>

      <H2 id="same-name">Two modules, one entity name</H2>
      <p>
        Tibyaan keys entities by fully qualified class name, so two modules that legitimately reuse
        a simple entity name, for example <IC>billing.Invoice</IC> and <IC>sales.Invoice</IC>, are
        distinct and both survive, with disambiguated display names.
      </p>
      <p>
        The one hard failure is a genuine split-package clash: the same fully qualified name
        declared by two source files under the scanned root. That fails loudly with a located error
        rather than silently merging them. It can only arise when a scan spans modules, and the
        message names the clashing key. See also the{" "}
        <Link href="/docs/faq/" className="prose-link">
          FAQ
        </Link>
        .
      </p>
    </DocPage>
  );
}
