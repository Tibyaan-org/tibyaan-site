"use client";

import { useId, useState, type KeyboardEvent, type ReactNode } from "react";

export type ShowcaseTab = {
  key: string;
  label: string;
  title: string; // the line above the panel: the command that produced it, or the file shown
  isCommand: boolean; // true when title is a command that was really run (gets a $ prompt)
  panel: ReactNode; // server-rendered, verbatim content
  caption: ReactNode; // provenance line under the window
};

/*
  The hero's three-step window: scan, generate, call. The panels are rendered on the
  server from verbatim text files and passed in as nodes; this component only decides
  which one is visible. Every panel stays in the DOM (hidden), so the full text is in
  the static HTML for readers without JavaScript and for search engines.
*/
export function HeroShowcase({ tabs }: { tabs: ShowcaseTab[] }) {
  const [active, setActive] = useState(0);
  const uid = useId();

  function onKey(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (active + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length;
    setActive(next);
    document.getElementById(`${uid}-tab-${next}`)?.focus();
  }

  return (
    <div className="min-w-0">
      <div className="frame" dir="ltr">
        <div className="frame-bar" style={{ paddingLeft: "1rem", minHeight: 0, alignItems: "stretch" }}>
          <div className="hidden items-center gap-2 pr-3 sm:flex">
            <span className="frame-dot" />
            <span className="frame-dot" />
            <span className="frame-dot" />
          </div>
          <div className="tabs" role="tablist" aria-label="Tibyaan in three steps" onKeyDown={onKey}>
            {tabs.map((t, i) => (
              <button
                key={t.key}
                id={`${uid}-tab-${i}`}
                type="button"
                role="tab"
                className="tab"
                aria-selected={i === active}
                aria-controls={`${uid}-panel-${i}`}
                tabIndex={i === active ? 0 : -1}
                onClick={() => setActive(i)}
              >
                <span className="tab-n" aria-hidden="true">
                  {i + 1}
                </span>
                {t.label}
              </button>
            ))}
          </div>
        </div>
        {tabs.map((t, i) => (
          <div
            key={t.key}
            id={`${uid}-panel-${i}`}
            role="tabpanel"
            aria-labelledby={`${uid}-tab-${i}`}
            hidden={i !== active}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                color: "var(--code-dim)",
                padding: "0.7rem 1.25rem 0",
              }}
            >
              {t.isCommand ? <span style={{ color: "#f0743f" }}>$ </span> : null}
              {t.title}
            </div>
            {t.panel}
          </div>
        ))}
      </div>
      {tabs.map((t, i) => (
        <p key={t.key} hidden={i !== active} className="mt-3 text-[12.5px] leading-relaxed text-muted">
          {t.caption}
        </p>
      ))}
    </div>
  );
}
