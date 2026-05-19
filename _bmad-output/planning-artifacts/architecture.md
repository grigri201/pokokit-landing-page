---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - _bmad-output/planning-artifacts/briefs/brief-landing-page-2026-05-18/brief.md
  - _bmad-output/planning-artifacts/briefs/brief-landing-page-2026-05-18/addendum.md
  - _bmad-output/planning-artifacts/briefs/brief-landing-page-2026-05-18/.decision-log.md
  - _bmad-output/planning-artifacts/prds/prd-landing-page-2026-05-18/prd.md
  - _bmad-output/planning-artifacts/prds/prd-landing-page-2026-05-18/addendum.md
  - _bmad-output/planning-artifacts/prds/prd-landing-page-2026-05-18/reconcile-brief.md
  - _bmad-output/planning-artifacts/prds/prd-landing-page-2026-05-18/reconcile-addendum.md
  - _bmad-output/planning-artifacts/prds/prd-landing-page-2026-05-18/review-rubric.md
  - _bmad-output/planning-artifacts/prds/prd-landing-page-2026-05-18/.decision-log.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
  - _bmad-output/planning-artifacts/ux-design-directions.html
workflowType: 'architecture'
project_name: 'landing-page'
user_name: 'Grigri'
date: '2026-05-18'
lastStep: 8
status: complete
completedAt: '2026-05-18'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
PRD 定义了 30 条功能需求，主要分为 7 组：Ecosystem Home Page、Project Manifest and Schema、Project Entrypoints、Project Detail Pages、Data Boundary and Independence、Content Governance、Accessibility and Responsive Behavior。架构上，这意味着 MVP 应围绕一个稳定的 Project Manifest 数据模型、可复用 Project Card/Detail 渲染、状态与能力筛选、入口可用性表达、详情路由和构建期 schema 校验展开。

**Non-Functional Requirements:**
关键 NFR 是独立静态构建、数据最小化、禁止扫描相邻项目内部产物、可访问性、移动端可读性、可维护性、构建期校验、优雅降级、来源可审计、不能暗示实时同步、链接类型清晰，以及小规模 manifest 下的静态渲染性能目标。

**Scale & Complexity:**
项目没有账号、后端、实时协作、多租户、云同步或运行时外部数据依赖。复杂度主要来自 manifest schema、路由、状态/入口语义一致性、可访问性和强数据边界。

- Primary domain: 静态前端 Web / manifest-driven directory
- Complexity level: low-to-medium
- Estimated architectural components: 10-12 个核心组件/模块，包括 manifest schema、manifest data、validation、Home route、Project Detail route、filter state、Project Card、Status Badge、Entrypoint rendering、Source Policy block、Related Projects、not-found/empty states。

### Technical Constraints & Dependencies

- MVP 必须能只依赖 landing-page 仓库独立构建。
- Project Manifest 是 v1 展示事实来源，且应人工维护。
- 不得读取或复制 `../pokopia-color-pattern` 与 `../pokopia-scene-editor` 的 `dist/`、raw assets、SceneDocument payload、localStorage preferences 或 build-only diagnostics。
- Public Project Manifest 是未来扩展，不是 MVP 依赖。
- Scene Editor 公开 URL 未确认，必须表达为 in-development / tbd / disabled，而不是可打开工具。
- Decor Dex 公开入口暂按 PRD 假设处理，但应可配置。
- 筛选持久化、截图、link checking、正式公开域名仍是后续决策，不应阻塞架构起步。
- UX 已锁定 Compact Trust Index：第一屏短定位 + filter toolbar + Project Card grid；不是营销式长 hero。
- 需要 WCAG 2.1 AA 方向的键盘、对比度、状态文字和响应式验证。

### Cross-Cutting Concerns Identified

- Manifest schema 与 UI label 映射必须集中维护，避免卡片、详情页、校验错误之间语义漂移。
- Project Status、Entrypoint Availability、dataFreshness、sourcePolicy、relatedProjects 都需要类型约束和构建期校验。
- 路由应由稳定 project id 派生，未知 project id 必须进入 not-found recovery。
- 筛选逻辑需要明确 AND 组合，并支持空状态和清除筛选。
- 所有状态和入口可用性必须同时用文本和视觉表达，不能只靠颜色或 disabled 样式。
- 外链、repo、docs、detail、tool 入口必须有不同语义和文案。
- Source Policy 和 doesNotRead 是产品信任边界，不能只作为内部注释。
- 未来新增第三个项目时，不应新增项目专属页面组件。

## Starter Template Evaluation

### Primary Technology Domain

Primary domain 是静态前端 Web / manifest-driven directory。MVP 不需要后端 API、账号、实时数据、SSR 或运行时外部数据请求；核心是从仓库内 Project Manifest 渲染 Home Page、Project Detail Page、筛选控件、状态/入口说明和维护者可审计的 Source Policy。

### Starter Options Considered

**Vite + React + TypeScript (`react-ts`)**

