# Landing v1 rollback

## Baseline

Before release, `main` served the legacy FinDataMan site.

## Rollback

1. Revert the release merge commit in `FinDataMan/FinDataMan`.
2. Keep the `CNAME` file only if the custom domain should continue serving GitHub Pages.
3. If hosting must return to Squarespace, restore the prior Squarespace web A/CNAME/HTTPS defaults without modifying Google Workspace MX/SPF/DKIM records.

No DNS rollback should be performed unless the release rollback is explicitly approved.
