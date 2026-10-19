import { escapeHtml, resolveTone } from './shared.ts';

export interface ImaxtCoverTypographicData {
  kind: 'word' | 'stat' | 'quote' | 'stack';
  text: string;
  sub?: string;
}

export interface ImaxtCoverData {
  cover?: ImaxtCoverTypographicData;
  title: string;
  tone?: string;
  caption?: string;
  ratio?: string;
  /** Appended, as-is, to the root element's `style` attribute after the aspect-ratio declaration. */
  style?: string;
}

/** Breaks a phrase into at most `max` balanced lines (greedy, by character count). */
export function splitLines(text: string, max = 3): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= max) return words;
  const target = text.trim().length / max;
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    if (current && `${current} ${word}`.length > target && lines.length < max - 1) {
      lines.push(current);
      current = word;
    } else {
      current = current ? `${current} ${word}` : word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/** Shortens a title into a cover phrase when a post does not set its own. */
export function coverPhrase(title: string, maxWords = 5): string {
  const words = title
    .replace(/^(part \d+:\s*)/i, '')
    .split(/\s+/)
    .filter(Boolean);
  return words.slice(0, maxWords).join(' ');
}

export function renderImaxtCover(data: ImaxtCoverData): string {
  const tone = resolveTone(data.tone);
  const cover: ImaxtCoverTypographicData = data.cover ?? {
    kind: 'stack',
    text: coverPhrase(data.title),
  };
  const ratio = data.ratio ?? '16 / 9';
  const lines =
    cover.kind === 'quote' ? [] : cover.kind === 'stack' ? splitLines(cover.text, 3) : [cover.text];
  const h = lines.length ? 68 / lines.length : 68;
  const widthFor = (line: string) => 176 / Math.max(line.length, 2);

  const caption = data.caption
    ? `<div class="imx-cover-cap"><span>${escapeHtml(data.caption)}</span></div>`
    : '';
  const body =
    cover.kind === 'quote'
      ? `<div class="imx-cover-q">${escapeHtml(cover.text)}</div>`
      : lines
          .map((line, i) => {
            const s = cover.kind === 'stack' ? i % 3 : 0;
            return `<span class="imx-cover-line" data-s="${s}" style="--w:${widthFor(line)};--h:${h}">${escapeHtml(line)}</span>`;
          })
          .join('');
  const sub = cover.sub ? `<span class="imx-cover-sub">${escapeHtml(cover.sub)}</span>` : '';

  const style = `aspect-ratio:${ratio}${data.style ? `;${data.style}` : ''}`;

  return (
    `<div class="imx-cover" data-tone="${tone}" data-kind="${cover.kind}" style="${style}" aria-hidden="true">` +
    `${caption}<div class="imx-cover-in">${body}${sub}</div></div>`
  );
}