- 官方 Vite starter 当前提供 `react-ts` 模板，支持快速 dev server、production static build、现代浏览器目标和轻量配置。
- 与相邻 Pokopia Scene Editor 的 React/Vite/TypeScript 技术栈一致，也接近 Decor Dex 的 Vite 静态构建模型。
- 适合 Compact Trust Index 的组件化 UX：Project Card、Status Badge、Capability Tag、Entrypoint Button、Project Detail Header、Source Policy Block、Related Project Link 都可以作为纯 React 组件从 manifest 派生。
- 不默认引入后端、server routing、RSC、复杂数据层或设计系统，符合目录页“轻量但可维护”的边界。
- 缺点是 Vite starter 不自带路由、schema validation 或测试栈；这些应作为显式架构决策补充，而不是隐藏在 starter 里。

**Astro**

- Astro 很适合静态内容站和预生成详情页，天然适合 `/projects/{projectId}` 这种静态路径。
- 但本项目第一版的核心不是长内容 CMS，而是组件化工具目录、筛选交互和 manifest-driven UI；同时相邻 Pokopia 前端主要已有 Vite/React 惯性。
- 若未来需要 SEO-heavy 多内容页面或大量 markdown 内容集合，可重新评估 Astro；MVP 不选择它作为默认 starter。

**Next.js App Router**

- Next.js 官方 starter 默认包含 TypeScript、Tailwind、ESLint、App Router 和 Turbopack。
- 对本项目来说，这会引入 server/app-router mental model 和部署假设；MVP 没有 SSR、API routes、auth、image optimization 或 dynamic data fetching 需求。
- 不选择 Next.js，避免把静态目录页升级成 full-stack framework。

**React Router Framework Starter**

- React Router framework starter 当前有官方 `create-react-router` 路径，适合需要 framework conventions、data routes 或未来 SSR/预渲染能力的 React 应用。
- MVP 只需要少量站内详情路由和静态 manifest 渲染，不需要先采用 framework mode。
- 选择 Vite React starter 后，可以按需要添加 React Router declarative/data APIs，而不把整个项目启动在 React Router framework template 上。

### Selected Starter: Vite + React + TypeScript

**Rationale for Selection:**

选择 Vite + React + TypeScript 是为了保持 MVP 静态、可独立构建、类型安全、组件化，并与相邻 Pokopia 项目技术栈保持一致。它不会默认引入 backend、server rendering 或外部数据 ingestion，也不会把未确认的部署平台绑定进架构。它为 AI agent 后续实现提供一个熟悉且约束清楚的前端基础：manifest 数据模型、组件、路由和校验逻辑都可以在仓库内显式定义。

**Initialization Command:**

```bash
pnpm create vite@latest /tmp/pokopia-landing-vite --template react-ts --no-interactive
```

当前仓库已经包含 `.agents/`、`_bmad/`、`_bmad-output/` 和 `docs/`，第一条 implementation story 不应在仓库根目录直接强制覆盖。应先在临时目录生成 starter，然后把 `package.json`、`index.html`、`src/`、`public/`、`vite.config.ts`、`tsconfig*.json` 等 scaffold 文件合并进当前仓库，保留 BMAD 与 planning artifacts。

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
TypeScript + React，浏览器端静态应用，无 Node.js runtime dependency at production serving time。Vite 官方文档当前要求 Node.js 20.19+ 或 22.12+。

**Styling Solution:**
Starter 只提供基础 CSS，不引入 Tailwind 或 CSS-in-JS。项目应基于 UX spec 定义集中 design tokens 和普通 CSS / component-scoped CSS，避免一开始引入重设计系统。

**Build Tooling:**
Vite 提供 dev server、HMR、`vite build` production static assets 和 `vite preview`。MVP 构建输出应是可由静态 host 服务的文件。

**Testing Framework:**
Starter 不内置测试。架构应显式添加 Vitest + Testing Library 覆盖 manifest validation、filter logic、route resolution 和关键组件状态；后续可用 Playwright 做 smoke/a11y-oriented browser checks。

**Code Organization:**
Starter 只给基础 `src/` 结构。项目应建立以下目录约定：

- `src/data/projects.ts` 或 `src/data/projects.json`：人工维护 Project Manifest。
- `src/domain/project-schema.ts`：Project Card schema、enum、Zod validation 和 label maps。
- `src/routes/`：Home、Project Detail、Not Found route-level components。
- `src/components/`：Project Card、Status Badge、Capability Tag、Entrypoint Button、Source Policy Block、Related Project Link 等纯 UI 组件。
- `src/lib/`：filtering、route generation、entrypoint selection、related project resolution。

**Development Experience:**
Starter 提供快速本地 dev loop。第一条 implementation story 应在合并 starter 后补齐 `typecheck`、`test`、`build`、`preview` 脚本，并保证 build 不读取相邻项目目录。

**Verified Current Sources:**

- Vite Getting Started: https://vite.dev/guide/
- Astro Installation: https://docs.astro.build/en/install-and-setup/
- Next.js Installation: https://nextjs.org/docs/app/getting-started/installation
- React Router framework/declarative installation: https://reactrouter.com/start/framework/installation and https://reactrouter.com/start/declarative/installation

