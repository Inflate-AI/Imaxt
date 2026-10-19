import { escapeHtml } from './shared.ts';

export interface EmbedData {
  url: string;
  caption?: string;
}

export function renderEmbed(data: EmbedData): string {
  const caption = data.caption
    ? `<figcaption class="imx-embed-cap">${escapeHtml(data.caption)}</figcaption>`
    : '';
  return (
    `<div class="imx"><figure class="imx-embed">` +
    `<a class="imx-embed-link" href="${escapeHtml(data.url)}" target="_blank" ` +
    `rel="noopener noreferrer">${escapeHtml(data.url)}</a>${caption}</figure></div>`
  );
}
