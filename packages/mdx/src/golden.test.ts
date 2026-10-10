import { describe, expect, test } from 'bun:test';
import { mdxToBlocks } from './from-mdx.ts';
import { blocksToMdx } from './to-mdx.ts';

const GOLDEN_POST = `---
title: One API for every vector
description: Every retrieval project rebuilds the same plumbing.
date: 2026-01-10
tags: [search, vectors]
cover:
  kind: stack
  text: One API for every vector
---

A short introduction paragraph before the first block.

<Statement tone="mint" align="center">
  Every retrieval project rebuilds the **same plumbing**.
</Statement>

More prose between two blocks, with *emphasis* in it.

<StatRow>
  <Stat value="5" unit="ms" label="p95 query time" tone="mint" />
  <Stat value="10×" label="fewer calls" tone="sky" />
</StatRow>

<Compare>
  <Side kind="before" label="Before">Three pipelines, three sets of bugs</Side>
  <Side label="After">One small API, one set of bugs</Side>
</Compare>

<Steps>
  <Step title="Chunk">Split each document into pieces.</Step>
  <Step title="Embed">Turn every chunk into a vector.</Step>
</Steps>

A closing paragraph at the end of the post.
`;

describe('a realistic post with every block family', () => {
  test('parses every block and preserves surrounding prose', () => {
    const parsed = mdxToBlocks(GOLDEN_POST);
    expect(parsed.frontmatter.title).toBe('One API for every vector');
    expect(parsed.frontmatter.cover).toEqual({ kind: 'stack', text: 'One API for every vector' });

    const types = parsed.blocks.map((b) => b.type);
    expect(types).toEqual([
      'markdown',
      'statement',
      'markdown',
      'stat-row',
      'compare',
      'steps',
      'markdown',
    ]);
  });

  test('recompiling the parsed post keeps every block recognizable and in order', () => {
    const parsed = mdxToBlocks(GOLDEN_POST);
    const recompiled = blocksToMdx(parsed);
    const reparsed = mdxToBlocks(recompiled);
    expect(reparsed.blocks).toEqual(parsed.blocks);
    expect(reparsed.frontmatter).toEqual(parsed.frontmatter);
  });
});
