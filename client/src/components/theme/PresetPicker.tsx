import React from 'react';
import { useTheme } from '../../themes/ThemeContext';
import { PRESETS, PresetId } from '../../themes/presets';
import { Check } from 'lucide-react';

export const PresetPicker: React.FC = () => {
  const { state, setPreset } = useTheme();

  return (
    <div className="space-y-2.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
        Theme Preset
      </label>
      <div className="grid grid-cols-2 gap-2.5">
        {(Object.keys(PRESETS) as PresetId[]).map((id) => {
          const preset = PRESETS[id];
          const isSelected = state.presetId === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => setPreset(id)}
              className={`flex items-center justify-between p-2.5 rounded-lg border text-left transition-all relative ${
                isSelected
                  ? 'border-accent ring-2 ring-accent/30 bg-surface'
                  : 'border-border bg-surface/50 hover:bg-surface'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {/* Visual color swatch representing preset */}
                <div
                  className="w-5 h-5 rounded-full border border-black/10 shrink-0 shadow-sm"
                  style={{ backgroundColor: preset.accent }}
                />
                <span className="text-xs font-medium text-text">{preset.name}</span>
              </div>
              {isSelected && <Check className="w-3.5 h-3.5 text-accent shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
