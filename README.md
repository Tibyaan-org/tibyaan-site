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

## Honesty checks

`scripts/honesty-checks.mjs` is the gate that keeps the site as honest as the ledgers it advertises
(plan section 5.2). It runs after `next build` and fails on any hard finding:

- no em or en dashes in site copy (CLAUDE.md rule 9),
- none of the banned oversell claims (plan section 7),
- every internal link in the built `out/` resolves to a real file,
- every Maven Central coordinate the site prints returns 200 (the runtime, the plugin, the CLI jar).

External links (GitHub, Sonatype UI) are warnings on push and pull request, because the repository
may still be private before launch. Set `STRICT_LINKS=1` (the deploy path does) to make every
external link a hard gate once the repository is public.

```bash
npm run build && npm run check   # or: npm run verify
STRICT_LINKS=1 npm run check      # deploy-time strictness
```

CI runs this on every push and pull request that touches `website/**`, via
`.github/workflows/website.yml`, separate from the Maven reactor CI.
