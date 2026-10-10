import { describe, expect, test } from 'bun:test';
import { renderTimeline } from '@inflate-ai/imaxt-core';
import { TimelineTool } from './timeline.ts';

describe('TimelineTool', () => {
  test('exposes a toolbox entry', () => {
    expect(TimelineTool.toolbox.title).toBeTruthy();
  });

  test('preview matches the render engine for the initial items', () => {
    const data = { items: [{ date: '1', title: 'Propose', html: 'a' }] };
    const tool = new TimelineTool({ data } as never);
    const wrapper = tool.render();
    expect(wrapper.querySelector('.imx-ej-preview')?.innerHTML).toBe(renderTimeline(data));
  });

  test('adding and removing items updates save()', () => {
    const tool = new TimelineTool({
      data: { items: [{ date: '1', title: 'a', html: 'x' }] },
    } as never);
    const wrapper = tool.render();
    wrapper.querySelector<HTMLButtonElement>('.imx-ej-add')?.click();
    expect(tool.save().items.length).toBe(2);
    wrapper.querySelectorAll<HTMLButtonElement>('.imx-ej-remove')[0]?.click();
    expect(tool.save().items.length).toBe(1);
  });

  test('save() round-trips through JSON and validate() requires at least one item', () => {
    const tool = new TimelineTool({
      data: { items: [{ date: '1', title: 'a', html: 'x' }] },
    } as never);
    const saved = tool.save();
    expect(JSON.parse(JSON.stringify(saved))).toEqual(saved);
    expect(tool.validate({ items: [] })).toBe(false);
    expect(tool.validate(saved)).toBe(true);
  });
});
