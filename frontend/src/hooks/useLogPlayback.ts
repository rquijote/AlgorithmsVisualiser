import { useCallback, useEffect, useRef, useState } from "react";
import type { Log } from "../Interfaces";

function useLogPlayback(speed: number) {
  const logsRef = useRef<Log[]>([]);
  const nextIndexRef = useRef(0);
  const resetRef = useRef<() => void>(() => {});
  const applyLogRef = useRef<(log: Log) => void>(() => {});
  const [frameIndex, setFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayback, setHasPlayback] = useState(false);
  const [playbackId, setPlaybackId] = useState(0);

  const advanceOneStep = useCallback(() => {
    const log = logsRef.current[nextIndexRef.current];
    if (!log) return;

    applyLogRef.current(log);
    nextIndexRef.current += 1;
    setFrameIndex(nextIndexRef.current);

    if (nextIndexRef.current >= logsRef.current.length) {
      setIsPlaying(false);
    }
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const timeout = window.setTimeout(advanceOneStep, speed);
    return () => window.clearTimeout(timeout);
  }, [advanceOneStep, frameIndex, isPlaying, playbackId, speed]);

  function startPlayback(
    logs: Log[],
    reset: () => void,
    applyLog: (log: Log) => void
  ) {
    logsRef.current = logs;
    nextIndexRef.current = 0;
    resetRef.current = reset;
    applyLogRef.current = applyLog;
    reset();
    setFrameIndex(0);
    setPlaybackId((id) => id + 1);
    setHasPlayback(logs.length > 0);
    setIsPlaying(logs.length > 0);
  }

  function togglePlayback() {
    if (!hasPlayback || frameIndex >= logsRef.current.length) return;
    setIsPlaying((playing) => !playing);
  }

  function stepForward() {
    if (!hasPlayback) return;
    advanceOneStep();
  }

  function stepBackward() {
    if (!hasPlayback || nextIndexRef.current === 0) return;

    const previousFrameCount = nextIndexRef.current - 1;
    setIsPlaying(false);
    resetRef.current();

    for (let index = 0; index < previousFrameCount; index += 1) {
      applyLogRef.current(logsRef.current[index]);
    }

    nextIndexRef.current = previousFrameCount;
    setFrameIndex(previousFrameCount);
  }

  function clearPlayback() {
    logsRef.current = [];
    nextIndexRef.current = 0;
    setIsPlaying(false);
    setHasPlayback(false);
    setFrameIndex(0);
    setPlaybackId((id) => id + 1);
  }

  return {
    isPlaying,
    hasPlayback,
    frameIndex,
    totalFrames: logsRef.current.length,
    canStep: frameIndex < logsRef.current.length,
    canStepBackward: frameIndex > 0,
    startPlayback,
    togglePlayback,
    stepForward,
    stepBackward,
    clearPlayback,
  };
}

export default useLogPlayback;