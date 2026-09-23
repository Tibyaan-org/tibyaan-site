import Link from "next/link";
import { Mark } from "./Mark";
import { ExtLink } from "./ui";
import { LINKS, META } from "../_content/claims";

const COLUMNS = [
  {
    heading: "Product",
    links: [
      { label: "How it works", href: "/how-it-works/", ext: false },
      { label: "Evidence", href: "/evidence/", ext: false },
      { label: "Approach", href: "/landscape/", ext: false },
    ],
  },
  {
    heading: "Docs",
    links: [
      { label: "Introduction", href: "/docs/", ext: false },
      { label: "Quickstart", href: "/docs/getting-started/", ext: false },
      { label: "CLI reference", href: "/docs/cli/", ext: false },
      { label: "Security", href: "/docs/security/", ext: false },
    ],
  },
  {
    heading: "Project",
    links: [
      { label: "GitHub", href: LINKS.github, ext: true },
      { label: "Maven Central", href: LINKS.central, ext: true },
      { label: "Changelog", href: LINKS.changelog, ext: true },
      { label: "Report a vulnerability", href: LINKS.contact, ext: false },
    ],
  },
];

export function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--line)", background: "var(--bg-soft)" }}>
      <div className="container-x py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <Mark size={26} decorative />
              <span className="text-[17px] font-semibold" style={{ letterSpacing: "-0.03em" }}>
                Tibyaan
              </span>
              <span className="text-[17px] font-semibold text-muted" lang="ar" dir="rtl">
                تِبيان
              </span>
            </div>
            <p className="mt-4 max-w-[36ch] text-[14px] leading-relaxed text-muted">
              Connect AI agents to the Spring backend you already run, through read operations
              verified from your source code.
            </p>
            <p className="mt-4 max-w-[36ch] text-[13px] leading-relaxed text-faint">
              tibyān: classical Arabic for clear exposition, making something evident.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <div className="label mb-4">{col.heading}</div>
              <ul className="m-0 flex list-none flex-col gap-2.5 p-0 text-[14px]">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.ext ? (
                      <ExtLink href={l.href} className="footer-link">
                        {l.label}
                      </ExtLink>
                    ) : l.href.startsWith("mailto:") ? (
                      <a href={l.href} className="footer-link">
                        {l.label}
                      </a>
                    ) : (
                      <Link href={l.href} className="footer-link">
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div
          className="mt-14 flex flex-wrap items-center justify-between gap-3 pt-6"
          style={{ borderTop: "1px solid var(--line)" }}
        >
          <span className="label" style={{ textTransform: "none", letterSpacing: "0.02em" }}>
            {META.groupId} · {META.license} · v{META.version}
          </span>
          <span className="label" style={{ textTransform: "none", letterSpacing: "0.02em" }}>
            Open source
          </span>
        </div>
      </div>
    </footer>
  );
}
