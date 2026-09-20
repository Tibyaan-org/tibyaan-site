"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { href: string; label: string; ext?: boolean };

// The small-screen menu. A button toggles a panel under the sticky nav; the panel
// closes on navigation and on Escape.
export function MobileNav({ items }: { items: Item[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="icon-btn"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          {open ? (
            <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          ) : (
            <path d="M2.5 4.5h11M2.5 8h11M2.5 11.5h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          )}
        </svg>
      </button>
      {open ? (
        <div
          id="mobile-menu"
          className="absolute left-0 right-0 top-full"
          style={{ background: "var(--bg)", borderBottom: "1px solid var(--line)" }}
        >
          <div className="container-x flex flex-col gap-1 py-4">
            {items.map((it) =>
              it.ext ? (
                <a
                  key={it.href}
                  href={it.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-link"
                  style={{ fontSize: "1rem", padding: "0.7rem 0.75rem" }}
                >
                  {it.label}
                </a>
              ) : (
                <Link
                  key={it.href}
                  href={it.href}
                  className="nav-link"
                  style={{ fontSize: "1rem", padding: "0.7rem 0.75rem" }}
                >
                  {it.label}
                </Link>
              ),
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
