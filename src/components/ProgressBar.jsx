import { usePlayer } from "../context/PlayerContext";

export default function ProgressBar() {
  const { currentTime, duration, buffered, seek } = usePlayer();

  const pct = (value) => (duration ? Math.min(100, (value / duration) * 100) : 0);

  return (
    <input
      className="vl-progress"
      type="range"
      min="0"
      max={duration || 0}
      step="0.1"
      value={currentTime}
      onChange={(e) => seek(Number(e.target.value))}
      style={{
        "--progress": `${pct(currentTime)}%`,
        "--buffered": `${pct(buffered)}%`,
      }}
      aria-label="Seek"
    />
  );
}
