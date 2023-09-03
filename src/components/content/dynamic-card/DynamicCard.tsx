import { useMemo, useState, useCallback } from 'react';
import { DownloadIcon } from '@radix-ui/react-icons';
import html2Canvas from 'html2canvas';
import { gsap } from 'gsap';

import { keys } from '../../../utils/object';
import { styled, theme } from '../../../../stitches.config';
import Text from '../../material/Text';
import Button from '../../material/Button';
import { BoltIcon } from '../../material/icon/Bolt';
import { getBase64Url } from '../../../utils/css';

import IconSample from './IconSample';
import {
  CARD_COLORS,
  ILLUST_DATA_URL,
  ILLUST_LINEAR_GRADIENT_ID,
  ILLUST_SET,
  ILLUST_LINEAR_GRADIENT_COLOR_SET,
  NO_PSEUDO_ELEMENT_CLASS_NAME,
  EFFECT_CLASS_NAME,
  ILLUST_SIZE,
} from './constants';
import useShuffleResource from './hooks/useShuffleResource';

export default function DynamicCard() {
  const [shuffleButtonIcon, setShuffleButtonIcon] = useState<SVGElement | null>(
    null
  );
  const q = gsap.utils.selector(shuffleButtonIcon);

  const [rootElement, setRootElement] = useState<HTMLDivElement | null>(null);
  const [cardElement, setCardElement] = useState<HTMLDivElement | null>(null);

  const [illust, shuffleIllust] = useShuffleResource(ILLUST_SET);
  const [gradientColorId, shuffleGradientColorId] = useShuffleResource(
    keys(ILLUST_LINEAR_GRADIENT_COLOR_SET)
  );
  const [bgColor, shuffleBgColor] = useShuffleResource(CARD_COLORS);

  const generateRandomColor = useCallback(() => {
    if (cardElement != null) {
      gsap
        .timeline()
        .to(cardElement, {
          scale: 1.05,
          duration: 0.15,
          rotate: '1.4deg',
        })
        .to(cardElement, {
          scale: 1,
          rotate: '0deg',
        });
    }

    shuffleBgColor();
    shuffleGradientColorId();
    shuffleIllust();
  }, [cardElement, shuffleBgColor, shuffleGradientColorId, shuffleIllust]);

  const handleHologram: React.MouseEventHandler<HTMLDivElement> = useCallback(
    e => {
      const [left, top] = [e.clientX, e.clientY];

      const degreeX = 90 - (left * 90) / (document.body.clientWidth / 2);
      const degreeY = -90 + (top * 90) / (document.body.clientHeight / 4);

      const target = e.currentTarget;

      target.style.setProperty('--mx', `${40 - degreeY * 5}%`);
      target.style.setProperty('--my', `${5 + degreeX}%`);
      target.style.setProperty('--pos', `${degreeX * 5}% ${degreeY}%`);

      target.style.setProperty('--posx', `${50 + degreeX / 10 + degreeY}%`);
      target.style.setProperty(
        '--posy',
        `${50 + degreeY / 10 + degreeX / 10}%`
      );
      target.style.setProperty(
        '--hyp',
        Math.min(
          Math.max(
            Math.sqrt((left - 50) * (left - 50) + (top - 50) * (top - 50)) / 50,
            0
          ),
          1
        ).toString()
      );
    },
    []
  );

  const setTransformVariable: React.MouseEventHandler<HTMLDivElement> =
    useCallback(
      e => {
        if (cardElement != null) {
          const bounds = cardElement.getBoundingClientRect();

          const mouseX = e.clientX;
          const mouseY = e.clientY;
          const leftX = mouseX - bounds.x;
          const topY = mouseY - bounds.y;

          const cardX = leftX - bounds.width / 2;
          const cardY = topY - bounds.height / 2;

          const cardRotateX = cardY / 100;
          const cardRotateY = (-1 * cardX) / 100;

          cardElement.style.setProperty('--ctX', `${cardX}px`);
          cardElement.style.setProperty('--ctY', `${cardY}px`);

          gsap.to(cardElement, {
            scale: 1.07,
            rotateX: cardRotateX * 5,
            rotateY: cardRotateY * 5,
          });

          handleHologram(e);
        }
      },
      [cardElement, handleHologram]
    );

  const clearTransformVariable = useCallback(() => {
    if (cardElement != null) {
      cardElement.style.setProperty('--ctX', '0px');
      cardElement.style.setProperty('--ctY', '0px');

      gsap.to(cardElement, {
        scale: 1,

        rotateX: 0,
        rotateY: 0,
      });
    }
  }, [cardElement]);

  const glowBackgroundImage = useMemo(() => {
    if (cardElement == null) {
      return;
    }
    const bounds = cardElement.getBoundingClientRect();
    const circleGradientX = `calc(calc(var(--ctX) * 2) + ${
      bounds.width / 2
    }px)`;
    const circleGradientY = `calc(calc(var(--ctY) * 2) + ${
      bounds.height / 2
    }px)`;

    return `radial-gradient(circle at ${circleGradientX} ${circleGradientY}, #ffffff30, #0000000f)`;
  }, [cardElement]);

  const onRandomButtonEnter = useCallback(() => {
    if (shuffleButtonIcon != null) {
      gsap.to(q('linearGradient stop'), {
        attr: { offset: '0%' },
        duration: 0.5,
      });
    }
  }, [q, shuffleButtonIcon]);

  const onRandomButtonLeave = useCallback(() => {
    if (shuffleButtonIcon != null) {
      gsap.to(q('linearGradient stop'), {
        attr: { offset: '100%' },
        duration: 0.5,
      });
    }
  }, [q, shuffleButtonIcon]);

  return (
    <Root>
      <CardContentRoot
        ref={setRootElement}
        onMouseMove={setTransformVariable}
        onMouseLeave={clearTransformVariable}
        css={{
          '&:hover': {
            [`${Holographic}`]: {
              visibility: 'visible',
            },
          },
        }}
      >
        <Card
          data-role="card-root"
          ref={setCardElement}
          css={{
            background: bgColor,
            '& svg': {
              fill: `url(#${ILLUST_LINEAR_GRADIENT_ID})`,

              '& linearGradient > stop:nth-child(1)': {
                stopColor: ILLUST_LINEAR_GRADIENT_COLOR_SET[gradientColorId][0],
              },
              '& linearGradient > stop:nth-child(2)': {
                stopColor: ILLUST_LINEAR_GRADIENT_COLOR_SET[gradientColorId][1],
              },
              '& linearGradient > stop:nth-child(3)': {
                stopColor: ILLUST_LINEAR_GRADIENT_COLOR_SET[gradientColorId][2],
              },
              '& linearGradient > stop:nth-child(4)': {
                stopColor: ILLUST_LINEAR_GRADIENT_COLOR_SET[gradientColorId][3],
              },
            },
          }}
        >
          <IllustRoot data-role="illust-root">
            <IconSample type={illust}>
              <defs>
                <linearGradient
                  id={ILLUST_LINEAR_GRADIENT_ID}
                  x1="44"
                  y1="23"
                  x2="147.5"
                  y2="208"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#C1263D" />
                  <stop offset="25%" stopColor="#C1263D" />
                  <stop offset="50%" stopColor="#9926C1" />
                  <stop offset="75%" stopColor="#9926C1" />
                </linearGradient>
              </defs>
            </IconSample>
            <Holographic
              className="effect"
              data-role="holographic"
              css={{
                maskImage: getBase64Url(ILLUST_DATA_URL[illust], 'svg'),
                width: ILLUST_SIZE[illust],
                height: ILLUST_SIZE[illust],
              }}
            />
          </IllustRoot>
          <PersonalContent>
            <Text color="white" weight={800} size={26}>
              이소영
            </Text>
            <Text
              color="white"
              weight={500}
              size={16}
              style={{ letterSpacing: '0.01em', marginTop: 8 }}
            >
              ethdud1@gmail.com
            </Text>
            <Text
              color="white064"
              weight={500}
              size={12}
              monospace={true}
              style={{ marginTop: 15 }}
            >
              2022년 12월 23일
            </Text>
          </PersonalContent>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 'auto',
            }}
          >
            <IdFrame>ID No.435</IdFrame>
          </div>
          <Glow css={{ backgroundImage: glowBackgroundImage }} />
        </Card>
      </CardContentRoot>
      <ControlRoot>
        <RandomButton
          color="white"
          size="small"
          onMouseEnter={onRandomButtonEnter}
          onMouseLeave={onRandomButtonLeave}
          leftSlot={
            <BoltIcon
              color="gold3"
              animate={true}
              type="fill"
              size={18}
              style={{
                stroke: theme.colors.gold3.value,
              }}
              ref={setShuffleButtonIcon}
            />
          }
          onClick={generateRandomColor}
        >
          Shuffle Color
        </RandomButton>
        <Button
          color="white"
          size="small"
          aria-label="save card as image"
          css={{ height: 34, width: 34, borderRadius: '50%' }}
          onClick={() => {
            const root = document.createElement('div');

            root.setAttribute(
              'style',
              'padding: 50px; position: absolute; top: 0; left: 0;'
            );

            if (cardElement != null && rootElement != null) {
              const clonedNode = cardElement.cloneNode(true) as HTMLElement;
              clonedNode.style.boxShadow = 'none';

              clonedNode
                .querySelectorAll(`.${EFFECT_CLASS_NAME}`)
                .forEach(effectElement => {
                  effectElement.classList.add(NO_PSEUDO_ELEMENT_CLASS_NAME);
                });

              root.appendChild(clonedNode);

              rootElement.appendChild(root);

              html2Canvas(root, {
                backgroundColor: '#01155E',
                width: 410,
              }).then(canvas => {
                const dataUrl = canvas.toDataURL('image/png');
                downloadFileFromUrl({
                  url: dataUrl,
                  name: 'random-card.png',
                });

                rootElement.removeChild(root);
              });
            }
          }}
        >
          <DownloadIcon />
        </Button>
      </ControlRoot>
    </Root>
  );
}

