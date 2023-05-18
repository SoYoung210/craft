import { useReducer } from 'react';

import ScrambleContent from '../components/content/scramble-text/ScrambleContent';
import Figure from '../components/layout/Figure';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/material/Button';
import { RotateLeftIcon } from '../components/material/icon/RotateLeft';

export default function ScrambleTextPage() {
  const [key, increaseKey] = useReducer(state => state + 1, 0);

  return (
    <PageLayout>
      <PageLayout.Title>Scramble Text</PageLayout.Title>
      <PageLayout.Details>
        <PageLayout.Summary>scrabmle</PageLayout.Summary>
      </PageLayout.Details>
      <Figure
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '300px',
          position: 'relative',
        }}
      >
        <ScrambleContent
          key={key}
          interval={30}
          style={{ fontSize: 18, fontWeight: 300 }}
        >
          <ScrambleContent.Text>
            Lorem ipsum dolor sit amet,
          </ScrambleContent.Text>
          <ScrambleContent.Text
            style={{ marginLeft: 2, textDecoration: 'underline' }}
          >
            consec tetur adipisicing elit.
          </ScrambleContent.Text>
        </ScrambleContent>
        <Button
          aria-label="reload scramble text animation"
          style={{ position: 'absolute', top: 10, right: 32 }}
          onClick={increaseKey}
        >
          <RotateLeftIcon size={14} />
        </Button>
      </Figure>
    </PageLayout>
  );
}
