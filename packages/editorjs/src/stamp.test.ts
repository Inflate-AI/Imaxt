import { describe, expect, test } from 'bun:test';
import { renderStamp } from '@inflate-ai/imaxt-core';
import { StampTool } from './stamp.ts';

describe('StampTool', () => {
  test('exposes a toolbox entry', () => {
    expect(StampTool.toolbox.title).toBeTruthy();
  });

  test('preview matches the render engine', () => {
    const tool = new StampTool({ data: { text: 'DRAFT' } } as never);
    const wrapper = tool.render();
    const preview = wrapper.querySelector('.imx-ej-preview')!;
    expect(preview.innerHTML).toBe(renderStamp({ text: 'DRAFT' }));
  });

  test('save() round-trips and validate() requires text', () => {
    const tool = new StampTool({ data: { text: 'DRAFT' } } as never);
    const saved = tool.save();
    expect(JSON.parse(JSON.stringify(saved))).toEqual(saved);
    expect(tool.validate({ text: '' })).toBe(false);
    expect(tool.validate(saved)).toBe(true);
  });
});
