"use client";

import { useState } from "react";
import { DocsSidebar } from "./DocsSidebar";

// Below the lg breakpoint the sidebar collapses into this disclosure at the top of
// the page. It closes itself when a link is followed.
export function DocsMobileMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="lg:hidden" style={{ borderBottom: "1px solid var(--line)" }}>
      <button
        type="button"
        className="flex w-full items-center justify-between py-4 text-[14px] font-medium"
        style={{ background: "transparent", border: 0, color: "var(--fg)", cursor: "pointer" }}
        aria-expanded={open}
        aria-controls="docs-mobile-menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="flex items-center gap-2.5">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2.5 4.5h11M2.5 8h7M2.5 11.5h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          Documentation menu
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s ease", color: "var(--muted)" }}
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open ? (
        <div id="docs-mobile-menu" className="pb-6">
          <DocsSidebar onNavigate={() => setOpen(false)} />
        </div>
      ) : null}
    </div>
  );
}
