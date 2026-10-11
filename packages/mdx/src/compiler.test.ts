import { describe, expect, test } from 'bun:test';
import type { Block } from './blocks.ts';
import { mdxToBlocks } from './from-mdx.ts';
import { blocksToMdx } from './to-mdx.ts';

const SAMPLE_BLOCKS: Block[] = [
  {
    type: 'statement',
    data: {
      html: 'Every project rebuilds <strong>plumbing</strong>.',
      tone: 'mint',
      align: 'center',
    },
  },
  { type: 'pull-quote', data: { html: 'The best API is a short one.', by: 'Design rule' } },
  { type: 'sidenote', data: { html: 'Numbers are placeholders.', label: 'Mock data' } },
  {
    type: 'bars',
    data: {
      items: [
        { label: 'Model A', value: 72 },
        { label: 'Model B', value: 81 },
      ],
      unit: '%',
      max: 100,
      tone: 'accent',
    },
  },
  {
    type: 'ranked',
    data: {
      items: [
        { label: 'Model A', value: '92', delta: 3 },
        { label: 'Model B', value: '88', delta: 'new' },
      ],
      unit: '%',
      tone: 'mint',
    },
  },
  {
    type: 'matrix',
    data: {
      rows: ['Free', 'Pro'],
      cols: ['Exports'],
      cells: [['no'], ['yes']],
      caption: 'Plan comparison',
    },
  },
  { type: 'delta', data: { label: 'Latency', from: 120, to: 80, unit: 'ms', tone: 'accent' } },
  { type: 'gauge', data: { value: 42, max: 100, label: 'Capacity', unit: '%' } },
  {
    type: 'scorecard',
    data: {
      items: [
        { label: 'MRR', value: 42000, unit: '$' },
        { label: 'Churn', value: '2.1', unit: '%', delta: '-0.4' },
      ],
      tone: 'sky',
    },
  },
  { type: 'sparkline', data: { values: [12, 18, 9, 24], label: 'Weekly signups' } },
  {
    type: 'funnel',
    data: {
      stages: [
        { label: 'Visitors', value: 1000 },
        { label: 'Signups', value: 500 },
      ],
      unit: '',
      tone: 'rose',
    },
  },
  { type: 'callout', data: { html: 'Read the docs first.', kind: 'tip', title: 'Heads up' } },
  { type: 'faq', data: { items: [{ q: 'Is this free?', a: 'Yes.' }] } },
  { type: 'takeaways', data: { items: ['First point', 'Second point'], title: 'Key takeaways' } },
  { type: 'footnote', data: { html: 'A citation.', marker: '1' } },
  {
    type: 'glossary',
    data: { items: [{ term: 'RAG', definition: 'Retrieval-augmented generation' }] },
  },
  {
    type: 'versus',
    data: {
      sides: [
        { label: 'Postgres', html: 'Relational' },
        { label: 'SQLite', html: 'Embedded' },
      ],
      vsLabel: 'OR',
      tone: 'sky',
    },
  },
  {
    type: 'checklist',
    data: {
      items: [{ text: 'Write tests', done: true }, { text: 'Ship it' }],
      title: 'Launch checklist',
    },
  },
  {
    type: 'terminal',
    data: { lines: [{ command: 'npm install' }, { output: 'added 42 packages' }], title: 'Setup' },
  },
  { type: 'diff', data: { before: 'const a = 1;', after: 'const a = 2;', lang: 'ts' } },
  {
    type: 'file-tree',
    data: { tree: [{ name: 'src', children: [{ name: 'index.ts' }] }] },
  },
  {
    type: 'error-box',
    data: {
      title: 'TypeError',
      message: 'Cannot read property "x"',
      stack: '    at foo (file.ts:1:1)',
    },
  },
  {
    type: 'changelog',
    data: { entries: [{ version: '0.2.0', date: '2026-10-11', items: ['Added X'] }] },
  },
  {
    type: 'formula',
    data: { tex: 'E=mc^2', display: true, caption: 'Mass-energy equivalence' },
  },
  { type: 'ticker', data: { phrases: ['Embed', 'Filter', 'Rank'], seconds: 4, tone: 'mint' } },
  { type: 'drop-cap', data: { html: 'Lorem ipsum dolor sit amet.', tone: 'sky' } },
  {
    type: 'redacted',
    data: { html: 'The launch date is March 3rd.', revealLabel: 'Click to reveal' },
  },
  { type: 'stamp', data: { text: 'DRAFT', angle: 12, tone: 'accent' } },
  { type: 'banner', data: { text: 'Launching soon', tone: 'rose' } },
  { type: 'marquee', data: { words: ['Embed', 'Filter', 'Rank'], tone: 'accent', seconds: 20 } },
  {
    type: 'heatmap',
    data: {
      rows: ['600', '644'],
      cols: ['Owner', 'Others'],
      data: [
        [6, 0],
        [6, 4],
      ],
      caption: 'Common modes',
      min: 0,
      max: 7,
    },
  },
  {
    type: 'curved-text',
    data: {
      text: 'Drafted',
      shape: 'circle',
      mark: 'D',
      tone: 'mint',
      spin: true,
      decorative: true,
    },
  },
  { type: 'type-lab', data: { sample: 'Same letters, different voice', family: 'fraunces' } },
  {
    type: 'stat-row',
    data: {
      items: [
        { value: '5', unit: 'ms', label: 'p95 query time', tone: 'mint' },
        { value: '10×', label: 'fewer calls' },
      ],
    },
  },
  {
    type: 'compare',
    data: {
      sides: [
        { html: 'Three pipelines, three sets of bugs', kind: 'before', label: 'Before' },
        { html: 'One small API, one set of bugs', label: 'After', tone: 'accent' },
      ],
    },
  },
  {
    type: 'steps',
    data: {
      items: [
        { title: 'Chunk', html: 'Split each document into pieces.' },
        { title: 'Embed', html: 'Turn every chunk into a <em>vector</em>.' },
      ],
    },
  },
  {
    type: 'timeline',
    data: {
      items: [
        { date: 'Step 1', title: 'Propose', html: 'A leader suggests a value.' },
        { date: 'Step 2', title: 'Accept', html: 'A majority accepts it.' },
      ],
    },
  },
  {
    type: 'scrolly',
    data: {
      tone: 'sky',
      items: [
        { stage: 'Chunk', sub: 'step 1', html: 'Split each document.' },
        { stage: 'Embed', html: 'Turn every chunk into a vector.' },
      ],
    },
  },
  {
    type: 'code-walk',
    data: {
      code: 'const id = `${doc.id}:${chunk.index}`;\nawait index.upsert({ id, vector });',
      steps: [
        { lines: '1', title: 'Stable id', text: 'Same chunk, same id.' },
        { lines: '2', title: 'Upsert', text: 'Replaces instead of duplicating.' },
      ],
    },
  },
];

