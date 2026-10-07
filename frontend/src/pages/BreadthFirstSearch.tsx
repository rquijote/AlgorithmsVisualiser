import { useState } from "react";
import type { Log, PathfindingRequest } from "../Interfaces";
import "../styles/visualiser.css";
import ControlPanel from "../components/ControlPanel";
import GraphCreator from "../components/GraphCreator";
import GraphPreview from "../components/GraphPreview";
import Logtracker from "../components/LogTracker";
import useLogPlayback from "../hooks/useLogPlayback";
import type { GraphCreatorResult } from "../utils/graphCreator";

function BreadthFirstGraph() {
  const [logMsg, setLogMsg] = useState<string[]>([]);
  const [logExplanation, setLogExplanation] = useState<string[]>([]);
  const [highlight, setHighlight] = useState<number[]>();
  const [alertHighlight, setAlertHighlight] = useState<number[]>();
  const [bgHighlight, setBgHighlight] = useState<number[]>();
  const [searchNode, setSearchNode] = useState<number>(0);
  const [speed, setSpeed] = useState(1000);   
  const [graphState, setGraphState] = useState<GraphCreatorResult>({
    graph: {},
    root: null,
    positions: {},
    levelCount: 0,
    error: "",
    isValid: false,
  });
  const playback = useLogPlayback(speed);

  const pathfindingRequest: PathfindingRequest = {
    graph: graphState.graph,
    startNode: graphState.root ?? 1,
    targetNode: searchNode,
  };

  const handleSearch = async () => {
    const response = await fetch("/api/pathfinding/bfs-search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pathfindingRequest),
    });

    if (response.ok) {
      const data: Log[] = await response.json();
      startVisualiser(data);
    } else {
      console.error("Failed to fetch logs");
    }
  };

  const handleTraverse = async () => {
    const response = await fetch("/api/pathfinding/bfs-traverse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pathfindingRequest),
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
        setHighlight([]);
        setAlertHighlight([]);
        setBgHighlight([]);
        setLogMsg([]);
        setLogExplanation([]);
      },
      (log) => {
        setHighlight(log.extras?.highlight || []);
        setAlertHighlight(log.extras?.alertHighlight || []);
        setBgHighlight(log.extras?.bgHighlight || []);
        setLogMsg((prev) => [...prev, log.actionMsg]);
        setLogExplanation((prev) => [...prev, log.explanation]);
      }
    );
  }

  return (
    <div className="container">
      <div className="visualiser-container">
        <h1>Breadth First Search</h1>
        <GraphPreview
          graphState={graphState}
          highlight={highlight}
          alertHighlight={alertHighlight}
          bgHighlight={bgHighlight}
        />
        <Logtracker logMsg={logMsg} logExplanation={logExplanation} />
        <div className="controls-container">
          <ControlPanel
            algorithmType="pathfind"
            targetNum={searchNode}
            setTargetNum={setSearchNode}
            handleSearch={handleSearch}
            handleTraverse={handleTraverse}
            isActionDisabled={!graphState.isValid}
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
        <GraphCreator onChange={setGraphState} title="Graph Creator" />
      </div>
    </div>
  );
}

export default BreadthFirstGraph;