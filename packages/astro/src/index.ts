import Bars from './Bars.astro';
import Beat from './Beat.astro';
import CodeWalk from './CodeWalk.astro';
import Compare from './Compare.astro';
import CurvedText from './CurvedText.astro';
import Event from './Event.astro';
import Heatmap from './Heatmap.astro';
import Marquee from './Marquee.astro';
import PullQuote from './PullQuote.astro';
import Scrolly from './Scrolly.astro';
import Side from './Side.astro';
import Sidenote from './Sidenote.astro';
import Stat from './Stat.astro';
import Statement from './Statement.astro';
import StatRow from './StatRow.astro';
import Step from './Step.astro';
import Steps from './Steps.astro';
import Timeline from './Timeline.astro';
import TypeLab from './TypeLab.astro';

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
  Sidenote,
  CodeWalk,
  Marquee,
  Heatmap,
  CurvedText,
  Scrolly,
  Beat,
  TypeLab,
};
