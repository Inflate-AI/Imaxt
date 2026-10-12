import type { HeatmapData } from '@inflate-ai/imaxt-core';
import type { JSX } from 'react';

function resize<T>(arr: T[], length: number, fill: () => T): T[] {
  const next = arr.slice(0, length);
  while (next.length < length) next.push(fill());
  return next;
}

function resizeData(next: HeatmapData): HeatmapData['data'] {
  const rows = next.data.map((row) => resize(row, next.cols.length, () => 0));
  return resize(rows, next.rows.length, () => next.cols.map(() => 0));
}

export function HeatmapBlock({
  data,
  onChange,
}: {
  data: HeatmapData;
  onChange: (next: HeatmapData) => void;
}): JSX.Element {
  const setRows = (text: string) => {
    const rows = text
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const next = { ...data, rows };
    onChange({ ...next, data: resizeData(next) });
  };
  const setCols = (text: string) => {
    const cols = text
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const next = { ...data, cols };
    onChange({ ...next, data: resizeData(next) });
  };
  const setCell = (r: number, c: number, value: number) => {
    const grid = data.data.map((row) => row.slice());
    const row = grid[r];
    if (row) row[c] = value;
    onChange({ ...data, data: grid });
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
          value={data.caption}
          onChange={(e) => onChange({ ...data, caption: e.target.value })}
        />
      </label>
      <label className="imx-ed-field">
        <span>Unit</span>
        <input
          type="text"
          value={data.unit ?? ''}
          onChange={(e) => onChange({ ...data, unit: e.target.value || undefined })}
        />
      </label>
      <label className="imx-ed-field">
        <span>Min</span>
        <input
          type="number"
          value={data.min ?? ''}
          onChange={(e) =>
            onChange({ ...data, min: e.target.value === '' ? undefined : Number(e.target.value) })
          }
        />
      </label>
      <label className="imx-ed-field">
        <span>Max</span>
        <input
          type="number"
          value={data.max ?? ''}
          onChange={(e) =>
            onChange({ ...data, max: e.target.value === '' ? undefined : Number(e.target.value) })
          }
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
                      type="number"
                      value={data.data[r]?.[c] ?? 0}
                      onChange={(e) => setCell(r, c, Number(e.target.value))}
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
