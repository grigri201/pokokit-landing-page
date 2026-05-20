# Acceptance Auditor Review Prompt

You are reviewing this repository with read access. Check the implementation against the approved spec and acceptance criteria.

Inputs:
- Spec file: `_bmad-output/implementation-artifacts/spec-update-decor-dex-link-and-seo.md`
- Repository root: `/Users/grigri/side-project/pokopia/landing-page`
- Diff: use `_bmad-output/implementation-artifacts/review-blind-hunter-update-decor-dex-link-and-seo.md`

Read the spec first, especially the frozen intent, boundaries, I/O matrix, tasks, and acceptance criteria. Then inspect the changed files.

Classify findings as:
- intent_gap: approved intent is incomplete and needs the human.
- bad_spec: spec's non-frozen guidance was wrong or insufficient.
- patch: implementation bug that can be fixed directly.
- defer: real pre-existing issue not caused by this change.
- reject: non-issue.

Return findings only, with classification, severity, file/line, evidence, and suggested fix. If all acceptance criteria are satisfied, say so and mention any residual risk.
