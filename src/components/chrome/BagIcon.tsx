/** Apple-style shopping bag outline (SF Symbols–inspired vector). */
export function BagIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="17"
      height="20"
      viewBox="0 0 17 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M4.25 7.25V5.5C4.25 3.153 6.153 1.25 8.5 1.25C10.847 1.25 12.75 3.153 12.75 5.5V7.25"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M2.35 7.25H14.65C15.34 7.25 15.88 7.84 15.78 8.52L14.58 17.02C14.45 17.92 13.68 18.58 12.76 18.58H4.24C3.32 18.58 2.55 17.92 2.42 17.02L1.22 8.52C1.12 7.84 1.66 7.25 2.35 7.25Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}
