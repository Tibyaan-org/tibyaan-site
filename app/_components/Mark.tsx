/*
  The bilingual ligature mark, verbatim from the brand identity file (section 05).
  One bar is the crossbar of the Latin T and the body of the Arabic taa; the stem
  drops for the Latin reading; two sienna dots sit above for the Arabic. Dots stay
  solid at small sizes so the dual-script reading never collapses.
*/
export function Mark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      fill="none"
      role="img"
      aria-label="Tibyaan"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="2" y="2" width="124" height="124" rx="10" fill="#211D17" />
      <rect x="34" y="52" width="60" height="8" rx="4" fill="#F4EEE3" />
      <rect x="60" y="56" width="8" height="40" rx="4" fill="#F4EEE3" />
      <circle cx="56" cy="40" r="5" fill="#A6492E" />
      <circle cx="72" cy="40" r="5" fill="#A6492E" />
    </svg>
  );
}
