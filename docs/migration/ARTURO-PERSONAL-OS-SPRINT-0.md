# Arturo Personal OS — Migration Sprint 0 Ledger

## Governing source

- AVOS Issue: `FinDataMan/AVOS#33`
- AVOS Direction Packet PR: `FinDataMan/AVOS#34`
- Source export SHA-256: `28d831b251951bb5654d880be6cfca0e12364ad7df2b0f5eb962072a0fe22abe`

## Approved architecture

- Private Development Source: `FinDataMan/arturo-personal-runtime`
- Public Landing release target: `FinDataMan/FinDataMan`
- Future Career Portal: separate private repository
- One editable repository, one branch and one PR per task
- No full-folder overwrite or automatic bidirectional synchronization

## Runtime migration

- Runtime PR: `FinDataMan/arturo-personal-runtime#1`
- Runtime merge commit: `34e96b0378a6a552bf3a86be630bf3a0c1813bdc`
- Imported Runtime source files: 297
- Tracked paths in the migration branch: 323
- Raw Private Evidence committed: 0
- Landing candidates committed: 0
- Local browser/network/download gate: passed

## Public Resume Studio handoffs closed without merge

### PR #3 — Current-baseline revalidation

- URL: `https://github.com/FinDataMan/FinDataMan/pull/3`
- Head SHA: `8f67eb4340c7ca6bbe9af8794254d02aaee971db`
- Disposition: closed without merge
- Reason: Resume Studio validation belongs under the private Runtime or Career Portal authority
- Execution status: no return package or successful validation claimed

### PR #4 — Direct governed execution

- URL: `https://github.com/FinDataMan/FinDataMan/pull/4`
- Head SHA: `8be328c11cc9723f19b0ba9d17dc4fd11419ce00`
- Disposition: closed without merge
- Reusable requirements preserved: Build Recipes, transactional execution, validation, rollback, stale protection and Execution Receipts
- Execution status: no return package or successful execution claimed

### PR #5 — Durable local persistence

- URL: `https://github.com/FinDataMan/FinDataMan/pull/5`
- Head SHA: `9babc6d815ee37509a0816edb2d247cfe10b40d2`
- Disposition: closed without merge
- Candidate Career Portal requirements preserved: durable local storage, atomic promotion, version history, restore, deletion, export/import, conflict/corruption handling and schema migration
- Status: requires reapproval under the future private repository authority

## Public repository baseline

- Baseline before authority cleanup: `438de925886ce81ce84100b7253f2fc1a560c585`
- Current website implementation is not changed by the authority-cleanup task
- Existing `.avos` content is preserved as historical, non-authoritative evidence

## Next release tasks

1. Build a modular Landing release source in `arturo-personal-runtime`.
2. Approve public claims, contact channels, named projects and domain configuration.
3. Produce a Deployment Release Packet and artifact manifest.
4. Release through a separate branch and PR in `FinDataMan/FinDataMan`.
5. Bootstrap the Career Portal only after a separate private-repository gate.

## Prohibitions

- no raw private evidence in this repository;
- no Career state or Resume Studio returns;
- no automatic synchronization;
- no silent canonical mutation;
- no deploy as part of this governance cleanup.