import { AnimatePresence, motion } from 'framer-motion';
import {
  forwardRef,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { graphql, PageProps } from 'gatsby';

import IMessageComponent from '../components/content/particle-effect/MessageContainer';
import { ParticleEffect } from '../components/content/particle-effect/UpdatedParticleEffect';
import ArrowIcon from '../images/icons/script-arrow.svg';
import PageLayout from '../components/layout/page-layout/PageLayout';
import { TrashIcon } from '../components/material/icon/TranshIcon';
import Button from '../components/material/Button';
import { styled } from '../../stitches.config';
import { RotateRightIcon } from '../components/material/icon/RotateRightIcon';
import useWindowEvent from '../hooks/useWindowEvent';
import { If } from '../components/utility/If';
import SEO from '../components/layout/SEO';

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
    message: `That sounds so cool. I’d love to hear more about it sometime`,
  },
  {
    id: '6',
    from: 'me',
    message: `Yeah, there was a lot of trial. It was my first shader project. But working with Claude AI made it doable`,
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
export default function ParticleEffectPage() {
  const [firstBubbleEl, setFirstBubbleEl] = useState<HTMLElement | null>(null);
  const [needHelper, setNeedHelper] = useState(true);
  const helperRef = useRef<HTMLDivElement>(null);
  const setHelperPosition = useCallback(() => {
    if (firstBubbleEl == null || helperRef.current == null) {
      return;
    }

    const { top, left } = firstBubbleEl.getBoundingClientRect();

    helperRef.current.style.opacity = '1';
    helperRef.current.style.top = `${top - 54}px`;
    helperRef.current.style.left = `${left + 37.5}px`;
  }, [firstBubbleEl]);
  useWindowEvent('resize', setHelperPosition);
  useEffect(() => {
    setHelperPosition();
  }, [setHelperPosition]);

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
      <If condition={needHelper}>
        <HelperArrow ref={helperRef} />
      </If>
      <ParticleEffect.Root>
        <IMessageComponent>
          <IMessageComponent.Container
            style={{
              height: HEIGHT,
            }}
          >
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
                                  ref={
                                    isFirstElement
                                      ? setFirstBubbleEl
                                      : undefined
                                  }
                                  isVisible={isFirstElement}
                                  from={from}
                                  onClick={
                                    isFirstElement
                                      ? () => setNeedHelper(false)
                                      : undefined
                                  }
                                >
                                  <IMessageComponent.TapbackOption>
                                    <TrashIcon size={17} />
                                  </IMessageComponent.TapbackOption>
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
                  <StyledText>No Messages</StyledText>
                </motion.div>
              )}
            </AnimatePresence>
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
      style={{ position: 'fixed', opacity: 0, transform: 'rotate(10deg)' }}
    >
      <div
        style={{
          fontFamily: '"Nanum Pen Script"',
          paddingBottom: 4,
          transform: 'scale(1.45)',
        }}
      >
        Click the trash can icon!
      </div>
      <div
        style={{
          transform: 'rotate(320deg)',
        }}
      >
        <ArrowIcon />
      </div>
    </div>
  );
});

const StyledText = styled('div', {
  color: '$gray6',
  fontSize: 24,
  fontWeight: 500,
});

export const Head = (props: PageProps<Queries.PageDataQuery>) => {
  return (
    <SEO
      title="Particle Effect"
      description="October 2024"
      thumbnailSrc={
        props.data.pageFeatured?.childImageSharp?.gatsbyImageData.images
          .fallback?.src
      }
    />
  );
};

export const query = graphql`
  query PageData {
    pageFeatured: file(
      absolutePath: { glob: "**/src/images/thumbnails/particle-effect.webp" }
    ) {
      childImageSharp {
        gatsbyImageData(layout: FIXED, width: 900)
      }
    }
  }
`;
