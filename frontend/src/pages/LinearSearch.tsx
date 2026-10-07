import { useState } from "react";
import type { Log, SearchRequest } from "../Interfaces";
import "../styles/visualiser.css";
import ControlPanel from "../components/ControlPanel";
import CompareWithButton from "../components/CompareWithButton";
import Logtracker from "../components/LogTracker";
import useLogPlayback from "../hooks/useLogPlayback";
import NumberDatasetControls from "../components/NumberDatasetControls";
import { randomizeNumbers } from "../utils/randomizeNumbers";

function LinearSearch() {
  const [logMsg, setLogMsg] = useState<string[]>([]);
  const [logExplanation, setLogExplanation] = useState<string[]>([]);
  const [initialNumbers] = useState(() => randomizeNumbers(12));
  const [list, setList] = useState<number[] | null>(initialNumbers);
  const [currentList, setCurrentList] = useState<number[]>(initialNumbers);
  const [highlight, setHighlight] = useState<number[]>();
  const [targetNum, setTargetNum] = useState<number>(0);
  const [alertHighlight, setAlertHighlight] = useState<number[]>();
  const [speed, setSpeed] = useState(1000);
  const [isDisabled, setIsDisabled] = useState(false);

  const playback = useLogPlayback(speed);

  function updateDisabledState(numbers: number[] | null, target: number) {
    setIsDisabled(
      !numbers?.length ||
      numbers.length > 12 ||
      numbers.some((value) => value < 0 || value > 99) ||
      !Number.isInteger(target) ||
      target < 0 ||
      target > 99
    );
  }

  function handleTargetChange(target: number) {
    setTargetNum(target);
    updateDisabledState(list, target);
  }

  function handleNumbersChange(numbers: number[] | null) {
    updateDisabledState(numbers, targetNum);
    playback.clearPlayback();
    setList(numbers);
    setCurrentList(numbers ?? []);
    setHighlight([]);
    setAlertHighlight([]);
    setLogMsg([]);
    setLogExplanation([]);
  }

  const searchRequest: SearchRequest = { list: list ?? [], target: targetNum };

  const handleSearch = async () => {
    if (isDisabled || !list?.length || list.length > 12 || list.some((value) => value < 0 || value > 99)) return;
    if (!Number.isInteger(targetNum) || targetNum < 0 || targetNum > 99) return;

    const response = await fetch("/api/search/linear", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(searchRequest),
    });

    if (response.ok) {
      const data: Log[] = await response.json();
      startVisualiser(data);
    } else {
      console.error("Failed to fetch logs", response);
    }
  };

  function startVisualiser(data: Log[]) {
    playback.startPlayback(
      data,
      () => {
        setCurrentList(list ?? []);
        setHighlight([]);
        setLogMsg([]);
        setLogExplanation([]);
        setAlertHighlight([]);
      },
      (log) => {
        setCurrentList(log.list);
        setHighlight(log.extras?.highlight || []);
        setAlertHighlight(log.extras?.alertHighlight || []);
        setLogMsg((prev) => [...prev, log.actionMsg]);
        setLogExplanation((prev) => [...prev, log.explanation]);
      }
    );
  }

  return (
    <div className="container">
      <div className="visualiser-container">
        <h1>Linear Search</h1>
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
        <Logtracker logMsg={logMsg} logExplanation={logExplanation} />
        <div className="controls-container">
          <ControlPanel
            algorithmType="search"
            handleSearch={handleSearch}
            targetNum={targetNum}
            setTargetNum={handleTargetChange}
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
          <div className="compare-controls-row">
            <NumberDatasetControls numbers={list} onNumbersChange={handleNumbersChange} maxNumberCount={12} />
            <CompareWithButton to="/compare-algorithms?mode=search&left=linear-search" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LinearSearch;
