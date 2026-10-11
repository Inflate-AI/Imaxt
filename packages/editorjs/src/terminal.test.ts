import { describe, expect, test } from 'bun:test';
import { renderTerminal } from '@inflate-ai/imaxt-core';
import { TerminalTool } from './terminal.ts';

describe('TerminalTool', () => {
  test('exposes a toolbox entry', () => {
    expect(TerminalTool.toolbox.title).toBeTruthy();
  });

  test('preview matches the render engine', () => {
    const tool = new TerminalTool({ data: { lines: [{ command: 'npm install' }] } } as never);
    const wrapper = tool.render();
    const preview = wrapper.querySelector('.imx-ej-preview')!;
    expect(preview.innerHTML).toBe(renderTerminal({ lines: [{ command: 'npm install' }] }));
  });

  test('save() round-trips and validate() requires at least one line', () => {
    const tool = new TerminalTool({ data: { lines: [{ command: 'ls' }] } } as never);
    const saved = tool.save();
    expect(JSON.parse(JSON.stringify(saved))).toEqual(saved);
    expect(tool.validate({ lines: [] })).toBe(false);
    expect(tool.validate(saved)).toBe(true);
  });
});
