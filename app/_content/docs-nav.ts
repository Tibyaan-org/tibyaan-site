/*
  The documentation tree, once. The sidebar, the mobile docs menu, the docs index
  cards, the previous/next pager, and the sitemap all read this list, so adding a
  page is one entry here plus its page.tsx.
*/

export type DocLink = { title: string; href: string; blurb: string };
export type DocGroup = { heading: string; links: DocLink[] };

export const DOCS_NAV: DocGroup[] = [
  {
    heading: "Start here",
    links: [
      {
        title: "Introduction",
        href: "/docs/",
        blurb: "What Tibyaan is, the three states a capability can be in, and the path through these docs.",
      },
      {
        title: "Quickstart",
        href: "/docs/getting-started/",
        blurb: "Preview read-only, adopt with two build entries, connect an agent, gate the endpoint.",
      },
      {
        title: "Reading your survey",
        href: "/docs/reading-your-survey/",
        blurb: "What every line of the scan output means, each refusal cause, and the numbers that must stay 0.",
      },
    ],
  },
  {
    heading: "Guides",
    links: [
      {
        title: "Connect an MCP client",
        href: "/docs/connecting/",
        blurb: "Smoke-test the endpoint, then point Claude Code, Claude Desktop, or another client at it.",
      },
      {
        title: "Multi-module applications",
        href: "/docs/multi-module/",
        blurb: "How scan scope works, and how to get one manifest that covers a whole reactor.",
      },
      {
        title: "Attestation",
        href: "/docs/attestation/",
        blurb: "Carry a read the tool cannot prove as a labeled, fingerprinted human assertion.",
      },
    ],
  },
  {
    heading: "Reference",
    links: [
      {
        title: "CLI",
        href: "/docs/cli/",
        blurb: "scan, generate, attest, validate, version: synopsis, options, and exit codes.",
      },
      {
        title: "Maven plugin",
        href: "/docs/maven-plugin/",
        blurb: "The generate goal, its parameters, resilient and strict modes.",
      },
      {
        title: "Spring runtime",
        href: "/docs/runtime/",
        blurb: "How the manifest is found and served, and the runtime properties that control exposure.",
      },
    ],
  },
  {
    heading: "Trust",
    links: [
      {
        title: "Security",
        href: "/docs/security/",
        blurb: "What the generated layer executes, the read-only boundary, and what you must gate.",
      },
      {
        title: "FAQ",
        href: "/docs/faq/",
        blurb: "Short answers to what surprises people on a first run.",
      },
    ],
  },
];

export const DOCS_FLAT: DocLink[] = DOCS_NAV.flatMap((g) => g.links);
