// A handful of Imaxt blocks ship their own client-side behavior (TypeLab's
// sliders, Ticker's cycling, Scrolly's scroll-linking, ...) that a published
// page wires up by calling the matching `attach*` export after rendering -
// see any interactive block's `*.astro` component in packages/astro. The
// editor's preview is no different: without this, these blocks render as
// inert markup (worse, TypeLab's controls are CSS-disabled until
// `attachTypeLab` sets `data-ready`, so they look broken rather than static).
import {
  attachCodeWalk,
  attachScrolly,
  attachStatCountUp,
  attachTicker,
  attachTypeLab,
} from '@inflate-ai/imaxt-core';
import type { Block } from '@inflate-ai/imaxt-mdx';

type Attacher = (root: ParentNode) => () => void;

const ATTACHERS: Partial<Record<Block['type'], Attacher>> = {
  'type-lab': attachTypeLab,
  ticker: attachTicker,
  scrolly: attachScrolly,
  'code-walk': attachCodeWalk,
  'stat-row': attachStatCountUp,
};

const ALL_ATTACHERS: Attacher[] = [
  attachTypeLab,
  attachTicker,
  attachScrolly,
  attachCodeWalk,
  attachStatCountUp,
];

/** Wires up one freshly-rendered block's interactive behavior, if its type needs any. */
export function attachInteractiveBlock(root: ParentNode, type: Block['type']): () => void {
  const attach = ATTACHERS[type];
  return attach ? attach(root) : () => {};
}

/** Wires up every interactive block found anywhere under `root` - for a view (like Render mode) holding a whole document rather than one block. */
export function attachInteractiveBlocks(root: ParentNode): () => void {
  const disposers = ALL_ATTACHERS.map((attach) => attach(root));
  return () => {
    for (const dispose of disposers) dispose();
  };
}
