import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import type { Log, RecursiveCall } from "../Interfaces";
import "../styles/visualiser.css";
import Logtracker from "../components/LogTracker";
import RecursionCallTree from "../components/RecursionCallTree";
import NumberDatasetControls from "../components/NumberDatasetControls";
import useLogPlayback from "../hooks/useLogPlayback";
import { randomizeNumbers } from "../utils/randomizeNumbers";

type CompareMode = "sort" | "search";
type CompareVisualization = "simple" | "recursive";

interface CompareAlgorithmOption {
  id: string;
  label: string;
  endpoint: string;
  visualization: CompareVisualization;
}

interface ComparePaneProps {
  algorithm: CompareAlgorithmOption;
  compareMode: CompareMode;
  compareToken: number;
  numbers: number[] | null;
  targetNum: number;
}

const SORT_ALGORITHMS: CompareAlgorithmOption[] = [
  { id: "bubble-sort", label: "Bubble Sort", endpoint: "/api/sort/bubble", visualization: "simple" },
  { id: "insertion-sort", label: "Insertion Sort", endpoint: "/api/sort/insertion", visualization: "simple" },
  { id: "selection-sort", label: "Selection Sort", endpoint: "/api/sort/selection", visualization: "simple" },
  { id: "merge-sort", label: "Merge Sort", endpoint: "/api/sort/merge", visualization: "recursive" },
  { id: "quick-sort", label: "Quick Sort", endpoint: "/api/sort/quick", visualization: "recursive" },
];

const SEARCH_ALGORITHMS: CompareAlgorithmOption[] = [
  { id: "linear-search", label: "Linear Search", endpoint: "/api/search/linear", visualization: "simple" },
  { id: "binary-search", label: "Binary Search", endpoint: "/api/search/binary", visualization: "simple" },
];

const DEFAULT_SELECTIONS: Record<CompareMode, [string, string]> = {
  sort: ["bubble-sort", "insertion-sort"],
  search: ["linear-search", "binary-search"],
};

