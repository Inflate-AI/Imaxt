import type {
  BannerData,
  BarsData,
  CalloutData,
  ChangelogData,
  ChecklistData,
  CodeWalkData,
  CompareData,
  CurvedTextData,
  DeltaData,
  DiffData,
  DropCapData,
  EmbedData,
  ErrorBoxData,
  FaqData,
  FileTreeData,
  FootnoteData,
  FormulaData,
  FunnelData,
  GaugeData,
  GlossaryData,
  HeatmapData,
  MarqueeData,
  MatrixData,
  PullQuoteData,
  RankedData,
  RedactedData,
  ScorecardData,
  ScrollyData,
  SidenoteData,
  SparklineData,
  StampData,
  StatementData,
  StatRowData,
  StepsData,
  TakeawaysData,
  TerminalData,
  TickerData,
  TimelineData,
  TypeLabData,
  VersusData,
} from '@inflate-ai/imaxt-core';

export type Block =
  | { type: 'statement'; data: StatementData }
  | { type: 'pull-quote'; data: PullQuoteData }
  | { type: 'sidenote'; data: SidenoteData }
  | { type: 'bars'; data: BarsData }
  | { type: 'ranked'; data: RankedData }
  | { type: 'matrix'; data: MatrixData }
  | { type: 'delta'; data: DeltaData }
  | { type: 'gauge'; data: GaugeData }
  | { type: 'scorecard'; data: ScorecardData }
  | { type: 'sparkline'; data: SparklineData }
  | { type: 'funnel'; data: FunnelData }
  | { type: 'callout'; data: CalloutData }
  | { type: 'faq'; data: FaqData }
  | { type: 'takeaways'; data: TakeawaysData }
  | { type: 'footnote'; data: FootnoteData }
  | { type: 'glossary'; data: GlossaryData }
  | { type: 'versus'; data: VersusData }
  | { type: 'checklist'; data: ChecklistData }
  | { type: 'terminal'; data: TerminalData }
  | { type: 'diff'; data: DiffData }
  | { type: 'file-tree'; data: FileTreeData }
  | { type: 'error-box'; data: ErrorBoxData }
  | { type: 'changelog'; data: ChangelogData }
  | { type: 'formula'; data: FormulaData }
  | { type: 'ticker'; data: TickerData }
  | { type: 'drop-cap'; data: DropCapData }
  | { type: 'redacted'; data: RedactedData }
  | { type: 'stamp'; data: StampData }
  | { type: 'banner'; data: BannerData }
  | { type: 'marquee'; data: MarqueeData }
  | { type: 'heatmap'; data: HeatmapData }
  | { type: 'curved-text'; data: CurvedTextData }
  | { type: 'type-lab'; data: TypeLabData }
  | { type: 'stat-row'; data: StatRowData }
  | { type: 'compare'; data: CompareData }
  | { type: 'steps'; data: StepsData }
  | { type: 'timeline'; data: TimelineData }
  | { type: 'scrolly'; data: ScrollyData }
  | { type: 'code-walk'; data: CodeWalkData }
  | { type: 'embed'; data: EmbedData }
  /** Content this compiler does not recognize (plain prose, non-Imaxt JSX): preserved verbatim. */
  | { type: 'markdown'; source: string };

export interface ImaxtDocument {
  frontmatter: Record<string, unknown>;
  blocks: Block[];
}
