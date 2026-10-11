import { escapeHtml, resolveTone } from './shared.ts';

export interface ScorecardItem {
  label: string;
  value: string | number;
  unit?: string;
  delta?: string;
}

export interface ScorecardData {
  items: ScorecardItem[];
  tone?: string;
}

export function renderScorecard(data: ScorecardData): string {
  const tone = resolveTone(data.tone);
  const items = data.items
    .map(
      (item) =>
        `<li class="imx-score-i"><span class="imx-score-v">${escapeHtml(String(item.value))}` +
        (item.unit ? `<span class="imx-score-u">${escapeHtml(item.unit)}</span>` : '') +
        '</span>' +
        `<span class="imx-score-l">${escapeHtml(item.label)}</span>` +
        (item.delta ? `<span class="imx-score-d">${escapeHtml(item.delta)}</span>` : '') +
        '</li>',
    )
    .join('');
  return `<div class="imx"><ul class="imx-scorecard" data-tone="${tone}">${items}</ul></div>`;
}
