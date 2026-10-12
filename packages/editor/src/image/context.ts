import { createContext, useContext } from 'react';
import { createInMemoryImageStorageAdapter, type ImageStorageAdapter } from './adapter.ts';

export const ImageAdapterContext = createContext<ImageStorageAdapter>(
  createInMemoryImageStorageAdapter(),
);

export function useImageAdapter(): ImageStorageAdapter {
  return useContext(ImageAdapterContext);
}
