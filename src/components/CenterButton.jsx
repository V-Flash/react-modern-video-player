import { usePlayer } from "../context/PlayerContext";
import { PlayIcon, PauseIcon } from "./icons";

// Big circle in the middle of the video. Shows on hover (and whenever paused).
export default function CenterButton({ className = "" }) {
  const { isPlaying, togglePlay } = usePlayer();
  const label = isPlaying ? "Pause" : "Play";

  return (
    <button
      className={`vl-center ${className}`.trim()}
      type="button"
      onClick={togglePlay}
      aria-label={label}
    >
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
      <span className="vl-center-label">{label}</span>
    </button>
  );
}