const Root = styled('div', {
  backgroundColor: '$white',
  backdropFilter: 'blur(10px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',

  paddingTop: 50,
});

const IllustRoot = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingBottom: 8,

  height: 214,

  position: 'relative',
});

const Holographic = styled('div', {
  visibility: 'hidden',

  $$space: '5%',

  zIndex: 2,
  backgroundImage: `
      url(https://res.cloudinary.com/simey/image/upload/Dev/PokemonCards/illusion.webp),
      repeating-linear-gradient( 0deg,
        rgb(255, 119, 115) calc($$space * 1),
        rgba(255,237,95,1) calc($$space * 2),
        rgba(168,255,95,1) calc($$space * 3),
        rgba(131,255,247,1) calc($$space * 4),
        rgba(120,148,255,1) calc($$space * 5),
        rgb(216, 117, 255) calc($$space * 6),
        rgb(255, 119, 115) calc($$space * 7)
      ),
      repeating-linear-gradient(
        133deg,
        #0e152e 0%,
        hsl(180, 10%, 60%) 3.8%,
        hsl(180, 29%, 66%) 4.5%,
        hsl(180, 10%, 60%) 5.2%,
        #0e152e 10% ,
        #0e152e 12%
        ),
      radial-gradient(
        farthest-corner circle
        at var(--mx) var(--my),
        rgba(0, 0, 0, .1) 12%,
        rgba(0, 0, 0, .15) 20%,
        rgba(0, 0, 0, .25) 120%
      )
    `,

  backgroundPosition:
    'center center, 0% var(--posy), var(--posx) var(--posy), var(--posx) var(--posy)',
  backgroundSize: '50% 42%, 200% 700%, 300% 100%, 200% 100%',
  backgroundBlendMode: 'screen, difference, normal',
  filter: 'brightness(calc((var(--hyp)*0.3) + 0.5)) contrast(2) saturate(1.5)',
  opacity: 0.2,

  '-webkit-mask-repeat': 'no-repeat',

  content: '',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, calc(-50% - 4px))',

  [`&.${NO_PSEUDO_ELEMENT_CLASS_NAME}`]: {
    display: 'none',
  },
});

