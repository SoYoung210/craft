import ScrambleContent from '../components/content/scramble-text/ScrambleContent';
import Figure from '../components/layout/Figure';
import PageLayout from '../components/layout/PageLayout';

export default function ScrambleTextPage() {
  return (
    <PageLayout>
      <PageLayout.Title>Scramble Text</PageLayout.Title>
      <PageLayout.Details>
        <PageLayout.Summary>scrabmle</PageLayout.Summary>
      </PageLayout.Details>
      <Figure
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '300px',
        }}
      >
        <ScrambleContent
          interval={30}
          style={{ fontSize: 18, fontWeight: 300 }}
        >
          <ScrambleContent.Text>
            Lorem ipsum dolor sit amet,
          </ScrambleContent.Text>
          <ScrambleContent.Text style={{ marginLeft: 2 }}>
            consectetur adipisicing elit.
          </ScrambleContent.Text>
        </ScrambleContent>
      </Figure>
    </PageLayout>
  );
}
