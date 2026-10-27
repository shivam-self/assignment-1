import React, { useState, useRef } from 'react';
import { useTheme } from '../../themes/ThemeContext';
import { UploadCloud, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import { Spinner } from '../ui/Spinner';

export const FontUpload: React.FC = () => {
  const { state, uploadCustomFont, removeCustomFont } = useTheme();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    setSuccessMsg(null);

    const result = await uploadCustomFont(file);

    if (result.success) {
      setSuccessMsg(result.message || `Font "${file.name}" loaded successfully.`);
      // Clear message after 4s
      setTimeout(() => setSuccessMsg(null), 4000);
    } else {
      setUploadError(result.message || 'Failed to apply custom font.');
    }

    setIsUploading(false);
    // Reset file input so user can re-upload same file if desired
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Custom Font (.ttf, .otf, .woff, .woff2)
        </label>
        {state.font && (
          <button
            type="button"
            onClick={removeCustomFont}
            className="text-xs text-danger hover:underline flex items-center gap-1"
            title="Restore system font"
          >
            <Trash2 className="w-3 h-3" />
            <span>Remove</span>
          </button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".ttf,.otf,.woff,.woff2,font/ttf,font/otf,font/woff,font/woff2"
        onChange={handleFileSelect}
        className="hidden"
        id="theme-font-upload"
      />

      {/* Drop area / button */}
      <label
        htmlFor="theme-font-upload"
        className={`flex flex-col items-center justify-center p-3.5 border border-dashed rounded-lg cursor-pointer transition-colors ${
          isUploading
            ? 'opacity-60 cursor-wait bg-border/20 border-border'
            : 'border-border hover:border-accent hover:bg-surface/80 bg-surface/40'
        }`}
      >
        <div className="flex items-center gap-2 text-xs font-medium text-text">
          {isUploading ? (
            <>
              <Spinner size="sm" />
              <span>Validating & loading font...</span>
            </>
          ) : (
            <>
              <UploadCloud className="w-4 h-4 text-accent" />
              <span>Choose font file (max 1.5 MB)</span>
            </>
          )}
        </div>
        <span className="text-[10px] text-text-muted mt-1">
          Supports TrueType, OpenType, WOFF & WOFF2
        </span>
      </label>

      {/* Current Font Indicator */}
      {state.font ? (
        <div className="flex items-center justify-between px-2.5 py-1.5 rounded bg-accent/10 border border-accent/20 text-xs">
          <div className="flex items-center gap-1.5 truncate">
            <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
            <span className="truncate font-medium text-text">
              Active: {state.font.fileName}
            </span>
          </div>
        </div>
      ) : (
        <p className="text-[11px] text-text-muted">
          Active: System font stack (system-ui, Segoe UI, Roboto)
        </p>
      )}

      {/* Feedback Messages */}
      {uploadError && (
        <div className="p-2 rounded bg-danger/10 border border-danger/20 text-danger text-xs flex items-start gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-start gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
    </div>
  );
};
