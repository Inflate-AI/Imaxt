import { escapeHtml, resolveTone } from './shared.ts';

export interface BarItem {
  label: string;
  value: number;
}

export interface BarsData {
  items: BarItem[];
  max?: number;
  unit?: string;
  tone?: string;
}

export function renderBars(data: BarsData): string {
  const tone = resolveTone(data.tone);
  const unit = data.unit ?? '';
  const max = data.max ?? Math.max(...data.items.map((item) => item.value), 1);
  const bars = data.items
    .map((item) => {
      const width = Math.max(2, Math.min(100, (item.value / max) * 100));
      return (
        `<li class="imx-bar"><span class="imx-bar-l">${escapeHtml(item.label)}</span>` +
        `<span class="imx-bar-track" aria-hidden="true"><span class="imx-bar-fill" style="--w:${width}%"></span></span>` +
        `<span class="imx-bar-v">${escapeHtml(String(item.value))}${escapeHtml(unit)}</span></li>`
      );
    })
    .join('');
  return `<div class="imx"><ul class="imx-bars" data-tone="${tone}">${bars}</ul></div>`;
}
