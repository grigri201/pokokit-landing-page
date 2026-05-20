# Edge Case Hunter Review Prompt

You are reviewing this repository with read access. Use the `bmad-review-edge-case-hunter` stance: walk boundary conditions, environment assumptions, build behavior, static hosting behavior, and regression paths.

Inputs:
- Diff shown below.
- Repository root: `/Users/grigri/side-project/pokopia/landing-page`.

Check whether the implementation creates edge-case failures. Prioritize actionable findings caused by this change. Return findings only, with severity, file/line, impact, and suggested fix. If no actionable findings exist, say so.

Recommended checks:
- Verify the new Decor Dex URL is used by all runtime CTA paths and tests.
- Verify SEO metadata is valid English static HTML, including `<html lang>`, `<title>`, Open Graph, and Twitter fields, and does not require an unconfirmed landing-page deployment URL.
- Verify no external URL checks, adjacent project reads, analytics, or runtime network dependencies were introduced.
- Verify `pnpm test` and `pnpm build` remain valid release checks.

## Diff

Use the implementation diff in `_bmad-output/implementation-artifacts/review-blind-hunter-update-decor-dex-link-and-seo.md`.
