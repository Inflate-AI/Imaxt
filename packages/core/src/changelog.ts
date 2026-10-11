import { escapeHtml } from './shared.ts';

export interface ChangelogEntry {
  version: string;
  date?: string;
  items: string[];
}

export interface ChangelogData {
  entries: ChangelogEntry[];
}

function renderEntry(entry: ChangelogEntry): string {
  const date = entry.date ? `<span class="imx-changelog-d">${escapeHtml(entry.date)}</span>` : '';
  const items = entry.items
    .map((item) => `<li class="imx-changelog-i">${escapeHtml(item)}</li>`)
    .join('');
  return (
    `<li class="imx-changelog-e"><span class="imx-changelog-v">${escapeHtml(entry.version)}</span>` +
    `${date}<ul>${items}</ul></li>`
  );
}

export function renderChangelog(data: ChangelogData): string {
  const entries = data.entries.map(renderEntry).join('');
  return `<div class="imx"><ul class="imx-changelog">${entries}</ul></div>`;
}
