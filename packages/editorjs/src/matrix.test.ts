import { describe, expect, test } from 'bun:test';
import { renderMatrix } from '@inflate-ai/imaxt-core';
import { MatrixTool } from './matrix.ts';

const SAMPLE = { rows: ['Free'], cols: ['Exports'], cells: [['yes']] };

describe('MatrixTool', () => {
  test('exposes a toolbox entry', () => {
    expect(MatrixTool.toolbox.title).toBeTruthy();
  });

  test('preview matches the render engine', () => {
    const tool = new MatrixTool({ data: SAMPLE } as never);
    const wrapper = tool.render();
    const preview = wrapper.querySelector('.imx-ej-preview')!;
    expect(preview.innerHTML).toBe(renderMatrix(SAMPLE));
  });

  test('save() round-trips', () => {
    const tool = new MatrixTool({ data: SAMPLE } as never);
    const saved = tool.save();
    expect(JSON.parse(JSON.stringify(saved))).toEqual(saved);
  });

  test('validate() rejects mismatched cell dimensions', () => {
    const tool = new MatrixTool({ data: SAMPLE } as never);
    expect(tool.validate({ rows: ['A', 'B'], cols: ['X'], cells: [['yes']] })).toBe(false);
    expect(tool.validate(SAMPLE)).toBe(true);
  });
});
