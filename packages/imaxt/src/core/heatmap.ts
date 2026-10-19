import { classNames, escapeHtml } from './shared.ts';

export interface HeatmapData {
  rows: string[];
  cols: string[];
  data: number[][];
  caption: string;
  unit?: string;
  min?: number;
  max?: number;
  wide?: boolean;
}

export function renderHeatmap(data: HeatmapData): string {
  const unit = data.unit ?? '';
  const flat = data.data.flat();
  const min = data.min ?? Math.min(...flat);
  const max = data.max ?? Math.max(...flat);
  // The cell colour is the accent mixed into the surface colour, capped so the printed number
  // keeps AA contrast; the number itself is always printed too.
  const pct = (v: number) => (6 + 49 * (max === min ? 0 : (v - min) / (max - min))).toFixed(1);

  const head = `<tr><td></td>${data.cols.map((c) => `<th scope="col">${escapeHtml(c)}</th>`).join('')}</tr>`;
  const body = data.rows
    .map((row, i) => {
      const cells = (data.data[i] ?? [])
        .map((v) => `<td style="--p:${pct(v)}%">${escapeHtml(String(v))}${escapeHtml(unit)}</td>`)
        .join('');
      return `<tr><th scope="row">${escapeHtml(row)}</th>${cells}</tr>`;
    })
    .join('');

  const wrapClass = classNames('imx', data.wide && 'imx-wide');
  return (
    `<div class="${wrapClass}"><div class="imx-heat-wrap" role="region" aria-label="${escapeHtml(data.caption)}" tabindex="0">` +
    `<table class="imx-heat"><caption class="imx-label">${escapeHtml(data.caption)}</caption>` +
    `<thead>${head}</thead><tbody>${body}</tbody></table></div>` +
    `<div class="imx-heat-legend" aria-hidden="true"><span class="imx-label">${escapeHtml(String(min))}${escapeHtml(unit)}</span>` +
    `<span class="imx-heat-ramp"></span><span class="imx-label">${escapeHtml(String(max))}${escapeHtml(unit)}</span></div></div>`
  );
}
