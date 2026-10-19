import { $getSelection, $isElementNode, $isRangeSelection, type LexicalNode } from 'lexical';

/**
 * Replaces the current (expected-empty, just-cleared-by-the-slash-query)
 * top-level block with `node`, or inserts after it if it already has content.
 */
export function replaceCurrentBlockWith(node: LexicalNode): void {
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) return;
  const anchorNode = selection.anchor.getNode();
  const topLevel = anchorNode.getTopLevelElement() ?? anchorNode;
  if ($isElementNode(topLevel) && topLevel.getTextContent().trim() === '') {
    topLevel.replace(node);
  } else {
    topLevel.insertAfter(node);
  }
}
