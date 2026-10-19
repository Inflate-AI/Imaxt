import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { type JSX, useCallback, useEffect, useState } from 'react';

interface Position {
  top: number;
  left: number;
}

export function FloatingToolbarPlugin({
  anchorElem,
}: {
  anchorElem: HTMLElement;
}): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [position, setPosition] = useState<Position | null>(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isLink, setIsLink] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection) || selection.isCollapsed()) {
      setPosition(null);
      return;
    }
    setIsBold(selection.hasFormat('bold'));
    setIsItalic(selection.hasFormat('italic'));
    setIsCode(selection.hasFormat('code'));
    setIsStrikethrough(selection.hasFormat('strikethrough'));
    const node = selection.getNodes()[0];
    setIsLink(Boolean(node && $isLinkNode(node.getParent())));

    const domSelection = window.getSelection();
    if (!domSelection || domSelection.rangeCount === 0) {
      setPosition(null);
      return;
    }
    const rect = domSelection.getRangeAt(0).getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
      setPosition(null);
      return;
    }
    const anchorRect = anchorElem.getBoundingClientRect();
    setPosition({
      top: rect.top - anchorRect.top - 44,
      left: Math.max(0, rect.left - anchorRect.left + rect.width / 2 - 80),
    });
  }, [anchorElem]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateToolbar();
        return false;
      },
      1,
    );
  }, [editor, updateToolbar]);

  useEffect(() => {
    return editor.registerUpdateListener(() => {
      editor.getEditorState().read(updateToolbar);
    });
  }, [editor, updateToolbar]);

  if (!position) return null;

  return (
    <div className="imx-ed-floating-toolbar" style={{ top: position.top, left: position.left }}>
      <button
        type="button"
        data-active={isBold}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        aria-label="Bold"
      >
        B
      </button>
      <button
        type="button"
        data-active={isItalic}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        aria-label="Italic"
      >
        I
      </button>
      <button
        type="button"
        data-active={isStrikethrough}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
        aria-label="Strikethrough"
      >
        S
      </button>
      <button
        type="button"
        data-active={isCode}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}
        aria-label="Code"
      >
        {'</>'}
      </button>
      <button
        type="button"
        data-active={isLink}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          if (isLink) {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
            return;
          }
          const url = window.prompt('Link URL');
          if (url) editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
        }}
        aria-label="Link"
      >
        🔗
      </button>
    </div>
  );
}
