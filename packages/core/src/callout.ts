import { escapeHtml } from './shared.ts';

export type CalloutKind = 'note' | 'warning' | 'danger' | 'tip';

export interface CalloutData {
  kind?: CalloutKind;
  title?: string;
  html: string;
}

const KIND_LABEL: Record<CalloutKind, string> = {
  note: 'Note',
  warning: 'Warning',
  danger: 'Danger',
  tip: 'Tip',
};

export function renderCallout(data: CalloutData): string {
  const kind = data.kind ?? 'note';
  const title = data.title ? `<span class="imx-callout-t">${escapeHtml(data.title)}</span>` : '';
  return (
    `<div class="imx"><aside class="imx-callout" data-kind="${kind}">` +
    `<span class="imx-label">${KIND_LABEL[kind]}</span>${title}` +
    `<div class="imx-callout-b">${data.html}</div></aside></div>`
  );
}
