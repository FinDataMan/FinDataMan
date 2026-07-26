# Public Landing Release Governance

## Repository role

`FinDataMan/FinDataMan` is the public release target for Arturo Villagomez's Landing.

It is **not** the editable Development Source for Arturo Personal OS, Resume Studio, Career OS, private evidence, or reusable personal-brand systems.

## Authorities

- AVOS governance: `FinDataMan/AVOS`
- Governing migration issue: `FinDataMan/AVOS#33`
- Private Development Source: `FinDataMan/arturo-personal-runtime`
- Public release target: `FinDataMan/FinDataMan`
- Future Career Portal: separate private repository, not yet created

## Release rule

Changes enter this repository only through a Deployment Release Packet that identifies:

- the approved Runtime source commit;
- the public target baseline;
- an explicit file allowlist and denylist;
- claim, privacy, contact and permission gates;
- validation evidence;
- rollback instructions;
- the dedicated branch and pull request.

No full-folder overwrite or automatic bidirectional synchronization is permitted.

## Public allowlist

Only approved public derivatives may be released, including:

- approved identity and positioning;
- evidence-backed or softened public claims;
- approved AV visual assets;
- anonymized or permission-approved work examples;
- approved professional contact channels;
- deterministic public-site code and release metadata.

## Denylist

This repository must not receive:

- raw Private Evidence;
- Resume Studio return bundles, fixtures or private state;
- Career Portal data, opportunity or application records;
- compensation, migration or admissions evidence;
- credentials or secrets;
- unapproved client, employer or venture claims;
- automatic writes from Runtime, AVOS or external design tools.

## Historical `.avos` records

The existing `.avos` directory records the pre-Runtime synchronization experiment and remains useful as migration history. It is non-authoritative unless a file explicitly states otherwise.

See `.avos/README.md` and `docs/migration/ARTURO-PERSONAL-OS-SPRINT-0.md`.

## Deployment

This governance change does not deploy or replace the current website. A Landing release requires a separate task, branch, pull request, preview and explicit approval.