// Diagrams, via the real `mermaid` client library - rendered in the
// browser once attached (same pattern as TypeLab/Ticker/Scrolly/CodeWalk/
// StatRow: renderMermaid() emits static markup instantly, attachMermaid()
// does the actual work after mount). Blog's own Mermaid integration
// (src/plugins/rehype-imaxt-diagram.mjs) pre-renders to SVG at build time
// with a headless browser - great for a zero-JS static site, but that's
// Host-specific machinery that does not belong in a package meant to run
// anywhere, including live in the editor preview.
// This keeps Blog's actual idea - diagrams themed with Imaxt's own tone
// tokens - without the build-time dependency, and goes one better: reading
// the tokens live means any theme (not just a hardcoded light/dark pair)
// renders correctly.
import { escapeHtml } from './shared.ts';

export interface MermaidData {
  source: string;
  caption?: string;
}

function instanceIdFor(seed: string): string {
  let hash = 7;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return `mmd${hash.toString(36)}`;
}

export function renderMermaid(data: MermaidData): string {
  const id = instanceIdFor(data.source);
  const caption = data.caption
    ? `<figcaption class="imx-mermaid-cap">${escapeHtml(data.caption)}</figcaption>`
    : '';
  return (
    `<div class="imx"><figure class="imx-mermaid" data-mermaid-id="${id}">` +
    `<pre class="imx-mermaid-source" hidden>${escapeHtml(data.source)}</pre>` +
    `<div class="imx-mermaid-canvas" role="img" aria-busy="true">` +
    `<span class="imx-mermaid-loading">Rendering diagram…</span></div>` +
    `${caption}</figure></div>`
  );
}

type MermaidModule = typeof import('mermaid').default;
let mermaidPromise: Promise<MermaidModule> | undefined;
const loadMermaid = (): Promise<MermaidModule> =>
  (mermaidPromise ??= import('mermaid').then((m) => m.default));

/** Reads Imaxt's own CSS custom properties so a diagram is themed exactly like the page it's rendered on - light, dark, or a fully custom theme - not a hardcoded palette. */
function themeVariables(root: ParentNode): Record<string, string> {
  const el = root instanceof Document ? root.documentElement : (root as Element);
  const cs = getComputedStyle(el);
  const read = (name: string, fallback: string) => cs.getPropertyValue(name).trim() || fallback;
  const text = read('--text', '#1c1c1c');
  return {
    fontFamily: read('--font-sans', 'sans-serif'),
    background: 'transparent',
    primaryColor: read('--t-mint', '#b6f0d3'),
    primaryTextColor: text,
    primaryBorderColor: text,
    secondaryColor: read('--t-lilac', '#d6cbff'),
    secondaryTextColor: text,
    secondaryBorderColor: text,
    tertiaryColor: read('--t-sky', '#b8dcff'),
    tertiaryTextColor: text,
    tertiaryBorderColor: text,
    lineColor: text,
    textColor: text,
    mainBkg: read('--t-mint', '#b6f0d3'),
    nodeBorder: text,
    clusterBkg: read('--card', '#fffdf6'),
    clusterBorder: text,
    edgeLabelBackground: read('--card', '#fffdf6'),
    noteBkgColor: read('--paper2', '#ebe6d8'),
    noteTextColor: text,
    noteBorderColor: text,
    actorBkg: read('--t-mint', '#b6f0d3'),
    actorBorder: text,
    actorTextColor: text,
    actorLineColor: text,
    signalColor: text,
    signalTextColor: text,
    labelBoxBkgColor: read('--t-lilac', '#d6cbff'),
    labelBoxBorderColor: text,
    labelTextColor: text,
    loopTextColor: text,
    activationBkgColor: read('--t-lilac', '#d6cbff'),
    activationBorderColor: text,
  };
}

/** Renders every not-yet-rendered `.imx-mermaid` diagram under `root` to live SVG, themed from the current page's own CSS custom properties. */
export function attachMermaid(root: ParentNode = document): () => void {
  const nodes = [...root.querySelectorAll<HTMLElement>('.imx-mermaid:not([data-ready])')];
  if (nodes.length === 0) return () => {};

  let cancelled = false;
  (async () => {
    const mermaid = await loadMermaid();
    if (cancelled) return;
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      theme: 'base',
      themeVariables: themeVariables(root),
      flowchart: { htmlLabels: false, curve: 'basis' },
    });
    for (const node of nodes) {
      if (cancelled) return;
      const canvas = node.querySelector<HTMLElement>('.imx-mermaid-canvas');
      const source = node.querySelector('.imx-mermaid-source')?.textContent ?? '';
      if (!canvas || !source.trim()) continue;
      try {
        const id = node.dataset.mermaidId ?? instanceIdFor(source);
        const { svg } = await mermaid.render(id, source);
        if (cancelled) return;
        canvas.innerHTML = svg;
        canvas.removeAttribute('aria-busy');
      } catch {
        canvas.innerHTML = '<p class="imx-mermaid-error">Couldn’t render this diagram.</p>';
        canvas.removeAttribute('aria-busy');
      }
      node.setAttribute('data-ready', '');
    }
  })();

  return () => {
    cancelled = true;
  };
}
