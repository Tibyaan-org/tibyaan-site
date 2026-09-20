import type { ReactNode } from "react";

/*
  Presentation-only colouring for code and tool output. It wraps spans around
  substrings and never adds, drops, or alters a character: the concatenated text
  of the output always equals the input. That matters here more than on most sites,
  because much of what is shown is verbatim tool output (see _content/generated).
*/

export type Lang = "text" | "shell" | "json" | "xml" | "survey";

function tokens(line: string, re: RegExp, classify: (m: RegExpExecArray) => string | null): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  re.lastIndex = 0;
  while ((m = re.exec(line)) !== null) {
    if (m[0].length === 0) {
      re.lastIndex++;
      continue;
    }
    const cls = classify(m);
    if (!cls) continue;
    if (m.index > last) out.push(line.slice(last, m.index));
    out.push(
      <span key={`${m.index}`} className={cls}>
        {m[0]}
      </span>,
    );
    last = m.index + m[0].length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

function renderLine(line: string, lang: Lang): ReactNode {
  const t = line.trimStart();

  if (lang === "survey") {
    if (t.startsWith("+")) return <span className="tok-ok">{line}</span>;
    if (t.startsWith("-")) return <span className="tok-warn">{line}</span>;
    if (t.startsWith("...") || t.startsWith("~") || t.startsWith("*")) return <span className="tok-dim">{line}</span>;
    if (/^(Totals:|List-refused|Failed|Discovered|by-id|list)/.test(t)) return <span className="tok-head">{line}</span>;
    return line;
  }

  if (lang === "shell") {
    if (t.startsWith("#")) return <span className="tok-dim">{line}</span>;
    return line;
  }

  if (lang === "json") {
    if (t.startsWith("...")) return <span className="tok-dim">{line}</span>;
    return tokens(line, /"(?:[^"\\]|\\.)*"|\b(?:true|false|null)\b|-?\b\d+(?:\.\d+)?\b/g, (m) => {
      if (m[0].startsWith('"')) {
        // a string followed by a colon is a key
        return /^\s*:/.test(line.slice(m.index + m[0].length)) ? "tok-key" : "tok-str";
      }
      return "tok-num";
    });
  }

  if (lang === "xml") {
    return tokens(line, /<!--.*?-->|<\/?[A-Za-z][\w.:-]*|\/?>/g, (m) =>
      m[0].startsWith("<!--") ? "tok-dim" : "tok-tag",
    );
  }

  return line;
}

export function Highlight({ text, lang = "text" }: { text: string; lang?: Lang }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => (
        <span key={i}>
          {renderLine(line, lang)}
          {i < lines.length - 1 ? "\n" : ""}
        </span>
      ))}
    </>
  );
}
