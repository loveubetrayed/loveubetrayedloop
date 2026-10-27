// Zine-style label: hard pink offset shadow, slightly crooked.
export default function Sticker({
  children,
  rotate = -3,
  className = ""
}: {
  children: React.ReactNode;
  rotate?: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-block border border-ink bg-white px-2.5 py-1 font-mono text-[0.68rem] lowercase tracking-wide text-ink shadow-[3px_3px_0_#FF5B9E] ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </span>
  );
}
