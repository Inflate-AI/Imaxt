import { escapeHtml } from './shared.ts';

export type FamilyKey = 'archivo' | 'fraunces' | 'source-serif';

interface Axis {
  tag: 'wght' | 'wdth' | 'opsz';
  label: string;
  min: number;
  max: number;
  def: number;
}

interface Family {
  label: string;
  css: string;
  axes: Axis[];
  italic?: boolean;
}

// Only the axes the site actually ships are offered.
const FAMILIES: Record<FamilyKey, Family> = {
  archivo: {
    label: 'Archivo',
    css: "'Archivo Variable', 'Archivo', sans-serif",
    axes: [
      { tag: 'wght', label: 'Weight', min: 100, max: 900, def: 800 },
      { tag: 'wdth', label: 'Width', min: 62, max: 125, def: 80 },
    ],
  },
  fraunces: {
    label: 'Fraunces',
    css: "'Fraunces Variable', 'Fraunces', Georgia, serif",
    italic: true,
    axes: [
      { tag: 'wght', label: 'Weight', min: 100, max: 900, def: 600 },
      { tag: 'opsz', label: 'Optical size', min: 9, max: 144, def: 144 },
    ],
  },
  'source-serif': {
    label: 'Source Serif 4',
    css: "'Source Serif 4 Variable', 'Source Serif 4', Georgia, serif",
    axes: [{ tag: 'wght', label: 'Weight', min: 200, max: 900, def: 400 }],
  },
};

const DEFAULT_SIZE = 64;
const DEFAULT_LINE_HEIGHT = 1.05;
const DEFAULT_TRACKING = -0.02;

export interface TypeLabData {
  sample?: string;
  family?: FamilyKey;
}

function slider(
  instanceId: string,
  id: string,
  label: string,
  min: number,
  max: number,
  step: number,
  value: number,
  unit = '',
  axisAttr = '',
): string {
  const controlId = `${instanceId}-${id}`;
  return (
    `<div class="imx-tl-ctl"${axisAttr}><label class="imx-label" for="${controlId}">${escapeHtml(label)}</label>` +
    `<input type="range" id="${controlId}" data-control="${id}" min="${min}" max="${max}" step="${step}" value="${value}">` +
    `<output class="imx-tl-val">${value}${unit}</output></div>`
  );
}

function renderAxisControls(instanceId: string, family: Family): string {
  return family.axes
    .map((axis) =>
      slider(
        instanceId,
        axis.tag,
        axis.label,
        axis.min,
        axis.max,
        1,
        axis.def,
        '',
        ' data-axis="true"',
      ),
    )
    .join('');
}

/** A stable per-instance id prefix, derived from content so rendering stays a pure function. */
function instanceIdFor(seed: string): string {
  let hash = 7;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return `tl${hash.toString(36)}`;
}

export function renderTypeLab(data: TypeLabData): string {
  const sample = data.sample ?? 'Typography is the interface';
  const familyKey = data.family ?? 'fraunces';
  const family = FAMILIES[familyKey];
  const instanceId = instanceIdFor(sample);

  const familyButtons = (Object.keys(FAMILIES) as FamilyKey[])
    .map(
      (key) =>
        `<button type="button" data-family="${key}" aria-pressed="${key === familyKey}">${escapeHtml(FAMILIES[key].label)}</button>`,
    )
    .join('');

  const italicToggle = family.italic
    ? `<label class="imx-tl-check"><input type="checkbox" data-control="italic"> Italic</label>`
    : '';

  return (
    `<div class="imx-typelab imx-slab" data-family="${familyKey}" data-tl-id="${instanceId}">` +
    `<div class="imx-tl-head"><div class="imx-tl-fam" role="group" aria-label="Typeface">${familyButtons}</div>` +
    `<button type="button" class="imx-tl-reset">Reset</button></div>` +
    `<div class="imx-tl-stage"><div class="imx-tl-preview">${escapeHtml(sample)}</div></div>` +
    `<div class="imx-tl-controls">` +
    `<div class="imx-tl-ctl imx-tl-text"><label class="imx-label" for="${instanceId}-sample">Sample text</label>` +
    `<input type="text" id="${instanceId}-sample" class="imx-tl-text-input" value="${escapeHtml(sample)}"></div>` +
    `${renderAxisControls(instanceId, family)}` +
    `${slider(instanceId, 'size', 'Size', 16, 140, 1, DEFAULT_SIZE, 'px')}` +
    `${slider(instanceId, 'lh', 'Line height', 0.8, 2, 0.01, DEFAULT_LINE_HEIGHT)}` +
    `${slider(instanceId, 'ls', 'Tracking', -0.1, 0.3, 0.005, DEFAULT_TRACKING, 'em')}` +
    `${italicToggle}</div>` +
    `<div class="imx-tl-out"><pre><code></code></pre><button type="button" class="btn sm imx-tl-copy">Copy CSS</button></div>` +
    `</div>`
  );
}

