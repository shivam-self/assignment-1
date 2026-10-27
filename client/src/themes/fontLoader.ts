const MAX_RAW_SIZE_BYTES = 1.5 * 1024 * 1024; // 1.5 MB
const ALLOWED_EXTENSIONS = ['.ttf', '.otf', '.woff', '.woff2'];
const ALLOWED_MIME_TYPES = [
  'font/ttf',
  'font/otf',
  'font/woff',
  'font/woff2',
  'application/x-font-ttf',
  'application/x-font-otf',
  'application/font-woff',
  'application/font-woff2',
  'application/octet-stream', // Some browsers report this for fonts
];

let activeFontFace: FontFace | null = null;

export class FontValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FontValidationError';
  }
}

/**
 * Validates file extension and size.
 */
export function validateFontFile(file: File): void {
  const name = file.name.toLowerCase();
  const hasValidExtension = ALLOWED_EXTENSIONS.some((ext) => name.endsWith(ext));

  if (!hasValidExtension) {
    throw new FontValidationError(
      `Unsupported font format "${file.name}". Please upload a .ttf, .otf, .woff, or .woff2 file.`
    );
  }

  if (file.size > MAX_RAW_SIZE_BYTES) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    throw new FontValidationError(
      `Font file is too large (${sizeInMB} MB). Maximum allowed size is 1.5 MB.`
    );
  }

  if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
    console.warn(`Font MIME type warning: ${file.type}`);
  }
}

/**
 * Loads a font into the document FontFaceSet from an ArrayBuffer.
 * Deletes any previously registered UserFont to prevent memory leaks.
 */
export async function applyFontFace(buffer: ArrayBuffer): Promise<FontFace> {
  const newFace = new FontFace('UserFont', buffer);
  const loadedFace = await newFace.load();

  if (activeFontFace) {
    try {
      document.fonts.delete(activeFontFace);
    } catch (e) {
      console.warn('Failed to delete previous FontFace:', e);
    }
  }

  document.fonts.add(loadedFace);
  activeFontFace = loadedFace;
  return loadedFace;
}

/**
 * Converts a data URL to an ArrayBuffer.
 */
export function dataUrlToArrayBuffer(dataUrl: string): ArrayBuffer {
  const base64Index = dataUrl.indexOf(';base64,');
  if (base64Index === -1) {
    throw new Error('Invalid font data URL format');
  }
  const base64 = dataUrl.substring(base64Index + 8);
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Reads a File as an ArrayBuffer.
 */
export function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(new Error('Failed to read font file as buffer'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Reads a File as a base64 Data URL.
 */
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to encode font file as data URL'));
    reader.readAsDataURL(file);
  });
}

/**
 * Removes active custom font and restores system font.
 */
export function removeCustomFontFace(): void {
  if (activeFontFace) {
    try {
      document.fonts.delete(activeFontFace);
    } catch (e) {
      console.warn('Failed to delete active FontFace:', e);
    }
    activeFontFace = null;
  }
}
