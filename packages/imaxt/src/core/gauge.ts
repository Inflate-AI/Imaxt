import { escapeHtml, resolveTone } from './shared.ts';

export interface GaugeData {
  value: number;
  max: number;
  label?: string;
  unit?: string;
  tone?: string;
}

export function renderGauge(data: GaugeData): string {
  const tone = resolveTone(data.tone);
  const unit = data.unit ?? '';
  const percent = Math.max(0, Math.min(100, (data.value / data.max) * 100));
  const label = data.label ? `<span class="imx-gauge-l">${escapeHtml(data.label)}</span>` : '';
  return (
    `<div class="imx"><div class="imx-gauge" data-tone="${tone}">${label}` +
    `<span class="imx-gauge-track" aria-hidden="true" style="--p:${percent}%"><span class="imx-gauge-fill"></span></span>` +
    `<span class="imx-gauge-v">${escapeHtml(String(data.value))}${escapeHtml(unit)}</span></div></div>`
  );
}
