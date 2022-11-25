import { ReactNode } from 'react';

const SIZE = 188;

export default function CircleSquare({ children }: { children: ReactNode }) {
  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M94 188C145.915 188 188 145.915 188 94C188 42.0852 145.915 0 94 0C42.0852 0 0 42.0852 0 94C0 145.915 42.0852 188 94 188ZM104.814 28.8137C98.5653 22.5653 88.4347 22.5653 82.1863 28.8137L28.8137 82.1863C22.5653 88.4347 22.5653 98.5653 28.8137 104.814L82.1863 158.186C88.4347 164.435 98.5653 164.435 104.814 158.186L158.186 104.814C164.435 98.5653 164.435 88.4347 158.186 82.1863L104.814 28.8137Z"
      />
      {children}
    </svg>
  );
}
