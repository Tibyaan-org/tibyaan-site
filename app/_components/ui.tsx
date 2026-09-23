import type { CSSProperties, ReactNode } from "react";
import { CopyButton } from "./CopyButton";
import { Highlight, type Lang } from "./Highlight";

/* Shared presentational primitives. Server components unless noted. */

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

export function Arrow({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// One lead-paragraph size, so intros read consistently across pages.
export function Lead({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`max-w-[62ch] text-[17.5px] leading-relaxed text-muted ${className}`}>{children}</p>
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
        borderTop: "1px solid var(--line)",
        background: tint ? "var(--bg-soft)" : "var(--bg)",
      }}
    >
      <div className="container-x py-20 md:py-28">{children}</div>
    </section>
  );
}

// Section eyebrow. A number is shown only when the section is a real step in an
// ordered sequence; thematic sections get an accent tick instead, so structure is
// signalled without implying an order that is not there.
export function Eyebrow({ n, children }: { n?: string; children: ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      {n ? (
        <span className="label" style={{ color: "var(--accent)" }}>
          {n}
        </span>
      ) : (
        <span
          aria-hidden="true"
          style={{ width: 18, height: 2, borderRadius: 1, background: "var(--accent)", display: "inline-block" }}
        />
      )}
      <span className="label">{children}</span>
    </div>
  );
}

export function H2({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h2
      className={`max-w-[24ch] text-[clamp(30px,3.6vw,46px)] font-semibold leading-[1.08] text-fg ${className}`}
      style={{ letterSpacing: "-0.035em" }}
    >
      {children}
    </h2>
  );
}

// Header block for every inner marketing page.
export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header>
      <div className="container-x py-[clamp(56px,8vh,96px)]">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="display max-w-[22ch] text-[clamp(34px,4.6vw,56px)] text-fg">{title}</h1>
        {children ? <Lead className="mt-7">{children}</Lead> : null}
      </div>
    </header>
  );
}

// Inline code, for prose.
export function IC({ children, wrap = false }: { children: ReactNode; wrap?: boolean }) {
  return <code className={`inline-code${wrap ? " inline-code-wrap" : ""}`}>{children}</code>;
}

// A framed terminal / code panel. `caption` is the provenance line shown below.
// When `copy` is given the bar carries a copy button for exactly that text.
export function Frame({
  barLabel,
  children,
  caption,
  copy,
  flat = false,
}: {
  barLabel: string;
  children: ReactNode;
  caption?: ReactNode;
  copy?: string;
  flat?: boolean;
}) {
  return (
    // min-w-0 lets this cell shrink below its content's intrinsic width inside a grid
    // or flex track, so the code panel's overflow-x:auto engages instead of the long
    // unbroken lines stretching the whole page.
    <div className="min-w-0">
      <div className={`frame${flat ? " frame-flat" : ""}`} dir="ltr">
        <div className="frame-bar">
          <span className="frame-dot" />
          <span className="frame-dot" />
          <span className="frame-dot" />
          <span className="frame-title">{barLabel}</span>
          {copy ? <CopyButton text={copy} /> : null}
        </div>
        {children}
      </div>
      {caption ? <p className="mt-3 text-[13px] leading-relaxed text-muted">{caption}</p> : null}
    </div>
  );
}

// The standard code block: frame + light colouring + copy. The colouriser never
// changes a character of the text it is given.
export function CodeBlock({
  label,
  lang = "text",
  children,
  caption,
  copy = true,
  flat = true,
}: {
  label: string;
  lang?: Lang;
  children: string;
  caption?: ReactNode;
  copy?: boolean;
  flat?: boolean;
}) {
  return (
    <Frame barLabel={label} caption={caption} copy={copy ? children : undefined} flat={flat}>
      <pre className="code">
        <code>
          <Highlight text={children} lang={lang} />
        </code>
      </pre>
    </Frame>
  );
}
