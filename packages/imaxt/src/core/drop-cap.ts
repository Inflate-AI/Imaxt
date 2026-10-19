import { escapeHtml, resolveTone } from './shared.ts';

export interface DropCapData {
  html: string;
  tone?: string;
}

export function renderDropCap(data: DropCapData): string {
  const tone = resolveTone(data.tone);
  const match = data.html.match(/^(\s*)([^<\s])([\s\S]*)$/);
  const body = match
    ? `${escapeHtml(match[1] ?? '')}<span class="imx-dropcap-l">${escapeHtml(match[2] ?? '')}</span>${match[3] ?? ''}`
    : data.html;
  return `<p class="imx" data-tone="${tone}"><span class="imx-dropcap">${body}</span></p>`;
}
