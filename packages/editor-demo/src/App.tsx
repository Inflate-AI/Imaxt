import '@inflate-ai/imaxt-core/styles.css';
import '@inflate-ai/imaxt-editor/styles.css';
import { ImaxtEditor } from '@inflate-ai/imaxt-editor';
import { useMemo, useState } from 'react';
import { SAMPLE_DOCUMENT } from './sample.ts';
import { THEME_PRESETS, type ThemePresetKey } from './themes.ts';

export function App() {
  const [presetKey, setPresetKey] = useState<ThemePresetKey>('blog');
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');
  const [markdown, setMarkdown] = useState(SAMPLE_DOCUMENT);
  const [resetNonce, setResetNonce] = useState(0);

  const preset = THEME_PRESETS[presetKey];
  const theme = colorScheme === 'dark' ? preset.dark : preset.light;

  const bodyBg = useMemo(() => theme.paper, [theme]);

  return (
    <div className="demo-shell" style={{ background: bodyBg, color: theme.text }}>
      <header className="demo-header">
        <div>
          <h1>Imaxt Editor</h1>
          <p>A Medium-style Markdown/MDX editor with Imaxt blocks as first-class content.</p>
        </div>
        <div className="demo-controls">
          <label>
            Theme
            <select
              value={presetKey}
              onChange={(e) => setPresetKey(e.target.value as ThemePresetKey)}
            >
              {Object.entries(THEME_PRESETS).map(([key, p]) => (
                <option key={key} value={key}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => setColorScheme((s) => (s === 'light' ? 'dark' : 'light'))}
          >
            {colorScheme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          <button
            type="button"
            onClick={() => {
              setMarkdown(SAMPLE_DOCUMENT);
              setResetNonce((n) => n + 1);
            }}
          >
            Reset content
          </button>
        </div>
      </header>

      <main className="demo-main">
        <section className="demo-editor-pane">
          <ImaxtEditor
            key={resetNonce}
            initialValue={markdown}
            onChange={setMarkdown}
            theme={theme}
            colorScheme={colorScheme}
            className="demo-editor"
          />
        </section>
        <section className="demo-source-pane">
          <h2>Markdown/MDX source</h2>
          <pre className="demo-source">{markdown}</pre>
        </section>
      </main>

      <footer className="demo-footer">
        <p>
          Images here are stored in-memory only (no backend) - see <code>ImageStorageAdapter</code>{' '}
          in the package README for wiring up a real one. Source:{' '}
          <a href="https://github.com/Inflate-AI/Imaxt/tree/main/packages/editor">
            packages/editor
          </a>
          .
        </p>
      </footer>
    </div>
  );
}
