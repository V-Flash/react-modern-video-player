import { usePlayer } from "../context/PlayerContext";
import { PlayIcon, PauseIcon } from "./icons";

export default function PlayButton() {
  const { isPlaying, togglePlay } = usePlayer();

  return (
    <button
      className="vl-button"
      type="button"
      onClick={togglePlay}
      aria-label={isPlaying ? "Pause" : "Play"}
      title={isPlaying ? "Pause (k)" : "Play (k)"}
    >
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
    </button>
  );
}