**Note:** Project initialization using this starter merge should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**

- Use Vite + React + TypeScript as the static frontend foundation.
- Use an in-repo Project Manifest as the only MVP data source.
- Use Zod + TypeScript as the manifest schema and validation boundary.
- Do not use a database, backend API, authentication, server rendering, or runtime ingestion from adjacent Pokopia projects in MVP.
- Use project `id` as the stable route key for `/projects/:projectId`.
- Configure static deployment with SPA fallback to `index.html`, so detail routes can be opened directly.

**Important Decisions (Shape Architecture):**

- Use URL search params for status/capability filter state in MVP.
- Use plain CSS with centralized design tokens, not Tailwind/CSS-in-JS, for the first implementation.
- Use Vitest + Testing Library for unit/component tests and Playwright for browser smoke checks.
- Use pnpm and Node.js 24 LTS for local development and CI.

**Deferred Decisions (Post-MVP):**

- Public Project Manifest ingestion is deferred until an upstream project provides a stable public manifest contract.
- Runtime link health checking is deferred; it can be an optional CI/reporting task after deployment exists.
- Screenshots, update timestamps, CI badges, analytics, and click tracking are deferred until sources and privacy posture are defined.
- SEO-heavy static prerendering or migration to Astro/React Router framework is deferred unless route, SEO, or content volume requirements outgrow the simple Vite SPA.

### Data Architecture

**Decision: Project Manifest v1 as a static TypeScript module.**

The MVP data source is a top-level manifest object in the landing-page repository, recommended at `src/data/projects.ts`:

```ts
export const projectManifest = {
  version: 1,
  projects: [
    // ProjectCard records
  ],
} as const;
```

The manifest is manually maintained and initialized from planning artifacts. It must not import, scan, parse, or copy adjacent project runtime data, raw assets, `dist/`, SceneDocument payloads, localStorage data, or build-only diagnostics.

**Decision: Zod-backed validation and TypeScript inference.**

Zod validates the manifest and exports inferred types for runtime rendering. Validation should run during build/test, and failures must identify project id and invalid field path.

Current npm registry versions checked on 2026-05-18:

- `zod`: 4.4.3
- `typescript`: 6.0.3

**Decision: Derived UI data comes from validated manifest.**

Status filter options, capability tags, related-project targets, primary entrypoint selection, and detail route lists must be derived from the validated manifest or centralized label maps. Avoid duplicating status/capability arrays in components.

**Decision: No migration layer in MVP.**

Because v1 is manually maintained and tiny, no database migrations are needed. The top-level `version: 1` exists to make future manifest evolution explicit.

**Decision: No runtime cache.**

All data ships in the static bundle. Filtering can be computed in-memory from the manifest; memoization is allowed but not required until project count grows.

### Authentication & Security

**Decision: No authentication or authorization in MVP.**

Landing Page is a public static directory. There are no accounts, roles, private documents, user-specific state, cloud sync, comments, favorites, or protected routes.

**Decision: No secrets in frontend or repository.**

Do not put deployment tokens, analytics secrets, private URLs, or API keys in the manifest or Vite environment variables. Any future public URLs must be safe to expose.

**Decision: Entrypoint safety is enforced by schema and rendering rules.**

Entrypoints must have `kind`, `availability`, label, href, and optional note. External links render with clear labels and `rel="noopener noreferrer"`. `disabled`, `tbd`, and `local-only` entrypoints must show explanation text and must not behave like broken public tool links.

**Decision: Data-boundary safety is a security concern.**

Build scripts and app code must not read adjacent Pokopia project internals. If a future Public Project Manifest is introduced, it must be treated as an explicit adapter with its own schema and fallback path, not as permission to scan arbitrary upstream files.

### API & Communication Patterns

**Decision: No MVP API layer.**

There is no REST, GraphQL, server action, RPC, WebSocket, or polling layer. Home Page and Project Detail Page render from the local manifest.

**Decision: Future external data uses adapter boundaries.**

If a future project exposes `project.manifest.json`, Landing Page can add a `src/adapters/public-project-manifest/` module that validates, normalizes, and falls back to manual manifest data. This is post-MVP and must not become a generic file-system scanner.

**Decision: Error handling is split by phase.**

- Build/test phase: invalid manifest fields, unknown related project ids, invalid entrypoint enum values, duplicate project ids, and missing required fields fail validation.
- Runtime phase: unknown `/projects/:projectId` shows Not Found with valid project links; empty filters show an empty state with clear reset action; unavailable entrypoints show status notes.

### Frontend Architecture

**Decision: React 19 + Vite SPA with explicit route modules.**

Current npm registry versions checked on 2026-05-18:

- `vite`: 8.0.13
- `@vitejs/plugin-react`: 6.0.2
- `react`: 19.2.6
- `react-dom`: 19.2.6
- `react-router`: 7.15.1

