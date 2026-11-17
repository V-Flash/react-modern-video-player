import { useCallback, useEffect, useRef, useState } from "react";

import { PlayerContext } from "../context/PlayerContext";
import { useVideo } from "../hooks/useVideo";

import PlayerControls from "./PlayerControls";
import CenterButton from "./CenterButton";
import CursorButton from "./CursorButton";

// call our handler first, then the user's
const chain = (ours, theirs) => (e) => {
  ours?.(e);
  theirs?.(e);
};

export default function VideoPlayer({
  src,
  poster,
  autoPlay = false,
  muted = false,
  loop = false,
  preload = "metadata",
  controls = true,
  overlay = "center",
  cursorOffset,
  idleTimeout = 2500,
  startTime = 0,
  keyboard = true,
  playbackRates,
  accentColor,
  theme = "dark",
  className = "",
  videoProps,
  onPlay,
  onPause,
  onEnded,
  children,
}) {
  const player = useVideo({ playbackRates });
  const { videoRef, containerRef, isPlaying, isLoading, isFullscreen } = player;

  /* hide controls + cursor while playing and the mouse is idle */
  const [active, setActive] = useState(true);
  const timer = useRef(null);

  const wake = useCallback(() => {
    setActive(true);
    clearTimeout(timer.current);
    if (idleTimeout > 0) {
      timer.current = setTimeout(() => setActive(false), idleTimeout);
    }
  }, [idleTimeout]);

  useEffect(() => () => clearTimeout(timer.current), []);

  /* start the video at `startTime` seconds (e.g. 0.5 or 1) */
  const startApplied = useRef(false);
  useEffect(() => {
    startApplied.current = false;
  }, [src, startTime]);

  /* keyboard shortcuts */
  const onKeyDown = (event) => {
    wake();
    if (!keyboard || event.altKey || event.ctrlKey || event.metaKey) return;

    const tag = event.target.tagName;
    if (tag === "INPUT") return; // let sliders use their own arrow keys
    if (tag === "BUTTON" && (event.key === " " || event.key === "Enter")) return;

    const keys = {
      " ": player.togglePlay,
      k: player.togglePlay,
      ArrowLeft: () => player.skip(-5),
      ArrowRight: () => player.skip(5),
      j: () => player.skip(-10),
      l: () => player.skip(10),
      ArrowUp: () => player.changeVolume(player.volume + 0.1),
      ArrowDown: () => player.changeVolume(player.volume - 0.1),
      m: player.toggleMute,
      f: player.toggleFullscreen,
    };

    const action = keys[event.key];
    if (action) {
      event.preventDefault();
      action();
    }
  };

  // our handlers + the user's `videoProps` handlers + onPlay/onPause/onEnded props
  const events = { ...videoProps };
  for (const name of Object.keys(player.videoProps)) {
    events[name] = chain(player.videoProps[name], videoProps?.[name]);
  }
  events.onLoadedMetadata = chain(events.onLoadedMetadata, (e) => {
    const video = e.currentTarget;
    if (startTime > 0 && !startApplied.current) {
      startApplied.current = true;
      video.currentTime = Math.min(startTime, video.duration || startTime);
    }
  });
  events.onPlay = chain(events.onPlay, onPlay);
  events.onPause = chain(events.onPause, onPause);
  events.onEnded = chain(events.onEnded, onEnded);

  const classes = [
    "vl-player",
    `vl-${theme}`,
    !isPlaying && "vl-paused",
    isPlaying && !active && "vl-idle",
    isLoading && "vl-loading",
    overlay === "cursor" && "vl-overlay-cursor",
    isFullscreen && "vl-fullscreen",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <PlayerContext.Provider value={player}>
      <div
        ref={containerRef}
        className={classes}
        style={accentColor ? { "--vl-accent": accentColor } : undefined}
        tabIndex={keyboard ? 0 : undefined}
        onKeyDown={onKeyDown}
        onMouseMove={wake}
        onMouseLeave={() => setActive(false)}
        onTouchStart={wake}
      >
        <video
          {...events}
          ref={videoRef}
          className="vl-video"
          src={src}
          poster={poster}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          preload={preload}
          playsInline
        />

        {/* click anywhere on the video = play/pause, double click = fullscreen */}
        <div
          className="vl-surface"
          onClick={player.togglePlay}
          onDoubleClick={player.toggleFullscreen}
        />

        <div className="vl-spinner" aria-hidden="true" />

        {overlay === "center" && <CenterButton />}

        {overlay === "cursor" && (
          <>
            <CursorButton idleTimeout={idleTimeout} offset={cursorOffset} />
            {/* touch screens have no mouse: show the center button there */}
            <CenterButton className="vl-center-fallback" />
          </>
        )}

        {children ?? (controls ? <PlayerControls /> : null)}
      </div>
    </PlayerContext.Provider>
  );
}
