# Story 2.2: 展示 Source Policy、来源和数据新鲜度

Status: done

## Story

As a Pokopia 创作者或维护者,
I want 在详情页看到 Landing Page 读取什么、不读取什么和内容来源,
so that 我可以信任它没有越界读取相邻项目内部数据。

## Acceptance Criteria

1. Given Project Detail Page 渲染 Source Policy Block, when 用户查看项目来源说明, then 页面用“本页读取 / 本页不读取”的形式展示 `displaySource`、`initializedFrom`、`doesNotRead` 和 `dataFreshness`, and 路径、key 或 payload 名称使用 monospace 或等价清晰样式。
2. Given 用户查看 Decor Dex 详情页, when Source Policy 展开或显示摘要, then 页面说明 Landing Page 不读取 raw image source directories、full item manifest、image source directories、`dist/docs/pokopia_image_sources/**` 或 build-only diagnostics, and 页面说明项目摘要来自人工维护的 Project Manifest 和记录的初始化来源。
3. Given 用户查看 Scene Editor 详情页, when Source Policy 展开或显示摘要, then 页面说明 Landing Page 不读取 SceneDocument save payloads、localStorage UI preferences、export files、editor build artifacts 或未来内部数据集, and 除非未来显式提供 Public Project Manifest，否则不暗示读取编辑器运行时数据。
4. Given Project Card 或 Project Detail Page 展示 `dataFreshness`, when 数据是人工维护、构建期、project-manifest 或 unknown, then 页面用用户可读标签表达该来源新鲜度, and 不把人工维护状态描述成实时或自动同步。
5. Given manifest 包含 maintainer notes, when 详情页展示 notes, then notes 保持短备注用途, and 不替代项目 PRD 或长实现说明。

## Tasks / Subtasks

- [x] Task 1: 集中 data freshness / source display labels (AC: 1, 4)
  - [x] 在 domain label map 中定义 dataFreshness 和 displaySource 用户文案。
  - [x] 避免把 manual 描述为实时或自动同步。
- [x] Task 2: 渲染 Source Policy Block (AC: 1, 2, 3)
  - [x] 在详情页展示“本页读取 / 本页不读取”分组。
  - [x] `initializedFrom`、`doesNotRead` 中路径、key 或 payload 名称使用 monospace。
  - [x] Decor Dex 和 Scene Editor 的不读取边界按 manifest 内容可见。
- [x] Task 3: 渲染 maintainer notes 并补测试 (AC: 4, 5)
  - [x] 详情页展示 dataFreshness 和 maintainer notes。
  - [x] 测试覆盖 manual label、Decor Dex doesNotRead、Scene Editor doesNotRead、notes。
  - [x] 运行 `pnpm typecheck`、`pnpm test`、`pnpm lint`、`pnpm build`、`pnpm smoke`。

## Dev Notes

- Source Policy 和 doesNotRead 是产品信任边界，不能只作为内部注释。[Source: `_bmad-output/planning-artifacts/architecture.md#architecture-summary`]
- Source Policy Block 用“本页读取 / 本页不读取”表达，路径和 key 使用 monospace。[Source: `_bmad-output/planning-artifacts/ux-design-specification.md#source-policy-block`]
- dataFreshness label 必须集中复用，manual 不得暗示实时或自动同步。[Source: `_bmad-output/planning-artifacts/epics.md#story-22-展示-source-policy-来源和数据新鲜度`]

### Project Structure Notes

- Source Policy Block 作为可复用组件放在 `src/components/`。
- label map 继续放在 `src/domain/project-labels.ts`。

### References

- `_bmad-output/planning-artifacts/epics.md#story-22-展示-source-policy-来源和数据新鲜度`
- `_bmad-output/planning-artifacts/architecture.md#component-architecture`
- `_bmad-output/planning-artifacts/ux-design-specification.md#source-policy-block`

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

- 新增 SourcePolicyBlock，在详情页用“本页读取 / 本页不读取”展示 displaySource、initializedFrom、doesNotRead 和 dataFreshness。
- data freshness 与 display source 文案集中在 domain label map；manual 明确为人工维护，不描述为实时或自动同步。
- Decor Dex / Scene Editor 的 doesNotRead 边界和 maintainer notes 已在详情页可见，并由 route 测试覆盖。
- Code review fix: Decor Dex `doesNotRead` 增补 `docs/pokopia_image_sources/**`，并加测试断言。

### File List

- `_bmad-output/implementation-artifacts/2-2-展示-source-policy-来源和数据新鲜度.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `src/components/SourcePolicyBlock.tsx`
- `src/data/projects.ts`
- `src/domain/project-labels.ts`
- `src/routes/ProjectDetailRoute.tsx`
- `src/routes/ProjectDetailRoute.test.tsx`
- `src/styles/layout.css`

### Change Log

- 2026-05-19: Implemented Source Policy, data freshness and maintainer notes; fixed review finding and completed Story 2.2.
