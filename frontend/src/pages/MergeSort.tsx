import { useState } from "react";
import type { Log, RecursiveCall } from "../Interfaces";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import "../styles/visualiser.css";
import ControlPanel from "../components/ControlPanel";
import Logtracker from "../components/LogTracker";
import useLogPlayback from "../hooks/useLogPlayback";
import RecursionCallTree from "../components/RecursionCallTree";
import NumberDatasetControls from "../components/NumberDatasetControls";

function MergeSort() {
  const [list, setList] = useState<number[] | null>([5, 2, 9, 2, 8, 1, 5, 14]);
  const [logMsg, setLogMsg] = useState<string[]>([]);
  const [currentList, setCurrentList] = useState<number[]>([5, 2, 9, 2, 8, 1, 5, 14]);
  const [calls, setCalls] = useState<RecursiveCall[]>([]);
  const [activeCallId, setActiveCallId] = useState<number | null>(null);
  const [highlight, setHighlight] = useState<number[]>();
  const [alertHighlight, setAlertHighlight] = useState<number[]>();
  const [speed, setSpeed] = useState(1000);
  const [isDisabled, setIsDisabled] = useState(false);

  const playback = useLogPlayback(speed);

  function handleNumbersChange(numbers: number[] | null) {
    setIsDisabled(!numbers?.length || numbers.length > 12 || numbers.some((value) => value < 0 || value > 99));
    playback.clearPlayback();
    setList(numbers);
    setCurrentList(numbers ?? []);
    setCalls([]);
    setActiveCallId(null);
    setHighlight([]);
    setAlertHighlight([]);
    setLogMsg([]);
  }

  const handleSort = async () => {
    if (isDisabled || !list?.length || list.length > 12 || list.some((value) => value < 0 || value > 99)) return;

    const response = await fetch("/api/sort/merge", {
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

  function applyLog(log: Log) {
    setCurrentList(log.list);
    setHighlight(log.extras?.highlight || []);
    setAlertHighlight(log.extras?.alertHighlight || []);
    setLogMsg((prev) => [...prev, log.msg]);

    const extras = log.extras;
    if (extras?.callId === undefined || extras.phase === undefined) return;

    const call: RecursiveCall = {
      callId: extras.callId,
      parentCallId:
        extras.parentCallId !== undefined && extras.parentCallId >= 0
          ? extras.parentCallId
          : null,
      depth: extras.depth ?? 0,
      segmentStart: extras.segmentStart ?? 0,
      segmentEnd: extras.segmentEnd ?? -1,
      segmentValues: extras.segmentValues ?? [],
      phase: extras.phase,
      message: log.msg,
    };

    setCalls((previousCalls) => {
      const existingIndex = previousCalls.findIndex(
        (existingCall) => existingCall.callId === call.callId
      );
      if (existingIndex === -1) return [...previousCalls, call];

      return previousCalls.map((existingCall, index) =>
        index === existingIndex ? call : existingCall
      );
    });
    setActiveCallId(extras.phase === "complete" ? null : call.callId);
  }

  function startVisualiser(data: Log[]) {
    playback.startPlayback(
      data,
      () => {
        setCurrentList(list ?? []);
        setCalls([]);
        setActiveCallId(null);
        setHighlight([]);
        setAlertHighlight([]);
        setLogMsg([]);
      },
      applyLog
    );
  }

  return (
    <div className="container">
      <div className="visualiser-container">
        <h1>Merge Sort</h1>
        <TransformWrapper>
          <TransformComponent>
            <div className="recursive-sort-layout">
              <section className="recursion-array-panel">
                <h2>Current Merge</h2>
                <div className="recursion-array-values">
                  {currentList.map((number, index) => (
                    <div
                      key={index}
                      className={`sorting-numbox ${
                        alertHighlight?.includes(index)
                          ? "alert-highlight"
                          : highlight?.includes(index)
                          ? "highlight"
                          : ""
                      }`}
                    >
                      {number}
                    </div>
                  ))}
                </div>
              </section>
              <RecursionCallTree calls={calls} activeCallId={activeCallId} />
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
          isActionDisabled={isDisabled}
        />
        <NumberDatasetControls numbers={list} onNumbersChange={handleNumbersChange} maxNumberCount={12} />
      </div>
    </div>
  );
}

export default MergeSort;
