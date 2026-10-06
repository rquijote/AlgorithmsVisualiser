import { useState, useRef, useEffect } from "react";
import type { Log } from "../Interfaces";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import "../styles/visualiser.css";
import ControlPanel from "../components/ControlPanel";
import Logtracker from "../components/LogTracker";
import useLogPlayback from "../hooks/useLogPlayback";

function MergeSort() {
  const list = [5, 2, 9, 2, 8, 1, 5, 14];
  const [logMsg, setLogMsg] = useState<string[]>([]);
  const [allLogs, setAllLogs] = useState<Log[]>([{ list, msg: "" }]);
  const [highlight, setHighlight] = useState<number[]>();
  const sortingRef = useRef<HTMLDivElement>(null);
  const [alertHighlight, setAlertHighlight] = useState<number[]>();
  const [speed, setSpeed] = useState(1000);

  const playback = useLogPlayback(speed);

  const handleSort = async () => {
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

  function processLog(newLog: Log) {
    setAllLogs((prev) => {
      const newDepth = newLog.extras?.depth ?? 0;
      const updatedLogs = prev.filter(
        (log) => (log.extras?.depth ?? 0) < newDepth
      );
      return [...updatedLogs, newLog];
    });
  }

  function startVisualiser(data: Log[]) {
    playback.startPlayback(
      data,
      () => {
        setAllLogs([{ list, msg: "" }]);
        setHighlight([]);
        setLogMsg([]);
        setAlertHighlight([]);
      },
      (log) => {
        processLog(log);
        setHighlight(log.extras?.highlight || []);
        setAlertHighlight(log.extras?.alertHighlight || []);
        setLogMsg((prev) => [...prev, log.msg]);
      }
    );
  }

  useEffect(() => {
    if (sortingRef.current) {
      sortingRef.current.scrollTop = sortingRef.current.scrollHeight;
    }
  }, [allLogs]);

  return (
    <div className="container">
      <div className="visualiser-container">
        <h1>Merge Sort</h1>
        <TransformWrapper>
          <TransformComponent>
            <div ref={sortingRef} className="sorting-wrapper-merge-sort">
              {allLogs.map((log, logIdx) => {
                return (
                  <div className="sorting-div-merge-sort" key={logIdx}>
                    {log.list.map((number, index) => {
                      const isBottomRow = logIdx === allLogs.length - 1;
                      const isHighlight =
                        highlight?.includes(index) && isBottomRow;
                      const isAlert =
                        alertHighlight?.includes(index) && isBottomRow;

                      return (
                        <div
                          key={index}
                          className={`sorting-numbox ${
                            isAlert
                              ? "alert-highlight"
                              : isHighlight
                              ? "highlight"
                              : ""
                          }`}
                        >
                          {number}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </TransformComponent>
        </TransformWrapper>
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
        <Logtracker logMsg={logMsg} />
      </div>
    </div>
  );
}

export default MergeSort;
