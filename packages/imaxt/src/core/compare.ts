import { classNames, escapeHtml, resolveTone } from './shared.ts';

export interface SideData {
  html: string;
  label?: string;
  kind?: 'before' | 'after';
  tone?: string;
}

export interface CompareData {
  sides: [SideData, SideData];
  wide?: boolean;
}

export function renderSide(data: SideData): string {
  const kind = data.kind ?? 'after';
  const tone = data.tone ? resolveTone(data.tone) : kind === 'after' ? 'accent' : undefined;
  const toneAttr = tone ? ` data-tone="${tone}"` : '';
  const wrapClass = classNames('imx-side', kind !== 'before' && 'imx-slab');
  const label = data.label
    ? `<span class="imx-label imx-side-l">${escapeHtml(data.label)}</span>`
    : '';
  return `<div class="${wrapClass}" data-kind="${kind}"${toneAttr}>${label}<div class="imx-side-b">${data.html}</div></div>`;
}

export function renderCompare(data: CompareData): string {
  const wrapClass = classNames('imx', data.wide && 'imx-wide');
  const sides = data.sides.map(renderSide).join('');
  return (
    `<div class="${wrapClass}"><div class="imx-compare" role="group" aria-label="Comparison">` +
    `${sides}<span class="imx-vs" aria-hidden="true">VS</span></div></div>`
  );
}
