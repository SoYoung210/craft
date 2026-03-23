'use client';

import TypingText from '../../components/content/type-text/TypingText';
import Figure from '../../components/layout/Figure';
import PageLayout from '../../components/layout/page-layout/PageLayout';

export default function TypingTextClient() {
  return (
    <PageLayout>
      <PageLayout.Title>Text Typing Effect (w. Highlight)</PageLayout.Title>
      <PageLayout.Details>
        <PageLayout.Summary>gsap timeline</PageLayout.Summary>
      </PageLayout.Details>
      <Figure
        theme="dark"
        className="relative text-[40px] flex items-center justify-center min-h-[600px]"
      >
        <TypingText
          highlightColor="#8490FF"
          style={{
            marginLeft: '6%',
          }}
        >
          youtube.com
          <TypingText.Highlight>/@feconfkorea</TypingText.Highlight>
        </TypingText>
      </Figure>
    </PageLayout>
  );
}
