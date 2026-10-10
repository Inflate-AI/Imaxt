import { describe, expect, test } from 'bun:test';
import { renderSteps } from '@inflate-ai/imaxt-core';
import { StepsTool } from './steps.ts';

describe('StepsTool', () => {
  test('exposes a toolbox entry', () => {
    expect(StepsTool.toolbox.title).toBeTruthy();
  });

  test('preview matches the render engine for the initial items', () => {
    const data = {
      items: [
        { title: 'Chunk', html: 'a' },
        { title: 'Embed', html: 'b' },
      ],
    };
    const tool = new StepsTool({ data } as never);
    const wrapper = tool.render();
    expect(wrapper.querySelector('.imx-ej-preview')?.innerHTML).toBe(renderSteps(data));
  });

  test('adding and removing items updates save()', () => {
    const tool = new StepsTool({ data: { items: [{ title: 'a', html: 'x' }] } } as never);
    const wrapper = tool.render();
    wrapper.querySelector<HTMLButtonElement>('.imx-ej-add')?.click();
    expect(tool.save().items.length).toBe(2);
    wrapper.querySelectorAll<HTMLButtonElement>('.imx-ej-remove')[0]?.click();
    expect(tool.save().items.length).toBe(1);
  });

  test('editing a step body updates save()', () => {
    const tool = new StepsTool({ data: { items: [{ title: 'a', html: 'x' }] } } as never);
    const wrapper = tool.render();
    const editable = wrapper.querySelector<HTMLElement>('[contenteditable]')!;
    editable.innerHTML = 'changed';
    editable.dispatchEvent(new Event('input', { bubbles: true }));
    expect(tool.save().items[0]?.html).toBe('changed');
  });

  test('save() round-trips through JSON and validate() requires at least one item', () => {
    const tool = new StepsTool({ data: { items: [{ title: 'a', html: 'x' }] } } as never);
    const saved = tool.save();
    expect(JSON.parse(JSON.stringify(saved))).toEqual(saved);
    expect(tool.validate({ items: [] })).toBe(false);
    expect(tool.validate(saved)).toBe(true);
  });
});
