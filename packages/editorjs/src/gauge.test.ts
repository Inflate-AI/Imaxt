import { describe, expect, test } from 'bun:test';
import { renderGauge } from '@inflate-ai/imaxt-core';
import { GaugeTool } from './gauge.ts';

describe('GaugeTool', () => {
  test('exposes a toolbox entry', () => {
    expect(GaugeTool.toolbox.title).toBeTruthy();
  });

  test('preview matches the render engine', () => {
    const tool = new GaugeTool({ data: { value: 3, max: 5 } } as never);
    const wrapper = tool.render();
    const preview = wrapper.querySelector('.imx-ej-preview')!;
    expect(preview.innerHTML).toBe(renderGauge({ value: 3, max: 5 }));
  });

  test('save() round-trips and validate() requires a positive max', () => {
    const tool = new GaugeTool({ data: { value: 3, max: 5 } } as never);
    const saved = tool.save();
    expect(JSON.parse(JSON.stringify(saved))).toEqual(saved);
    expect(tool.validate({ value: 1, max: 0 })).toBe(false);
    expect(tool.validate(saved)).toBe(true);
  });
});
