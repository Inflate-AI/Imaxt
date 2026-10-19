import type { JSX } from 'react';
import type { FileTreeNode } from '../../core/index.ts';

function NodeEditor({
  node,
  onChange,
  onRemove,
}: {
  node: FileTreeNode;
  onChange: (next: FileTreeNode) => void;
  onRemove?: () => void;
}): JSX.Element {
  const children = node.children ?? [];
  return (
    <div className="imx-ed-tree-node">
      <div className="imx-ed-tree-row">
        <input
          type="text"
          value={node.name}
          onChange={(e) => onChange({ ...node, name: e.target.value })}
        />
        <button
          type="button"
          onClick={() => onChange({ ...node, children: [...children, { name: 'new-file' }] })}
        >
          + Child
        </button>
        {onRemove && (
          <button type="button" onClick={onRemove}>
            Remove
          </button>
        )}
      </div>
      {children.length > 0 && (
        <div className="imx-ed-tree-children">
          {children.map((child, index) => (
            <NodeEditor
              // biome-ignore lint/suspicious/noArrayIndexKey: this tree has no stable per-node id, and editing doesn't reorder children
              key={index}
              node={child}
              onChange={(nextChild) => {
                const next = children.slice();
                next[index] = nextChild;
                onChange({ ...node, children: next });
              }}
              onRemove={() => {
                const next = children.slice();
                next.splice(index, 1);
                onChange({ ...node, children: next });
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileTreeBlock({
  data,
  onChange,
}: {
  data: { tree: FileTreeNode[] };
  onChange: (next: { tree: FileTreeNode[] }) => void;
}): JSX.Element {
  return (
    <div className="imx-ed-form imx-ed-tree">
      {data.tree.map((node, index) => (
        <NodeEditor
          // biome-ignore lint/suspicious/noArrayIndexKey: this tree has no stable per-node id, and editing doesn't reorder children
          key={index}
          node={node}
          onChange={(next) => {
            const tree = data.tree.slice();
            tree[index] = next;
            onChange({ tree });
          }}
          onRemove={() => {
            const tree = data.tree.slice();
            tree.splice(index, 1);
            onChange({ tree });
          }}
        />
      ))}
      <button
        type="button"
        onClick={() => onChange({ tree: [...data.tree, { name: 'new-file' }] })}
      >
        + Add root entry
      </button>
    </div>
  );
}
