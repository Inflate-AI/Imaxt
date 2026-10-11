import { escapeHtml } from './shared.ts';

export interface CodeWalkStep {
  lines: string;
  title: string;
  text?: string;
}

export interface CodeWalkData {
  code: string;
  steps: CodeWalkStep[];
  wide?: boolean;
  /** Pre-rendered code markup (e.g. syntax-highlighted HTML), used in place of a plain-text rendering of `code`. `code` is still required: it stays the canonical, editable value. */
  html?: string;
}

function renderCodeLines(code: string): string {
  return code
    .split('\n')
    .map((line) => `<span class="line">${escapeHtml(line)}</span>`)
    .join('\n');
}

export function renderCodeWalk(data: CodeWalkData): string {
  const wrapClass = data.wide ? 'imx imx-wide' : 'imx';
  const steps = data.steps
    .map((step) => {
      const text = step.text ? `<div class="imx-walk-sb">${escapeHtml(step.text)}</div>` : '';
      return (
        `<button type="button" class="imx-walk-step" data-lines="${escapeHtml(step.lines)}" aria-pressed="false">` +
        `<div class="imx-walk-st">${escapeHtml(step.title)}</div>${text}</button>`
      );
    })
    .join('');
  const codeHtml = data.html ?? `<pre><code>${renderCodeLines(data.code)}</code></pre>`;
  return (
    `<div class="${wrapClass}"><div class="imx-walk imx-slab">` +
    `<div class="imx-walk-code">${codeHtml}</div>` +
    `<div class="imx-walk-steps" role="group" aria-label="Walkthrough steps">${steps}</div>` +
    `</div></div>`
  );
}

function parseLineSpec(spec: string): Set<number> {
  const out = new Set<number>();
  for (const part of spec.split(',')) {
    const [from, to] = part.split('-');
    const a = Number(from ?? 0);
    const b = to !== undefined ? Number(to) : a;
    for (let n = a; n <= b; n++) out.add(n);
  }
  return out;
}

/** Highlights the lines a step talks about on click. Without JavaScript every line stays visible. */
export function attachCodeWalk(root: ParentNode = document): () => void {
  const disposers: Array<() => void> = [];
  for (const walk of root.querySelectorAll<HTMLElement>('.imx-walk')) {
    const lines = [...walk.querySelectorAll<HTMLElement>('.imx-walk-code .line')];
    const steps = [...walk.querySelectorAll<HTMLButtonElement>('.imx-walk-step')];
    if (!lines.length || !steps.length) continue;

    const activate = (i: number) => {
      const on = parseLineSpec(steps[i]?.dataset.lines ?? '');
      lines.forEach((line, idx) => {
        line.classList.toggle('dim', !on.has(idx + 1));
      });
      steps.forEach((step, j) => {
        step.setAttribute('aria-pressed', String(i === j));
      });
    };

    const handlers = steps.map((step, i) => {
      const handler = () => activate(i);
      step.addEventListener('click', handler);
      return () => step.removeEventListener('click', handler);
    });
    activate(0);
    disposers.push(...handlers);
  }
  return () => {
    disposers.forEach((dispose) => {
      dispose();
    });
  };
}
