/**
 * A tiny, safe parser/stringifier for the small subset of JS literal syntax Imaxt's JSX props
 * use (numbers, strings, booleans, null, arrays, object literals with identifier or quoted
 * keys). Deliberately not `eval`/`new Function`: this runs on MDX source that may come from
 * untrusted authors, and the supported grammar has no variables, calls, or operators to evaluate.
 */

class Reader {
  private pos = 0;
  constructor(private readonly source: string) {}

  private skipWhitespace() {
    while (this.pos < this.source.length && /\s/.test(this.source[this.pos] ?? '')) this.pos++;
  }

  peek(): string {
    this.skipWhitespace();
    return this.source[this.pos] ?? '';
  }

  next(): string {
    this.skipWhitespace();
    return this.nextRaw();
  }

  /** Reads the next character with no whitespace skipping, for use inside string literals. */
  nextRaw(): string {
    const char = this.source[this.pos] ?? '';
    this.pos++;
    return char;
  }

  expect(char: string) {
    const got = this.next();
    if (got !== char) {
      throw new Error(`Expected "${char}" at position ${this.pos - 1}, got "${got}"`);
    }
  }

  atEnd(): boolean {
    this.skipWhitespace();
    return this.pos >= this.source.length;
  }

  readWhile(predicate: (char: string) => boolean): string {
    let out = '';
    while (this.pos < this.source.length && predicate(this.source[this.pos] ?? '')) {
      out += this.source[this.pos];
      this.pos++;
    }
    return out;
  }
}

const ESCAPES: Record<string, string> = {
  n: '\n',
  t: '\t',
  r: '\r',
  b: '\b',
  f: '\f',
  v: '\v',
  '0': '\0',
};

function parseString(reader: Reader): string {
  const quote = reader.next();
  if (quote !== '"' && quote !== "'" && quote !== '`') {
    throw new Error('Expected a string literal');
  }
  let out = '';
  for (;;) {
    const char = reader.nextRaw();
    if (char === '') throw new Error('Unterminated string literal');
    if (char === quote) break;
    if (char === '\\') {
      const next = reader.nextRaw();
      if (next === 'u') {
        const hex = reader.nextRaw() + reader.nextRaw() + reader.nextRaw() + reader.nextRaw();
        out += String.fromCharCode(Number.parseInt(hex, 16));
      } else {
        // Unrecognized escapes (e.g. \" \\ \` \$) fall through to the
        // character itself, matching how JS treats a backslash before any
        // character without its own meaning.
        out += ESCAPES[next] ?? next;
      }
    } else {
      out += char;
    }
  }
  return out;
}

function parseKeyword(reader: Reader): unknown {
  const word = reader.readWhile((c) => /[a-zA-Z]/.test(c));
  if (word === 'true') return true;
  if (word === 'false') return false;
  if (word === 'null') return null;
  throw new Error(`Unsupported literal: "${word}"`);
}

function parseNumber(reader: Reader): number {
  const text = reader.readWhile((c) => /[0-9eE+\-.]/.test(c));
  const value = Number(text);
  if (Number.isNaN(value)) throw new Error(`Invalid number literal: "${text}"`);
  return value;
}

function parseArray(reader: Reader): unknown[] {
  reader.expect('[');
  const items: unknown[] = [];
  while (reader.peek() !== ']') {
    items.push(parseValue(reader));
    if (reader.peek() === ',') reader.next();
  }
  reader.expect(']');
  return items;
}

function parseObjectKey(reader: Reader): string {
  if (reader.peek() === '"' || reader.peek() === "'") return parseString(reader);
  return reader.readWhile((c) => /[a-zA-Z0-9_$]/.test(c));
}

function parseObject(reader: Reader): Record<string, unknown> {
  reader.expect('{');
  const out: Record<string, unknown> = {};
  while (reader.peek() !== '}') {
    const key = parseObjectKey(reader);
    reader.expect(':');
    out[key] = parseValue(reader);
    if (reader.peek() === ',') reader.next();
  }
  reader.expect('}');
  return out;
}

function parseValue(reader: Reader): unknown {
  const char = reader.peek();
  if (char === '"' || char === "'" || char === '`') return parseString(reader);
  if (char === '[') return parseArray(reader);
  if (char === '{') return parseObject(reader);
  if (char === '-' || (char >= '0' && char <= '9')) return parseNumber(reader);
  if (/[a-zA-Z]/.test(char)) return parseKeyword(reader);
  throw new Error(`Unexpected character "${char}" in literal expression`);
}

export function parseJsLiteral(source: string): unknown {
  const reader = new Reader(source);
  const value = parseValue(reader);
  if (!reader.atEnd()) throw new Error(`Unexpected trailing content after literal: "${source}"`);
  return value;
}

function isIdentifier(key: string): boolean {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key);
}

export function stringifyJsLiteral(value: unknown): string {
  if (value === null) return 'null';
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  // Always a single JSON-escaped line, even for a multi-line string: a
  // multi-line *expression attribute value* breaks flow-separation from
  // sibling blocks when serialized into a full document (verified by
  // to-mdx.ts's own round-trip test), so nothing here should emit one. A
  // block whose data is inherently multi-line (Mermaid's diagram source,
  // CodeWalk's code) is written as a child code fence instead, never
  // through this path - see blockToMdastNode.
  if (typeof value === 'string') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stringifyJsLiteral).join(', ')}]`;
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).map(
      ([key, val]) =>
        `${isIdentifier(key) ? key : JSON.stringify(key)}: ${stringifyJsLiteral(val)}`,
    );
    return `{ ${entries.join(', ')} }`;
  }
  throw new Error(`Cannot stringify value of type ${typeof value} as a JS literal`);
}
