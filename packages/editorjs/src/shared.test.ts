import { describe, expect, test } from 'bun:test';
import { createRepeatableList, createTonePicker, TOOLBOX_ICON } from './shared.ts';

describe('createTonePicker', () => {
  test('offers exactly the six documented tones', () => {
    const picker = createTonePicker('mint', () => {});
    const buttons = [...picker.querySelectorAll<HTMLButtonElement>('button')];
    expect(buttons.map((b) => b.dataset.tone)).toEqual([
      'mint',
      'lilac',
      'sky',
      'rose',
      'accent',
      'ink',
    ]);
  });

  test('marks the current tone pressed and defaults to ink when unset', () => {
    const picker = createTonePicker(undefined, () => {});
    const pressed = picker.querySelector('[aria-pressed="true"]');
    expect(pressed?.getAttribute('data-tone')).toBe('ink');
  });

  test('calls back with the clicked tone and updates pressed state', () => {
    let picked: string | undefined;
    const picker = createTonePicker('ink', (tone) => {
      picked = tone;
    });
    const skyButton = picker.querySelector<HTMLButtonElement>('[data-tone="sky"]')!;
    skyButton.click();
    expect(picked).toBe('sky');
    expect(skyButton.getAttribute('aria-pressed')).toBe('true');
  });
});

describe('createRepeatableList', () => {
  function makeList(items: { label: string }[]) {
    let changes = 0;
    const list = createRepeatableList({
      items,
      createItem: () => ({ label: 'new' }),
      renderItem: (item, onChange, onRemove) => {
        const input = document.createElement('input');
        input.value = item.label;
        input.addEventListener('input', () => {
          item.label = input.value;
          onChange();
        });
        const remove = document.createElement('button');
        remove.className = 'remove';
        remove.addEventListener('click', onRemove);
        const row = document.createElement('div');
        row.append(input, remove);
        return row;
      },
      onChange: () => {
        changes++;
      },
    });
    return { list, items, getChanges: () => changes };
  }

  test('renders one row per initial item', () => {
    const { list } = makeList([{ label: 'a' }, { label: 'b' }]);
    expect(list.querySelectorAll('input').length).toBe(2);
  });

  test('clicking add appends a new item and calls onChange', () => {
    const { list, items, getChanges } = makeList([{ label: 'a' }]);
    list.querySelector<HTMLButtonElement>('.imx-ej-add')?.click();
    expect(items.length).toBe(2);
    expect(items[1]?.label).toBe('new');
    expect(list.querySelectorAll('input').length).toBe(2);
    expect(getChanges()).toBe(1);
  });

  test('clicking remove drops the item from the array and the DOM', () => {
    const { list, items } = makeList([{ label: 'a' }, { label: 'b' }]);
    list.querySelectorAll<HTMLButtonElement>('.remove')[0]?.click();
    expect(items).toEqual([{ label: 'b' }]);
    expect(list.querySelectorAll('input').length).toBe(1);
  });

  test('editing an item field mutates it in place and calls onChange', () => {
    const { items, list, getChanges } = makeList([{ label: 'a' }]);
    const input = list.querySelector<HTMLInputElement>('input')!;
    input.value = 'changed';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(items[0]?.label).toBe('changed');
    expect(getChanges()).toBe(1);
  });
});

describe('TOOLBOX_ICON', () => {
  test('provides a non-empty icon string for every expected key', () => {
    for (const key of ['text', 'list', 'grid', 'chart', 'quote', 'media'] as const) {
      expect(TOOLBOX_ICON[key].length).toBeGreaterThan(0);
    }
  });
});
