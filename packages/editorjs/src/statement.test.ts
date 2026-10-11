import { describe, expect, test } from 'bun:test';
import { renderStatement } from '@inflate-ai/imaxt-core';
import { StatementTool } from './statement.ts';

function makeTool(data: Partial<InstanceType<typeof StatementTool>['data']> = {}) {
  return new StatementTool({ data, api: {} as never, config: {}, readOnly: false } as never);
}

describe('StatementTool', () => {
  test('exposes a toolbox entry with an icon and title', () => {
    expect(StatementTool.toolbox.title).toBeTruthy();
    expect(StatementTool.toolbox.icon.length).toBeGreaterThan(0);
  });

  test('render() produces an editable field whose preview matches the render engine', () => {
    const tool = makeTool({ html: 'Hello <strong>world</strong>' });
    const wrapper = tool.render();
    const preview = wrapper.querySelector('.imx-ej-preview')!;
    expect(preview.innerHTML).toBe(
      renderStatement({ html: 'Hello <strong>world</strong>', tone: 'ink', align: 'left' }),
    );
  });

  test('editing the field updates the live preview and the saved data', () => {
    const tool = makeTool({ html: 'Original' });
    const wrapper = tool.render();
    const editable = wrapper.querySelector<HTMLElement>('[contenteditable]')!;
    editable.innerHTML = 'Changed';
    editable.dispatchEvent(new Event('input', { bubbles: true }));

    const preview = wrapper.querySelector('.imx-ej-preview')!;
    expect(preview.innerHTML).toContain('Changed');

    const saved = tool.save();
    expect(saved.html).toBe('Changed');
  });

  test('save() output round-trips through JSON', () => {
    const tool = makeTool({ html: 'x', tone: 'mint', align: 'center' });
    const saved = tool.save();
    expect(JSON.parse(JSON.stringify(saved))).toEqual(saved);
  });

  test('validate() rejects empty content', () => {
    const tool = makeTool({ html: '' });
    expect(tool.validate({ html: '', tone: 'ink', align: 'left' })).toBe(false);
  });

  test('validate() accepts non-empty content', () => {
    const tool = makeTool({ html: 'x' });
    expect(tool.validate({ html: 'x', tone: 'ink', align: 'left' })).toBe(true);
  });

  test('renderSettings offers the shared tone picker', () => {
    const tool = makeTool({ html: 'x' });
    tool.render();
    const settings = tool.renderSettings();
    expect(settings.querySelectorAll('[data-tone]').length).toBe(7);
  });
});