const COMPONENT_NAME: Record<Block['type'], string> = {
  statement: 'Statement',
  'pull-quote': 'PullQuote',
  sidenote: 'Sidenote',
  bars: 'Bars',
  ranked: 'Ranked',
  matrix: 'Matrix',
  delta: 'Delta',
  gauge: 'Gauge',
  scorecard: 'Scorecard',
  sparkline: 'Sparkline',
  funnel: 'Funnel',
  callout: 'Callout',
  faq: 'Faq',
  takeaways: 'Takeaways',
  footnote: 'Footnote',
  glossary: 'Glossary',
  versus: 'Versus',
  checklist: 'Checklist',
  terminal: 'Terminal',
  diff: 'Diff',
  'file-tree': 'FileTree',
  'error-box': 'ErrorBox',
  changelog: 'Changelog',
  formula: 'Formula',
  ticker: 'Ticker',
  'drop-cap': 'DropCap',
  redacted: 'Redacted',
  stamp: 'Stamp',
  banner: 'Banner',
  marquee: 'Marquee',
  heatmap: 'Heatmap',
  'curved-text': 'CurvedText',
  'type-lab': 'TypeLab',
  'stat-row': 'StatRow',
  compare: 'Compare',
  steps: 'Steps',
  timeline: 'Timeline',
  scrolly: 'Scrolly',
  'code-walk': 'CodeWalk',
  markdown: '',
};

