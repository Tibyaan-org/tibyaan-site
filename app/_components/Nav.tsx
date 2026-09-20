import Link from "next/link";
import { Mark } from "./Mark";
import { ExtLink } from "./ui";
import { ThemeToggle } from "./ThemeToggle";
import { MobileNav } from "./MobileNav";
import { LINKS, META } from "../_content/claims";

const SECTIONS = [
  { href: "/docs/", label: "Docs" },
  { href: "/how-it-works/", label: "How it works" },
  { href: "/evidence/", label: "Evidence" },
  { href: "/landscape/", label: "Approach" },
];

/*
  Sticky, blurred nav. The bar itself is a server component; the theme toggle and
  the small-screen menu are the only client islands. Translucent colours are derived
  from the tokens with color-mix, so a palette change reaches the nav.
*/
export function Nav() {
  return (
    <nav
      aria-label="Primary"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "color-mix(in srgb, var(--bg) 78%, transparent)",
        backdropFilter: "saturate(160%) blur(14px)",
        WebkitBackdropFilter: "saturate(160%) blur(14px)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div className="container-x relative flex h-[64px] items-center justify-between gap-4">
        <div className="flex items-center gap-7">
          <Link href="/" className="flex items-center gap-2.5 no-underline" aria-label="Tibyaan home">
            <Mark size={26} decorative />
            <span className="text-[17px] font-semibold" style={{ letterSpacing: "-0.03em" }}>
              Tibyaan
            </span>
            <span
              className="hidden sm:inline"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.68rem",
                color: "var(--muted)",
                border: "1px solid var(--line-strong)",
                borderRadius: 999,
                padding: "0.1rem 0.45rem",
              }}
            >
              v{META.version}
            </span>
          </Link>
          <div className="hidden items-center gap-0.5 md:flex">
            {SECTIONS.map((s) => (
              <Link key={s.href} href={s.href} className="nav-link">
                {s.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <ExtLink href={LINKS.github} className="icon-btn">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.64-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z" />
            </svg>
            <span className="sr-only">GitHub</span>
          </ExtLink>
          <Link href="/docs/getting-started/" className="btn btn-primary btn-sm hidden sm:inline-flex">
            Get started
          </Link>
          <MobileNav
            items={[
              ...SECTIONS,
              { href: "/docs/getting-started/", label: "Get started" },
              { href: LINKS.github, label: "GitHub", ext: true },
            ]}
          />
        </div>
      </div>
    </nav>
  );
}