The app uses Vite for static build output and React for component composition. Route-level components should live under `src/routes/` and domain/data logic should stay outside UI components.

**Decision: React Router declarative/data route layer, not framework mode.**

Use React Router as an app dependency for:

- `/`
- `/projects/:projectId`
- `*` Not Found

Do not use `create-react-router` framework mode in MVP. The app remains a Vite SPA. Static deployment must serve `index.html` for unknown paths so direct detail-route refresh works. If a selected host cannot support fallback, add a deploy adapter such as a generated `404.html` copy of `index.html`; do not change product routes to hash URLs unless deployment constraints force it.

**Decision: Filter state lives in URL search params.**

Status and capability filters use URL search params, for example:

- `?status=available`
- `?capability=建筑层`

Multiple filters follow the PRD's AND semantics. No `localStorage` persistence is used for filters in MVP.

**Decision: Component architecture is manifest-driven.**

Core components:

- `ProjectCard`
- `StatusBadge`
- `CapabilityTag`
- `EntrypointButton`
- `FilterToolbar`
- `ProjectDetailHeader`
- `EntrypointList`
- `SourcePolicyBlock`
- `RelatedProjectLink`
- `EmptyState`
- `NotFoundState`

Components must not hardcode project-specific branches. Variation comes from manifest data and centralized label/availability maps.

**Decision: Styling uses CSS tokens and semantic class structure.**

Use a small CSS foundation:

- `src/styles/tokens.css`
- `src/styles/base.css`
- component or route CSS files as needed

Do not introduce Tailwind, CSS-in-JS, animation frameworks, or a large design-system dependency in MVP. The UX direction already defines the visual foundation and Compact Trust Index layout.

**Decision: Testing stack.**

Current npm registry versions checked on 2026-05-18:

- `vitest`: 4.1.6
- `@testing-library/react`: 16.3.2
- `@testing-library/jest-dom`: 6.9.1
- `jsdom`: 29.1.1
- `@playwright/test`: 1.60.0

Use Vitest for schema, derived data, filtering, route resolution, and component behavior. Use Testing Library queries by role/name to reinforce accessibility. Use Playwright smoke checks for Home Page, Project Detail Page, unknown project route, filter interaction, and mobile layout sanity.

### Infrastructure & Deployment

**Decision: Node.js 24 LTS + pnpm.**

Node.js 24 is the development/CI baseline. It satisfies Vite and Playwright requirements and is the active LTS line in 2026. Use pnpm for package management and commit a project-local lockfile once scaffolded.

**Decision: Static hosting target remains deployment-agnostic.**

The architecture does not assume Vercel, Netlify, Cloudflare Pages, GitHub Pages, or a custom host. The only host requirement for MVP is static asset serving plus SPA fallback to `index.html` for `/projects/:projectId`.

**Decision: Build scripts.**

The implementation should define:

```json
{
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "build": "tsc --noEmit && vitest run && vite build",
    "preview": "vite preview --host 127.0.0.1",
    "smoke": "playwright test --project=chromium"
  }
}
```

If typecheck uses TS project references after scaffold, replace `tsc --noEmit` with the repo-appropriate `tsc -b`.

**Decision: CI gate.**

Future CI should run `pnpm install --frozen-lockfile`, `pnpm build`, and optionally `pnpm smoke` after Playwright browsers are installed. Link checking remains optional and non-blocking until deployment URLs are stable.

**Decision: Observability and analytics are out of scope.**

No analytics, monitoring SDK, logging backend, or event tracking in MVP. Static host logs are sufficient until there is a deployment and privacy decision.

### Decision Impact Analysis

**Implementation Sequence:**

1. Scaffold Vite React TypeScript in a temporary directory and merge it into the existing BMAD repo without overwriting `.agents/`, `_bmad/`, `_bmad-output/`, or `docs/`.
2. Add Zod schema, Project Manifest v1, label maps, validation helpers, and initial Decor Dex / Scene Editor records.
3. Add route structure for Home, Project Detail, and Not Found.
4. Build manifest-driven components and Compact Trust Index layout.
5. Add URL search-param filtering, empty state, entrypoint availability rendering, and related project resolution.
6. Add tests for schema validation, filtering, routing, unknown ids, entrypoint availability, and core component accessibility.
7. Add Playwright smoke checks and deployment fallback documentation.

**Cross-Component Dependencies:**

- Manifest schema drives Project Card, Detail Page, filters, related projects, entrypoints, and validation errors.
- Route generation depends on stable project ids and must share helpers with related project links.
- Status/availability label maps must be reused by cards, details, filters, and tests.
- Source Policy affects both data schema and visible UI; it is not just developer metadata.
- Deployment fallback is required by the `/projects/:projectId` route decision.

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:** 12 areas where AI agents could otherwise make incompatible choices:

1. Manifest field naming and schema shape
2. Project id and route parameter naming
3. Entrypoint availability semantics
4. Status/capability label mapping
5. Component file naming
6. Route file organization
7. Filter state location
8. Validation timing and error format
9. Unknown route / empty result recovery
10. Source Policy rendering
11. Test placement and test naming
12. Static deployment fallback assumptions

