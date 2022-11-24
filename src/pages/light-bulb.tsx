import React from 'react';

import { LightBulb } from '../components/content/light-bulb/LightBulb';
import * as styles from '../components/content/light-bulb/page.css';
import { useToggle } from '../hooks/useToggle';

export default function LightBulbPage() {
  // const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [theme, toggleTheme] = useToggle<'dark' | 'light'>('dark', [
    'dark',
    'light',
  ]);

  return (
    <div className={styles.root}>
      <div className={styles.bulbContainer}>
        <LightBulb theme={theme} onClickBulb={toggleTheme} />
      </div>
      <main className={styles.mainTheme[theme]}>
        <div className={styles.contentContainer}>
          <h1 className={styles.textColorStyle}>
            FEConf: Frontend Development Conference
          </h1>
          <p className={styles.textColorStyle}>
            Frontend Development Group is a Facebook group created to talk more
            with anyone interested in web frontend technology.
          </p>
        </div>
      </main>
    </div>
  );
}
