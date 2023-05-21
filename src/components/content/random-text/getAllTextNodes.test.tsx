import { getAllTextNodes } from './getAllTextNodes';

describe('getAllTextNodes', () => {
  test('returns an array of all text nodes', () => {
    const element = (
      <div>
        <p>Paragraph 1</p>
        <p>Paragraph 2</p>
        <ul>
          <li>List item 1</li>
          <li>List item 2</li>
        </ul>
      </div>
    );

    const result = getAllTextNodes(element);
    expect(result).toEqual([
      'Paragraph 1',
      'Paragraph 2',
      'List item 1',
      'List item 2',
    ]);
  });

  test('returns an empty array for an element with no text nodes', () => {
    const element = (
      <div>
        <p>
          <img src="image.jpg" alt="An image" />
        </p>
        <div></div>
      </div>
    );
    const result = getAllTextNodes(element);
    expect(result).toEqual([]);
  });

  test('returns an array of text nodes from child nodes', () => {
    const element = (
      <div>
        <p>This is a paragraph</p>
      </div>
    );

    const result = getAllTextNodes(element);
    expect(result).toEqual(['This is a paragraph']);
  });

  test('returns an array of text nodes from nested nodes', () => {
    const element = (
      <div>
        <p>This is paragraph 1</p>
        <p>
          This is paragraph 2<em>emphasized text</em>
        </p>
      </div>
    );

    const result = getAllTextNodes(element);
    expect(result).toEqual([
      'This is paragraph 1',
      'This is paragraph 2',
      'emphasized text',
    ]);
  });
});
