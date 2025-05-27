import { useState, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';

const SEOUL_TZ = 'Asia/Seoul';
const SF_TZ = 'America/Los_Angeles';
import PageLayout from '../components/layout/page-layout/PageLayout';
import useInterval from '../hooks/useInterval';
import { Clock } from '../components/content/timezone-clock/clock';
import Button from '../components/material/Button';

export default function TimezoneClockPage() {
  const [baseTime, setBaseTime] = useState(() => new Date());
  const [isLiveTime, setIsLiveTime] = useState(true);

  useInterval(() => {
    if (isLiveTime) {
      setBaseTime(new Date());
    } else {
      setBaseTime(prevTime => new Date(prevTime.getTime() + 1000));
    }
  }, 1000);

  const handleTimeAdjust = useCallback((minuteAdjustment: number) => {
    setBaseTime(prevTime => {
      const newTime = new Date(prevTime.getTime() + minuteAdjustment * 60000);
      return newTime;
    });
    setIsLiveTime(false);
  }, []);

  const resetToLiveTime = useCallback(() => {
    setIsLiveTime(true);
    setBaseTime(new Date());
  }, []);

  return (
    <PageLayout>
      <PageLayout.Title>Timezone Clock</PageLayout.Title>
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-primary">
          Global Glance
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Dual Time Zone Clocks
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-10 md:gap-12 mb-10">
        <Clock
          timeZone={SEOUL_TZ}
          label="Seoul"
          baseTime={baseTime}
          onTimeAdjust={handleTimeAdjust}
          colorScheme="light-blue"
        />
        <Clock
          timeZone={SF_TZ}
          label="San Francisco"
          baseTime={baseTime}
          onTimeAdjust={handleTimeAdjust}
          colorScheme="bright-orange"
        />
      </div>

      {!isLiveTime && (
        <Button
          onClick={resetToLiveTime}
          variant="outline"
          className="shadow-md"
        >
          <RotateCcw className="mr-2 h-5 w-5" />
          Reset to Live Time
        </Button>
      )}
    </PageLayout>
  );
}
