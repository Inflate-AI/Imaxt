import { describe, expect, test } from 'bun:test';
import { renderStatRow } from '@inflate-ai/imaxt-core';
import { StatRowTool } from './stat-row.ts';

describe('StatRowTool', () => {
  test('exposes a toolbox entry', () => {
    expect(StatRowTool.toolbox.title).toBeTruthy();
  });

  test('preview matches the render engine for the initial items', () => {
    const data = {
      items: [
        { value: '5', label: 'a' },
        { value: '6', label: 'b' },
      ],
    };
    const tool = new StatRowTool({ data } as never);
    const wrapper = tool.render();
    const preview = wrapper.querySelector('.imx-ej-preview')!;
    expect(preview.innerHTML).toBe(renderStatRow(data));
  });

  test('adding and removing items updates save()', () => {
    const tool = new StatRowTool({ data: { items: [{ value: '1', label: 'a' }] } } as never);
    const wrapper = tool.render();
    wrapper.querySelector<HTMLButtonElement>('.imx-ej-add')?.click();
    expect(tool.save().items.length).toBe(2);

    wrapper.querySelectorAll<HTMLButtonElement>('.imx-ej-remove')[0]?.click();
    expect(tool.save().items.length).toBe(1);
  });

  test('editing a value field updates save()', () => {
    const tool = new StatRowTool({ data: { items: [{ value: '1', label: 'a' }] } } as never);
    const wrapper = tool.render();
    const valueInput = wrapper.querySelector<HTMLInputElement>('input[data-field="value"]')!;
    valueInput.value = '42';
    valueInput.dispatchEvent(new Event('input', { bubbles: true }));
    expect(tool.save().items[0]?.value).toBe('42');
  });

  test('save() round-trips through JSON and validate() requires at least one item', () => {
    const tool = new StatRowTool({ data: { items: [{ value: '1', label: 'a' }] } } as never);
    const saved = tool.save();
    expect(JSON.parse(JSON.stringify(saved))).toEqual(saved);
    expect(tool.validate({ items: [] })).toBe(false);
    expect(tool.validate(saved)).toBe(true);
  });
});
