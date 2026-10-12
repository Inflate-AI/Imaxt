import { useEffect, useState } from 'react';
import { useImageAdapter } from './context.ts';

/**
 * Resolves an image `ref` to a renderable URL via the current
 * `ImageStorageAdapter`. Renders whatever is immediately available (the
 * default in-memory adapter resolves synchronously), then updates once a
 * slower "real" upload's `resolve()` promise settles - the backend upload
 * happens behind the already-visible preview, never blocking it.
 */
export function useImageSrc(ref: string): string | null {
  const adapter = useImageAdapter();
  const immediate = adapter.resolve(ref);
  const [src, setSrc] = useState<string | null>(typeof immediate === 'string' ? immediate : null);

  useEffect(() => {
    const result = adapter.resolve(ref);
    if (typeof result === 'string') {
      setSrc(result);
      return;
    }
    let cancelled = false;
    result.then((resolved) => {
      if (!cancelled) setSrc(resolved);
    });
    return () => {
      cancelled = true;
    };
  }, [adapter, ref]);

  return src;
}
