import type { Block } from '@inflate-ai/imaxt-mdx';

export type FieldKind = 'text' | 'textarea' | 'number' | 'boolean' | 'tone' | 'select' | 'list';

export interface FieldConfig {
  name: string;
  label: string;
  kind: FieldKind;
  options?: readonly string[];
  itemFields?: readonly FieldConfig[];
  itemLabel?: string;
  /** For a 'textarea' backing a primitive array (e.g. `string[]`/`number[]`) instead of a plain string. */
  arrayOf?: 'string' | 'number';
  /** Separator joining/splitting an `arrayOf` field's lines. Defaults to "\n". */
  separator?: string;
}

/** Groups the 40 Imaxt blocks into browsable sections for the slash menu - see SlashMenuPlugin.tsx. */
export type BlockCategory =
  | 'Typography'
  | 'Data & Stats'
  | 'Narrative'
  | 'Technical'
  | 'Visual & Motion'
  | 'Media';

export interface BlockTypeConfig {
  type: Block['type'];
  title: string;
  category: BlockCategory;
  fields: readonly FieldConfig[];
}

const tone: FieldConfig = { name: 'tone', label: 'Tone', kind: 'tone' };
const html = (label = 'Text'): FieldConfig => ({ name: 'html', label, kind: 'textarea' });

/**
 * One config entry per "mechanical" Imaxt block (everything but Matrix,
 * Heatmap, and FileTree, which get their own components - see
 * `MatrixBlock.tsx`, `HeatmapBlock.tsx`, `FileTreeBlock.tsx`). A single
 * generic form (`ImaxtBlockEditor`) renders from this table, the same way
 * `imaxt-editorjs`'s mechanical tools all share `createTonePicker`/
 * `createRepeatableList`.
 */
