import { usePlayer } from "../context/PlayerContext";

export default function SpeedButton() {
  const { playbackRate, cycleRate } = usePlayer();

  return (
    <button
      className="vl-button vl-speed"
      type="button"
      onClick={cycleRate}
      aria-label={`Playback speed ${playbackRate}x`}
      title="Playback speed"
    >
      {playbackRate}x
    </button>
  );
}
