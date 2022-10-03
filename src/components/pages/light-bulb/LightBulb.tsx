import React, { useCallback, useState } from 'react';

import useInterval from '../../../hooks/useInterval';

import * as styles from './LightBulb.css';

interface Props {
  theme: 'dark' | 'light';
  onClickBulb?: () => void;
}
export function LightBulb({ theme, onClickBulb: onClickBulbFromProps }: Props) {
  const [clicks, setClicks] = useState(0);
  const broken = clicks > 3;

  const onClickBulb = useCallback(() => {
    onClickBulbFromProps?.();
    setClicks(prev => prev + 1);
  }, [onClickBulbFromProps]);

  useInterval(() => {
    setClicks(0);
  }, 1250);

  return (
    <div className={styles.area}>
      <div className={styles.wire}></div>
      <div className={styles.fixture}>
        <div className={styles.strip}></div>
        <div className={styles.strip}></div>
        <div className={styles.strip}></div>
      </div>

      {!broken && (
        <button
          type="button"
          className={styles.bulb[theme]}
          onClick={onClickBulb}
        >
          <div className={styles.zig}></div>
          <div className={styles.zig}></div>
          <div className={styles.zig}></div>
        </button>
      )}
    </div>
  );
}
