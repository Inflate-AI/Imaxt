import { classNames, escapeHtml, resolveTone } from './shared.ts';

export interface CurvedTextData {
  text: string;
  shape?: 'arc' | 'wave' | 'circle';
  mark?: string;
  tone?: string;
  spin?: boolean;
  decorative?: boolean;
}

const PATHS = {
  arc: 'M 20 150 Q 200 -30 380 150',
  wave: 'M 10 90 C 80 10, 140 170, 200 90 S 320 10, 390 90',
  circle: 'M 100 100 m -66 0 a 66 66 0 1 1 132 0 a 66 66 0 1 1 -132 0',
};

function hashId(seed: string): string {
  let hash = 7;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return `ct${hash.toString(36)}`;
}

export function renderCurvedText(data: CurvedTextData): string {
  const shape = data.shape ?? 'arc';
  const circle = shape === 'circle';
  const id = hashId(data.text + shape);
  const view = circle ? '0 0 200 200' : shape === 'arc' ? '0 25 400 115' : '0 0 400 180';
  // A circle repeats its text around the ring so the whole circumference is filled.
  const ring = circle
    ? `${Array.from(
        { length: Math.max(1, Math.round(420 / (data.text.length * 11 + 22))) },
        () => data.text,
      ).join('  ·  ')}  ·  `
    : data.text;

  const a11y = data.decorative
    ? ' aria-hidden="true"'
    : ` role="img" aria-label="${escapeHtml(data.text)}"`;
  const tone = data.tone ? ` data-tone="${resolveTone(data.tone)}"` : '';
  const spinClass = circle && data.spin ? ' imx-spin' : '';
  const disc = circle ? '<circle cx="100" cy="100" r="96" class="imx-curved-disc" />' : '';
  const mark =
    circle && data.mark
      ? `<text x="100" y="100" class="imx-curved-mark" text-anchor="middle" dominant-baseline="central" aria-hidden="true">${escapeHtml(data.mark)}</text>`
      : '';
  const textPathAttrs = circle
    ? ` startOffset="0" text-anchor="start" textLength="410" lengthAdjust="spacing"`
    : ` startOffset="50%" text-anchor="middle"`;

  return (
    `<div class="${classNames('imx', 'imx-curved')}" data-shape="${shape}">` +
    `<svg viewBox="${view}"${a11y}${tone} class="${spinClass.trim()}">` +
    `${disc}<defs><path id="${id}" d="${PATHS[shape]}" fill="none" /></defs>` +
    `<text class="imx-curved-t" aria-hidden="true"><textPath href="#${id}"${textPathAttrs}>${escapeHtml(ring)}</textPath></text>` +
    `${mark}</svg></div>`
  );
}
