# Story 1.1: Set up initial project from starter template

Status: done

## Story

As a Pokopia 工具维护者,
I want 一个独立的 Vite + React + TypeScript 应用基础和可校验的 Project Manifest,
so that Landing Page 可以从自身仓库数据渲染首批项目，而不依赖相邻项目内部文件。

## Acceptance Criteria

1. Given 当前仓库包含 `.agents/`、`_bmad/`、`_bmad-output/` 和 `docs/`, when 开发者合并 Vite + React + TypeScript scaffold, then `package.json`、`index.html`、`src/`、`public/`、`vite.config.ts` 和 `tsconfig*.json` 存在且不覆盖 BMAD 目录, and `pnpm dev`、`pnpm typecheck`、`pnpm test`、`pnpm build` 和 `pnpm preview` 脚本可用于后续开发。
2. Given Vite React TypeScript starter 在临时目录生成, when 开发者把 starter 文件合并到当前仓库并运行依赖安装, then `pnpm install` 能生成项目本地 lockfile, and 初始配置可通过 typecheck 或 build 的基础验证。
3. Given `src/data/projects.ts` 定义 Project Manifest v1, when manifest 被验证, then `pokopia-decor-dex` 和 `pokopia-scene-editor` 使用稳定 kebab-case `id` 并包含 PRD 要求的所有必填字段, and manifest validation 对缺失字段、重复 id 和非法 enum 输出包含 project id、字段路径和原因的错误。
4. Given Landing Page 在干净 checkout 中构建, when 相邻 Pokopia 仓库路径不存在, then typecheck/test/build 不会读取或要求相邻项目的 `dist/`、raw assets、SceneDocument payload 或 localStorage 数据, and 所有项目展示数据来自 validated manifest。

## Tasks / Subtasks

- [x] Task 1: 合并 Vite + React + TypeScript scaffold，不覆盖 BMAD 目录 (AC: 1, 2)
  - [x] 在临时目录生成 Vite `react-ts` starter。
  - [x] 合并 `package.json`、`index.html`、`src/`、`public/`、`vite.config.ts`、`tsconfig*.json` 和基础 lint 配置。
  - [x] 移除未使用的 starter 示例资源，保留可维护的最小 app baseline。
- [x] Task 2: 建立 Project Manifest v1 schema 和首批项目数据 (AC: 3, 4)
  - [x] 在 `src/domain/project-schema.ts` 定义 enum、Zod schema 和 TypeScript 类型。
  - [x] 在 `src/domain/project-validation.ts` 实现 manifest 校验、重复 id 和 unknown related project id 检查。
  - [x] 在 `src/data/projects.ts` 添加 `pokopia-decor-dex` 与 `pokopia-scene-editor` 人工维护记录。
- [x] Task 3: 配置基础验证脚本和测试 (AC: 1, 2, 3)
  - [x] 配置 Vitest + jsdom + Testing Library setup。
  - [x] 添加 schema validation 回归测试，覆盖缺失字段、重复 id、非法 enum 和 unknown related project id。
  - [x] 运行 `pnpm typecheck`、`pnpm test` 和 `pnpm build`。

### Review Findings

- [x] [Review][Patch] 每个项目必须恰好有一个 available primary Entrypoint。
- [x] [Review][Patch] `pnpm smoke` 必须有 Playwright config 和 smoke test 支撑。
- [x] [Review][Patch] `index.html` 语言应匹配中文页面内容。
- [x] [Review][Patch] available Entrypoint 不得指向相邻 checkout 路径。
- [x] [Review][Patch] local-only / disabled / tbd Entrypoint 必须有原因说明，disabled / tbd 不得包含 href。

## Dev Notes

- Starter 必须先在临时目录生成再合并，保留 `.agents/`、`_bmad/`、`_bmad-output/` 和未来 `docs/` 边界。[Source: `_bmad-output/planning-artifacts/architecture.md#Starter Template Evaluation`]
- MVP 数据源只能是 `src/data/projects.ts` 的人工维护 Project Manifest；不得读取、扫描、复制相邻 Pokopia 项目的 `dist/`、raw assets、SceneDocument payload 或 localStorage 数据。[Source: `_bmad-output/planning-artifacts/architecture.md#Data Architecture`]
- Manifest schema 使用 Zod + TypeScript inference，校验错误必须包含 project id、字段路径和原因。[Source: `_bmad-output/planning-artifacts/architecture.md#Core Architectural Decisions`]
- 初始记录必须包含 `pokopia-decor-dex` 和 `pokopia-scene-editor` 稳定 id，并保留 Scene Editor 未确认公开 URL 的真实状态。[Source: `_bmad-output/planning-artifacts/prds/prd-landing-page-2026-05-18/prd.md#10-initial-project-records`]

### Project Structure Notes

- 采用架构指定的 `src/data/`、`src/domain/`、`src/test/` 基础分层。
- Story 1.2 将在该 baseline 上添加正式 Home Page 组件、tokens 和 Project Card；本 story 不提前实现完整 Compact Trust Index。

### References

- `_bmad-output/planning-artifacts/epics.md#story-11-set-up-initial-project-from-starter-template`
- `_bmad-output/planning-artifacts/architecture.md#complete-project-directory-structure`
- `_bmad-output/planning-artifacts/implementation-readiness-report-2026-05-19.md#story-quality-assessment`

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `pnpm create vite@latest /tmp/pokopia-landing-vite --template react-ts --yes`
- `pnpm install`
- `pnpm typecheck`
- `pnpm test`
- `pnpm lint`
- `pnpm build`
- `pnpm smoke`

### Completion Notes List

- 合并 Vite React TypeScript scaffold，并添加项目本地 `pnpm-lock.yaml`。
- 建立 Project Manifest v1 schema、首批两个 Pokopia 项目记录和 build/test 阶段校验。
- 根据 code review 加强 entrypoint validation：primary 数量、available href 边界、local-only 说明、tbd/disabled href 禁止。
- 补充 Playwright 最小 smoke 配置和 baseline smoke test。
- 验证脚本通过：typecheck、Vitest schema tests、lint、production build、Playwright smoke。

### File List

- `.gitignore`
- `eslint.config.js`
- `index.html`
- `package.json`
- `playwright.config.ts`
- `pnpm-lock.yaml`
- `public/favicon.svg`
- `src/App.tsx`
- `src/data/projects.ts`
- `src/domain/project-schema.test.ts`
- `src/domain/project-schema.ts`
- `src/domain/project-validation.ts`
- `src/index.css`
- `src/main.tsx`
- `src/test/setup.ts`
- `tests/landing-page.spec.ts`
- `tsconfig.app.json`
- `tsconfig.json`
- `tsconfig.node.json`
- `vite.config.ts`
- `_bmad-output/implementation-artifacts/1-1-set-up-initial-project-from-starter-template.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

### Change Log

- 2026-05-19: Scaffolded Vite React TypeScript baseline and Project Manifest validation.
- 2026-05-19: Addressed code review findings for entrypoint validation, HTML language, and smoke gate.
