import { BarsTool } from './bars.ts';
import { CalloutTool } from './callout.ts';
import { ChecklistTool } from './checklist.ts';
import { CodeWalkTool } from './code-walk.ts';
import { CompareTool } from './compare.ts';
import { CurvedTextTool } from './curved-text.ts';
import { DeltaTool } from './delta.ts';
import { FaqTool } from './faq.ts';
import { FootnoteTool } from './footnote.ts';
import { FunnelTool } from './funnel.ts';
import { GaugeTool } from './gauge.ts';
import { GlossaryTool } from './glossary.ts';
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
import { TakeawaysTool } from './takeaways.ts';
import { TimelineTool } from './timeline.ts';
import { TypeLabTool } from './type-lab.ts';
import { VersusTool } from './versus.ts';

export {
  BarsTool,
  CalloutTool,
  ChecklistTool,
  CodeWalkTool,
  CompareTool,
  CurvedTextTool,
  DeltaTool,
  FaqTool,
  FootnoteTool,
  FunnelTool,
  GaugeTool,
  GlossaryTool,
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
  TakeawaysTool,
  TimelineTool,
  TypeLabTool,
  VersusTool,
};

/**
 * Every Imaxt block tool, keyed by the name each block uses in generated MDX - pass this (or
 * a subset of it) as EditorJS's `tools` config to register them all at once. ImaxtCover is
 * intentionally absent: it is post-level frontmatter, not an EditorJS body block (see the
 * mdx-compilation spec).
 */
export const imaxtTools = {
  bars: BarsTool,
  callout: CalloutTool,
  checklist: ChecklistTool,
  codeWalk: CodeWalkTool,
  compare: CompareTool,
  curvedText: CurvedTextTool,
  delta: DeltaTool,
  faq: FaqTool,
  footnote: FootnoteTool,
  funnel: FunnelTool,
  gauge: GaugeTool,
  glossary: GlossaryTool,
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
  takeaways: TakeawaysTool,
  timeline: TimelineTool,
  typeLab: TypeLabTool,
  versus: VersusTool,
} as const;
