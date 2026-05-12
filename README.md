# PX Connect — Header Logo Review

A small Astro site that recreates the PrintXpand microsite header (same colors,
type, sticky behavior, hamburger logic) and lets reviewers test how the
**PrintXpand logo + PX Connect logo** lockup looks side-by-side, on both
desktop and mobile, across **10 logo options**.

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:4321/> — pick any logo option; the desktop iframe
(1280 px) and the phone-frame mobile iframe (390 px) both update.

## Drop in the real logos

10 numbered placeholder SVGs ship in `public/logos/option-01.svg …
option-10.svg`. Replace them in place — keep the same file names and the
review UI picks them up automatically.

- Recommended format: **SVG** (scales crisply at all sizes).
- Recommended aspect: roughly **3:1 or 4:1** so the lockup balances visually
  with the PrintXpand mark to its left.
- The header sizes the secondary logo to **30 px tall** on desktop and
  **26 px tall** on mobile — make sure your SVG's viewBox accounts for that.

## Share for review

- **Quickest:** run `npm run build` and zip the generated `dist/` folder.
  Anyone can open `dist/index.html` directly.
- **Better:** deploy `dist/` to Vercel, Cloudflare Pages, or Netlify and
  share the URL. Each option is bookmarkable — append `?logo=05` etc.

## File map

```
src/
  components/Header.astro      # the topbar; secondaryLogoSrc prop = the variant under review
  layouts/BaseLayout.astro
  pages/
    index.astro                # review UI: 10-option picker + dual preview iframes
    frame.astro                # bare header rendered inside the iframes
  styles/
    global.css                 # PrintXpand design tokens + base type
    header.css                 # exact topbar styles ported from the live site
public/
  fonts/                       # DM Sans + Fraunces (latin) woff2 from the live site
  images/logo.svg              # PrintXpand wordmark
  images/logos/px-icon.png     # PrintXpand icon (mobile collapsed state)
  logos/option-01..10.svg      # the 10 logo options being reviewed
```
