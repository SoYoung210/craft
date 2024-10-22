import { useRef, useState } from 'react';

import IMessageComponent from '../components/content/particle-effect/MessageContainer';
import { ParticleEffect } from '../components/content/particle-effect/ParticleEffect';
import PageLayout from '../components/layout/page-layout/PageLayout';
import Test from '../components/content/particle-effect/Test01';
import { styled } from '../../stitches.config';

export default function ParticleEffectPage() {
  return (
    <PageLayout>
      <PageLayout.Title>Particle Effect</PageLayout.Title>

      <div style={{ marginTop: 40 }}>
        <>
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
        </>
      </div>

      <IMessageComponent>
        <IMessageComponent.Container>
          <Test componentName={'first chat bubble'}>
            <IMessageComponent.MessageBubble from="them">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquid
              dignissimos ut cumque quibusdam sint repudiandae et officia
              officiis eos pariatur enim excepturi praesentium, aliquam mollitia
              nam voluptas debitis porro! Quisquam.
            </IMessageComponent.MessageBubble>
          </Test>
          <Test componentName={'second chat bubble'}>
            <IMessageComponent.MessageBubble from="me">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquid
              uam.
            </IMessageComponent.MessageBubble>
          </Test>
          <Test>
            <IMessageComponent.MessageBubble from="me" emoji noTail>
              👍🏻
            </IMessageComponent.MessageBubble>
          </Test>
          {/* <IMessageComponent.MessageBubble from="them" marginBottom="one">
            s pariatur enim exceptu
          </IMessageComponent.MessageBubble>
          
          <IMessageComponent.MessageBubble from="me">
            Reply Test
          </IMessageComponent.MessageBubble> */}
        </IMessageComponent.Container>
      </IMessageComponent>
      <IMessageComponent>
        <IMessageComponent.Container>
          <IMessageComponent.MessageBubble from="them">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquid
            dignissimos ut cumque quibusdam sint repudiandae et officia officiis
            eos pariatur enim excepturi praesentium, aliquam mollitia nam
            voluptas debitis porro! Quisquam.
          </IMessageComponent.MessageBubble>

          <IMessageComponent.MessageBubble from="me">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquid
          </IMessageComponent.MessageBubble>

          {/* <IMessageComponent.MessageBubble from="them" marginBottom="one">
            s pariatur enim exceptu
          </IMessageComponent.MessageBubble>
          <Test>
            <IMessageComponent.MessageBubble from="me" emoji noTail>
              👍🏻
            </IMessageComponent.MessageBubble>
          </Test>
          <IMessageComponent.MessageBubble from="me">
            Reply Test
          </IMessageComponent.MessageBubble> */}
        </IMessageComponent.Container>
      </IMessageComponent>
    </PageLayout>
  );
}

const MessageBubble = styled('div', {
  borderRadius: '1.15rem',
  lineHeight: 1.25,
  // maxWidth: '75%',
  padding: '0.5rem 0.875rem',
  position: 'relative',
  wordWrap: 'break-word',
  // width: 'fit-content',

  variants: {
    from: {
      me: {
        alignSelf: 'flex-end',
        backgroundColor: '#248bf5',
        color: '#fff',

        '& + &': {
          marginTop: '0.25rem',
        },

        '&:last-of-type': {
          marginBottom: '0.5rem',
        },
      },
      them: {
        alignSelf: 'flex-start',
        backgroundColor: '#e5e5ea',
        color: '#000',
      },
    },
    emoji: {
      true: {
        background: 'none',
        fontSize: '2.5rem',

        '&::before': {
          content: 'none',
        },
      },
    },
    noTail: {
      true: {
        '&::before': {
          display: 'none',
        },
      },
    },
    marginBottom: {
      none: {
        marginBottom: '0',
      },
      one: {
        marginBottom: '1rem',
      },
    },
    marginTop: {
      one: {
        marginTop: '1rem',
      },
    },
  },
});
