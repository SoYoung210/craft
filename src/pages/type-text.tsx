import { css } from '../../stitches.config';
import TypeText from '../components/content/type-text/TypeText';
import Figure from '../components/layout/Figure';
import PageLayout from '../components/layout/PageLayout';

export default function TypeTextPage() {
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

          // FIXME:
          '& *': {
            // display: 'inline-block',
            overflow: 'hidden',
            // position: 'absolute',
          },
        })()}
      >
        <TypeText>
          github.com
          <span>/soyoung</span>
        </TypeText>
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
