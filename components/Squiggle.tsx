export default function Squiggle({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 20"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 14C10 4 16 4 22 11C28 18 34 18 40 10C45 3 50 4 54 9C57 12.5 59 13 62 10"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
