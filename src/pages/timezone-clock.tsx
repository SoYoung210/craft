import { useState, useCallback } from 'react';

const SEOUL_TZ = 'Asia/Seoul';
const SF_TZ = 'America/Los_Angeles';
import PageLayout from '../components/layout/page-layout/PageLayout';
import useInterval from '../hooks/useInterval';
import { Clock } from '../components/content/timezone-clock/clock';

export default function TimezoneClockPage() {
  const [baseTime, setBaseTime] = useState(() => new Date());

  useInterval(() => {
    setBaseTime(prevTime => new Date(prevTime.getTime() + 1000));
  }, 1000);

  const handleTimeAdjust = useCallback((minuteAdjustment: number) => {
    setBaseTime(prevTime => {
      const newTime = new Date(prevTime.getTime() + minuteAdjustment * 60000);
      return newTime;
    });
  }, []);

  return (
    <PageLayout>
      <PageLayout.Title>Timezone Clock</PageLayout.Title>

      <div className="flex flex-col md:flex-row gap-10 md:gap-12 mb-10">
        <Clock
          timeZone={SEOUL_TZ}
          label="SEO"
          baseTime={baseTime}
          onTimeAdjust={handleTimeAdjust}
        />
        <Clock
          timeZone={SF_TZ}
          label="SF"
          baseTime={baseTime}
          onTimeAdjust={handleTimeAdjust}
        />
      </div>
    </PageLayout>
  );
}
