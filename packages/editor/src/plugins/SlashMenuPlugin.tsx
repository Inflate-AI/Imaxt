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
import { BLOCK_CONFIGS, CUSTOM_BLOCK_TYPES } from '../blocks/block-config.ts';
import { createDefaultBlock } from '../blocks/block-defaults.ts';
import { useImageAdapter } from '../image/context.ts';
import { $createImageNode } from '../nodes/ImageNode.tsx';
import { $createImaxtBlockNode } from '../nodes/ImaxtBlockNode.tsx';
import { replaceCurrentBlockWith } from './insertBlock.ts';

class SlashOption extends MenuOption {
  constructor(
    public label: string,
    public group: 'Markdown' | 'Media' | 'Imaxt',
    public emoji: string,
    public onSelect: () => void,
  ) {
    super(label);
  }
}

function markdownOptions(): SlashOption[] {
  return [
    new SlashOption('Heading 1', 'Markdown', 'H1', () =>
      replaceCurrentBlockWith($createHeadingNode('h1')),
    ),
    new SlashOption('Heading 2', 'Markdown', 'H2', () =>
      replaceCurrentBlockWith($createHeadingNode('h2')),
    ),
    new SlashOption('Heading 3', 'Markdown', 'H3', () =>
      replaceCurrentBlockWith($createHeadingNode('h3')),
    ),
    new SlashOption('Quote', 'Markdown', '"', () => replaceCurrentBlockWith($createQuoteNode())),
    new SlashOption('Code block', 'Markdown', '{}', () =>
      replaceCurrentBlockWith($createCodeNode()),
    ),
    new SlashOption('Bulleted list', 'Markdown', '•', () => $insertList('bullet')),
    new SlashOption('Numbered list', 'Markdown', '1.', () => $insertList('number')),
    new SlashOption('Checklist', 'Markdown', '☑', () => $insertList('check')),
    new SlashOption('Table', 'Markdown', '▦', () =>
      replaceCurrentBlockWith($createTableNodeWithDimensions(3, 3, true)),
    ),
  ];
}

function imaxtOptions(): SlashOption[] {
  const options: SlashOption[] = [];
  for (const type of Object.keys(BLOCK_CONFIGS) as Array<keyof typeof BLOCK_CONFIGS>) {
    const config = BLOCK_CONFIGS[type];
    if (!config) continue;
    options.push(
      new SlashOption(config.title, 'Imaxt', '◆', () =>
        replaceCurrentBlockWith($createImaxtBlockNode(createDefaultBlock(type))),
      ),
    );
  }
  for (const type of CUSTOM_BLOCK_TYPES) {
    const title = type
      .split('-')
      .map((w) => (w[0]?.toUpperCase() ?? '') + w.slice(1))
      .join(' ');
    options.push(
      new SlashOption(title, 'Imaxt', '◆', () =>
        replaceCurrentBlockWith($createImaxtBlockNode(createDefaultBlock(type))),
      ),
    );
  }
  return options;
}

export function SlashMenuPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [query, setQuery] = useState<string | null>(null);
  const imageAdapter = useImageAdapter();
  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch('/', { minLength: 0 });

  const allOptions = useMemo(() => {
    const mediaOption = new SlashOption('Image', 'Media', '🖼', () => {
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
    });
    return [...markdownOptions(), mediaOption, ...imaxtOptions()];
  }, [editor, imageAdapter]);

  const options = useMemo(() => {
    if (!query) return allOptions.slice(0, 12);
    const q = query.toLowerCase();
    return allOptions.filter((o) => o.label.toLowerCase().includes(q)).slice(0, 20);
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
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex },
      ) => {
        if (!anchorElementRef.current || options.length === 0) return null;
        const groups: Array<SlashOption['group']> = ['Markdown', 'Media', 'Imaxt'];
        return (
          <div className="imx-ed-slash-menu">
            {groups.map((group) => {
              const items = options.filter((o) => o.group === group);
              if (items.length === 0) return null;
              return (
                <div key={group}>
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
                        <span className="imx-ed-slash-item-icon">{option.emoji}</span>
                        <span>{option.label}</span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        );
      }}
    />
  );
}
