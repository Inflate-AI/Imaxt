import { escapeHtml } from './shared.ts';

export interface TakeawaysData {
  items: string[];
  title?: string;
}

export function renderTakeaways(data: TakeawaysData): string {
  const title = data.title
    ? `<span class="imx-label imx-takeaways-t">${escapeHtml(data.title)}</span>`
    : '';
  const items = data.items
    .map((item) => `<li class="imx-takeaways-i">${escapeHtml(item)}</li>`)
    .join('');
  return `<div class="imx"><div class="imx-takeaways imx-slab">${title}<ul>${items}</ul></div></div>`;
}
