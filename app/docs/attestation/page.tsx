import type { Metadata } from "next";
import Link from "next/link";
import { DocPage, H2, H3, Callout, DocTable } from "../../_components/docs/doc";
import { CodeBlock, IC, ExtLink } from "../../_components/ui";
import { LINKS } from "../../_content/claims";

export const metadata: Metadata = {
  title: "Attestation",
  description:
    "How to expose a read the tool can't verify as a human-attested capability. Covers the attestations file, the four categories, fingerprints and drift, drafts, exposure controls, and who owns what.",
  alternates: { canonical: "/docs/attestation/" },
};

export default function Attestation() {
  return (
    <DocPage
      href="/docs/attestation/"
      title="Attestation"
      lead="Most of an application's read API is filtered reads, and the tool can't work out what a filter means from the structure of the code. Attestation lets a named person state that meaning in a file that is committed and reviewed with the source. The tool ships the claim word for word, labels it as human-attested everywhere it appears, and still verifies the rest of the read itself."
      toc={[
        { id: "when", label: "When to use it" },
        { id: "proves", label: "What the tool still verifies" },
        { id: "categories", label: "The four categories" },
        { id: "entry", label: "Entry format" },
        { id: "sentence", label: "Writing the sentence" },
        { id: "workflow", label: "Add an attestation" },
        { id: "drift", label: "Fingerprints and drift" },
        { id: "drafts", label: "Drafts" },
        { id: "ships", label: "How attested capabilities are labeled" },
        { id: "owns", label: "Who owns what" },
      ]}
      source={{ label: "docs/SECURITY.md and the changelog", href: LINKS.security }}
    >
      <H2 id="when">When to use it</H2>
      <p>
        Use attestation when the survey refused a read that you know is safe and useful. Typical
        cases are a filtered list, a read that returns a view object the tool can't tie to an
        entity, and a read that delegates to a remote service. The structure of the code doesn't
        show what such a read selects or returns, so discovery won't expose it. A person who
        knows the code can state what the read does in a committed file.
      </p>
      <p>
        Attestation shipped in 0.3.0. It adds to discovery and doesn't change it. In every
        attestation phase, the generated output was measured as byte-identical on all three
        benchmarks.
      </p>
      <Callout title="Reads only">
        <p>
          You can't attest a write or an action. Exposing those needs a policy gate that doesn't
          exist yet, and an attestation can't replace one.
        </p>
      </Callout>

      <H2 id="proves">What the tool still verifies</H2>
      <p>
        An attestation supplies a fact the tool couldn't verify. It doesn't replace the other
        checks. For every entry, the tool still checks the following:
      </p>
      <ul>
        <li>The target resolves to a single method declaration in your source, and the binding is structural.</li>
        <li>The input types are verified, and the parameters in your entry match the modeled inputs one for one.</li>
        <li>Everything the tool read is read-safe. If it sees a write there, the entry is refused.</li>
        <li>The subject entity you name exists, and your claim doesn't contradict what the tool can prove the code reads.</li>
        <li>Wherever your entry claims an identifier, the read is a by-primary-key load.</li>
      </ul>
      <p>
        If the code structure contradicts an assertion, either when you add the entry or after a
        later code change, the attestation is refused with an error and nothing ships. The tool
        doesn't resolve the conflict in favor of either side.
      </p>

      <H2 id="categories">The four categories</H2>
      <DocTable
        head={["Category", "What you assert"]}
        rows={[
          [<IC key="1">predicate</IC>, "What a filtered read selects."],
          [<IC key="2">shape</IC>, "What a read returns, when the tool can't tie the return type to an entity."],
          [<IC key="3">both</IC>, "A filtered read whose return type also can't be tied to an entity. One entry with one name covers both gaps."],
          [
            <IC key="4">boundary</IC>,
            "A remote delegation, including that it is read-only, which is the only property the tool can't check for that kind of read. It needs a named security owner and an explicit affirmation, and it isn't exposed unless you opt in.",
          ],
        ]}
      />

      <H2 id="entry">Entry format</H2>
      <p>
        Entries live in <IC wrap>tibyan/attestations.json</IC> in your application. The file is a
        JSON array, and you commit it alongside the source it describes.
      </p>
      <CodeBlock label="tibyan/attestations.json" lang="json">{`[
  {
    "target": "com.example.billing.service.InvoiceServiceImpl#getInvoicesByBuilding(String, Integer, Integer)",
    "category": "predicate",
    "name": "invoicesByBuilding",
    "resultSemantic": "Invoices belonging to one building, ordered by date descending and returned one page at a time.",
    "parameters": {
      "buildingId": "The numeric identifier of the building whose invoices are returned, passed as a string.",
      "pageNum": "paging",
      "pageSize": "paging"
    },
    "provenance": {
      "assertedBy": "a.reviewer",
      "origin": "human-authored",
      "date": "2026-09-01",
      "fingerprint": ""
    }
  }
]`}</CodeBlock>
      <DocTable
        head={["Field", "Rule"]}
        rows={[
          [
            <IC key="1">target</IC>,
            <>Must resolve to one method, written as <IC wrap>{"<fully qualified class>#<method>(<parameter types>)"}</IC>. A target that matches no method, or two, is refused.</>,
          ],
          [
            <IC key="2">name</IC>,
            <>A name you choose. The tool adds the <IC>attested_</IC> prefix itself (<IC>attested_boundary_</IC> for a boundary entry), so don't include it.</>,
          ],
          [<IC key="3">resultSemantic</IC>, "The sentence the agent sees, word for word. See the next section."],
          [
            <IC key="4">parameters</IC>,
            <>Must match the modeled inputs one for one. Each value is a sentence, or one of two reserved marks: <IC>"paging"</IC>, allowed only on a parameter the tool recognizes from the code structure as paging or ordering, and <IC>"id"</IC>, allowed only on an identifier input where the tool can prove a by-primary-key load.</>,
          ],
          [<IC key="5">subjectEntity</IC>, "The entity you say the read is about. It must exist in the model and must not contradict what the tool can prove the code reads."],
          [
            <IC key="6" wrap>securityOwner, readOnlyAffirmed, assertedAuthorities</IC>,
            "Boundary entries only. Leaving readOnlyAffirmed out doesn't count as affirming it. If it is absent or false, the entry is refused.",
          ],
          [
            <IC key="7">provenance</IC>,
            <>Who asserted it, how the words were produced (<IC>human-authored</IC>, <IC>ai-draft</IC>, or <IC>ai-drafted-human-confirmed</IC>), the date, and the fingerprint. Leave the fingerprint empty, because the CLI fills it in when you stamp the entry.</>,
          ],
        ]}
      />

      <H2 id="sentence">Writing the sentence</H2>
      <p>
        The tool description an agent reads is built from <IC>resultSemantic</IC> and comes after
        the label "Human-attested, not tool-verified". If the sentence is vague, the agent gives
        confident wrong answers. A good sentence says what comes back and how many results, what
        the read excludes without saying so, what an omitted parameter defaults to, and whether the
        result is paged or capped.
      </p>
      <DocTable
        head={["", "Sentence"]}
        rows={[
          ["Too vague", "Returns the costs for a building."],
          [
            "Useful",
            "Collected, outstanding and overdue totals for one building's rental payments, computed over at most the first 25 matching rows because the read leaves the default page size in place; it is not a summary of all of a building's payments.",
          ],
        ]}
      />

      <H2 id="workflow">Add an attestation</H2>
      <ol>
        <li>Write the entry in <IC wrap>tibyan/attestations.json</IC>.</li>
        <li>Stamp the entry. This computes the fingerprint of the code the claim covers and writes it into the file.</li>
        <li>Scan again. The survey reports the entry as attested, or refuses it and gives the reason and its location.</li>
        <li>Commit the file and review it like code. Your next build includes it in the manifest.</li>
      </ol>
      <CodeBlock label="shell" lang="shell">{`tibyan attest /path/to/app --date 2026-09-01
tibyan scan /path/to/app`}</CodeBlock>
      <p>
        The command reference is in the{" "}
        <Link href="/docs/cli/#attest" className="prose-link">
          CLI docs
        </Link>
        .
      </p>

      <H2 id="drift">Fingerprints and drift</H2>
      <p>
        The fingerprint is a SHA-256 over the part of the code structure that the claim covers, and
        it is recomputed on every scan. When the code under an attestation changes, the fingerprint
        stops matching and the attestation is refused with an error, so a claim can't outlive the
        code it was written about. When that happens, read the method again, confirm the sentence
        is still true, and stamp the entry again.
      </p>

      <H2 id="drafts">Drafts</H2>
      <p>
        An entry whose origin is <IC>ai-draft</IC> is a draft, which is neither attested nor
        refused. The survey queues it for review and counts it separately, and it ships no
        capability, manifest entry, or OpenAPI operation. A draft can come from any drafter, human
        or otherwise, as long as the entry carries that origin. A named person confirms drafts one
        entry at a time:
      </p>
      <CodeBlock label="shell" lang="shell">{`tibyan attest /path/to/app --confirm "<target>" --by a.reviewer`}</CodeBlock>
      <p>
        There is no confirm-all option in the CLI or in the API beneath it. If you want an AI
        agent to do the drafting, the repository has a{" "}
        <ExtLink href={LINKS.adoptionPrompt} className="prose-link">
          guided adoption prompt
        </ExtLink>{" "}
        that keeps every entry a draft until a person confirms it.
      </p>

      <H2 id="ships">How attested capabilities are labeled</H2>
      <ul>
        <li>
          The MCP tool name starts with <IC>attested_</IC>, so the name alone shows that the
          capability is attested, before anyone reads the description.
        </li>
        <li>Every description and document says human-attested. An attested capability isn't presented as verified and isn't counted with the verified capabilities.</li>
        <li>
          The OpenAPI document serves attested capabilities under <IC wrap>{"/attested/<name>"}</IC>.
        </li>
        <li>An attested capability runs the same way as a verified one, with the same access. The label changes what the tool claims about a call. It doesn't change how the call is made.</li>
      </ul>
      <H3>Exposure controls</H3>
      <p>
        Three runtime properties control which attested capabilities register: <IC>tibyan.attested.expose</IC> (default{" "}
        <IC>true</IC>), <IC wrap>tibyan.attested.exposeSecurityUnverifiable</IC> (default{" "}
        <IC>false</IC>), and <IC>tibyan.attested.exposeBoundary</IC> (default <IC>false</IC>). They
        are described in the{" "}
        <Link href="/docs/runtime/#properties" className="prose-link">
          runtime reference
        </Link>
        .
      </p>

      <H2 id="owns">Who owns what</H2>
      <DocTable
        head={["Owner", "Responsibility"]}
        rows={[
          [
            <strong key="1">The tool</strong>,
            "Shipping your file unchanged. The claim that ships is the claim you committed, attached to the method the entry targets, labeled as human-attested, and invalidated as soon as the fingerprinted code changes.",
          ],
          [
            <strong key="2">The asserter</strong>,
            "Whether the claim is true. If the assertion is false, the tool can't know. It ships the false sentence unchanged, and an agent will act on it.",
          ],
          [
            <strong key="3">Your review process</strong>,
            "The integrity of the file. The tool doesn't authenticate who typed an entry. That is why attestations are kept in a committed, reviewed file and the tool holds no attestation state of its own.",
          ],
        ]}
      />
      <Callout title="What the read-safety check doesn't catch">
        <p>
          Before it accepts an assertion, the tool refuses the entry if it sees a write in the code
          it read. A write hidden below that code, in a hand-written repository or query-builder
          implementation, isn't caught. The check guarantees that there is no write in what the
          tool read. It doesn't guarantee that there is no write anywhere. Review attestations as
          carefully as you review code.
        </p>
      </Callout>
    </DocPage>
  );
}
