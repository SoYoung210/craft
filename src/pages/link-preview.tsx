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

interface LinkData {
  url: string;
  label: string;
  preview?: string;
}
function PageContent() {
  const { error } = useToast();

  const [value, setValue] = useState('');
  const [links, setLinks] = useState<LinkData[]>([]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // check if is a valid apex domain

    const urlLabel = getUrlLabel(value);
    if (urlLabel == null) {
      error('올바르지 않은 url이에요.');
      return;
    }

    try {
      setValue('');
      setLinks(prev => [...prev, { url: value, label: urlLabel }]);
      const preview = await getScreenshot(ensureUrlPrefix(value));
      setLinks(prev =>
        prev.map(link => (link.url === value ? { ...link, preview } : link))
      );
    } catch {
      error('링크 미리보기 가져오기에 실패했어요.');
      return;
    }
  };

  return (
    <PageLayout>
      <PageLayout.Title>Link Preview</PageLayout.Title>
      <PageLayout.Details>-</PageLayout.Details>

      <form onSubmit={handleSubmit}>
        <TextField
          leftSlot={<Text color="gray6">https://</Text>}
          value={value}
          onChange={e => setValue(e.target.value.replace('https://', ''))}
        />
      </form>
      <Ul>
        {links &&
          links.map(link => (
            <Li key={link.label}>
              <LinkPreview
                label={link.label}
                url={link.url}
                preview={link.preview}
              />
            </Li>
          ))}
      </Ul>
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
  '&:before': {
    content: '-',
    color: '#999',
    position: 'absolute',
    marginLeft: -16,
  },
});