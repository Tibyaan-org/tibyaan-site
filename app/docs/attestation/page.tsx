import type { Metadata } from "next";
import Link from "next/link";
import { DocPage, H2, H3, Callout, DocTable } from "../../_components/docs/doc";
import { CodeBlock, IC, ExtLink } from "../../_components/ui";
import { LINKS } from "../../_content/claims";

export const metadata: Metadata = {
  title: "Attestation",
  description:
    "Carry a read the tool cannot prove as a human-attested capability: the attestations file, the four categories, fingerprints and drift, drafts, exposure controls, and who owns what.",
  alternates: { canonical: "/docs/attestation/" },
};

export default function Attestation() {
  return (
    <DocPage
      href="/docs/attestation/"
      title="Attestation"
      lead="Most of a real application's read API is filtered reads, and a filter's meaning is not in the code's structure. Attestation lets a named person assert that meaning in a committed, reviewed file. The tool carries the claim exactly, labels it on every surface, and still proves everything around it."
      toc={[
        { id: "when", label: "When to use it" },
        { id: "proves", label: "What the tool still proves" },
        { id: "categories", label: "The four categories" },
        { id: "entry", label: "An entry" },
        { id: "sentence", label: "Writing the sentence" },
        { id: "workflow", label: "The workflow" },
        { id: "drift", label: "Fingerprints and drift" },
        { id: "drafts", label: "Drafts" },
        { id: "ships", label: "What ships, and how it is labeled" },
        { id: "owns", label: "Who owns what" },
      ]}
      source={{ label: "docs/SECURITY.md and the changelog", href: LINKS.security }}
    >
      <H2 id="when">When to use it</H2>
      <p>
        Your survey refused a read you know is safe and useful: a filtered list, a read that
        returns a view object the structure cannot tie to an entity, a read that delegates to a
        remote service. Structure cannot prove what it selects or returns, so discovery will never
        expose it. A person who knows can say so, on the record.
      </p>
      <p>
        Attestation shipped in 0.3.0. It adds to discovery and never changes it: every attestation
        phase measured byte-identical generated output on all three benchmarks.
      </p>
      <Callout title="Reads only">
        <p>
          A write or an action cannot be attested. That boundary needs a policy gate that does not
          exist yet, and an assertion is not a policy gate.
        </p>
      </Callout>

      <H2 id="proves">What the tool still proves</H2>
      <p>An attestation replaces one missing fact, not the whole proof. Around every entry the tool still checks:</p>
      <ul>
        <li>the target resolves to exactly one method declaration in your source, and the binding is structural;</li>
        <li>the input types, and that your entry covers every modeled input exactly;</li>
        <li>read-safety over everything it read: if it sees a write there, the entry is refused;</li>
        <li>that the subject entity you name exists, and that your claim does not contradict what the code provably reads;</li>
        <li>a by-primary-key load, wherever your entry claims an identifier.</li>
      </ul>
      <p>
        If the structural evidence contradicts an assertion, at intake or after a code change, the
        attestation is refused loudly and nothing ships. The tool never silently prefers either
        side.
      </p>

      <H2 id="categories">The four categories</H2>
      <DocTable
        head={["Category", "What the human asserts"]}
        rows={[
          [<IC key="1">predicate</IC>, "What a filtered read selects."],
          [<IC key="2">shape</IC>, "What a read returns, for a read structure cannot tie to an entity."],
          [<IC key="3">both</IC>, "A filtered read whose return type also cannot be tied: one entry, one name, closing both holes."],
          [
            <IC key="4">boundary</IC>,
            "A remote delegation, including that it is read-only, which is the one property the tool cannot check for that shape. It needs a named security owner and an explicit affirmation, and it is not exposed unless you opt in.",
          ],
        ]}
      />

      <H2 id="entry">An entry</H2>
      <p>
        The record lives at <IC wrap>tibyan/attestations.json</IC> in your application, a JSON
        array, committed beside the source it describes.
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
            <>Must resolve to exactly one method: <IC wrap>{"<fully qualified class>#<method>(<parameter types>)"}</IC>. Zero or two matches refuse.</>,
          ],
          [
            <IC key="2">name</IC>,
            <>Yours to mint. The tool adds the <IC>attested_</IC> prefix itself (<IC>attested_boundary_</IC> for a boundary entry), so do not include it.</>,
          ],
          [<IC key="3">resultSemantic</IC>, "The sentence that reaches the agent, verbatim. See the next section."],
          [
            <IC key="4">parameters</IC>,
            <>Must cover every modeled input exactly. Each value is a sentence, or one of two reserved marks: <IC>"paging"</IC>, only on a structurally recognised paging or ordering parameter, and <IC>"id"</IC>, only on an identifier input where the tool can prove a by-primary-key load.</>,
          ],
          [<IC key="5">subjectEntity</IC>, "The entity you assert the read is about. It must exist in the model and must not contradict what the code provably reads."],
          [
            <IC key="6" wrap>securityOwner, readOnlyAffirmed, assertedAuthorities</IC>,
            "Boundary entries only. Silence is never an affirmation: an absent or false readOnlyAffirmed refuses.",
          ],
          [
            <IC key="7">provenance</IC>,
            <>Who asserted it, how the words were produced (<IC>human-authored</IC>, <IC>ai-draft</IC>, or <IC>ai-drafted-human-confirmed</IC>), the date, and the fingerprint. Leave the fingerprint empty: the CLI stamps it.</>,
          ],
        ]}
      />

      <H2 id="sentence">Writing the sentence</H2>
      <p>
        The tool description an agent reads is built from <IC>resultSemantic</IC>, behind the label
        "Human-attested, not tool-verified". A vague sentence produces confident wrong answers. A
        good one says what comes back and how many, what is silently excluded, what an omitted
        parameter defaults to, and whether the result is paged or capped.
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

      <H2 id="workflow">The workflow</H2>
      <ol>
        <li>Write the entry in <IC wrap>tibyan/attestations.json</IC>.</li>
        <li>Stamp it. This computes the fingerprint of the code the claim is about and writes it into the file.</li>
        <li>Re-scan. The survey reports the entry as attested, or refuses it with a located reason.</li>
        <li>Commit the file and review it like code. Your next build carries it into the manifest.</li>
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
        The fingerprint is a SHA-256 over the structural slice the claim covers. It is recomputed on
        every scan. When the code under an attestation changes, the attestation stops matching and
        is refused loudly rather than carried, so a claim can never silently outlive the code it was
        made about. Re-read the method, confirm the sentence is still true, and stamp again.
      </p>

      <H2 id="drafts">Drafts</H2>
      <p>
        An entry whose origin is <IC>ai-draft</IC> is a third thing, neither attested nor refused.
        It is queued in the survey, counted apart, and ships nothing: no capability, no manifest
        entry, no OpenAPI operation. Any drafter works, human or otherwise, so long as the entry
        carries that origin. Confirmation is a per-entry, named human act:
      </p>
      <CodeBlock label="shell" lang="shell">{`tibyan attest /path/to/app --confirm "<target>" --by a.reviewer`}</CodeBlock>
      <p>
        There is deliberately no confirm-all, in the CLI or the API beneath it. If you want an AI
        agent to do the drafting, the repository has a{" "}
        <ExtLink href={LINKS.adoptionPrompt} className="prose-link">
          guided adoption prompt
        </ExtLink>{" "}
        that keeps every entry a draft until a person confirms it.
      </p>

      <H2 id="ships">What ships, and how it is labeled</H2>
      <ul>
        <li>
          The MCP tool name itself starts with <IC>attested_</IC>, so the class is readable before
          any description is.
        </li>
        <li>Every description and document says human-attested. It is never presented as verified and never counted among the verified capabilities.</li>
        <li>
          The OpenAPI document serves attested capabilities under <IC wrap>{"/attested/<name>"}</IC>.
        </li>
        <li>An attested capability executes exactly like a verified one, with the same access. The label changes what the tool claims about a call, never how the call is made.</li>
      </ul>
      <H3>Exposure controls</H3>
      <p>
        Three runtime properties decide what registers: <IC>tibyan.attested.expose</IC> (default{" "}
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
            "Faithful carriage of your file: the claim you ship is exactly the claim you committed, attached to exactly the method the entry targets, labeled, and invalidated the moment the fingerprinted code changes.",
          ],
          [
            <strong key="2">The asserter</strong>,
            "The claim's truth. If the assertion is false, the tool cannot know, will carry the false sentence exactly, and an agent will act on it.",
          ],
          [
            <strong key="3">Your review process</strong>,
            "The integrity of the file. The tool does not authenticate who typed an entry, which is exactly why the record is a committed, reviewed file and not tool state.",
          ],
        ]}
      />
      <Callout title="The bound, at its true strength">
        <p>
          Before accepting an assertion the tool refuses if it sees a write in what it read. A write
          hidden below what it read, in a hand-written repository or query-builder implementation,
          is not caught. The guarantee is "no write in what the tool read", not "no write anywhere".
          Review attestations with the same seriousness as code.
        </p>
      </Callout>
    </DocPage>
  );
}
