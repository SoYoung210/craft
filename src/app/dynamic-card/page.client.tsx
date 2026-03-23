'use client';

import DynamicCard from '../../components/content/dynamic-card/DynamicCard';
import PageLayout from '../../components/layout/page-layout/PageLayout';
import Text from '../../components/material/Text';

export default function DynamicCardClient() {
  return (
    <PageLayout>
      <PageLayout.Title>Dynamic Card</PageLayout.Title>
      <PageLayout.Details>
        <PageLayout.Summary>
          Apply rotation and lighting effects based on mouse hover position /
          hologram effect
        </PageLayout.Summary>
        <PageLayout.DetailsContent>
          Angle: Math.log2(x, y 좌표 거리), Lightening gradient: #ffffff55,
          #0000000f <br />
          <a
            href="https://codepen.io/nycos62/pen/PoaKZjL"
            target="_blank"
            rel="noreferrer"
          >
            holographic effect reference
          </a>
        </PageLayout.DetailsContent>
      </PageLayout.Details>
      <DynamicCard />
      <div
        style={{
          fontFamily: 'monospace',
          color: '#adb5bd',
          textAlign: 'center',
        }}
      >
        Card Designed by{' '}
        <Text asChild color="gray6" style={{ textDecoration: 'underline' }}>
          <a href="https://jihoonwrks.me/" target="_blank" rel="noreferrer">
            jihoon-yu
          </a>
        </Text>
      </div>
    </PageLayout>
  );
}
