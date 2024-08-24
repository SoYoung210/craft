import { useState } from 'react';

import IMessageComponent from '../components/content/particle-effect/MessageContainer';
import { ParticleEffect } from '../components/content/particle-effect/ParticleEffect';
import PageLayout from '../components/layout/page-layout/PageLayout';

export default function ParticleEffectPage() {
  const [debugKey, setDebugKey] = useState(0);
  const increaseDebugKey = () => setDebugKey(prev => prev + 1);
  const [targetMultiple, setTargetMultiple] = useState(2);

  return (
    <PageLayout>
      <PageLayout.Title>Particle Effect</PageLayout.Title>

      <div style={{ marginTop: 40 }}>
        <button onClick={increaseDebugKey}>re-render</button>
        <input
          value={targetMultiple}
          onChange={e => {
            const value = Number(e.target.value);
            if (value >= 0) {
              setTargetMultiple(value);
            }
          }}
        />
        <ParticleEffect key={debugKey}>
          <div
            style={{
              padding: 20,
              borderRadius: 8,
              backgroundColor: '#2775FC',
              color: 'white',
              width: 140,
            }}
          >
            custom div style
          </div>
        </ParticleEffect>
      </div>
      <IMessageComponent>
        <IMessageComponent.Container>
          <ParticleEffect>
            <IMessageComponent.MessageBubble from="them">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquid
              dignissimos ut cumque quibusdam sint repudiandae et officia
              officiis eos pariatur enim excepturi praesentium, aliquam mollitia
              nam voluptas debitis porro! Quisquam.
            </IMessageComponent.MessageBubble>
          </ParticleEffect>
          <ParticleEffect>
            <IMessageComponent.MessageBubble from="me">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquid
            </IMessageComponent.MessageBubble>
          </ParticleEffect>
          <IMessageComponent.MessageBubble from="them" marginBottom="one">
            s pariatur enim exceptu
          </IMessageComponent.MessageBubble>
          <ParticleEffect>
            <IMessageComponent.MessageBubble from="me" emoji noTail>
              👍🏻
            </IMessageComponent.MessageBubble>
          </ParticleEffect>
          <IMessageComponent.MessageBubble from="me">
            Reply Test
          </IMessageComponent.MessageBubble>
        </IMessageComponent.Container>
      </IMessageComponent>
    </PageLayout>
  );
}