function ComparePane({ algorithm, compareMode, compareToken, numbers, targetNum }: ComparePaneProps) {
  const [currentList, setCurrentList] = useState<number[]>(numbers ?? []);
  const [logMsg, setLogMsg] = useState<string[]>([]);
  const [logExplanation, setLogExplanation] = useState<string[]>([]);
  const [highlight, setHighlight] = useState<number[] | undefined>();
  const [alertHighlight, setAlertHighlight] = useState<number[] | undefined>();
  const [bgHighlight, setBgHighlight] = useState<number[] | undefined>();
  const [calls, setCalls] = useState<RecursiveCall[]>([]);
  const [activeCallId, setActiveCallId] = useState<number | null>(null);
  const [speed, setSpeed] = useState(1000);
  const playback = useLogPlayback(speed);
  const playbackRef = useRef(playback);

  const latestConfig = useRef({ algorithm, compareMode, numbers, targetNum });

  useEffect(() => {
    playbackRef.current = playback;
  }, [playback]);

  useEffect(() => {
    latestConfig.current = { algorithm, compareMode, numbers, targetNum };
  }, [algorithm, compareMode, numbers, targetNum]);

  const clearPane = useCallback(() => {
    setCurrentList(numbers ?? []);
    setHighlight([]);
    setAlertHighlight([]);
    setBgHighlight([]);
    setCalls([]);
    setActiveCallId(null);
    setLogMsg([]);
    setLogExplanation([]);
  }, [numbers]);

  useEffect(() => {
    playbackRef.current.clearPlayback();
    clearPane();
  }, [algorithm.id, compareMode, clearPane]);

  const applyLog = useCallback(
    (log: Log) => {
      setCurrentList(log.list);
      setHighlight(log.extras?.highlight || []);
      setAlertHighlight(log.extras?.alertHighlight || []);
      setBgHighlight(log.extras?.bgHighlight || []);
      setLogMsg((previous) => [...previous, log.actionMsg]);
      setLogExplanation((previous) => [...previous, log.explanation]);

      if (algorithm.visualization !== "recursive") {
        return;
      }

      const extras = log.extras;
      if (extras?.callId === undefined || extras.phase === undefined) {
        return;
      }

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
        message: log.actionMsg,
      };

      setCalls((previousCalls) => {
        const existingIndex = previousCalls.findIndex(
          (existingCall) => existingCall.callId === call.callId
        );

        if (existingIndex === -1) {
          return [...previousCalls, call];
        }

        return previousCalls.map((existingCall, index) =>
          index === existingIndex ? call : existingCall
        );
      });

      setActiveCallId(extras.phase === "complete" ? null : call.callId);
    },
    [algorithm.visualization]
  );

  useEffect(() => {
    if (compareToken === 0) {
      return;
    }

    const runComparison = async () => {
      const { algorithm: currentAlgorithm, compareMode: currentMode, numbers: currentNumbers, targetNum: currentTarget } = latestConfig.current;

      if (!currentNumbers?.length || currentNumbers.length > 12 || currentNumbers.some((value) => value < 0 || value > 99)) {
        return;
      }

      if (currentMode === "search" && (!Number.isInteger(currentTarget) || currentTarget < 0 || currentTarget > 99)) {
        return;
      }

      const response = await fetch(currentAlgorithm.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body:
          currentMode === "sort"
            ? JSON.stringify(currentNumbers)
            : JSON.stringify({ list: currentNumbers, target: currentTarget }),
      });

      if (!response.ok) {
        console.error(`Failed to fetch logs for ${currentAlgorithm.label}`);
        return;
      }

      const data: Log[] = await response.json();
      playbackRef.current.startPlayback(data, clearPane, applyLog);
    };

    void runComparison();
  }, [applyLog, clearPane, compareToken]);

  const isRecursive = algorithm.visualization === "recursive";

  return (
    <section className="compare-pane">
      <div className="compare-pane-heading">
        <h2>{algorithm.label}</h2>
      </div>

      {isRecursive ? (
        <div className="recursive-sort-layout recursive-sort-layout-compact compare-recursive-layout">
          <section className="recursion-array-panel">
            <h2>{compareMode === "sort" ? "Current Array" : "Current Result"}</h2>
            <div className="recursion-array-values">
              {currentList.map((number, index) => (
                <div
                  key={index}
                  className={`sorting-numbox ${
                    alertHighlight?.includes(index)
                      ? "alert-highlight"
                      : highlight?.includes(index)
                      ? "highlight"
                      : bgHighlight?.includes(index)
                      ? "bg-highlight"
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
      ) : (
        <div className="sorting-wrapper compare-simple-wrapper">
          <div className="sorting-div">
            {currentList.map((number, index) => (
              <div
                key={index}
                className={`sorting-numbox ${
                  alertHighlight?.includes(index)
                    ? "alert-highlight"
                    : highlight?.includes(index)
                    ? "highlight"
                    : bgHighlight?.includes(index)
                    ? "bg-highlight"
                    : ""
                }`}
              >
                {number}
              </div>
            ))}
          </div>
        </div>
      )}

      <Logtracker logMsg={logMsg} logExplanation={logExplanation} />

      <div className="compare-playback-controls">
        <div className="playback-controls">
          <button
            className="controlpanel-btn-secondary"
            onClick={playback.stepBackward}
            disabled={!playback.hasPlayback || !playback.canStepBackward}
          >
            Back
          </button>
          <button
            className="controlpanel-btn-secondary"
            onClick={playback.togglePlayback}
            disabled={!playback.hasPlayback || (!playback.isPlaying && !playback.canStep)}
          >
            {playback.isPlaying ? "Pause" : "Play"}
          </button>
          <button
            className="controlpanel-btn-secondary"
            onClick={playback.stepForward}
            disabled={!playback.hasPlayback || !playback.canStep}
          >
            Step
          </button>
          <span className="frame-count">
            Frame {playback.frameIndex ?? 0} / {playback.totalFrames ?? 0}
          </span>
        </div>
        <div className="speed-controls">
          <span className="control-label">Speed</span>
          <button
            className="controlpanel-btn-secondary"
            onClick={() => setSpeed((prev) => (prev ? Math.min(prev + 250, 10000) : 250))}
          >
            Slower
          </button>
          <span className="speed-value">{speed} ms</span>
          <button
            className="controlpanel-btn-secondary"
            onClick={() => setSpeed((prev) => Math.max(prev - 250, 250))}
          >
            Faster
          </button>
        </div>
      </div>
    </section>
  );
}

function CompareAlgorithms() {
  const [searchParams] = useSearchParams();
  const [compareMode, setCompareMode] = useState<CompareMode>("sort");
  const [leftAlgorithmId, setLeftAlgorithmId] = useState(DEFAULT_SELECTIONS.sort[0]);
  const [rightAlgorithmId, setRightAlgorithmId] = useState(DEFAULT_SELECTIONS.sort[1]);
  const [numbers, setNumbers] = useState<number[] | null>(randomizeNumbers(12));
  const [targetDraft, setTargetDraft] = useState("20");
  const [targetNum, setTargetNum] = useState(20);
  const [compareToken, setCompareToken] = useState(0);

  const algorithms = compareMode === "sort" ? SORT_ALGORITHMS : SEARCH_ALGORITHMS;

  function resolveSelection(mode: CompareMode, leftId?: string | null, rightId?: string | null) {
    const options = mode === "sort" ? SORT_ALGORITHMS : SEARCH_ALGORITHMS;
    const [defaultLeft, defaultRight] = DEFAULT_SELECTIONS[mode];
    const resolvedLeft = options.some((algorithm) => algorithm.id === leftId) ? leftId : defaultLeft;
    const resolvedRightCandidate = options.some((algorithm) => algorithm.id === rightId) ? rightId : defaultRight;
    const resolvedRight =
      resolvedRightCandidate === resolvedLeft
        ? options.find((algorithm) => algorithm.id !== resolvedLeft)?.id ?? resolvedRightCandidate
        : resolvedRightCandidate;

    return {
      leftId: resolvedLeft ?? defaultLeft,
      rightId: resolvedRight ?? defaultRight,
    };
  }

  useEffect(() => {
    const nextMode = searchParams.get("mode") === "search" ? "search" : "sort";
    const selection = resolveSelection(nextMode, searchParams.get("left"), searchParams.get("right"));

    setCompareMode(nextMode);
    setLeftAlgorithmId(selection.leftId);
    setRightAlgorithmId(selection.rightId);
  }, [searchParams]);

  const leftAlgorithm = useMemo(
    () => algorithms.find((algorithm) => algorithm.id === leftAlgorithmId) ?? algorithms[0],
    [algorithms, leftAlgorithmId]
  );
  const rightAlgorithm = useMemo(
    () => algorithms.find((algorithm) => algorithm.id === rightAlgorithmId) ?? algorithms[1] ?? algorithms[0],
    [algorithms, rightAlgorithmId]
  );

  useEffect(() => {
    if (compareMode !== "search" || !numbers) {
      return;
    }

    const sortedNumbers = [...numbers].sort((left, right) => left - right);
    const isAlreadySorted =
      sortedNumbers.length === numbers.length &&
      sortedNumbers.every((value, index) => value === numbers[index]);

    if (!isAlreadySorted) {
      setNumbers(sortedNumbers);
    }
  }, [compareMode, numbers]);

  const isNumbersDisabled = !numbers?.length || numbers.length > 12 || numbers.some((value) => value < 0 || value > 99);
  const isTargetDisabled = compareMode === "search" && (!Number.isInteger(targetNum) || targetNum < 0 || targetNum > 99);
  const canCompare = !isNumbersDisabled && !isTargetDisabled;

  function handleTargetChange(value: string) {
    setTargetDraft(value);
    setTargetNum(value.trim() === "" ? NaN : Number(value));
  }

  function handleCompare() {
    if (!canCompare) {
      return;
    }

    setCompareToken((token) => token + 1);
  }

  const title = `${leftAlgorithm.label} & ${rightAlgorithm.label}`;

  return (
    <div className="container">
      <div className="visualiser-container compare-page">
        <h1>{title}</h1>

        <div className="compare-chooser-row compare-chooser-row-inline">
          <label className="compare-select-group">
            <span className="control-label">Left</span>
            <select
              className="compare-select"
              value={leftAlgorithmId}
              onChange={(event) => setLeftAlgorithmId(event.target.value)}
            >
              {algorithms.map((algorithm) => (
                <option key={algorithm.id} value={algorithm.id}>
                  {algorithm.label}
                </option>
              ))}
            </select>
          </label>

          <label className="compare-select-group">
            <span className="control-label">Right</span>
            <select
              className="compare-select"
              value={rightAlgorithmId}
              onChange={(event) => setRightAlgorithmId(event.target.value)}
            >
              {algorithms.map((algorithm) => (
                <option key={algorithm.id} value={algorithm.id}>
                  {algorithm.label}
                </option>
              ))}
            </select>
          </label>

          <button className="controlpanel-btn-primary compare-start-button" type="button" onClick={handleCompare} disabled={!canCompare}>
            Start Comparing
          </button>
        </div>

        {compareMode === "search" && (
          <div className="compare-target-row">
            <label className="compare-target-control">
              <span className="control-label">Target</span>
              <input
                type="text"
                inputMode="numeric"
                className={`dataset-input${isTargetDisabled ? " input-error" : ""}`}
                value={targetDraft}
                onChange={(event) => handleTargetChange(event.target.value)}
                aria-invalid={isTargetDisabled}
                aria-describedby={isTargetDisabled ? "compare-target-error" : "compare-target-hint"}
              />
            </label>
            {isTargetDisabled ? (
              <span className="dataset-error" id="compare-target-error" role="alert">
                Enter a whole-number target from 0 to 99.
              </span>
            ) : (
              <span className="dataset-hint" id="compare-target-hint">
                Comparison uses the same shared target for both algorithms.
              </span>
            )}
          </div>
        )}

        <NumberDatasetControls
          numbers={numbers}
          onNumbersChange={setNumbers}
          maxNumberCount={12}
          sortNumbers={compareMode === "search"}
        />

        <div className="compare-panels">
          <ComparePane
            key={leftAlgorithm.id}
            algorithm={leftAlgorithm}
            compareMode={compareMode}
            compareToken={compareToken}
            numbers={numbers}
            targetNum={targetNum}
          />
          <ComparePane
            key={rightAlgorithm.id}
            algorithm={rightAlgorithm}
            compareMode={compareMode}
            compareToken={compareToken}
            numbers={numbers}
            targetNum={targetNum}
          />
        </div>
      </div>
    </div>
  );
}

export default CompareAlgorithms;