### Naming Patterns

**Database Naming Conventions:**

No database in MVP. Agents must not invent table names, migrations, ORM models, seed scripts, SQLite files, Supabase projects, or database adapters.

**API Naming Conventions:**

No API in MVP. Agents must not create `/api/*`, REST clients, GraphQL schemas, tRPC routers, server actions, or fetch wrappers for project data.

If future Public Project Manifest support is approved, name the adapter around the source boundary, not around a generic API:

- Good: `src/adapters/public-project-manifest/`
- Avoid: `src/api/projects.ts`

**Route Naming Conventions:**

- Project detail route: `/projects/:projectId`
- Route param name: `projectId`
- Project ids: stable kebab-case, for example `pokopia-decor-dex`
- Route helper: `projectDetailPath(projectId)`

Do not use display names, slugs derived from names, numeric ids, or repository names as route keys.

**Code Naming Conventions:**

- React component names: PascalCase, for example `ProjectCard`
- Component files: PascalCase `.tsx`, for example `ProjectCard.tsx`
- Non-component modules: kebab-case or domain noun, for example `project-schema.ts`, `project-routes.ts`
- Functions and variables: camelCase, for example `getPrimaryEntrypoint`
- Types: PascalCase, for example `ProjectCard`, `ProjectStatus`
- Enum-like values in manifest: kebab-case strings, for example `in-development`, `local-only`

### Structure Patterns

**Project Organization:**

```text
src/
  components/
  data/
  domain/
  lib/
  routes/
  styles/
  test/
```

Use `domain/` for schemas, enums, label maps, and type-safe validation. Use `lib/` for pure helpers such as filtering, route helpers, related-project resolution, and entrypoint selection. Use `routes/` only for route-level composition.

**File Structure Patterns:**

- Co-locate simple component tests next to the component only if the component is highly isolated.
- Put cross-cutting domain tests in `src/domain/*.test.ts` or `src/lib/*.test.ts`.
- Put browser smoke tests in `tests/`.
- Keep Project Manifest data in `src/data/projects.ts`.
- Keep global CSS tokens in `src/styles/tokens.css`; do not define new raw colors inside components unless they are first added as tokens.

**Configuration File Organization:**

- Vite config: `vite.config.ts`
- Vitest config can live in `vite.config.ts` if simple; use `vitest.config.ts` only if the config becomes materially separate.
- Playwright config: `playwright.config.ts`
- TypeScript configs follow Vite starter defaults unless a specific implementation story changes them.

### Format Patterns

**API Response Formats:**

Not applicable in MVP. Do not wrap manifest data in fake response objects such as `{ data, error }`.

**Data Exchange Formats:**

Manifest fields use camelCase TypeScript object keys and kebab-case enum values:

```ts
{
  id: "pokopia-scene-editor",
  status: "in-development",
  dataFreshness: "manual",
  sourcePolicy: {
    displaySource: "landing-manifest",
    initializedFrom: ["..."],
    doesNotRead: ["SceneDocument save payloads"]
  }
}
```

Use arrays for multi-value fields even when there is one item: `audiences`, `primaryUseCases`, `capabilities`, `entrypoints`, `initializedFrom`, `doesNotRead`, `relatedProjects`.

Use readable strings for UI copy in manifest only when the copy is project-specific. Shared status labels and shared availability explanations belong in label maps.

### Communication Patterns

**Event System Patterns:**

No custom event bus in MVP. Filter changes are local UI interactions reflected in URL search params. Do not introduce Redux actions, global event names, analytics events, or pub/sub channels.

**State Management Patterns:**

- Manifest data is immutable static input.
- Derived data is computed with pure helpers.
- Filter state lives in `URLSearchParams`.
- Component UI state is local to the component unless multiple routes need it.
- Do not add global state libraries for MVP.

Good helper names:

- `filterProjects(projects, filters)`
- `getCapabilityOptions(projects)`
- `getStatusOptions(projects)`
- `resolveRelatedProjects(project, projectsById)`
- `getPrimaryEntrypoint(project)`

### Process Patterns

**Error Handling Patterns:**

- Build/test validation errors should be developer-facing and precise: project id + field path + reason.
- Runtime user-facing errors should be short and recoverable: unknown project, empty filters, unavailable entrypoint.
- Unknown project routes must render `NotFoundState`, not throw.
- Missing required manifest fields must fail validation; do not silently hide incomplete project cards.

**Loading State Patterns:**

MVP has no remote data loading. Do not add skeletons, async fetching spinners, query libraries, or retry flows for manifest data. If future Public Project Manifest ingestion is added, loading/error/retry states must be defined in a separate architecture update.

**Entrypoint Availability Patterns:**

- `available`: render actionable link/button.
- `disabled`: render visible non-actionable state with reason.
- `local-only`: render developer-oriented path as text or clearly labeled local link; do not present it as public tool access.
- `tbd`: render unavailable state with next known path such as detail/docs.

