#!/usr/bin/env node
/*
  Honesty checks for the Tibyaan website (plan docs/website-plan.md section 5.2).
  Run after `next build`. Fails the build (exit 1) on any HARD finding:

    1. em-dash / en-dash scan   no em or en dashes anywhere in site copy (CLAUDE.md rule 9)
    2. anti-claims grep         none of the banned oversell patterns in site copy (plan section 7)
    3. internal link check      every internal href in the built out/ resolves to a real file
    4. Central coordinate check every Maven Central coordinate the site prints returns 200

  Non-critical external links (GitHub, Sonatype web UI) are checked as WARNINGS only, so a
  flaky HEAD request or a rate limit never fails the build. The honesty-critical repo1.maven.org
  coordinates are the hard gate: coordinates that 404 can never ship.

  Usage: node scripts/honesty-checks.mjs   (cwd = website/, i.e. `npm run check`)
*/
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const failures = [];
const warnings = [];
const notes = [];

function walk(dir, keep) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const name of readdirSync(dir)) {
    if (["node_modules", ".next", "out", ".git"].includes(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p, keep));
    else if (keep(p)) out.push(p);
  }
  return out;
}

// Files that carry authored copy (excludes the verbatim generated .txt from the
// anti-claims grep, which is data, not marketing; it is still dash-scanned).
const APP = join(ROOT, "app");
const copyFiles = [
  ...walk(APP, () => true),
  ...(existsSync(join(ROOT, "README.md")) ? [join(ROOT, "README.md")] : []),
];

// ---- 1. em-dash / en-dash scan --------------------------------------------
const DASH = /[\u2013\u2014\u2015]/; // en dash, em dash, horizontal bar (as escapes, so this file itself stays dash-free)
let dashHits = 0;
for (const f of copyFiles) {
  readFileSync(f, "utf8")
    .split("\n")
    .forEach((line, i) => {
      if (DASH.test(line)) {
        dashHits++;
        failures.push(`em/en dash: ${rel(f)}:${i + 1}  ${line.trim().slice(0, 70)}`);
      }
    });
}
notes.push(`em/en dash scan: ${copyFiles.length} files, ${dashHits} finding(s)`);

// ---- 2. anti-claims grep (authored copy only) -----------------------------
// Precise phrasings of the banned oversell claims, tuned NOT to hit legitimate
// qualified copy ("any client that speaks HTTP", "reads any Java source").
const BANNED = [
  /\bany app\b/i,
  /\bfull coverage\b/i,
  /just add a dependency/i,
  /\bin minutes\b/i,
  /battle[ -]?tested/i,
  /production[ -]?proven/i,
  /self[ -]?healing/i,
  /understands your business/i,
  /\bAI[ -]?operable\b/i,
  /\bnever wrong\b/i,
  /works with any/i,
];
let claimHits = 0;
for (const f of copyFiles) {
  if (!/\.(ts|tsx|md)$/.test(f)) continue;
  readFileSync(f, "utf8")
    .split("\n")
    .forEach((line, i) => {
      for (const re of BANNED) {
        if (re.test(line)) {
          claimHits++;
          failures.push(`banned claim /${re.source}/: ${rel(f)}:${i + 1}  ${line.trim().slice(0, 80)}`);
        }
      }
    });
}
notes.push(`anti-claims grep: ${BANNED.length} patterns, ${claimHits} finding(s)`);

