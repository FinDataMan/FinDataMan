# B10 R7 · Static release

Source: the reviewed bilingual HTML pages. Run pnpm install --frozen-lockfile, pnpm run build, pnpm run check and pnpm test. Do not run the previous generation script.

GitHub Pages serves static files. Legacy transition pages use HTML refresh, a canonical link and a visible link; they are not HTTP 301 redirects. The optional Node preview adapter can negotiate Markdown, but GitHub Pages does not execute it. Explicit .md URLs work on both.

The portfolio separates five current projects from four historical records. CV aliases serve the current Manager ES PDF. No analytics, registration form or external font CDN has been added.

Rollback: revert the publication commit as a whole; preserve its parent commit before merge. Do not copy the private repository to hosting.

## Publication · 19 November 2026

Owner authorized merge and deployment to https://arturovillagomez.com/. Public baseline/restore point: 1a7b741c7fafcd39922c09250b09b7126d84a3ae. GitHub Pages serves main at the repository root; CNAME and .nojekyll are retained. This is a public information site; there is no sign-in, payment, lead database or analytics collection.

The 1200 × 630 JPEG sharing covers are composed from the approved, unchanged hero photograph, exact AV mark, Source Serif 4 500, Hanken Grotesk 400 and Martian Mono 400. Native sources live in tools/social-cards/. Export the viewport at exactly 1200 × 630 after fonts load; verify dimensions and legibility before replacing the dated images. Distinct ES/EN images are declared directly in HTML through content/social-sharing.mjs. The three older JPEG URLs retain the current Spanish cover for compatibility. Social-platform caches may retain previous previews; origin verification does not prove every platform cache was refreshed.

Build/check is idempotent; tests include real local HTTP routing, PDF aliases, metadata and image dimensions. Independent pre-commit review passed for the public payload and both covers. Previous acceptance covered desktop/mobile layouts and copy; publication adds no change to facial identity or page layouts. Browser emulation is not a physical-device or field Core Web Vitals audit.

After merge, wait for the Pages deployment and compare every released file to the HTTPS origin, verify 404 behavior, both language paths, four CV versions and ten dossier downloads, and check representative pages in the browser. Keep the deployment result and exact deployed commit in the PR. Rollback by reverting this single release merge commit and redeploying its parent. The private development source is never the hosting root.
