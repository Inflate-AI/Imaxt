/**
 * Where an inserted image's bytes actually end up is an integration decision,
 * not this package's. `upload()` only has to return something immediately
 * renderable (a `previewUrl`) plus a stable `ref` to persist in the
 * document; any slower "real" upload (to a server, a bucket, wherever) can
 * keep running after `upload()` returns and only needs to be reflected the
 * next time `resolve()` is called for that `ref`.
 */
export interface ImageUploadResult {
  /** The stable identifier persisted in the native document's image node. */
  ref: string;
  /** Immediately renderable - typically a local object URL. */
  previewUrl: string;
}

export interface ImageStorageAdapter {
  /** Called once per inserted file. Must resolve quickly with something renderable now. */
  upload(file: File): Promise<ImageUploadResult>;
  /** Resolves a `ref` (as stored in the document) to a renderable URL, now or once ready. */
  resolve(ref: string): string | Promise<string>;
}

interface CacheEntry {
  previewUrl: string;
  resolvedUrl?: string;
}

/**
 * The default adapter: everything stays in the browser's memory as object
 * URLs, for the no-backend demo and for any host that hasn't configured
 * anything else yet. `resolve()` is synchronous because there's nothing to
 * wait on - a "real" adapter wrapping a network upload is the one that
 * needs `resolve()`'s async path (see `README.md`'s example).
 */
export function createInMemoryImageStorageAdapter(): ImageStorageAdapter {
  const cache = new Map<string, CacheEntry>();
  let nextId = 0;

  return {
    async upload(file: File): Promise<ImageUploadResult> {
      const ref = `imx-img-${nextId++}`;
      const previewUrl = URL.createObjectURL(file);
      cache.set(ref, { previewUrl });
      return { ref, previewUrl };
    },
    resolve(ref: string): string {
      return cache.get(ref)?.previewUrl ?? ref;
    },
  };
}
