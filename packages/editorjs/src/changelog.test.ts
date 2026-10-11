import { describe, expect, test } from 'bun:test';
import { renderChangelog } from '@inflate-ai/imaxt-core';
import { ChangelogTool } from './changelog.ts';

describe('ChangelogTool', () => {
  test('exposes a toolbox entry', () => {
    expect(ChangelogTool.toolbox.title).toBeTruthy();
  });

  test('preview matches the render engine', () => {
    const data = { entries: [{ version: '0.2.0', items: ['Added X'] }] };
    const tool = new ChangelogTool({ data } as never);
    const wrapper = tool.render();
    const preview = wrapper.querySelector('.imx-ej-preview')!;
    expect(preview.innerHTML).toBe(renderChangelog(data));
  });

  test('save() round-trips and validate() requires at least one entry', () => {
    const data = { entries: [{ version: '0.2.0', items: ['Added X'] }] };
    const tool = new ChangelogTool({ data } as never);
    const saved = tool.save();
    expect(JSON.parse(JSON.stringify(saved))).toEqual(saved);
    expect(tool.validate({ entries: [] })).toBe(false);
    expect(tool.validate(saved)).toBe(true);
  });
});
