import { describe, expect, test } from 'bun:test';
import { renderGlossary } from './glossary.ts';

describe('renderGlossary', () => {
  test('renders a real definition list', () => {
    const html = renderGlossary({
      items: [{ term: 'RAG', definition: 'Retrieval-augmented generation' }],
    });
    expect(html).toContain('<dl');
    expect(html).toContain('<dt');
    expect(html).toContain('<dd');
  });

  test('every term and definition renders as text in order', () => {
    const html = renderGlossary({
      items: [
        { term: 'RAG', definition: 'Retrieval-augmented generation' },
        { term: 'LLM', definition: 'Large language model' },
      ],
    });
    expect(html.indexOf('RAG')).toBeLessThan(html.indexOf('LLM'));
    expect(html).toContain('Retrieval-augmented generation');
  });
});
