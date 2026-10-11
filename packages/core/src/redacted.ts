import { escapeHtml } from './shared.ts';

export interface RedactedData {
  html: string;
  revealLabel?: string;
}

export function renderRedacted(data: RedactedData): string {
  const label = escapeHtml(data.revealLabel ?? 'Reveal');
  return (
    `<span class="imx-redacted"><details class="imx-redacted-d">` +
    `<summary class="imx-redacted-bar" aria-label="${label}"></summary>` +
    `<span class="imx-redacted-body">${data.html}</span></details></span>`
  );
}
