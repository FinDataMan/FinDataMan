# Claude Design ↔ AVOS Handoff — Resume Studio RS-004B.2H

## Authority

- AVOS authority: `FinDataMan/AVOS`
- AVOS branch: `resume-studio/rs-004b-2-stabilization`
- Governing recipe: `RS-004B.2H — Durable Local Artifact Persistence`
- Approval record: `REC-RS-002 — Durable Artifact Version Persistence`
- Human decision owner: Arturo Villagómez
- Approved disposition: `APPROVE_LOCAL`
- Target runtime: native Claude Design HUB, card `A12 — Resume Studio`
- Only modifiable product file: `arturo-villagomez/bloques/Resume Studio.dc.html`

## Objective

Add durable local persistence to A12 using IndexedDB so promoted artifact versions, Decision Records, Build Recipes, Execution Receipts and validation lineage survive reload.

The implementation remains local to the current browser profile and origin. It must not create cloud storage, remote synchronization, automatic GitHub writes or cross-device claims.

## Required result

After a governed execution such as `v1.0.0 → v1.1.0`:

1. persist the promoted artifact snapshot;
2. persist its Decision Record, Build Recipe, Execution Receipt and validation state;
3. update the active-version pointer atomically;
4. reload A12;
5. restore `v1.1.0` and its linked lineage;
6. expose history, restore, deletion, export/import and storage status.

Do not ask for another plan approval. Arturo already approved this stage.

## IndexedDB identity

```yaml
database_name: avos-resume-studio
schema_version: 1
scope: current browser profile and origin
remote_sync: false
canonical_repository_status: non-canonical local operational history
```

Show a visible notice that history is local to this browser/profile and is not automatically backed up or synchronized.

## Required stores

### `artifacts`

Key: `artifact_version_id`

Required fields:

```yaml
artifact_version_id:
artifact_id:
version:
model_id:
content_snapshot:
semantic_hash:
template_id:
template_geometry_hash:
created_at:
created_by:
source_version_id:
source_recipe_id:
source_receipt_id:
validation_status:
status: ACTIVE | HISTORICAL | SUPERSEDED | DELETED_TOMBSTONE
```

### `decisions`

```yaml
decision_id:
recommendation_id:
finding_ids: []
decision_state:
actor:
recorded_at:
artifact_version_id:
```

### `recipes`

```yaml
recipe_id:
version:
status:
source_recommendation_id:
source_finding_ids: []
source_artifact_version_id:
target_artifact_version_id:
contract:
created_at:
executed_at:
```

### `receipts`

```yaml
receipt_id:
recipe_id:
source_artifact_version_id:
target_artifact_version_id:
execution_status:
before_metrics:
after_metrics:
semantic_diff:
validation_results:
rollback_state:
created_at:
```

### `meta`

Persist:

- active artifact version ID;
- schema version;
- last successful persistence timestamp;
- last successful recovery timestamp;
- last export timestamp;
- imported-package lineage;
- storage health state.

### `events`

Append-only records for persistence, restore, import, export, delete, corruption detection, migration, rollback and active-version changes.

## Atomic persistence

After a direct governed execution passes validation, write in one transaction:

1. target artifact snapshot;
2. Decision Record if not already durable;
3. Build Recipe;
4. Execution Receipt;
5. validation results;
6. lineage event;
7. active-version pointer last.

If any required write fails:

- abort the transaction;
- keep the prior durable active version;
- leave no partial records;
- report `PERSISTENCE_FAILED`;
- allow manual receipt/history download;
- do not claim durable promotion.

The success label is:

```text
Cambio aplicado y guardado
```

Do not show `Cambio aplicado` without clearly distinguishing whether persistence succeeded.

## Initialization and reload

On A12 startup:

1. open the database;
2. validate schema version;
3. check storage health;
4. resolve active-version pointer;
5. load the linked snapshot;
6. verify semantic and template-geometry hashes;
7. restore active model/version/lineage;
8. render only after validation.

If no history exists, load the demo baseline and identify it as the initial local baseline.

If the active pointer is missing or corrupt:

- do not silently overwrite history;
- identify the latest valid version;
- offer explicit recovery;
- record a recovery event;
- preserve corrupt records for export/diagnosis unless deleted by the user.

## Schema migration boundary

Use IndexedDB `onupgradeneeded` and a clear migration boundary.

Version 1 is the only implemented schema, but the implementation must:

- store the schema version;
- reject unsupported future schemas clearly;
- preserve records during upgrades;
- never delete all history as a migration shortcut;
- record migration events.

## History UI

Add a `Historial` control inside A12.

List newest first:

- version;
- status;
- timestamp;
- source version;
- recommendation/recipe;
- page-fit and validation;
- active marker;
- storage state.

Per version provide:

- Abrir;
- Ver recipe;
- Ver recibo;
- Restaurar;
- Eliminar when allowed;
- Exportar versión.

