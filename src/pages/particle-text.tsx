import { useCallback, useRef, useState } from 'react';

import RandomWindEffect from '../components/content/particle-text/RandomWindEffect';
import SnowFlake from '../components/content/particle-text/SnowFlake';
import { EffectControl } from '../components/content/particle-text/useParticleText';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/material/Button';
import Flex from '../components/material/Flex';
import { HStack } from '../components/material/Stack';
import TextField from '../components/material/TextField';
import { isEnterKey } from '../utils/keyboard';

export default function ParticleTextPage() {
  const contentInputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState('Hello World!');

  const snowFlakeControlRef = useRef<EffectControl>(null);

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

      <PageLayout.SubTitle>Dynamic Text</PageLayout.SubTitle>
      <HStack gap={16}>
        <TextField
          ref={contentInputRef}
          defaultValue="Hello World!"
          onKeyDown={e => {
            if (isEnterKey(e)) {
              applyValue();
            }
          }}
        />
        <Button onClick={applyValue}>Apply</Button>
      </HStack>

      <RandomWindEffect key={value} textValue={value} />
      <Flex>
        <PageLayout.SubTitle>Snowflake example</PageLayout.SubTitle>
        <Button
          css={{ marginLeft: 'auto' }}
          onClick={() => snowFlakeControlRef.current?.start()}
        >
          Run
        </Button>
      </Flex>
      <SnowFlake ref={snowFlakeControlRef} />
    </PageLayout>
  );
}
