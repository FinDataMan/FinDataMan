# QA · agent readiness · 2026-09-05

Scope: local preparation against public main 819a443. No public release or infrastructure change.

## Automated verification

- Dependency installation: pnpm, pinned negotiator 1.0.0 and integrity lockfile; no install scripts.
- Tests cover negotiation quality/specificity/q=0/charset/defaults/406, HTML and Markdown GET/HEAD, real 404 recovery, cache isolation, redirects, rejected write methods, file/link existence, raw content, headings, ownership schema, llms.txt structure and manifest integrity.
- Build check verifies generated artifacts match the current landing component and site-information source.
- Original landing CSS compared verbatim with the base commit: identical.
- git diff --check: no whitespace errors.

## Browser verification

- Interactive desktop: original hero, image and navigation render; static fallback hides after successful mount.
- ES → EN → ES: language and headline change correctly.
- Case modal opens; next image changes Arturo's gallery from editorial-01-tesis.png to editorial-02-sistema.png; modal closes.
- Interactive mobile at 390 px: document width 375 px, no horizontal overflow.
- JavaScript disabled: visible static H1 Arturo Villagomez, 12,181 rendered characters in the fallback, template hidden.
- No-JS mobile at 390 px: document width 375 px.
- Privacy page inspected on mobile: readable sections, working navigation, no horizontal overflow.
- JavaScript and viewport emulation restored after tests.

The earlier gallery attempt was inconclusive while its temporary browser tab was lost; the stable review tab passed the repeated modal and next-image checks.

## HTTP evidence

Read-only local audit: 21 checks, 19 HTTP 200 and two genuine HTTP 404 responses for the nonexistent route (HTML and Markdown).
Read-only public audit: 21 checks, five HTTP 200 and sixteen HTTP 404 responses. The deployed homepage still returns HTML for Accept: text/markdown with Vary: Accept-Encoding; new trust/Markdown paths are not deployed.

Raw endpoint reports can be reproduced with scripts/audit-endpoints.mjs. Last run outputs are in ignored tmp/local-audit.json and tmp/public-audit.json. Automated tests additionally request every file declared in agent-public-files.json, including scripts, stylesheets and the integrity manifest.

Static content ratio measured by this implementation: approximately 12.1% (12,074 normalized text characters in approximately 99.5k HTML characters). This is a local regression metric, not a reproduced Ora scoring formula.

## Remaining gates

- Owner review of privacy wording, mail handling and professional locality before public release.
- Search Console/Bing access for indexing diagnostics and branded-search follow-up.
- No Organization ownership assigned to AMEZ CFO. A score requiring an Organization address may remain incomplete by design.
- Future hosting/proxy activation for Accept negotiation and Markdown 404 Content-Type; GitHub Pages cannot run the prepared server.
- Separate authorization for commit/PR/release; no score uplift claimed.
