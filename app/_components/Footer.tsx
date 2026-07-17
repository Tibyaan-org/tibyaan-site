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
    heading: "Adopt",
    links: [
      { label: "Get started", href: "/docs/getting-started/", ext: false },
      { label: "Security", href: "/docs/security/", ext: false },
      { label: "Documentation", href: "/docs/", ext: false },
    ],
  },
  {
    heading: "Project",
    links: [
      { label: "GitHub", href: LINKS.github, ext: true },
      { label: "Maven Central", href: LINKS.central, ext: true },
      { label: "Report a vulnerability", href: LINKS.contact, ext: false },
    ],
  },
];

export function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--color-border)", background: "var(--color-surface)" }}>
      <div className="mx-auto max-w-[1160px] px-6 py-14 md:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <Mark size={24} decorative />
              <span className="font-serif text-[17px] font-medium">Tibyaan</span>
              <span className="text-[17px] font-semibold" lang="ar" dir="rtl">
                تِبيان
              </span>
            </div>
            <p className="mt-4 max-w-[34ch] text-[13.5px] leading-relaxed text-muted">
              AI agents for the backend you already run. Every tool proven, or refused.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <div className="label mb-4">{col.heading}</div>
              <ul className="flex flex-col gap-2.5 text-[14px] text-muted">
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
                      <Link href={l.href} className="footer-link no-underline">
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
          className="mt-12 flex flex-wrap items-center justify-between gap-3 pt-6"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          <span className="label" style={{ textTransform: "none", letterSpacing: "0.04em" }}>
            {META.groupId} · {META.license} · v{META.version}
          </span>
          <span className="label" style={{ textTransform: "none", letterSpacing: "0.04em" }}>
            Open source. Verified, not asserted.
          </span>
        </div>
      </div>
    </footer>
  );
}