const CardContentRoot = styled('div', {
  position: 'relative',

  perspective: 800,
  padding: 50,
});

const Card = styled('div', {
  display: 'flex',
  flexDirection: 'column',

  // canvas rendering시 이슈 발생
  boxShadow:
    '0px 24px 72px rgba(36, 42, 48, 0.3), inset 0px 0px 0px 1px rgba(0, 0, 0, 0.08)',
  borderRadius: 16,
  width: 320,
  height: 490,

  px: 24,
  paddingTop: 34,
  paddingBottom: 24,

  // glow relative
  position: 'relative',

  transitionDuration: '0.3s',
  transitionProperty: 'transform, box-shadow, background',
  transitionTimingFunction: 'ease-out',
});

const PersonalContent = styled('div', {
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',

  color: '$white',
  paddingTop: 34,
});

const Glow = styled('div', {
  position: 'absolute',
  width: '100%',
  height: '100%',
  left: 0,
  top: 0,

  backgroundImage: 'radial-gradient(circle at 50% -20%, #ffffff22, #0000000f)',
  // card radius
  borderRadius: 16,
});

const ControlRoot = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  gap: 8,
});

const RandomButton = styled(Button, {
  color: '$gray7',
  fontWeight: 500,

  px: 16,
  minHeight: 34,
  borderRadius: 46,

  '&::before': {
    display: 'none',
  },
});

const IdFrame = styled('div', {
  px: 10,
  py: 4,

  background: 'rgba(255, 255, 255, 0.1)',
  border: '0.5px solid rgba(255, 255, 255, 0.3)',
  borderRadius: '100px',
  color: '$white080',
  fontSize: 11,
  lineHeight: '13px',
});

function downloadFileFromUrl(params: { url: string; name: string }) {
  const { url, name } = params;
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = name;

  anchor.click();
}
