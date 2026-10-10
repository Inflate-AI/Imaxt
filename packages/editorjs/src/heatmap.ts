import { type HeatmapData, renderHeatmap } from '@inflate-ai/imaxt-core';
import { TOOLBOX_ICON } from './shared.ts';

export class HeatmapTool {
  static get toolbox() {
    return { icon: TOOLBOX_ICON.grid, title: 'Heatmap' };
  }

  static get isReadOnlySupported() {
    return true;
  }

  data: HeatmapData;
  private preview: HTMLElement | null = null;
  private grid: HTMLElement | null = null;

  constructor({ data }: { data: Partial<HeatmapData> }) {
    this.data = {
      caption: data.caption ?? '',
      rows: data.rows ?? ['row 1'],
      cols: data.cols ?? ['col 1'],
      data: data.data ?? [[0]],
      unit: data.unit,
      min: data.min,
      max: data.max,
    };
  }

  private refresh() {
    if (this.preview) this.preview.innerHTML = renderHeatmap(this.data);
  }

  private resizeGrid() {
    const next: number[][] = this.data.rows.map((_, r) =>
      this.data.cols.map((_, c) => this.data.data[r]?.[c] ?? 0),
    );
    this.data.data = next;
    this.renderGrid();
  }

  private renderGrid() {
    if (!this.grid) return;
    this.grid.innerHTML = '';
    this.grid.className = 'imx-ej-grid';
    for (let r = 0; r < this.data.rows.length; r++) {
      for (let c = 0; c < this.data.cols.length; c++) {
        const input = document.createElement('input');
        input.type = 'number';
        input.value = String(this.data.data[r]?.[c] ?? 0);
        input.addEventListener('input', () => {
          const row = this.data.data[r];
          if (row) row[c] = Number(input.value);
          this.refresh();
        });
        this.grid.append(input);
      }
    }
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'imx-ej-heatmap';

    const captionInput = document.createElement('input');
    captionInput.type = 'text';
    captionInput.dataset.field = 'caption';
    captionInput.placeholder = 'Caption';
    captionInput.value = this.data.caption;
    captionInput.addEventListener('input', () => {
      this.data.caption = captionInput.value;
      this.refresh();
    });

    const rowsInput = document.createElement('input');
    rowsInput.type = 'text';
    rowsInput.dataset.field = 'rows';
    rowsInput.placeholder = 'Row labels, comma separated';
    rowsInput.value = this.data.rows.join(', ');
    rowsInput.addEventListener('change', () => {
      this.data.rows = rowsInput.value
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);
      this.resizeGrid();
      this.refresh();
    });

    const colsInput = document.createElement('input');
    colsInput.type = 'text';
    colsInput.dataset.field = 'cols';
    colsInput.placeholder = 'Column labels, comma separated';
    colsInput.value = this.data.cols.join(', ');
    colsInput.addEventListener('change', () => {
      this.data.cols = colsInput.value
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);
      this.resizeGrid();
      this.refresh();
    });

    this.grid = document.createElement('div');
    this.renderGrid();

    this.preview = document.createElement('div');
    this.preview.className = 'imx-ej-preview';

    wrapper.append(captionInput, rowsInput, colsInput, this.grid, this.preview);
    this.refresh();
    return wrapper;
  }

  save(): HeatmapData {
    return {
      ...this.data,
      rows: [...this.data.rows],
      cols: [...this.data.cols],
      data: this.data.data.map((row) => [...row]),
    };
  }

  validate(savedData: HeatmapData): boolean {
    return (
      savedData.rows.length > 0 &&
      savedData.cols.length > 0 &&
      savedData.data.length === savedData.rows.length &&
      savedData.data.every((row) => row.length === savedData.cols.length)
    );
  }
}
