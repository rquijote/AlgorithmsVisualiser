import "../styles/controlPanel.css";

interface PanelTypes {
  handleSort?: () => void;
  handleTraverse?: () => void;
  handleSearch?: () => void;
  algorithmType: "sort" | "search" | "pathfind";
  isActionDisabled?: boolean;
  targetNum?: number;
  setTargetNum?: (num: number) => void;
  speed?: number;
  setSpeed?: React.Dispatch<React.SetStateAction<number>>;
  isPlaying?: boolean;
  hasPlayback?: boolean;
  frameIndex?: number;
  totalFrames?: number;
  canStep?: boolean;
  canStepBackward?: boolean;
  onTogglePlayback?: () => void;
  onStepForward?: () => void;
  onStepBackward?: () => void;
}

function ControlPanel({
  handleSort,
  handleTraverse,
  handleSearch,
  algorithmType,
  isActionDisabled,
  targetNum,
  setTargetNum,
  speed,
  setSpeed,
  isPlaying,
  hasPlayback,
  frameIndex,
  totalFrames,
  canStep,
  canStepBackward,
  onTogglePlayback,
  onStepForward,
  onStepBackward,
}: PanelTypes) {
  function renderPlaybackBtns() {
    return (
      <>
        <button
          className="controlpanel-btn-secondary"
          onClick={onStepBackward}
          disabled={!hasPlayback || !canStepBackward}
        >
          Back
        </button>
        <button
          className="controlpanel-btn-secondary"
          onClick={onTogglePlayback}
          disabled={!hasPlayback || (!isPlaying && !canStep)}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button
          className="controlpanel-btn-secondary"
          onClick={onStepForward}
          disabled={!hasPlayback || !canStep}
        >
          Step
        </button>
      </>
    );
  }

  function renderSpeedBtns() {
    return (
      <div className="speed-controls">
        <span className="control-label">Speed</span>
        <button
          className="controlpanel-btn-secondary"
          onClick={() =>
            setSpeed &&
            setSpeed((prev: number) => (prev ? Math.min(prev + 250, 10000) : 250))
          }
        >
          Slower
        </button>
        <span className="speed-value">{speed} ms</span>
        <button
          className="controlpanel-btn-secondary"
          onClick={() =>
            setSpeed &&
            setSpeed((prev: number) => Math.max(prev - 250, 250))
          }
        >
          Faster
        </button>
      </div>
    );
  }

  function renderPanel() {
    switch (algorithmType) {
      case "sort":
        return (
          <div className="controlpanel-div">
            <button className="controlpanel-btn-primary" onClick={handleSort} disabled={isActionDisabled}>
              Sort
            </button>
            <div className="playback-controls">
              {renderPlaybackBtns()}
              <span className="frame-count">
                Frame {frameIndex ?? 0} / {totalFrames ?? 0}
              </span>
            </div>
            {renderSpeedBtns()}
          </div>
        );
      case "search":
        return (
          <div className="controlpanel-div">
            <button className="controlpanel-btn-primary" onClick={handleSearch} disabled={isActionDisabled}>
              Search
            </button>
            <div className="playback-controls">
              {renderPlaybackBtns()}
              <span className="frame-count">
                Frame {frameIndex ?? 0} / {totalFrames ?? 0}
              </span>
            </div>
            <input
              type="number"
              className="controlpanel-input"
              value={targetNum}
              onChange={(e) =>
                setTargetNum && setTargetNum(Number(e.target.value))
              }
              min={1}
            />
            {renderSpeedBtns()}
          </div>
        );
      case "pathfind":
        return (
          <div className="controlpanel-div">
            <button
              className="controlpanel-btn-primary"
              onClick={handleTraverse}
            >
              Traverse
            </button>
            <div className="playback-controls">
              {renderPlaybackBtns()}
              <span className="frame-count">
                Frame {frameIndex ?? 0} / {totalFrames ?? 0}
              </span>
            </div>
            <button
              className="controlpanel-btn-secondary"
              onClick={handleSearch}
            >
              Search
            </button>
            <input
              type="number"
              className="controlpanel-input"
              value={targetNum}
              onChange={(e) =>
                setTargetNum && setTargetNum(Number(e.target.value))
              }
              min={1}
            />
            {renderSpeedBtns()}
          </div>
        );
      default:
        return null;
    }
  }

  return <>{renderPanel()}</>;
}

export default ControlPanel;
