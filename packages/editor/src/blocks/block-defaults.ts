import type { Block } from '@inflate-ai/imaxt-mdx';

/** Sensible starting data for a freshly inserted block of each type. */
export function createDefaultBlock(type: Block['type']): Block {
  switch (type) {
    case 'statement':
      return { type, data: { html: 'A bold claim.' } };
    case 'pull-quote':
      return { type, data: { html: 'A memorable line.' } };
    case 'sidenote':
      return { type, data: { html: 'A quiet aside.' } };
    case 'bars':
      return {
        type,
        data: {
          items: [
            { label: 'A', value: 50 },
            { label: 'B', value: 80 },
          ],
        },
      };
    case 'ranked':
      return { type, data: { items: [{ label: 'First', value: '1' }] } };
    case 'matrix':
      return { type, data: { rows: ['Row 1'], cols: ['Col 1'], cells: [['']] } };
    case 'delta':
      return { type, data: { label: 'Latency', from: 120, to: 80, unit: 'ms' } };
    case 'gauge':
      return { type, data: { value: 42, max: 100, label: 'Capacity' } };
    case 'scorecard':
      return { type, data: { items: [{ label: 'MRR', value: 0 }] } };
    case 'sparkline':
      return { type, data: { values: [1, 2, 3] } };
    case 'funnel':
      return { type, data: { stages: [{ label: 'Visitors', value: 1000 }] } };
    case 'callout':
      return { type, data: { kind: 'tip', html: 'Worth knowing.' } };
    case 'faq':
      return { type, data: { items: [{ q: 'Question?', a: 'Answer.' }] } };
    case 'takeaways':
      return { type, data: { items: ['First point'] } };
    case 'footnote':
      return { type, data: { html: 'A citation.' } };
    case 'glossary':
      return { type, data: { items: [{ term: 'Term', definition: 'Definition.' }] } };
    case 'versus':
      return {
        type,
        data: {
          sides: [
            { label: 'A', html: 'Side A' },
            { label: 'B', html: 'Side B' },
          ],
        },
      };
    case 'checklist':
      return { type, data: { items: [{ text: 'Write tests' }] } };
    case 'terminal':
      return { type, data: { lines: [{ command: 'npm install' }] } };
    case 'diff':
      return { type, data: { before: 'const a = 1;', after: 'const a = 2;' } };
    case 'file-tree':
      return { type, data: { tree: [{ name: 'src', children: [{ name: 'index.ts' }] }] } };
    case 'error-box':
      return { type, data: { title: 'TypeError', message: 'Cannot read property' } };
    case 'changelog':
      return { type, data: { entries: [{ version: '0.1.0', items: ['Initial release'] }] } };
    case 'formula':
      return { type, data: { tex: 'E=mc^2' } };
    case 'ticker':
      return { type, data: { phrases: ['New', 'Fast', 'Simple'] } };
    case 'drop-cap':
      return { type, data: { html: 'Once upon a time.' } };
    case 'redacted':
      return { type, data: { html: 'Hidden until revealed.' } };
    case 'stamp':
      return { type, data: { text: 'DRAFT' } };
    case 'banner':
      return { type, data: { text: 'Launching soon' } };
    case 'marquee':
      return { type, data: { words: ['Fast', 'Simple', 'Honest'] } };
    case 'heatmap':
      return { type, data: { rows: ['Row 1'], cols: ['Col 1'], data: [[0]], caption: 'Caption' } };
    case 'curved-text':
      return { type, data: { text: 'Drafted', shape: 'circle' } };
    case 'type-lab':
      return { type, data: { sample: 'Same letters, different voice' } };
    case 'stat-row':
      return { type, data: { items: [{ value: '5', label: 'metric' }] } };
    case 'compare':
      return { type, data: { sides: [{ html: 'Before', kind: 'before' }, { html: 'After' }] } };
    case 'steps':
      return { type, data: { items: [{ title: 'First', html: 'Do this first.' }] } };
    case 'timeline':
      return { type, data: { items: [{ date: 'Step 1', title: 'Start', html: 'Begin here.' }] } };
    case 'scrolly':
      return { type, data: { items: [{ stage: 'Chunk', html: 'Split the document.' }] } };
    case 'code-walk':
      return { type, data: { code: 'const id = 1;', steps: [{ lines: '1', title: 'id' }] } };
    case 'embed':
      return { type, data: { url: 'https://example.com' } };
    case 'markdown':
      return { type, source: '' };
  }
}
