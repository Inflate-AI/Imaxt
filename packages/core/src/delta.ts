import { escapeHtml, resolveTone } from './shared.ts';

export interface DeltaData {
  label: string;
  from: string | number;
  to: string | number;
  unit?: string;
  tone?: string;
}

function direction(from: DeltaData['from'], to: DeltaData['to']): 'up' | 'down' | 'same' | null {
  if (typeof from !== 'number' || typeof to !== 'number') return null;
  if (to > from) return 'up';
  if (to < from) return 'down';
  return 'same';
}

export function renderDelta(data: DeltaData): string {
  const tone = resolveTone(data.tone);
  const unit = data.unit ?? '';
  const dir = direction(data.from, data.to);
  const dirAttr = dir ? ` data-direction="${dir}"` : '';
  return (
    `<div class="imx"><div class="imx-delta" data-tone="${tone}"${dirAttr}>` +
    `<span class="imx-delta-l">${escapeHtml(data.label)}</span>` +
    `<span class="imx-delta-vals"><span class="imx-delta-from">${escapeHtml(String(data.from))}${escapeHtml(unit)}</span>` +
    `<span class="imx-delta-arrow" aria-hidden="true">→</span>` +
    `<span class="imx-delta-to">${escapeHtml(String(data.to))}${escapeHtml(unit)}</span></span></div></div>`
  );
}
