import { describe, expect, test } from 'bun:test';
import { coverPhrase, renderImaxtCover, splitLines } from './imaxt-cover.ts';

describe('coverPhrase', () => {
  test('strips a leading "part N:" prefix and takes the first words', () => {
    expect(coverPhrase('Part 1: Hello World Of Testing Systems Extra', 5)).toBe(
      'Hello World Of Testing Systems',
    );
  });
});

describe('splitLines', () => {
  test('returns one line per word when word count is at or below max', () => {
    expect(splitLines('one two', 3)).toEqual(['one', 'two']);
  });

  test('wraps into at most `max` balanced lines for longer phrases', () => {
    const lines = splitLines('one two three four five six seven eight', 3);
    expect(lines.length).toBeLessThanOrEqual(3);
    expect(lines.join(' ')).toBe('one two three four five six seven eight');
  });
});

describe('renderImaxtCover', () => {
  test('falls back to a stacked cover built from the title when no cover is given', () => {
    const html = renderImaxtCover({ title: 'One API for every vector' });
    expect(html).toContain('data-kind="stack"');
    expect(html).toContain('imx-cover-line');
  });

  test('renders a word cover', () => {
    const html = renderImaxtCover({
      title: 'x',
      cover: { kind: 'word', text: 'Restart', sub: 'safely' },
    });
    expect(html).toContain('data-kind="word"');
    expect(html).toContain('Restart');
    expect(html).toContain('safely');
  });

  test('renders a quote cover without splitting into lines', () => {
    const html = renderImaxtCover({
      title: 'x',
      cover: { kind: 'quote', text: 'Agreement is expensive.' },
    });
    expect(html).toContain('imx-cover-q');
    expect(html).toContain('Agreement is expensive.');
  });

  test('applies the given aspect ratio', () => {
    const html = renderImaxtCover({ title: 'x', ratio: '4 / 3' });
    expect(html).toContain('aspect-ratio:4 / 3');
  });

  test('defaults the aspect ratio to 16 / 9', () => {
    const html = renderImaxtCover({ title: 'x' });
    expect(html).toContain('aspect-ratio:16 / 9');
  });
});
