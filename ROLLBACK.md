# Landing / Portafolio B10 v2.8 rollback

## Baseline

Before this release, `main` served the accepted public landing at commit `b6abe30700a4afada03d0a7704c1c14e7cbe1312`.

## Rollback

1. Revert the B10 v2.8 release merge commit in `FinDataMan/FinDataMan` through a dedicated rollback PR.
2. Keep the `CNAME` file only if the custom domain should continue serving GitHub Pages.
3. If hosting must return to Squarespace, restore the prior Squarespace web A/CNAME/HTTPS defaults without modifying Google Workspace MX/SPF/DKIM records.

No DNS rollback should be performed unless the release rollback is explicitly approved.
