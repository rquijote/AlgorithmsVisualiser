import { useState } from "react";
import type { Log, PathfindingRequest } from "../Interfaces";
import "../styles/visualiser.css";
import ControlPanel from "../components/ControlPanel";
import Logtracker from "../components/LogTracker";
import useLogPlayback from "../hooks/useLogPlayback";

function BreadthFirstGraph() {
  const [logMsg, setLogMsg] = useState<string[]>([]);
  const [logExplanation, setLogExplanation] = useState<string[]>([]);
  const [highlight, setHighlight] = useState<number[]>();
  const [alertHighlight, setAlertHighlight] = useState<number[]>();
  const [bgHighlight, setBgHighlight] = useState<number[]>();
  const [searchNode, setSearchNode] = useState<number>(1);
  const [speed, setSpeed] = useState(1000);   
  const playback = useLogPlayback(speed);

  const graph: Record<number, number[]> = {
    1: [2, 7],
    2: [3, 4, 5],
    3: [],
    4: [],
    5: [6],
    6: [],
    7: [8],
    8: [9],
    9: [],
  };

  const positions: Record<number, { x: number; y: number }> = {
    1: { x: 350, y: 60 },
    2: { x: 180, y: 180 },
    3: { x: 90, y: 300 },
    4: { x: 180, y: 300 },
    5: { x: 270, y: 300 },
    6: { x: 270, y: 400 },
    7: { x: 520, y: 180 },
    8: { x: 440, y: 300 },
    9: { x: 440, y: 400 },
  };

  const pathfindingRequest: PathfindingRequest = {
    graph,
    startNode: 1,
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
        <div className="sorting-wrapper">
          <svg width="700" height="500">
            {Object.entries(graph).map(([from, toList]) =>
              toList.map((to) => {
                const fromPos = positions[Number(from)];
                const toPos = positions[to];
                return (
                  <line
                    key={`${from}-${to}`}
                    x1={fromPos.x}
                    y1={fromPos.y}
                    x2={toPos.x}
                    y2={toPos.y}
                    stroke="black"
                    strokeWidth={2}
                  />
                );
              })
            )}
            {Object.entries(positions).map(([node, pos]) => (
              <g key={node}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={40}
                  stroke="black"
                  strokeWidth={2}
                  className={
                    alertHighlight?.includes(Number(node))
                      ? "alert-highlight-node"
                      : highlight?.includes(Number(node))
                      ? "highlight-node"
                      : bgHighlight?.includes(Number(node))
                      ? "bg-highlight-node"
                      : "normal-node"
                  }
                />
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={
                    alertHighlight?.includes(Number(node)) ||
                    highlight?.includes(Number(node))
                      ? "white"
                      : "black"
                  }
                  fontSize={22}
                >
                  {node}
                </text>
              </g>
            ))}
          </svg>
        </div>
        <Logtracker logMsg={logMsg} logExplanation={logExplanation} />
        <div className="controls-container">
          <ControlPanel
            algorithmType="pathfind"
            setTargetNum={setSearchNode}
            handleSearch={handleSearch}
            handleTraverse={handleTraverse}
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
    </div>
  );
}

export default BreadthFirstGraph;