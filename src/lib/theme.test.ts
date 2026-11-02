import { describe, expect, it } from 'vitest';
import { resolveInitialTheme } from './theme';

describe('initial theme', () => {
  it('prefers a stored choice over the system preference', () => {
    expect(resolveInitialTheme('light', false)).toBe('light');
    expect(resolveInitialTheme('dark', true)).toBe('dark');
  });

  it('falls back to the system preference when nothing valid is stored', () => {
    expect(resolveInitialTheme(null, true)).toBe('light');
    expect(resolveInitialTheme(null, false)).toBe('dark');
    expect(resolveInitialTheme('purple', true)).toBe('light');
  });
});
