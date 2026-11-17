# React Modern Video Player

Lightweight, customizable video player for React. **~5 KB gzipped, zero dependencies.**

- Big **Play / Pause circle**, two styles: fixed in the center, or **following the mouse cursor**
- Circle **hides when the mouse stops moving**, works with your own custom cursor (`cursorOffset`)
- `startTime`: start the video at any second (0.5, 1, ...)
- Click video = play/pause, double click = fullscreen
- Keyboard shortcuts, playback speed, buffered bar, loading spinner
- Auto-hide controls while playing
- Dark / light theme + any accent color
- Build your own controls with the included components or the `usePlayer()` hook
- TypeScript types included

## Install

```bash
npm install react-modern-video-player
```

Requires React 18 or newer.

## Quick start

```jsx
import { VideoPlayer } from "react-modern-video-player";
import "react-modern-video-player/style.css"; // don't forget this

export default function App() {
  return (
    <VideoPlayer
      src="https://example.com/video.mp4"
      poster="https://example.com/poster.jpg"
      accentColor="#8b5cf6"
    />
  );
}
```

> **Next.js (App Router):** use the player inside a file that starts with `"use client";`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `src` | `string` | – | Video URL (required) |
| `poster` | `string` | – | Image shown before playing (must be an **image** URL) |
| `autoPlay` | `boolean` | `false` | Browsers only allow autoplay when `muted` is also set |
| `muted` | `boolean` | `false` | Start muted |
| `loop` | `boolean` | `false` | Loop the video |
| `preload` | `"none" \| "metadata" \| "auto"` | `"metadata"` | Same as the `<video>` attribute |
| `controls` | `boolean` | `true` | Show the default control bar |
| `overlay` | `"center" \| "cursor" \| false` | `"center"` | Play/pause circle on the video (see below) |
| `keyboard` | `boolean` | `true` | Enable keyboard shortcuts |
| `cursorOffset` | `{ x?: number; y?: number }` | – | Shift the cursor circle away from the pointer (px) |
| `idleTimeout` | `number` | `2500` | Hide controls and the cursor circle after the mouse is still this many ms. `0` = never |
| `startTime` | `number` | `0` | Start the video at this second, e.g. `0.5` or `1` |
| `playbackRates` | `number[]` | `[0.5, 1, 1.25, 1.5, 2]` | Speeds the speed button cycles through |
| `accentColor` | `string` | `"#8b5cf6"` | Any CSS color |
| `theme` | `"dark" \| "light"` | `"dark"` | Control bar theme |
| `className` | `string` | – | Extra class on the player wrapper |
| `videoProps` | `object` | – | Extra props passed to the `<video>` element |
| `onPlay` `onPause` `onEnded` | `function` | – | Video events |
| `children` | `ReactNode` | – | Replaces the default controls |

## Play / Pause circle

```jsx
<VideoPlayer src="/video.mp4" overlay="center" />  {/* fixed in the middle (default) */}
<VideoPlayer src="/video.mp4" overlay="cursor" />  {/* follows the mouse, says PLAY / PAUSE */}
<VideoPlayer src="/video.mp4" overlay={false} />   {/* no circle */}
```

- `center`: shows on hover, and always while the video is paused.
- `cursor`: the circle follows the mouse and replaces the normal pointer over the video.
  - It **hides itself when the mouse stops moving** (see `idleTimeout`) and comes back when you move.
  - It hides over the control bar, so it never covers the buttons.
  - On touch screens (no mouse) the center button is used automatically.

Style the circle with CSS variables:

```css
.my-player {
  --vl-cursor-size: 120px;
  --vl-cursor-bg: #fff;
  --vl-cursor-color: #111;
}
```

### Hide delay (`idleTimeout`)

Controls and the cursor circle fade out after the mouse is still for a while. Default is 2.5 seconds.

```jsx
<VideoPlayer src="/video.mp4" overlay="cursor" idleTimeout={1500} /> {/* 1.5 s */}
<VideoPlayer src="/video.mp4" overlay="cursor" idleTimeout={0} />    {/* never hide */}
```

