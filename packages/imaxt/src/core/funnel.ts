import { escapeHtml, resolveTone } from './shared.ts';

export interface FunnelStage {
  label: string;
  value: number;
}

export interface FunnelData {
  stages: FunnelStage[];
  unit?: string;
  tone?: string;
}

export function renderFunnel(data: FunnelData): string {
  const tone = resolveTone(data.tone);
  const unit = data.unit ?? '';
  const first = data.stages[0]?.value ?? 1;
  const stages = data.stages
    .map((stage, index) => {
      const width = Math.max(2, Math.min(100, (stage.value / (first || 1)) * 100));
      const previous = data.stages[index - 1];
      const dropoff =
        previous && previous.value > 0
          ? `<span class="imx-funnel-d">${escapeHtml(
              `${Math.round((stage.value / previous.value) * 100)}%`,
            )}</span>`
          : '';
      return (
        `<li class="imx-funnel-s"><span class="imx-funnel-l">${escapeHtml(stage.label)}</span>` +
        `<span class="imx-funnel-track" aria-hidden="true"><span class="imx-funnel-fill" style="--w:${width}%"></span></span>` +
        `<span class="imx-funnel-v">${escapeHtml(String(stage.value))}${escapeHtml(unit)}</span>${dropoff}</li>`
      );
    })
    .join('');
  return `<div class="imx"><ol class="imx-funnel" data-tone="${tone}">${stages}</ol></div>`;
}
