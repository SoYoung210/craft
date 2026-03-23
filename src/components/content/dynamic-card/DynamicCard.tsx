import { useMemo, useState, useCallback, CSSProperties } from 'react';
import { DownloadIcon } from '@radix-ui/react-icons';
import html2Canvas from 'html2canvas';
import { gsap } from 'gsap';

import { keys } from '../../../utils/object';
import { cn } from '../../../utils/cn';
import { colors } from '../../../utils/colors';
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

  const cardStyle: CSSProperties = {
    background: bgColor,
  };

  const svgGradientStyle: CSSProperties = {
    // Gradient stop colors are set via the SVG linearGradient element directly
  };

  const holographicStyle: CSSProperties = {
    maskImage: getBase64Url(ILLUST_DATA_URL[illust], 'svg'),
    width: ILLUST_SIZE[illust],
    height: ILLUST_SIZE[illust],
  };

  return (
    <div className="bg-white backdrop-blur-[10px] flex items-center justify-center flex-col pt-[50px]">
      <style>{`
        .dc-card-hover:hover .dc-holographic {
          visibility: visible;
        }
        .dc-card svg {
          fill: url(#${ILLUST_LINEAR_GRADIENT_ID});
        }
        .dc-card linearGradient > stop:nth-child(1) {
          stop-color: ${ILLUST_LINEAR_GRADIENT_COLOR_SET[gradientColorId][0]};
        }
        .dc-card linearGradient > stop:nth-child(2) {
          stop-color: ${ILLUST_LINEAR_GRADIENT_COLOR_SET[gradientColorId][1]};
        }
        .dc-card linearGradient > stop:nth-child(3) {
          stop-color: ${ILLUST_LINEAR_GRADIENT_COLOR_SET[gradientColorId][2]};
        }
        .dc-card linearGradient > stop:nth-child(4) {
          stop-color: ${ILLUST_LINEAR_GRADIENT_COLOR_SET[gradientColorId][3]};
        }
      `}</style>
      <div
        ref={setRootElement}
        onMouseMove={setTransformVariable}
        onMouseLeave={clearTransformVariable}
        className="dc-card-hover relative p-[50px]"
        style={{ perspective: 800 }}
      >
        <div
          data-role="card-root"
          ref={setCardElement}
          className={cn(
            'dc-card',
            'flex flex-col',
            'shadow-[0px_24px_72px_rgba(36,42,48,0.3),inset_0px_0px_0px_1px_rgba(0,0,0,0.08)]',
            'rounded-2xl w-[320px] h-[490px]',
            'px-6 pt-[34px] pb-6',
            'relative',
            'transition-[transform,box-shadow,background] duration-300 ease-out'
          )}
          style={cardStyle}
        >
          <div
            data-role="illust-root"
            className="flex justify-center items-center pb-2 h-[214px] relative"
          >
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
            <div
              className={cn(
                'dc-holographic effect',
                'invisible z-[2]',
                'absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[calc(-50%-4px)]',
                `${NO_PSEUDO_ELEMENT_CLASS_NAME}:hidden`
              )}
              data-role="holographic"
              style={{
                ...holographicStyle,
                WebkitMaskRepeat: 'no-repeat',
                backgroundImage: `
                  url(https://res.cloudinary.com/simey/image/upload/Dev/PokemonCards/illusion.webp),
                  repeating-linear-gradient( 0deg,
                    rgb(255, 119, 115) calc(5% * 1),
                    rgba(255,237,95,1) calc(5% * 2),
                    rgba(168,255,95,1) calc(5% * 3),
                    rgba(131,255,247,1) calc(5% * 4),
                    rgba(120,148,255,1) calc(5% * 5),
                    rgb(216, 117, 255) calc(5% * 6),
                    rgb(255, 119, 115) calc(5% * 7)
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
                filter:
                  'brightness(calc((var(--hyp)*0.3) + 0.5)) contrast(2) saturate(1.5)',
                opacity: 0.2,
              }}
            />
          </div>
          <div className="flex items-center flex-col text-white pt-[34px]">
            <Text color="white" weight={800} size={26}>
              Soyoung
            </Text>
            <Text
              color="white"
              weight={500}
              size={16}
              style={{ letterSpacing: '0.01em', marginTop: 8 }}
            >
              me@so-so.dev
            </Text>
            <Text
              color="white064"
              weight={500}
              size={12}
              monospace={true}
              style={{ marginTop: 15 }}
            >
              2022. 12. 23
            </Text>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 'auto',
            }}
          >
            <div
              className="rounded-full text-[11px] leading-[13px]"
              style={{
                paddingLeft: 10,
                paddingRight: 10,
                paddingTop: 4,
                paddingBottom: 4,
                background: 'rgba(255, 255, 255, 0.1)',
                border: '0.5px solid rgba(255, 255, 255, 0.3)',
                color: colors.white080,
              }}
            >
              ID No.435
            </div>
          </div>
          <div
            className="absolute w-full h-full left-0 top-0 rounded-2xl"
            style={{ backgroundImage: glowBackgroundImage }}
          />
        </div>
      </div>
      <div className="flex justify-center gap-2">
        <Button
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
                stroke: colors.gold3,
              }}
              ref={setShuffleButtonIcon}
            />
          }
          onClick={generateRandomColor}
          className="font-medium rounded-[46px] before:hidden"
          style={{
            color: colors.gray7,
            paddingLeft: 16,
            paddingRight: 16,
            minHeight: 34,
          }}
        >
          Shuffle Color
        </Button>
        <Button
          color="white"
          size="small"
          aria-label="save card as image"
          className="h-[34px] w-[34px] rounded-full"
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
      </div>
    </div>
  );
}

function downloadFileFromUrl(params: { url: string; name: string }) {
  const { url, name } = params;
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = name;

  anchor.click();
}
