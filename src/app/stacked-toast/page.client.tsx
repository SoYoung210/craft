'use client';

import { useRef } from 'react';

import Toast, {
  useToast,
} from '../../components/content/stacked-toast/ToastContext';
import PageLayout from '../../components/layout/page-layout/PageLayout';
import Button from '../../components/material/Button';

function PageContent() {
  const { message, error, warning, success } = useToast();
  const count = useRef(1);
  const method = [message, error, warning, success];

  return (
    <div
      style={{
        borderRadius: 8,
        background: 'linear-gradient(330deg, #91EAE4 0%, #7F7FD5 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 240,
      }}
    >
      <Button
        onClick={() => {
          method[count.current % method.length](
            <>
              <Toast.Title> message {count.current}</Toast.Title>
              <Toast.Description asChild>
                <p>
                  OneSignal announces 500% growth, delivering 2 trillion
                  messages annually...
                </p>
              </Toast.Description>
            </>,
            { autoClose: 5000 }
          );
          count.current = count.current + 1;
        }}
        style={{ fontWeight: 500 }}
      >
        Add Toast (5s)
      </Button>

      <Button
        onClick={() => {
          method[count.current % method.length](
            <>
              <Toast.Title> message {count.current}</Toast.Title>
              <Toast.Description asChild>
                <p>
                  [Preserve] OneSignal announces 500% growth, delivering 2
                  trillion messages annually...
                </p>
              </Toast.Description>
            </>,
            { autoClose: false }
          );
          count.current = count.current + 1;
        }}
        style={{ fontWeight: 500, marginLeft: 40 }}
      >
        Add Preserve Toast
      </Button>
    </div>
  );
}
export default function StackedToastClient() {
  return (
    <PageLayout>
      <PageLayout.Title>Stacked Toast</PageLayout.Title>
      <PageLayout.Details>
        <PageLayout.Summary>framer-motion</PageLayout.Summary>
        <PageLayout.DetailsContent>
          <PageLayout.SubTitle>Stacked View</PageLayout.SubTitle>
          <p>
            As each additional piece of toast is added, it is stacked downward
            by adjusting the scale, y, and opacity of the previous item. When
            folded, it only shows a maximum of three, but when unfolded, it
            shows all of them.
          </p>
          <PageLayout.SubTitle style={{ marginTop: 12 }}>
            Hover Action
          </PageLayout.SubTitle>
          <p>
            Hovering over the toast item list area expands the entire toast, and
            it remains expanded even when hovering between items. Hovering over
            the toast item list area expands the entire toast, and it remains
            expanded even when hovering between items. This is because the
            height of the &apos;ol&apos;, the parent component of the toast items, is set
            based on the number of toast items and their spacing.
          </p>
          <PageLayout.SubTitle style={{ marginTop: 12 }}>
            Swipe
          </PageLayout.SubTitle>
          <p>
            Use the drag gesture of framer-motion. Set dragConstraints to{' '}
            <code
              style={{
                borderRadius: 6,
                fontFamily: 'monospace',
                display: 'inline-block',
                height: 24,
                paddingLeft: 5,
                paddingRight: 5,
                backgroundColor: 'hsl(0, 0%, 95.1%)',
                border: '1px solid hsl(0, 0%, 90.9%)',
              }}
            >
              {'{ left: 0, right: 300} '}
            </code>
            and dragElastic to{' '}
            <code
              style={{
                borderRadius: 6,
                fontFamily: 'monospace',
                display: 'inline-block',
                height: 24,
                paddingLeft: 5,
                paddingRight: 5,
                backgroundColor: 'hsl(0, 0%, 95.1%)',
                border: '1px solid hsl(0, 0%, 90.9%)',
              }}
            >
              {'{ right: 1} '}
            </code>{' '}
            to allow only
            swipes in the right direction. In the onDragEnd handler, remove the
            toast if the offset is greater than 50.
          </p>
        </PageLayout.DetailsContent>
      </PageLayout.Details>
      <section>
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/** @ts-ignore */}
        <h3 id="feature-title" style={{ marginBottom: 6 }}>Features</h3>
        <ul aria-labelledby="feature-title">
          <li>Remove, RemoveAll</li>
          <li>swipe remove</li>
          <li>
            (autoClose: number only) Pause the timer when hovering over a toast
            item.
          </li>
        </ul>
      </section>
      <Toast.Provider limit={10}>
        <PageContent />
      </Toast.Provider>
    </PageLayout>
  );
}
