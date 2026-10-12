import '@inflate-ai/imaxt-core/styles.css';
import '@inflate-ai/imaxt-editor/styles.css';
import { ImaxtEditor } from '@inflate-ai/imaxt-editor';
import { type CSSProperties, useMemo, useState } from 'react';
import { SAMPLE_DOCUMENT } from './sample.ts';
import { DRAFTED_DARK, DRAFTED_LIGHT } from './themes.ts';

function SunMoonIcon({ isDark }: { isDark: boolean }) {
  return (
    <svg
      className="demo-theme-icon"
      data-dark={isDark}
      viewBox="0 0 24 24"
      width="18"
      height="18"
      role="img"
      aria-hidden="true"
    >
      <title>Toggle color scheme</title>
      <g className="demo-theme-icon-sun">
        <circle cx="12" cy="12" r="4.6" fill="currentColor" />
        <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <line x1="12" y1="1.5" x2="12" y2="4" />
          <line x1="12" y1="20" x2="12" y2="22.5" />
          <line x1="1.5" y1="12" x2="4" y2="12" />
          <line x1="20" y1="12" x2="22.5" y2="12" />
          <line x1="4.4" y1="4.4" x2="6.1" y2="6.1" />
          <line x1="17.9" y1="17.9" x2="19.6" y2="19.6" />
          <line x1="4.4" y1="19.6" x2="6.1" y2="17.9" />
          <line x1="17.9" y1="6.1" x2="19.6" y2="4.4" />
        </g>
      </g>
      <path
        className="demo-theme-icon-moon"
        fill="currentColor"
        d="M20 14.5a8.5 8.5 0 0 1-11-11 8.5 8.5 0 1 0 11 11Z"
      />
    </svg>
  );
}

export function App() {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');
  const [resetNonce, setResetNonce] = useState(0);

  const theme = colorScheme === 'dark' ? DRAFTED_DARK : DRAFTED_LIGHT;

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
    <div className="demo-shell" data-theme={colorScheme} style={shellStyle}>
      <header className="demo-header">
        <div className="demo-title">
          <h1>Imaxt Editor</h1>
          <p>
            A Drafted by Dev-style Markdown/MDX editor with Imaxt blocks as first-class content.
          </p>
        </div>
        <div className="demo-controls">
          <button
            type="button"
            className="demo-btn demo-theme-toggle"
            onClick={() => setColorScheme((s) => (s === 'light' ? 'dark' : 'light'))}
            aria-label={colorScheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            aria-pressed={colorScheme === 'dark'}
          >
            <SunMoonIcon isDark={colorScheme === 'dark'} />
            {colorScheme === 'light' ? 'Light' : 'Dark'}
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
