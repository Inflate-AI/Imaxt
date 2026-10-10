import { describe, expect, test } from 'bun:test';
import { parseJsLiteral, stringifyJsLiteral } from './js-literal.ts';

describe('parseJsLiteral', () => {
  test('parses primitives', () => {
    expect(parseJsLiteral('42')).toBe(42);
    expect(parseJsLiteral('-3.5')).toBe(-3.5);
    expect(parseJsLiteral('true')).toBe(true);
    expect(parseJsLiteral('false')).toBe(false);
    expect(parseJsLiteral('null')).toBe(null);
  });

  test('parses double- and single-quoted strings with basic escapes', () => {
    expect(parseJsLiteral('"hello"')).toBe('hello');
    expect(parseJsLiteral("'hello'")).toBe('hello');
    expect(parseJsLiteral('"a \\"quoted\\" word"')).toBe('a "quoted" word');
  });

  test('parses arrays, including nested arrays and mixed whitespace', () => {
    expect(parseJsLiteral('["Embed", "Filter", "Rank"]')).toEqual(['Embed', 'Filter', 'Rank']);
    expect(parseJsLiteral('[\n  1,\n  2,\n]')).toEqual([1, 2]);
    expect(parseJsLiteral('[[1, 2], [3, 4]]')).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  test('parses objects with unquoted and quoted keys', () => {
    expect(parseJsLiteral('{ label: "Model A", value: 72 }')).toEqual({
      label: 'Model A',
      value: 72,
    });
    expect(parseJsLiteral('{ "a-b": 1 }')).toEqual({ 'a-b': 1 });
  });

  test('parses an array of objects, matching real Imaxt prop syntax', () => {
    const source = '[{ label: "Model A", value: 72 }, { label: "Model B", value: 81 }]';
    expect(parseJsLiteral(source)).toEqual([
      { label: 'Model A', value: 72 },
      { label: 'Model B', value: 81 },
    ]);
  });

  test('throws on expressions outside the supported literal grammar', () => {
    expect(() => parseJsLiteral('someVariable')).toThrow();
    expect(() => parseJsLiteral('1 + 1')).toThrow();
    expect(() => parseJsLiteral('fn()')).toThrow();
  });
});

describe('stringifyJsLiteral', () => {
  test('round-trips every value parseJsLiteral can produce', () => {
    const values = [
      42,
      -3.5,
      true,
      false,
      null,
      'hello',
      ['Embed', 'Filter'],
      { label: 'Model A', value: 72 },
      [
        { label: 'a', value: 1 },
        { label: 'b', value: 2 },
      ],
    ];
    for (const value of values) {
      expect(parseJsLiteral(stringifyJsLiteral(value))).toEqual(value);
    }
  });

  test('uses double-quoted strings and unquoted identifier keys', () => {
    expect(stringifyJsLiteral('hi')).toBe('"hi"');
    expect(stringifyJsLiteral({ label: 'a' })).toBe('{ label: "a" }');
  });
});
