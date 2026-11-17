import PlayButton from "./PlayButton";
import ProgressBar from "./ProgressBar";
import TimeDisplay from "./TimeDisplay";
import VolumeControl from "./VolumeControl";
import SpeedButton from "./SpeedButton";
import FullscreenButton from "./FullscreenButton";

// Without children -> default layout. With children -> your own layout.
export default function PlayerControls({ children }) {
  if (children) {
    return <div className="vl-controls vl-controls-custom">{children}</div>;
  }

  return (
    <div className="vl-controls">
      <div className="vl-timeline">
        <ProgressBar />
        <TimeDisplay />
      </div>

      <div className="vl-row">
        <div className="vl-row-group">
          <PlayButton />
          <VolumeControl />
        </div>

        <div className="vl-row-group">
          <SpeedButton />
          <FullscreenButton />
        </div>
      </div>
    </div>
  );
}
