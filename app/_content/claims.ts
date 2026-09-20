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
  version: "0.3.0", // C-19: current release on Maven Central (0.2.0 and 0.1.0 remain available)
  groupId: "io.github.tibyaan-org", // C-19 (README, namespace-wired memory)
  license: "Apache-2.0", // C-19 (LICENSE)
  cliVersionExample: "0.3.0", // the released line the coordinates resolve to
  released: "2026-09-03", // CHANGELOG.md, 0.3.0
} as const;

// C-4: the headline record. Scope is a sibling field, never separable.
export const RECORD = {
  // erp 25 + pms 5 + enterprise 4 (the three ledgers). pms was re-baselined from 2 to 5 on
  // 2026-07-20 after the adopter repaired copy-artifact parse defects
  // (docs/experiments/second-app-trial.md section 9; docs/website-plan.md section 2.1).
  verifiedTools: 34,
  applications: 3,
  wrongBindings: 0,
  // "unmodified" is deliberately not claimed: the pms copy's corrupted files were repaired.
  scope: "across three real benchmark applications, on every run",
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
    capabilities: 5,
    byId: 5,
    list: 0,
    misBound: 0,
    note: "Services return view objects; most reads refused by name.",
    source: "docs/experiments/second-app-trial.md section 9 (re-baseline 2026-07-20)", // C-6
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

// C-25: the ERP survey's own Totals line, as numbers. The verbatim text these restate is
// app/_content/generated/erp-survey.txt (scan of 2026-07-17); the two must always agree.
export const ERP_SURVEY = {
  discovered: 25,
  failed: 9,
  listRefused: 1,
  misBound: 0,
} as const;

// The refusal causes, in the adopter's words. Used on the survey guide.
// Source: docs/CLI.md (scan output) and the provider's EntityOutcome causes.
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
    code: "COMPOSITE_KEY",
    plain:
      "The entity's identifier is a composite key, so no single-identifier read-by-id is formed.",
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

// C-20: what is not discovered today, by design. Each is refuse-over-guessing, not an
// oversight. Wording tracks README "What it does not do yet" and CHANGELOG 0.3.0 (Attestation).
export const BOUNDARIES = [
  {
    k: "Filtered reads",
    v: "findByCategory, search, and similar are never discovered. A parameter's meaning is a claim the tool cannot verify from structure, and a tool description an agent acts on must not carry an unverified claim. Since 0.3.0 a person can carry one as a human-attested capability, labeled as such, never as verified.",
  },
  {
    k: "Writes and actions",
    v: "Refused at the discovery level until an explicit policy gate exists. A write is never generated into the manifest, and a write cannot be attested either.",
  },
  {
    k: "List envelopes",
    v: "Custom paged result-set wrapper types are not seen through by discovery. The unfiltered list is modeled; what a wrapped variant returns is a claim for attestation, not a guess.",
  },
  {
    k: "Non-Spring stacks",
    v: "The model is framework-neutral by design, but only the Spring source provider exists today.",
  },
] as const;

// The external links the site points at. The Central ones are verified live
// by the site build's link check before anything ships (plan 5.2).
export const LINKS = {
  github: "https://github.com/Tibyaan-org/tibyaan",
  central: "https://central.sonatype.com/namespace/io.github.tibyaan-org",
  cliJar:
    "https://repo1.maven.org/maven2/io/github/tibyaan-org/tibyan-cli/0.3.0/tibyan-cli-0.3.0-jar-with-dependencies.jar",
  security: "https://github.com/Tibyaan-org/tibyaan/blob/main/docs/SECURITY.md",
  docs: "https://github.com/Tibyaan-org/tibyaan/tree/main/docs",
  connecting:
    "https://github.com/Tibyaan-org/tibyaan/blob/main/docs/CONNECTING-AN-MCP-CLIENT.md",
  commands: "https://github.com/Tibyaan-org/tibyaan/blob/main/docs/COMMANDS.md",
  cliDoc: "https://github.com/Tibyaan-org/tibyaan/blob/main/docs/CLI.md",
  faqDoc: "https://github.com/Tibyaan-org/tibyaan/blob/main/docs/FAQ.md",
  multiModuleDoc: "https://github.com/Tibyaan-org/tibyaan/blob/main/docs/MULTI-MODULE.md",
  changelog: "https://github.com/Tibyaan-org/tibyaan/blob/main/CHANGELOG.md",
  adoptionPrompt:
    "https://github.com/Tibyaan-org/tibyaan/blob/main/docs/AI-ADOPTION-PROMPT.md",
  erpLedger: "https://github.com/Tibyaan-org/tibyaan/blob/main/docs/experiments/third-app-trial.md",
  pmsLedger:
    "https://github.com/Tibyaan-org/tibyaan/blob/main/docs/experiments/second-app-trial.md",
  landscapeDoc:
    "https://github.com/Tibyaan-org/tibyaan/blob/main/docs/competitive-landscape.md",
  contact: "mailto:ahmed0elseginy@gmail.com",
} as const;
