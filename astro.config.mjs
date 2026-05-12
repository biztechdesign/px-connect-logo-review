// @ts-check
import { defineConfig } from 'astro/config';

// In CI (GitHub Actions) the site is served from a project sub-path; in dev it
// stays at the root so http://localhost:4321/ keeps working.
const REPO = 'px-connect-logo-review';
const isCi = Boolean(process.env.GITHUB_ACTIONS);

export default defineConfig({
  output: 'static',
  site: 'https://biztechdesign.github.io',
  base: isCi ? `/${REPO}` : '/',
  server: { host: true, port: 4321 },
});
