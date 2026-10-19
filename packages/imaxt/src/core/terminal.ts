import { escapeHtml } from './shared.ts';

export interface TerminalLine {
  prompt?: string;
  command?: string;
  output?: string;
}

export interface TerminalData {
  lines: TerminalLine[];
  title?: string;
}

function renderLine(line: TerminalLine): string {
  if (line.command !== undefined) {
    const prompt = escapeHtml(line.prompt ?? '$');
    return (
      `<div class="imx-term-line" data-kind="command">` +
      `<span class="imx-term-prompt">${prompt}</span>` +
      `<span class="imx-term-cmd">${escapeHtml(line.command)}</span></div>`
    );
  }
  return `<div class="imx-term-line" data-kind="output">${escapeHtml(line.output ?? '')}</div>`;
}

export function renderTerminal(data: TerminalData): string {
  const title = data.title ? `<div class="imx-term-head">${escapeHtml(data.title)}</div>` : '';
  const lines = data.lines.map(renderLine).join('');
  return `<div class="imx"><div class="imx-term">${title}<pre class="imx-term-body">${lines}</pre></div></div>`;
}
