import { escapeHtml } from './shared.ts';

export interface DiffData {
  before: string;
  after: string;
  lang?: string;
}

interface DiffLine {
  kind: 'same' | 'add' | 'del';
  text: string;
}

function lcsTable(before: string[], after: string[]): number[][] {
  const n = before.length;
  const m = after.length;
  const table: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  const at = (i: number, j: number) => table[i]?.[j] ?? 0;
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      const row = table[i];
      if (!row) continue;
      row[j] = before[i] === after[j] ? at(i + 1, j + 1) + 1 : Math.max(at(i + 1, j), at(i, j + 1));
    }
  }
  return table;
}

function diffLines(before: string[], after: string[]): DiffLine[] {
  const table = lcsTable(before, after);
  const at = (i: number, j: number) => table[i]?.[j] ?? 0;
  const result: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < before.length && j < after.length) {
    const beforeLine = before[i] ?? '';
    const afterLine = after[j] ?? '';
    if (beforeLine === afterLine) {
      result.push({ kind: 'same', text: beforeLine });
      i++;
      j++;
    } else if (at(i + 1, j) >= at(i, j + 1)) {
      result.push({ kind: 'del', text: beforeLine });
      i++;
    } else {
      result.push({ kind: 'add', text: afterLine });
      j++;
    }
  }
  while (i < before.length) {
    result.push({ kind: 'del', text: before[i] ?? '' });
    i++;
  }
  while (j < after.length) {
    result.push({ kind: 'add', text: after[j] ?? '' });
    j++;
  }
  return result;
}

function renderLine(line: DiffLine): string {
  const prefix = line.kind === 'add' ? '+' : line.kind === 'del' ? '-' : ' ';
  return (
    `<div class="imx-diff-line" data-kind="${line.kind}">` +
    `<span class="imx-diff-prefix">${escapeHtml(prefix)}</span>` +
    `<span class="imx-diff-text">${escapeHtml(line.text)}</span></div>`
  );
}

export function renderDiff(data: DiffData): string {
  const lines = diffLines(data.before.split('\n'), data.after.split('\n'));
  const rendered = lines.map(renderLine).join('');
  return (
    `<div class="imx"><pre class="imx-diff" data-lang="${escapeHtml(data.lang ?? '')}">` +
    `${rendered}</pre></div>`
  );
}
