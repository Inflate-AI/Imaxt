import type { JSX } from 'react';
import type { MatrixData } from '../../core/index.ts';

function resize<T>(arr: T[], length: number, fill: () => T): T[] {
  const next = arr.slice(0, length);
  while (next.length < length) next.push(fill());
  return next;
}

function resizeCells(data: MatrixData): MatrixData['cells'] {
  const cells = data.cells.map((row) => resize(row, data.cols.length, () => ''));
  return resize(cells, data.rows.length, () => data.cols.map(() => ''));
}

export function MatrixBlock({
  data,
  onChange,
}: {
  data: MatrixData;
  onChange: (next: MatrixData) => void;
}): JSX.Element {
  const setRows = (text: string) => {
    const rows = text
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const next = { ...data, rows };
    onChange({ ...next, cells: resizeCells(next) });
  };
  const setCols = (text: string) => {
    const cols = text
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const next = { ...data, cols };
    onChange({ ...next, cells: resizeCells(next) });
  };
  const setCell = (r: number, c: number, value: string) => {
    const cells = data.cells.map((row) => row.slice());
    const row = cells[r];
    if (row) row[c] = value;
    onChange({ ...data, cells });
  };

  return (
    <div className="imx-ed-form">
      <label className="imx-ed-field imx-ed-field-wide">
        <span>Rows (one per line)</span>
        <textarea value={data.rows.join('\n')} onChange={(e) => setRows(e.target.value)} />
      </label>
      <label className="imx-ed-field imx-ed-field-wide">
        <span>Columns (one per line)</span>
        <textarea value={data.cols.join('\n')} onChange={(e) => setCols(e.target.value)} />
      </label>
      <label className="imx-ed-field">
        <span>Caption</span>
        <input
          type="text"
          value={data.caption ?? ''}
          onChange={(e) => onChange({ ...data, caption: e.target.value || undefined })}
        />
      </label>
      {data.rows.length > 0 && data.cols.length > 0 && (
        <table className="imx-ed-grid">
          <thead>
            <tr>
              <th />
              {data.cols.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, r) => (
              <tr key={row}>
                <th>{row}</th>
                {data.cols.map((col, c) => (
                  <td key={col}>
                    <input
                      type="text"
                      value={data.cells[r]?.[c] ?? ''}
                      onChange={(e) => setCell(r, c, e.target.value)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
