import React, { useState, useEffect } from 'react';
import { Sun, Moon, Radio, Tv, Layers } from 'lucide-react';
import { DvbTCalculator } from './components/DvbTCalculator';
import { DvbSCalculator } from './components/DvbSCalculator';

const App: React.FC = () => {
  // Theme state: default to 'dark' or loaded from localStorage
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const savedTheme = localStorage.getItem('flux-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return 'dark'; // Default
  });

  // Apply theme class to documentElement
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
    localStorage.setItem('flux-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text-primary transition-all-custom font-sans antialiased">
      {/* Header / Nav Container */}
      <header className="border-b border-theme-border bg-theme-surface/30 backdrop-blur-md sticky top-0 z-50 transition-all-custom">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-flux-wine p-2 rounded-lg text-white shadow-md shadow-flux-wine/25">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-theme-text-primary font-sans flex items-center gap-1.5">
                FLUX <span className="text-flux-accent font-semibold text-xs tracking-wider border border-flux-accent/30 rounded px-1.5 py-0.5 bg-flux-accent/5">ENGINEERING</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg bg-theme-surface border border-theme-border text-theme-text-secondary hover:text-flux-accent hover:border-flux-accent hover:bg-flux-accent/5 transition-all-custom focus-ring-custom cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-flux-terracotta" />
              ) : (
                <Moon className="w-4 h-4 text-flux-wine" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Intro Hero Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-theme-text-primary sm:text-4xl">
            RF & Digital Broadcast Utilities
          </h1>
          <p className="mt-2 text-sm text-theme-text-secondary max-w-2xl">
            Real-time, high-precision telemetry and configuration modeling for DVB transmission protocols.
            Supports full Universal Ku-band translation matrix and DVB-T symbol duration parsing.
          </p>
        </div>

        {/* Dashboard Side-By-Side Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Component 1: DVB-T Calculator */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-theme-text-secondary uppercase tracking-wider pl-1">
              <Tv className="w-4 h-4 text-flux-wine" />
              <span>DVB-T Transmission Matrix</span>
            </div>
            <DvbTCalculator />
          </div>

          {/* Component 2: DVB-S Utility */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-theme-text-secondary uppercase tracking-wider pl-1">
              <Radio className="w-4 h-4 text-flux-slate" />
              <span>DVB-S/S2 Intermediate Feed routing</span>
            </div>
            <DvbSCalculator />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-theme-border mt-16 py-6 transition-all-custom">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-theme-text-secondary gap-4">
          <div>
            <span>&copy; {new Date().getFullYear()} Flux Telemetry Inc. All rights reserved.</span>
          </div>
          <div className="flex gap-4">
            <span className="hover:text-theme-text-primary transition-colors cursor-default">DVB-T Standard EN 300 744</span>
            <span className="text-theme-border">|</span>
            <span className="hover:text-theme-text-primary transition-colors cursor-default">LNB Ku ITU Regulations</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
