import { escapeHtml, resolveTone } from './shared.ts';

export interface VersusSide {
  label: string;
  html: string;
}

export interface VersusData {
  sides: [VersusSide, VersusSide];
  vsLabel?: string;
  tone?: string;
}

function renderSide(side: VersusSide): string {
  return (
    `<div class="imx-versus-side"><span class="imx-versus-l">${escapeHtml(side.label)}</span>` +
    `<div class="imx-versus-b">${side.html}</div></div>`
  );
}

export function renderVersus(data: VersusData): string {
  const tone = resolveTone(data.tone);
  const vsLabel = escapeHtml(data.vsLabel ?? 'VS');
  return (
    `<div class="imx"><div class="imx-versus" data-tone="${tone}">` +
    `${renderSide(data.sides[0])}<span class="imx-vs">${vsLabel}</span>${renderSide(data.sides[1])}` +
    '</div></div>'
  );
}
