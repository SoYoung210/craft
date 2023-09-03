import {
  ComponentPropsWithoutRef,
  MediaHTMLAttributes,
  ReactNode,
  useRef,
} from 'react';
import { Key } from 'w3c-keys';
import { Link } from 'gatsby';
import { AnimatePresence, motion } from 'framer-motion';

import { css, keyframes, styled } from '../../../../stitches.config';
import { globalStyles } from '../../../styles/global';
import { entries } from '../../../utils/object';
import { radialGradient } from '../../../utils/style/gradient';
import { THUMBNAILS } from '../../content/switch-tab/constants';
import CardVideo from '../../../images/video/card-demo_2.mp4';
import GlowCursorVideo from '../../../images/video/glow-cursor.mp4';
import PipVideo from '../../../images/video/floating-video.mp4';
import ToastVideo from '../../../images/video/toast.mp4';
import { SwitchTab } from '../../content/switch-tab/SwitchTab';
import { useBooleanState } from '../../../hooks/useBooleanState';
import useHotKey from '../../../hooks/useHotKey';
import useWindowEvent from '../../../hooks/useWindowEvent';
import { If } from '../../utility/If';
import { Squircle } from '../../material/Squircle';
import { HomeIcon } from '../../material/icon/Home';
import { ContentBox } from '../content-box/ContentBox';

import { backgroundColorMap } from './PageLayout.css';

interface Props extends ComponentPropsWithoutRef<typeof Main> {
  children: ReactNode;
  theme?: 'gradient' | 'normal';
}

//https://web.dev/rendering-performance/
// https://stackoverflow.com/questions/35906196/improve-css3-background-position-animations-performance
const backgroundAnimation = keyframes({
  '0%': { transform: 'translateX(-50%) rotate(0deg)' },
  '50%': { transform: 'translateX(-50%) rotate(270deg)' },
  '100%': { transform: 'translateX(-50%) rotate(0deg)' },
});

interface Content {
  linkTo: string;
  title: string;
  imgSrc: string;
  videoSrc?: MediaHTMLAttributes<HTMLVideoElement>['src'];
  imgStyle?: React.CSSProperties;
}

