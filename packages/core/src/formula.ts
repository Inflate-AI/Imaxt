import katex from 'katex';
import { escapeHtml } from './shared.ts';

export interface FormulaData {
  tex: string;
  display?: boolean;
  caption?: string;
}

export function renderFormula(data: FormulaData): string {
  const math = katex.renderToString(data.tex, {
    displayMode: Boolean(data.display),
    throwOnError: false,
    output: 'html',
  });
  const caption = data.caption
    ? `<figcaption class="imx-formula-cap">${escapeHtml(data.caption)}</figcaption>`
    : '';
  return (
    `<div class="imx"><figure class="imx-formula" data-display="${Boolean(data.display)}">` +
    `${math}${caption}</figure></div>`
  );
}
