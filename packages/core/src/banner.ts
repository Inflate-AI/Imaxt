import { escapeHtml, toneAttrs } from './shared.ts';

export interface BannerData {
  text: string;
  tone?: string;
}

export function renderBanner(data: BannerData): string {
  return (
    `<div class="imx"><div class="imx-banner"${toneAttrs(data.tone)}>` +
    `<span class="imx-banner-t">${escapeHtml(data.text)}</span></div></div>`
  );
}
