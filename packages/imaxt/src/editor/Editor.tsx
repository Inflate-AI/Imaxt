import { CodeHighlightNode } from '@lexical/code';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { type JSX, useEffect, useState } from 'react';
import { parseDocumentIntoEditor, serializeEditorToDocument } from './bridge/document.ts';
import { createInMemoryImageStorageAdapter, type ImageStorageAdapter } from './image/adapter.ts';
import { ImageAdapterContext } from './image/context.ts';
import { type EditorMode, ModeSwitcher, RawMode, RenderMode } from './modes.tsx';
import { EDITOR_NODES } from './nodes/index.ts';
import { DragHandlePlugin } from './plugins/DragHandlePlugin.tsx';
import { FloatingToolbarPlugin } from './plugins/FloatingToolbarPlugin.tsx';
import { SlashMenuPlugin } from './plugins/SlashMenuPlugin.tsx';
import { type ImaxtEditorTheme, themeToStyle } from './theme/applyTheme.ts';
import { EDITOR_THEME } from './theme/lexicalTheme.ts';

export interface ImaxtEditorProps {
  /** MDX/Markdown source to load when the editor mounts. Uncontrolled after that. */
  initialValue?: string;
  /** Called with the current MDX/Markdown source on every change. */
  onChange?: (markdown: string) => void;
  /** Where inserted images go. Defaults to an in-memory, no-backend adapter. */
  imageAdapter?: ImageStorageAdapter;
  /** CSS custom-property overrides - see `editor.css`. Omit to inherit whatever theme (Blog's, imaxt-core's, or your own) is already loaded on the page. */
  theme?: ImaxtEditorTheme;
  /** 'light' | 'dark', written as `data-theme` on the root - matches Blog's own `:root[data-theme]` mechanism. Omit to follow the page/OS. */
  colorScheme?: 'light' | 'dark';
  placeholder?: string;
  className?: string;
}

function LoadInitialValuePlugin({ initialValue }: { initialValue: string }): null {
  const [editor] = useLexicalComposerContext();
  const [loadedValue] = useState(initialValue);
  useEffect(() => {
    // `loadedDocument` is captured once on mount: this editor is uncontrolled
    // after that, so re-running this on every `initialValue` change would
    // blow away in-progress edits.
    parseDocumentIntoEditor(editor, loadedValue);
  }, [editor, loadedValue]);
  return null;
}

function ChangeListenerPlugin({ onChange }: { onChange: (markdown: string) => void }): null {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerUpdateListener(() => {
      onChange(serializeEditorToDocument(editor));
    });
  }, [editor, onChange]);
  return null;
}

export function ImaxtEditor({
  initialValue = '',
  onChange,
  imageAdapter,
  theme,
  colorScheme,
  placeholder = "Write, or press '/' for commands…",
  className,
}: ImaxtEditorProps): JSX.Element {
  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);
  const [adapter] = useState<ImageStorageAdapter>(
    () => imageAdapter ?? createInMemoryImageStorageAdapter(),
  );
  const [mode, setMode] = useState<EditorMode>('medium');

  const initialConfig = {
    namespace: 'imaxt-editor',
    theme: EDITOR_THEME,
    onError: (error: Error) => {
      throw error;
    },
    nodes: [...EDITOR_NODES, CodeHighlightNode],
  };

  return (
    <ImageAdapterContext.Provider value={adapter}>
      <LexicalComposer initialConfig={initialConfig}>
        <div
          className={['imx-editor', className].filter(Boolean).join(' ')}
          data-theme={colorScheme}
          style={themeToStyle(theme)}
        >
          <ModeSwitcher mode={mode} onChange={setMode} />
          <div
            className="imx-ed-editable-wrap"
            style={{ display: mode === 'medium' ? undefined : 'none' }}
            ref={setFloatingAnchorElem}
          >
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className="imx-ed-content"
                  aria-placeholder={placeholder}
                  placeholder={<div className="imx-ed-placeholder">{placeholder}</div>}
                />
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            {floatingAnchorElem && (
              <>
                <FloatingToolbarPlugin anchorElem={floatingAnchorElem} />
                <DragHandlePlugin anchorElem={floatingAnchorElem} />
                <SlashMenuPlugin anchorElem={floatingAnchorElem} />
              </>
            )}
          </div>
          {mode === 'raw' && <RawMode />}
          {mode === 'render' && <RenderMode />}
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ListPlugin />
          <CheckListPlugin />
          <LinkPlugin />
          <TablePlugin />
          <LoadInitialValuePlugin initialValue={initialValue} />
          {onChange && <ChangeListenerPlugin onChange={onChange} />}
        </div>
      </LexicalComposer>
    </ImageAdapterContext.Provider>
  );
}
