import { Children, isValidElement, ReactElement } from 'react';

export function getAllTextNodes(element: ReactElement): string[] {
  let nodes: string[] = [];
  const props = element.props as { children?: React.ReactNode };
  if (
    typeof element.type === 'string' &&
    typeof props.children === 'string'
  ) {
    const hasContent = props.children.trim().length > 0;
    hasContent && nodes.push(props.children);
  } else {
    Children.forEach(props.children, child => {
      if (typeof child === 'string') {
        nodes.push(child);
      } else if (isValidElement(child)) {
        nodes = nodes.concat(getAllTextNodes(child));
      }
    });
  }
  return nodes;
}
