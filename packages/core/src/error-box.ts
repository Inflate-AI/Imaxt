import { escapeHtml } from './shared.ts';

export interface ErrorBoxData {
  title: string;
  message: string;
  stack?: string;
}

export function renderErrorBox(data: ErrorBoxData): string {
  const stack = data.stack ? `<pre class="imx-errorbox-stack">${escapeHtml(data.stack)}</pre>` : '';
  return (
    `<div class="imx"><div class="imx-errorbox">` +
    `<span class="imx-errorbox-t">${escapeHtml(data.title)}</span>` +
    `<p class="imx-errorbox-m">${escapeHtml(data.message)}</p>${stack}</div></div>`
  );
}
