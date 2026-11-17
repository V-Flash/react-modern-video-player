import { usePlayer } from "../context/PlayerContext";
import { VolumeIcon, MuteIcon } from "./icons";

export default function VolumeControl() {
  const { volume, isMuted, changeVolume, toggleMute } = usePlayer();

  return (
    <div className="vl-volume">
      <button
        className="vl-button"
        type="button"
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute" : "Mute"}
        title={isMuted ? "Unmute (m)" : "Mute (m)"}
      >
        {isMuted ? <MuteIcon /> : <VolumeIcon />}
      </button>

      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={isMuted ? 0 : volume}
        onChange={(e) => changeVolume(Number(e.target.value))}
        aria-label="Volume"
      />
    </div>
  );
}
