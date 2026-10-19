import { escapeHtml } from './shared.ts';

export interface GlossaryItem {
  term: string;
  definition: string;
}

export interface GlossaryData {
  items: GlossaryItem[];
}

export function renderGlossary(data: GlossaryData): string {
  const items = data.items
    .map(
      (item) =>
        `<dt class="imx-glossary-t">${escapeHtml(item.term)}</dt>` +
        `<dd class="imx-glossary-d">${escapeHtml(item.definition)}</dd>`,
    )
    .join('');
  return `<div class="imx"><dl class="imx-glossary">${items}</dl></div>`;
}
