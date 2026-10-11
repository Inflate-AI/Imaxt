import { describe, expect, test } from 'bun:test';
import { renderScorecard } from '@inflate-ai/imaxt-core';
import { ScorecardTool } from './scorecard.ts';

describe('ScorecardTool', () => {
  test('exposes a toolbox entry', () => {
    expect(ScorecardTool.toolbox.title).toBeTruthy();
  });

  test('preview matches the render engine', () => {
    const tool = new ScorecardTool({ data: { items: [{ label: 'MRR', value: 1 }] } } as never);
    const wrapper = tool.render();
    const preview = wrapper.querySelector('.imx-ej-preview')!;
    expect(preview.innerHTML).toBe(renderScorecard({ items: [{ label: 'MRR', value: 1 }] }));
  });

  test('save() round-trips and validate() requires at least one item', () => {
    const tool = new ScorecardTool({ data: { items: [{ label: 'MRR', value: 1 }] } } as never);
    const saved = tool.save();
    expect(JSON.parse(JSON.stringify(saved))).toEqual(saved);
    expect(tool.validate({ items: [] })).toBe(false);
    expect(tool.validate(saved)).toBe(true);
  });
});