interface State {
  family: FamilyKey;
  sample: string;
  size: number;
  lineHeight: number;
  tracking: number;
  italic: boolean;
  axisValues: Record<string, number>;
}

function computeCss(state: State): string {
  const family = FAMILIES[state.family];
  const weightAxis = family.axes.find((a) => a.tag === 'wght');
  const weight = weightAxis ? (state.axisValues[`${state.family}:wght`] ?? weightAxis.def) : 400;
  const settings = family.axes
    .filter((a) => a.tag !== 'wght')
    .map((a) => `"${a.tag}" ${state.axisValues[`${state.family}:${a.tag}`] ?? a.def}`)
    .join(', ');
  return [
    `font-family: ${family.css};`,
    `font-weight: ${weight};`,
    family.italic && state.italic ? 'font-style: italic;' : null,
    settings ? `font-variation-settings: ${settings};` : null,
    `font-size: ${state.size}px;`,
    `line-height: ${state.lineHeight};`,
    `letter-spacing: ${state.tracking}em;`,
  ]
    .filter((line): line is string => line !== null)
    .join('\n');
}

function applyPreviewStyle(preview: HTMLElement, state: State): void {
  const family = FAMILIES[state.family];
  const weightAxis = family.axes.find((a) => a.tag === 'wght');
  const weight = weightAxis ? (state.axisValues[`${state.family}:wght`] ?? weightAxis.def) : 400;
  const settings = family.axes
    .filter((a) => a.tag !== 'wght')
    .map((a) => `"${a.tag}" ${state.axisValues[`${state.family}:${a.tag}`] ?? a.def}`)
    .join(', ');
  preview.style.fontFamily = family.css;
  preview.style.fontWeight = String(weight);
  preview.style.fontStyle = family.italic && state.italic ? 'italic' : 'normal';
  preview.style.setProperty('font-variation-settings', settings || 'normal');
  preview.style.fontSize = `${state.size}px`;
  preview.style.lineHeight = String(state.lineHeight);
  preview.style.letterSpacing = `${state.tracking}em`;
  preview.textContent = state.sample || ' ';
}

