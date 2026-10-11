import type {
  BarsData,
  CodeWalkData,
  CompareData,
  CurvedTextData,
  DeltaData,
  FunnelData,
  GaugeData,
  HeatmapData,
  MarqueeData,
  MatrixData,
  PullQuoteData,
  RankedData,
  ScorecardData,
  ScrollyData,
  SidenoteData,
  SparklineData,
  StatementData,
  StatRowData,
  StepsData,
  TimelineData,
  TypeLabData,
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
  /** Content this compiler does not recognize (plain prose, non-Imaxt JSX): preserved verbatim. */
  | { type: 'markdown'; source: string };

export interface ImaxtDocument {
  frontmatter: Record<string, unknown>;
  blocks: Block[];
}
