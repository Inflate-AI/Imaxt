import { escapeHtml } from './shared.ts';

export interface ChecklistItem {
  text: string;
  done?: boolean;
}

export interface ChecklistData {
  items: ChecklistItem[];
  title?: string;
}

export function renderChecklist(data: ChecklistData): string {
  const title = data.title
    ? `<span class="imx-label imx-checklist-t">${escapeHtml(data.title)}</span>`
    : '';
  const items = data.items
    .map((item) => {
      const glyph = item.done ? '✓' : '□';
      return (
        `<li class="imx-checklist-i" data-done="${Boolean(item.done)}">` +
        `<span class="imx-checklist-g" aria-hidden="true">${glyph}</span>` +
        `${escapeHtml(item.text)}</li>`
      );
    })
    .join('');
  return `<div class="imx">${title}<ul class="imx-checklist">${items}</ul></div>`;
}
