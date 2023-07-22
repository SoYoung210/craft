import { styled } from '../../stitches.config';
import { GlowCursorList } from '../components/content/glow-cursor-list/List';
import Figure from '../components/layout/Figure';
import ArcLogo from '../images/blurred-logo-asset/arc.svg';
import FirefoxLogo from '../images/blurred-logo-asset/firefox.svg';
import SafariLogo from '../images/blurred-logo-asset/safari.svg';
import PageLayout from '../components/layout/PageLayout';
import KeyboardIcon from '../images/icons/keyboard.svg';
import BoltIcon from '../images/icons/bolt.svg';
import InputIcon from '../images/icons/input.svg';
import ClosedEyeIcon from '../images/icons/closed-eye.svg';
import ChipIcon from '../images/icons/chip.svg';
import CheckCircleIcon from '../images/icons/check-circle.svg';

export default function GlowCursorListPage() {
  return (
    <PageLayout style={{ maxWidth: 1024, minWidth: 1024 }}>
      <PageLayout.Title>Cursor Glow</PageLayout.Title>
      <PageLayout.Details>
        <PageLayout.Summary>
          Inspired: linear features,
          <a
            href="https://codepen.io/jh3y/pen/RwqZNKa"
            target="_blank"
            rel="noreferrer"
          >
            CodePen
          </a>
        </PageLayout.Summary>
      </PageLayout.Details>
      <Figure theme="dark">
        <GlowCursorList>
          <GlowCursorList.Item>
            <GlowCursorList.ItemContent>
              <IconRoot theme="mauve">
                <BoltIcon />
              </IconRoot>
              <TextContentRoot>
                <ItemTitle theme="dark">Performant</ItemTitle>
                <ItemDescription theme="dark">
                  Stitches avoids unnecessary prop interpolations at runtime,
                  making it more performant than other styling libraries.
                </ItemDescription>
              </TextContentRoot>
            </GlowCursorList.ItemContent>
          </GlowCursorList.Item>
          <GlowCursorList.Item>
            <GlowCursorList.ItemContent>
              <IconRoot theme="mauve">
                <CheckCircleIcon />
              </IconRoot>
              <TextContentRoot>
                <ItemTitle theme="dark">Best-in-class DX</ItemTitle>
                <ItemDescription theme="dark">
                  Stitches has a fully-typed API, to minimize the learning
                  curve, and provide the best possible developer experience.
                </ItemDescription>
              </TextContentRoot>
            </GlowCursorList.ItemContent>
          </GlowCursorList.Item>
          <GlowCursorList.Item>
            <GlowCursorList.ItemContent>
              <IconRoot theme="mauve">
                <ChipIcon />
              </IconRoot>
              <TextContentRoot>
                <ItemTitle theme="dark">Feature-rich</ItemTitle>
                <ItemDescription theme="dark">
                  Packed full of useful features like theming, smart tokens, css
                  prop, as prop, utils, and a fully-typed API.
                </ItemDescription>
              </TextContentRoot>
            </GlowCursorList.ItemContent>
          </GlowCursorList.Item>
        </GlowCursorList>
      </Figure>
      <Figure theme="dark">
        <GlowCursorList>
          <GlowCursorList.Item gradientColor={'rgb(27,100,218)'}>
            <GlowCursorList.ItemContent>
              <IconRoot theme="blue">
                <KeyboardIcon />
              </IconRoot>
              <TextContentRoot>
                <ItemTitle theme="dark">Keyboard navigation</ItemTitle>
                <ItemDescription theme="dark">
                  Primitives provide full keyboard support for components where
                  users expect to use a keyboard or other input devices.
                </ItemDescription>
              </TextContentRoot>
            </GlowCursorList.ItemContent>
          </GlowCursorList.Item>
          <GlowCursorList.Item gradientColor={'rgb(103,63,215)'}>
            <GlowCursorList.ItemContent>
              <IconRoot theme="violet">
                <InputIcon />
              </IconRoot>
              <TextContentRoot>
                <ItemTitle theme="dark">Focus management</ItemTitle>
                <ItemDescription theme="dark">
                  Out of the box, Primitives provide sensible focus management
                  defaults, which can be further customized in your code.
                </ItemDescription>
              </TextContentRoot>
            </GlowCursorList.ItemContent>
          </GlowCursorList.Item>
          <GlowCursorList.Item gradientColor={'#00d6ed'}>
            <GlowCursorList.ItemContent>
              <IconRoot theme="cyan">
                <ClosedEyeIcon />
              </IconRoot>
              <TextContentRoot>
                <ItemTitle theme="dark">Screen reader tested</ItemTitle>
                <ItemDescription theme="dark">
                  We test Primitives with common assistive technologies, looking
                  out for practical issues that people may experience.
                </ItemDescription>
              </TextContentRoot>
            </GlowCursorList.ItemContent>
          </GlowCursorList.Item>
        </GlowCursorList>
      </Figure>
      <Figure theme="light">
        <GlowCursorList>
          <LogoItem gradientColor={['#FF6378', '#FF9396']}>
            <LogoItemContent>
              <ArcLogo />
            </LogoItemContent>
          </LogoItem>
          <LogoItem gradientColor={['#FF3F42', '#FFE948']}>
            <LogoItemContent>
              <FirefoxLogo />
            </LogoItemContent>
          </LogoItem>
          <LogoItem gradientColor={['#006CFF', '#00D3F9']}>
            <LogoItemContent>
              <SafariLogo />
            </LogoItemContent>
          </LogoItem>
        </GlowCursorList>
      </Figure>
    </PageLayout>
  );
}

const LogoItem = styled(GlowCursorList.Item, {
  background: 'rgba(36, 42, 48, 0.08)',
});

const LogoItemContent = styled(GlowCursorList.ItemContent, {
  backgroundColor: 'white',
  alignItems: 'center',

  '& > svg': {
    width: 120,
    height: 120,
  },
});

const IconRoot = styled('div', {
  borderRadius: '999px',
  width: 45,
  height: 45,
  padding: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  variants: {
    theme: {
      violet: {
        color: 'hsl(251 63.2% 63.2%)',
        backgroundColor: 'hsl(252 42.2% 26.2%)',
      },
      blue: {
        color: 'hsl(209 100% 60.6%)',
        backgroundColor: 'hsl(213 71.2% 20.2%)',
      },
      cyan: {
        color: 'hsl(188 100% 40.0%)',
        backgroundColor: 'hsl(192 82.5% 14.6%)',
      },
      mauve: {
        color: 'hsl(247 3.4% 50.7%)',
        backgroundColor: 'hsl(243 4.9% 18.8%)',
      },
    },
  },
});

const TextContentRoot = styled('div', {
  marginTop: 20,
});

const ItemTitle = styled('span', {
  fontWeight: 600,
  fontSize: '21px',
  letterSpacing: '0.3px',

  variants: {
    theme: {
      dark: {
        color: 'rgb(247, 248, 248)',
      },
      light: {
        color: '$gray9',
      },
    },
  },
});
// bg: violet5, color: violet10
const ItemDescription = styled('p', {
  marginTop: 6,
  lineHeight: 1.4,
  fontWeight: 500,
  letterSpacing: '0.3px',

  variants: {
    theme: {
      dark: {
        color: 'rgb(138, 143, 152)',
      },
      light: {
        color: '$gray7',
      },
    },
  },
});
