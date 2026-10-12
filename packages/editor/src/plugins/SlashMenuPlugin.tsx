import { $createCodeNode } from '@lexical/code';
import { $insertList } from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $createTableNodeWithDimensions } from '@lexical/table';
import { $getSelection, $isRangeSelection, type TextNode } from 'lexical';
import { type JSX, useCallback, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  BLOCK_CONFIGS,
  type BlockCategory,
  CUSTOM_BLOCK_META,
  CUSTOM_BLOCK_TYPES,
} from '../blocks/block-config.ts';
import { createDefaultBlock } from '../blocks/block-defaults.ts';
import { useImageAdapter } from '../image/context.ts';
import { $createImageNode } from '../nodes/ImageNode.tsx';
import { $createImaxtBlockNode } from '../nodes/ImaxtBlockNode.tsx';
import { replaceCurrentBlockWith } from './insertBlock.ts';

/** Groups shown in the menu, in display order - 'Markdown' first (the everyday basics), then every Imaxt BlockCategory. */
type SlashGroup = 'Markdown' | BlockCategory;
const GROUP_ORDER: SlashGroup[] = [
  'Markdown',
  'Media',
  'Typography',
  'Data & Stats',
  'Narrative',
  'Technical',
  'Visual & Motion',
];

/** A short, deterministic 1-2 letter monogram for blocks that don't have a hand-picked glyph - "Pull quote" -> "PQ", "Statement" -> "St". */
function monogram(label: string): string {
  const words = label.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return ((words[0]?.[0] ?? '') + (words[1]?.[0] ?? '')).toUpperCase();
  }
  return label.slice(0, 2);
}

class SlashOption extends MenuOption {
  constructor(
    public label: string,
    public group: SlashGroup,
    public glyph: string,
    public onSelect: () => void,
    public description?: string,
  ) {
    super(label);
  }
}

function markdownOptions(): SlashOption[] {
  return [
    new SlashOption(
      'Heading 1',
      'Markdown',
      'H1',
      () => replaceCurrentBlockWith($createHeadingNode('h1')),
      'Big section heading',
    ),
    new SlashOption(
      'Heading 2',
      'Markdown',
      'H2',
      () => replaceCurrentBlockWith($createHeadingNode('h2')),
      'Medium section heading',
    ),
    new SlashOption(
      'Heading 3',
      'Markdown',
      'H3',
      () => replaceCurrentBlockWith($createHeadingNode('h3')),
      'Small section heading',
    ),
    new SlashOption(
      'Quote',
      'Markdown',
      '"',
      () => replaceCurrentBlockWith($createQuoteNode()),
      'A plain blockquote',
    ),
    new SlashOption(
      'Code block',
      'Markdown',
      '{}',
      () => replaceCurrentBlockWith($createCodeNode()),
      'Monospaced, syntax-highlighted',
    ),
    new SlashOption(
      'Bulleted list',
      'Markdown',
      '•',
      () => $insertList('bullet'),
      'A simple unordered list',
    ),
    new SlashOption(
      'Numbered list',
      'Markdown',
      '1.',
      () => $insertList('number'),
      'An ordered list',
    ),
    new SlashOption(
      'Checklist',
      'Markdown',
      '☑',
      () => $insertList('check'),
      'A to-do list with checkboxes',
    ),
    new SlashOption(
      'Table',
      'Markdown',
      '▦',
      () => replaceCurrentBlockWith($createTableNodeWithDimensions(3, 3, true)),
      'A 3x3 GFM table',
    ),
  ];
}

function imaxtOptions(): SlashOption[] {
  const options: SlashOption[] = [];
  for (const type of Object.keys(BLOCK_CONFIGS) as Array<keyof typeof BLOCK_CONFIGS>) {
    const config = BLOCK_CONFIGS[type];
    if (!config) continue;
    options.push(
      new SlashOption(config.title, config.category, monogram(config.title), () =>
        replaceCurrentBlockWith($createImaxtBlockNode(createDefaultBlock(type))),
      ),
    );
  }
  for (const type of CUSTOM_BLOCK_TYPES) {
    const meta = CUSTOM_BLOCK_META[type];
    options.push(
      new SlashOption(meta.title, meta.category, monogram(meta.title), () =>
        replaceCurrentBlockWith($createImaxtBlockNode(createDefaultBlock(type))),
      ),
    );
  }
  return options;
}