### Using your own custom mouse pointer

With `overlay="cursor"` the normal pointer is hidden over the video, even if your site sets a custom cursor with CSS (`cursor: url(...)`).

If your custom cursor is an **HTML element** that follows the mouse (for example a paw or a dot made with a `<div>`), it can show on top of the circle and cover the text. There are two fixes.

**1. Move the circle away from your pointer** with `cursorOffset` (in px):

```jsx
<VideoPlayer src="/video.mp4" overlay="cursor" cursorOffset={{ x: 70, y: 70 }} />
```

**2. Or hide your own cursor while the mouse is over the player** (use the class name of your cursor element):

```css
body:has(.vl-player:hover) .my-cursor {
  display: none;
}
```

### Start time (`startTime`)

Start the video at a given second, for example `0.5` or `1`:

```jsx
<VideoPlayer src="/video.mp4" startTime={1} />   {/* starts at 1 second */}
<VideoPlayer src="/video.mp4" startTime={0.5} /> {/* starts at 0.5 seconds */}
```

The video opens at that second, so that frame is the first thing people see. If you also pass a `poster`, the poster is shown until the video is played.

## Keyboard shortcuts

Click the player (or Tab to it) first so it has focus.

| Key | Action |
| --- | --- |
| `Space` / `K` | Play / pause |
| `←` / `→` | Back / forward 5 seconds |
| `J` / `L` | Back / forward 10 seconds |
| `↑` / `↓` | Volume up / down |
| `M` | Mute |
| `F` | Fullscreen |

## Custom controls

Put your own layout inside `<PlayerControls>`. Available parts:
`PlayButton`, `ProgressBar`, `TimeDisplay`, `VolumeControl`, `SpeedButton`, `FullscreenButton`.

```jsx
import {
  VideoPlayer, PlayerControls, PlayButton,
  ProgressBar, TimeDisplay, FullscreenButton,
} from "react-modern-video-player";

<VideoPlayer src="/video.mp4">
  <PlayerControls>
    <PlayButton />
    <ProgressBar />
    <TimeDisplay />
    <FullscreenButton />
  </PlayerControls>
</VideoPlayer>
```

## Fully custom: `usePlayer()`

Inside `<VideoPlayer>` you can read the state and call actions from your own components:

```jsx
import { VideoPlayer, usePlayer } from "react-modern-video-player";

function Skip10() {
  const { skip } = usePlayer();
  return <button onClick={() => skip(10)}>+10s</button>;
}

<VideoPlayer src="/video.mp4" controls={false}>
  <Skip10 />
</VideoPlayer>
```

**State:** `isPlaying` `isLoading` `isFullscreen` `isMuted` `currentTime` `duration` `buffered` `volume` `playbackRate` `videoRef`

**Actions:** `play()` `pause()` `togglePlay()` `seek(time)` `skip(seconds)` `changeVolume(0-1)` `toggleMute()` `setPlaybackRate(rate)` `cycleRate()` `toggleFullscreen()`

## Styling

Override CSS variables:

```css
.my-player {
  --vl-accent: #ef4444;      /* highlight color */
  --vl-radius: 8px;          /* corner radius */
  --vl-center-size: 90px;    /* center circle size */
}
```

```jsx
<VideoPlayer className="my-player" src="/video.mp4" />
```

All class names start with `vl-` (`.vl-player`, `.vl-controls`, `.vl-button`, `.vl-center`, ...), so you can restyle anything.

## Development

```bash
npm install
npm run dev     # demo at http://localhost:5173
npm run build   # creates /dist
```

## Changelog

**0.1.2**
- New: the cursor circle hides when the mouse stops moving (`idleTimeout`, default 2500 ms)
- New: `cursorOffset` to keep the circle away from a custom mouse pointer
- New: `startTime` to start the video at a given second (e.g. `0.5`, `1`)
- Fix: the normal mouse pointer is now always hidden in `overlay="cursor"` mode, even with a site-wide custom cursor
- Fix: README uses the new package name `react-modern-video-player`

**0.1.1**
- Docs and package name fixes

**0.1.0**
- First release

## License

MIT
