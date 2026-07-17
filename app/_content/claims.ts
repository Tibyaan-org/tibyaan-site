/*
  THE CLAIMS LOCK.

  Every factual number and load-bearing statement the site makes lives here, once,
  each traced to the repository document that proves it (docs/website-plan.md
  section 8, claims C-1 to C-20 and the two output claims C-25/C-26). Pages import
  from this file and never inline a number. Changing a claim is a one-file,
  merge-visible diff, reviewed against the honest-claims sheet.

  Rules encoded here:
  - The strong claim (zero wrong bindings) always travels with its scope.
  - The private enterprise benchmark appears only by counts and shape, never named.
  - No number appears that is not in the honest-claims sheet.
*/

export const META = {
  version: "0.2.0", // C-19: current release on Maven Central (0.1.0 remains available)
  groupId: "io.github.tibyaan-org", // C-19 (README, namespace-wired memory)
  license: "Apache-2.0", // C-19 (LICENSE)
  cliVersionExample: "0.2.0", // the released line the coordinates resolve to
} as const;

// C-4: the headline record. Scope is a sibling field, never separable.
export const RECORD = {
  verifiedTools: 31, // erp 25 + pms 2 + enterprise 4 (the three ledgers)
  applications: 3,
  wrongBindings: 0,
  scope: "across three real, unmodified applications, on every run",
} as const;

// C-5, C-6, C-7: the three benchmark rows. The third is redacted by rule.
export const BENCHMARKS = [
  {
    id: "erp",
    label: "ERP backend",
    entities: 25,
    capabilities: 25,
    byId: 16,
    list: 9,
    misBound: 0,
    note: "Services return entities; discovers well.",
    source: "docs/experiments/third-app-trial.md", // C-5
    redacted: false,
  },
  {
    id: "pms",
    label: "PMS backend",
    entities: 43,
    capabilities: 2,
    byId: 2,
    list: 0,
    misBound: 0,
    note: "Services return view objects; most reads refused by name.",
    source: "docs/experiments/second-app-trial.md", // C-6
    redacted: false,
  },
  {
    id: "enterprise",
    // C-7: never a name, a domain, or an industry. Counts and shapes only.
    label: "A real multi-module enterprise Spring application",
    modules: 169,
    entities: 111,
    capabilities: 4,
    misBound: 0,
    note: "Reuses entity names across bounded contexts; emits valid output where simple-name keying could not.",
    source: "docs/experiments/enterprise-benchmark.md (redacted)", // C-7
    redacted: true,
  },
] as const;

// The refusal causes, in the adopter's words. Used on getting-started.
export const REFUSAL_CAUSES = [
  {
    code: "NO_BACKING_METHOD",
    plain: "No service method structurally backs this read, so nothing is exposed.",
  },
  {
    code: "AMBIGUOUS_BINDING",
    plain:
      "Two or more methods both fit the shape of the read; the tool refuses rather than pick one.",
  },
  {
    code: "NO_IDENTIFIER",
    plain:
      "The entity has no identifier that maps to a bindable primitive, so a read-by-id cannot be formed.",
  },
  {
    code: "LIST_AMBIGUOUS",
    plain: "More than one list-all candidate exists; the tool will not choose between them.",
  },
] as const;

// C-18: host requirements. Stated before adoption, not after.
export const REQUIREMENTS = [
  {
    k: "Host application",
    v: "Spring Boot 3.x on Java 17 or later. A Boot 2.x or Java 8 backend cannot host the runtime as-is.",
  },
  { k: "Build tool", v: "Maven. The build-time manifest generation ships as a Maven plugin." },
  {
    k: "Preview CLI",
    v: "Needs only Java 17. It reads source and never runs your application.",
  },
  {
    k: "Transport",
    v: "MCP over HTTP with Server-Sent Events at /sse. A stdio-only client needs a bridge.",
  },
] as const;

// C-20: what is refused today, by design. Each is refuse-over-guessing, not an oversight.
export const BOUNDARIES = [
  {
    k: "Filtered reads",
    v: "findByCategory, search, and similar. A parameter's meaning is a claim the tool cannot verify from structure, and a tool description an agent acts on must not carry an unverified claim.",
  },
  {
    k: "Writes and actions",
    v: "Refused at the discovery level until an explicit policy gate exists. A write is never generated into the manifest.",
  },
  {
    k: "List envelopes",
    v: "Custom paged result-set wrapper types are not yet seen through. The unfiltered list is modeled; the wrapped variants are not.",
  },
  {
    k: "Non-Spring stacks",
    v: "The model is framework-neutral by design, but only the Spring source provider exists today.",
  },
] as const;

// The four external links the site points at. The Central ones are verified live
// by the site build's link check before anything ships (plan 5.2).
export const LINKS = {
  github: "https://github.com/Tibyaan-org/tibyaan",
  central: "https://central.sonatype.com/namespace/io.github.tibyaan-org",
  cliJar:
    "https://repo1.maven.org/maven2/io/github/tibyaan-org/tibyan-cli/0.2.0/tibyan-cli-0.2.0-jar-with-dependencies.jar",
  security: "https://github.com/Tibyaan-org/tibyaan/blob/main/docs/SECURITY.md",
  docs: "https://github.com/Tibyaan-org/tibyaan/tree/main/docs",
  connecting:
    "https://github.com/Tibyaan-org/tibyaan/blob/main/docs/CONNECTING-AN-MCP-CLIENT.md",
  erpLedger: "https://github.com/Tibyaan-org/tibyaan/blob/main/docs/experiments/third-app-trial.md",
  pmsLedger:
    "https://github.com/Tibyaan-org/tibyaan/blob/main/docs/experiments/second-app-trial.md",
  contact: "mailto:ahmed0elseginy@gmail.com",
} as const;
