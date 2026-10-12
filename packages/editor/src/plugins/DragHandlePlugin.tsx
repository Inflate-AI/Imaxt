import { DraggableBlockPlugin_EXPERIMENTAL } from '@lexical/react/LexicalDraggableBlockPlugin';
import { type JSX, useRef } from 'react';

/** A drag handle in the left gutter of the hovered top-level block, for reordering. Hidden on touch/narrow viewports (see editor.css). */
export function DragHandlePlugin({ anchorElem }: { anchorElem: HTMLElement }): JSX.Element {
  const menuRef = useRef<HTMLDivElement>(null);
  const targetLineRef = useRef<HTMLDivElement>(null);

  return (
    <DraggableBlockPlugin_EXPERIMENTAL
      anchorElem={anchorElem}
      menuRef={menuRef as never}
      targetLineRef={targetLineRef as never}
      menuComponent={
        <div className="imx-ed-drag-handle" ref={menuRef}>
          ⠿
        </div>
      }
      targetLineComponent={<div className="imx-ed-drag-target-line" ref={targetLineRef} />}
      isOnMenu={(element) => Boolean(element.closest('.imx-ed-drag-handle'))}
    />
  );
}
