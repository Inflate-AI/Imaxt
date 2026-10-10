import { describe, expect, test } from 'bun:test';
import { attachTypeLab, renderTypeLab } from './type-lab.ts';

function must<T>(value: T | null | undefined): T {
  if (value == null) throw new Error('expected a value, got null/undefined');
  return value;
}

describe('renderTypeLab', () => {
  test('the sample text is present as the manipulated text', () => {
    const html = renderTypeLab({ sample: 'Same letters, different voice' });
    expect(html).toContain('Same letters, different voice');
  });

  test('defaults the family to fraunces and marks its button pressed', () => {
    const html = renderTypeLab({});
    expect(html).toContain('>Fraunces<');
    expect(html).toContain('aria-pressed="true"');
  });

  test('scopes to a given family', () => {
    const html = renderTypeLab({ family: 'archivo' });
    const doc = document.implementation.createHTMLDocument('');
    doc.body.innerHTML = html;
    const pressed = doc.querySelector('[aria-pressed="true"]');
    expect(pressed?.textContent).toBe('Archivo');
  });
});

describe('attachTypeLab', () => {
  function mount(sample = 'hello world', family?: 'archivo' | 'fraunces' | 'source-serif') {
    const root = document.createElement('div');
    root.innerHTML = renderTypeLab({ sample, family });
    document.body.appendChild(root);
    attachTypeLab(root);
    return root;
  }

  test('marks the root ready for interaction', () => {
    const root = mount();
    expect(root.querySelector('.imx-typelab')?.hasAttribute('data-ready')).toBe(true);
  });

  test('typing in the sample field updates the preview text', () => {
    const root = mount('hello world');
    const input = must(root.querySelector<HTMLInputElement>('.imx-tl-text input'));
    input.value = 'new sample';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(root.querySelector('.imx-tl-preview')?.textContent).toBe('new sample');
  });

  test('switching family swaps the axis sliders', () => {
    const root = mount('x', 'source-serif');
    expect(root.querySelectorAll('.imx-tl-ctl[data-axis]').length).toBe(1);

    const archivoButton = must(
      [...root.querySelectorAll<HTMLButtonElement>('.imx-tl-fam button')].find(
        (b) => b.textContent === 'Archivo',
      ),
    );
    archivoButton.click();

    expect(root.querySelectorAll('.imx-tl-ctl[data-axis]').length).toBe(2);
    expect(archivoButton.getAttribute('aria-pressed')).toBe('true');
  });

  test('moving the size slider updates the generated CSS output', () => {
    const root = mount();
    const sizeInput = must(root.querySelector<HTMLInputElement>('input[data-control="size"]'));
    sizeInput.value = '100';
    sizeInput.dispatchEvent(new Event('input', { bubbles: true }));
    expect(root.querySelector('.imx-tl-out code')?.textContent).toContain('font-size: 100px;');
  });

  test('reset restores the original sample text', () => {
    const root = mount('original sample');
    const input = must(root.querySelector<HTMLInputElement>('.imx-tl-text input'));
    input.value = 'changed';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    must(root.querySelector<HTMLButtonElement>('.imx-tl-reset')).click();
    expect(root.querySelector('.imx-tl-preview')?.textContent).toBe('original sample');
  });
});
