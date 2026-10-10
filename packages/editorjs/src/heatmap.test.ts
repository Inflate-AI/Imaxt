import { describe, expect, test } from 'bun:test';
import { renderHeatmap } from '@inflate-ai/imaxt-core';
import { HeatmapTool } from './heatmap.ts';

const DATA = {
  caption: 'Modes',
  rows: ['600', '644'],
  cols: ['Owner', 'Others'],
  data: [
    [6, 0],
    [6, 4],
  ],
};

describe('HeatmapTool', () => {
  test('exposes a toolbox entry', () => {
    expect(HeatmapTool.toolbox.title).toBeTruthy();
  });

  test('preview matches the render engine for the initial grid', () => {
    const tool = new HeatmapTool({ data: DATA } as never);
    const wrapper = tool.render();
    const preview = wrapper.querySelector('.imx-ej-preview')!;
    expect(preview.innerHTML).toBe(renderHeatmap(DATA));
  });

  test('editing a cell updates the saved grid', () => {
    const tool = new HeatmapTool({ data: DATA } as never);
    const wrapper = tool.render();
    const cell = wrapper.querySelector<HTMLInputElement>('.imx-ej-grid input')!;
    cell.value = '9';
    cell.dispatchEvent(new Event('input', { bubbles: true }));
    expect(tool.save().data[0]?.[0]).toBe(9);
  });

  test('changing the rows list resizes the grid', () => {
    const tool = new HeatmapTool({ data: DATA } as never);
    const wrapper = tool.render();
    const rowsInput = wrapper.querySelector<HTMLInputElement>('input[data-field="rows"]')!;
    rowsInput.value = '600, 644, 755';
    rowsInput.dispatchEvent(new Event('change', { bubbles: true }));
    expect(tool.save().rows.length).toBe(3);
    expect(tool.save().data.length).toBe(3);
  });

  test('save() round-trips through JSON and validate() requires matching dimensions', () => {
    const tool = new HeatmapTool({ data: DATA } as never);
    const saved = tool.save();
    expect(JSON.parse(JSON.stringify(saved))).toEqual(saved);
    expect(tool.validate(saved)).toBe(true);
    expect(tool.validate({ ...saved, data: [[1]] })).toBe(false);
  });
});
