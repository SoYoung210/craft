'use client';

import { GlowCursorList } from '../../components/content/glow-cursor-list/List';
import Figure from '../../components/layout/Figure';
import ArcLogo from '../../images/blurred-logo-asset/arc.svg';
import PageLayout from '../../components/layout/page-layout/PageLayout';
import KeyboardIcon from '../../images/icons/keyboard.svg';
import BoltIcon from '../../images/icons/bolt.svg';
import InputIcon from '../../images/icons/input.svg';
import ClosedEyeIcon from '../../images/icons/closed-eye.svg';
import ChipIcon from '../../images/icons/chip.svg';
import CheckCircleIcon from '../../images/icons/check-circle.svg';

const iconThemeStyles: Record<string, React.CSSProperties> = {
  violet: {
    color: 'hsl(251 48.1% 53.5%)',
    backgroundColor: 'hsl(252 85.1% 93.0%)',
  },
  blue: {
    color: 'hsl(208 100% 47.3%)',
    backgroundColor: 'hsl(209 95.0% 90.1%)',
  },
  cyan: {
    color: 'hsl(191 91.2% 36.8%)',
    backgroundColor: 'hsl(187 58.3% 85.4%)',
  },
  mauve: {
    color: 'hsl(247 3.4% 50.7%)',
    backgroundColor: 'hsl(243 4.9% 18.8%)',
  },
};

function IconRoot({ theme, children }: { theme: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        borderRadius: 999,
        width: 45,
        height: 45,
        padding: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...iconThemeStyles[theme],
      }}
    >
      {children}
    </div>
  );
}

function ItemTitle({ theme, children }: { theme: 'dark' | 'light'; children: React.ReactNode }) {
  return (
    <span
      style={{
        fontWeight: 600,
        fontSize: 21,
        letterSpacing: '0.3px',
        color: theme === 'dark' ? 'rgb(247, 248, 248)' : '#212529',
      }}
    >
      {children}
    </span>
  );
}

function ItemDescription({ theme, children }: { theme: 'dark' | 'light'; children: React.ReactNode }) {
  return (
    <p
      style={{
        marginTop: 6,
        lineHeight: 1.4,
        fontWeight: 500,
        letterSpacing: '0.3px',
        color: theme === 'dark' ? 'rgb(138, 143, 152)' : '#495057',
      }}
    >
      {children}
    </p>
  );
}

