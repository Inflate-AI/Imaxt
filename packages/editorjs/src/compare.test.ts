import { describe, expect, test } from 'bun:test';
import { type CompareData, renderCompare } from '@inflate-ai/imaxt-core';
import { CompareTool } from './compare.ts';

describe('CompareTool', () => {
  test('exposes a toolbox entry', () => {
    expect(CompareTool.toolbox.title).toBeTruthy();
  });

  test('starts with exactly two sides and offers no add/remove control', () => {
    const tool = new CompareTool({ data: {} } as never);
    const wrapper = tool.render();
    expect(wrapper.querySelectorAll('[contenteditable]').length).toBe(2);
    expect(wrapper.querySelector('.imx-ej-add')).toBeNull();
    expect(wrapper.querySelector('.imx-ej-remove')).toBeNull();
  });

  test('preview matches the render engine for the initial sides', () => {
    const data: CompareData = {
      sides: [{ html: 'Before', kind: 'before' }, { html: 'After' }],
    };
    const tool = new CompareTool({ data } as never);
    const wrapper = tool.render();
    expect(wrapper.querySelector('.imx-ej-preview')?.innerHTML).toBe(renderCompare(data));
  });

  test('editing a side updates save()', () => {
    const tool = new CompareTool({
      data: { sides: [{ html: 'Before' }, { html: 'After' }] },
    } as never);
    const wrapper = tool.render();
    const editables = wrapper.querySelectorAll<HTMLElement>('[contenteditable]');
    editables[0]!.innerHTML = 'Changed';
    editables[0]?.dispatchEvent(new Event('input', { bubbles: true }));
    expect(tool.save().sides[0].html).toBe('Changed');
  });

  test('save() round-trips through JSON and validate() requires both sides to have content', () => {
    const tool = new CompareTool({
      data: { sides: [{ html: 'a' }, { html: 'b' }] },
    } as never);
    const saved = tool.save();
    expect(JSON.parse(JSON.stringify(saved))).toEqual(saved);
    expect(tool.validate({ sides: [{ html: '' }, { html: 'b' }] })).toBe(false);
    expect(tool.validate(saved)).toBe(true);
  });
});
