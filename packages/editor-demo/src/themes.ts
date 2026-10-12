import type { ImaxtEditorTheme } from '@inflate-ai/imaxt-editor';

/** Drafted by Dev's own light tokens (src/styles/tokens.css) - this is what "in the Drafted style" means: the exact same values, not a lookalike. */
export const DRAFTED_LIGHT: ImaxtEditorTheme = {
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
  toneMint: '#b6f0d3',
  toneLilac: '#d6cbff',
  toneSky: '#b8dcff',
  toneRose: '#ffc6d6',
  onTone: '#1c1c1c',
};

/** Drafted by Dev's dark-mode tokens (`:root[data-theme='dark']`) - deep jewel tones, not the light pastels with swapped text, so block backgrounds stay legible. */
export const DRAFTED_DARK: ImaxtEditorTheme = {
  ...DRAFTED_LIGHT,
  accent: '#6aad91',
  onAccent: '#1c1c1c',
  paper: '#1c1c1c',
  paper2: '#262626',
  card: '#2a2a2a',
  text: '#f4f1e8',
  muted: '#a8a498',
  line: '#f4f1e8',
  hair: 'color-mix(in srgb, #f4f1e8 16%, transparent)',
  toneMint: '#28493b',
  toneLilac: '#40386a',
  toneSky: '#2c4565',
  toneRose: '#5d3446',
  onTone: '#f4f1e8',
};
