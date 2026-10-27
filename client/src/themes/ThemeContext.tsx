import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { PresetId } from './presets';
import { resolveTheme, ThemeState, CustomFontData } from './resolveTheme';
import {
  loadStoredTheme,
  saveTheme,
  clearStoredTheme,
  DEFAULT_THEME_STATE,
  StorageQuotaError,
} from './themeStorage';
import {
  validateFontFile,
  readFileAsArrayBuffer,
  readFileAsDataURL,
  applyFontFace,
  dataUrlToArrayBuffer,
  removeCustomFontFace,
} from './fontLoader';

interface ThemeContextType {
  state: ThemeState;
  setPreset: (presetId: PresetId) => void;
  setButtonColor: (color: string | null) => void;
  uploadCustomFont: (file: File) => Promise<{ success: boolean; message?: string }>;
  removeCustomFont: () => void;
  resetTheme: () => void;
  storageWarning: string | null;
  clearStorageWarning: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [themeState, setThemeState] = useState<ThemeState>(loadStoredTheme);
  const [storageWarning, setStorageWarning] = useState<string | null>(null);
  const saveTimeoutRef = useRef<number | null>(null);

  // Apply CSS variables to root whenever themeState changes
  useEffect(() => {
    const vars = resolveTheme(themeState);
    const root = document.documentElement;

    for (const [key, value] of Object.entries(vars)) {
      root.style.setProperty(key, value);
    }
  }, [themeState]);

  // Debounced persistence helper
  const persistState = useCallback((nextState: ThemeState) => {
    if (saveTimeoutRef.current) {
      window.clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = window.setTimeout(() => {
      try {
        saveTheme(nextState);
        setStorageWarning(null);
      } catch (err) {
        if (err instanceof StorageQuotaError) {
          setStorageWarning(err.message);
        }
      }
    }, 150);
  }, []);

  // Rehydrate font on initial mount
  useEffect(() => {
    if (themeState.font?.dataUrl) {
      try {
        const buffer = dataUrlToArrayBuffer(themeState.font.dataUrl);
        applyFontFace(buffer).catch((err) => {
          console.warn('[ThemeProvider] Stored font failed to load:', err);
          // If stored font was corrupted, clear it safely
          setThemeState((prev) => {
            const next = { ...prev, font: null };
            saveTheme(next);
            return next;
          });
        });
      } catch (err) {
        console.warn('[ThemeProvider] Failed converting stored font data URL:', err);
      }
    }
  }, []);

  // 1. Preset change (keeps buttonColor and font intact)
  const setPreset = useCallback(
    (presetId: PresetId) => {
      setThemeState((prev) => {
        const next = { ...prev, presetId };
        persistState(next);
        return next;
      });
    },
    [persistState]
  );

  // 2. Button color override (null falls back to preset accent)
  const setButtonColor = useCallback(
    (color: string | null) => {
      setThemeState((prev) => {
        const next = { ...prev, buttonColor: color };
        persistState(next);
        return next;
      });
    },
    [persistState]
  );

  // 3. Custom font upload
  const uploadCustomFont = useCallback(
    async (file: File): Promise<{ success: boolean; message?: string }> => {
      try {
        // Validate file format and size first
        validateFontFile(file);

        // Read buffer for FontFace and dataUrl for storage
        const buffer = await readFileAsArrayBuffer(file);
        const dataUrl = await readFileAsDataURL(file);

        // Load into document.fonts
        await applyFontFace(buffer);

        const newFont: CustomFontData = {
          fileName: file.name,
          dataUrl,
        };

        const next = { ...themeState, font: newFont };
        setThemeState(next);

        try {
          saveTheme(next);
          setStorageWarning(null);
        } catch (storageErr) {
          if (storageErr instanceof StorageQuotaError) {
            setStorageWarning(storageErr.message);
            return {
              success: true,
              message:
                'Font applied for this session, but could not be saved to localStorage (quota exceeded).',
            };
          }
        }

        return { success: true };
      } catch (err: any) {
        console.error('[uploadCustomFont] Error:', err);
        return {
          success: false,
          message: err?.message || 'Failed to load font file. Please ensure it is a valid TTF, OTF, or WOFF file.',
        };
      }
    },
    [themeState]
  );

  // 4. Remove custom font
  const removeCustomFont = useCallback(() => {
    removeCustomFontFace();
    setThemeState((prev) => {
      const next = { ...prev, font: null };
      persistState(next);
      return next;
    });
  }, [persistState]);

  // 5. Reset theme: resets preset, clears button override, clears font
  const resetTheme = useCallback(() => {
    removeCustomFontFace();
    clearStoredTheme();
    setThemeState(DEFAULT_THEME_STATE);
    setStorageWarning(null);
  }, []);

  const clearStorageWarning = useCallback(() => {
    setStorageWarning(null);
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        state: themeState,
        setPreset,
        setButtonColor,
        uploadCustomFont,
        removeCustomFont,
        resetTheme,
        storageWarning,
        clearStorageWarning,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