export function SlashMenuPlugin({ anchorElem }: { anchorElem: HTMLElement }): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [query, setQuery] = useState<string | null>(null);
  const imageAdapter = useImageAdapter();
  // allowWhitespace: true - several block titles are two words ("Pull
  // quote", "Stat row", "Type lab", ...), and without it the match ends at
  // the first space, silently dropping the menu and leaving the rest of the
  // query behind as plain text.
  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
    minLength: 0,
    allowWhitespace: true,
  });

  const allOptions = useMemo(() => {
    const mediaOption = new SlashOption(
      'Image',
      'Media',
      '🖼',
      () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = () => {
          const file = input.files?.[0];
          if (!file) return;
          imageAdapter.upload(file).then(({ ref }) => {
            editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                replaceCurrentBlockWith($createImageNode({ ref, alt: file.name }));
              }
            });
          });
        };
        input.click();
      },
      'Upload an image from your device',
    );
    return [...markdownOptions(), mediaOption, ...imaxtOptions()];
  }, [editor, imageAdapter]);

  // Every block is always reachable: no query shows the full, grouped
  // catalog (the menu scrolls - see editor.css), and a query just narrows
  // it. Browsing the whole list is the point of a slash menu with 40+
  // blocks, not something to truncate away.
  const options = useMemo(() => {
    if (!query) return allOptions;
    const q = query.toLowerCase();
    return allOptions.filter(
      (o) => o.label.toLowerCase().includes(q) || o.group.toLowerCase().includes(q),
    );
  }, [allOptions, query]);

  const onSelectOption = useCallback(
    (option: SlashOption, textNodeContainingQuery: TextNode | null, closeMenu: () => void) => {
      editor.update(() => {
        textNodeContainingQuery?.remove();
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;
        option.onSelect();
      });
      closeMenu();
    },
    [editor],
  );

  return (
    <LexicalTypeaheadMenuPlugin<SlashOption>
      onQueryChange={setQuery}
      onSelectOption={onSelectOption}
      triggerFn={checkForTriggerMatch}
      options={options}
      // Portals the menu inside the editor's own DOM subtree (rather than
      // Lexical's document.body default) so it inherits the editor's
      // CSS custom properties (--card, --text, ...) - without this it
      // renders correctly positioned but with the wrong theme colors,
      // since those variables are set inline on .imx-editor, which
      // document.body isn't a descendant of.
      parent={anchorElem}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex },
      ) => {
        if (!anchorElementRef.current) return null;

        // LexicalTypeaheadMenuPlugin positions `anchorElementRef.current`
        // (a detached, Lexical-managed div) near the caret via inline
        // styles, but only actually attaches it to the DOM once something
        // is portaled into it - a menuRenderFn that just returns plain JSX
        // (instead of createPortal(..., anchorElementRef.current)) renders
        // in React's normal tree position instead, which is the editor's
        // own DOM position, nowhere near the caret.
        const menu =
          options.length === 0 ? (
            <div className="imx-ed-slash-menu">
              <div className="imx-ed-slash-empty">
                No blocks match <strong>“{query}”</strong>
              </div>
            </div>
          ) : (
            <div className="imx-ed-slash-menu" role="listbox" aria-label="Insert a block">
              {GROUP_ORDER.map((group) => {
                const items = options.filter((o) => o.group === group);
                if (items.length === 0) return null;
                return (
                  <div key={group} className="imx-ed-slash-section">
                    <div className="imx-ed-slash-group">{group}</div>
                    {items.map((option) => {
                      const index = options.indexOf(option);
                      return (
                        // Keyboard navigation (arrows/enter) is handled globally by
                        // LexicalTypeaheadMenuPlugin as editor commands, not DOM focus -
                        // the same pattern Lexical's own component-picker plugin uses.
                        // biome-ignore lint/a11y/useFocusableInteractive: see above
                        // biome-ignore lint/a11y/useKeyWithClickEvents: see above
                        <div
                          key={option.key}
                          className="imx-ed-slash-item"
                          data-selected={index === selectedIndex}
                          role="option"
                          aria-selected={index === selectedIndex}
                          onMouseEnter={() => setHighlightedIndex(index)}
                          onClick={() => selectOptionAndCleanUp(option)}
                        >
                          <span className="imx-ed-slash-item-icon" data-category={option.group}>
                            {option.glyph}
                          </span>
                          <span className="imx-ed-slash-item-text">
                            <span className="imx-ed-slash-item-label">{option.label}</span>
                            {option.description && (
                              <span className="imx-ed-slash-item-desc">{option.description}</span>
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          );
        return createPortal(menu, anchorElementRef.current);
      }}
    />
  );
}
