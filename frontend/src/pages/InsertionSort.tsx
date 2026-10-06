import { useState } from "react";
import type { Log } from "../Interfaces";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import "../styles/visualiser.css";
import ControlPanel from "../components/ControlPanel";
import Logtracker from "../components/LogTracker";
import useLogPlayback from "../hooks/useLogPlayback";
import NumberDatasetControls from "../components/NumberDatasetControls";

function InsertionSort() {
  const [logMsg, setLogMsg] = useState<string[]>([]);
  const [list, setList] = useState<number[] | null>([1, 5, 8, 9, 2, 4, 11, 6]);
  const [currentList, setCurrentList] = useState<number[]>([1, 5, 8, 9, 2, 4, 11, 6]);
  const [highlight, setHighlight] = useState<number[]>();
  const [alertHighlight, setAlertHighlight] = useState<number[]>();
  const [speed, setSpeed] = useState(1000); // speed state
  const [isDisabled, setIsDisabled] = useState(false);

  const playback = useLogPlayback(speed);

  function handleNumbersChange(numbers: number[] | null) {
    setIsDisabled(!numbers?.length || numbers.length > 12 || numbers.some((value) => value < 0 || value > 99));
    playback.clearPlayback();
    setList(numbers);
    setCurrentList(numbers ?? []);
    setHighlight([]);
    setAlertHighlight([]);
    setLogMsg([]);
  }

  const handleSort = async () => {
    if (isDisabled || !list?.length || list.length > 12 || list.some((value) => value < 0 || value > 99)) return;

    const response = await fetch("/api/sort/insertion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(list),
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
        setCurrentList(list ?? []);
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
        <h1>Insertion Sort</h1>
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

        {/* Pass speed and setSpeed to ControlPanel */}
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
          isActionDisabled={isDisabled}
        />
        <NumberDatasetControls numbers={list} onNumbersChange={handleNumbersChange} maxNumberCount={12} />
      </div>
    </div>
  );
}

export default InsertionSort;
