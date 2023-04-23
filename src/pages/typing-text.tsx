import { css } from '../../stitches.config';
import TypingText from '../components/content/type-text/TypingText';
import Figure from '../components/layout/Figure';
import PageLayout from '../components/layout/PageLayout';

export default function TypingTextPage() {
  return (
    <PageLayout>
      <PageLayout.Title>Text Typing Effect (w. Highlight)</PageLayout.Title>
      <PageLayout.Details>
        <PageLayout.Summary>gsap timeline</PageLayout.Summary>
      </PageLayout.Details>
      <Figure
        theme="dark"
        className={css({
          position: 'relative',
          fontSize: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 600,
        })()}
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

export const Head = () => {
  return (
    <link
      href="https://fonts.googleapis.com/css?family=Red+Hat+Display:400,700&display=swap"
      rel="stylesheet"
    />
  );
};
