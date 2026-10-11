import { describe, expect, test } from 'bun:test';
import { renderSparkline } from '@inflate-ai/imaxt-core';
import { SparklineTool } from './sparkline.ts';

describe('SparklineTool', () => {
  test('exposes a toolbox entry', () => {
    expect(SparklineTool.toolbox.title).toBeTruthy();
  });

  test('preview matches the render engine', () => {
    const tool = new SparklineTool({ data: { values: [1, 2, 3] } } as never);
    const wrapper = tool.render();
    const preview = wrapper.querySelector('.imx-ej-preview')!;
    expect(preview.innerHTML).toBe(renderSparkline({ values: [1, 2, 3] }));
  });

  test('save() round-trips and validate() requires at least one value', () => {
    const tool = new SparklineTool({ data: { values: [1, 2] } } as never);
    const saved = tool.save();
    expect(JSON.parse(JSON.stringify(saved))).toEqual(saved);
    expect(tool.validate({ values: [] })).toBe(false);
    expect(tool.validate(saved)).toBe(true);
  });
});