const CONTENTS: Content[] = [
  {
    linkTo: '/',
    title: 'main',
    imgSrc: `data:image/jpeg;base64,${THUMBNAILS.MAIN}`,
    imgStyle: {
      display: 'flex',
      height: '100%',
      justifyContent: 'center',
    },
  },
  {
    linkTo: '/dynamic-card',
    title: 'dynamic-card',
    imgSrc: `data:image/jpeg;base64,${THUMBNAILS.CARD}`,
    videoSrc: CardVideo,
    imgStyle: {
      display: 'flex',
      height: '100%',
      justifyContent: 'center',
    },
  },
  {
    linkTo: '/glow-cursor-list',
    title: 'glow-cursor',
    imgSrc: `data:image/png;base64,${THUMBNAILS.GLOW_CURSOR}`,
    videoSrc: GlowCursorVideo,
    imgStyle: {
      display: 'flex',
      height: '100%',
      justifyContent: 'center',
    },
  },
  {
    linkTo: '/floating-video',
    title: 'floating-video',
    imgSrc: `data:image/png;base64,${THUMBNAILS.VIDEO}`,
    videoSrc: PipVideo,
    imgStyle: {
      display: 'flex',
      height: '100%',
      justifyContent: 'center',
    },
  },
  {
    linkTo: '/stacked-toast',
    title: 'toast',
    imgSrc: `data:image/png;base64,${THUMBNAILS.TOAST}`,
    videoSrc: ToastVideo,
    imgStyle: {
      display: 'flex',
      height: '100%',
      justifyContent: 'center',
    },
  },
];
export default function PageLayout({
  children,
  theme = 'normal',
  ...props
}: Props) {
  globalStyles();
  const [open, setOpen, setClose] = useBooleanState(false);
  const [showHomeIcon, setShowHomeIcon, setHideHomeIcon] =
    useBooleanState(false);

  useHotKey({
    keycode: [Key.Space, Key.Tab],
    callback: setOpen,
  });

  useHotKey({
    keycode: [Key.Esc],
    callback: setClose,
  });

  useWindowEvent('keydown', e => {
    if (e.key === Key.Space) {
      e.preventDefault();
    }
  });

  useWindowEvent('keyup', e => {
    if (e.key === Key.Space) {
      const target = e.target as HTMLElement;
      target.click();
      setClose();
    }
  });

  return (
    <Main {...props} theme={theme}>
      {children}
      <SwitchTab open={open} defaultValue={CONTENTS[2].title}>
        {CONTENTS.map(content => {
          const isHomeContent = content.title === 'main';
          const needHomeIcon = isHomeContent && showHomeIcon;

          return (
            <div key={content.title} style={{ position: 'relative' }}>
              <SwitchTabItem
                value={content.title}
                to={content.linkTo}
                title={content.title}
                videoSrc={content.videoSrc}
                imgSrc={content.imgSrc}
                onFocus={() => {
                  if (isHomeContent) {
                    setShowHomeIcon();
                  }
                }}
                onBlur={() => {
                  if (isHomeContent) {
                    setHideHomeIcon();
                  }
                }}
              />
              <AnimatePresence>
                {needHomeIcon && (
                  <motion.div
                    style={{
                      position: 'absolute',
                      right: '-12%',
                      bottom: '-18%',
                    }}
                    initial={{
                      y: 20,
                      opacity: 0,
                    }}
                    animate={{
                      y: 0,
                      opacity: 1,
                    }}
                    exit={{
                      y: 20,
                      opacity: 0,
                    }}
                    transition={{
                      ease: 'easeOut',
                      duration: 0.6,
                    }}
                  >
                    <motion.div
                      initial={{ y: 0 }}
                      animate={{
                        y: [0, 2.5, 0],
                        opacity: 1,
                      }}
                      transition={{
                        ease: 'easeOut',
                        delay: 0.6,
                        y: {
                          repeat: Infinity,
                          repeatType: 'loop',
                          duration: 1.8,
                        },
                      }}
                    >
                      <HomeSquircleIcon />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </SwitchTab>
    </Main>
  );
}

const HomeSquircleIcon = () => {
  const rotate = '4deg';

  return (
    <div
      style={{ position: 'relative', height: '96px', width: '96px', rotate }}
    >
      <Squircle
        size={78}
        borderType="gradient"
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '10%',
          rotate: rotate,
        }}
        className={css({
          '& > div': {
            backgroundColor: 'transparent',
          },
        })()}
      />
      <Squircle
        size={60}
        style={{
          position: 'absolute',
          rotate: rotate,
          top: '50%',
          left: '50%',
          transform: 'translate(-54%, -48%)',
        }}
      >
        <HomeIcon color="#979797" size={28} style={{ rotate: rotate }} />
      </Squircle>
    </div>
  );
};

interface SwitchTabItemProps {
  videoSrc?: MediaHTMLAttributes<HTMLVideoElement>['src'];
  to: string;
  title: string;
  value: string;
  imgSrc: string;
  onFocus?: () => void;
  onBlur?: () => void;
}
const SwitchTabItem = (props: SwitchTabItemProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { to, title, videoSrc, imgSrc, value, onFocus, onBlur } = props;
  const [active, setActive, setDeActive] = useBooleanState(false);

  return (
    <SwitchTab.Item
      value={value}
      onFocus={() => {
        videoRef.current?.play();
        onFocus?.();
        setActive();
      }}
      onBlur={() => {
        videoRef.current?.pause();
        onBlur?.();
        setDeActive();
      }}
      asChild
    >
      <BlockLink to={to}>
        <SwitchTabContentBox title={title} dots={false} active={active}>
          <img
            src={imgSrc}
            style={{
              display: 'flex',
              height: '100%',
              justifyContent: 'center',
            }}
          />
          <If condition={videoSrc != null}>
            <video
              ref={videoRef}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
              }}
              loop
              src={videoSrc}
            />
          </If>
        </SwitchTabContentBox>
      </BlockLink>
    </SwitchTab.Item>
  );
};

const SwitchTabContentBox = styled(ContentBox, {
  height: '100%',

  $$grayScale: 1,
  filter: 'grayscale($$grayScale)',

  '& div:nth-child(2)': {
    position: 'relative',
  },

  variants: {
    active: {
      true: {
        $$grayScale: 0,
      },
    },
  },
});

const BlockLink = styled(Link, {
  display: 'block',
});

const Main = styled('main', {
  maxWidth: 760,
  padding: 64,
  minHeight: '100vh',

  display: 'flex',
  flexDirection: 'column',
  gap: '32px',

  position: 'relative',
  margin: '0 auto',

  variants: {
    theme: {
      gradient: {
        '&::before': {
          position: 'fixed',
          top: '0',
          left: '50%',
          transform: 'translateX(-50%)',
          content: '',
          width: '60%',
          height: '100%',
          backgroundImage: entries(backgroundColorMap)
            .map(([, { start, end, value }]) => {
              return radialGradient(start, end, [
                `${value} 0`,
                'transparent 50%',
              ]);
            })
            .join(', '),
          backgroundSize: '180%, 200%',
          filter: 'blur(100px) saturate(150%)',
          animation: `${backgroundAnimation} infinite 20s linear`,
          opacity: 0.2,
          zIndex: -1,
        },
      },
      normal: {
        '&::before': {
          display: 'none',
        },
      },
    },
  },
});

const Title = styled('h1', {
  fontSize: 40,
  fontWeight: 700,
  color: '$gray8',
  letterSpacing: '-0.03em',
});

const SubTitle = styled('h2', {
  fontSize: 20,
  fontWeight: 500,
  color: '$gray8',
  letterSpacing: '-0.01em',
  lineHeight: 1.8,
});

const DetailContent = styled('div', {
  padding: 12,
  lineHeight: 1.5,

  transform: 'scale(0.9)',
  opacity: 0,

  transition: 'opacity 0.1s ease, transform 0.1s ease',
});

const Details = styled('details', {
  display: 'flex',
  flexDirection: 'column',

  color: '$gray6',

  '&[open]': {
    [`& ${DetailContent}`]: {
      opacity: 1,
      transform: 'scale(1)',
    },
  },
});

const Summary = styled('summary');

PageLayout.Title = Title;
PageLayout.SubTitle = SubTitle;
PageLayout.Details = Details;
PageLayout.DetailsContent = DetailContent;
PageLayout.Summary = Summary;
