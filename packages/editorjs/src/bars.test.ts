import { describe, expect, test } from 'bun:test';
import { renderBars } from '@inflate-ai/imaxt-core';
import { BarsTool } from './bars.ts';

describe('BarsTool', () => {
  test('exposes a toolbox entry', () => {
    expect(BarsTool.toolbox.title).toBeTruthy();
  });

  test('preview matches the render engine for the initial items', () => {
    const tool = new BarsTool({
      data: {
        items: [
          { label: 'A', value: 10 },
          { label: 'B', value: 20 },
        ],
        unit: '%',
      },
    } as never);
    const wrapper = tool.render();
    const preview = wrapper.querySelector('.imx-ej-preview')!;
    expect(preview.innerHTML).toBe(
      renderBars({
        items: [
          { label: 'A', value: 10 },
          { label: 'B', value: 20 },
        ],
        unit: '%',
      }),
    );
  });

  test('adding a row grows the saved items array', () => {
    const tool = new BarsTool({ data: { items: [{ label: 'A', value: 10 }] } } as never);
    const wrapper = tool.render();
    wrapper.querySelector<HTMLButtonElement>('.imx-ej-add')?.click();
    expect(tool.save().items.length).toBe(2);
  });

  test('removing a row shrinks the saved items array', () => {
    const tool = new BarsTool({
      data: {
        items: [
          { label: 'A', value: 1 },
          { label: 'B', value: 2 },
        ],
      },
    } as never);
    const wrapper = tool.render();
    wrapper.querySelector<HTMLButtonElement>('.imx-ej-remove')?.click();
    expect(tool.save().items.length).toBe(1);
    expect(tool.save().items[0]?.label).toBe('B');
  });

  test('editing a row label updates the saved data', () => {
    const tool = new BarsTool({ data: { items: [{ label: 'A', value: 1 }] } } as never);
    const wrapper = tool.render();
    const labelInput = wrapper.querySelector<HTMLInputElement>(
      '.imx-ej-item input[data-field="label"]',
    )!;
    labelInput.value = 'Changed';
    labelInput.dispatchEvent(new Event('input', { bubbles: true }));
    expect(tool.save().items[0]?.label).toBe('Changed');
  });

  test('save() round-trips through JSON and validate() requires at least one item', () => {
    const tool = new BarsTool({ data: { items: [{ label: 'A', value: 1 }] } } as never);
    const saved = tool.save();
    expect(JSON.parse(JSON.stringify(saved))).toEqual(saved);
    expect(tool.validate({ items: [] })).toBe(false);
    expect(tool.validate(saved)).toBe(true);
  });
});
