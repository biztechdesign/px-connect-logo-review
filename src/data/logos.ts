import fs from 'node:fs';
import path from 'node:path';
import { withBase } from '../utils/url';

/**
 * Reads `public/logos/` at build/dev time and emits one entry per
 * logo + icon pair.
 *
 * Convention:
 *   • `logo-NN.<ext>`  → desktop placement (full lockup)
 *   • `icon-NN.<ext>`  → mobile placement (icon only)
 *
 * Files are paired by the number suffix. If only one half of the pair
 * exists, the missing side falls back to whichever does — so an entry
 * still renders, just without the desktop/mobile distinction.
 *
 * Drop new files in that folder (top level only — subfolders like
 * `Backup/` are skipped); the picker auto-updates on next request in
 * dev, or on the next `npm run build`.
 */
export interface LogoOption {
  id: string;
  label: string;
  /** Desktop placement URL (full lockup). */
  src: string;
  /** Mobile placement URL (icon only). */
  iconSrc: string;
  /** Filename of the logo file (for display / debugging). */
  file: string;
  /** Actual filename used for the logo half of the pair. */
  logoFile: string;
  /** Actual filename used for the icon half of the pair. */
  iconFile: string;
  /** True when a real logo file was found in the pair. */
  hasLogo: boolean;
  /** True when a real icon file was found in the pair. */
  hasIcon: boolean;
}

const EXT = /\.(png|jpe?g|svg|webp|gif|avif)$/i;
const PAIR_RE = /^(logo|icon)-(\d+)\.(png|jpe?g|svg|webp|gif|avif)$/i;
const LOGOS_DIR = path.join(process.cwd(), 'public', 'logos');

export function loadLogos(): LogoOption[] {
  if (!fs.existsSync(LOGOS_DIR)) return [];

  const files = fs
    .readdirSync(LOGOS_DIR, { withFileTypes: true })
    .filter((d) => d.isFile() && EXT.test(d.name))
    .map((d) => d.name);

  // Group by the NN number suffix in `logo-NN.ext` / `icon-NN.ext`.
  const groups = new Map<string, { logo?: string; icon?: string }>();
  const orphans: string[] = [];
  for (const file of files) {
    const m = file.match(PAIR_RE);
    if (!m) {
      orphans.push(file);
      continue;
    }
    const kind = m[1].toLowerCase() as 'logo' | 'icon';
    const id = m[2].padStart(2, '0');
    const entry = groups.get(id) ?? {};
    entry[kind] = file;
    groups.set(id, entry);
  }

  const paired: LogoOption[] = [];
  for (const [id, pair] of Array.from(groups.entries()).sort(([a], [b]) =>
    a.localeCompare(b, 'en'),
  )) {
    const logoFile = pair.logo ?? pair.icon!;
    const iconFile = pair.icon ?? pair.logo!;
    const missing: string[] = [];
    if (!pair.logo) missing.push('logo');
    if (!pair.icon) missing.push('icon');
    const label =
      missing.length === 0
        ? `Option ${id}`
        : `Option ${id} · missing ${missing.join(' + ')}`;
    paired.push({
      id,
      label,
      src: withBase(`/logos/${logoFile}`),
      iconSrc: withBase(`/logos/${iconFile}`),
      file: logoFile,
      logoFile,
      iconFile,
      hasLogo: Boolean(pair.logo),
      hasIcon: Boolean(pair.icon),
    });
  }

  // Append any unpaired files (loose drops) at the end so they still
  // appear in the picker — same src for both desktop and mobile.
  orphans.sort((a, b) => a.localeCompare(b, 'en'));
  for (const file of orphans) {
    const id = String(paired.length + 1).padStart(2, '0');
    const base = file.replace(EXT, '').replace(/[-_]+/g, ' ');
    paired.push({
      id,
      label: `Option ${id} · ${base}`,
      src: withBase(`/logos/${file}`),
      iconSrc: withBase(`/logos/${file}`),
      file,
      logoFile: file,
      iconFile: file,
      hasLogo: true,
      hasIcon: true,
    });
  }

  return paired;
}
