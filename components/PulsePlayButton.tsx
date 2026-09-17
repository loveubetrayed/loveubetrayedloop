"use client";

export default function PulsePlayButton({
  playing,
  onClick,
  size = 52,
  disabled = false
}: {
  playing: boolean;
  onClick: (e: React.MouseEvent) => void;
  size?: number;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={playing ? "Pause preview" : "Play preview"}
      className="relative flex shrink-0 items-center justify-center rounded-full disabled:opacity-40"
      style={{ width: size, height: size }}
    >
      {playing && (
        <>
          <span className="pulse-ring" style={{ animationDelay: "0s" }} />
          <span className="pulse-ring" style={{ animationDelay: "0.6s" }} />
        </>
      )}
      <span className="absolute inset-0 rounded-full bg-gradient-to-br from-pink to-[#FF8FBE] shadow-sm" />
      <svg
        width={size * 0.32}
        height={size * 0.32}
        viewBox="0 0 24 24"
        fill="white"
        className="relative"
        style={!playing ? { marginLeft: 2 } : undefined}
      >
        {playing ? (
          <>
            <rect x="6" y="5" width="4" height="14" />
            <rect x="14" y="5" width="4" height="14" />
          </>
        ) : (
          <path d="M8 5v14l11-7z" />
        )}
      </svg>
    </button>
  );
}
