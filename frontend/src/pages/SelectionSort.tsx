import { useState } from "react";
import type { Log } from "../Interfaces";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import "../styles/visualiser.css";
import ControlPanel from "../components/ControlPanel";
import Logtracker from "../components/LogTracker";
import useLogPlayback from "../hooks/useLogPlayback";

function SelectionSort() {
  const initialList = [8, 5, 8, 9, 2, 4, 11, 6];
  const [logMsg, setLogMsg] = useState<string[]>([]);
  const [currentList, setCurrentList] = useState<number[]>(initialList);
  const [highlight, setHighlight] = useState<number[]>();
  const [alertHighlight, setAlertHighlight] = useState<number[]>();
  const [speed, setSpeed] = useState(1000); // speed state

  const playback = useLogPlayback(speed);

  const handleSort = async () => {
    const response = await fetch("/api/sort/selection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(initialList),
    });

    if (response.ok) {
      const data: Log[] = await response.json();
      startVisualiser(data);
    } else {
      console.error("Failed to fetch logs");
    }
  };

  function startVisualiser(data: Log[]) {
    playback.startPlayback(
      data,
      () => {
        setCurrentList(initialList);
        setHighlight([]);
        setAlertHighlight([]);
        setLogMsg([]);
      },
      (log) => {
        setCurrentList(log.list);
        setHighlight(log.extras?.highlight || []);
        setAlertHighlight(log.extras?.alertHighlight || []);
        setLogMsg((prev) => [...prev, log.msg]);
      }
    );
  }

  return (
    <div className="container">
      <div className="visualiser-container">
        <h1>Selection Sort</h1>
        <TransformWrapper>
          <TransformComponent>
            <div className="sorting-wrapper">
              <div className="sorting-div">
                {currentList.map((number, idx) => (
                  <div
                    key={idx}
                    className={`sorting-numbox ${
                      alertHighlight?.includes(idx)
                        ? "alert-highlight"
                        : highlight?.includes(idx)
                        ? "highlight"
                        : ""
                    }`}
                  >
                    {number}
                  </div>
                ))}
              </div>
            </div>
          </TransformComponent>
        </TransformWrapper>
        <Logtracker logMsg={logMsg} />

        <ControlPanel
          handleSort={handleSort}
          algorithmType="sort"
          speed={speed}
          setSpeed={setSpeed}
          isPlaying={playback.isPlaying}
          hasPlayback={playback.hasPlayback}
          frameIndex={playback.frameIndex}
          totalFrames={playback.totalFrames}
          canStep={playback.canStep}
          canStepBackward={playback.canStepBackward}
          onTogglePlayback={playback.togglePlayback}
          onStepForward={playback.stepForward}
          onStepBackward={playback.stepBackward}
        />
      </div>
    </div>
  );
}

export default SelectionSort;
