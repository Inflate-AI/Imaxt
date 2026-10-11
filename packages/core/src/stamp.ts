import { escapeHtml, resolveTone } from './shared.ts';

export interface StampData {
  text: string;
  angle?: number;
  tone?: string;
}

export function renderStamp(data: StampData): string {
  const tone = resolveTone(data.tone);
  const angle = data.angle ?? -8;
  return (
    `<div class="imx"><span class="imx-stamp" data-tone="${tone}" style="--a:${angle}deg">` +
    `${escapeHtml(data.text)}</span></div>`
  );
}
