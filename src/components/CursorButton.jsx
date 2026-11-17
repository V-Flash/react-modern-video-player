import { useEffect, useRef } from "react";
import { usePlayer } from "../context/PlayerContext";

// Circle that follows the mouse over the video and says PLAY / PAUSE.
// - hides itself when the mouse stops moving (idleTimeout ms)
// - never takes clicks (pointer-events: none) -> the click goes to the video
export default function CursorButton({ idleTimeout = 2500, offset }) {
  const { isPlaying, containerRef } = usePlayer();
  const ref = useRef(null);

  const offsetX = offset?.x ?? 0;
  const offsetY = offset?.y ?? 0;

  useEffect(() => {
    const container = containerRef.current;
    const el = ref.current;
    if (!container || !el) return;

    let x = 0, y = 0;   // target (mouse + offset)
    let cx = 0, cy = 0; // drawn position (smoothed)
    let raf = 0;
    let idleTimer = 0;

    const draw = () => {
      cx += (x - cx) * 0.22;
      cy += (y - cy) * 0.22;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
      const moving = Math.abs(x - cx) > 0.2 || Math.abs(y - cy) > 0.2;
      raf = moving ? requestAnimationFrame(draw) : 0;
    };

    const show = (value) => {
      el.dataset.show = value ? "true" : "false";
    };

    const onMove = (e) => {
      if (e.pointerType !== "mouse") return;

      const rect = container.getBoundingClientRect();
      x = e.clientX - rect.left + offsetX;
      y = e.clientY - rect.top + offsetY;

      // jump to the mouse on first appearance instead of flying in
      if (el.dataset.show !== "true") {
        cx = x;
        cy = y;
      }

      // hide over the control bar so it doesn't cover the buttons
      const overControls = e.target.closest?.(".vl-controls");
      show(!overControls);

      // hide again when the mouse stops moving
      clearTimeout(idleTimer);
      if (!overControls && idleTimeout > 0) {
        idleTimer = setTimeout(() => show(false), idleTimeout);
      }

      if (!raf) raf = requestAnimationFrame(draw);
    };

    const onLeave = () => {
      clearTimeout(idleTimer);
      show(false);
    };

    container.addEventListener("pointermove", onMove);
    container.addEventListener("pointerleave", onLeave);
    return () => {
      container.removeEventListener("pointermove", onMove);
      container.removeEventListener("pointerleave", onLeave);
      clearTimeout(idleTimer);
      cancelAnimationFrame(raf);
    };
  }, [containerRef, idleTimeout, offsetX, offsetY]);

  return (
    <div className="vl-cursor" ref={ref} data-show="false" aria-hidden="true">
      <div className="vl-cursor-circle">{isPlaying ? "Pause" : "Play"}</div>
    </div>
  );
}
