/// <reference types="vite/client" />

import * as React from 'react';

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        'ui-header': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
          theme?: 'light' | 'dark';
        };
        'ui-footer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      }
    }
  }

  /** Injected at build time by vite.config.ts from package.json. */
  const __APP_VERSION__: string;
}

declare module 'lucide-react' {
  interface LucideProps {
    slot?: string;
  }
}
