import { escapeHtml } from './shared.ts';

export interface SidenoteData {
  html: string;
  label?: string;
}

export function renderSidenote(data: SidenoteData): string {
  const label = escapeHtml(data.label ?? 'Note');
  return `<aside class="imx-note"><span class="imx-label">${label}</span>${data.html}</aside>`;
}