**Filter Patterns:**

- Multiple selected filters use AND semantics.
- Active filters are reflected in URL search params.
- Empty result state includes a clear reset action.
- Filter chips/buttons must expose selected state with text/ARIA, not color alone.

### Enforcement Guidelines

**All AI Agents MUST:**

- Treat `src/data/projects.ts` and Zod schema as the only MVP project-data source.
- Use `projectId` and stable manifest `id` for routes and related project references.
- Reuse centralized status, availability, type, and dataFreshness label maps.
- Keep Source Policy visible in project detail UI.
- Keep Decor Dex and Scene Editor as independent projects; do not imply runtime merge, sync, shared payload, or shared build pipeline.
- Avoid reading adjacent repo internals from build scripts, tests, UI code, or data generation scripts.
- Prefer small pure helpers over route/component-specific duplicated logic.
- Add or update tests when changing schema, filters, route resolution, entrypoint behavior, or label maps.

**Pattern Enforcement:**

- `pnpm build` must include manifest validation.
- Unit tests must cover invalid manifest examples and unknown related project ids.
- Component tests should query by role/name where possible.
- Browser smoke tests should cover Home, valid detail route, invalid detail route, mobile width, and filter empty state.
- Pattern changes require updating `architecture.md` before implementation stories rely on the new pattern.

### Pattern Examples

**Good Examples:**

```ts
projectDetailPath("pokopia-decor-dex"); // "/projects/pokopia-decor-dex"
```

```ts
const visibleProjects = filterProjects(projects, {
  statuses: ["available"],
  capabilities: ["装饰推荐"],
});
```

```tsx
<StatusBadge status={project.status} />
<EntrypointButton entrypoint={primaryEntrypoint} />
```

**Anti-Patterns:**

- Hardcoding `if (project.name === "Pokopia Decor Dex")` in UI components.
- Using `localStorage` for filter state in MVP.
- Fetching `../pokopia-color-pattern/dist/...` at build time.
- Treating Scene Editor's `SceneDocument` as Landing Page manifest data.
- Rendering a disabled Scene Editor tool URL as an actionable `打开工具` button.
- Creating a project-specific detail page file for each project when a manifest-driven route can render it.

## Project Structure & Boundaries

### Complete Project Directory Structure

```text
landing-page/
├── .agents/                         # Existing repo-local BMAD skills; preserve
├── _bmad/                           # Existing BMAD workflow/config; preserve
├── _bmad-output/                    # Planning/implementation artifacts; preserve
│   └── planning-artifacts/
│       └── architecture.md
├── docs/
│   └── deployment-static-fallback.md
├── public/
│   └── favicon.svg
├── tests/
│   └── landing-page.spec.ts
├── index.html
├── package.json
├── pnpm-lock.yaml
├── playwright.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── components/
    │   ├── CapabilityTag.tsx
    │   ├── EmptyState.tsx
    │   ├── EntrypointButton.tsx
    │   ├── EntrypointList.tsx
    │   ├── FilterToolbar.tsx
    │   ├── NotFoundState.tsx
    │   ├── ProjectCard.tsx
    │   ├── ProjectDetailHeader.tsx
    │   ├── RelatedProjectLink.tsx
    │   ├── SourcePolicyBlock.tsx
    │   └── StatusBadge.tsx
    ├── data/
    │   └── projects.ts
    ├── domain/
    │   ├── project-labels.ts
    │   ├── project-schema.test.ts
    │   ├── project-schema.ts
    │   └── project-validation.ts
    ├── lib/
    │   ├── entrypoints.test.ts
    │   ├── entrypoints.ts
    │   ├── filters.test.ts
    │   ├── filters.ts
    │   ├── project-routes.test.ts
    │   ├── project-routes.ts
    │   ├── related-projects.test.ts
    │   └── related-projects.ts
    ├── routes/
    │   ├── HomeRoute.tsx
    │   ├── NotFoundRoute.tsx
    │   ├── ProjectDetailRoute.tsx
    │   └── router.tsx
    ├── styles/
    │   ├── base.css
    │   ├── layout.css
    │   └── tokens.css
    └── test/
        ├── invalid-project-fixtures.ts
        └── setup.ts
```

### Architectural Boundaries

**API Boundaries:**

There is no MVP API boundary. All project data is local manifest data imported at build/runtime from `src/data/projects.ts`. No component or helper should call `fetch()` for project cards, statuses, source policy, related projects, or entrypoints.

**Component Boundaries:**

- `routes/` composes page-level data and components.
- `components/` renders props and emits simple UI events only.
- `domain/` owns schema, enums, label maps, and validation.
- `lib/` owns pure derived-data helpers.
- `data/` owns the manual Project Manifest.

Components do not import from adjacent repos and do not contain project-specific branches.

**Service Boundaries:**

No service layer in MVP. Do not create `services/`, `repositories/`, `clients/`, or `api/` directories until a future architecture update introduces an external integration.

**Data Boundaries:**