export default function GlowCursorListClient() {
  return (
    <PageLayout style={{ maxWidth: 1024, minWidth: 1024 }}>
      <PageLayout.Title>Glow Cursor</PageLayout.Title>
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
              <div style={{ marginTop: 20 }}>
                <ItemTitle theme="dark">Performant</ItemTitle>
                <ItemDescription theme="dark">
                  Stitches avoids unnecessary prop interpolations at runtime,
                  making it more performant than other styling libraries.
                </ItemDescription>
              </div>
            </GlowCursorList.ItemContent>
          </GlowCursorList.Item>
          <GlowCursorList.Item>
            <GlowCursorList.ItemContent>
              <IconRoot theme="mauve">
                <CheckCircleIcon />
              </IconRoot>
              <div style={{ marginTop: 20 }}>
                <ItemTitle theme="dark">Best-in-class DX</ItemTitle>
                <ItemDescription theme="dark">
                  Stitches has a fully-typed API, to minimize the learning
                  curve, and provide the best possible developer experience.
                </ItemDescription>
              </div>
            </GlowCursorList.ItemContent>
          </GlowCursorList.Item>
          <GlowCursorList.Item>
            <GlowCursorList.ItemContent>
              <IconRoot theme="mauve">
                <ChipIcon />
              </IconRoot>
              <div style={{ marginTop: 20 }}>
                <ItemTitle theme="dark">Feature-rich</ItemTitle>
                <ItemDescription theme="dark">
                  Packed full of useful features like theming, smart tokens, css
                  prop, as prop, utils, and a fully-typed API.
                </ItemDescription>
              </div>
            </GlowCursorList.ItemContent>
          </GlowCursorList.Item>
        </GlowCursorList>
      </Figure>
      <Figure theme="light">
        <GlowCursorList>
          <GlowCursorList.Item
            style={{ background: 'rgba(36, 42, 48, 0.08)' }}
            gradientColor={'rgb(27,100,218)'}
          >
            <GlowCursorList.ItemContent style={{ backgroundColor: 'white' }}>
              <IconRoot theme="blue">
                <KeyboardIcon />
              </IconRoot>
              <div style={{ marginTop: 20 }}>
                <ItemTitle theme="light">Keyboard navigation</ItemTitle>
                <ItemDescription theme="light">
                  Primitives provide full keyboard support for components where
                  users expect to use a keyboard or other input devices.
                </ItemDescription>
              </div>
            </GlowCursorList.ItemContent>
          </GlowCursorList.Item>
          <GlowCursorList.Item
            style={{ background: 'rgba(36, 42, 48, 0.08)' }}
            gradientColor={'rgb(103,63,215)'}
          >
            <GlowCursorList.ItemContent style={{ backgroundColor: 'white' }}>
              <IconRoot theme="violet">
                <InputIcon />
              </IconRoot>
              <div style={{ marginTop: 20 }}>
                <ItemTitle theme="light">Focus management</ItemTitle>
                <ItemDescription theme="light">
                  Out of the box, Primitives provide sensible focus management
                  defaults, which can be further customized in your code.
                </ItemDescription>
              </div>
            </GlowCursorList.ItemContent>
          </GlowCursorList.Item>
          <GlowCursorList.Item
            style={{ background: 'rgba(36, 42, 48, 0.08)' }}
            gradientColor={'#00d6ed'}
          >
            <GlowCursorList.ItemContent style={{ backgroundColor: 'white' }}>
              <IconRoot theme="cyan">
                <ClosedEyeIcon />
              </IconRoot>
              <div style={{ marginTop: 20 }}>
                <ItemTitle theme="light">Screen reader tested</ItemTitle>
                <ItemDescription theme="light">
                  We test Primitives with common assistive technologies, looking
                  out for practical issues that people may experience.
                </ItemDescription>
              </div>
            </GlowCursorList.ItemContent>
          </GlowCursorList.Item>
        </GlowCursorList>
      </Figure>
      <Figure theme="light">
        <GlowCursorList>
          <GlowCursorList.Item
            style={{ background: 'rgba(36, 42, 48, 0.08)' }}
            gradientColor={['#FF6378', '#FF9396']}
          >
            <GlowCursorList.ItemContent
              style={{ backgroundColor: 'white', alignItems: 'center' }}
              className="[&>svg]:w-[120px] [&>svg]:h-[120px]"
            >
              <ArcLogo />
            </GlowCursorList.ItemContent>
          </GlowCursorList.Item>
          <GlowCursorList.Item
            style={{ background: 'rgba(36, 42, 48, 0.08)' }}
            gradientColor={['#FF3F42', '#FFE948']}
          >
            <GlowCursorList.ItemContent
              style={{ backgroundColor: 'white', alignItems: 'center' }}
            >
              <img src="/images/blurred-logo-asset/firefox.svg" alt="Firefox logo" width={120} height={120} />
            </GlowCursorList.ItemContent>
          </GlowCursorList.Item>
          <GlowCursorList.Item
            style={{ background: 'rgba(36, 42, 48, 0.08)' }}
            gradientColor={['#006CFF', '#00D3F9']}
          >
            <GlowCursorList.ItemContent
              style={{ backgroundColor: 'white', alignItems: 'center' }}
            >
              <img src="/images/blurred-logo-asset/safari.svg" alt="Safari logo" width={120} height={120} />
            </GlowCursorList.ItemContent>
          </GlowCursorList.Item>
        </GlowCursorList>
      </Figure>
    </PageLayout>
  );
}
