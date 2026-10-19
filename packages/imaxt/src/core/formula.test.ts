import { describe, expect, test } from 'bun:test';
import { renderFormula } from './formula.ts';

describe('renderFormula', () => {
  test('renders typeset math with no client-side JavaScript required', () => {
    const html = renderFormula({ tex: 'E=mc^2' });
    expect(html).toContain('katex');
  });

  test('display flag marks block math layout', () => {
    const html = renderFormula({ tex: 'E=mc^2', display: true });
    expect(html).toContain('katex-display');
  });

  test('inline (default) does not mark block math layout', () => {
    const html = renderFormula({ tex: 'E=mc^2' });
    expect(html).not.toContain('katex-display');
  });

  test('malformed tex does not throw', () => {
    expect(() => renderFormula({ tex: '\\notarealcommand{' })).not.toThrow();
  });

  test('renders a caption when given', () => {
    const html = renderFormula({ tex: 'E=mc^2', caption: "Einstein's mass-energy equivalence" });
    expect(html).toContain('Einstein&#39;s mass-energy equivalence');
  });
});
