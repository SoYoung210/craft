import IMessageComponent from '../components/content/particle-effect/MessageContainer';
import { ParticleEffect } from '../components/content/particle-effect/ParticleEffect';
import PageLayout from '../components/layout/page-layout/PageLayout';

export default function ParticleEffectPage() {
  return (
    <PageLayout>
      <PageLayout.Title>Particle Effect</PageLayout.Title>

      <ParticleEffect>Hello !</ParticleEffect>

      <div style={{ marginTop: 40 }}>
        <ParticleEffect>🎅</ParticleEffect>
      </div>

      <div style={{ marginTop: 40 }}>
        <ParticleEffect>
          <div
            style={{
              padding: 20,
              borderRadius: 8,
              backgroundColor: '#2775FC',
              color: 'white',
            }}
          >
            custom div style
          </div>
        </ParticleEffect>
      </div>
      {/* FIXME: have to solve img CORS issue (on canvas rendering) */}
      {/* <div style={{ marginTop: 40 }}>
        <ParticleEffect>
          <img
            width={120}
            height={120}
            style={{
              borderRadius: 999,
              width: 120,
              height: 120,
            }}
            crossOrigin="anonymous"
            src="https://products.ls.graphics/mesh-gradients/images/03.-Snowy-Mint_1.jpg"
          />
        </ParticleEffect>
      </div> */}
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
