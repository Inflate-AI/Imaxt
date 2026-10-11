import { describe, expect, test } from 'bun:test';
import { renderTerminal } from './terminal.ts';

describe('renderTerminal', () => {
  test('command line renders its default prompt and command', () => {
    const html = renderTerminal({ lines: [{ command: 'npm install' }] });
    expect(html).toContain('$');
    expect(html).toContain('npm install');
  });

  test('output-only line renders with no prompt', () => {
    const html = renderTerminal({ lines: [{ output: 'added 42 packages' }] });
    const line = html.split('imx-term-line')[1] ?? '';
    expect(line).not.toContain('>$<');
    expect(html).toContain('added 42 packages');
  });

  test('renders an optional title', () => {
    const html = renderTerminal({ lines: [{ command: 'ls' }], title: 'Setup' });
    expect(html).toContain('Setup');
  });
});
