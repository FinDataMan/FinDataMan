# Release acceptance — B10 Landing / Portafolio v2.8

## Identity

- Status: `LOCAL_GATES_PASSED · PUBLIC_DEPLOYMENT_PENDING`
- Human Creative Authority: Arturo Villagomez
- Approved source PR: `FinDataMan/arturo-personal-runtime#24`
- Approved source head: `08b995ccb2fbd03dc7e3c74dbf6381efa0e680b5`
- Approved source merge: `b3c91a55aeb02f82ff9459f4df3885f89c240f71`
- Release target: `FinDataMan/FinDataMan`
- Release branch: `release/b10-public-v2.8`
- Hosting: GitHub Pages from `main` at repository root
- Production URL: `https://arturovillagomez.com/`
- Release class: downstream convergence / assembly-led integration; no canonical block change

## Controlled mapping

- Adapted B10 v2.8 to the existing public shell; no folder was overwritten.
- Preserved public SEO, structured data, Pinterest verification, social cards, custom domain, CV surface, support runtime, favicon and public portrait assets.
- Removed the private Development Source HUB return link and did not publish governance comments or source paths.
- Published hero, thesis, collaboration routes, eight-case portfolio, method, profile, ideas and contact.
- Preserved Spanish/English behavior, reading progress, reduced-motion fallback, filters, manual carousels, modal, previous/next navigation and keyboard handling.
- Preserved the current Pafi package without upgrading it from the new brand system.

## Asset consumption

Exactly 24 case assets are active, all byte-identical to the approved source head:

- Arturo: `assets/casos/arturo/arturo-editorial-01-tesis.png`, `02-sistema.png`, `03-ecosistema.png`
- Casa Artú / Tamanova: `assets/casos/tamanova/tamanova-editorial-01-hospitalidad.png`, `02-experiencia.png`, `03-sistema.png`
- Don Ventas: `assets/casos/don-ventas-01-tesis.png`, `02-sistema.png`, `03-ecosistema.png`
- AMEZ CFO: `assets/casos/amez-cfo/amez-editorial-01-tesis.png`, `02-sistema.png`, `03-evidencia.png`
- QuickFinance: `assets/casos/quickfinance/quickfinance-editorial-01-tesis.png`, `02-decision.png`, `03-ecosistema.png`
- Stone Oak & Evans: `assets/casos/stone-oak/stone-oak-editorial-01-tesis.png`, `02-experiencia.png`, `03-evidencia.png`
- Sicarú: `assets/casos/sicaru/sicaru-editorial-01-tesis.png`, `02-sistema.png`, `03-mundo.png`
- Pafi Above and Beyond: `assets/casos/pafi-01-system.png`, `02-photo.png`, `03-merida.png`

Nine superseded `slot01`, `slot05` and `slot08` files were removed after confirming zero active references. The public tree contains no `_governance`, prototypes, returns, carriers, source ZIPs, private QA or production-source folders.

## Local acceptance gates

| Gate | Evidence | Result |
|---|---|---|
| Privacy | Text/filename secret scan; no Gmail, WhatsApp, credentials, phones, Wi-Fi or source/governance paths; PNG metadata inspected | PASS |
| Source integrity | 24/24 target assets match approved source SHA-256 | PASS |
| Responsive | 320, 390, 768 and 1440 px; no horizontal overflow | PASS |
| Mobile hero | Full face and body remain visible at 390 px | PASS |
| Asset fidelity | Case media and modal use `object-fit: contain`; all 24 files decode | PASS |
| Interaction | Filters, route accordions, method states, eight card carousels, modal gallery, case previous/next and Escape | PASS |
| Keyboard/accessibility | Modal focus, focus return, focus trap, visible dual-ring focus, labels, alt text and language state | PASS |
| Contrast | Rendered text sample passes WCAG AA thresholds after public-shell adjustments | PASS |
| Reduced motion | `prefers-reduced-motion: reduce` disables smooth scroll and collapses animation/transition duration | PASS |
| Integrity | Zero broken images; zero browser console warnings/errors; every requested local asset returned 200/304 | PASS |
| Content | Conversational link labels; no raw URLs displayed as copy | PASS |
| Brand separation | Arturo is the editorial frame; project identities and claim limits remain explicit | PASS |

## Declared limitations

- Voice DNA remains pending and is not claimed as closed.
- Pafi remains on its current package and requires a later governed increment.
- Tamanova asset authority was confirmed by the owner; its canonical repository remains unresolved in AVOS and no technical provenance is inferred.
- AMEZ CFO figures are synthetic and anonymous; they are not represented as real results.
- Stone Oak & Evans remains a study in validation.
- Sicarú remains a conceptual, non-manufactured prototype.

## Production closure

This record is not final until the PR is merged, GitHub Pages reports a successful deployment of the merge commit, and desktop/mobile production validation passes. The immutable post-merge evidence—PR URL, deployed commit, Pages deployment, public URL, production screenshots, console/network results and final state—will be recorded in the release PR conversation so the one-branch/one-PR contract remains intact.
