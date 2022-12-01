import { useCallback, useRef, useState } from 'react';

import { styled } from '../../stitches.config';
import RandomWindEffect from '../components/content/particle-text/RandomWindEffect';
import SnowFlake from '../components/content/particle-text/SnowFlake';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/material/Button';
import TextField from '../components/material/TextField';
import { isEnterKey } from '../utils/keyboard';

export default function ParticleTextPage() {
  const contentInputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState('Hello World!');

  const applyValue = useCallback(() => {
    const newValue = contentInputRef.current?.value;

    if (newValue != null) {
      setValue(newValue);
    }
  }, []);

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

      <TextFieldRoot>
        <TextField
          ref={contentInputRef}
          defaultValue="Hello World!"
          onKeyDown={e => {
            if (isEnterKey(e)) {
              applyValue();
            }
          }}
        />
        <Button css={{ marginLeft: 16 }} onClick={applyValue}>
          Apply
        </Button>
      </TextFieldRoot>

      <RandomWindEffect key={value} textValue={value} />
      <SnowFlake />
    </PageLayout>
  );
}

const TextFieldRoot = styled('div', {
  display: 'flex',
  width: '100%',
});
