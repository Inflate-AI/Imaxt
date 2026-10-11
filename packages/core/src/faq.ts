import { escapeHtml } from './shared.ts';

export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqData {
  items: FaqItem[];
}

export function renderFaq(data: FaqData): string {
  const items = data.items
    .map(
      (item) =>
        `<details class="imx-faq-i"><summary class="imx-faq-q">${escapeHtml(item.q)}</summary>` +
        `<div class="imx-faq-a">${escapeHtml(item.a)}</div></details>`,
    )
    .join('');
  return `<div class="imx"><div class="imx-faq">${items}</div></div>`;
}
