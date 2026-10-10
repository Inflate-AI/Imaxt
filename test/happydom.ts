import { GlobalWindow } from 'happy-dom';

const window = new GlobalWindow();

for (const key of Object.getOwnPropertyNames(window)) {
  try {
    // @ts-expect-error - assigning a dynamic key onto globalThis
    globalThis[key] = window[key as keyof typeof window];
  } catch {
    // Some globals (e.g. `self`) are read-only in Bun's runtime; leave them as-is.
  }
}
