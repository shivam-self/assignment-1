import { PRESETS, PresetId } from './presets';

export interface CustomFontData {
  fileName: string;
  dataUrl: string;
}

export interface ThemeState {
  presetId: PresetId;
  buttonColor: string | null;
  font: CustomFontData | null;
}

/**
 * Calculates WCAG relative luminance from a 3 or 6 digit hex color.
 */
export function calculateLuminance(hex: string): number {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (cleanHex.length !== 6) {
    return 0;
  }

  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const toLinear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  return (
    0.2126 * toLinear(r) +
    0.7152 * toLinear(g) +
    0.0722 * toLinear(b)
  );
}

/**
 * Derives readable text color (#0F1B2D or #FFFFFF) for buttons based on background luminance.
 */
export function getContrastTextColor(bgHex: string): string {
  const luminance = calculateLuminance(bgHex);
  // WCAG recommended cutoff for light backgrounds: luminance > 0.42
  return luminance > 0.42 ? '#0F1B2D' : '#FFFFFF';
}

/**
 * Pure function mapping theme state to CSS variables dictionary.
 */
export function resolveTheme(state: ThemeState): Record<string, string> {
  const preset = PRESETS[state.presetId] || PRESETS.blue;
  const btnBg = state.buttonColor || preset.accent;
  const btnText = getContrastTextColor(btnBg);

  const fallbackFontStack =
    'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
  const fontFamily = state.font
    ? `"UserFont", ${fallbackFontStack}`
    : fallbackFontStack;

  return {
    '--bg': preset.bg,
    '--surface': preset.surface,
    '--text': preset.text,
    '--text-muted': preset.textMuted,
    '--border': preset.border,
    '--accent': preset.accent,
    '--danger': preset.danger,
    '--btn-bg': btnBg,
    '--btn-text': btnText,
    '--font-family': fontFamily,
    'color-scheme': preset.colorScheme,
  };
}
