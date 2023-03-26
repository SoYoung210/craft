export const getScreenshot = async (url: string) => {
  const res = await fetch('/.netlify/functions/screenshot', {
    method: 'POST',
    body: url,
  });

  const imageBlob = await res.blob();
  return URL.createObjectURL(imageBlob);
};

export function getUrlLabel(url: string) {
  const regex = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n]+)/i; // 도메인 부분 추출하는 정규식
  const match = url.match(regex);

  if (match) {
    const domain = match[1];
    const parts = domain.split('.');

    if (parts.length > 1) {
      return parts.slice(-2, -1)[0]; // 끝에서 두 번째 요소 반환
    } else {
      return domain;
    }
  }

  return null;
}

export function ensureUrlPrefix(url: string): string {
  if (!url.startsWith('https://') && !url.startsWith('http://')) {
    return 'https://' + url;
  }

  return url;
}
