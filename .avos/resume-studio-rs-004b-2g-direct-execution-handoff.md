# Claude Design ↔ AVOS Handoff — Resume Studio RS-004B.2G

## Authority

- AVOS authority: `FinDataMan/AVOS`
- AVOS branch: `resume-studio/rs-004b-2-stabilization`
- Governing recipe: `RS-004B.2G — Recommendation-to-Governed-Execution`
- Human decision owner: Arturo Villagómez
- Explicit decision: an accepted recommendation must execute the governed change directly, rather than stop after preparing a recipe
- Target runtime: native Claude Design HUB, card `A12 — Resume Studio`
- Target product file: `arturo-villagomez/bloques/Resume Studio.dc.html`

## Objective

Replace the non-functional `Preparar recipe` action with a functional `Aplicar cambio` flow.

The user flow must be:

```text
Recommendation visible
→ Arturo selects “La tomo”
→ “Aplicar cambio” becomes enabled
→ Arturo clicks “Aplicar cambio”
→ Build Recipe is generated internally
→ Recipe executes transactionally
→ Validation runs
→ PASS promotes a new artifact version
→ FAIL rolls back completely
→ Execution Receipt is displayed
```

Selecting `La tomo` alone must not mutate the artifact. The second explicit click is the execution authorization.

## Required UI changes

1. Replace button label:

```text
Preparar recipe
```

with:

```text
Aplicar cambio
```

2. Replace helper text with:

```text
Crea y ejecuta una recipe gobernada ahora.
```

3. Map decisions:

| UI option | Canonical state | Action availability |
|---|---|---|
| `La tomo` | `APPROVED_FOR_EXECUTION` | Enable `Aplicar cambio` when recommendation is executable |
| `La mantengo` | `REJECTED_KEEP_CURRENT` | Disable action |
| `Luego` | `DEFERRED` | Disable action |

4. Use real disabled semantics:

- boolean `disabled`;
- `aria-disabled="true"` where appropriate;
- disabled button not focusable or clickable;
- never display an enabled-looking action without a handler.

## Transactional execution

Clicking `Aplicar cambio` must:

1. snapshot the current artifact model, version, rendered geometry, diagnostics and active recommendation;
2. create a deterministic Build Recipe;
3. persist the recipe with `APPROVED_EXECUTION_PENDING`;
4. execute only allowed changes;
5. create a candidate artifact version;
6. validate all acceptance criteria;
7. promote the candidate only on complete PASS;
8. rollback to the snapshot on any failure;
9. persist an Execution Receipt;
10. show the result panel.

No partial mutation may survive failed validation.

## Required runtime states

```yaml
recommendation_state:
  - PENDING_DECISION
  - APPROVED_FOR_EXECUTION
  - REJECTED_KEEP_CURRENT
  - DEFERRED
  - EXECUTION_IN_PROGRESS
  - APPLIED
  - EXECUTION_FAILED
  - ROLLED_BACK

recipe_state:
  - APPROVED_EXECUTION_PENDING
  - EXECUTING
  - VALIDATING
  - EXECUTED_PASS
  - EXECUTED_FAIL
  - ROLLED_BACK
  - STALE
  - SUPERSEDED
```

## Recipe identity

```yaml
recipe_id: RS-RCP-<recommendation-id>-v0.1
recipe_version: 0.1.0
status: APPROVED_EXECUTION_PENDING
source_recommendation_id: <id>
source_finding_ids: []
decision_state: APPROVED_FOR_EXECUTION
source_artifact_version: <version>
target_artifact_version: <next-version>
execution_state: NOT_STARTED
```

Repeated clicks after PASS must reopen the same receipt and must not reapply the change or create duplicate recipes.

A recipe becomes `STALE` if the recommendation, findings, decision or source artifact version changes before execution.

## Minimum Build Recipe contract

```yaml
identity:
  recipe_id:
  version:
  status: APPROVED_EXECUTION_PENDING
  created_at:
  source_recommendation_id:
  source_finding_ids: []

outcome:
  requested_result:
  affected_artifact:
  source_artifact_version:
  target_artifact_version:
  active_model_id:

approved_decision:
  decision: APPROVED_FOR_EXECUTION
  recorded_by: human
  recorded_at:

scope:
  allowed_changes: []
  prohibited_changes: []
  protected_artifacts: []

execution_plan:
  steps: []
  executing_capability: AEP
  transactional: true
  rollback_on_failure: true

validation:
  acceptance_criteria: []
  evidence_required: []
  failure_behavior: []

change_control:
  reversibility:
  rollback:
  source_snapshot_id:
```

## Current recommendation to implement

Recommendation:

```text
El artefact demo excede ligeramente una página (101%)
```

Expected outcome:

```text
page-fit <= 100%
pages = 1
```

### Allowed execution changes

The recipe may:

