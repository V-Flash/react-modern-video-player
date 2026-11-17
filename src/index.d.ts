import * as React from "react";

export interface VideoPlayerProps {
  /** Video URL */
  src: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  /** default "metadata" */
  preload?: "none" | "metadata" | "auto";
  /** Show the default control bar. default true */
  controls?: boolean;
  /**
   * Play/pause circle on the video.
   * "center" = fixed in the middle, "cursor" = follows the mouse, false = none.
   * default "center"
   */
  overlay?: "center" | "cursor" | false;
  /** Move the cursor circle away from the pointer, in px. e.g. { x: 70, y: 70 } */
  cursorOffset?: { x?: number; y?: number };
  /** Hide controls and the cursor circle after the mouse is still for this many ms. 0 = never. default 2500 */
  idleTimeout?: number;
  /** Start the video at this many seconds, e.g. 0.5 or 1. default 0 */
  startTime?: number;
  /** Space/K, arrows, M, F shortcuts. default true */
  keyboard?: boolean;
  /** default [0.5, 1, 1.25, 1.5, 2] */
  playbackRates?: number[];
  /** Any CSS color. default "#8b5cf6" */
  accentColor?: string;
  theme?: "dark" | "light";
  className?: string;
  /** Extra props for the underlying <video> element */
  videoProps?: React.VideoHTMLAttributes<HTMLVideoElement>;
  onPlay?: React.ReactEventHandler<HTMLVideoElement>;
  onPause?: React.ReactEventHandler<HTMLVideoElement>;
  onEnded?: React.ReactEventHandler<HTMLVideoElement>;
  /** Replaces the default controls */
  children?: React.ReactNode;
}

export interface PlayerState {
  videoRef: React.RefObject<HTMLVideoElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  isPlaying: boolean;
  isLoading: boolean;
  isFullscreen: boolean;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  buffered: number;
  volume: number;
  playbackRate: number;
  playbackRates: number[];
  play(): Promise<void>;
  pause(): void;
  togglePlay(): void;
  seek(time: number): void;
  skip(seconds: number): void;
  changeVolume(value: number): void;
  toggleMute(): void;
  setPlaybackRate(rate: number): void;
  cycleRate(): void;
  toggleFullscreen(): Promise<void>;
}

export function VideoPlayer(props: VideoPlayerProps): JSX.Element;
export function PlayerControls(props: { children?: React.ReactNode }): JSX.Element;
export function CenterButton(props: { className?: string }): JSX.Element;
export function CursorButton(): JSX.Element;
export function PlayButton(): JSX.Element;
export function ProgressBar(): JSX.Element;
export function TimeDisplay(): JSX.Element;
export function VolumeControl(): JSX.Element;
export function SpeedButton(): JSX.Element;
export function FullscreenButton(): JSX.Element;

/** Read player state/actions inside <VideoPlayer> to build your own controls */
export function usePlayer(): PlayerState;

