import { BannerTool } from './banner.ts';
import { BarsTool } from './bars.ts';
import { CalloutTool } from './callout.ts';
import { ChangelogTool } from './changelog.ts';
import { ChecklistTool } from './checklist.ts';
import { CodeWalkTool } from './code-walk.ts';
import { CompareTool } from './compare.ts';
import { CurvedTextTool } from './curved-text.ts';
import { DeltaTool } from './delta.ts';
import { DiffTool } from './diff.ts';
import { DropCapTool } from './drop-cap.ts';
import { ErrorBoxTool } from './error-box.ts';
import { FaqTool } from './faq.ts';
import { FileTreeTool } from './file-tree.ts';
import { FootnoteTool } from './footnote.ts';
import { FormulaTool } from './formula.ts';
import { FunnelTool } from './funnel.ts';
import { GaugeTool } from './gauge.ts';
import { GlossaryTool } from './glossary.ts';
import { HeatmapTool } from './heatmap.ts';
import { MarqueeTool } from './marquee.ts';
import { MatrixTool } from './matrix.ts';
import { PullQuoteTool } from './pull-quote.ts';
import { RankedTool } from './ranked.ts';
import { RedactedTool } from './redacted.ts';
import { ScorecardTool } from './scorecard.ts';
import { ScrollyTool } from './scrolly.ts';
import { SidenoteTool } from './sidenote.ts';
import { SparklineTool } from './sparkline.ts';
import { StampTool } from './stamp.ts';
import { StatRowTool } from './stat-row.ts';
import { StatementTool } from './statement.ts';
import { StepsTool } from './steps.ts';
import { TakeawaysTool } from './takeaways.ts';
import { TerminalTool } from './terminal.ts';
import { TickerTool } from './ticker.ts';
import { TimelineTool } from './timeline.ts';
import { TypeLabTool } from './type-lab.ts';
import { VersusTool } from './versus.ts';

export {
  BannerTool,
  BarsTool,
  CalloutTool,
  ChangelogTool,
  ChecklistTool,
  CodeWalkTool,
  CompareTool,
  CurvedTextTool,
  DeltaTool,
  DiffTool,
  DropCapTool,
  ErrorBoxTool,
  FaqTool,
  FileTreeTool,
  FootnoteTool,
  FormulaTool,
  FunnelTool,
  GaugeTool,
  GlossaryTool,
  HeatmapTool,
  MarqueeTool,
  MatrixTool,
  PullQuoteTool,
  RankedTool,
  RedactedTool,
  ScorecardTool,
  ScrollyTool,
  SidenoteTool,
  SparklineTool,
  StampTool,
  StatementTool,
  StatRowTool,
  StepsTool,
  TakeawaysTool,
  TerminalTool,
  TickerTool,
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
  banner: BannerTool,
  bars: BarsTool,
  callout: CalloutTool,
  changelog: ChangelogTool,
  checklist: ChecklistTool,
  codeWalk: CodeWalkTool,
  compare: CompareTool,
  curvedText: CurvedTextTool,
  delta: DeltaTool,
  diff: DiffTool,
  dropCap: DropCapTool,
  errorBox: ErrorBoxTool,
  faq: FaqTool,
  fileTree: FileTreeTool,
  footnote: FootnoteTool,
  formula: FormulaTool,
  funnel: FunnelTool,
  gauge: GaugeTool,
  glossary: GlossaryTool,
  heatmap: HeatmapTool,
  marquee: MarqueeTool,
  matrix: MatrixTool,
  pullQuote: PullQuoteTool,
  ranked: RankedTool,
  redacted: RedactedTool,
  scorecard: ScorecardTool,
  scrolly: ScrollyTool,
  sidenote: SidenoteTool,
  sparkline: SparklineTool,
  stamp: StampTool,
  statRow: StatRowTool,
  statement: StatementTool,
  steps: StepsTool,
  takeaways: TakeawaysTool,
  terminal: TerminalTool,
  ticker: TickerTool,
  timeline: TimelineTool,
  typeLab: TypeLabTool,
  versus: VersusTool,
} as const;
