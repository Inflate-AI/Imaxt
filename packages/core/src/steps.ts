import { escapeHtml } from './shared.ts';

export interface StepData {
  title: string;
  html: string;
}

export interface StepsData {
  items: StepData[];
}

export function renderStep(data: StepData): string {
  return (
    `<li class="imx-step"><div><div class="imx-step-t">${escapeHtml(data.title)}</div>` +
    `<div class="imx-step-b">${data.html}</div></div></li>`
  );
}

export function renderSteps(data: StepsData): string {
  return `<div class="imx"><ol class="imx-steps">${data.items.map(renderStep).join('')}</ol></div>`;
}
