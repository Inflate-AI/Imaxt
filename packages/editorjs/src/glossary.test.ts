import { describe, expect, test } from 'bun:test';
import { renderGlossary } from '@inflate-ai/imaxt-core';
import { GlossaryTool } from './glossary.ts';

describe('GlossaryTool', () => {
  test('exposes a toolbox entry', () => {
    expect(GlossaryTool.toolbox.title).toBeTruthy();
  });

  test('preview matches the render engine', () => {
    const tool = new GlossaryTool({
      data: { items: [{ term: 'RAG', definition: 'Retrieval-augmented generation' }] },
    } as never);
    const wrapper = tool.render();
    const preview = wrapper.querySelector('.imx-ej-preview')!;
    expect(preview.innerHTML).toBe(
      renderGlossary({ items: [{ term: 'RAG', definition: 'Retrieval-augmented generation' }] }),
    );
  });

  test('save() round-trips and validate() requires at least one item', () => {
    const tool = new GlossaryTool({
      data: { items: [{ term: 'RAG', definition: 'x' }] },
    } as never);
    const saved = tool.save();
    expect(JSON.parse(JSON.stringify(saved))).toEqual(saved);
    expect(tool.validate({ items: [] })).toBe(false);
    expect(tool.validate(saved)).toBe(true);
  });
});
