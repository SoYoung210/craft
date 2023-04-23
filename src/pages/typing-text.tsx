import { css } from '../../stitches.config';
import TypingText from '../components/content/type-text/TypingText';
import Figure from '../components/layout/Figure';
import PageLayout from '../components/layout/PageLayout';

export default function TypingTextPage() {
  return (
    <PageLayout>
      <PageLayout.Title>Type Text</PageLayout.Title>
      <PageLayout.Details>-</PageLayout.Details>
      <Figure
        theme="dark"
        className={css({
          position: 'relative',
          fontSize: 40,
          // letterSpacing: '1.5px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 600,

          // FIXME:
          '& *': {
            overflow: 'hidden',
          },
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
      rel="preload"
    />
  );
};
