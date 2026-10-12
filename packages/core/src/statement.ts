import { classNames, toneAttrs } from './shared.ts';

export interface StatementData {
  html: string;
  tone?: string;
  align?: 'left' | 'center';
  wide?: boolean;
  bleed?: boolean;
}

export function renderStatement(data: StatementData): string {
  const align = data.align ?? 'left';
  const wrapClass = classNames('imx', data.wide && 'imx-wide', data.bleed && 'imx-bleed');
  return `<div class="${wrapClass}"><div class="imx-statement imx-slab"${toneAttrs(data.tone)} data-align="${align}">${data.html}</div></div>`;
}
