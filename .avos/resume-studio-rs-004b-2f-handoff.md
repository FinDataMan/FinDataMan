# Claude Design ↔ AVOS Handoff — Resume Studio RS-004B.2F

## Project

- AVOS authority: `FinDataMan/AVOS`
- AVOS branch: `resume-studio/rs-004b-2-stabilization`
- Claude Design endpoint: `CLAUDE-DESIGN-ARTURO-SITE-001`
- Claude Design project: `https://claude.ai/design/p/dc8e95cd-6d5c-486d-b083-917d7ed6d2b5`
- Target surface: native project HUB, card `A12 — Resume Studio`
- Execution recipe: `RS-004B.2F — Current Baseline Revalidation Recipe`

## Authority and scope

This is a non-mutating validation handoff.

Use the current native HUB implementation in Claude Design as the authoritative runtime surface for this execution. Do not create a standalone HUB, duplicate application or separate Resume Studio project.

Preserve:

- `A7` unchanged;
- Resume Studio as lightweight card `A12` inside the native HUB;
- the current template and its canonical geometry;
- all existing approved HUB behavior outside A12;
- Career OS and Resume Master content;
- approved brand tokens;
- the approved identity/contact policy `RS-POL-ICR-001`.

## Prohibitions

Do not:

- redesign or add templates;
- alter template typography, margins, columns, page dimensions or semantic structure;
- change Resume Engine behavior merely to pass validation;
- auto-correct ATS or Layout findings;
- invent identity/contact values;
- create a standalone HUB;
- modify A7;
- claim successful validation without evidence;
- treat screenshots alone as proof of non-visual behavior.

## Approved identity/contact policy

### Analysis and evaluation

If candidate identity/contact data is unavailable:

- analysis may proceed when all other governed inputs are valid;
- missing values may be omitted or explicitly shown as `UNAVAILABLE`;
- the limitation must remain visible;
- no value may be inferred or fabricated.

### External application and final export

The artifact must not be sealed or exported as application-ready until channel-required identity/contact data is present and validated.

## Required inspection

Inspect and record:

1. the current A12 Resume Studio implementation;
2. the current Resume Engine behavior available through A12;
3. the template currently rendered;
4. preview-controller behavior at multiple viewport widths;
5. current ATS Safety outputs;
6. current Layout Diagnostics outputs;
7. reading order and text extraction for ATS representation;
8. semantic equivalence between ATS and branded representations;
9. current export or download behavior;
10. missing identity/contact behavior under the approved two-stage policy.

## Required tests

### ART-RS-001 — Template preservation

Demonstrate that preview adaptation does not alter:

- page geometry;
- typography;
- margins;
- grid or columns;
- semantic structure;
- template metadata.

### ART-RS-002 — Viewport fit

Test at no fewer than three materially different viewport widths. Record:

- no global horizontal overflow;
- correct scaling and centering;
- correct scaled-height reservation;
- no overlap with surrounding controls;
- no duplicate responsive template.

### ATS-RS-001 — Complete-data artifact

Using complete identity/contact:

- ATS output is text extractable;
- reading order is correct;
- no unresolved placeholders remain;
- semantic equivalence with branded output is preserved.

### ATS-RS-002 — Missing-data artifact

Using a controlled fixture with identity/contact intentionally missing:

- no value is inferred;
- omission or `UNAVAILABLE` follows policy;
- analysis/evaluation may proceed when other inputs are valid;
- application-ready seal/export remains blocked.

### ATS-RS-003 — Multi-column behavior

Evaluate actual reading order rather than column count alone. Do not change the template during this test.

### LYT-RS-001 — Layout Diagnostics

Capture findings, severity, affected dimensions and recommendation candidates. Do not execute recommendations.

### EXP-RS-001 — Export boundary

Record whether:

- exported page family matches the current template;
- text remains extractable where required;
- export introduces no unapproved token or geometry change;
- final status reflects open reviews and validation results.

## Required return package

Commit the return package under:

```text
.avos/resume-studio/rs-004b-2f-return/
```

Required files:

```text
00-README.md
environment-and-versions.md
execution-summary.md
files-changed.md
metrics.json
console-status.md
artifact-index.yaml
observations.yaml
candidate-changes.yaml
sync-state.yaml
reports/template-preservation.md
reports/preview-fit.md
reports/ats-safety.md
reports/reading-order.md
reports/layout-diagnostics.md
reports/export-validation.md
reports/recommendation-register.yaml
screenshots/viewport-*.png
screenshots/export-*.png
```

Where a requested test cannot be performed, record:

- exact blocker;
- what was inspected;
- what remains unverified;
- no-success claim.

## Required sync-state result

Do not mark the endpoint `synchronized` automatically.

Return one of:

- `return_package_received`;
- `blocked`;
- `stale`.

AVOS will review the package before any promotion to `avos_reviewed` or `synchronized`.

## Completion rule

This handoff is complete only when the return package is committed and includes enough evidence to evaluate RS-DD-001 and RS-DD-008 without modifying the current runtime or template.
