import React from 'react';
import { StaticImage } from 'gatsby-plugin-image';

import ArcLogo from '../images/blurred-logo-asset/arc.svg';
import SlackLogo from '../images/blurred-logo-asset/slack.svg';
import LogoButton from '../components/pages/blurred-logo/LogoButton';
import FigmaLogo from '../images/blurred-logo-asset/figma.svg';
import GoogleCalendarLogo from '../images/blurred-logo-asset/google_calendar.svg';
import FirefoxLogo from '../images/blurred-logo-asset/firefox.svg';
import SafariLogo from '../images/blurred-logo-asset/safari.svg';
import { styled } from '../../stitches.config';
import PageLayout from '../components/layout/PageLayout';

export default function BlurredLogoPage() {
  return (
    <PageLayout css={{ '&&': { maxWidth: 1024 } }}>
      <PageLayout.Title>Blurred Logo</PageLayout.Title>
      <PageLayout.Details>
        <PageLayout.Summary>
          로고를 여러 레이어로 겹치고, 각 레이어에 필터 적용
        </PageLayout.Summary>
        <PageLayout.DetailsContent>
          <StaticImage
            src="../images/blurred-logo-asset/layer_description.png"
            alt="blurred logo layer description"
            width={322}
            objectFit="contain"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
            }}
          />
        </PageLayout.DetailsContent>
      </PageLayout.Details>
      <Root>
        <LogoButton logo={<FigmaLogo />} />
        <LogoButton logo={<SlackLogo />} />
        <LogoButton logo={<FirefoxLogo />} />
        <LogoButton logo={<SafariLogo />} />
        <LogoButton logo={<GoogleCalendarLogo />} />
        <LogoButton logo={<ArcLogo />} />
      </Root>
    </PageLayout>
  );
}

const Root = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  gap: 60,
});
