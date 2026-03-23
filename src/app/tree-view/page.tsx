import type { Metadata } from 'next';
import TreeViewClient from './page.client';

export const metadata: Metadata = {
  title: 'Tree View',
};

export default function TreeViewPage() {
  return <TreeViewClient />;
}
