import { resolveTone, TONES, type Tone } from '@inflate-ai/imaxt-core';

export function createTonePicker(
  current: string | undefined,
  onChange: (tone: Tone) => void,
): HTMLElement {
  const resolved = resolveTone(current);
  const wrap = document.createElement('div');
  wrap.className = 'imx-ej-tones';
  for (const tone of TONES) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = tone;
    button.dataset.tone = tone;
    button.setAttribute('aria-pressed', String(tone === resolved));
    button.addEventListener('click', () => {
      onChange(tone);
      for (const b of wrap.querySelectorAll('button')) {
        b.setAttribute('aria-pressed', String(b === button));
      }
    });
    wrap.append(button);
  }
  return wrap;
}

/** A small set of generic toolbox icons, reused across tools rather than one bespoke icon each. */
export const TOOLBOX_ICON = {
  text: '<svg width="20" height="20" viewBox="0 0 20 20"><path d="M3 4h14M10 4v12" stroke="currentColor" stroke-width="2" fill="none"/></svg>',
  list: '<svg width="20" height="20" viewBox="0 0 20 20"><path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" stroke-width="2" fill="none"/></svg>',
  grid: '<svg width="20" height="20" viewBox="0 0 20 20"><rect x="3" y="3" width="6" height="6" fill="currentColor"/><rect x="11" y="3" width="6" height="6" fill="currentColor"/><rect x="3" y="11" width="6" height="6" fill="currentColor"/><rect x="11" y="11" width="6" height="6" fill="currentColor"/></svg>',
  chart:
    '<svg width="20" height="20" viewBox="0 0 20 20"><path d="M4 16V8M10 16V4M16 16v-6" stroke="currentColor" stroke-width="3" fill="none"/></svg>',
  quote:
    '<svg width="20" height="20" viewBox="0 0 20 20"><path d="M5 5c-2 2-2 5-2 7h4V8H5c0-1 .5-2 2-3z" fill="currentColor"/><path d="M13 5c-2 2-2 5-2 7h4V8h-2c0-1 .5-2 2-3z" fill="currentColor"/></svg>',
  media:
    '<svg width="20" height="20" viewBox="0 0 20 20"><rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="7" cy="9" r="1.5" fill="currentColor"/></svg>',
} as const;

export interface RepeatableListOptions<T> {
  items: T[];
  createItem(): T;
  renderItem(item: T, onChange: () => void, onRemove: () => void): HTMLElement;
  onChange(): void;
  addLabel?: string;
}

/**
 * The add/remove/reorder-preserving list UI shared by every composite tool (StatRow, Steps,
 * Timeline, Scrolly, CodeWalk's steps): each entry is one `renderItem` row, mutating `items` in
 * place so the caller's own saved data array stays the single source of truth.
 */
export function createRepeatableList<T>(options: RepeatableListOptions<T>): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'imx-ej-list';
  const list = document.createElement('div');
  wrapper.append(list);

  const addRow = (item: T) => {
    const row = document.createElement('div');
    row.className = 'imx-ej-item';
    row.append(
      options.renderItem(
        item,
        () => options.onChange(),
        () => {
          options.items.splice(options.items.indexOf(item), 1);
          row.remove();
          options.onChange();
        },
      ),
    );
    list.append(row);
  };

  for (const item of options.items) addRow(item);

  const addButton = document.createElement('button');
  addButton.type = 'button';
  addButton.className = 'imx-ej-add';
  addButton.textContent = options.addLabel ?? 'Add';
  addButton.addEventListener('click', () => {
    const item = options.createItem();
    options.items.push(item);
    addRow(item);
    options.onChange();
  });
  wrapper.append(addButton);

  return wrapper;
}
