import { describe, expect, test } from 'bun:test';
import { renderFormula } from '@inflate-ai/imaxt-core';
import { FormulaTool } from './formula.ts';

describe('FormulaTool', () => {
  test('exposes a toolbox entry', () => {
    expect(FormulaTool.toolbox.title).toBeTruthy();
  });

  test('preview matches the render engine and updates on edit', () => {
    const tool = new FormulaTool({ data: { tex: 'E=mc^2' } } as never);
    const wrapper = tool.render();
    const preview = wrapper.querySelector('.imx-ej-preview')!;
    expect(preview.innerHTML).toBe(renderFormula({ tex: 'E=mc^2' }));

    const texInput = wrapper.querySelector<HTMLInputElement>('[data-field="tex"]')!;
    texInput.value = 'a^2 + b^2 = c^2';
    texInput.dispatchEvent(new Event('input', { bubbles: true }));
    expect(preview.innerHTML).toBe(renderFormula({ tex: 'a^2 + b^2 = c^2' }));
  });

  test('save() round-trips and validate() requires a tex value', () => {
    const tool = new FormulaTool({ data: { tex: 'x' } } as never);
    const saved = tool.save();
    expect(JSON.parse(JSON.stringify(saved))).toEqual(saved);
    expect(tool.validate({ tex: '' })).toBe(false);
    expect(tool.validate(saved)).toBe(true);
  });
});
