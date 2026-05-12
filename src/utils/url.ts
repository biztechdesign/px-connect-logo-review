/**
 * Prepend Astro's configured `base` to an absolute-looking path.
 *
 * Works inside `.astro` frontmatter and any TS module imported by Astro —
 * Vite makes `import.meta.env.BASE_URL` available everywhere.
 */
export function withBase(path: string): string {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  const tail = path.startsWith('/') ? path : `/${path}`;
  return base + tail;
}

/** Same as withBase but exposed as a value for use in `define:vars`. */
export const BASE_PREFIX = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