describe('blocksToMdx', () => {
  for (const block of SAMPLE_BLOCKS) {
    test(`compiles a ${block.type} block to its existing <${COMPONENT_NAME[block.type]}> syntax`, () => {
      const mdx = blocksToMdx({ frontmatter: {}, blocks: [block] });
      expect(mdx).toContain(`<${COMPONENT_NAME[block.type]}`);
    });
  }

  test('compiles a StatRow with nested Stat children in order', () => {
    const statRowBlock = SAMPLE_BLOCKS.find((block) => block.type === 'stat-row')!;
    const mdx = blocksToMdx({ frontmatter: {}, blocks: [statRowBlock] });
    expect(mdx.indexOf('<Stat ')).toBeGreaterThan(mdx.indexOf('<StatRow'));
    expect(mdx.indexOf('p95')).toBeLessThan(mdx.indexOf('fewer calls'));
  });
});

describe('round-trip fidelity', () => {
  for (const block of SAMPLE_BLOCKS) {
    test(`${block.type} round-trips through MDX losslessly`, () => {
      const mdx = blocksToMdx({ frontmatter: {}, blocks: [block] });
      const parsed = mdxToBlocks(mdx);
      expect(parsed.blocks).toEqual([block]);
    });
  }

  test('a full document with multiple blocks round-trips in order', () => {
    const mdx = blocksToMdx({ frontmatter: {}, blocks: SAMPLE_BLOCKS });
    const parsed = mdxToBlocks(mdx);
    expect(parsed.blocks).toEqual(SAMPLE_BLOCKS);
  });
});

describe('frontmatter and ImaxtCover', () => {
  test('round-trips post frontmatter including the typographic cover', () => {
    const frontmatter = {
      title: 'One API for every vector',
      date: '2026-01-01',
      cover: { kind: 'stack', text: 'One API for every vector' },
    };
    const mdx = blocksToMdx({ frontmatter, blocks: [] });
    expect(mdx.startsWith('---\n')).toBe(true);
    const parsed = mdxToBlocks(mdx);
    expect(parsed.frontmatter).toEqual(frontmatter);
  });

  test('a post with no frontmatter has none on parse', () => {
    const parsed = mdxToBlocks('<Statement>Hello</Statement>');
    expect(parsed.frontmatter).toEqual({});
  });
});

describe('unrecognized content passthrough', () => {
  test('plain prose between two recognized blocks is preserved and stays positioned between them', () => {
    const source = [
      '<Statement>First</Statement>',
      '',
      'Some plain prose that is not an Imaxt block.',
      '',
      '<Statement>Second</Statement>',
    ].join('\n');

    const parsed = mdxToBlocks(source);
    expect(parsed.blocks.length).toBe(3);
    expect(parsed.blocks[0]?.type).toBe('statement');
    expect(parsed.blocks[1]?.type).toBe('markdown');
    expect((parsed.blocks[1] as { source: string }).source).toContain('plain prose');
    expect(parsed.blocks[2]?.type).toBe('statement');
  });

  test('a hand-written post parses every recognized component with no silent drops', () => {
    const source = [
      '<Statement tone="mint">Every retrieval project rebuilds the **same plumbing**.</Statement>',
      '',
      '<Sidenote label="Rule of thumb">At most one loud block per section.</Sidenote>',
    ].join('\n');

    const parsed = mdxToBlocks(source);
    expect(parsed.blocks.map((b) => b.type)).toEqual(['statement', 'sidenote']);
  });

  test('round-tripping unrecognized content through parse then compile reproduces it', () => {
    const source = 'Just a paragraph of plain prose, no Imaxt components here.';
    const parsed = mdxToBlocks(source);
    const recompiled = blocksToMdx(parsed);
    expect(recompiled.trim()).toBe(source);
  });
});
