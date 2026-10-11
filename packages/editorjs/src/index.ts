import { BarsTool } from './bars.ts';
import { CodeWalkTool } from './code-walk.ts';
import { CompareTool } from './compare.ts';
import { CurvedTextTool } from './curved-text.ts';
import { DeltaTool } from './delta.ts';
import { FunnelTool } from './funnel.ts';
import { GaugeTool } from './gauge.ts';
import { HeatmapTool } from './heatmap.ts';
import { MarqueeTool } from './marquee.ts';
import { MatrixTool } from './matrix.ts';
import { PullQuoteTool } from './pull-quote.ts';
import { RankedTool } from './ranked.ts';
import { ScorecardTool } from './scorecard.ts';
import { ScrollyTool } from './scrolly.ts';
import { SidenoteTool } from './sidenote.ts';
import { SparklineTool } from './sparkline.ts';
import { StatRowTool } from './stat-row.ts';
import { StatementTool } from './statement.ts';
import { StepsTool } from './steps.ts';
import { TimelineTool } from './timeline.ts';
import { TypeLabTool } from './type-lab.ts';

export {
  BarsTool,
  CodeWalkTool,
  CompareTool,
  CurvedTextTool,
  DeltaTool,
  FunnelTool,
  GaugeTool,
  HeatmapTool,
  MarqueeTool,
  MatrixTool,
  PullQuoteTool,
  RankedTool,
  ScorecardTool,
  ScrollyTool,
  SidenoteTool,
  SparklineTool,
  StatementTool,
  StatRowTool,
  StepsTool,
  TimelineTool,
  TypeLabTool,
};

/**
 * Every Imaxt block tool, keyed by the name each block uses in generated MDX - pass this (or
 * a subset of it) as EditorJS's `tools` config to register them all at once. ImaxtCover is
 * intentionally absent: it is post-level frontmatter, not an EditorJS body block (see the
 * mdx-compilation spec).
 */
export const imaxtTools = {
  bars: BarsTool,
  codeWalk: CodeWalkTool,
  compare: CompareTool,
  curvedText: CurvedTextTool,
  delta: DeltaTool,
  funnel: FunnelTool,
  gauge: GaugeTool,
  heatmap: HeatmapTool,
  marquee: MarqueeTool,
  matrix: MatrixTool,
  pullQuote: PullQuoteTool,
  ranked: RankedTool,
  scorecard: ScorecardTool,
  scrolly: ScrollyTool,
  sidenote: SidenoteTool,
  sparkline: SparklineTool,
  statRow: StatRowTool,
  statement: StatementTool,
  steps: StepsTool,
  timeline: TimelineTool,
  typeLab: TypeLabTool,
} as const;
