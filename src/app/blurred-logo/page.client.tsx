'use client';

import Image from 'next/image';

import ArcLogo from '../../images/blurred-logo-asset/arc.svg';
import SlackLogo from '../../images/blurred-logo-asset/slack.svg';
import LogoButton from '../../components/content/blurred-logo/LogoButton';
import FigmaLogo from '../../images/blurred-logo-asset/figma.svg';
import GoogleCalendarLogo from '../../images/blurred-logo-asset/google_calendar.svg';
import FirefoxLogo from '../../images/blurred-logo-asset/firefox.svg';
import SafariLogo from '../../images/blurred-logo-asset/safari.svg';
import PageLayout from '../../components/layout/page-layout/PageLayout';

export default function BlurredLogoClient() {
  return (
    <PageLayout style={{ maxWidth: 1024 }}>
      <PageLayout.Title>Blurred Logo</PageLayout.Title>
      <PageLayout.Details>
        <PageLayout.Summary>
          Overlay multiple layers of the logo and apply filters to each layer
        </PageLayout.Summary>
        <PageLayout.DetailsContent>
          <Image
            src="/images/blurred-logo-asset/layer_description.png"
            alt="blurred logo layer description"
            width={322}
            height={200}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              objectFit: 'contain',
            }}
          />
        </PageLayout.DetailsContent>
      </PageLayout.Details>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 60,
        }}
      >
        <LogoButton logo={<FigmaLogo />} />
        <LogoButton logo={<SlackLogo />} />
        <LogoButton logo={<FirefoxLogo />} />
        <LogoButton logo={<SafariLogo />} />
        <LogoButton logo={<GoogleCalendarLogo />} />
        <LogoButton logo={<ArcLogo />} />
      </div>
    </PageLayout>
  );
}
