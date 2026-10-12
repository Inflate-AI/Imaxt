import * as core from '@inflate-ai/imaxt-core';
import type { Block } from '@inflate-ai/imaxt-mdx';

type AnyData = Record<string, unknown>;

const RENDERERS: Partial<Record<Block['type'], (data: AnyData) => string>> = {
  statement: core.renderStatement as never,
  'pull-quote': core.renderPullQuote as never,
  sidenote: core.renderSidenote as never,
  bars: core.renderBars as never,
  ranked: core.renderRanked as never,
  matrix: core.renderMatrix as never,
  delta: core.renderDelta as never,
  gauge: core.renderGauge as never,
  scorecard: core.renderScorecard as never,
  sparkline: core.renderSparkline as never,
  funnel: core.renderFunnel as never,
  callout: core.renderCallout as never,
  faq: core.renderFaq as never,
  takeaways: core.renderTakeaways as never,
  footnote: core.renderFootnote as never,
  glossary: core.renderGlossary as never,
  versus: core.renderVersus as never,
  checklist: core.renderChecklist as never,
  terminal: core.renderTerminal as never,
  diff: core.renderDiff as never,
  'file-tree': core.renderFileTree as never,
  'error-box': core.renderErrorBox as never,
  changelog: core.renderChangelog as never,
  formula: core.renderFormula as never,
  ticker: core.renderTicker as never,
  'drop-cap': core.renderDropCap as never,
  redacted: core.renderRedacted as never,
  stamp: core.renderStamp as never,
  banner: core.renderBanner as never,
  marquee: core.renderMarquee as never,
  heatmap: core.renderHeatmap as never,
  'curved-text': core.renderCurvedText as never,
  'type-lab': core.renderTypeLab as never,
  'stat-row': core.renderStatRow as never,
  compare: core.renderCompare as never,
  steps: core.renderSteps as never,
  timeline: core.renderTimeline as never,
  scrolly: core.renderScrolly as never,
  'code-walk': core.renderCodeWalk as never,
  embed: core.renderEmbed as never,
  mermaid: core.renderMermaid as never,
};

/** Renders one block to HTML for the live preview - the same markup Blog/Prox would produce. */
export function renderBlockPreview(block: Block): string {
  if (block.type === 'markdown') return '';
  const renderer = RENDERERS[block.type];
  return renderer ? renderer(block.data as AnyData) : '';
}
