"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOCS_NAV } from "../../_content/docs-nav";

const norm = (p: string) => (p.endsWith("/") ? p : p + "/");

// The docs tree. Client component only so the current page can be marked.
export function DocsSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = norm(usePathname() || "/docs/");
  return (
    <nav aria-label="Documentation" className="flex flex-col gap-7">
      {DOCS_NAV.map((group) => (
        <div key={group.heading}>
          <div className="label mb-2.5 px-3" style={{ fontSize: "0.68rem" }}>
            {group.heading}
          </div>
          <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
            {group.links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="docs-link"
                  aria-current={pathname === l.href ? "page" : undefined}
                  onClick={onNavigate}
                >
                  {l.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
