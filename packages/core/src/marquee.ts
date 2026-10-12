import { classNames, escapeHtml, toneAttrs } from './shared.ts';

export interface MarqueeData {
  words: string[];
  tone?: string;
  bleed?: boolean;
  seconds?: number;
}

export function renderMarquee(data: MarqueeData): string {
  const seconds = data.seconds ?? 34;
  // Each set must be wider than the screen so the loop has no gap.
  const run = Array.from({ length: 4 }, () => data.words).flat();
  const wrapClass = classNames('imx', data.bleed && 'imx-bleed');
  const label = escapeHtml(data.words.join(', '));

  const set = (dup: boolean) =>
    `<div class="${classNames('imx-marquee-set', dup && 'dup')}" aria-hidden="true">${run
      .map(
        (word, i) =>
          `<span class="imx-marquee-w" data-v="${i % 2}">${escapeHtml(word)}</span>` +
          `<span class="imx-marquee-w imx-marquee-s">—</span>`,
      )
      .join('')}</div>`;

  return (
    `<div class="${wrapClass}"${toneAttrs(data.tone)}>` +
    `<div class="imx-marquee" role="img" aria-label="${label}" style="--dur:${seconds}s">` +
    `<div class="imx-marquee-track">${set(false)}${set(true)}</div></div></div>`
  );
}
