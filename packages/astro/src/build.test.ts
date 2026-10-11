import { beforeAll, describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * `bun:test` cannot compile `.astro` files directly (there is no Bun loader for Astro's
 * template syntax), so these tests drive the real `astro build` against a fixture site under
 * `test-site/` that imports every component from `../src`, then assert on the built HTML. This
 * exercises the actual Astro compiler pipeline rather than a mock of it.
 */
const PACKAGE_ROOT = join(import.meta.dir, '..');
const TEST_SITE = join(PACKAGE_ROOT, 'test-site');
let html = '';

beforeAll(async () => {
  const proc = Bun.spawn(
    [join(PACKAGE_ROOT, 'node_modules/.bin/astro'), 'build', '--root', TEST_SITE],
    { stdout: 'pipe', stderr: 'pipe' },
  );
  const exitCode = await proc.exited;
  if (exitCode !== 0) {
    const stderr = await new Response(proc.stderr).text();
    throw new Error(`astro build failed with exit code ${exitCode}:\n${stderr}`);
  }
  html = readFileSync(join(TEST_SITE, 'dist/index.html'), 'utf8');
}, 60_000);

describe('every component renders in a real Astro build', () => {
  test('standalone components render their content', () => {
    expect(html).toContain('Boring is');
    expect(html).toContain('<em>dependable</em>');
    expect(html).toContain('The best API is a short one.');
    expect(html).toContain('Mock data');
    expect(html).toContain('Model A');
    expect(html).toContain('Embed');
    expect(html).toContain('Common modes');
    expect(html).toContain('Drafted');
    expect(html).toContain('Same letters, different voice');
    expect(html).toContain('imx-ranked');
    expect(html).toContain('imx-matrix');
    expect(html).toContain('Plan comparison');
    expect(html).toContain('Latency');
    expect(html).toContain('imx-gauge');
    expect(html).toContain('imx-scorecard');
    expect(html).toContain('imx-spark');
    expect(html).toContain('imx-funnel');
    expect(html).toContain('Callouts need no icons.');
    expect(html).toContain('Is this free?');
    expect(html).toContain('Key takeaways');
    expect(html).toContain('A citation goes here.');
    expect(html).toContain('Retrieval-augmented generation');
    expect(html).toContain('imx-versus');
    expect(html).toContain('imx-checklist');
    expect(html).toContain('npm install');
    expect(html).toContain('imx-diff');
    expect(html).toContain('src/');
    expect(html).toContain('Cannot read property');
    expect(html).toContain('imx-changelog');
    expect(html).toContain('katex');
    expect(html).toContain('katex-display');
    expect(html).toContain('Mass-energy equivalence');
    expect(html).toContain('imx-ticker');
    expect(html).toContain('Embed');
    expect(html).toContain('imx-dropcap');
    expect(html).toContain('imx-dropcap-l">L</span>orem ipsum');
    expect(html).toContain('imx-redacted');
    expect(html).toContain('The launch date is March 3rd.');
    expect(html).toContain('DRAFT');
    expect(html).toContain('Launching soon');
  });

  test('composite components render their nested children, in order', () => {
    expect(html.indexOf('imx-statrow')).toBeLessThan(html.indexOf('p95 query time'));
    expect(html.indexOf('p95 query time')).toBeLessThan(html.indexOf('fewer calls'));
    expect(html).toContain('imx-vs'); // Compare's VS marker
    expect(html.indexOf('Chunk')).toBeLessThan(html.indexOf('Embed') + html.length); // Steps order sanity
    expect(html).toContain('Propose');
    expect(html).toContain('doc.id');
    expect(html).toContain('Stable id');
  });

  test('CodeWalk renders a default slot as its code markup, in place of the plain-text code', () => {
    expect(html).toContain('fixture-highlighted');
    expect(html).toContain('const slotted = true;');
  });

  test('ImaxtCover falls back to a stacked cover built from the title', () => {
    expect(html).toContain('data-kind="stack"');
    expect(html).toContain('imx-cover-line');
  });

  test('TypeLab renders its shell marked for deferred hydration', () => {
    expect(html).toContain('data-imx-typelab');
  });

  test('astro check reports zero errors', async () => {
    const proc = Bun.spawn([join(PACKAGE_ROOT, 'node_modules/.bin/astro'), 'check'], {
      cwd: PACKAGE_ROOT,
      stdout: 'pipe',
      stderr: 'pipe',
    });
    const exitCode = await proc.exited;
    expect(exitCode).toBe(0);
  }, 30_000);
});
