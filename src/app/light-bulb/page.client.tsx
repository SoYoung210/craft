'use client';

import { LightBulb } from '../../components/content/light-bulb/LightBulb';
import { useToggle } from '../../hooks/useToggle';

export default function LightBulbClient() {
  const [theme, toggleTheme] = useToggle<'dark' | 'light'>('dark', [
    'dark',
    'light',
  ]);

  const textColorFrom =
    theme === 'dark' ? '#495057' : 'hsla(55,97%,88%,.8)';
  const textColorTo =
    theme === 'dark' ? '#495057' : 'rgba(253,224,71,.3)';

  return (
    <div
      style={{
        backgroundColor: 'rgb(5,5,5)',
        minHeight: '100vh',
      }}
    >
      <div className="absolute" style={{ left: '12rem' }}>
        <LightBulb theme={theme} onClickBulb={toggleTheme} />
      </div>
      <main
        style={{
          padding: 64,
          paddingTop: '12rem',
          minHeight: '100vh',
          maxWidth: '42rem',
          margin: '0 auto',
        }}
      >
        <div className="flex flex-col gap-8 p-4">
          <h1
            style={{
              color: 'transparent',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundImage: `linear-gradient(to bottom, ${textColorFrom}, ${textColorTo})`,
            }}
          >
            FEConf: Frontend Development Conference
          </h1>
          <p
            style={{
              color: 'transparent',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundImage: `linear-gradient(to bottom, ${textColorFrom}, ${textColorTo})`,
            }}
          >
            Frontend Development Group is a Facebook group created to talk more
            with anyone interested in web frontend technology.
          </p>
        </div>
      </main>
    </div>
  );
}
