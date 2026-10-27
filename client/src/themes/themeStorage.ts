import { ThemeState } from './resolveTheme';
import { DEFAULT_PRESET_ID, PRESETS } from './presets';

const STORAGE_KEY = 'app.theme.v1';

export const DEFAULT_THEME_STATE: ThemeState = {
  presetId: DEFAULT_PRESET_ID,
  buttonColor: null,
  font: null,
};

export class StorageQuotaError extends Error {
  constructor(message = 'Browser storage quota exceeded') {
    super(message);
    this.name = 'StorageQuotaError';
  }
}

/**
 * Safely loads the stored theme configuration from localStorage.
 * Falls back cleanly to defaults if empty or corrupted.
 */
export function loadStoredTheme(): ThemeState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_THEME_STATE;

    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) {
      return DEFAULT_THEME_STATE;
    }

    const presetId =
      parsed.presetId && PRESETS[parsed.presetId as keyof typeof PRESETS]
        ? parsed.presetId
        : DEFAULT_PRESET_ID;

    const buttonColor =
      typeof parsed.buttonColor === 'string' && /^#[0-9a-fA-F]{3,8}$/.test(parsed.buttonColor)
        ? parsed.buttonColor
        : null;

    let font = null;
    if (
      parsed.font &&
      typeof parsed.font.fileName === 'string' &&
      typeof parsed.font.dataUrl === 'string'
    ) {
      font = {
        fileName: parsed.font.fileName,
        dataUrl: parsed.font.dataUrl,
      };
    }

    return {
      presetId,
      buttonColor,
      font,
    };
  } catch (err) {
    console.warn('[themeStorage] Failed to read or parse localStorage theme, using default:', err);
    return DEFAULT_THEME_STATE;
  }
}

/**
 * Saves theme configuration to localStorage under one versioned key.
 * Throws StorageQuotaError if quota is exceeded.
 */
export function saveTheme(state: ThemeState): void {
  try {
    const payload = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, payload);
  } catch (error: any) {
    if (
      error.name === 'QuotaExceededError' ||
      error.code === 22 ||
      error.number === -2147024882
    ) {
      throw new StorageQuotaError(
        'Theme could not be saved permanently: localStorage storage quota exceeded.'
      );
    }
    console.error('[themeStorage] Error saving theme to storage:', error);
  }
}

/**
 * Clears stored theme from localStorage.
 */
export function clearStoredTheme(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('[themeStorage] Error clearing theme:', error);
  }
}
