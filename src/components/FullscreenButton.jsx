import { usePlayer } from "../context/PlayerContext";
import { FullscreenIcon, ExitFullscreenIcon } from "./icons";

export default function FullscreenButton() {
  const { isFullscreen, toggleFullscreen } = usePlayer();

  return (
    <button
      className="vl-button"
      type="button"
      onClick={toggleFullscreen}
      aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
      title={isFullscreen ? "Exit fullscreen (f)" : "Fullscreen (f)"}
    >
      {isFullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
    </button>
  );
}
