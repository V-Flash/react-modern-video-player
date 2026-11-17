import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_RATES = [0.5, 1, 1.25, 1.5, 2];

function getBufferedEnd(video) {
  const { buffered, currentTime } = video;
  for (let i = 0; i < buffered.length; i++) {
    if (currentTime >= buffered.start(i) && currentTime <= buffered.end(i)) {
      return buffered.end(i);
    }
  }
  return buffered.length ? buffered.end(buffered.length - 1) : 0;
}

export function useVideo({ playbackRates = DEFAULT_RATES } = {}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const lastVolume = useRef(1);

  const [state, setState] = useState({
    isPlaying: false,
    isLoading: false,
    isFullscreen: false,
    currentTime: 0,
    duration: 0,
    buffered: 0,
    volume: 1,
    isMuted: false,
    playbackRate: 1,
  });

  const patch = useCallback(
    (next) => setState((prev) => ({ ...prev, ...next })),
    []
  );

  /* ---------- actions ---------- */

  const play = useCallback(async () => {
    try {
      await videoRef.current?.play();
    } catch (error) {
      // play() is interrupted by a quick pause(); that's not a real error.
      if (error?.name !== "AbortError") console.warn("[react-modern-video-player]", error);
    }
  }, []);

  const pause = useCallback(() => videoRef.current?.pause(), []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused || video.ended) play();
    else pause();
  }, [play, pause]);

  const seek = useCallback((time) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;
    video.currentTime = Math.max(0, Math.min(time, video.duration));
  }, []);

  const skip = useCallback(
    (seconds) => {
      const video = videoRef.current;
      if (video) seek(video.currentTime + seconds);
    },
    [seek]
  );

  const changeVolume = useCallback((value) => {
    const video = videoRef.current;
    if (!video) return;
    const next = Math.max(0, Math.min(1, value));
    if (next > 0) lastVolume.current = next;
    video.volume = next;
    video.muted = next === 0;
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.muted || video.volume === 0) {
      video.muted = false;
      if (video.volume === 0) video.volume = lastVolume.current || 0.5;
    } else {
      video.muted = true;
    }
  }, []);

  const setPlaybackRate = useCallback((rate) => {
    if (videoRef.current) videoRef.current.playbackRate = rate;
  }, []);

  const cycleRate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const index = playbackRates.indexOf(video.playbackRate);
    video.playbackRate = playbackRates[(index + 1) % playbackRates.length];
  }, [playbackRates]);

  const toggleFullscreen = useCallback(async () => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (container.requestFullscreen) {
        await container.requestFullscreen();
      } else if (video?.webkitEnterFullscreen) {
        video.webkitEnterFullscreen(); // iPhone Safari
      }
    } catch (error) {
      console.warn("[react-modern-video-player] fullscreen failed:", error);
    }
  }, []);

  useEffect(() => {
    const onChange = () =>
      patch({ isFullscreen: document.fullscreenElement === containerRef.current });
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, [patch]);

  /* ---------- <video> event handlers (spread onto the element) ---------- */

  const videoProps = useMemo(
    () => ({
      onLoadedMetadata: (e) => {
        const v = e.currentTarget;
        patch({ duration: v.duration, volume: v.volume, isMuted: v.muted || v.volume === 0 });
      },
      onDurationChange: (e) => patch({ duration: e.currentTarget.duration }),
      onTimeUpdate: (e) => {
        const v = e.currentTarget;
        patch({ currentTime: v.currentTime, buffered: getBufferedEnd(v) });
      },
      onProgress: (e) => patch({ buffered: getBufferedEnd(e.currentTarget) }),
      onPlay: () => patch({ isPlaying: true }),
      onPlaying: () => patch({ isPlaying: true, isLoading: false }),
      onPause: () => patch({ isPlaying: false, isLoading: false }),
      onEnded: () => patch({ isPlaying: false }),
      onWaiting: () => patch({ isLoading: true }),
      onCanPlay: () => patch({ isLoading: false }),
      onVolumeChange: (e) => {
        const v = e.currentTarget;
        patch({ volume: v.volume, isMuted: v.muted || v.volume === 0 });
      },
      onRateChange: (e) => patch({ playbackRate: e.currentTarget.playbackRate }),
    }),
    [patch]
  );

  return useMemo(
    () => ({
      videoRef,
      containerRef,
      videoProps,
      playbackRates,
      ...state,
      play,
      pause,
      togglePlay,
      seek,
      skip,
      changeVolume,
      toggleMute,
      setPlaybackRate,
      cycleRate,
      toggleFullscreen,
    }),
    [
      state, videoProps, playbackRates, play, pause, togglePlay, seek, skip,
      changeVolume, toggleMute, setPlaybackRate, cycleRate, toggleFullscreen,
    ]
  );
}
