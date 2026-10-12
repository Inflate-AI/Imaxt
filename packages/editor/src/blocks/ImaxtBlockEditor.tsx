import type { Block } from '@inflate-ai/imaxt-mdx';
import { type JSX, useEffect, useRef, useState } from 'react';
import { attachInteractiveBlock } from './attachInteractive.ts';
import { BLOCK_CONFIGS } from './block-config.ts';
import { FileTreeBlock } from './FileTreeBlock.tsx';
import { GenericBlockForm } from './GenericBlockForm.tsx';
import { HeatmapBlock } from './HeatmapBlock.tsx';
import { MatrixBlock } from './MatrixBlock.tsx';
import { renderBlockPreview } from './renderBlock.ts';

type AnyData = Record<string, unknown>;

const CUSTOM_BLOCK_TITLES: Record<string, string> = {
  matrix: 'Matrix',
  heatmap: 'Heatmap',
  'file-tree': 'FileTree',
};

/** The live preview for one block - the exact HTML `renderBlockPreview` produces, with its client-side behavior (if any) wired up, same as a published page. */
function BlockPreview({ block }: { block: Block }): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const html = renderBlockPreview(block);

  useEffect(() => {
    if (!ref.current) return;
    return attachInteractiveBlock(ref.current, block.type);
  }, [block]);

  return (
    <div
      ref={ref}
      className="imx-ed-block-preview"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: this is imaxt-core's own sanitized render output
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function ImaxtBlockEditor({
  block,
  onChange,
}: {
  block: Block;
  onChange: (next: Block) => void;
}): JSX.Element {
  const [editing, setEditing] = useState(false);

  if (block.type === 'markdown') {
    // Content this editor doesn't model as a dedicated node yet; shown read-only.
    return <pre className="imx-ed-block-raw">{block.source}</pre>;
  }

  const config = BLOCK_CONFIGS[block.type];

  return (
    <div className="imx-ed-imaxt-block" data-editing={editing}>
      <div className="imx-ed-block-toolbar">
        <span className="imx-ed-block-label">
          {config?.title ?? CUSTOM_BLOCK_TITLES[block.type] ?? block.type}
        </span>
        <button type="button" onClick={() => setEditing((v) => !v)}>
          {editing ? 'Done' : 'Edit'}
        </button>
      </div>
      {editing ? (
        <div className="imx-ed-block-edit">
          {block.type === 'matrix' ? (
            <MatrixBlock
              data={block.data}
              onChange={(data) => onChange({ type: 'matrix', data })}
            />
          ) : block.type === 'heatmap' ? (
            <HeatmapBlock
              data={block.data}
              onChange={(data) => onChange({ type: 'heatmap', data })}
            />
          ) : block.type === 'file-tree' ? (
            <FileTreeBlock
              data={block.data}
              onChange={(data) => onChange({ type: 'file-tree', data })}
            />
          ) : config ? (
            <GenericBlockForm
              fields={config.fields}
              data={block.data as AnyData}
              onChange={(data) => onChange({ ...block, data } as Block)}
            />
          ) : (
            <p className="imx-ed-block-unsupported">No editor configured for "{block.type}" yet.</p>
          )}
        </div>
      ) : (
        <BlockPreview block={block} />
      )}
    </div>
  );
}