- Input boundary: `projectManifest` in `src/data/projects.ts`
- Validation boundary: Zod schemas in `src/domain/project-schema.ts`
- Rendering boundary: validated data passed to routes/components
- External boundary: public URLs only, represented as `entrypoints`

Adjacent Pokopia repos are reference/provenance only. Their files are not build inputs.

### Requirements to Structure Mapping

**FR Category: Ecosystem Home Page (FR-1 to FR-6)**

- `src/routes/HomeRoute.tsx`
- `src/components/ProjectCard.tsx`
- `src/components/StatusBadge.tsx`
- `src/components/CapabilityTag.tsx`
- `src/components/FilterToolbar.tsx`
- `src/components/EntrypointButton.tsx`
- `src/components/EmptyState.tsx`
- `src/lib/filters.ts`

**FR Category: Project Manifest and Schema (FR-7 to FR-12)**

- `src/data/projects.ts`
- `src/domain/project-schema.ts`
- `src/domain/project-validation.ts`
- `src/domain/project-labels.ts`
- `src/lib/related-projects.ts`
- `src/domain/project-schema.test.ts`

**FR Category: Project Entrypoints (FR-13 to FR-16)**

- `src/components/EntrypointButton.tsx`
- `src/components/EntrypointList.tsx`
- `src/lib/entrypoints.ts`
- `src/domain/project-labels.ts`

**FR Category: Project Detail Pages (FR-17 to FR-20)**

- `src/routes/ProjectDetailRoute.tsx`
- `src/routes/NotFoundRoute.tsx`
- `src/components/ProjectDetailHeader.tsx`
- `src/components/SourcePolicyBlock.tsx`
- `src/components/RelatedProjectLink.tsx`
- `src/components/NotFoundState.tsx`
- `src/lib/project-routes.ts`

**FR Category: Data Boundary and Independence (FR-21 to FR-24)**

- `src/domain/project-validation.ts`
- `src/data/projects.ts`
- `src/test/invalid-project-fixtures.ts`
- `docs/deployment-static-fallback.md`
- Build/test scripts in `package.json`

**FR Category: Content Governance (FR-25 to FR-28)**

- `src/domain/project-labels.ts`
- `src/components/SourcePolicyBlock.tsx`
- `src/data/projects.ts`

**FR Category: Accessibility and Responsive Behavior (FR-29 to FR-30)**

- `src/styles/tokens.css`
- `src/styles/base.css`
- `src/styles/layout.css`
- component tests with Testing Library
- `tests/landing-page.spec.ts`

### Integration Points

**Internal Communication:**

`projectManifest` → Zod validation → derived helpers → route components → presentational components.

Routes are responsible for selecting data and recovery states. Components are responsible for rendering semantic HTML and calling callbacks such as filter updates.

**External Integrations:**

MVP external integrations are links only:

- Decor Dex public URL
- local-only adjacent repo paths for maintainers
- planning document links if exposed in maintainer/detail sections

No runtime SDKs, analytics, API clients, or cross-repo imports.

**Data Flow:**

```text
src/data/projects.ts
  -> src/domain/project-validation.ts
  -> src/lib/{filters,entrypoints,related-projects,project-routes}.ts
  -> src/routes/{HomeRoute,ProjectDetailRoute}.tsx
  -> src/components/*.tsx
```

Invalid data fails build/test. Unknown runtime project ids go to Not Found. Empty filter results stay on Home with reset action.

### File Organization Patterns

**Configuration Files:**

Root config files stay at repository root. Do not create nested app packages or a monorepo unless a later workflow explicitly changes scope.

**Source Organization:**

Source follows domain-first boundaries rather than feature folders because the MVP has one feature surface: manifest-driven directory browsing.

**Test Organization:**

- Domain/helper tests live beside the module they test.
- Browser smoke tests live under `tests/`.
- Shared test setup lives in `src/test/setup.ts`.
- Invalid data fixtures live in `src/test/invalid-project-fixtures.ts`.

**Asset Organization:**

Use `public/` only for small site assets such as favicon or manually maintained screenshots if a later story adds screenshots. Do not copy Decor Dex or Scene Editor runtime assets into `public/`.

### Development Workflow Integration

**Development Server Structure:**

`pnpm dev` runs Vite against the app root. During development, project data should update through edits to `src/data/projects.ts` and fail quickly through typecheck/test/build validation.

**Build Process Structure:**

`pnpm build` runs typecheck, tests, and Vite build. Build must not require adjacent repositories or network access.

**Deployment Structure:**

`dist/` is the only deployment artifact. Deployment documentation must state the required SPA fallback for `/projects/:projectId` direct loads. Host-specific fallback files belong in `public/` or deployment config only after the hosting target is chosen.

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**

All major decisions are compatible. Vite + React + TypeScript supports a static, manifest-driven SPA. Zod validation supports the PRD's build-time schema requirement. React Router supports stable `/projects/:projectId` detail routes as long as static deployment provides SPA fallback. The decision to avoid database/API/auth aligns with the PRD's static-first MVP and explicit non-goals.

