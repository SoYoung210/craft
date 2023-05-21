import { Children, isValidElement, ReactElement } from 'react';

export function getAllTextNodes(element: ReactElement): string[] {
  let nodes: string[] = [];
  if (
    typeof element.type === 'string' &&
    typeof element.props.children === 'string'
  ) {
    const hasContent = element.props.children.trim().length > 0;
    hasContent && nodes.push(element.props.children);
  } else {
    Children.forEach(element.props.children, child => {
      if (typeof child === 'string') {
        nodes.push(child);
      } else if (isValidElement(child)) {
        nodes = nodes.concat(getAllTextNodes(child));
      }
    });
  }
  return nodes;
}
