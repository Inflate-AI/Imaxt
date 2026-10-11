import { describe, expect, test } from 'bun:test';
import { renderChecklist } from '@inflate-ai/imaxt-core';
import { ChecklistTool } from './checklist.ts';

describe('ChecklistTool', () => {
  test('exposes a toolbox entry', () => {
    expect(ChecklistTool.toolbox.title).toBeTruthy();
  });

  test('preview matches the render engine', () => {
    const tool = new ChecklistTool({ data: { items: [{ text: 'Write tests' }] } } as never);
    const wrapper = tool.render();
    const preview = wrapper.querySelector('.imx-ej-preview')!;
    expect(preview.innerHTML).toBe(renderChecklist({ items: [{ text: 'Write tests' }] }));
  });

  test('save() round-trips and validate() requires at least one item', () => {
    const tool = new ChecklistTool({ data: { items: [{ text: 'Write tests' }] } } as never);
    const saved = tool.save();
    expect(JSON.parse(JSON.stringify(saved))).toEqual(saved);
    expect(tool.validate({ items: [] })).toBe(false);
    expect(tool.validate(saved)).toBe(true);
  });
});
