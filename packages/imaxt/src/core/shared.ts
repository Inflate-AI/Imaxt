export const TONES = ['mint', 'lilac', 'sky', 'rose', 'accent', 'ink', 'white'] as const;

export type Tone = (typeof TONES)[number];

export function resolveTone(tone: string | undefined): Tone {
  return (TONES as readonly string[]).includes(tone ?? '') ? (tone as Tone) : 'ink';
}

const HEX_COLOR = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

/** True for a tone value that's a literal color (e.g. `#5b3df0`) rather than one of the named presets. */
export function isCustomTone(tone: string | undefined): boolean {
  return typeof tone === 'string' && HEX_COLOR.test(tone.trim());
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.length === 4 ? [...hex.slice(1)].map((c) => c + c).join('') : hex.slice(1);
  const n = Number.parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const [cr, cg, cb] = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * (cr ?? 0) + 0.7152 * (cg ?? 0) + 0.0722 * (cb ?? 0);
}

/** Picks a readable ink/paper text color for an arbitrary background, by WCAG relative luminance. */
export function autoOnColor(hex: string): string {
  return relativeLuminance(hexToRgb(hex)) > 0.5 ? '#1c1c1c' : '#f4f1e8';
}

/**
 * Renders the `data-tone`/`style` attributes for a tone value: one of the
 * seven named presets (`data-tone="mint"` etc - themed via `[data-tone]` in
 * styles.css, with readable text guaranteed in both light and dark mode), or
 * a literal `#rrggbb`/`#rgb` custom color, applied as inline `--imx-tone`/
 * `--imx-on` custom properties with a contrast-safe text color chosen
 * automatically.
 */
export function toneAttrs(tone: string | undefined): string {
  if (isCustomTone(tone)) {
    const hex = (tone as string).trim();
    return ` data-tone="custom" style="--imx-tone:${hex};--imx-on:${autoOnColor(hex)}"`;
  }
  return ` data-tone="${resolveTone(tone)}"`;
}

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char] ?? char);
}

export function classNames(...parts: Array<string | false | null | undefined>): string {
  return parts.filter((part): part is string => Boolean(part)).join(' ');
}

export function prefersReducedMotion(): boolean {
  if (typeof globalThis.matchMedia !== 'function') return false;
  return globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
