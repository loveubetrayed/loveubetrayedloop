"use client";

import { useRef, useState } from "react";
import PulsePlayButton from "./PulsePlayButton";

function formatTime(s: number) {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function AudioPlayer({ previewUrl, title }: { previewUrl?: string; title: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  function toggle() {
    if (!previewUrl) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(previewUrl);
      audioRef.current.addEventListener("loadedmetadata", () => setDuration(audioRef.current!.duration));
      audioRef.current.addEventListener("timeupdate", () => setCurrentTime(audioRef.current!.currentTime));
      audioRef.current.addEventListener("ended", () => setPlaying(false));
    }
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  }

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = ratio * duration;
  }

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-5 rounded-2xl border border-line bg-white p-5">
      <PulsePlayButton playing={playing} onClick={toggle} size={56} disabled={!previewUrl} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5">
            {playing && <span className="h-1.5 w-1.5 rounded-full bg-pink" />}
            <span className="font-medium tracking-wide text-ink">{playing ? "NOW PLAYING" : "PREVIEW"}</span>
            <span className="truncate text-mute">{title}</span>
          </span>
          {previewUrl && (
            <span className="shrink-0 text-mute">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          )}
        </div>

        <div onClick={seek} className="mt-3 h-1.5 cursor-pointer rounded-full bg-[#F3EFEA]">
          <div className="h-full rounded-full bg-pink transition-[width]" style={{ width: `${progress}%` }} />
        </div>

        {!previewUrl && <p className="mt-2 text-xs text-mute">Preview coming soon.</p>}
      </div>
    </div>
  );
}