/** Wires up TypeLab's family switcher, sliders and CSS-copy button. */
export function attachTypeLab(root: ParentNode = document): () => void {
  const disposers: Array<() => void> = [];
  for (const lab of root.querySelectorAll<HTMLElement>('.imx-typelab')) {
    const sampleInput = lab.querySelector<HTMLInputElement>('.imx-tl-text-input');
    const preview = lab.querySelector<HTMLElement>('.imx-tl-preview');
    const controls = lab.querySelector<HTMLElement>('.imx-tl-controls');
    const output = lab.querySelector<HTMLElement>('.imx-tl-out code');
    const copyButton = lab.querySelector<HTMLButtonElement>('.imx-tl-copy');
    const resetButton = lab.querySelector<HTMLButtonElement>('.imx-tl-reset');
    if (!sampleInput || !preview || !controls || !output) continue;

    const initialFamily = (lab.dataset.family as FamilyKey) ?? 'fraunces';
    const initialSample = sampleInput.value;
    const state: State = {
      family: initialFamily,
      sample: initialSample,
      size: DEFAULT_SIZE,
      lineHeight: DEFAULT_LINE_HEIGHT,
      tracking: DEFAULT_TRACKING,
      italic: false,
      axisValues: {},
    };

    const render = () => {
      applyPreviewStyle(preview, state);
      output.textContent = computeCss(state);
    };

    const instanceId = lab.dataset.tlId ?? instanceIdFor(initialSample);
    const rebuildAxisControls = () => {
      controls.querySelectorAll('[data-axis]').forEach((el) => {
        el.remove();
      });
      const textRow = controls.querySelector('.imx-tl-text');
      const axisHtml = renderAxisControls(instanceId, FAMILIES[state.family]);
      textRow?.insertAdjacentHTML('afterend', axisHtml);
      wireAxisInputs();
    };

    const wireAxisInputs = () => {
      for (const el of controls.querySelectorAll<HTMLInputElement>('[data-axis] input')) {
        const tag = el.dataset.control as Axis['tag'];
        const handler = () => {
          state.axisValues[`${state.family}:${tag}`] = Number(el.value);
          const output2 = el.nextElementSibling;
          if (output2) output2.textContent = el.value;
          render();
        };
        el.addEventListener('input', handler);
        disposers.push(() => el.removeEventListener('input', handler));
      }
    };

    rebuildAxisControls();

    const onSampleInput = () => {
      state.sample = sampleInput.value;
      render();
    };
    sampleInput.addEventListener('input', onSampleInput);
    disposers.push(() => sampleInput.removeEventListener('input', onSampleInput));

    const sizeInput = controls.querySelector<HTMLInputElement>('input[data-control="size"]');
    const lhInput = controls.querySelector<HTMLInputElement>('input[data-control="lh"]');
    const lsInput = controls.querySelector<HTMLInputElement>('input[data-control="ls"]');
    const italicInput = controls.querySelector<HTMLInputElement>('input[data-control="italic"]');

    const bindRange = (input: HTMLInputElement | null, apply: (value: number) => void) => {
      if (!input) return;
      const handler = () => {
        apply(Number(input.value));
        const output2 = input.nextElementSibling;
        if (output2) output2.textContent = input.value;
        render();
      };
      input.addEventListener('input', handler);
      disposers.push(() => input.removeEventListener('input', handler));
    };
    bindRange(sizeInput, (v) => (state.size = v));
    bindRange(lhInput, (v) => (state.lineHeight = v));
    bindRange(lsInput, (v) => (state.tracking = v));

    if (italicInput) {
      const handler = () => {
        state.italic = italicInput.checked;
        render();
      };
      italicInput.addEventListener('change', handler);
      disposers.push(() => italicInput.removeEventListener('change', handler));
    }

    for (const button of lab.querySelectorAll<HTMLButtonElement>('.imx-tl-fam button')) {
      const handler = () => {
        state.family = button.dataset.family as FamilyKey;
        lab.dataset.family = state.family;
        for (const b of lab.querySelectorAll<HTMLButtonElement>('.imx-tl-fam button')) {
          b.setAttribute('aria-pressed', String(b === button));
        }
        rebuildAxisControls();
        render();
      };
      button.addEventListener('click', handler);
      disposers.push(() => button.removeEventListener('click', handler));
    }

    if (resetButton) {
      const handler = () => {
        state.sample = initialSample;
        state.size = DEFAULT_SIZE;
        state.lineHeight = DEFAULT_LINE_HEIGHT;
        state.tracking = DEFAULT_TRACKING;
        state.italic = false;
        state.axisValues = {};
        sampleInput.value = initialSample;
        if (sizeInput) sizeInput.value = String(DEFAULT_SIZE);
        if (lhInput) lhInput.value = String(DEFAULT_LINE_HEIGHT);
        if (lsInput) lsInput.value = String(DEFAULT_TRACKING);
        if (italicInput) italicInput.checked = false;
        rebuildAxisControls();
        render();
      };
      resetButton.addEventListener('click', handler);
      disposers.push(() => resetButton.removeEventListener('click', handler));
    }

    if (copyButton) {
      const handler = () => {
        const css = computeCss(state);
        navigator.clipboard?.writeText(css).then(
          () => {
            const original = copyButton.textContent;
            copyButton.textContent = 'Copied';
            setTimeout(() => {
              copyButton.textContent = original;
            }, 1800);
          },
          () => {
            /* clipboard unavailable */
          },
        );
      };
      copyButton.addEventListener('click', handler);
      disposers.push(() => copyButton.removeEventListener('click', handler));
    }

    lab.setAttribute('data-ready', '');
    render();
  }
  return () => {
    disposers.forEach((dispose) => {
      dispose();
    });
  };
}