export const BLOCK_CONFIGS: Partial<Record<Block['type'], BlockTypeConfig>> = {
  statement: {
    type: 'statement',
    title: 'Statement',
    category: 'Typography',
    fields: [
      html(),
      tone,
      { name: 'align', label: 'Align', kind: 'select', options: ['left', 'center'] },
      { name: 'wide', label: 'Wide', kind: 'boolean' },
      { name: 'bleed', label: 'Bleed', kind: 'boolean' },
    ],
  },
  'pull-quote': {
    type: 'pull-quote',
    title: 'Pull quote',
    category: 'Typography',
    fields: [
      html(),
      { name: 'by', label: 'Attribution', kind: 'text' },
      { name: 'wide', label: 'Wide', kind: 'boolean' },
    ],
  },
  sidenote: {
    type: 'sidenote',
    title: 'Sidenote',
    category: 'Typography',
    fields: [html(), { name: 'label', label: 'Label', kind: 'text' }],
  },
  bars: {
    type: 'bars',
    title: 'Bars',
    category: 'Data & Stats',
    fields: [
      {
        name: 'items',
        label: 'Bars',
        kind: 'list',
        itemLabel: 'Bar',
        itemFields: [
          { name: 'label', label: 'Label', kind: 'text' },
          { name: 'value', label: 'Value', kind: 'number' },
        ],
      },
      { name: 'unit', label: 'Unit', kind: 'text' },
      tone,
    ],
  },
  ranked: {
    type: 'ranked',
    title: 'Ranked',
    category: 'Data & Stats',
    fields: [
      {
        name: 'items',
        label: 'Items',
        kind: 'list',
        itemLabel: 'Item',
        itemFields: [
          { name: 'label', label: 'Label', kind: 'text' },
          { name: 'value', label: 'Value', kind: 'text' },
          { name: 'delta', label: 'Delta', kind: 'text' },
        ],
      },
      { name: 'unit', label: 'Unit', kind: 'text' },
      tone,
    ],
  },
  delta: {
    type: 'delta',
    title: 'Delta',
    category: 'Data & Stats',
    fields: [
      { name: 'label', label: 'Label', kind: 'text' },
      { name: 'from', label: 'From', kind: 'text' },
      { name: 'to', label: 'To', kind: 'text' },
      { name: 'unit', label: 'Unit', kind: 'text' },
      tone,
    ],
  },
  gauge: {
    type: 'gauge',
    title: 'Gauge',
    category: 'Data & Stats',
    fields: [
      { name: 'value', label: 'Value', kind: 'number' },
      { name: 'max', label: 'Max', kind: 'number' },
      { name: 'label', label: 'Label', kind: 'text' },
      { name: 'unit', label: 'Unit', kind: 'text' },
      tone,
    ],
  },
  scorecard: {
    type: 'scorecard',
    title: 'Scorecard',
    category: 'Data & Stats',
    fields: [
      {
        name: 'items',
        label: 'Items',
        kind: 'list',
        itemLabel: 'Item',
        itemFields: [
          { name: 'label', label: 'Label', kind: 'text' },
          { name: 'value', label: 'Value', kind: 'text' },
          { name: 'unit', label: 'Unit', kind: 'text' },
          { name: 'delta', label: 'Delta', kind: 'text' },
        ],
      },
      tone,
    ],
  },
  sparkline: {
    type: 'sparkline',
    title: 'Sparkline',
    category: 'Data & Stats',
    fields: [
      { name: 'values', label: 'Values', kind: 'textarea', arrayOf: 'number', separator: ',' },
      { name: 'label', label: 'Label', kind: 'text' },
    ],
  },
  funnel: {
    type: 'funnel',
    title: 'Funnel',
    category: 'Data & Stats',
    fields: [
      {
        name: 'stages',
        label: 'Stages',
        kind: 'list',
        itemLabel: 'Stage',
        itemFields: [
          { name: 'label', label: 'Label', kind: 'text' },
          { name: 'value', label: 'Value', kind: 'number' },
        ],
      },
      { name: 'unit', label: 'Unit', kind: 'text' },
      tone,
    ],
  },
  callout: {
    type: 'callout',
    title: 'Callout',
    category: 'Narrative',
    fields: [
      { name: 'kind', label: 'Kind', kind: 'select', options: ['info', 'tip', 'warn', 'danger'] },
      { name: 'title', label: 'Title', kind: 'text' },
      html(),
    ],
  },
  faq: {
    type: 'faq',
    title: 'FAQ',
    category: 'Narrative',
    fields: [
      {
        name: 'items',
        label: 'Questions',
        kind: 'list',
        itemLabel: 'Q&A',
        itemFields: [
          { name: 'q', label: 'Question', kind: 'text' },
          { name: 'a', label: 'Answer', kind: 'textarea' },
        ],
      },
    ],
  },
  takeaways: {
    type: 'takeaways',
    title: 'Takeaways',
    category: 'Narrative',
    fields: [
      { name: 'title', label: 'Title', kind: 'text' },
      { name: 'items', label: 'Items (one per line)', kind: 'textarea', arrayOf: 'string' },
    ],
  },
  footnote: {
    type: 'footnote',
    title: 'Footnote',
    category: 'Typography',
    fields: [{ name: 'marker', label: 'Marker', kind: 'text' }, html()],
  },
  glossary: {
    type: 'glossary',
    title: 'Glossary',
    category: 'Typography',
    fields: [
      {
        name: 'items',
        label: 'Terms',
        kind: 'list',
        itemLabel: 'Term',
        itemFields: [
          { name: 'term', label: 'Term', kind: 'text' },
          { name: 'definition', label: 'Definition', kind: 'textarea' },
        ],
      },
    ],
  },
  versus: {
    type: 'versus',
    title: 'Versus',
    category: 'Narrative',
    fields: [
      {
        name: 'sides',
        label: 'Sides',
        kind: 'list',
        itemLabel: 'Side',
        itemFields: [{ name: 'label', label: 'Label', kind: 'text' }, html()],
      },
      { name: 'vsLabel', label: 'VS label', kind: 'text' },
      tone,
    ],
  },
  checklist: {
    type: 'checklist',
    title: 'Checklist',
    category: 'Narrative',
    fields: [
      { name: 'title', label: 'Title', kind: 'text' },
      {
        name: 'items',
        label: 'Items',
        kind: 'list',
        itemLabel: 'Item',
        itemFields: [
          { name: 'text', label: 'Text', kind: 'text' },
          { name: 'done', label: 'Done', kind: 'boolean' },
        ],
      },
    ],
  },
  terminal: {
    type: 'terminal',
    title: 'Terminal',
    category: 'Technical',
    fields: [
      { name: 'title', label: 'Title', kind: 'text' },
      {
        name: 'lines',
        label: 'Lines',
        kind: 'list',
        itemLabel: 'Line',
        itemFields: [
          { name: 'prompt', label: 'Prompt', kind: 'text' },
          { name: 'command', label: 'Command', kind: 'text' },
          { name: 'output', label: 'Output', kind: 'text' },
        ],
      },
    ],
  },
  diff: {
    type: 'diff',
    title: 'Diff',
    category: 'Technical',
    fields: [
      { name: 'before', label: 'Before', kind: 'textarea' },
      { name: 'after', label: 'After', kind: 'textarea' },
      { name: 'lang', label: 'Language', kind: 'text' },
    ],
  },
  'error-box': {
    type: 'error-box',
    title: 'Error box',
    category: 'Technical',
    fields: [
      { name: 'title', label: 'Title', kind: 'text' },
      { name: 'message', label: 'Message', kind: 'text' },
      { name: 'stack', label: 'Stack', kind: 'textarea' },
    ],
  },
  changelog: {
    type: 'changelog',
    title: 'Changelog',
    category: 'Technical',
    fields: [
      {
        name: 'entries',
        label: 'Entries',
        kind: 'list',
        itemLabel: 'Entry',
        itemFields: [
          { name: 'version', label: 'Version', kind: 'text' },
          { name: 'date', label: 'Date', kind: 'text' },
          { name: 'items', label: 'Items (one per line)', kind: 'textarea', arrayOf: 'string' },
        ],
      },
    ],
  },
  formula: {
    type: 'formula',
    title: 'Formula',
    category: 'Typography',
    fields: [
      { name: 'tex', label: 'TeX', kind: 'text' },
      { name: 'display', label: 'Display (block)', kind: 'boolean' },
      { name: 'caption', label: 'Caption', kind: 'text' },
    ],
  },
  ticker: {
    type: 'ticker',
    title: 'Ticker',
    category: 'Visual & Motion',
    fields: [
      { name: 'phrases', label: 'Phrases (one per line)', kind: 'textarea', arrayOf: 'string' },
      { name: 'seconds', label: 'Seconds', kind: 'number' },
      tone,
    ],
  },
  'drop-cap': {
    type: 'drop-cap',
    title: 'Drop cap',
    category: 'Typography',
    fields: [html(), tone],
  },
  redacted: {
    type: 'redacted',
    title: 'Redacted',
    category: 'Typography',
    fields: [html(), { name: 'revealLabel', label: 'Reveal label', kind: 'text' }],
  },
  stamp: {
    type: 'stamp',
    title: 'Stamp',
    category: 'Typography',
    fields: [
      { name: 'text', label: 'Text', kind: 'text' },
      { name: 'angle', label: 'Angle', kind: 'number' },
      tone,
    ],
  },
  banner: {
    type: 'banner',
    title: 'Banner',
    category: 'Visual & Motion',
    fields: [{ name: 'text', label: 'Text', kind: 'text' }, tone],
  },
  marquee: {
    type: 'marquee',
    title: 'Marquee',
    category: 'Visual & Motion',
    fields: [
      { name: 'words', label: 'Words (one per line)', kind: 'textarea', arrayOf: 'string' },
      tone,
      { name: 'bleed', label: 'Bleed', kind: 'boolean' },
      { name: 'seconds', label: 'Seconds', kind: 'number' },
    ],
  },
  'curved-text': {
    type: 'curved-text',
    title: 'Curved text',
    category: 'Visual & Motion',
    fields: [
      { name: 'text', label: 'Text', kind: 'text' },
      { name: 'shape', label: 'Shape', kind: 'select', options: ['arc', 'wave', 'circle'] },
      { name: 'mark', label: 'Mark', kind: 'text' },
      tone,
      { name: 'spin', label: 'Spin', kind: 'boolean' },
      { name: 'decorative', label: 'Decorative', kind: 'boolean' },
    ],
  },
  'type-lab': {
    type: 'type-lab',
    title: 'Type lab',
    category: 'Visual & Motion',
    fields: [
      { name: 'sample', label: 'Sample', kind: 'text' },
      {
        name: 'family',
        label: 'Family',
        kind: 'select',
        options: ['fraunces', 'sans', 'serif', 'mono', 'display'],
      },
    ],
  },
  'stat-row': {
    type: 'stat-row',
    title: 'Stat row',
    category: 'Data & Stats',
    fields: [
      {
        name: 'items',
        label: 'Stats',
        kind: 'list',
        itemLabel: 'Stat',
        itemFields: [
          { name: 'value', label: 'Value', kind: 'text' },
          { name: 'label', label: 'Label', kind: 'text' },
          { name: 'unit', label: 'Unit', kind: 'text' },
          { name: 'note', label: 'Note', kind: 'text' },
          tone,
        ],
      },
    ],
  },
  compare: {
    type: 'compare',
    title: 'Compare',
    category: 'Narrative',
    fields: [
      {
        name: 'sides',
        label: 'Sides',
        kind: 'list',
        itemLabel: 'Side',
        itemFields: [
          html(),
          { name: 'label', label: 'Label', kind: 'text' },
          { name: 'kind', label: 'Kind', kind: 'select', options: ['before', 'after'] },
          tone,
        ],
      },
      { name: 'wide', label: 'Wide', kind: 'boolean' },
    ],
  },
  steps: {
    type: 'steps',
    title: 'Steps',
    category: 'Narrative',
    fields: [
      {
        name: 'items',
        label: 'Steps',
        kind: 'list',
        itemLabel: 'Step',
        itemFields: [{ name: 'title', label: 'Title', kind: 'text' }, html()],
      },
    ],
  },
  timeline: {
    type: 'timeline',
    title: 'Timeline',
    category: 'Narrative',
    fields: [
      {
        name: 'items',
        label: 'Events',
        kind: 'list',
        itemLabel: 'Event',
        itemFields: [
          { name: 'date', label: 'Date', kind: 'text' },
          { name: 'title', label: 'Title', kind: 'text' },
          html(),
        ],
      },
    ],
  },
  scrolly: {
    type: 'scrolly',
    title: 'Scrolly',
    category: 'Narrative',
    fields: [
      {
        name: 'items',
        label: 'Beats',
        kind: 'list',
        itemLabel: 'Beat',
        itemFields: [
          { name: 'stage', label: 'Stage', kind: 'text' },
          { name: 'sub', label: 'Sub', kind: 'text' },
          html(),
        ],
      },
      tone,
    ],
  },
  'code-walk': {
    type: 'code-walk',
    title: 'Code walk',
    category: 'Technical',
    fields: [
      { name: 'code', label: 'Code', kind: 'textarea' },
      {
        name: 'steps',
        label: 'Steps',
        kind: 'list',
        itemLabel: 'Step',
        itemFields: [
          { name: 'lines', label: 'Lines (e.g. 1-2)', kind: 'text' },
          { name: 'title', label: 'Title', kind: 'text' },
          { name: 'text', label: 'Text', kind: 'text' },
        ],
      },
      { name: 'wide', label: 'Wide', kind: 'boolean' },
    ],
  },
  embed: {
    type: 'embed',
    title: 'Embed',
    category: 'Media',
    fields: [
      { name: 'url', label: 'URL', kind: 'text' },
      { name: 'caption', label: 'Caption', kind: 'text' },
    ],
  },
};

/** Block types with real custom editing logic, handled by their own component instead of this table - see ImaxtBlockEditor.tsx and SlashMenuPlugin.tsx. */
export const CUSTOM_BLOCK_TYPES = ['matrix', 'heatmap', 'file-tree'] as const;

/** Title/category for the three CUSTOM_BLOCK_TYPES - the single source of truth both the slash menu and the block editor's toolbar label read from. */
export const CUSTOM_BLOCK_META: Record<
  (typeof CUSTOM_BLOCK_TYPES)[number],
  { title: string; category: BlockCategory }
> = {
  matrix: { title: 'Matrix', category: 'Data & Stats' },
  heatmap: { title: 'Heatmap', category: 'Data & Stats' },
  'file-tree': { title: 'File tree', category: 'Technical' },
};