The active version cannot be deleted until another valid version is promoted as active.

## Governed restore

Restoring a prior version must:

```text
Select version
→ show consequences
→ explicit confirmation
→ restore Decision Record
→ restore Recipe
→ validate historical snapshot
→ create a new promoted version derived from it
→ update active pointer atomically
→ create restore Receipt
```

Never rewrite historical records or silently move the pointer.

## Deletion

### One version

Require confirmation and show:

- version ID;
- descendants;
- linked recipes/receipts;
- active state;
- recommendation to export first.

If content deletion would break lineage, retain a minimal tombstone without resume content.

### All history

Require double confirmation. Explain that:

- all local Resume Studio history will be removed;
- Career OS and repositories are unaffected;
- recovery requires a previous export.

Delete the IndexedDB database, verify absence, then return to the initial local baseline.

## Export

Provide:

- `Exportar historial`;
- `Exportar versión`.

Minimum format:

```text
resume-studio-history-<timestamp>.json
```

Package fields:

```yaml
package_identity:
  package_type: RESUME_STUDIO_LOCAL_HISTORY
  schema_version:
  exported_at:
  source_origin:
  package_hash:
artifacts: []
decisions: []
recipes: []
receipts: []
events: []
meta:
```

## Import

Required flow:

1. select file;
2. parse without mutation;
3. validate package identity/schema;
4. validate IDs and relationships;
5. recompute hashes;
6. detect duplicates/conflicts;
7. show preview;
8. explicit confirmation;
9. transactionally import;
10. create import event and receipt;
11. do not replace active version automatically.

Conflict rules:

- exact duplicate: skip and report;
- same ID/same hash: duplicate;
- same ID/different hash: block;
- unsupported schema: block;
- corrupt package: no storage mutation;
- partial lineage: import only as visibly limited `PARTIAL_HISTORY` after explicit confirmation.

## Privacy and truthfulness

- no persistence network requests;
- no telemetry;
- no automatic GitHub writes;
- no encryption-at-rest claim;
- exported files require deliberate user action;
- imported content must remain safely escaped/sanitized;
- explain that clearing browser data can erase history;
- when quota/usage is unavailable, show `No disponible`.

## Storage status UI

Show:

- Guardado localmente / Sin guardar / Error de almacenamiento;
- last successful save;
- active version;
- number of versions;
- approximate usage only when available;
- local-only notice;
- export reminder when no recent export exists.

## Protected scope

Do not modify:

- RS-TPL-001 or template geometry;
- Career OS / Resume Master;
- ATS or Layout diagnostic thresholds;
- brand tokens;
- A7;
- HUB outside A12;
- PDF/DOCX export;
- cloud or repository synchronization;
- CC-01, CC-02 or CC-03;
- RS-004C or additional-template eligibility.

Only `Resume Studio.dc.html` may change.

## Required tests

- PER-RS-001 database initialization;
- PER-RS-002 durable promotion and reload restore;
- PER-RS-003 failed-persistence transaction abort;
- PER-RS-004 history navigation;
- PER-RS-005 governed restore creates new lineage;
- PER-RS-006 delete one version with tombstone;
- PER-RS-007 delete all and recover from export;
- PER-RS-008 export/import round trip;
- PER-RS-009 duplicate/conflict import;
- PER-RS-010 corruption recovery;
- PER-RS-011 schema boundary;
- PER-RS-012 storage status and accessibility;
- PER-RS-013 protected-scope regression.

## Required return package

Create:

```text
.avos/resume-studio/rs-004b-2h-return/
├── 00-README.md
├── execution-summary.md
├── files-changed.md
├── metrics.json
├── console-status.md
├── artifact-index.yaml
├── candidate-changes.yaml
├── sync-state.yaml
├── reports/database-schema.md
├── reports/atomic-persistence.md
├── reports/reload-recovery.md
├── reports/history-ui.md
├── reports/governed-restore.md
├── reports/deletion.md
├── reports/export-import.md
├── reports/conflict-corruption.md
├── reports/storage-status-accessibility.md
├── reports/non-regression.md
├── artifacts/indexeddb-schema.json
├── artifacts/export-sample.json
├── artifacts/import-receipt.md
├── artifacts/restore-receipt.md
└── screenshots/
    ├── durable-save.png
    ├── restored-after-reload.png
    ├── version-history.png
    ├── restore-confirmation.png
    ├── export-import.png
    └── storage-status.png
```

## Completion rule

The increment is complete only when:

- v1.1.0 survives reload;
- recipe and receipt survive reload;
- persistence is atomic;
- failed persistence leaves no partial promotion;
- history is inspectable;
- restore creates new governed lineage;
- deletion is explicit and traceability-safe;
- export/import round trip works;
- conflicts and corruption fail safely;
- storage status is truthful;
- no network/cloud persistence exists;
- only A12 changed;
- the return package is complete.

Do not execute a later recipe after producing the return package. Wait for AVOS review.
