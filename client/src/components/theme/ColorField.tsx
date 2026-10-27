import React from 'react';
import { useTheme } from '../../themes/ThemeContext';
import { PRESETS } from '../../themes/presets';
import { RotateCcw } from 'lucide-react';

const QUICK_COLORS = [
  { label: 'Yellow (High Luminance)', hex: '#FACC15' },
  { label: 'White (Max Luminance)', hex: '#FFFFFF' },
  { label: 'Navy (Low Luminance)', hex: '#1E293B' },
  { label: 'Crimson', hex: '#DC2626' },
  { label: 'Teal', hex: '#0D9488' },
];

export const ColorField: React.FC = () => {
  const { state, setButtonColor } = useTheme();
  const currentPreset = PRESETS[state.presetId] || PRESETS.blue;
  const activeColor = state.buttonColor || currentPreset.accent;

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setButtonColor(e.target.value);
  };

  const handleReset = () => {
    setButtonColor(null);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Button Color Override
        </label>
        {state.buttonColor && (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-accent hover:underline flex items-center gap-1"
            title="Reset to preset accent"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Native color input */}
        <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-border shrink-0 cursor-pointer shadow-sm">
          <input
            type="color"
            value={activeColor}
            onChange={handleColorChange}
            className="absolute -top-2 -left-2 w-14 h-14 cursor-pointer border-0 p-0"
            aria-label="Choose button color"
          />
        </div>

        {/* Hex display and state indicator */}
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-text uppercase">
              {activeColor}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-border/40 text-text-muted">
              {state.buttonColor ? 'Custom override' : 'Preset default'}
            </span>
          </div>
          <p className="text-[11px] text-text-muted mt-0.5">
            Auto-computes text contrast (WCAG) for buttons
          </p>
        </div>
      </div>

      {/* Quick Test Colors (especially Yellow and White for testing WCAG luminance!) */}
      <div className="pt-1">
        <span className="text-[11px] text-text-muted block mb-1.5">
          Quick test presets (test contrast engine):
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          {QUICK_COLORS.map((c) => (
            <button
              key={c.hex}
              type="button"
              onClick={() => setButtonColor(c.hex)}
              title={c.label}
              className="w-6 h-6 rounded-full border border-black/20 hover:scale-110 transition-transform shadow-sm relative"
              style={{ backgroundColor: c.hex }}
            >
              {state.buttonColor?.toUpperCase() === c.hex.toUpperCase() && (
                <span className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-black/40" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
