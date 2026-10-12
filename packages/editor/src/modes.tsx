import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { type JSX, useEffect, useState } from 'react';
import { parseDocumentIntoEditor, serializeEditorToDocument } from './bridge/document.ts';
import { renderEditorToHtml } from './bridge/renderHtml.ts';
import { useImageAdapter } from './image/context.ts';

export type EditorMode = 'raw' | 'medium' | 'render';

export function ModeSwitcher({
  mode,
  onChange,
}: {
  mode: EditorMode;
  onChange: (mode: EditorMode) => void;
}): JSX.Element {
  const options: Array<{ key: EditorMode; label: string }> = [
    { key: 'raw', label: 'Raw' },
    { key: 'medium', label: 'Medium' },
    { key: 'render', label: 'Render' },
  ];
  return (
    <div className="imx-ed-mode-switcher" role="tablist" aria-label="Editor view">
      {options.map((option) => (
        <button
          key={option.key}
          type="button"
          role="tab"
          aria-selected={mode === option.key}
          data-active={mode === option.key}
          onClick={() => onChange(option.key)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

/** Edits the document as plain MDX/Markdown text. Commits back into the Lexical document on blur. */
export function RawMode(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [text, setText] = useState(() => serializeEditorToDocument(editor));

  return (
    <div className="imx-ed-raw">
      <textarea
        className="imx-ed-raw-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => parseDocumentIntoEditor(editor, text)}
        spellCheck={false}
        aria-label="Raw Markdown/MDX source"
      />
    </div>
  );
}

/** A read-only preview of the exact HTML a published page would render - standard Markdown as plain tags, Imaxt blocks through their real render functions. */
export function RenderMode(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const imageAdapter = useImageAdapter();
  const [html, setHtml] = useState(() => renderEditorToHtml(editor, imageAdapter));

  // Keep in sync while this view stays mounted: an edit made in Medium mode
  // right before switching here is already covered by the lazy initializer
  // above, but Raw mode can still commit a change while Render mode is open
  // in another instance, or a future image resolve() can settle later.
  useEffect(() => {
    return editor.registerUpdateListener(() => {
      setHtml(renderEditorToHtml(editor, imageAdapter));
    });
  }, [editor, imageAdapter]);

  return (
    // biome-ignore lint/security/noDangerouslySetInnerHtml: composed from imaxt-core's own render functions plus our own escaped text
    <article className="imx-ed-render prose" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
