import type { CSSProperties, ReactNode } from "react";

/* Shared presentational primitives. Server components, no client JS. */

// External link that opens a new tab, with a screen-reader cue that the context
// will change (WCAG 3.2.5) and the required rel for target=_blank safety.
export function ExtLink({
  href,
  children,
  className,
  style,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} style={style}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

// One lead-paragraph size, so intros read consistently across pages.
export function Lead({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`max-w-[64ch] text-[18px] leading-relaxed text-muted ${className}`}>{children}</p>
  );
}

export function Section({
  id,
  children,
  tint = false,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  tint?: boolean;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={className}
      style={{
        borderTop: "1px solid var(--color-border)",
        background: tint ? "var(--color-surface)" : "var(--color-limestone)",
      }}
    >
      <div className="mx-auto max-w-[1160px] px-6 py-16 md:px-8 md:py-24">{children}</div>
    </section>
  );
}

// Section eyebrow. A number is shown only when the section is a real step in an
// ordered sequence (the getting-started flow); the number then carries information.
// Thematic sections get a short sienna rule instead, a marker that anchors the
// section without implying an order that is not there.
export function Eyebrow({ n, children }: { n?: string; children: ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      {n ? (
        <span className="label" style={{ color: "var(--color-sienna)" }}>{n}</span>
      ) : (
        <span aria-hidden="true" className="eyebrow-rule" />
      )}
      <span className="label">{children}</span>
    </div>
  );
}

export function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-serif text-[clamp(30px,3.6vw,48px)] font-medium leading-[1.08] text-ink">
      {children}
    </h2>
  );
}

// A framed terminal / code panel. `caption` is the provenance line shown below.
export function Frame({
  barLabel,
  children,
  caption,
}: {
  barLabel: string;
  children: ReactNode;
  caption?: ReactNode;
}) {
  return (
    // min-w-0 lets this cell shrink below its content's intrinsic width inside a grid
    // or flex track, so the code panel's overflow-x:auto engages instead of the long
    // unbroken lines stretching the whole page.
    <div className="min-w-0">
      <div className="frame" dir="ltr">
        <div className="frame-bar">
          <span className="frame-dot" />
          <span className="frame-dot" />
          <span className="frame-dot" />
          <span
            className="ml-1.5"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              color: "var(--color-muted)",
            }}
          >
            {barLabel}
          </span>
        </div>
        {children}
      </div>
      {caption ? (
        <p className="mt-3 text-[13px] leading-relaxed text-muted">{caption}</p>
      ) : null}
    </div>
  );
}