**Pattern Consistency:**

Implementation patterns reinforce the architectural decisions: `projectId` route naming matches stable manifest ids; centralized label maps prevent status/availability drift; URL search params match filter persistence needs without adding localStorage; and build/test validation enforces the data-boundary rules.

**Structure Alignment:**

The directory structure supports the chosen boundaries. `data/`, `domain/`, `lib/`, `routes/`, and `components/` separate manifest ownership, validation, derived logic, page composition, and UI rendering. The tree also preserves existing `.agents/`, `_bmad/`, `_bmad-output/`, and `docs/` boundaries.

### Requirements Coverage Validation ✅

**Epic/Feature Coverage:**

No epics were available during architecture creation, so validation uses PRD FR categories.

**Functional Requirements Coverage:**

All 30 FRs are architecturally supported:

- FR-1 to FR-6: Home route, Project Card, filters, status badges, accessibility-oriented visible labels.
- FR-7 to FR-12: Project Manifest v1, Zod schema, stable ids, enum constraints, Source Policy, related project resolution.
- FR-13 to FR-16: Entrypoint schema, primary entrypoint helper, availability rendering, external/local/docs/detail/tool distinctions.
- FR-17 to FR-20: Project Detail route, detail header, source policy block, related project link, not-found route.
- FR-21 to FR-24: independent build, no adjacent project scanning, deferred Public Project Manifest adapter, validation failure boundaries.
- FR-25 to FR-28: centralized status/dataFreshness labels, initializedFrom and maintainer notes in manifest/detail UI.
- FR-29 to FR-30: responsive CSS structure, semantic components, Testing Library and Playwright checks.

**Non-Functional Requirements Coverage:**

NFRs are covered by architecture choices:

- Independent buildability: static Vite build and local manifest only.
- Data minimization and boundary safety: no adjacent repo ingestion.
- Accessibility and mobile readability: semantic components, visible status labels, CSS tokens, browser smoke checks.
- Maintainability: manifest-driven components and no project-specific page components.
- Build-time validation: Zod + tests in build gate.
- Graceful degradation: unavailable entrypoints, empty filters, and unknown project routes have explicit UI states.
- Clear provenance: Source Policy and initializedFrom are first-class manifest fields.
- No real-time claims: no runtime status syncing or polling.

### Implementation Readiness Validation ✅

**Decision Completeness:**

Critical technology and architecture decisions are documented with current version checks where relevant. The architecture defines starter, runtime, routing, data model, validation, testing, deployment assumptions, and deferred scope.

**Structure Completeness:**

The project tree identifies root config files, source directories, component files, domain/lib modules, tests, deployment docs, and preserved BMAD directories. It is specific enough for implementation stories to create files without inventing competing layouts.

**Pattern Completeness:**

Naming, structure, data format, state, error handling, loading, entrypoint availability, filter behavior, enforcement rules, good examples, and anti-patterns are defined.

### Gap Analysis Results

**Critical Gaps:** None.

**Important Gaps:** None blocking implementation. The `/projects/:projectId` decision depends on static hosting SPA fallback; this is already documented as a deployment requirement and first implementation must add `docs/deployment-static-fallback.md`.

**Nice-to-Have Gaps:**

- Optional link checking can be added after public deployment URL is stable.
- Public Project Manifest adapter can be designed later if an upstream project publishes a stable manifest.
- Screenshots and update timestamps can be added later once a source-of-truth policy exists.
- Accessibility automation can later add axe checks if the implementation story chooses that package.

### Validation Issues Addressed

No critical issues required architectural rework. The main direct-route risk is addressed by requiring static host fallback to `index.html` and documenting that requirement in project structure and deployment docs.

### Architecture Completeness Checklist

**Requirements Analysis**

- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**Architectural Decisions**

- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**Implementation Patterns**

- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**Project Structure**

- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** high

**Key Strengths:**

- Clear static-first architecture with no backend/API/auth ambiguity.
- Strong manifest boundary that directly protects the most important product constraint.
- Concrete component, route, schema, helper, and test structure for AI-agent consistency.
- Explicit deployment fallback requirement for direct detail routes.
- Deferred decisions are separated from MVP implementation instead of leaking into the core architecture.

**Areas for Future Enhancement:**

- Public Project Manifest adapter if upstream projects publish stable public metadata.
- Optional link checking and deployment-specific CI once public URLs are final.
- Screenshot/media strategy if UX later requires project screenshots.
- Additional accessibility automation after the UI implementation exists.

### Implementation Handoff

**AI Agent Guidelines:**

- Follow all architectural decisions exactly as documented.
- Use implementation patterns consistently across all components.
- Respect project structure and boundaries.
- Do not ingest adjacent Pokopia project internals.
- Refer to this document before changing manifest schema, routing, data source, testing strategy, or deployment assumptions.

**First Implementation Priority:**

Scaffold Vite React TypeScript in a temporary directory, merge scaffold files into the existing repo without overwriting BMAD assets, then add Project Manifest v1 and Zod validation before building UI components.
