/*
  Survey provenance. The verbatim excerpt itself is NOT a JavaScript string: it lives
  in ./generated/erp-survey.txt so that pasting future real CLI output can never collide
  with template-literal syntax or break JSX. The page reads that text file at build time
  and renders it as an escaped text node inside <pre><code> (see app/page.tsx and
  ./generated/README.md for the regeneration contract). This module carries only the
  provenance shown in the caption.
*/

export const SURVEY_PROVENANCE = {
  command: "tibyan scan examples/erp-backend",
  tool: "tibyan CLI 0.2.0-SNAPSHOT (current build)",
  app: "examples/erp-backend (benchmark whose per-entity ledger is public: docs/experiments/third-app-trial.md)",
  date: "2026-07-17",
} as const;
