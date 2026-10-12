import '@inflate-ai/imaxt-core/styles.css';
import '@inflate-ai/imaxt-editor/styles.css';
import { ImaxtEditor } from '@inflate-ai/imaxt-editor';
import { type CSSProperties, useMemo, useState } from 'react';
import { SAMPLE_DOCUMENT } from './sample.ts';
import { THEME_PRESETS, type ThemePresetKey } from './themes.ts';

export function App() {
  const [presetKey, setPresetKey] = useState<ThemePresetKey>('blog');
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');
  const [resetNonce, setResetNonce] = useState(0);

  const preset = THEME_PRESETS[presetKey];
  const theme = colorScheme === 'dark' ? preset.dark : preset.light;

  const shellStyle = useMemo<CSSProperties>(
    () =>
      ({
        background: theme.paper,
        color: theme.text,
        '--demo-card': theme.card,
        '--demo-line': theme.line,
        '--demo-hair': theme.hair,
        '--demo-muted': theme.muted,
        '--demo-accent': theme.accent,
        '--demo-on-accent': theme.onAccent,
        '--demo-font-sans': theme.fontSans,
        '--demo-font-display': theme.fontDisplay,
      }) as CSSProperties,
    [theme],
  );

  return (
    <div className="demo-shell" style={shellStyle}>
      <header className="demo-header">
        <div className="demo-title">
          <h1>Imaxt Editor</h1>
          <p>A Medium-style Markdown/MDX editor with Imaxt blocks as first-class content.</p>
        </div>
        <div className="demo-controls">
          <label className="demo-theme-select">
            <span>Theme</span>
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
            className="demo-btn"
            onClick={() => setColorScheme((s) => (s === 'light' ? 'dark' : 'light'))}
          >
            {colorScheme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          <button
            type="button"
            className="demo-btn demo-btn-accent"
            onClick={() => setResetNonce((n) => n + 1)}
          >
            Reset content
          </button>
        </div>
      </header>

      <main className="demo-main">
        <section className="demo-editor-pane">
          <ImaxtEditor
            key={resetNonce}
            initialValue={SAMPLE_DOCUMENT}
            theme={theme}
            colorScheme={colorScheme}
            className="demo-editor"
          />
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
