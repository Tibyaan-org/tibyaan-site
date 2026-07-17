# Tibyaan website

The public marketing and documentation site for Tibyaan. Built to the approved plan in
[docs/website-plan.md](../docs/website-plan.md), stage one: three pages (landing, how it works,
getting started).

This directory is self-contained and independent of the Maven reactor. It never participates in
the Java build.

## Stack

- Next.js (App Router), static export (`output: "export"`), no server.
- Tailwind CSS v4, with the Heritage Modern design tokens declared once in `app/globals.css`
  (`@theme`) as the single source of design truth. Light-only at launch (plan decision D-8).
- IBM Plex Sans, Serif, and Mono, self-hosted at build time via `next/font`.
- Content lives in typed modules under `app/_content/`. Every factual number is in `claims.ts`,
  each traced to the repository document that proves it. The survey and generated-output excerpts
  in `survey.ts` and `artifacts.ts` are verbatim copies of real tool output, with provenance.

## Develop and build

```bash
npm install
npm run dev     # local preview at http://localhost:3000
npm run build   # static export to ./out
```

## The claims lock

The site may make only the claims the docs support (honest-claims sheet, plan section 8). No number
appears that is not in `app/_content/claims.ts`. The survey and artifact excerpts are regenerated
from a real scan and generate against `examples/erp-backend`, not hand-written. The private
enterprise benchmark appears only by counts and shapes, never by name.

Before launch, the site build should run its honesty checks (plan 5.2): a link check, a Maven
Central coordinate check that fetches every printed coordinate and fails on a non-200, an
anti-claims grep, and an em-dash scan.
