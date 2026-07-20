# Claude Design ↔ AVOS Handoff — Personal Website v0.1

## Project

- AVOS project: `ARTURO-PERSONAL-001`
- Claude Design endpoint: `CLAUDE-DESIGN-ARTURO-SITE-001`
- Purpose: redesign and publish Arturo Villagomez's personal website from governed nodes shared with LinkedIn and GitHub.

## Canonical authority

Use the `.avos/` package in this repository as the project source of truth. The existing website copy is historical input, not canonical truth.

## Required context

Load and follow:

1. `.avos/project-manifest.yaml`
2. `.avos/context-package.yaml`
3. `.avos/canonical-nodes.yaml`
4. `.avos/decisions.yaml`
5. `.avos/observations.yaml`
6. `.avos/claude-design-endpoint.yaml`

## Design mandate

Create a public website that represents Arturo as a builder operating at the intersection of finance, operations and applied AI. Preserve a calm, editorial and technically credible identity. Do not invent claims, employers, metrics, partnerships, testimonials or project outcomes.

## Publication constraints

- Arturo approves final identity, claims and publication.
- Private enterprise knowledge is excluded by default.
- Third-party projects require explicit publication approval.
- Claims without approved evidence must be marked for validation or omitted.
- The site must not imply that every project or company mentioned is owned by Arturo.

## Required return package

After each meaningful design iteration, return:

- artifact name and version;
- source nodes used;
- decisions introduced;
- assumptions made;
- conflicts or missing context;
- candidate changes to canonical nodes;
- observation of what improved or remained unresolved;
- status: draft, review, approved, rejected or superseded.

The return package may be delivered as YAML or Markdown and must be committed under `.avos/` before AVOS treats it as synchronized evidence.

## Current synchronization state

`registered_not_verified`

The Claude Design project URL is registered, but the project is not considered synchronized until this handoff is loaded into the Claude Design project and a first return package is received.
