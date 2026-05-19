# Story 3.1: 验证新增第三个 Project Card 的扩展路径

Status: done

## Story

As a Pokopia 工具维护者,
I want 新增合法 Project Card 后首页、详情页和筛选自动工作,
so that 未来接入第三个 Pokopia 工具时不需要重写页面逻辑。

## Acceptance Criteria

1. Given 维护者在 Project Manifest 中新增一张合法第三项目卡片, when validation、Home Page 和 Project Detail Page 渲染, then 第三项目出现在首页列表、状态筛选、能力标签筛选和详情路由中, and 不需要新增项目专属 route component 或 Project Card branch。
2. Given 第三项目被其他项目通过 relatedProjects 引用, when 相关项目链接解析, then 链接使用稳定 project id 指向对应详情页, and 缺失目标 id 在验证阶段失败。
3. Given 开发者检查组件实现, when Project Card、Detail Page、Entrypoint 和 Related Project 渲染项目差异, then 差异来自 manifest 数据和集中 label maps, and UI 组件不使用项目展示名硬编码分支。

## Tasks / Subtasks

- [x] Task 1: 添加第三项目 fixture 扩展测试 (AC: 1, 3)
  - [x] 覆盖 manifest validation 接受第三项目。
  - [x] 覆盖 status/capability filter options 自动包含第三项目状态和能力。
- [x] Task 2: 覆盖详情和 relatedProjects 扩展路径 (AC: 1, 2, 3)
  - [x] 测试 ProjectCard 对第三项目无项目专属分支。
  - [x] 测试 helper 使用 stable id 解析第三项目 relatedProjects。
  - [x] 测试 unknown related project id 已在 validation 失败。
- [x] Task 3: 验证并记录 (AC: 1, 2, 3)
  - [x] 运行 `pnpm typecheck`、`pnpm test`、`pnpm lint`、`pnpm build`、`pnpm smoke`。

## Dev Notes

- 本 story 重点是证明扩展路径，不一定要把第三项目加入生产 manifest。
- Project Card、Detail Page、Entrypoint 和 Related Project 差异应来自 manifest 数据和集中 label maps。[Source: `_bmad-output/planning-artifacts/epics.md#story-31-验证新增第三个-project-card-的扩展路径`]
- 未来新增项目不应新增项目专属 route component 或 Project Card branch。[Source: `_bmad-output/planning-artifacts/architecture.md#implementation-standards`]

### References

- `_bmad-output/planning-artifacts/epics.md#story-31-验证新增第三个-project-card-的扩展路径`
- `_bmad-output/planning-artifacts/architecture.md#critical-implementation-rules`
- `_bmad-output/planning-artifacts/ux-design-specification.md#uj-3-pokopia-工具维护者新增第三个项目`

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

- 新增第三项目测试 fixture，通过真实 manifest validation 后注入 HomeRoute / ProjectDetailRoute。
- HomeRoute / ProjectDetailRoute 支持可选 `projectList` 注入，生产默认仍使用 validated manifest。
- 测试覆盖第三项目出现在首页、状态筛选、能力筛选、详情路由和 related project link 中。
- `pnpm lint` 初次与 `pnpm smoke` 并发运行时遇到 `test-results` 目录清理竞争，build/smoke 完成后单独重跑 lint 通过。

### File List

- `_bmad-output/implementation-artifacts/3-1-验证新增第三个-project-card-的扩展路径.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `src/domain/project-schema.test.ts`
- `src/lib/filters.test.ts`
- `src/lib/related-projects.test.ts`
- `src/routes/HomeRoute.tsx`
- `src/routes/HomeRoute.test.tsx`
- `src/routes/ProjectDetailRoute.tsx`
- `src/routes/ProjectDetailRoute.test.tsx`
- `src/test/project-fixtures.ts`

### Change Log

- 2026-05-19: Added third-project extensibility fixture/tests, passed review, and completed Story 3.1.
