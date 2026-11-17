import { usePlayer } from "../context/PlayerContext";

export function formatTime(time) {
  if (!Number.isFinite(time) || time < 0) return "0:00";
  const h = Math.floor(time / 3600);
  const m = Math.floor((time % 3600) / 60);
  const s = String(Math.floor(time % 60)).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
}

export default function TimeDisplay() {
  const { currentTime, duration } = usePlayer();

  return (
    <span className="vl-time">
      {formatTime(currentTime)} / {formatTime(duration)}
    </span>
  );
}
