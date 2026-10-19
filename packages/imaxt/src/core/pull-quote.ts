import { classNames, escapeHtml } from './shared.ts';

export interface PullQuoteData {
  html: string;
  by?: string;
  wide?: boolean;
}

export function renderPullQuote(data: PullQuoteData): string {
  const wrapClass = classNames('imx', data.wide && 'imx-wide');
  const caption = data.by
    ? `<figcaption class="imx-label imx-quote-by">— ${escapeHtml(data.by)}</figcaption>`
    : '';
  return `<div class="${wrapClass}"><figure class="imx-quote"><blockquote class="imx-quote-t">${data.html}</blockquote>${caption}</figure></div>`;
}
