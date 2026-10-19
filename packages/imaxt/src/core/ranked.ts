import { escapeHtml, resolveTone } from './shared.ts';

export interface RankedItem {
  label: string;
  value?: string;
  delta?: number | 'new' | 'same';
}

export interface RankedData {
  items: RankedItem[];
  unit?: string;
  tone?: string;
}

function renderDelta(delta: RankedItem['delta']): string {
  if (delta === undefined) return '';
  if (delta === 'new') return '<span class="imx-ranked-d" data-delta="new">New</span>';
  if (delta === 'same' || delta === 0) {
    return '<span class="imx-ranked-d" data-delta="same">–</span>';
  }
  const direction = delta > 0 ? 'up' : 'down';
  const arrow = delta > 0 ? '▲' : '▼';
  return `<span class="imx-ranked-d" data-delta="${direction}">${arrow} ${escapeHtml(String(Math.abs(delta)))}</span>`;
}

export function renderRanked(data: RankedData): string {
  const tone = resolveTone(data.tone);
  const unit = data.unit ?? '';
  const items = data.items
    .map(
      (item, index) =>
        `<li class="imx-ranked-i"><span class="imx-ranked-n">${index + 1}</span>` +
        `<span class="imx-ranked-l">${escapeHtml(item.label)}</span>` +
        (item.value !== undefined
          ? `<span class="imx-ranked-v">${escapeHtml(item.value)}${escapeHtml(unit)}</span>`
          : '') +
        renderDelta(item.delta) +
        '</li>',
    )
    .join('');
  return `<div class="imx"><ol class="imx-ranked" data-tone="${tone}">${items}</ol></div>`;
}
