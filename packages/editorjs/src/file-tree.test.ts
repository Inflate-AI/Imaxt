import { describe, expect, test } from 'bun:test';
import { renderFileTree } from '@inflate-ai/imaxt-core';
import { FileTreeTool } from './file-tree.ts';

describe('FileTreeTool', () => {
  test('exposes a toolbox entry', () => {
    expect(FileTreeTool.toolbox.title).toBeTruthy();
  });

  test('preview matches the render engine', () => {
    const data = { tree: [{ name: 'src', children: [{ name: 'index.ts' }] }] };
    const tool = new FileTreeTool({ data } as never);
    const wrapper = tool.render();
    const preview = wrapper.querySelector('.imx-ej-preview')!;
    expect(preview.innerHTML).toBe(renderFileTree(data));
  });

  test('save() round-trips and validate() requires at least one node', () => {
    const data = { tree: [{ name: 'src' }] };
    const tool = new FileTreeTool({ data } as never);
    const saved = tool.save();
    expect(JSON.parse(JSON.stringify(saved))).toEqual(saved);
    expect(tool.validate({ tree: [] })).toBe(false);
    expect(tool.validate(saved)).toBe(true);
  });
});
