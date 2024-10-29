import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';

import IMessageComponent from '../components/content/particle-effect/MessageContainer';
import { ParticleEffect } from '../components/content/particle-effect/UpdatedParticleEffect';
import PageLayout from '../components/layout/page-layout/PageLayout';
import { TrashIcon } from '../components/material/icon/TranshIcon';

interface Message {
  id: string;
  from: 'me' | 'them';
  message: string;
  emoji?: boolean;
  noTail?: boolean;
}
const MESSAGES: Message[] = [
  {
    id: 'first chat bubble',
    from: 'them',
    message:
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquid dignissimos ut cumque quibusdam sint repudiandae et officia officiis eos pariatur enim excepturi praesentium, aliquam mollitia nam voluptas debitis porro! Quisquam.',
  },
  {
    id: 'second chat bubble',
    from: 'me',
    message:
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquid uam.',
  },
  {
    id: 'third bubble',
    from: 'me',
    message: '👍🏻',
    emoji: true,
    noTail: true,
  },
];
export default function ParticleEffectPage() {
  const [messages, setMessages] = useState(MESSAGES);

  const handleExitComplete = (id: string) => {
    setMessages(prev => prev.filter(message => message.id !== id));
  };

  return (
    <PageLayout>
      <PageLayout.Title>Particle Effect</PageLayout.Title>
      <div style={{ marginTop: 40 }}>
        <ParticleEffect.Root>
          <IMessageComponent>
            <IMessageComponent.Container>
              <AnimatePresence mode="popLayout">
                {messages.map(({ id, from, message, emoji, noTail }) => {
                  return (
                    <ParticleEffect.Item
                      onExitComplete={() => handleExitComplete(id)}
                      id={id}
                      key={id}
                    >
                      <IMessageComponent.MessageBubble
                        from={from}
                        emoji={emoji}
                        noTail={noTail}
                      >
                        {message}
                        <ParticleEffect.Trigger targetId={id} asChild>
                          <IMessageComponent.TapbackBubble from={from}>
                            <IMessageComponent.TapbackOption>
                              <TrashIcon size={17} />
                            </IMessageComponent.TapbackOption>
                          </IMessageComponent.TapbackBubble>
                        </ParticleEffect.Trigger>
                      </IMessageComponent.MessageBubble>
                    </ParticleEffect.Item>
                  );
                })}
              </AnimatePresence>
            </IMessageComponent.Container>
          </IMessageComponent>
        </ParticleEffect.Root>
      </div>
    </PageLayout>
  );
}
