export type PresetId = 'blue' | 'violet' | 'darcula' | 'forest';

export interface ThemePreset {
  id: PresetId;
  name: string;
  bg: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  accent: string;
  danger: string;
  colorScheme: 'light' | 'dark';
}

export const PRESETS: Record<PresetId, ThemePreset> = {
  blue: {
    id: 'blue',
    name: 'Ocean Blue',
    bg: '#F1F5F9',
    surface: '#FFFFFF',
    text: '#0F172A',
    textMuted: '#64748B',
    border: '#E2E8F0',
    accent: '#4F46E5',
    danger: '#EF4444',
    colorScheme: 'light',
  },
  violet: {
    id: 'violet',
    name: 'Modern Violet',
    bg: '#F5F3FF',
    surface: '#FFFFFF',
    text: '#1E1633',
    textMuted: '#6B7280',
    border: '#EDE9FE',
    accent: '#7C3AED',
    danger: '#EF4444',
    colorScheme: 'light',
  },
  darcula: {
    id: 'darcula',
    name: 'Darcula Dark',
    bg: '#1E1E2E',
    surface: '#2A2A3E',
    text: '#CDD6F4',
    textMuted: '#6C7086',
    border: '#363653',
    accent: '#89B4FA',
    danger: '#F38BA8',
    colorScheme: 'dark',
  },
  forest: {
    id: 'forest',
    name: 'Emerald Forest',
    bg: '#F0FDF4',
    surface: '#FFFFFF',
    text: '#14532D',
    textMuted: '#4B7563',
    border: '#DCFCE7',
    accent: '#16A34A',
    danger: '#DC2626',
    colorScheme: 'light',
  },
};

export const DEFAULT_PRESET_ID: PresetId = 'violet';
