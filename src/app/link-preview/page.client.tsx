'use client';

import { FormEvent, useState } from 'react';

import LinkPreview from '../../components/content/link-preview/LinkPreview';
import { getUrlLabel } from '../../components/content/link-preview/utils';
import Toast, {
  useToast,
} from '../../components/content/stacked-toast/ToastContext';
import PageLayout from '../../components/layout/page-layout/PageLayout';
import TextField from '../../components/material/TextField';
import Text from '../../components/material/Text';
const example1 = '/images/link-preview/soso.png';
const example2 = '/images/link-preview/radix-ui.png';
const example3 = '/images/link-preview/arc.png';
const example4 = '/images/link-preview/figma.png';

interface LinkData {
  url: string;
  label: string;
  preview?: string;
}

const initialData: LinkData[] = [
  { url: 'https://so-so.dev', label: 'soyoung', preview: example1 },
  { url: 'https://arc.net/', label: 'arc', preview: example3 },
  { url: 'https://figma.com/', label: 'figma', preview: example4 },
  { url: 'https://radix.com/', label: 'radix', preview: example2 },
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
          <p>gatsby cloud doesn&apos;t support headless chromium.</p>
        </PageLayout.DetailsContent>
      </PageLayout.Details>

      {/* <form onSubmit={handleSubmit}>
        <TextField
          placeholder="so-so.dev"
          leftSlot={<Text color="gray6">https://</Text>}
          value={value}
          onChange={e => setValue(e.target.value.replace('https://', ''))}
        />
      </form> */}
      <div
        style={{
          height: 'calc(100vh - 80px)',
          marginTop: 'min( calc(8vh) , 60px)',
        }}
      >
        <ul
          style={{
            listStyle: 'none',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          {links.map(link => (
            <li
              key={link.label}
              style={{
                lineHeight: '24px',
                color: '#222',
                fontWeight: 600,
              }}
            >
              <LinkPreview
                label={link.label}
                url={link.url}
                preview={link.preview}
              />
            </li>
          ))}
        </ul>
      </div>
    </PageLayout>
  );
}
export default function LinkPreviewClient() {
  return (
    <Toast.Provider limit={10}>
      <PageContent />
    </Toast.Provider>
  );
}
