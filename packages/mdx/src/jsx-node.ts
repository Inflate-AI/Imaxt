import type { PhrasingContent } from 'mdast';
import { parseJsLiteral, stringifyJsLiteral } from './js-literal.ts';

/** Minimal local shape for the MDX-JSX nodes `mdast-util-mdx` adds to the mdast tree. */
export interface MdxJsxAttribute {
  type: 'mdxJsxAttribute';
  name: string;
  value?: string | { type: 'mdxJsxAttributeValueExpression'; value: string } | null;
}

export interface MdxJsxElement {
  type: 'mdxJsxFlowElement' | 'mdxJsxTextElement';
  name: string | null;
  attributes: MdxJsxAttribute[];
  children: unknown[];
}

export function isMdxJsxElement(node: unknown): node is MdxJsxElement {
  const type = (node as { type?: string } | undefined)?.type;
  return type === 'mdxJsxFlowElement' || type === 'mdxJsxTextElement';
}

export function getStringAttr(element: MdxJsxElement, name: string): string | undefined {
  const attr = element.attributes.find((a) => a.name === name);
  return typeof attr?.value === 'string' ? attr.value : undefined;
}

export function getExprAttr(element: MdxJsxElement, name: string): unknown {
  const attr = element.attributes.find((a) => a.name === name);
  if (attr?.value && typeof attr.value === 'object') return parseJsLiteral(attr.value.value);
  return undefined;
}

export function stringAttr(name: string, value: string | undefined): MdxJsxAttribute[] {
  return value === undefined ? [] : [{ type: 'mdxJsxAttribute', name, value }];
}

export function exprAttr(name: string, value: unknown): MdxJsxAttribute[] {
  return value === undefined
    ? []
    : [
        {
          type: 'mdxJsxAttribute',
          name,
          value: { type: 'mdxJsxAttributeValueExpression', value: stringifyJsLiteral(value) },
        },
      ];
}

export function jsxElement(
  name: string,
  attributes: MdxJsxAttribute[],
  children: unknown[] = [],
): MdxJsxElement {
  return { type: 'mdxJsxFlowElement', name, attributes, children };
}

/** Wraps phrasing content (and only phrasing content) in a paragraph, matching how MDX treats a JSX element's inline text children. */
export function paragraphChildren(children: PhrasingContent[]): unknown[] {
  return children.length ? [{ type: 'paragraph', children }] : [];
}

/** Flattens an element's children (expected to be a single paragraph of phrasing content, as {@link paragraphChildren} produces) back to phrasing content. */
export function flattenToPhrasing(children: unknown[]): PhrasingContent[] {
  return children.flatMap((child) => {
    const node = child as { type?: string; children?: PhrasingContent[] };
    return node.type === 'paragraph' && node.children ? node.children : [];
  });
}
