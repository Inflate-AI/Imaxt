import { escapeHtml, resolveTone } from './shared.ts';

export interface StatData {
  value: string | number;
  label: string;
  unit?: string;
  note?: string;
  tone?: string;
}

export interface StatRowData {
  items: StatData[];
}

const NUMERIC = /^\d+(\.\d+)?$/;

export function renderStat(data: StatData): string {
  const tone = resolveTone(data.tone);
  const text = String(data.value);
  const numeric = NUMERIC.test(text);
  const dataTo = numeric ? ` data-to="${escapeHtml(text)}"` : '';
  const unit = data.unit ? `<span class="imx-stat-u">${escapeHtml(data.unit)}</span>` : '';
  const note = data.note ? `<div class="imx-stat-n">${escapeHtml(data.note)}</div>` : '';
  return (
    `<div class="imx imx-stat-wrap"><div class="imx-stat imx-slab" data-tone="${tone}">` +
    `<div class="imx-stat-v"><span class="imx-count"${dataTo}>${escapeHtml(text)}</span>${unit}</div>` +
    `<div class="imx-label imx-stat-l">${escapeHtml(data.label)}</div>${note}</div></div>`
  );
}

export function renderStatRow(data: StatRowData): string {
  return `<div class="imx"><div class="imx-statrow">${data.items.map(renderStat).join('')}</div></div>`;
}

/**
 * Counts a numeric Stat up from zero once it first scrolls into view. The final value is
 * already in the markup, so this is a no-op under `prefers-reduced-motion: reduce`.
 */
export function attachStatCountUp(root: ParentNode = document): () => void {
  const reduce =
    typeof globalThis.matchMedia === 'function' &&
    globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const elements = [...root.querySelectorAll<HTMLElement>('.imx-count[data-to]')];
  if (reduce || elements.length === 0) {
    return () => {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        const el = entry.target as HTMLElement;
        const to = Number(el.dataset.to);
        const decimals = (el.dataset.to?.split('.')[1] ?? '').length;
        const start = performance.now();
        const tick = (now: number) => {
          const k = Math.min(1, (now - start) / 900);
          el.textContent = (to * (1 - (1 - k) ** 3)).toFixed(decimals);
          if (k < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    },
    { threshold: 0.6 },
  );
  elements.forEach((el) => {
    observer.observe(el);
  });
  return () => observer.disconnect();
}
