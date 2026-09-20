import type { ReactNode } from "react";
import Link from "next/link";
import { DOCS_FLAT, DOCS_NAV } from "../../_content/docs-nav";
import { ExtLink } from "../ui";

/* The building blocks of a documentation page. Server components. */

export type TocItem = { id: string; label: string };

// The page shell: breadcrumb, title, lead, the article, an "on this page" rail, the
// link to the authoritative repository document, and the previous/next pager.
export function DocPage({
  href,
  title,
  lead,
  toc = [],
  source,
  children,
}: {
  href: string;
  title: string;
  lead: ReactNode;
  toc?: TocItem[];
  source?: { label: string; href: string };
  children: ReactNode;
}) {
  const i = DOCS_FLAT.findIndex((d) => d.href === href);
  const prev = i > 0 ? DOCS_FLAT[i - 1] : null;
  const next = i >= 0 && i < DOCS_FLAT.length - 1 ? DOCS_FLAT[i + 1] : null;
  const group = DOCS_NAV.find((g) => g.links.some((l) => l.href === href));

  return (
    <div className="grid grid-cols-1 gap-x-12 xl:grid-cols-[minmax(0,1fr)_190px]">
      <article className="min-w-0 pb-20 pt-10 lg:pt-12">
        <div className="label mb-4 flex items-center gap-2" style={{ textTransform: "none", letterSpacing: "0.02em" }}>
          <Link href="/docs/" className="footer-link">
            Docs
          </Link>
          <span aria-hidden="true">/</span>
          <span style={{ color: "var(--accent)" }}>{group?.heading ?? "Docs"}</span>
        </div>
        <h1 className="text-[clamp(32px,4vw,44px)] font-semibold leading-[1.08]" style={{ letterSpacing: "-0.035em" }}>
          {title}
        </h1>
        <p className="mt-5 max-w-[66ch] text-[17px] leading-relaxed text-muted">{lead}</p>

        <div className="doc mt-10 max-w-[760px]">{children}</div>

        {source ? (
          <p className="mt-12 max-w-[760px] text-[13.5px] leading-relaxed text-muted">
            The authoritative text is{" "}
            <ExtLink href={source.href} className="prose-link">
              {source.label}
            </ExtLink>{" "}
            in the repository. If this page and that document ever disagree, the repository wins.
          </p>
        ) : null}

        <nav aria-label="Previous and next page" className="mt-10 grid max-w-[760px] grid-cols-1 gap-4 sm:grid-cols-2">
          {prev ? (
            <Link href={prev.href} className="card block p-5 no-underline">
              <div className="label" style={{ fontSize: "0.66rem" }}>
                Previous
              </div>
              <div className="mt-1.5 text-[15px] font-medium text-fg">{prev.title}</div>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={next.href} className="card block p-5 text-right no-underline">
              <div className="label" style={{ fontSize: "0.66rem" }}>
                Next
              </div>
              <div className="mt-1.5 text-[15px] font-medium text-fg">{next.title}</div>
            </Link>
          ) : null}
        </nav>
      </article>

      {toc.length ? (
        <aside
          className="hidden xl:block"
          style={{ position: "sticky", top: 64, alignSelf: "start", padding: "3rem 0", maxHeight: "calc(100vh - 64px)", overflowY: "auto" }}
        >
          <div className="label mb-3" style={{ fontSize: "0.66rem" }}>
            On this page
          </div>
          <ul className="m-0 list-none p-0" style={{ borderLeft: "1px solid var(--line)", paddingLeft: "0.9rem" }}>
            {toc.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`} className="toc-link">
                  {t.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      ) : null}
    </div>
  );
}

export function H2({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id}>
      <a href={`#${id}`} className="heading-anchor">
        {children}
      </a>
    </h2>
  );
}

export function H3({ id, children }: { id?: string; children: ReactNode }) {
  return <h3 id={id}>{children}</h3>;
}

export function Callout({
  title,
  tone = "note",
  children,
}: {
  title?: string;
  tone?: "note" | "ok";
  children: ReactNode;
}) {
  return (
    <div className={`callout${tone === "ok" ? " callout-ok" : ""}`} role="note">
      <div>
        {title ? (
          <p style={{ color: "var(--fg)", fontWeight: 600, marginBottom: "0.3rem" }}>{title}</p>
        ) : null}
        {children}
      </div>
    </div>
  );
}

export function DocTable({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="card mt-5 overflow-x-auto">
      <table className="doc-table">
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// A numbered sequence of steps with a rail, for the quickstart-style pages.
export function Steps({ children }: { children: ReactNode }) {
  return <div className="mt-8 flex flex-col">{children}</div>;
}

export function Step({ n, id, title, children }: { n: number; id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="relative grid grid-cols-[36px_minmax(0,1fr)] gap-x-5 pb-12">
      <div className="flex flex-col items-center">
        <span
          className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-[13px] font-medium"
          style={{
            fontFamily: "var(--font-mono)",
            border: "1px solid var(--accent-line)",
            background: "var(--accent-soft)",
            color: "var(--accent)",
          }}
        >
          {n}
        </span>
        <span aria-hidden="true" className="mt-2 w-px flex-1" style={{ background: "var(--line)" }} />
      </div>
      <div className="min-w-0">
        <h2
          className="text-[1.35rem] font-semibold leading-tight"
          style={{ margin: 0, padding: "0.3rem 0 0", border: 0 }}
        >
          <a href={`#${id}`} className="heading-anchor">
            {title}
          </a>
        </h2>
        {children}
      </div>
    </section>
  );
}
