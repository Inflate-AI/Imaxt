import { describe, expect, test } from 'bun:test';
import { renderVersus } from '@inflate-ai/imaxt-core';
import { VersusTool } from './versus.ts';

const SAMPLE = {
  sides: [
    { label: 'Postgres', html: 'Relational' },
    { label: 'SQLite', html: 'Embedded' },
  ] as [{ label: string; html: string }, { label: string; html: string }],
};

describe('VersusTool', () => {
  test('exposes a toolbox entry', () => {
    expect(VersusTool.toolbox.title).toBeTruthy();
  });

  test('preview matches the render engine', () => {
    const tool = new VersusTool({ data: SAMPLE } as never);
    const wrapper = tool.render();
    const preview = wrapper.querySelector('.imx-ej-preview')!;
    expect(preview.innerHTML).toBe(renderVersus(SAMPLE));
  });

  test('save() round-trips and always keeps exactly two sides', () => {
    const tool = new VersusTool({ data: SAMPLE } as never);
    const saved = tool.save();
    expect(JSON.parse(JSON.stringify(saved))).toEqual(saved);
    expect(saved.sides.length).toBe(2);
    expect(tool.validate(saved)).toBe(true);
  });
});
