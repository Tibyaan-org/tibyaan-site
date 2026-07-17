# Tibyaan website

The public marketing and documentation site for [Tibyaan](https://github.com/Tibyaan-org/tibyaan),
the application-modernization tool that makes a Spring backend operable by AI agents by exposing only
what it can prove. This is a standalone repository, extracted from the main repo so it can deploy on
its own. It never participates in the Java build.

Deployed with GitHub Pages at **https://tibyaan-org.github.io/tibyaan-site/**.

## Stack

- Next.js (App Router), static export (`output: "export"`), no server.
- Tailwind CSS v4, with the Heritage Modern design tokens declared once in `app/globals.css`
  (`@theme`) as the single source of design truth. Light-only.
- IBM Plex Sans, Serif, and Mono, self-hosted at build time via `next/font`.
- Content lives in typed modules under `app/_content/`. Every factual number is in `claims.ts`,
  each traced to a document in the main repo that proves it. The survey and generated-output
  excerpts in `survey.ts` and `artifacts.ts` are verbatim copies of real tool output, with
  provenance. The approved plan lives in the main repo at `docs/website-plan.md`.

## Develop and build

```bash
npm install
npm run dev     # local preview at http://localhost:3000 (no basePath)
npm run build   # static export to ./out
npm run check   # honesty checks (after build)
```

Local builds use no `basePath`. The deploy sets `BASE_PATH=/tibyaan-site` and
`SITE_URL=https://tibyaan-org.github.io/tibyaan-site` so links, canonicals, and the sitemap carry
the Pages sub-path. To reproduce the deployed output locally:

```bash
BASE_PATH=/tibyaan-site SITE_URL=https://tibyaan-org.github.io/tibyaan-site npm run build
```

## Deployment (GitHub Pages)

`.github/workflows/deploy.yml` builds the static export, runs the honesty checks, and deploys to
Pages on every push to `main`. `.github/workflows/ci.yml` builds and checks pull requests without
deploying.

One-time repository setup: **Settings -> Pages -> Build and deployment -> Source: GitHub Actions.**

Moving to a custom domain later is a two-line change: set `BASE_PATH=""` and `SITE_URL=https://your-domain`
in the workflows (and add a `CNAME`).

## The claims lock

The site may make only the claims the docs support (the honest-claims sheet in the plan). No number
appears that is not in `app/_content/claims.ts`. The survey and artifact excerpts are verbatim from a
real scan and generate against the ERP benchmark, not hand-written. The private enterprise benchmark
appears only by counts and shapes, never by name.

## Honesty checks

`scripts/honesty-checks.mjs` is the gate that keeps the site as honest as the ledgers it advertises.
It runs after `next build` and fails on any hard finding:

- no em or en dashes in site copy,
- none of the banned oversell claims,
- every internal link in the built `out/` resolves to a real file (base-path aware),
- every Maven Central coordinate the site prints returns 200 (the runtime, the plugin, the CLI jar).

External links (GitHub, Sonatype UI) are warnings, because the main repository may still be private.
Set `STRICT_LINKS=1` to make every external link a hard gate once everything is public.

```bash
npm run build && npm run check
STRICT_LINKS=1 npm run check      # strict external-link gate
```
