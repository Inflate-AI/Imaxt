import { type CompareData, renderCompare, type SideData } from '@inflate-ai/imaxt-core';
import { createTonePicker, TOOLBOX_ICON } from './shared.ts';

function renderSideEditor(side: SideData, onChange: () => void): HTMLElement {
  const wrap = document.createElement('div');

  const kindSelect = document.createElement('select');
  for (const kind of ['before', 'after'] as const) {
    const option = document.createElement('option');
    option.value = kind;
    option.textContent = kind;
    option.selected = (side.kind ?? 'after') === kind;
    kindSelect.append(option);
  }
  kindSelect.addEventListener('change', () => {
    side.kind = kindSelect.value as SideData['kind'];
    onChange();
  });

  const labelInput = document.createElement('input');
  labelInput.type = 'text';
  labelInput.placeholder = 'Label (optional)';
  labelInput.value = side.label ?? '';
  labelInput.addEventListener('input', () => {
    side.label = labelInput.value;
    onChange();
  });

  const editable = document.createElement('div');
  editable.contentEditable = 'true';
  editable.innerHTML = side.html;
  editable.addEventListener('input', () => {
    side.html = editable.innerHTML;
    onChange();
  });

  const tonePicker = createTonePicker(side.tone, (tone) => {
    side.tone = tone;
    onChange();
  });

  wrap.append(kindSelect, labelInput, editable, tonePicker);
  return wrap;
}

export class CompareTool {
  static get toolbox() {
    return { icon: TOOLBOX_ICON.grid, title: 'Compare' };
  }

  static get isReadOnlySupported() {
    return true;
  }

  data: CompareData;
  private preview: HTMLElement | null = null;

  constructor({ data }: { data: Partial<CompareData> }) {
    this.data = {
      sides: data.sides ?? [
        { html: '', kind: 'before' },
        { html: '', kind: 'after' },
      ],
    };
  }

  private refresh() {
    if (this.preview) this.preview.innerHTML = renderCompare(this.data);
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'imx-ej-compare';

    for (const side of this.data.sides) {
      wrapper.append(renderSideEditor(side, () => this.refresh()));
    }

    this.preview = document.createElement('div');
    this.preview.className = 'imx-ej-preview';

    wrapper.append(this.preview);
    this.refresh();
    return wrapper;
  }

  save(): CompareData {
    return { sides: [{ ...this.data.sides[0] }, { ...this.data.sides[1] }] };
  }

  validate(savedData: CompareData): boolean {
    return savedData.sides.every((side) => side.html.trim().length > 0);
  }
}
