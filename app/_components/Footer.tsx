import { Mark } from "./Mark";
import { LINKS, META } from "../_content/claims";

export function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--color-border)", background: "var(--color-surface)" }}>
      <div className="mx-auto max-w-[1160px] px-6 py-11 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Mark size={24} />
            <span className="font-serif text-[17px] font-medium">Tibyaan</span>
            <span
              className="text-[17px] font-semibold"
              style={{ fontFamily: "var(--font-sans)" }}
              lang="ar"
              dir="rtl"
            >
              تِبيان
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
            <a href={LINKS.github} target="_blank" rel="noopener noreferrer" className="footer-link">
              GitHub
            </a>
            <a href={LINKS.central} target="_blank" rel="noopener noreferrer" className="footer-link">
              Maven Central
            </a>
            <a href={LINKS.docs} target="_blank" rel="noopener noreferrer" className="footer-link">
              Docs
            </a>
            <a href={LINKS.security} target="_blank" rel="noopener noreferrer" className="footer-link">
              Security
            </a>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
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
