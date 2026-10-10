import { escapeHtml } from './shared.ts';

export interface EventData {
  date: string;
  title: string;
  html: string;
}

export interface TimelineData {
  items: EventData[];
}

export function renderEvent(data: EventData): string {
  return (
    `<li class="imx-event"><div class="imx-event-d imx-label">${escapeHtml(data.date)}</div>` +
    `<span class="imx-event-dot" aria-hidden="true"></span><div>` +
    `<div class="imx-event-t">${escapeHtml(data.title)}</div>` +
    `<div class="imx-event-b">${data.html}</div></div></li>`
  );
}

export function renderTimeline(data: TimelineData): string {
  return `<div class="imx"><ol class="imx-timeline">${data.items.map(renderEvent).join('')}</ol></div>`;
}
