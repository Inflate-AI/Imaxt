import { describe, expect, test } from 'bun:test';
import { renderFunnel } from '@inflate-ai/imaxt-core';
import { FunnelTool } from './funnel.ts';

describe('FunnelTool', () => {
  test('exposes a toolbox entry', () => {
    expect(FunnelTool.toolbox.title).toBeTruthy();
  });

  test('preview matches the render engine', () => {
    const tool = new FunnelTool({
      data: { stages: [{ label: 'Visitors', value: 100 }] },
    } as never);
    const wrapper = tool.render();
    const preview = wrapper.querySelector('.imx-ej-preview')!;
    expect(preview.innerHTML).toBe(renderFunnel({ stages: [{ label: 'Visitors', value: 100 }] }));
  });

  test('save() round-trips and validate() requires at least one stage', () => {
    const tool = new FunnelTool({
      data: { stages: [{ label: 'Visitors', value: 100 }] },
    } as never);
    const saved = tool.save();
    expect(JSON.parse(JSON.stringify(saved))).toEqual(saved);
    expect(tool.validate({ stages: [] })).toBe(false);
    expect(tool.validate(saved)).toBe(true);
  });
});
