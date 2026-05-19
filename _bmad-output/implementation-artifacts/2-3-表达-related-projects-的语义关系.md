# Story 2.3: 表达 Related Projects 的语义关系

Status: done

## Story

As a 回访或分享用户,
I want 理解 Decor Dex 和 Scene Editor 之间的关系,
so that 我不会误以为它们已经合并、同步或共享运行时数据。

## Acceptance Criteria

1. Given Scene Editor manifest 记录 relatedProjects 指向 Decor Dex, when 用户查看 Scene Editor 详情页, then 页面展示 Decor Dex 的 related project link 和关系说明, and 关系被描述为 key semantics / reference relationship，而不是 runtime merge。
2. Given related project id 指向存在的项目, when Related Project Link 渲染, then 链接跳转到目标 Project Detail Page, and link text 同时说明目标项目和关系。
3. Given manifest 中存在缺失或拼写错误的 related project id, when validation 运行, then 校验失败并指出源项目 id、字段路径和缺失目标 id, and 不在生产 UI 中静默隐藏 broken relationship。
4. Given 详情页文案描述项目关系, when 用户阅读关系说明, then 文案使用“语义关联”“参考关系”“独立工具”等措辞, and 不使用会暗示运行时合并的“同步”“集成”“共享数据”等措辞。

## Tasks / Subtasks

- [x] Task 1: 增加 related project 解析 helper (AC: 2, 3)
  - [x] 从 validated manifest 解析 related project target。
  - [x] 复用现有 validation 的 unknown related project id 失败行为。
- [x] Task 2: 渲染 Related Project Link (AC: 1, 2, 4)
  - [x] 在详情页 relatedProjects 区域展示目标项目、关系说明和 detail link。
  - [x] 文案使用“语义关联”“参考关系”“独立工具”，避免运行时合并暗示。
- [x] Task 3: 添加测试并验证 (AC: 1, 2, 3, 4)
  - [x] 覆盖 Scene Editor -> Decor Dex 关系 link 和关系文案。
  - [x] 覆盖 unknown related project id validation。
  - [x] 运行 `pnpm typecheck`、`pnpm test`、`pnpm lint`、`pnpm build`、`pnpm smoke`。

## Dev Notes

- relatedProjects 必须解析到项目详情页，缺失目标由 validation 暴露，不在生产 UI 静默隐藏。[Source: `_bmad-output/planning-artifacts/epics.md#story-23-表达-related-projects-的语义关系`]
- Related Project Link 文案必须说明目标和关系，并避免“同步”“集成”“共享数据”。[Source: `_bmad-output/planning-artifacts/ux-design-specification.md#related-project-link`]
- Component 放在 `src/components/`，解析 helper 放在 `src/lib/`，继续使用 stable project id 路由。

### References

- `_bmad-output/planning-artifacts/epics.md#story-23-表达-related-projects-的语义关系`
- `_bmad-output/planning-artifacts/ux-design-specification.md#related-project-link`
- `_bmad-output/planning-artifacts/architecture.md#component-architecture`

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `pnpm typecheck`
- `pnpm test`
- `pnpm lint`
- `pnpm build`
- `pnpm smoke`
- Code review verification: `pnpm typecheck`, `pnpm test`, `pnpm lint`, `pnpm build`, `pnpm smoke`

### Completion Notes List

- 新增 related project resolver，从 stable manifest id 解析目标项目。
- 新增 RelatedProjectLinks，在详情页展示目标项目、关系说明和 detail link。
- 关系说明明确使用语义关联、参考关系、独立工具边界，不把关系描述为运行时合并。
- 测试覆盖 Scene Editor -> Decor Dex link 和 unknown related project id validation。

### File List

- `_bmad-output/implementation-artifacts/2-3-表达-related-projects-的语义关系.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `src/components/RelatedProjectLinks.tsx`
- `src/lib/related-projects.ts`
- `src/lib/related-projects.test.ts`
- `src/routes/ProjectDetailRoute.tsx`
- `src/routes/ProjectDetailRoute.test.tsx`
- `src/styles/layout.css`

### Change Log

- 2026-05-19: Implemented related project links, passed review, and completed Story 2.3.
