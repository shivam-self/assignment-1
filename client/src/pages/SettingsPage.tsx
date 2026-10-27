import React from 'react';
import { PresetPicker } from '../components/theme/PresetPicker';
import { ColorField } from '../components/theme/ColorField';
import { FontUpload } from '../components/theme/FontUpload';
import { useTheme } from '../themes/ThemeContext';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { RotateCcw, Palette, Type, Info } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { resetTheme, state } = useTheme();

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-text tracking-tight">Settings</h1>
        <p className="text-sm text-text-muted mt-1">
          Manage your application preferences and appearance.
        </p>
      </div>

      {/* Theme / Appearance */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <CardTitle>Appearance & Theme</CardTitle>
              <CardDescription>Customise colors, button styles, and typography.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-7">
          {/* Preset */}
          <PresetPicker />

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Button Color */}
          <ColorField />

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Font Upload */}
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent shrink-0 mt-0.5">
              <Type className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <FontUpload />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Reset */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text">Reset to Defaults</p>
              <p className="text-xs text-text-muted mt-0.5">
                Restore all theme settings to original values.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={resetTheme}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Reset Theme
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current State Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-border/50 flex items-center justify-center text-text-muted">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <CardTitle>About</CardTitle>
              <CardDescription>Application build and version information.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {[
              { label: 'Application', value: 'AuraUI Dashboard' },
              { label: 'Version', value: '1.0.0' },
              { label: 'Stack', value: 'MongoDB · Express · React · Node.js' },
              { label: 'Active Theme', value: state.presetId.charAt(0).toUpperCase() + state.presetId.slice(1) },
              { label: 'Custom Font', value: state.font ? state.font.fileName : 'System font' },
              { label: 'Button Color', value: state.buttonColor ? `Override (${state.buttonColor})` : 'Preset default' },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span className="text-xs text-text-muted font-medium">{label}</span>
                <span className="text-sm text-text font-medium">{value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