// ---- 3. internal link check (built output) --------------------------------
// With a deploy basePath (GitHub Pages sub-path), internal links carry that
// prefix, but the exported files under out/ do not. Strip it before resolving.
const BASE_PATH = process.env.BASE_PATH || "";
const OUT = join(ROOT, "out");
const externalUrls = new Set();
if (!existsSync(OUT)) {
  failures.push("out/ not found: run `next build` before the honesty checks");
} else {
  const htmlFiles = walk(OUT, (p) => p.endsWith(".html"));
  notes.push(`scanned ${htmlFiles.length} built HTML file(s)${BASE_PATH ? ` (basePath ${BASE_PATH})` : ""}`);
  for (const f of htmlFiles) {
    const html = readFileSync(f, "utf8");
    for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const h = m[1];
      if (/^https?:\/\//.test(h)) externalUrls.add(h);
      else if (/^(mailto:|#|data:|tel:)/.test(h)) continue;
      else if (h.startsWith("/")) {
        let clean = h.split("#")[0].split("?")[0];
        if (BASE_PATH && (clean === BASE_PATH || clean.startsWith(BASE_PATH + "/"))) {
          clean = clean.slice(BASE_PATH.length) || "/";
        }
        const candidates = [join(OUT, clean), join(OUT, clean, "index.html"), join(OUT, clean.replace(/\/$/, "") + ".html")];
        if (!candidates.some(existsSync)) failures.push(`internal link resolves to no file: ${h}  (in ${rel(f)})`);
      }
    }
  }
}

// ---- 4. Maven Central coordinate check (hard gate) ------------------------
// Version is read from the site's own claims file, so the check and the site
// can never drift apart.
let version = "";
try {
  version = (readFileSync(join(APP, "_content/claims.ts"), "utf8").match(/version:\s*"([^"]+)"/) || [])[1] || "";
} catch {
  failures.push("could not read version from app/_content/claims.ts");
}
if (version) {
  const base = "https://repo1.maven.org/maven2/io/github/tibyaan-org";
  const coordinates = [
    `${base}/tibyan-runtime-spring/${version}/tibyan-runtime-spring-${version}.pom`,
    `${base}/tibyan-maven-plugin/${version}/tibyan-maven-plugin-${version}.pom`,
    `${base}/tibyan-cli/${version}/tibyan-cli-${version}-jar-with-dependencies.jar`,
  ];
  // any repo1.maven.org URL the pages actually print is honesty-critical too
  for (const u of externalUrls) if (u.includes("repo1.maven.org")) coordinates.push(u);
  const seen = new Set();
  for (const url of coordinates) {
    if (seen.has(url)) continue;
    seen.add(url);
    const status = await probe(url);
    if (status === 200) notes.push(`Central OK (${status}): ${url}`);
    else failures.push(`Maven Central coordinate not reachable (status ${status}): ${url}`);
  }
}

// ---- external links -------------------------------------------------------
// Soft (warnings) on push/PR, because the GitHub repo may still be private
// pre-launch and an unauthenticated request 404s. Set STRICT_LINKS=1 (the
// deploy workflow does) to make every external link a hard gate once the repo
// is public, so a broken outbound link can never ship.
const STRICT = process.env.STRICT_LINKS === "1";
for (const url of externalUrls) {
  if (url.includes("repo1.maven.org")) continue; // already hard-checked
  const status = await probe(url);
  if (status >= 200 && status < 400) notes.push(`external OK (${status}): ${url}`);
  else (STRICT ? failures : warnings).push(`external link status ${status}: ${url}`);
}

// ---- report ---------------------------------------------------------------
function rel(p) {
  return p.replace(ROOT + "\\", "").replace(ROOT + "/", "").replace(/\\/g, "/");
}
async function probe(url) {
  for (const method of ["HEAD", "GET"]) {
    try {
      const res = await fetch(url, { method, redirect: "follow", headers: { "User-Agent": "tibyaan-honesty-check" } });
      if (res.status !== 405) return res.status; // 405 = method not allowed, retry with GET
    } catch {
      return 0;
    }
  }
  return 0;
}

console.log("\nHonesty checks");
for (const n of notes) console.log("  .  " + n);
for (const w of warnings) console.log("  !  WARN  " + w);
for (const f of failures) console.log("  x  FAIL  " + f);

if (failures.length) {
  console.log(`\nFAILED: ${failures.length} hard finding(s), ${warnings.length} warning(s).\n`);
  process.exit(1);
}
console.log(`\nPASSED: 0 hard findings, ${warnings.length} warning(s).\n`);
