import { useCallback, useEffect, useRef } from 'react';

import useCallbackRef from './useCallbackRef';

export default function useTimeout<T extends (...args: any[]) => any>(
  callback: T | undefined
) {
  const timerRef = useRef(0);
  const timerStartTimeRef = useRef(0);
  const timerRemainingTimeRef = useRef(0);

  const callbackHandler = useCallbackRef(callback);

  const start = useCallback(
    (duration: number) => {
      timerRemainingTimeRef.current = duration;
      // 존재하던 타이머 리셋 (e.g. resume으로 실행되는 경우)
      window.clearTimeout(timerRef.current);
      timerStartTimeRef.current = new Date().getTime();
      timerRef.current = window.setTimeout(callbackHandler, duration);
      // 시작시간 기록
    },
    [callbackHandler]
  );
  const clear = useCallback(() => {
    window.clearTimeout(timerRef.current);
  }, []);

  const pause = useCallback(() => {
    const elapsedTime = new Date().getTime() - timerStartTimeRef.current;
    timerRemainingTimeRef.current = timerRemainingTimeRef.current - elapsedTime;
    window.clearTimeout(timerRef.current);
  }, []);

  const resume = useCallback(() => {
    // 재시작시 setTimeout(fn, 남은시간)으로 다시 시작
    start(timerRemainingTimeRef.current);
  }, [start]);

  useEffect(() => {
    return clear;
  }, [clear]);

  return {
    start,
    clear,
    resume,
    pause,
  };
}
