import { describe, expect, test } from 'bun:test';
import { TypeLabTool } from './type-lab.ts';

describe('TypeLabTool', () => {
  test('exposes a toolbox entry', () => {
    expect(TypeLabTool.toolbox.title).toBeTruthy();
  });

  test('renders the interactive playground with the given sample', () => {
    const tool = new TypeLabTool({ data: { sample: 'Same letters, different voice' } } as never);
    const wrapper = tool.render();
    expect(wrapper.querySelector('.imx-typelab')).toBeTruthy();
    expect(wrapper.textContent).toContain('Same letters, different voice');
  });

  test('typing a new sample is reflected in save()', () => {
    const tool = new TypeLabTool({ data: { sample: 'original' } } as never);
    const wrapper = tool.render();
    document.body.appendChild(wrapper);
    const input = wrapper.querySelector<HTMLInputElement>('.imx-tl-text-input')!;
    input.value = 'new sample';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(tool.save().sample).toBe('new sample');
  });

  test('switching family is reflected in save()', () => {
    const tool = new TypeLabTool({ data: { sample: 'x', family: 'fraunces' } } as never);
    const wrapper = tool.render();
    const archivoButton = [
      ...wrapper.querySelectorAll<HTMLButtonElement>('.imx-tl-fam button'),
    ].find((b) => b.textContent === 'Archivo')!;
    archivoButton.click();
    expect(tool.save().family).toBe('archivo');
  });

  test('save() round-trips through JSON and validate() requires a sample', () => {
    const tool = new TypeLabTool({ data: { sample: 'x' } } as never);
    const saved = tool.save();
    expect(JSON.parse(JSON.stringify(saved))).toEqual(saved);
    expect(tool.validate({ sample: '' })).toBe(false);
    expect(tool.validate(saved)).toBe(true);
  });
});
