import Link from "next/link";
import { Mark } from "./Mark";
import { ExtLink } from "./ui";
import { LINKS } from "../_content/claims";

const SECTIONS = [
  { href: "/how-it-works/", label: "How it works" },
  { href: "/evidence/", label: "Evidence" },
  { href: "/docs/getting-started/", label: "Get started" },
];

/*
  Sticky, blurred nav. Server component, no client JS. The link cluster is a single
  set that stays visible at every width: on a narrow screen the whole right cluster
  wraps below the wordmark (flex-wrap on the row), so mobile users never lose the
  in-site links. Translucent colors are derived from the tokens with color-mix so a
  palette change reaches the nav.
*/
export function Nav() {
  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "color-mix(in srgb, var(--color-limestone) 82%, transparent)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid color-mix(in srgb, var(--color-border) 70%, transparent)",
      }}
    >
      <div className="mx-auto flex min-h-[68px] max-w-[1160px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-2.5 sm:py-0 md:px-8">
        <Link href="/" className="flex items-center gap-3 no-underline" aria-label="Tibyaan home">
          <Mark size={28} decorative />
          <span className="font-serif text-[21px] font-medium leading-none">Tibyaan</span>
        </Link>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 md:gap-x-6">
          <div className="flex items-center gap-x-5 text-sm text-muted md:gap-x-6">
            {SECTIONS.map((s) => (
              <Link key={s.href} href={s.href} className="nav-link no-underline">
                {s.label}
              </Link>
            ))}
          </div>
          <ExtLink
            href={LINKS.github}
            className="btn-primary text-sm"
            style={{ padding: "0.5rem 1rem" }}
          >
            GitHub
          </ExtLink>
        </div>
      </div>
    </nav>
  );
}
