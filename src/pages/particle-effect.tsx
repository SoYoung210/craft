import IMessageComponent from '../components/content/particle-effect/MessageContainer';
import { ParticleEffect } from '../components/content/particle-effect/UpdatedParticleEffect';
import PageLayout from '../components/layout/page-layout/PageLayout';
import { styled } from '../../stitches.config';
import { TrashIcon } from '../components/material/icon/TranshIcon';

export default function ParticleEffectPage() {
  return (
    <PageLayout>
      <PageLayout.Title>Particle Effect</PageLayout.Title>

      <div style={{ marginTop: 40 }}>
        <ParticleEffect.Root>
          {/* <ParticleEffect.Item id="test01">
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
          </ParticleEffect.Item>
          <ParticleEffect.Trigger targetId="test01" /> */}

          <IMessageComponent>
            <IMessageComponent.Container>
              <ParticleEffect.Item id={'first chat bubble'}>
                <IMessageComponent.MessageBubble from="them">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Aliquid dignissimos ut cumque quibusdam sint repudiandae et
                  officia officiis eos pariatur enim excepturi praesentium,
                  aliquam mollitia nam voluptas debitis porro! Quisquam.
                  <ParticleEffect.Trigger targetId="first chat bubble" asChild>
                    <IMessageComponent.TapbackBubble from="them">
                      <IMessageComponent.TapbackOption>
                        <TrashIcon size={17} />
                      </IMessageComponent.TapbackOption>
                    </IMessageComponent.TapbackBubble>
                  </ParticleEffect.Trigger>
                </IMessageComponent.MessageBubble>
              </ParticleEffect.Item>
              <ParticleEffect.Item id={'second chat bubble'}>
                <IMessageComponent.MessageBubble from="me">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Aliquid uam.
                  <ParticleEffect.Trigger targetId="second chat bubble" asChild>
                    <IMessageComponent.TapbackBubble from="me">
                      <IMessageComponent.TapbackOption>
                        <TrashIcon size={17} />
                      </IMessageComponent.TapbackOption>
                    </IMessageComponent.TapbackBubble>
                  </ParticleEffect.Trigger>
                </IMessageComponent.MessageBubble>
              </ParticleEffect.Item>
              <ParticleEffect.Item id={'third bubble'}>
                <IMessageComponent.MessageBubble from="me" emoji noTail>
                  👍🏻
                </IMessageComponent.MessageBubble>
              </ParticleEffect.Item>
              <ParticleEffect.Trigger targetId="third bubble" />
            </IMessageComponent.Container>
          </IMessageComponent>
        </ParticleEffect.Root>
      </div>
    </PageLayout>
  );
}
