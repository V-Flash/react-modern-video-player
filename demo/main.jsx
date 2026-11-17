import { createRoot } from "react-dom/client";
import {
  VideoPlayer,
  PlayerControls,
  PlayButton,
  ProgressBar,
  TimeDisplay,
  VolumeControl,
  FullscreenButton,
} from "../src/index.js";

const SRC =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

function App() {
  return (
    <main style={{ maxWidth: 900, margin: "50px auto", padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>React Custom Video Player</h1>

      <h3>Default player (dark)</h3>
      <VideoPlayer src={SRC} accentColor="#8b5cf6" />

      <h3>Cursor-following button</h3>
      <VideoPlayer src={SRC} overlay="cursor" accentColor="#8b5cf6" />

      <h3>Light theme</h3>
      <VideoPlayer src={SRC} theme="light" accentColor="#0ea5e9" />

      <h3>Custom controls</h3>
      <VideoPlayer src={SRC} accentColor="#06b6d4">
        <PlayerControls>
          <PlayButton />
          <ProgressBar />
          <TimeDisplay />
          <VolumeControl />
          <FullscreenButton />
        </PlayerControls>
      </VideoPlayer>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
