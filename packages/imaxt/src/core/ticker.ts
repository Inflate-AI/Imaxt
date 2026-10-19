import { escapeHtml, resolveTone } from './shared.ts';

export interface TickerData {
  phrases: string[];
  seconds?: number;
  tone?: string;
}

export function renderTicker(data: TickerData): string {
  const tone = resolveTone(data.tone);
  const seconds = data.seconds ?? 3;
  const items = data.phrases
    .map((phrase, index) => `<li class="imx-ticker-i" data-i="${index}">${escapeHtml(phrase)}</li>`)
    .join('');
  return `<div class="imx"><ul class="imx-ticker" data-tone="${tone}" style="--dur:${seconds}s">${items}</ul></div>`;
}

/**
 * Cycles through a Ticker's phrases one at a time. Without JavaScript, or under
 * `prefers-reduced-motion: reduce`, every phrase stays visible (the render function's default).
 */
export function attachTicker(root: ParentNode = document): () => void {
  const reduce =
    typeof globalThis.matchMedia === 'function' &&
    globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return () => {};

  const disposers: Array<() => void> = [];
  for (const ticker of root.querySelectorAll<HTMLElement>('.imx-ticker')) {
    const items = [...ticker.querySelectorAll<HTMLElement>('.imx-ticker-i')];
    if (items.length === 0) continue;

    ticker.setAttribute('data-js', '');
    const seconds = Number.parseFloat(ticker.style.getPropertyValue('--dur')) || 3;
    let active = 0;
    const show = (index: number) => {
      items.forEach((item, i) => {
        item.setAttribute('data-active', String(i === index));
      });
    };
    show(active);

    const interval = globalThis.setInterval(() => {
      active = (active + 1) % items.length;
      show(active);
    }, seconds * 1000);
    disposers.push(() => globalThis.clearInterval(interval));
  }
  return () => {
    disposers.forEach((dispose) => {
      dispose();
    });
  };
}
