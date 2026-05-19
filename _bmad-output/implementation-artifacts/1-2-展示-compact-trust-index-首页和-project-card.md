# Story 1.2: 展示 Compact Trust Index 首页和 Project Card

Status: done

## Story

As a Pokopia 创作者,
I want 第一屏直接看到 Pokopia 工具定位和项目卡片,
so that 我可以快速判断每个工具的用途、状态和下一步入口。

## Acceptance Criteria

1. Given 用户打开 Home Page, when 第一屏渲染完成, then 页面展示简短生态目录定位、filter toolbar 和 Decor Dex / Scene Editor Project Card, and 页面不使用营销式长 hero，也不暗示统一账号、统一后端、云同步或跨项目数据合并。
2. Given Project Card 从 validated manifest 渲染, when 用户扫描卡片, then 每张卡片显示 name、tagline、type、status、capability tags、主要用户或核心场景，以及至少一个 Entrypoint, and 用户无需进入详情页即可判断工具当前能否直接打开。
3. Given Project Status 在卡片上展示, when 颜色不可用或用户使用色弱模拟, then 状态仍通过可见文字表达含义, and 状态徽标不只依赖颜色区分。
4. Given 首页使用设计 tokens 和语义化结构, when 项目名称、标签或按钮文本较长, then 内容可换行且不挤压 CTA, and 卡片内部链接或按钮分别可聚焦，卡片整体不包裹多个交互目标。

## Tasks / Subtasks

- [x] Task 1: 建立 Compact Trust Index 首页结构 (AC: 1, 4)
  - [x] 添加 `HomeRoute`，展示短定位、非营销式首屏和 filter toolbar 占位。
  - [x] 用 semantic `main` / `section` / list 结构组织项目列表。
- [x] Task 2: 实现 manifest-driven Project Card (AC: 2, 3, 4)
  - [x] 添加 `ProjectCard`、`StatusBadge`、`CapabilityTag` 和基础 Entrypoint 渲染。
  - [x] 使用集中 label maps 显示 project type/status，不在组件中硬编码项目分支。
  - [x] 保证卡片内交互元素独立可聚焦，卡片本身不整体包裹链接。
- [x] Task 3: 添加 CSS tokens 和组件测试 (AC: 1, 2, 3, 4)
  - [x] 添加 `src/styles/tokens.css`、`base.css`、`layout.css`。
  - [x] 用 Testing Library 验证首页短定位、两张卡片、状态文字、能力标签和入口语义。
  - [x] 运行 `pnpm typecheck`、`pnpm test`、`pnpm lint`、`pnpm build`、`pnpm smoke`。

### Review Findings

- [x] [Review][Patch] Project Card grid 必须使用语义列表结构。
- [x] [Review][Patch] Filter toolbar 预览必须具备明确语义，并由 manifest / label maps 派生。
- [x] [Review][Patch] 长项目名称、标签和 CTA 需要稳定换行，避免挤压状态和入口。
- [x] [Review][Patch] Available Entrypoint 渲染需要 href 安全兜底。

## Dev Notes

- UX 方向已锁定 Compact Trust Index：短定位 + filter toolbar + Project Card grid，不使用营销式长 hero。[Source: `_bmad-output/planning-artifacts/ux-design-specification.md#design-direction-decision`]
- Project Card 第一层必须包含 name、tagline、Project Status、Project Type、Capability Tags 和主要 Entrypoint；Source Policy 等维护者信息下沉到详情页。[Source: `_bmad-output/planning-artifacts/ux-design-specification.md#chosen-direction`]
- 组件必须从 validated manifest 派生，不使用项目展示名分支。[Source: `_bmad-output/planning-artifacts/architecture.md#component-boundaries`]
- 状态颜色只能辅助识别，状态必须有可见文字。[Source: `_bmad-output/planning-artifacts/ux-design-specification.md#status-colors`]

### Project Structure Notes

- 复用 Story 1.1 创建的 `src/data/projects.ts`、`src/domain/project-schema.ts` 和 `src/domain/project-validation.ts`。
- 本 story 不实现筛选状态变化；筛选控件的真实交互属于 Story 1.3。

### References

- `_bmad-output/planning-artifacts/epics.md#story-12-展示-compact-trust-index-首页和-project-card`
- `_bmad-output/planning-artifacts/architecture.md#frontend-architecture`
- `_bmad-output/planning-artifacts/ux-design-specification.md#component-strategy`

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `pnpm typecheck`
- `pnpm test`
- `pnpm lint`
- `pnpm build`
- `pnpm smoke`

### Completion Notes List

- 新增 Compact Trust Index 首页结构，第一屏包含短定位、筛选 toolbar 占位和 Project Card grid。
- 新增 manifest-driven `ProjectCard`、`StatusBadge`、`CapabilityTag`、`EntrypointButton`，复用集中 status/type label maps。
- 新增 CSS tokens/base/layout，并用 Testing Library 覆盖首页和卡片扫描语义。
- 根据 code review 将 Project Card grid 改为语义列表，filter toolbar 预览改为 manifest 派生的 disabled buttons，并补充长文本换行和 href 安全兜底。

### File List

- `_bmad-output/implementation-artifacts/1-2-展示-compact-trust-index-首页和-project-card.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `src/App.tsx`
- `src/components/CapabilityTag.tsx`
- `src/components/EntrypointButton.tsx`
- `src/components/ProjectCard.tsx`
- `src/components/StatusBadge.tsx`
- `src/domain/project-labels.ts`
- `src/lib/entrypoints.ts`
- `src/lib/filter-options.ts`
- `src/main.tsx`
- `src/routes/HomeRoute.test.tsx`
- `src/routes/HomeRoute.tsx`
- `src/styles/base.css`
- `src/styles/layout.css`
- `src/styles/tokens.css`

### Change Log

- 2026-05-19: Implemented Compact Trust Index homepage and manifest-driven Project Cards.
- 2026-05-19: Addressed code review findings for semantic list, filter preview, text wrapping, and href safety.
