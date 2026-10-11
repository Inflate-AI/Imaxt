import { describe, expect, test } from 'bun:test';
import { renderDelta } from '@inflate-ai/imaxt-core';
import { DeltaTool } from './delta.ts';

describe('DeltaTool', () => {
  test('exposes a toolbox entry', () => {
    expect(DeltaTool.toolbox.title).toBeTruthy();
  });

  test('preview matches the render engine and updates on edit', () => {
    const tool = new DeltaTool({ data: { label: 'Latency', from: 120, to: 80 } } as never);
    const wrapper = tool.render();
    const preview = wrapper.querySelector('.imx-ej-preview')!;
    expect(preview.innerHTML).toBe(renderDelta({ label: 'Latency', from: 120, to: 80 }));

    const toInput = wrapper.querySelector<HTMLInputElement>('[data-field="to"]')!;
    toInput.value = '60';
    toInput.dispatchEvent(new Event('input', { bubbles: true }));
    expect(preview.innerHTML).toContain('60');
  });

  test('save() round-trips and validate() requires a label', () => {
    const tool = new DeltaTool({ data: { label: 'x', from: 1, to: 2 } } as never);
    const saved = tool.save();
    expect(JSON.parse(JSON.stringify(saved))).toEqual(saved);
    expect(tool.validate({ label: '', from: 1, to: 2 })).toBe(false);
    expect(tool.validate(saved)).toBe(true);
  });
});
