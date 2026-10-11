import { escapeHtml } from './shared.ts';

export interface SparklineData {
  values: number[];
  label?: string;
}

function summarize(values: number[]): string {
  if (values.length === 0) return 'No data';
  const min = Math.min(...values);
  const max = Math.max(...values);
  const last = values.at(-1) ?? 0;
  const first = values[0] ?? 0;
  const trend = last > first ? 'up' : last < first ? 'down' : 'flat';
  return `Trend ${trend}, from ${first} to ${last}, ranging ${min} to ${max}`;
}

function points(values: number[]): string {
  if (values.length === 0) return '';
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  return values
    .map((value, index) => {
      const x = values.length === 1 ? 0 : (index / (values.length - 1)) * 100;
      const y = 100 - ((value - min) / span) * 100;
      return `${x},${y}`;
    })
    .join(' ');
}

export function renderSparkline(data: SparklineData): string {
  const summary = escapeHtml(summarize(data.values));
  const label = data.label ? `<span class="imx-spark-l">${escapeHtml(data.label)}</span>` : '';
  return (
    `<span class="imx-spark-wrap">${label}` +
    `<span class="imx-spark" role="img" aria-label="${summary}">` +
    `<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">` +
    `<polyline points="${points(data.values)}" fill="none" stroke="currentColor" stroke-width="4"></polyline></svg></span></span>`
  );
}
