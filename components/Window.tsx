// A small OS-style window frame — the site's signature container.
// The three "traffic light" dots are pink shades only.
export default function Window({
  title,
  right,
  children,
  className = ""
}: {
  title: string;
  right?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-line bg-panel shadow-[0_18px_40px_-14px_rgba(255,91,158,0.4)] ${className}`}
    >
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-line bg-white px-3 py-2">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-bubble" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF8FBE]" />
          <span className="h-2.5 w-2.5 rounded-full bg-pink" />
        </div>
        <span className="truncate text-center font-mono text-[0.68rem] text-mute">{title}</span>
        <span className="min-w-[2.2rem] text-right font-mono text-[0.62rem] text-mute/70">{right}</span>
      </div>
      {children}
    </div>
  );
}
