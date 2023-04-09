import { FormEvent, useState } from 'react';

import { styled } from '../../stitches.config';
import LinkPreview from '../components/content/link-preview/LinkPreview';
import {
  ensureUrlPrefix,
  getScreenshot,
  getUrlLabel,
} from '../components/content/link-preview/utils';
import Toast, {
  useToast,
} from '../components/content/stacked-toast/ToastContext';
import PageLayout from '../components/layout/PageLayout';
import TextField from '../components/material/TextField';
import Text from '../components/material/Text';
import example1 from '../images/link-preview/soso.png';
import example2 from '../images/link-preview/radix-ui.png';
import example3 from '../images/link-preview/apple.png';
import errorView from '../images/link-preview/error_view.png';
import { VStack } from '../components/material/Stack';

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
    // check if is a valid apex domain

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

    try {
      const preview = await getScreenshot(ensureUrlPrefix(value));
      setLinks(prev =>
        prev.map(link => (link.url === value ? { ...link, preview } : link))
      );
    } catch (e) {
      setLinks(prev =>
        prev.map(link =>
          link.url === value ? { ...link, preview: errorView } : link
        )
      );

      error(
        <>
          <Toast.Title>실패</Toast.Title>
          <Toast.Description>
            사이트 미리보기 이미지를 가져오는데 실패했습니다.
          </Toast.Description>
        </>
      );
      return;
    }
  };

  return (
    <PageLayout>
      <PageLayout.Title>Link Preview</PageLayout.Title>
      <PageLayout.Details>-</PageLayout.Details>

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
