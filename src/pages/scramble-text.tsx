import ScrambleContent from '../components/content/scramble-text/ScrambleContent';
import PageLayout from '../components/layout/PageLayout';
/**
 * 
 Lorem ipsum dolor sit amet, consectetur adipisicing elit.
 */
export default function ScrambleTextPage() {
  return (
    <PageLayout>
      <PageLayout.Title>Scramble Text</PageLayout.Title>
      <PageLayout.Details>
        <PageLayout.Summary>scrabmle</PageLayout.Summary>
      </PageLayout.Details>
      <ScrambleContent interval={50}>
        <ScrambleContent.Text>Lorem ipsum dolor sit amet,</ScrambleContent.Text>
        <ScrambleContent.Text style={{ marginLeft: 2 }}>
          consectetur adipisicing elit.
        </ScrambleContent.Text>
      </ScrambleContent>
    </PageLayout>
  );
}
