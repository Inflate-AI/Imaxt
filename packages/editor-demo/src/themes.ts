import type { ImaxtEditorTheme } from '@inflate-ai/imaxt-editor';

/** Blog's own light tokens (src/styles/tokens.css) - this is what "in the theme of the blog" means: the exact same values, not a lookalike. */
export const BLOG_LIGHT: ImaxtEditorTheme = {
  paper: '#f6f3ea',
  paper2: '#ebe6d8',
  card: '#fffdf6',
  text: '#1c1c1c',
  muted: '#5c584f',
  line: '#1c1c1c',
  hair: 'color-mix(in srgb, #1c1c1c 26%, transparent)',
  accent: '#0f7b4d',
  accentLt: '#6aad91',
  onAccent: '#ffffff',
  fontSans: "'Archivo Variable', 'Archivo', system-ui, sans-serif",
  fontDisplay: "'Archivo Variable', 'Archivo', system-ui, sans-serif",
  fontSerif: "'Source Serif 4 Variable', 'Source Serif 4', Georgia, serif",
  fontMono: "'Space Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
};

/** Blog's dark-mode tokens (`:root[data-theme='dark']`). */
export const BLOG_DARK: ImaxtEditorTheme = {
  ...BLOG_LIGHT,
  accent: '#6aad91',
  onAccent: '#1c1c1c',
  paper: '#1c1c1c',
  paper2: '#262626',
  card: '#2a2a2a',
  text: '#f4f1e8',
  muted: '#a8a498',
  line: '#f4f1e8',
  hair: 'color-mix(in srgb, #f4f1e8 16%, transparent)',
};

/** A deliberately different palette - proves the theme is genuinely configurable, not hardcoded to Blog's look. */
export const CUSTOM: ImaxtEditorTheme = {
  paper: '#f4f3ff',
  paper2: '#e8e6ff',
  card: '#ffffff',
  text: '#1d1b3a',
  muted: '#6b67a0',
  line: '#c9c5f2',
  hair: '#ddd9f7',
  accent: '#5b3df0',
  accentLt: '#a79bf7',
  onAccent: '#ffffff',
  fontSans: 'system-ui, sans-serif',
  fontDisplay: "'Fraunces', Georgia, serif",
  fontSerif: 'Georgia, serif',
  fontMono: "'Space Mono', monospace",
};

export const CUSTOM_DARK: ImaxtEditorTheme = {
  ...CUSTOM,
  paper: '#16142b',
  paper2: '#201d3c',
  card: '#201d3c',
  text: '#ece9ff',
  muted: '#a9a4d9',
  line: '#3a3660',
  hair: '#2a2750',
  accent: '#a79bf7',
  onAccent: '#16142b',
};

export const THEME_PRESETS = {
  blog: { light: BLOG_LIGHT, dark: BLOG_DARK, label: 'Blog theme' },
  custom: { light: CUSTOM, dark: CUSTOM_DARK, label: 'Custom theme' },
} as const;

export type ThemePresetKey = keyof typeof THEME_PRESETS;
