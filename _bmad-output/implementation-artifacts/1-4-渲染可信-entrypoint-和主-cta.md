# Story 1.4: 渲染可信 Entrypoint 和主 CTA

Status: done

## Story

As a Pokopia 创作者,
I want 每个项目入口明确说明真实动作和可用性,
so that 我不会点击坏链接或误以为开发中工具已经可用。

## Acceptance Criteria

1. Given Project Card 有多个 Entrypoint, when 页面选择主 CTA, then Decor Dex 在配置公开 tool URL 时展示可用工具入口, and Scene Editor 没有确认公开部署 URL 时不展示伪装成可用工具的启动 CTA。
2. Given Entrypoint availability 是 `disabled`、`local-only` 或 `tbd`, when 入口渲染在卡片或入口区, then 页面展示原因或说明, and 不把不可用入口渲染成空链接或可点击的 public tool 按钮。
3. Given Entrypoint kind 是 `tool`、`detail`、`repo`、`docs` 或 `external`, when 用户查看入口按钮或链接, then 文案和样式区分“打开工具”“查看详情”“查看仓库”“查看规划文档”和外部相关项目, and repo/docs 不使用“打开工具”文案。
4. Given 用户点击外部公开 URL, when 链接打开相关项目或离开 Landing Page, then 链接文本或辅助说明提示目标, and 外部链接使用安全的 `rel="noopener noreferrer"`。

## Tasks / Subtasks

- [x] Task 1: 强化 Entrypoint selection 和 kind/availability 映射 (AC: 1, 2, 3)
  - [x] 在 domain/label map 中集中定义 kind 和 availability 文案。
  - [x] 明确 primary CTA 选择逻辑：只选择 `available` primary，不把 `tbd` tool 作为可点击入口。
- [x] Task 2: 渲染主 CTA 和次级 Entrypoints (AC: 1, 2, 3, 4)
  - [x] Project Card 展示 primary Entrypoint 和必要的 secondary Entrypoint 状态。
  - [x] 不可用入口用 note/status 呈现，不渲染空链接。
  - [x] 外链展示目标说明和 `rel="noopener noreferrer"`。
- [x] Task 3: 添加测试并验证 (AC: 1, 2, 3, 4)
  - [x] 覆盖 Decor Dex public tool、Scene Editor detail primary、tbd tool note、repo/docs label 语义和外链安全。
  - [x] 运行 `pnpm typecheck`、`pnpm test`、`pnpm lint`、`pnpm build`、`pnpm smoke`。

## Dev Notes

- Entrypoint availability 语义：`available` 渲染可操作链接；`disabled` / `tbd` 展示原因；`local-only` 明确开发者路径，不呈现为公开工具入口。[Source: `_bmad-output/planning-artifacts/architecture.md#entrypoint-availability-patterns`]
- Button/Link label 必须说明真实动作，不使用泛化“查看”或“打开”替代具体含义。[Source: `_bmad-output/planning-artifacts/ux-design-specification.md#button-hierarchy`]
- Scene Editor 没有确认公开部署 URL 时不得展示伪装成可用工具的启动 CTA。[Source: `_bmad-output/planning-artifacts/epics.md#story-14-渲染可信-entrypoint-和主-cta`]

### Project Structure Notes

- 扩展现有 `EntrypointButton` / `ProjectCard`，不要新增项目专属分支。
- Story 2 会在详情页复用同一套 EntrypointList/SourcePolicy 模式；本 story 先在卡片层保证可信入口。

### References

- `_bmad-output/planning-artifacts/epics.md#story-14-渲染可信-entrypoint-和主-cta`
- `_bmad-output/planning-artifacts/architecture.md#entrypoint-availability-patterns`
- `_bmad-output/planning-artifacts/ux-design-specification.md#entrypoint-button`

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

- Entrypoint kind/availability 文案已集中到 domain label map，Project Card 使用同一套 label 呈现工具、详情、仓库、文档和外部链接入口。
- Primary CTA 选择只取 `available` 入口；Scene Editor 的 `tbd` 工具入口和本地 docs/repo 入口以 note/status 呈现，不生成可点击 public tool 链接。
- 外部 Decor Dex 工具入口保留目标提示并使用 `target="_blank"` 与 `rel="noopener noreferrer"`。
- Code review fixes: 外链目标提示改为按 entrypoint kind 映射；协议相对 URL 在 schema 和运行时 helper 中都被拒绝；primary fallback 不再静默提升任意 available 入口。

### File List

- `_bmad-output/implementation-artifacts/1-4-渲染可信-entrypoint-和主-cta.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `src/components/EntrypointButton.tsx`
- `src/components/EntrypointButton.test.tsx`
- `src/components/EntrypointList.tsx`
- `src/components/ProjectCard.tsx`
- `src/domain/project-labels.ts`
- `src/domain/project-schema.test.ts`
- `src/domain/project-schema.ts`
- `src/lib/entrypoints.test.ts`
- `src/lib/entrypoints.ts`
- `src/routes/HomeRoute.test.tsx`
- `src/styles/layout.css`

### Change Log

- 2026-05-19: Implemented trustworthy entrypoint rendering, fixed code review findings, and completed Story 1.4.
