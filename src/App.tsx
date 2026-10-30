import React, { useEffect, useRef, useState } from 'react';
import { Radio, Tv, Layers } from 'lucide-react';
import { DvbTCalculator } from './components/DvbTCalculator';
import { DvbSCalculator } from './components/DvbSCalculator';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Apply theme to document root
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ theme: 'light' | 'dark' }>;
      setTheme(customEvent.detail.theme);
    };

    header.addEventListener('theme-change', handleThemeChange);
    return () => header.removeEventListener('theme-change', handleThemeChange);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text-primary)] transition-all-custom font-sans antialiased">
      {/* Header / Nav Container */}
      <ui-header ref={headerRef} theme={theme}>
        <Layers slot="app-icon" className="w-5 h-5 text-[var(--theme-text-primary)]" />
        <div slot="app-title">RF & Digital Broadcast Utilities</div>
      </ui-header>

      {/* Main Content Dashboard */}
      <main className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Intro Hero Section */}
        <div className="mb-8">
          <p className="text-sm text-[var(--theme-text-secondary)] max-w-2xl">
            This application provides rapid, high-precision calculations for DVB-T modulation bandwidths, Intermediate Frequency (IF) localization
          </p>
        </div>

        {/* Dashboard Side-By-Side Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Component 1: DVB-T Calculator */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider pl-1">
              <Tv className="w-4 h-4 text-[var(--color-flux-wine)]" />
              <span>DVB-T Transmission Matrix</span>
            </div>
            <DvbTCalculator />
          </div>

          {/* Component 2: DVB-S Utility */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider pl-1">
              <Radio className="w-4 h-4 text-[var(--color-flux-slate)]" />
              <span>DVB-S/S2 Intermediate Feed routing</span>
            </div>
            <DvbSCalculator />
          </div>
        </div>
      </main>

      {/* Footer */}
      <ui-footer>
        <div slot="footer-signature" className="font-mono text-xs text-[var(--theme-text-secondary)]">&gt; sys_admin: ~/$ &copy; 2026 Open Source</div>
        <div slot="footer-repo" className="flex gap-4 items-center">
          <a href="https://github.com/FluxFae/Calculator-Bitrate-DVB-T-and-IF-Satellite" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[var(--theme-text-primary)] transition-colors cursor-pointer">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="opacity-80"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            GitHub
          </a>
          <span className="text-[var(--theme-border)]">|</span>
          <span className="hover:text-[var(--theme-text-primary)] transition-colors cursor-default">MIT License</span>
        </div>
        <div slot="footer-status" className="flex items-center gap-2">
          <span>v{__APP_VERSION__}</span>
          <div className="w-2 h-2 rounded-full bg-[var(--color-flux-success)] animate-pulse"></div>
        </div>
      </ui-footer>
    </div>
  );
};

export default App;
