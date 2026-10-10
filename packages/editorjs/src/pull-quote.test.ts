import { describe, expect, test } from 'bun:test';
import { renderPullQuote } from '@inflate-ai/imaxt-core';
import { PullQuoteTool } from './pull-quote.ts';

describe('PullQuoteTool', () => {
  test('exposes a toolbox entry', () => {
    expect(PullQuoteTool.toolbox.title).toBeTruthy();
  });

  test('preview matches the render engine and updates on edit', () => {
    const tool = new PullQuoteTool({ data: { html: 'Quote', by: 'Someone' } } as never);
    const wrapper = tool.render();
    const preview = wrapper.querySelector('.imx-ej-preview')!;
    expect(preview.innerHTML).toBe(renderPullQuote({ html: 'Quote', by: 'Someone' }));

    const byInput = wrapper.querySelector<HTMLInputElement>('input')!;
    byInput.value = 'Someone else';
    byInput.dispatchEvent(new Event('input', { bubbles: true }));
    expect(preview.innerHTML).toContain('Someone else');
  });

  test('save() round-trips through JSON and validate() requires content', () => {
    const tool = new PullQuoteTool({ data: { html: 'x', by: 'y' } } as never);
    const saved = tool.save();
    expect(JSON.parse(JSON.stringify(saved))).toEqual(saved);
    expect(tool.validate({ html: '', by: '' })).toBe(false);
    expect(tool.validate(saved)).toBe(true);
  });
});
