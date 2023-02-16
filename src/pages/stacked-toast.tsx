import { useRef } from 'react';

import Toast, {
  useToast,
} from '../components/content/stacked-toast/ToastContext';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/material/Button';

function PageContent() {
  const { message } = useToast();
  const count = useRef(1);

  return (
    <div>
      <Button
        onClick={() => {
          message(
            <>
              <Toast.Title> message${count.current}</Toast.Title>
              <Toast.Description asChild>
                <p>
                  OneSignal announces 500% growth, delivering 2 trillion
                  messages annually...
                </p>
              </Toast.Description>
            </>,
            { autoClose: false }
          );
          count.current = count.current + 1;
        }}
      >
        Add Toast
      </Button>
    </div>
  );
}
export default function StackedNotification() {
  return (
    <PageLayout>
      <PageLayout.Title>Stacked Toast</PageLayout.Title>
      <ul>
        <li>일정 개수 이상은 안보이도록 한계를 둬야함.</li>
        <li>
          trick으로 뒤에서 겹쳐져 있다가 컨텐츠가 나오는 타이밍에 감추기:
          macOS방식
        </li>
      </ul>

      <Toast.Provider limit={10}>
        <PageContent />
      </Toast.Provider>
    </PageLayout>
  );
}
