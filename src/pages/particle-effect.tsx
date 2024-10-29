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
    id: '1',
    from: 'them',
    message: `How did you make this particle effect? It looks amazing!`,
  },
  {
    id: '2',
    from: 'me',
    message: `I render a canvas over the whole page, and when you click the ParticleEffect.Trigger—basically the trash can icon—I use html2canvas to render the HTML content as a mesh.`,
  },
  {
    id: '3',
    from: 'me',
    message: 'Then, I applied a shader to create a kind of Thanos snap effect.',
  },
  {
    id: '4',
    from: 'them',
    message: `That sounds so cool 👍`,
  },
  {
    id: '5',
    from: 'me',
    message: `Yeah, there were a lot of trial and error moments... it was my first shader project. But you know, working with Claude AI made it doable. I’m a big fan of Claude.`,
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
                      key={id}
                      id={id}
                      onExitComplete={() => handleExitComplete(id)}
                    >
                      <IMessageComponent.MessageBubble
                        from={from}
                        emoji={emoji}
                        noTail={noTail}
                      >
                        {message}
                        <ParticleEffect.Trigger asChild>
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
