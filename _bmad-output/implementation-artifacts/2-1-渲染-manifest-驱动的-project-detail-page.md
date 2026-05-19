# Story 2.1: 渲染 Manifest 驱动的 Project Detail Page

Status: done

## Story

As a Pokopia 创作者,
I want 打开每个项目的详情页,
so that 我可以理解项目解决的问题、适合谁、当前状态和可用入口。

## Acceptance Criteria

1. Given 用户访问 `/projects/pokopia-decor-dex`, when Project Detail Page 渲染, then 页面展示 Decor Dex 的问题、目标用户、核心能力、当前状态和可用 Entrypoint, and 说明 Pokemon 色彩、色板、偏好词、装饰推荐和可分享静态详情页。
2. Given 用户访问 `/projects/pokopia-scene-editor`, when Project Detail Page 渲染, then 页面展示 Scene Editor 的问题、目标用户、核心能力、当前状态和可用 Entrypoint, and 说明 7x7 工作台、5x5 主体区、建筑层、素材实例、技能标记、预览和保存恢复。
3. Given Project Detail Page 使用 React Router, when route param 为 `projectId`, then 页面从 validated manifest 查找项目, and 不使用展示名、数字 id 或硬编码项目组件作为路由 key。
4. Given 用户在详情页顶部, when 需要返回或继续导航, then 页面提供返回 Home Page 的路径和清晰的主要/次要 Entrypoint, and heading hierarchy 稳定。

## Tasks / Subtasks

- [x] Task 1: 建立详情路由和 manifest lookup (AC: 3)
  - [x] 在 `App` 中接入 React Router，并挂载 `/projects/:projectId`。
  - [x] 使用 `projectId` route param 从 `projects` validated manifest 查找项目。
- [x] Task 2: 渲染 Project Detail Header 和核心内容 (AC: 1, 2, 4)
  - [x] 展示 name、status、tagline、problem、audiences、primaryUseCases、capabilities 和 detailSummary。
  - [x] 复用 EntrypointButton / EntrypointList 呈现主要和次要入口。
  - [x] 顶部提供返回 Home Page 的路径，并保持 h1/h2 层级稳定。
- [x] Task 3: 添加测试并验证 (AC: 1, 2, 3, 4)
  - [x] 覆盖 Decor Dex 与 Scene Editor 详情页内容和 route param lookup。
  - [x] 运行 `pnpm typecheck`、`pnpm test`、`pnpm lint`、`pnpm build`、`pnpm smoke`。

## Dev Notes

- Project Detail route 使用 `/projects/:projectId`，项目 id 必须来自 stable manifest id。[Source: `_bmad-output/planning-artifacts/architecture.md#routing`]
- Project Detail Header 顶部回答“这是什么、现在能否使用、下一步去哪”，入口操作与 Project Card 保持一致。[Source: `_bmad-output/planning-artifacts/ux-design-specification.md#project-detail-header`]
- Project Card 和 Project Detail Page 都从 Project Manifest 派生，避免项目专属组件。[Source: `_bmad-output/planning-artifacts/ux-design-specification.md#component-implementation-strategy`]
- Source Policy、relatedProjects 和 unknown route 的完整体验分别由 Story 2.2、2.3、2.4 承接，本 story 只确保详情页核心内容和路由骨架。

### Project Structure Notes

- 新增 route-level component 放在 `src/routes/`。
- 若需要 route helper，放在 `src/lib/`，不要把 lookup 逻辑写成项目专属分支。

### References

- `_bmad-output/planning-artifacts/epics.md#story-21-渲染-manifest-驱动的-project-detail-page`
- `_bmad-output/planning-artifacts/architecture.md#routing`
- `_bmad-output/planning-artifacts/ux-design-specification.md#project-detail-header`

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `pnpm typecheck`
- `pnpm test`
- `pnpm lint`
- `pnpm build`
- `pnpm smoke`
- Code review fix verification: `pnpm typecheck`, `pnpm test`, `pnpm lint`, `pnpm build`, `pnpm smoke`

### Completion Notes List

- App 已接入 React Router，并挂载 `/projects/:projectId` 到 manifest-driven Project Detail route。
- Project Detail Page 从 `projectId` route param 查找 validated manifest 项目，展示问题、目标用户、使用场景、能力、状态和详情说明。
- 详情页复用 EntrypointButton/EntrypointList，并排除当前详情页 self-link，避免重复 CTA。
- Playwright smoke 覆盖 Scene Editor 详情页直接访问。
- Code review fix: 详情页入口 helper 移到 `src/lib/detail-entrypoints.ts`，并在只有 self-link 时保留该入口以避免空入口崩溃。

### File List

- `_bmad-output/implementation-artifacts/2-1-渲染-manifest-驱动的-project-detail-page.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `src/App.tsx`
- `src/lib/detail-entrypoints.ts`
- `src/lib/project-routes.ts`
- `src/routes/ProjectDetailRoute.tsx`
- `src/routes/ProjectDetailRoute.test.tsx`
- `src/styles/layout.css`
- `tests/landing-page.spec.ts`

### Change Log

- 2026-05-19: Implemented manifest-driven Project Detail route, fixed review findings, and completed Story 2.1.
