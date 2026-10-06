import { useState } from "react";
import type { Log, SearchRequest } from "../Interfaces";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import "../styles/visualiser.css";
import ControlPanel from "../components/ControlPanel";
import Logtracker from "../components/LogTracker";
import useLogPlayback from "../hooks/useLogPlayback";

function BinarySearch() {
  const list = [2, 5, 8, 11, 13, 15, 17, 20, 22, 23];
  const [logMsg, setLogMsg] = useState<string[]>([]);
  const [currentList, setCurrentList] = useState<number[]>(list);
  const [highlight, setHighlight] = useState<number[]>();
  const [alertHighlight, setAlertHighlight] = useState<number[]>();
  const [bgHighlight, setBgHighlight] = useState<number[]>();
  const [targetNum, setTargetNum] = useState<number>(0);
  const [speed, setSpeed] = useState(1000);
  const playback = useLogPlayback(speed);

  const searchRequest: SearchRequest = { list, target: targetNum };

  const handleSearch = async () => {
    const response = await fetch("/api/search/binary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(searchRequest),
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
        setCurrentList(list);
        setHighlight([]);
        setAlertHighlight([]);
        setBgHighlight([]);
        setLogMsg([]);
      },
      (log) => {
        setCurrentList(log.list);
        setHighlight(log.extras?.highlight || []);
        setAlertHighlight(log.extras?.alertHighlight || []);
        setBgHighlight(log.extras?.bgHighlight || []);
        setLogMsg((prev) => [...prev, log.msg]);
      }
    );
  }

  return (
    <div className="container">
      <div className="visualiser-container">
        <h1>Binary Search</h1>
        <TransformWrapper>
          <TransformComponent>
            <div className="sorting-wrapper">
              <div className="sorting-div">
                {currentList.map((number, idx) => {
                  const isHighlight = highlight?.includes(idx);
                  const isAlert = alertHighlight?.includes(idx);
                  const isBg = bgHighlight?.includes(idx);

                  return (
                    <div
                      key={idx}
                      className={`sorting-numbox ${
                        isAlert
                          ? "alert-highlight"
                          : isHighlight
                          ? "highlight"
                          : isBg
                          ? "bg-highlight"
                          : ""
                      }`}
                    >
                      {number}
                    </div>
                  );
                })}
              </div>
            </div>
          </TransformComponent>
        </TransformWrapper>
        <Logtracker logMsg={logMsg} />
        <ControlPanel
          algorithmType="search"
          handleSearch={handleSearch}
          setTargetNum={setTargetNum}
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

export default BinarySearch;
