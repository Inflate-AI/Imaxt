import { escapeHtml } from './shared.ts';

export interface FootnoteData {
  marker?: string;
  html: string;
}

export function renderFootnote(data: FootnoteData): string {
  const marker = escapeHtml(data.marker ?? '*');
  return (
    `<span class="imx-footnote"><details class="imx-footnote-d">` +
    `<summary class="imx-footnote-m" aria-label="Footnote">${marker}</summary>` +
    `<span class="imx-footnote-b">${data.html}</span></details></span>`
  );
}
