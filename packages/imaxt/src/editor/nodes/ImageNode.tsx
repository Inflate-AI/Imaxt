import {
  DecoratorNode,
  type EditorConfig,
  type LexicalEditor,
  type LexicalNode,
  type NodeKey,
  type SerializedLexicalNode,
  type SerializedPartial,
  type Spread,
} from 'lexical';
import type { JSX } from 'react';
import { useImageSrc } from '../image/useImageSrc.ts';

export interface ImagePayload {
  ref: string;
  alt: string;
  title: string | null;
}

export type SerializedImageNode = Spread<ImagePayload, SerializedLexicalNode>;

function ImageComponent({ ref: imageRef, alt, title }: ImagePayload): JSX.Element {
  const src = useImageSrc(imageRef);
  return (
    <span className="imx-ed-image">
      {src ? (
        <img src={src} alt={alt} title={title ?? undefined} />
      ) : (
        <span className="imx-ed-image-loading" role="status">
          Loading image…
        </span>
      )}
    </span>
  );
}

/** A block-level image. `ref` is an opaque handle resolved at render time by an `ImageStorageAdapter`. */
export class ImageNode extends DecoratorNode<JSX.Element> {
  __ref: string;
  __alt: string;
  __title: string | null;

  static getType(): string {
    return 'imx-image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__ref, node.__alt, node.__title, node.__key);
  }

  static importJSON(
    serializedNode: SerializedPartial<SerializedLexicalNode> & Record<string, unknown>,
  ): ImageNode {
    const serialized = serializedNode as unknown as SerializedImageNode;
    return new ImageNode(serialized.ref, serialized.alt, serialized.title ?? null);
  }

  exportJSON(): SerializedImageNode {
    return {
      type: 'imx-image',
      version: 1,
      ref: this.__ref,
      alt: this.__alt,
      title: this.__title,
    };
  }

  constructor(ref: string, alt: string, title: string | null = null, key?: NodeKey) {
    super(key);
    this.__ref = ref;
    this.__alt = alt;
    this.__title = title;
  }

  getRef(): string {
    return this.getLatest().__ref;
  }

  getAlt(): string {
    return this.getLatest().__alt;
  }

  getTitle(): string | null {
    return this.getLatest().__title;
  }

  createDOM(_config: EditorConfig, _editor: LexicalEditor): HTMLElement {
    return document.createElement('span');
  }

  updateDOM(): boolean {
    return false;
  }

  isInline(): boolean {
    return false;
  }

  decorate(): JSX.Element {
    return <ImageComponent ref={this.__ref} alt={this.__alt} title={this.__title} />;
  }
}

export function $createImageNode(
  payload: Omit<ImagePayload, 'title'> & { title?: string | null },
): ImageNode {
  return new ImageNode(payload.ref, payload.alt, payload.title ?? null);
}

export function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode {
  return node instanceof ImageNode;
}
