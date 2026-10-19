import { escapeHtml } from './shared.ts';

export type MatrixCell = 'yes' | 'no' | 'partial' | string;

export interface MatrixData {
  rows: string[];
  cols: string[];
  cells: MatrixCell[][];
  caption?: string;
}

const CELL_GLYPH: Record<string, string> = {
  yes: '✓ Yes',
  no: '✕ No',
  partial: '◑ Partial',
};

function renderCell(cell: MatrixCell): string {
  const text = CELL_GLYPH[cell] ?? cell;
  return `<td class="imx-matrix-c" data-cell="${escapeHtml(cell)}">${escapeHtml(text)}</td>`;
}

export function renderMatrix(data: MatrixData): string {
  const caption = data.caption ? `<caption>${escapeHtml(data.caption)}</caption>` : '';
  const head = `<tr><th scope="col"></th>${data.cols
    .map((col) => `<th scope="col">${escapeHtml(col)}</th>`)
    .join('')}</tr>`;
  const body = data.rows
    .map(
      (row, rowIndex) =>
        `<tr><th scope="row">${escapeHtml(row)}</th>${(data.cells[rowIndex] ?? [])
          .map(renderCell)
          .join('')}</tr>`,
    )
    .join('');
  return (
    `<div class="imx"><div class="imx-matrix-wrap"><table class="imx-matrix">${caption}` +
    `<thead>${head}</thead><tbody>${body}</tbody></table></div></div>`
  );
}
