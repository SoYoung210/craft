import { useState } from 'react';

import RandomWindEffect from '../components/content/particle-text/RandomWindEffect';
import PageLayout from '../components/layout/PageLayout';
import TextField from '../components/material/TextField';

export default function ParticleTextPage() {
  const [value, setValue] = useState('Hello World!');

  return (
    <PageLayout>
      <PageLayout.Title>Particle Text</PageLayout.Title>
      <PageLayout.Details>
        <PageLayout.Summary>canvas drawing</PageLayout.Summary>
        <PageLayout.DetailsContent>
          <a
            href="https://youtu.be/2F2t1RJoGt8?t=2812"
            target="_blank"
            rel="noreferrer"
          >
            참고링크
          </a>
        </PageLayout.DetailsContent>
      </PageLayout.Details>

      <RandomWindEffect />
      <TextField value={value} onChange={e => setValue(e.target.value)} />
    </PageLayout>
  );
}
