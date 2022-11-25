import { ReactElement, ReactNode } from 'react';

export default function WhenValidGrandChildren({
  children,
  grandChildren = children.props.children,
}: {
  children: ReactElement;
  grandChildren?: ReactNode;
}) {
  return <>{grandChildren == null ? null : children}</>;
}
