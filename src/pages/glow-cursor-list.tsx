import { graphql, PageProps } from 'gatsby';

import { styled } from '../../stitches.config';
import { GlowCursorList } from '../components/content/glow-cursor-list/List';
import Figure from '../components/layout/Figure';
import ArcLogo from '../images/blurred-logo-asset/arc.svg';
import FirefoxLogo from '../images/blurred-logo-asset/firefox.svg';
import SafariLogo from '../images/blurred-logo-asset/safari.svg';
import PageLayout from '../components/layout/page-layout/PageLayout';
import KeyboardIcon from '../images/icons/keyboard.svg';
import BoltIcon from '../images/icons/bolt.svg';
import InputIcon from '../images/icons/input.svg';
import ClosedEyeIcon from '../images/icons/closed-eye.svg';
import ChipIcon from '../images/icons/chip.svg';
import CheckCircleIcon from '../images/icons/check-circle.svg';
import SEO from '../components/layout/SEO';

export default function GlowCursorListPage() {
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
      <Figure theme="light">
        <GlowCursorList>
          <GlowItem theme="light" gradientColor={'rgb(27,100,218)'}>
            <GlowCursorList.ItemContent style={{ backgroundColor: 'white' }}>
              <IconRoot theme="blue">
                <KeyboardIcon />
              </IconRoot>
              <TextContentRoot>
                <ItemTitle theme="light">Keyboard navigation</ItemTitle>
                <ItemDescription theme="light">
                  Primitives provide full keyboard support for components where
                  users expect to use a keyboard or other input devices.
                </ItemDescription>
              </TextContentRoot>
            </GlowCursorList.ItemContent>
          </GlowItem>
          <GlowItem theme="light" gradientColor={'rgb(103,63,215)'}>
            <GlowCursorList.ItemContent style={{ backgroundColor: 'white' }}>
              <IconRoot theme="violet">
                <InputIcon />
              </IconRoot>
              <TextContentRoot>
                <ItemTitle theme="light">Focus management</ItemTitle>
                <ItemDescription theme="light">
                  Out of the box, Primitives provide sensible focus management
                  defaults, which can be further customized in your code.
                </ItemDescription>
              </TextContentRoot>
            </GlowCursorList.ItemContent>
          </GlowItem>
          <GlowItem theme="light" gradientColor={'#00d6ed'}>
            <GlowCursorList.ItemContent style={{ backgroundColor: 'white' }}>
              <IconRoot theme="cyan">
                <ClosedEyeIcon />
              </IconRoot>
              <TextContentRoot>
                <ItemTitle theme="light">Screen reader tested</ItemTitle>
                <ItemDescription theme="light">
                  We test Primitives with common assistive technologies, looking
                  out for practical issues that people may experience.
                </ItemDescription>
              </TextContentRoot>
            </GlowCursorList.ItemContent>
          </GlowItem>
        </GlowCursorList>
      </Figure>
      <Figure theme="light">
        <GlowCursorList>
          <GlowItem theme="light" gradientColor={['#FF6378', '#FF9396']}>
            <LogoItemContent>
              <ArcLogo />
            </LogoItemContent>
          </GlowItem>
          <GlowItem theme="light" gradientColor={['#FF3F42', '#FFE948']}>
            <LogoItemContent>
              <FirefoxLogo />
            </LogoItemContent>
          </GlowItem>
          <GlowItem theme="light" gradientColor={['#006CFF', '#00D3F9']}>
            <LogoItemContent>
              <SafariLogo />
            </LogoItemContent>
          </GlowItem>
        </GlowCursorList>
      </Figure>
    </PageLayout>
  );
}

const GlowItem = styled(GlowCursorList.Item, {
  variants: {
    theme: {
      dark: {
        background: 'rgba(255, 255, 255, 0.12)',
      },
      light: {
        background: 'rgba(36, 42, 48, 0.08)',
      },
    },
  },
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

export const Head = (props: PageProps<Queries.PageDataQuery>) => {
  return (
    <SEO
      title="Glow Cursor"
      description="linear-features style glow cursor list"
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
      absolutePath: { glob: "**/src/images/thumbnails/glow-cursor.jpg" }
    ) {
      childImageSharp {
        gatsbyImageData(layout: FIXED, width: 900)
      }
    }
  }
`;
