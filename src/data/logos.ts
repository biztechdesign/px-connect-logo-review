import fs from 'node:fs';
import path from 'node:path';

/**
 * Reads `public/logos/` at build/dev time and emits one entry per image.
 *
 * Drop new files in that folder with any name; the picker auto-updates on the
 * next request (dev) or on the next `npm run build`. Files are listed in
 * alphabetical order, so prefix names like `option-01.png` to control order.
 */
export interface LogoOption {
  id: string;
  label: string;
  src: string;
  file: string;
}

const EXT = /\.(png|jpe?g|svg|webp|gif|avif)$/i;
const LOGOS_DIR = path.join(process.cwd(), 'public', 'logos');

export function loadLogos(): LogoOption[] {
  if (!fs.existsSync(LOGOS_DIR)) return [];
  const files = fs
    .readdirSync(LOGOS_DIR)
    .filter((f) => EXT.test(f))
    .sort((a, b) => a.localeCompare(b, 'en'));

  return files.map((file, i) => {
    const id = String(i + 1).padStart(2, '0');
    const base = file.replace(EXT, '');
    const label =
      /^option-\d+$/i.test(base)
        ? `Option ${id}`
        : `Option ${id} · ${base.replace(/[-_]+/g, ' ')}`;
    return { id, label, src: `/logos/${file}`, file };
  });
}
