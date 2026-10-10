import { escapeHtml, resolveTone } from './shared.ts';

export interface BeatData {
  stage: string;
  sub?: string;
  html: string;
}

export interface ScrollyData {
  items: BeatData[];
  tone?: string;
}

export function renderBeat(data: BeatData): string {
  const inline = data.sub
    ? `${escapeHtml(data.stage)} · ${escapeHtml(data.sub)}`
    : escapeHtml(data.stage);
  return (
    `<section class="imx-beat" data-stage="${escapeHtml(data.stage)}"${data.sub ? ` data-sub="${escapeHtml(data.sub)}"` : ''}>` +
    `<div class="imx-beat-inline imx-label">${inline}</div>` +
    `<div class="imx-beat-body">${data.html}</div></section>`
  );
}

export function renderScrolly(data: ScrollyData): string {
  const tone = data.tone ? resolveTone(data.tone) : 'sky';
  const beats = data.items.map(renderBeat).join('');
  return (
    `<div class="imx imx-scrolly-wrap"><div class="imx-scrolly" data-tone="${tone}">` +
    `<div class="imx-scrolly-stage imx-slab" aria-hidden="true"><div class="imx-scrolly-slides"></div></div>` +
    `<div class="imx-scrolly-beats">${beats}</div></div></div>`
  );
}

/**
 * Pins a big statement next to the prose and swaps it as each beat scrolls into view.
 * Without JavaScript (or on narrow screens) every beat shows its own heading inline instead.
 */
export function attachScrolly(root: ParentNode = document): () => void {
  const disposers: Array<() => void> = [];
  for (const scrollyRoot of root.querySelectorAll<HTMLElement>('.imx-scrolly')) {
    const beats = [...scrollyRoot.querySelectorAll<HTMLElement>('.imx-beat')];
    const holder = scrollyRoot.querySelector<HTMLElement>('.imx-scrolly-slides');
    if (!holder || !beats.length) continue;

    const slides = beats.map((beat) => {
      const slide = document.createElement('div');
      slide.className = 'imx-slide';
      const big = document.createElement('div');
      big.className = 'imx-slide-big';
      big.textContent = beat.dataset.stage ?? '';
      slide.append(big);
      if (beat.dataset.sub) {
        const sub = document.createElement('div');
        sub.className = 'imx-slide-sub imx-label';
        sub.textContent = beat.dataset.sub;
        slide.append(sub);
      }
      holder.append(slide);
      return slide;
    });

    scrollyRoot.setAttribute('data-js', '');
    const show = (i: number) => {
      slides.forEach((slide, j) => {
        slide.classList.toggle('on', i === j);
      });
      beats.forEach((beat, j) => {
        beat.classList.toggle('on', i === j);
      });
    };
    show(0);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) show(beats.indexOf(entry.target as HTMLElement));
        }
      },
      { rootMargin: '-42% 0px -42% 0px' },
    );
    beats.forEach((beat) => {
      observer.observe(beat);
    });
    disposers.push(() => observer.disconnect());
  }
  return () => {
    disposers.forEach((dispose) => {
      dispose();
    });
  };
}
