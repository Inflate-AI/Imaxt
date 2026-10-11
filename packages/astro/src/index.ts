import Bars from './Bars.astro';
import Beat from './Beat.astro';
import Callout from './Callout.astro';
import Changelog from './Changelog.astro';
import Checklist from './Checklist.astro';
import CodeWalk from './CodeWalk.astro';
import Compare from './Compare.astro';
import CurvedText from './CurvedText.astro';
import Delta from './Delta.astro';
import Diff from './Diff.astro';
import ErrorBox from './ErrorBox.astro';
import Event from './Event.astro';
import Faq from './Faq.astro';
import FileTree from './FileTree.astro';
import Footnote from './Footnote.astro';
import Funnel from './Funnel.astro';
import Gauge from './Gauge.astro';
import Glossary from './Glossary.astro';
import Heatmap from './Heatmap.astro';
import Marquee from './Marquee.astro';
import Matrix from './Matrix.astro';
import PullQuote from './PullQuote.astro';
import Ranked from './Ranked.astro';
import Scorecard from './Scorecard.astro';
import Scrolly from './Scrolly.astro';
import Side from './Side.astro';
import Sidenote from './Sidenote.astro';
import Sparkline from './Sparkline.astro';
import Stat from './Stat.astro';
import Statement from './Statement.astro';
import StatRow from './StatRow.astro';
import Step from './Step.astro';
import Steps from './Steps.astro';
import Takeaways from './Takeaways.astro';
import Terminal from './Terminal.astro';
import Timeline from './Timeline.astro';
import TypeLab from './TypeLab.astro';
import Versus from './Versus.astro';

export { default as ImaxtCover } from './ImaxtCover.astro';

/** Passed to `<Content components={imaxt} />` so an .mdx post can use every block with no imports. */
export const imaxt = {
  Statement,
  Stat,
  StatRow,
  PullQuote,
  Compare,
  Side,
  Steps,
  Step,
  Timeline,
  Event,
  Bars,
  Ranked,
  Matrix,
  Delta,
  Gauge,
  Scorecard,
  Sparkline,
  Funnel,
  Callout,
  Faq,
  Takeaways,
  Footnote,
  Glossary,
  Versus,
  Checklist,
  Terminal,
  Diff,
  FileTree,
  ErrorBox,
  Changelog,
  Sidenote,
  CodeWalk,
  Marquee,
  Heatmap,
  CurvedText,
  Scrolly,
  Beat,
  TypeLab,
};
