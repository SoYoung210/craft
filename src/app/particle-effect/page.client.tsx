'use client';

import { AnimatePresence, motion } from 'motion/react';
import { forwardRef, ReactNode, useState } from 'react';
import '@fontsource/nanum-pen-script/400.css';

import IMessageComponent from '../../components/content/particle-effect/MessageContainer';
import { ParticleEffect } from '../../components/content/particle-effect/UpdatedParticleEffect';
import PageLayout from '../../components/layout/page-layout/PageLayout';
import { TrashIcon } from '../../components/material/icon/TranshIcon';
import Button from '../../components/material/Button';
import { RotateRightIcon } from '../../components/material/icon/RotateRightIcon';
import { If } from '../../components/utility/If';

interface Message {
  id: string;
  from: 'me' | 'them';
  message: ReactNode;
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
    message: `I render a full-page canvas, and when you click the ParticleEffect.Trigger (basically, the trash can icon), I use html2canvas to capture the HTML content as a mesh`,
  },
  {
    id: '3',
    from: 'me',
    message: 'Then, I applied a shader to create a kind of Thanos snap effect',
  },
  {
    id: '4',
    from: 'them',
    message: `🔥`,
    emoji: true,
    noTail: true,
  },
  {
    id: '5',
    from: 'them',
    message: `That sounds so cool. I'd love to hear more about it sometime`,
  },
  {
    id: '6',
    from: 'me',
    message: `Yeah, there was a lot of trial. It was my first shader project`,
  },
  {
    id: '7',
    from: 'them',
    message: 'Can I check out the code for this?',
  },
  {
    id: '8',
    from: 'me',
    message: (
      <>
        Sure!{' '}
        <a
          href="https://github.com/soyoung210/craft"
          target="_blank"
          rel="noreferrer"
          style={{
            color: 'white',
            textDecoration: 'underline',
            textDecorationColor: 'rgba(255, 255, 255, 0.5)',
            textUnderlineOffset: '0.15rem',
          }}
        >
          https://github.com/soyoung210/craft
        </a>
      </>
    ),
  },
];

const HEIGHT = 860;
export default function ParticleEffectClient() {
  const [needHelper, setNeedHelper] = useState(true);

  const [messages, setMessages] = useState(MESSAGES);
  const handleExitComplete = (id: string) => {
    setMessages(prev => prev.filter(message => message.id !== id));
  };
  const fillMessages = () => {
    setMessages(MESSAGES);
  };
  const hasContent = messages.length > 0;

  return (
    <PageLayout>
      <PageLayout.Title>Particle Effect</PageLayout.Title>

      <ParticleEffect.Root>
        <IMessageComponent>
          <IMessageComponent.Container
            style={{
              height: HEIGHT,
            }}
          >
            <div className="hidden [@media(hover:hover)_and_(pointer:fine)]:block">
              <AnimatePresence>
                {hasContent ? (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ease: 'easeIn', duration: 0.3 }}
                  >
                    <AnimatePresence mode="popLayout">
                      {messages.map(
                        ({ id, from, message, emoji, noTail }, index) => {
                          const isFirstElement = index === 0;
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
                                  <IMessageComponent.TapbackBubble
                                    isVisible={isFirstElement}
                                    from={from}
                                    onClick={
                                      isFirstElement
                                        ? () => setNeedHelper(false)
                                        : undefined
                                    }
                                  >
                                    <div style={{ position: 'relative' }}>
                                      <IMessageComponent.TapbackOption>
                                        <TrashIcon size={17} />
                                      </IMessageComponent.TapbackOption>
                                      <If
                                        condition={needHelper && isFirstElement}
                                      >
                                        <HelperArrow />
                                      </If>
                                    </div>
                                  </IMessageComponent.TapbackBubble>
                                </ParticleEffect.Trigger>
                              </IMessageComponent.MessageBubble>
                            </ParticleEffect.Item>
                          );
                        }
                      )}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty-view"
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: HEIGHT,
                      width: '100%',
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      transition: {
                        duration: 0,
                      },
                    }}
                    transition={{ ease: 'easeIn', duration: 0.34 }}
                  >
                    <Button
                      onClick={fillMessages}
                      aria-label="Regenerate Items"
                      style={{
                        position: 'absolute',
                        top: -10,
                        right: -10,
                      }}
                    >
                      <RotateRightIcon size={14} color="#82827c" />
                    </Button>
                    <div className="text-gray-6 text-2xl font-medium">
                      No Messages
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="hidden [@media(hover:none)_and_(pointer:coarse)]:block">
              <IMessageComponent.MessageBubble from="me">
                For the best experience, please visit on a desktop. Mobile
                support is currently unavailable
              </IMessageComponent.MessageBubble>
            </div>
          </IMessageComponent.Container>
        </IMessageComponent>
      </ParticleEffect.Root>
    </PageLayout>
  );
}

const HelperArrow = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div
      ref={ref}
      className="absolute flex flex-col text-xl text-gray-10 min-w-[180px]"
      style={{ transform: 'rotate(10deg)', top: -62, left: 5 }}
    >
      <div className="font-nanum pb-1">Click the trash can icon!</div>
      <div
        style={{
          transform: 'rotate(320deg)',
          transformOrigin: 'left',
          paddingTop: 60,
          paddingLeft: 35,
        }}
      >
        {/* ArrowIcon SVG inline */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 5V19M12 19L5 12M12 19L19 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
});
