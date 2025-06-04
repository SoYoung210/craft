import { useState, useCallback } from 'react';

const SEOUL_TZ = 'Asia/Seoul';
const SF_TZ = 'America/Los_Angeles';
import { graphql, PageProps } from 'gatsby';

import PageLayout from '../components/layout/page-layout/PageLayout';
import useInterval from '../hooks/useInterval';
import { Clock } from '../components/content/timezone-clock/clock';
import SEO from '../components/layout/SEO';

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
      <PageLayout.Details>
        <PageLayout.Summary>
          Interactive clock for comparing time between Seoul and San Francisco.
        </PageLayout.Summary>
        Inspired by Bauhaus Clock design
      </PageLayout.Details>
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

export const Head = (props: PageProps<Queries.PageDataQuery>) => {
  return (
    <SEO
      title="Timezone Clock"
      description="Interactive clock for comparing time between Seoul and San Francisco."
      thumbnailSrc={
        props.data.pageFeatured?.childImageSharp?.gatsbyImageData.images
          .fallback?.src
      }
    />
  );
};

export const query = graphql`
  query PageData {
    pageFeatured: file(
      absolutePath: { glob: "**/src/images/thumbnails/clock-thumbanil-5.webp" }
    ) {
      childImageSharp {
        gatsbyImageData(layout: FIXED, width: 900)
      }
    }
  }
`;
