import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../themes/ThemeContext';
import { PresetPicker } from './PresetPicker';
import { ColorField } from './ColorField';
import { FontUpload } from './FontUpload';
import { Button } from '../ui/Button';
import { Palette, RotateCcw, X, AlertTriangle } from 'lucide-react';

export const ThemePanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { resetTheme, storageWarning, clearStorageWarning } = useTheme();
  const panelRef = useRef<HTMLDivElement>(null);

  // Close panel on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  return (
    <div className="relative" ref={panelRef}>
      {/* Trigger button */}
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen((prev) => !prev)}
        leftIcon={<Palette className="w-4 h-4 text-accent" />}
        aria-expanded={isOpen}
        aria-label="Theme Customizer"
        className="shadow-sm"
      >
        Customize Theme
      </Button>

      {/* Popover / Panel Drawer */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 p-5 rounded-2xl bg-surface border border-border shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-semibold text-text">Theme Engine</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-text-muted hover:text-text hover:bg-border/30 transition-colors"
              aria-label="Close theme panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {storageWarning && (
            <div className="mb-4 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p>{storageWarning}</p>
                <button
                  type="button"
                  onClick={clearStorageWarning}
                  className="mt-1 font-semibold underline text-[11px]"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          <div className="space-y-5">
            {/* 1. Presets */}
            <PresetPicker />

            {/* 2. Button Color Override */}
            <div className="pt-2 border-t border-border">
              <ColorField />
            </div>

            {/* 3. Custom Font Upload */}
            <div className="pt-2 border-t border-border">
              <FontUpload />
            </div>

            {/* 4. Reset All */}
            <div className="pt-3 border-t border-border flex justify-between items-center">
              <span className="text-[11px] text-text-muted">
                Layers are independent & live
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetTheme}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                className="text-xs text-text-muted hover:text-danger"
              >
                Reset Theme
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
