export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'theme';

/**
 * A stored choice wins; otherwise follow the system preference.
 * Anything other than the two known values counts as "nothing stored".
 *
 * Keep this in sync with the inline script in index.html, which applies the
 * same rule before the first paint to avoid a flash of the wrong theme.
 */
export const resolveInitialTheme = (stored: string | null, prefersLight: boolean): Theme => {
  if (stored === 'light' || stored === 'dark') return stored;
  return prefersLight ? 'light' : 'dark';
};
