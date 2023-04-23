import { FormEvent, useState } from 'react';
import { graphql, PageProps } from 'gatsby';

import { styled } from '../../stitches.config';
import LinkPreview from '../components/content/link-preview/LinkPreview';
import { getUrlLabel } from '../components/content/link-preview/utils';
import Toast, {
  useToast,
} from '../components/content/stacked-toast/ToastContext';
import PageLayout from '../components/layout/PageLayout';
import TextField from '../components/material/TextField';
import Text from '../components/material/Text';
import example1 from '../images/link-preview/soso.png';
import example2 from '../images/link-preview/radix-ui.png';
import example3 from '../images/link-preview/apple.png';
import { VStack } from '../components/material/Stack';
import SEO from '../components/layout/SEO';

interface LinkData {
  url: string;
  label: string;
  preview?: string;
}

const initialData: LinkData[] = [
  { url: 'https://so-so.dev', label: 'so-so', preview: example1 },
  { url: 'https://radix-ui.com', label: 'radix-ui', preview: example2 },
  { url: 'https://apple.com', label: 'apple', preview: example3 },
];
function PageContent() {
  const { error } = useToast();

  const [value, setValue] = useState('');
  const [links, setLinks] = useState(initialData);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const urlLabel = getUrlLabel(value);
    if (urlLabel == null) {
      error(
        <>
          <Toast.Title>올바르지 않은 url</Toast.Title>
          <Toast.Description>
            vercel.com, so-so.dev와 같은 형식으로 입력해주세요.
          </Toast.Description>
        </>
      );
      return;
    }

    if (links.some(link => link.url === value)) {
      error(
        <>
          <Toast.Title>이미 추가된 url</Toast.Title>
          <Toast.Description>이미 추가된 url입니다.</Toast.Description>
        </>
      );
      return;
    }

    setValue('');
    setLinks(prev => [...prev, { url: value, label: urlLabel }]);
  };

  return (
    <PageLayout>
      <PageLayout.Title>Link Preview</PageLayout.Title>
      <PageLayout.Details>
        <PageLayout.Summary>puppeteer + netlify function</PageLayout.Summary>
        <PageLayout.DetailsContent>
          <PageLayout.SubTitle>puppeteer</PageLayout.SubTitle>
          <p>capture screenshot. use puppeteer-core for reduce size.</p>
          <PageLayout.SubTitle>netlify function</PageLayout.SubTitle>
          <p>gatsby cloud doesn't support headless chromium.</p>
        </PageLayout.DetailsContent>
      </PageLayout.Details>

      <form onSubmit={handleSubmit}>
        <TextField
          placeholder="so-so.dev"
          leftSlot={<Text color="gray6">https://</Text>}
          value={value}
          onChange={e => setValue(e.target.value.replace('https://', ''))}
        />
      </form>
      <VStack asChild gap={8}>
        <Ul>
          {links.map(link => (
            <Li key={link.label}>
              <LinkPreview
                label={link.label}
                url={link.url}
                preview={link.preview}
              />
            </Li>
          ))}
        </Ul>
      </VStack>
    </PageLayout>
  );
}
export default function LinkPreviewPage() {
  return (
    <Toast.Provider limit={10}>
      <PageContent />
    </Toast.Provider>
  );
}

const Ul = styled('ul', {
  listStyle: 'none',
});

const Li = styled('li', {
  lineHeight: '24px',

  '&:before': {
    content: '-',
    color: '#999',
    position: 'absolute',
    marginLeft: -16,
  },
});

export const Head = (props: PageProps<Queries.PageDataQuery>) => {
  return (
    <SEO
      title="Link Preview"
      description="preview of the link on hover and focus to maintain attention."
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
      absolutePath: { glob: "**/src/images/thumbnails/link_preview.jpg" }
    ) {
      childImageSharp {
        gatsbyImageData(layout: FIXED, width: 1200)
      }
    }
  }
`;
