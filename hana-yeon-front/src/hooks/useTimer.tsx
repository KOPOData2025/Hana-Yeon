import { useState, useEffect, useCallback, useRef } from "react";

export const useTimer = (initialMin: number, initialSec?: number) => {
  const [isTimerStart, setTimerStart] = useState(false);
  const [min, setMin] = useState(initialMin);
  const [sec, setSec] = useState(initialSec ?? 0);
  const [isFinished, setFinished] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isTimerStart) return undefined;

    intervalRef.current = setInterval(() => {
      if (sec > 0) setSec((prev) => prev - 1);
      if (sec === 0) {
        if (min === 0) {
          if (intervalRef.current) clearInterval(intervalRef.current);
        } else {
          setMin((prev) => prev - 1);
          setSec(59);
        }
      }
    }, 1200);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [initialMin, initialSec, isTimerStart, min, sec]);

  useEffect(() => {
    setFinished(sec === 0 && min === 0);
  }, [min, sec]);

  const resetTimer = useCallback(() => {
    setMin(initialMin);
    setSec(initialSec ?? 0);
    setTimerStart(true);
  }, [initialMin, initialSec]);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimerStart(false);
  }, []);

  return {
    min,
    sec,
    isTimerStart,
    setTimerStart,
    isFinished,
    resetTimer,
    stopTimer,
  };
};
