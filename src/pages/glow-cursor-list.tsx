import { GlowCursorList } from '../components/content/glow-cursor-list/List';
import Figure from '../components/layout/Figure';
import PageLayout from '../components/layout/PageLayout';

export default function GlowCursorListPage() {
  return (
    <PageLayout>
      <PageLayout.Title>Background Spotlight</PageLayout.Title>
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
              <span>1</span>
            </GlowCursorList.ItemContent>
          </GlowCursorList.Item>
          <GlowCursorList.Item>
            <GlowCursorList.ItemContent>
              <span>2</span>
            </GlowCursorList.ItemContent>
          </GlowCursorList.Item>
          <GlowCursorList.Item>
            <GlowCursorList.ItemContent>
              <span>3</span>
            </GlowCursorList.ItemContent>
          </GlowCursorList.Item>
        </GlowCursorList>
      </Figure>
    </PageLayout>
  );
}
