import { escapeHtml, resolveTone } from './shared.ts';

export interface BannerData {
  text: string;
  tone?: string;
}

export function renderBanner(data: BannerData): string {
  const tone = resolveTone(data.tone);
  return (
    `<div class="imx"><div class="imx-banner" data-tone="${tone}">` +
    `<span class="imx-banner-t">${escapeHtml(data.text)}</span></div></div>`
  );
}
