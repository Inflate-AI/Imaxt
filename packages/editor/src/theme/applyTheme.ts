import type { CSSProperties } from 'react';

/**
 * The names `editor.css` reads via `var(--x, fallback)`. A consumer can
 * override any subset - CSS-first (redeclare these on an ancestor, or load
 * Blog's/imaxt-core's own stylesheet, which already use these exact names)
 * or JS-first (pass a `theme` object to `<ImaxtEditor theme={...} />`).
 */
export interface ImaxtEditorTheme {
  paper?: string;
  paper2?: string;
  card?: string;
  text?: string;
  muted?: string;
  line?: string;
  hair?: string;
  accent?: string;
  accentLt?: string;
  onAccent?: string;
  fontSans?: string;
  fontSerif?: string;
  fontMono?: string;
  fontDisplay?: string;
}

const VAR_NAMES: Record<keyof ImaxtEditorTheme, string> = {
  paper: '--paper',
  paper2: '--paper2',
  card: '--card',
  text: '--text',
  muted: '--muted',
  line: '--line',
  hair: '--hair',
  accent: '--accent',
  accentLt: '--accent-lt',
  onAccent: '--on-accent',
  fontSans: '--font-sans',
  fontSerif: '--font-serif',
  fontMono: '--font-mono',
  fontDisplay: '--font-display',
};

/** Converts a `theme` prop into inline CSS custom properties for the editor's root element. */
export function themeToStyle(theme: ImaxtEditorTheme | undefined): CSSProperties {
  if (!theme) return {};
  const style: Record<string, string> = {};
  for (const [key, value] of Object.entries(theme)) {
    if (value === undefined) continue;
    const varName = VAR_NAMES[key as keyof ImaxtEditorTheme];
    if (varName) style[varName] = value;
  }
  return style as CSSProperties;
}
