# Tibyaan website

The public marketing and documentation site for [Tibyaan](https://github.com/Tibyaan-org/tibyaan),
the application-modernization tool that makes a Spring backend operable by AI agents by exposing only
what it can prove. This is a standalone repository, extracted from the main repo so it can deploy on
its own. It never participates in the Java build.

Deployed with GitHub Pages at **https://tibyaan-org.github.io/tibyaan-site/**.

## Stack

- Next.js (App Router), static export (`output: "export"`), no server.
- Tailwind CSS v4. The design tokens are declared once in `app/globals.css` as semantic names
  (`--bg`, `--surface`, `--fg`, `--muted`, `--accent`, ...), dark-first with a light theme behind
  the same names. The theme is `data-theme` on `<html>`, set before first paint by the inline script
  in `app/layout.tsx`; the nav toggle stores the visitor's choice. Code panels stay dark in both themes.
- Geist, Geist Mono, and Instrument Serif (the one italic accent in headlines), self-hosted at build
  time via `next/font`.
- Client JavaScript is limited to four small islands: the theme toggle, the mobile menus, the copy
  buttons, and the hero's three-tab window. Every tab panel is server-rendered into the static HTML.
- Content lives in typed modules under `app/_content/`. Every factual number is in `claims.ts`,
  each traced to a document in the main repo that proves it. The survey, the generated-output
  excerpts, and the recorded MCP handshake are verbatim copies of real tool output, with provenance
  (`survey.ts`, `artifacts.ts`, `generated/`). The original plan lives in the main repo at
  `docs/website-plan.md`; the second-generation visual design (dark-first, the docs section)
  supersedes its light-only and zero-client-JS decisions, and keeps every honesty rule.

## Documentation section

`/docs` is a real docs site: a shared shell (`app/docs/layout.tsx`) with a sidebar, an "on this
page" rail, and a previous/next pager. The tree is declared once in `app/_content/docs-nav.ts`; the
sidebar, the docs index, the pager, the home page cards, and the sitemap all read it. To add a page,
add one entry there and create `app/docs/<slug>/page.tsx` using the building blocks in
`app/_components/docs/doc.tsx` (`DocPage`, `H2`, `Callout`, `DocTable`, `Steps`) and `CodeBlock`
from `app/_components/ui.tsx`. Each page names the repository document it adapts, which stays the
authoritative text.

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
