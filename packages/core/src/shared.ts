export const TONES = ['mint', 'lilac', 'sky', 'rose', 'accent', 'ink'] as const;

export type Tone = (typeof TONES)[number];

export function resolveTone(tone: string | undefined): Tone {
  return (TONES as readonly string[]).includes(tone ?? '') ? (tone as Tone) : 'ink';
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
