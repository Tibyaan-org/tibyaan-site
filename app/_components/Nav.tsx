import Link from "next/link";
import { Mark } from "./Mark";
import { LINKS } from "../_content/claims";

/*
  Sticky, blurred nav. Server component, no client JS: the blur and sticky are pure
  CSS, the links are anchors. Matches the prototype's nav pattern.
*/
export function Nav() {
  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(244,238,227,0.82)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(228,218,200,0.7)",
      }}
    >
      <div className="mx-auto flex h-[68px] max-w-[1160px] items-center justify-between gap-6 px-6 md:px-8">
        <Link href="/" className="flex items-center gap-3 no-underline" aria-label="Tibyaan home">
          <Mark size={28} />
          <span className="font-serif text-[21px] font-medium leading-none">Tibyaan</span>
        </Link>
        <div className="flex items-center gap-5 md:gap-7">
          <div className="hidden items-center gap-6 text-sm text-muted sm:flex">
            <Link href="/how-it-works/" className="nav-link no-underline">
              How it works
            </Link>
            <Link href="/docs/getting-started/" className="nav-link no-underline">
              Get started
            </Link>
          </div>
          <a
            href={LINKS.github}
            className="btn-primary text-sm"
            style={{ padding: "0.5rem 1rem" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}