- tighten redundant non-factual narrative phrasing;
- remove duplicated explanatory wording;
- consolidate semantically equivalent non-evidence copy;
- preserve all governed facts, dates, metrics, attribution strength and evidence IDs;
- preserve ATS/branded semantic equivalence.

### Prohibited execution changes

Do not:

- change template width, page family or geometry;
- reduce typography;
- rewrite margins or padding;
- collapse or resize columns;
- alter brand tokens;
- remove, hide or downgrade evidence;
- invent facts or claims;
- weaken traceability;
- change diagnostic thresholds;
- select another template.

### Safe failure rule

If one-page fit cannot be achieved using only allowed non-factual copy tightening:

- rollback completely;
- do not remove evidence;
- return `REQUIRES_DECISION`;
- identify the smallest evidence-selection tradeoff requiring a new human decision.

## Required validation

PASS requires:

- page-fit ≤100%;
- pages = 1;
- template geometry identical to snapshot;
- same evidence IDs;
- same facts, dates, metrics and attribution strength;
- traceability remains 100%;
- no new critical ATS, layout or accessibility finding;
- ATS/branded semantic equivalence preserved;
- no `FALTA-DATO` or invented value introduced.

## Result panel

After the operation show:

- `Cambio aplicado` or `Cambio no aplicado`;
- recipe ID;
- execution status;
- source and target artifact versions;
- page-fit before and after;
- semantic before/after diff;
- protected-artifact confirmation;
- validation results;
- `Ver recipe`;
- `Copiar Markdown`;
- `Descargar .md`;
- close control.

A separate `Revertir cambio` control is optional, but if included it must create and execute an explicit rollback recipe. Never restore silently.

## Accessibility

- keyboard activation;
- visible focus state;
- visible in-progress state;
- double-submission blocked;
- result panel has accessible title and close control;
- success/failure announced through a live region;
- real semantic disabled behavior.

## Protected scope

Do not modify:

- `RS-TPL-001` or template source;
- Career OS / Resume Master;
- diagnostic thresholds;
- brand tokens;
- A7;
- HUB architecture outside A12;
- export implementation;
- candidate changes CC-01, CC-02 or CC-03;
- RS-004C or additional-template eligibility.

Only the active resume artifact content version may change within the approved recipe boundaries.

## Required tests

### EXE-RS-001 — Enablement

- no decision → disabled;
- `La mantengo` → disabled;
- `Luego` → disabled;
- `La tomo` with executable recommendation → enabled.

### EXE-RS-002 — Recipe and execution

- one click creates one recipe and one execution;
- complete contract fields;
- state passes through `EXECUTING` and `VALIDATING`;
- target version promoted only after PASS.

### EXE-RS-003 — Page-fit result

- demo moves from 101% to ≤100%;
- pages remain 1;
- same template geometry;
- same evidence IDs and material factual claims.

### EXE-RS-004 — Rollback

Force a failed validation and prove:

- candidate version not promoted;
- snapshot restored;
- state `ROLLED_BACK`;
- no partial mutation survives.

### EXE-RS-005 — Idempotency

Repeated click after PASS reopens the same receipt and does not duplicate or reapply.

### EXE-RS-006 — Stale protection

Changing recommendation context or source artifact version blocks stale execution.

### EXE-RS-007 — Decision transitions

Before execution, rejection/deferral disables. After execution, history is immutable and rollback requires a separate explicit action.

### EXE-RS-008 — Receipt and Markdown

Recipe and receipt are complete, downloadable and contain no hidden or invented data.

### EXE-RS-009 — No template mutation

Width, padding, grid, typography, margins and metadata are identical before and after.

## Required return package

Create:

```text
.avos/resume-studio/rs-004b-2g-return/
├── 00-README.md
├── execution-summary.md
├── files-changed.md
├── metrics.json
├── console-status.md
├── artifact-index.yaml
├── candidate-changes.yaml
├── sync-state.yaml
├── reports/enablement.md
├── reports/recipe-contract.md
├── reports/direct-execution.md
├── reports/page-fit-result.md
├── reports/non-template-mutation.md
├── reports/rollback.md
├── reports/idempotency.md
├── reports/stale-protection.md
├── reports/decision-transitions.md
├── artifacts/RS-RCP-REC-01-v0.1.md
├── artifacts/execution-receipt.md
└── screenshots/
    ├── apply-change-enabled.png
    ├── execution-in-progress.png
    ├── execution-pass.png
    └── execution-receipt.png
```

## Completion rule

The increment is complete only when:

- `La tomo` enables `Aplicar cambio`;
- the click creates and executes the governed recipe;
- the demo reaches one page through allowed content-only changes;
- no evidence or template property changes;
- failed validation rolls back;
- execution is idempotent;
- the complete return package is created.

Do not execute any later recipe after completing this return package. Wait for AVOS review.
