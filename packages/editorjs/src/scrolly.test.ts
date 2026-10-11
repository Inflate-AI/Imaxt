import { describe, expect, test } from 'bun:test';
import { renderScrolly } from '@inflate-ai/imaxt-core';
import { ScrollyTool } from './scrolly.ts';

describe('ScrollyTool', () => {
  test('exposes a toolbox entry', () => {
    expect(ScrollyTool.toolbox.title).toBeTruthy();
  });

  test('preview matches the render engine for the initial items', () => {
    const data = { items: [{ stage: 'Chunk', sub: 'step 1', html: 'a' }] };
    const tool = new ScrollyTool({ data } as never);
    const wrapper = tool.render();
    expect(wrapper.querySelector('.imx-ej-preview')?.innerHTML).toBe(renderScrolly(data));
  });

  test('adding and removing beats updates save()', () => {
    const tool = new ScrollyTool({ data: { items: [{ stage: 'a', html: 'x' }] } } as never);
    const wrapper = tool.render();
    wrapper.querySelector<HTMLButtonElement>('.imx-ej-add')?.click();
    expect(tool.save().items.length).toBe(2);
    wrapper.querySelectorAll<HTMLButtonElement>('.imx-ej-remove')[0]?.click();
    expect(tool.save().items.length).toBe(1);
  });

  test('save() round-trips through JSON and validate() requires at least one item', () => {
    const tool = new ScrollyTool({ data: { items: [{ stage: 'a', html: 'x' }] } } as never);
    const saved = tool.save();
    expect(JSON.parse(JSON.stringify(saved))).toEqual(saved);
    expect(tool.validate({ items: [] })).toBe(false);
    expect(tool.validate(saved)).toBe(true);
  });

  test('renderSettings offers the shared tone picker', () => {
    const tool = new ScrollyTool({ data: { items: [{ stage: 'a', html: 'x' }] } } as never);
    tool.render();
    expect(tool.renderSettings().querySelectorAll('[data-tone]').length).toBe(7);
  });
});
