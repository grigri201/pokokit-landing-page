---
stepsCompleted:
  - 1
  - 2
  - 3
  - 4
inputDocuments:
  - _bmad-output/planning-artifacts/prds/prd-landing-page-2026-05-18/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
lastStep: 4
status: complete
completedAt: '2026-05-19'
project_name: landing-page
user_name: Grigri
date: '2026-05-19'
---

# landing-page - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for landing-page, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR-1: Home Page 必须展示简洁生态定位，明确 Landing Page 是 Pokopia 生态目录和路由界面，而不是合并后的运行时应用；第一屏不承诺统一账号、统一后端、云同步或跨项目数据合并。

FR-2: Home Page 必须展示 `pokopia-decor-dex` 和 `pokopia-scene-editor` 两张 Project Card，且每张卡片显示 name、tagline、type、status、capabilities 和至少一个 Entrypoint；缺少必填字段时必须失败或显示可定位错误。

FR-3: 用户可以按 Project Status 筛选 Project Card；选择 `available` 时只显示可用项目，清除筛选后恢复完整列表，空结果必须显示说明而不是空白页面。

FR-4: 用户可以按 Capability Tag 筛选 Project Card；`建筑层` 定位 Scene Editor，`装饰推荐` 定位 Decor Dex，多筛选条件按 AND 逻辑同时生效。

FR-5: 每张 Project Card 必须支持快速扫描，在不打开详情页的情况下展示公开名称、短描述、状态、类型、关键标签、主要用户或核心场景，并让用户判断工具当前能否直接打开。

FR-6: Project Status 必须同时通过可见文字和视觉样式表达，不能只依赖颜色；每个状态徽标必须有可见文字，移除颜色后仍能区分状态含义。

FR-7: Project Manifest 必须要求每张 Project Card 包含 `id`、`name`、`tagline`、`type`、`status`、`audiences`、`primaryUseCases`、`capabilities`、`entrypoints`、`sourcePolicy` 和 `dataFreshness`；缺失字段时校验失败并指出项目 id 和字段。

FR-8: 每张 Project Card 必须使用稳定 kebab-case `id`；`pokopia-decor-dex` 和 `pokopia-scene-editor` 是首批稳定 id，详情路由和 relatedProjects reference 必须使用 `id` 而不是展示名。

FR-9: Project Manifest 必须把 `status`、`type`、`entrypoints.kind`、`entrypoints.availability`、`sourcePolicy.displaySource` 和 `dataFreshness` 约束在文档化 enum 内；拼写错误必须被校验拦截。

FR-10: 每张 Project Card 必须包含 Source Policy，说明 Landing Page 可以展示什么、不能读取什么；Decor Dex 排除 raw image source directories、full item manifest 和 build-only diagnostics，Scene Editor 排除 SceneDocument save payloads、localStorage UI preferences 和 editor build artifacts，除非未来显式提供 Public Project Manifest。

FR-11: Project Manifest 可以通过稳定 project id 和关系说明表达 relatedProjects；Scene Editor 可以引用 Decor Dex 作为 selectedPokemonKey key space 的语义/参考关系，相关链接必须能解析到现有详情页。

FR-12: 新增一张合法 Project Card 后，Home Page、Project Detail Page、筛选和相关项目引用必须能基于 manifest 自动工作，不需要新增项目专属页面逻辑。

FR-13: 每张 Project Card 必须基于最有用且可用的 Entrypoint 展示主 CTA；Decor Dex 有公开 URL 时展示可用工具入口，Scene Editor 没有确认公开部署 URL 时不得展示伪装成可用工具的启动 CTA。

FR-14: `disabled`、`local-only` 或 `tbd` Entrypoint 必须展示原因或说明；开发中的 Scene Editor 工具入口需解释部署 URL 未确认或项目仍在开发中，本地仓库链接需标为 local/developer-oriented。

FR-15: Entrypoint 必须通过视觉和文字区分 `tool`、`detail`、`repo`、`docs` 或 `external`；`打开工具` 不得用于 docs 或 repo，`查看仓库` 和 `查看规划文档` 必须是独立动作。

FR-16: 外部公开 URL 必须提示用户将离开 Landing Page 或打开相关项目；Decor Dex public site link 必须标记为 tool/external entrypoint，站内详情链接必须与外部工具链接可区分。

FR-17: 每个 Project Detail Page 必须展示项目解决的问题、目标用户、核心能力、当前状态和可用 Entrypoint；Decor Dex 详情页解释 Pokemon 色彩、色板、偏好词、推荐和可分享静态详情页，Scene Editor 详情页解释 7x7 工作台、5x5 主体区、建筑层、素材实例、技能标记、预览和保存恢复。

FR-18: 每个 Project Detail Page 必须以用户可读形式展示 Source Policy，包括 Landing Page 使用 Project Manifest 作为 display source、内容初始化来源，以及 Landing Page 不读取的内容。

FR-19: Project Detail Page 必须在存在 relatedProjects 时展示相关项目关系；Scene Editor 详情页必须将 Decor Dex 关系表达为 key semantics/reference relationship，而不是 runtime merge；缺失 related project id 必须被验证捕获或在开发期显示 broken config 错误。

FR-20: 未知项目详情路由必须展示清晰 not-found 状态，并提供返回 Home Page 的路径；`/projects/not-a-project` 不得崩溃，并应列出有效项目选项或返回链接。

FR-21: Landing Page 必须能在不依赖相邻 Pokopia 项目仓库、项目构建产物、raw assets 或本地保存 payload 的情况下构建；干净 checkout 只含 landing-page repo 文件时也能构建，缺失相邻仓库路径不得导致失败。

FR-22: Landing Page 不得扫描或复制相邻项目的 `dist/`、raw source data、图片资产目录、build diagnostics、SceneDocument payload 或 localStorage 数据；任何未来 ingestion 都必须依赖 Public Project Manifest 和明确 architecture decision。

FR-23: Landing Page 后续可以支持 Public Project Manifest 集成，但 MVP 默认它是可选且不存在的；如果未来 `project.manifest.json` 缺失或不可访问，必须降级使用人工维护 Project Card 数据。

FR-24: 非法 Project Manifest 数据应触发构建期校验失败；不可用的外部项目 URL 不应导致静态构建失败，但可以由可选 link checking 标记。

FR-25: Landing Page 必须定义 `planned`、`in-development`、`available`、`experimental`、`maintenance` 和 `archived` 的用户可读含义；`in-development` 不得暗示工具可启动。

FR-26: 每张 Project Card 必须展示或暴露 `dataFreshness`，取值为 `manual`、`build-time`、`project-manifest` 或 `unknown`；人工数据不得被描述为实时。

FR-27: 当内容来自规划文档时，每张 Project Card 必须记录 `initializedFrom` 源路径或来源标签；Decor Dex 和 Scene Editor cards 必须在 Source Policy 中列出来源规划产物，供维护者审计。

FR-28: Project Card 可以包含短 maintainer notes，但 notes 不能替代项目 PRD；notes 可解释部署未知或边界提醒，长实现理由必须留在 architecture 或 addendum。

FR-29: Home Page 和 Project Detail Page 必须支持桌面与移动端浏览，不能隐藏核心项目信息；移动端用户必须能读取 Project Cards、status、tags 和 primary Entrypoints，筛选控件不得水平溢出。

FR-30: 筛选控件、卡片和 Entrypoint 必须可键盘操作，并能被屏幕阅读器理解；用户能按逻辑顺序 tab 过 filters 和 CTAs，状态徽标和 disabled CTA notes 必须有 accessible text。

### NonFunctional Requirements

NFR-1: Independent buildability. Landing Page must build from its own repository contents without adjacent Pokopia repos or generated artifacts.

NFR-2: Data minimization. Runtime bundle must include only project-level public metadata needed for the directory experience.

NFR-3: Boundary safety. Code must not import, parse, copy, or scan internal datasets from Decor Dex or Scene Editor.

NFR-4: Accessibility. Interactive controls and links must be keyboard accessible and status must not rely on color alone.

NFR-5: Mobile readability. Core card and detail information must remain visible and legible on mobile widths.

NFR-6: Maintainability. Adding a project must primarily be a Project Manifest change plus optional content fields, not a component rewrite.

NFR-7: Build-time validation. 非法 manifest 数据必须尽早失败，并提供可行动错误信息。

NFR-8: Graceful degradation. 可选外部 URL、本地仓库路径或未来 public manifest 缺失时，UI 必须降级展示，且不破坏静态构建。

NFR-9: Clear provenance. 项目摘要必须暴露 display source 和 initializedFrom 引用，供维护者审计。

NFR-10: No real-time claims. 人工维护的项目状态不得被呈现为实时或自动同步状态。

NFR-11: Link clarity. 公开工具链接、站内详情链接、docs 链接、repo 链接和 local-only 路径必须可区分。

NFR-12: Performance. 在初始项目列表和小规模未来扩展范围内，Home Page 应从静态 bundle 渲染核心内容，不依赖外部运行时数据请求；典型移动宽带连接下首个有意义的项目列表 2 秒内可见，本地 production preview 下 1 秒内可见。

### Additional Requirements

- 第一条 implementation story 应先在临时目录生成 Vite + React + TypeScript starter，再合并 `package.json`、`index.html`、`src/`、`public/`、`vite.config.ts`、`tsconfig*.json` 等 scaffold 文件到当前仓库，保留 `.agents/`、`_bmad/`、`_bmad-output/` 和 `docs/`。
- 使用 Vite + React + TypeScript 作为静态前端基础；生产运行时不得依赖 Node.js、后端 API、数据库、认证、SSR 或运行时外部数据请求。
- 使用 Node.js 24 LTS + pnpm 作为开发/CI 基线，并提供 `dev`、`typecheck`、`test`、`build`、`preview`、`smoke` 脚本；`build` 必须包含 typecheck、Vitest 和 Vite build。
- 使用 React Router declarative/data route layer，而不是 framework mode；路由包括 `/`、`/projects/:projectId` 和 `*` Not Found，静态部署必须支持 SPA fallback 到 `index.html`。
- Filter state 在 MVP 中存于 URL search params，例如 `?status=available` 和 `?capability=建筑层`；不得用 `localStorage` 保存筛选状态。
- Project Manifest v1 必须是 `src/data/projects.ts` 中的静态 TypeScript module，数据由仓库内人工维护，不得导入、扫描、解析或复制相邻项目内部数据。
- 使用 Zod + TypeScript inference 定义 manifest schema、enum、类型和验证边界；校验应在 build/test 期间运行，错误应包含 project id、字段路径和原因。
- Status、availability、type、dataFreshness label maps 必须集中在 domain 层复用；Project Card、Detail Page、filters 和 tests 不得各自复制状态文案。
- Core components 必须 manifest-driven，包括 `ProjectCard`、`StatusBadge`、`CapabilityTag`、`EntrypointButton`、`FilterToolbar`、`ProjectDetailHeader`、`EntrypointList`、`SourcePolicyBlock`、`RelatedProjectLink`、`EmptyState` 和 `NotFoundState`。
- 源码结构应按 `src/components/`、`src/data/`、`src/domain/`、`src/lib/`、`src/routes/`、`src/styles/`、`src/test/` 和 `tests/` 分层；domain 放 schema/label/validation，lib 放 filtering、route、entrypoint、related project 纯 helper。
- 组件不得包含 project-specific branches，例如不得在 UI 中写 `if (project.name === "Pokopia Decor Dex")`；项目差异必须来自 manifest 数据和集中映射。
- Entrypoint availability 语义必须一致：`available` 渲染可操作链接，`disabled` 渲染带原因的不可操作状态，`local-only` 明确是开发者路径，`tbd` 显示不可用状态和下一步。
- Runtime recovery 必须覆盖 unknown project route、empty filter result 和 unavailable entrypoint；unknown project 不得 throw，empty state 必须有 clear/reset action。
- Testing stack 使用 Vitest + Testing Library 覆盖 schema validation、filter logic、route resolution、entrypoint behavior、related project resolution 和关键组件语义；Playwright smoke 覆盖 Home、有效详情、未知详情、筛选空状态和移动布局。
- CSS 使用集中 design tokens 和 semantic class structure，建议 `src/styles/tokens.css`、`src/styles/base.css`、`src/styles/layout.css`；不得引入 Tailwind、CSS-in-JS、动画框架或大型设计系统依赖作为 MVP 默认。
- `public/` 只允许小型站点资产或未来明确批准的人工维护截图；不得复制 Decor Dex 或 Scene Editor runtime assets。
- 外部链接必须使用明确 label 和 `rel="noopener noreferrer"`；不得在 manifest 或 Vite env 中放置 token、私有 URL、API key 或其他 secret。
- 部署目标保持静态 host agnostic；必须记录 `/projects/:projectId` 直接加载所需的 SPA fallback，若 host 不支持 fallback，可添加部署适配文件，而不是默认改成 hash route。
- Observability、analytics、runtime link health checking、Public Project Manifest adapter、screenshots、update timestamps、SEO-heavy prerendering 均为 post-MVP 或后续明确决策，不得进入当前 MVP 默认实现。
- Pattern changes require updating `architecture.md` before implementation stories rely on the new pattern.

### UX Design Requirements

UX-DR1: 首页第一屏必须采用短定位 + filter toolbar + Project Card grid 的 Compact Trust Index 方向，不使用营销式长 hero 或装饰性生态叙事压过工具目录任务。

UX-DR2: Home Page desktop 默认使用受控宽度内容区和 2-column Project Card grid，mobile 默认单列 Project Card；项目数量增加时用响应式 grid 扩展。

UX-DR3: Project Card 第一层必须包含 name、tagline、Project Status、Project Type、Capability Tags 和主要 Entrypoint；Source Policy、dataFreshness、doesNotRead、initializedFrom 等维护者信息下沉到详情页或次级区域。

UX-DR4: 视觉基底使用明亮、克制、可读的工具目录色系，设计 tokens 至少覆盖背景、surface、文本、muted、border、primary、secondary、warm accent 和 soft accent。

UX-DR5: Status colors 只能辅助识别；`available`、`in-development`、`planned`、`experimental`、`maintenance`、`archived` 都必须有可见文字标签和说明。

UX-DR6: Typography 使用系统 sans-serif 或现代 UI 字体，正文 15-16px、卡片标题 18-20px、按钮 14-15px；不得使用随 viewport width 缩放的字体大小。

UX-DR7: 布局采用 8px spacing base，Project Card 圆角不超过 8px，内容密度应服务比较和入口选择。

UX-DR8: 所有文本与背景必须满足 WCAG AA 对比度；状态、可用性和错误信息不得只依赖颜色。

UX-DR9: Disabled / tbd / local-only 入口必须可读、可解释，不能只做灰色不可点；不可用 CTA 保留可见位置并说明原因和替代路径。

UX-DR10: Mobile 触控目标建议不小于 44px；长标签、长项目名称和按钮文本必须可换行，不得挤压 CTA 或造成布局溢出。

UX-DR11: UJ-1 必须支持用户从 Home Page 扫描 Decor Dex 和 Scene Editor 卡片，按任务判断正确工具，并进入可用入口或详情页。

UX-DR12: UJ-2 必须支持 Scene Editor 开发中场景：卡片状态显示 `In development`，主入口为查看详情，详情页解释 tbd/disabled 原因并提供本地仓库或规划文档路径。

UX-DR13: UJ-3 必须将 manifest validation 视为维护者 UX；新增项目校验失败时错误应指出字段、项目 id 和修复方向。

UX-DR14: UJ-4 必须把 Decor Dex 和 Scene Editor 的关系表述为“语义关联”“参考关系”“独立工具”，避免“同步”“集成”“共享数据”等运行时合并暗示。

UX-DR15: Button / Link Button 必须根据真实动作区分工具入口、详情入口、仓库、文档、外链、disabled、local-only 和 tbd；不得使用泛化的“查看”或“打开”替代具体含义。

UX-DR16: Badge / Pill 用于 Project Status、Project Type 和 dataFreshness；Capability Tag / Chip 用于能力展示和筛选，筛选时必须有明确 selected state 和语义。

UX-DR17: Project Card 不应整体包裹多个交互目标；卡片内每个 CTA 或 link 必须独立可聚焦，hover/focus 状态清晰。

UX-DR18: Status Badge 默认非交互；若需要说明，用相邻 note 或 tooltip，不得让颜色独自承担语义。

UX-DR19: Capability Tag 在筛选模式下使用 button 或 checkbox 语义，并通过 text/ARIA 表达 selected state。

UX-DR20: Entrypoint Button 的 label 必须说明真实动作；available link 可点击，disabled/tbd 展示原因和替代路径，外链说明目标项目。

UX-DR21: Project Detail Header 顶部必须回答“这是什么、现在能否使用、下一步去哪”，并保持 heading hierarchy 稳定。

UX-DR22: Source Policy Block 必须用“本页读取 / 本页不读取”方式展示 displaySource、initializedFrom、doesNotRead 和 dataFreshness；路径和 key 用 monospace，默认在详情页可见摘要。

UX-DR23: Related Project Link 必须包含 target project name、relationship text 和 detail link；missing target 必须在开发期暴露校验错误。

UX-DR24: Empty State、Disabled State 和 Not Found State 必须包含短标题、原因和下一步操作；无筛选结果必须提供清除筛选操作，未知项目必须提供返回 Home 或有效项目列表。

UX-DR25: Navigation 必须以 Home Page 为中心；Project Detail Page 顶部必须提供返回 Home Page，relatedProjects 使用明确 link row，不依赖侧边栏。

UX-DR26: 筛选控件位于 Project Card 列表前，active filter 用文本和视觉状态共同表达，filter chips 可换行，不使用横向滚动作为唯一访问方式。

UX-DR27: Desktop 1024px+ 支持项目对比和可选详情两栏；Tablet 768px-1023px 降级为单列或窄双列；Mobile 320px-767px 单列，CTA 垂直堆叠或全宽。

UX-DR28: Project Card 应设置稳定最小宽度和响应式 grid tracks，避免标签、按钮或长项目名称造成布局跳动。

UX-DR29: 可访问性目标为 WCAG 2.1 AA；所有 Entrypoint Button、Filter Control、Related Project Link 和返回链接必须支持键盘导航，focus state 必须可见。

UX-DR30: Project Card 使用 `article`，页面使用 semantic HTML，包括 `main`、`section`、`article`、`nav`、`button` 和 `a`；Filter Control 提供 `aria-pressed` 或等价状态。

UX-DR31: 测试必须覆盖 390x844、768x1024、1024x768、1440x900 响应式尺寸，检查长项目名、长 capability tag、多个 entrypoints 和空筛选结果。

UX-DR32: 内容测试必须确认“打开工具”“查看详情”“查看仓库”“查看规划文档”真实对应动作，relatedProjects 文案不暗示运行时合并，disabled/tbd/local-only 都有原因和替代路径。

### FR Coverage Map

FR-1: Epic 1 - 首页第一屏清楚表达生态目录定位，不误导为统一运行时应用。

FR-2: Epic 1 - 首页展示 Decor Dex 与 Scene Editor 两张 Project Card，并由 manifest 必填字段支撑。

FR-3: Epic 1 - Home Page 提供 Project Status 筛选、清除筛选和空结果状态。

FR-4: Epic 1 - Home Page 提供 Capability Tag 筛选，并按 AND 逻辑组合条件。

FR-5: Epic 1 - Project Card 承载可扫描的用途、状态、类型、标签、用户场景和可用性判断。

FR-6: Epic 1 - Project Status 以文字和视觉样式共同表达，避免只依赖颜色。

FR-7: Epic 1 - Project Manifest schema 定义 Project Card 必填字段并输出可定位校验错误。

FR-8: Epic 1 - Project Manifest 使用稳定 kebab-case project id，并支撑详情路由和引用。

FR-9: Epic 1 - Project Manifest enum 约束 status、type、entrypoint kind/availability、displaySource 和 dataFreshness。

FR-10: Epic 2 - Source Policy 在项目详情语境中说明可展示内容和明确不读取内容。

FR-11: Epic 2 - relatedProjects 使用稳定 id 和关系说明，并能解析到项目详情页。

FR-12: Epic 3 - 新增合法 Project Card 后，首页、详情、筛选和 relatedProjects 不需要项目专属页面逻辑。

FR-13: Epic 1 - Project Card 主 CTA 基于最有用且可用的 Entrypoint，避免伪装未部署工具入口。

FR-14: Epic 1 - disabled、local-only 和 tbd Entrypoint 在卡片/入口区展示原因或说明。

FR-15: Epic 1 - Entrypoint 在视觉和文字上区分 tool、detail、repo、docs 和 external。

FR-16: Epic 1 - 外部公开 URL 明确提示将打开相关项目或离开 Landing Page。

FR-17: Epic 2 - Project Detail Page 展示项目问题、用户、能力、状态和可用 Entrypoint。

FR-18: Epic 2 - Project Detail Page 以用户可读形式展示 display source、initializedFrom 和 doesNotRead。

FR-19: Epic 2 - Project Detail Page 展示 relatedProjects 关系，避免 runtime merge 暗示。

FR-20: Epic 2 - 未知项目详情路由展示 not-found recovery，不崩溃。

FR-21: Epic 3 - Landing Page 能独立构建，不依赖相邻仓库、构建产物、raw assets 或 payload。

FR-22: Epic 3 - 代码和构建不得扫描或复制相邻项目内部产物。

FR-23: Epic 3 - Public Project Manifest 保持未来扩展，MVP 可在其缺失时使用人工 manifest。

FR-24: Epic 3 - 非法 manifest 数据构建期失败，不可用外部 URL 不破坏静态构建。

FR-25: Epic 3 - 状态含义文案定义清楚，避免把人工状态呈现为 launchable 或实时。

FR-26: Epic 2 - Project Card/Detail 暴露 dataFreshness，并区分 manual、build-time、project-manifest 和 unknown。

FR-27: Epic 2 - Project Card/Detail 记录 initializedFrom，支持维护者审计来源。

FR-28: Epic 2 - maintainer notes 支持短备注，但不替代 PRD 或长实现说明。

FR-29: Epic 3 - Home Page 和 Project Detail Page 在桌面与移动端保持核心信息可读、可用。

FR-30: Epic 3 - 筛选控件、卡片和 Entrypoint 支持键盘和屏幕阅读器访问。

## Epic List

### Epic 1: Manifest 驱动的生态首页与工具选择

用户可以打开 Landing Page，在第一屏理解 Pokopia 工具生态，看到 Decor Dex / Scene Editor 卡片，按状态和能力筛选，并点击可信入口。该 Epic 交付可用的首页目录、Project Manifest 基础 schema、卡片扫描体验和入口可用性表达。

**FRs covered:** FR-1, FR-2, FR-3, FR-4, FR-5, FR-6, FR-7, FR-8, FR-9, FR-13, FR-14, FR-15, FR-16

**Implementation notes:** 第一条 story 应先合并 Vite + React + TypeScript scaffold，并建立 manifest/schema/label maps 的最小基础。首页和入口组件必须从 manifest 派生，不读取相邻项目内部数据。

### Epic 2: 项目详情页与边界透明

用户可以进入每个项目详情页，理解项目用途、当前状态、可用路径、Source Policy、数据边界和相关项目关系。该 Epic 交付详情路由、来源/边界说明、relatedProjects 和未知项目 recovery。

**FRs covered:** FR-10, FR-11, FR-17, FR-18, FR-19, FR-20, FR-26, FR-27, FR-28

**Implementation notes:** 详情页必须继续使用同一份 validated manifest。Source Policy、dataFreshness、initializedFrom 和 doesNotRead 是用户可见内容，不只是开发者注释。

### Epic 3: 可信维护、扩展与发布就绪

维护者可以安全新增第三个 Project Card；应用能独立构建，不读取相邻项目内部数据，并通过响应式、可访问性和发布前质量验证。该 Epic 交付扩展路径、数据边界验证、状态含义文案、响应式体验和发布 smoke。

**FRs covered:** FR-12, FR-21, FR-22, FR-23, FR-24, FR-25, FR-29, FR-30

**Implementation notes:** FR-21/FR-22 是全程约束，前两个 Epic 的实现也必须遵守；本 Epic 负责把这些约束固化为测试、构建验证和发布文档。

## Epic 1: Manifest 驱动的生态首页与工具选择

用户可以打开 Landing Page，在第一屏理解 Pokopia 工具生态，看到 Decor Dex / Scene Editor 卡片，按状态和能力筛选，并点击可信入口。该 Epic 交付可用的首页目录、Project Manifest 基础 schema、卡片扫描体验和入口可用性表达。

### Story 1.1: Set up initial project from starter template

**Requirements Covered:** FR-2, FR-7, FR-8, FR-9, FR-21, FR-22

As a Pokopia 工具维护者,
I want 一个独立的 Vite + React + TypeScript 应用基础和可校验的 Project Manifest,
So that Landing Page 可以从自身仓库数据渲染首批项目，而不依赖相邻项目内部文件。

**Acceptance Criteria:**

**Given** 当前仓库包含 `.agents/`、`_bmad/`、`_bmad-output/` 和 `docs/`
**When** 开发者合并 Vite + React + TypeScript scaffold
**Then** `package.json`、`index.html`、`src/`、`public/`、`vite.config.ts` 和 `tsconfig*.json` 存在且不覆盖 BMAD 目录
**And** `pnpm dev`、`pnpm typecheck`、`pnpm test`、`pnpm build` 和 `pnpm preview` 脚本可用于后续开发。

**Given** Vite React TypeScript starter 在临时目录生成
**When** 开发者把 starter 文件合并到当前仓库并运行依赖安装
**Then** `pnpm install` 能生成项目本地 lockfile
**And** 初始配置可通过 typecheck 或 build 的基础验证。

**Given** `src/data/projects.ts` 定义 Project Manifest v1
**When** manifest 被验证
**Then** `pokopia-decor-dex` 和 `pokopia-scene-editor` 使用稳定 kebab-case `id` 并包含 PRD 要求的所有必填字段
**And** manifest validation 对缺失字段、重复 id 和非法 enum 输出包含 project id、字段路径和原因的错误。

**Given** Landing Page 在干净 checkout 中构建
**When** 相邻 Pokopia 仓库路径不存在
**Then** typecheck/test/build 不会读取或要求相邻项目的 `dist/`、raw assets、SceneDocument payload 或 localStorage 数据
**And** 所有项目展示数据来自 validated manifest。

### Story 1.2: 展示 Compact Trust Index 首页和 Project Card

**Requirements Covered:** FR-1, FR-2, FR-5, FR-6

As a Pokopia 创作者,
I want 第一屏直接看到 Pokopia 工具定位和项目卡片,
So that 我可以快速判断每个工具的用途、状态和下一步入口。

**Acceptance Criteria:**

**Given** 用户打开 Home Page
**When** 第一屏渲染完成
**Then** 页面展示简短生态目录定位、filter toolbar 和 Decor Dex / Scene Editor Project Card
**And** 页面不使用营销式长 hero，也不暗示统一账号、统一后端、云同步或跨项目数据合并。

**Given** Project Card 从 validated manifest 渲染
**When** 用户扫描卡片
**Then** 每张卡片显示 name、tagline、type、status、capability tags、主要用户或核心场景，以及至少一个 Entrypoint
**And** 用户无需进入详情页即可判断工具当前能否直接打开。

**Given** Project Status 在卡片上展示
**When** 颜色不可用或用户使用色弱模拟
**Then** 状态仍通过可见文字表达含义
**And** 状态徽标不只依赖颜色区分。

**Given** 首页使用设计 tokens 和语义化结构
**When** 项目名称、标签或按钮文本较长
**Then** 内容可换行且不挤压 CTA
**And** 卡片内部链接或按钮分别可聚焦，卡片整体不包裹多个交互目标。

### Story 1.3: 支持状态和能力标签筛选

**Requirements Covered:** FR-3, FR-4, FR-29, FR-30

As a Pokopia 创作者,
I want 按项目状态和能力标签筛选 Project Card,
So that 我可以快速找到当前任务需要的工具。

**Acceptance Criteria:**

**Given** 用户在 Home Page 选择 `available` 状态筛选
**When** 项目列表更新
**Then** 页面只显示状态为 `available` 的项目
**And** 清除筛选后恢复完整项目列表。

**Given** 用户选择 Capability Tag `建筑层`
**When** 筛选生效
**Then** 列表定位到 Scene Editor
**And** 用户选择 `装饰推荐` 时列表定位到 Decor Dex。

**Given** 用户同时选择 status 和 capability filters
**When** 多个筛选条件生效
**Then** 列表只显示满足全部条件的项目
**And** filter state 反映在 URL search params 中，而不是 `localStorage`。

**Given** 筛选结果为空
**When** 列表没有匹配项目
**Then** 页面显示空结果标题、原因和清除筛选操作
**And** 不显示空白页面。

**Given** 用户只使用键盘或屏幕阅读器
**When** 操作筛选控件
**Then** filter buttons 或 checkbox 语义清楚，selected state 可通过文字/ARIA 理解
**And** focus state 可见。

### Story 1.4: 渲染可信 Entrypoint 和主 CTA

**Requirements Covered:** FR-13, FR-14, FR-15, FR-16

As a Pokopia 创作者,
I want 每个项目入口明确说明真实动作和可用性,
So that 我不会点击坏链接或误以为开发中工具已经可用。

**Acceptance Criteria:**

**Given** Project Card 有多个 Entrypoint
**When** 页面选择主 CTA
**Then** Decor Dex 在配置公开 tool URL 时展示可用工具入口
**And** Scene Editor 没有确认公开部署 URL 时不展示伪装成可用工具的启动 CTA。

**Given** Entrypoint availability 是 `disabled`、`local-only` 或 `tbd`
**When** 入口渲染在卡片或入口区
**Then** 页面展示原因或说明
**And** 不把不可用入口渲染成空链接或可点击的 public tool 按钮。

**Given** Entrypoint kind 是 `tool`、`detail`、`repo`、`docs` 或 `external`
**When** 用户查看入口按钮或链接
**Then** 文案和样式区分“打开工具”“查看详情”“查看仓库”“查看规划文档”和外部相关项目
**And** repo/docs 不使用“打开工具”文案。

**Given** 用户点击外部公开 URL
**When** 链接打开相关项目或离开 Landing Page
**Then** 链接文本或辅助说明提示目标
**And** 外部链接使用安全的 `rel="noopener noreferrer"`。

## Epic 2: 项目详情页与边界透明

用户可以进入每个项目详情页，理解项目用途、当前状态、可用路径、Source Policy、数据边界和相关项目关系。该 Epic 交付详情路由、来源/边界说明、relatedProjects 和未知项目 recovery。

### Story 2.1: 渲染 Manifest 驱动的 Project Detail Page

**Requirements Covered:** FR-8, FR-17

As a Pokopia 创作者,
I want 打开每个项目的详情页,
So that 我可以理解项目解决的问题、适合谁、当前状态和可用入口。

**Acceptance Criteria:**

**Given** 用户访问 `/projects/pokopia-decor-dex`
**When** Project Detail Page 渲染
**Then** 页面展示 Decor Dex 的问题、目标用户、核心能力、当前状态和可用 Entrypoint
**And** 说明 Pokemon 色彩、色板、偏好词、装饰推荐和可分享静态详情页。

**Given** 用户访问 `/projects/pokopia-scene-editor`
**When** Project Detail Page 渲染
**Then** 页面展示 Scene Editor 的问题、目标用户、核心能力、当前状态和可用 Entrypoint
**And** 说明 7x7 工作台、5x5 主体区、建筑层、素材实例、技能标记、预览和保存恢复。

**Given** Project Detail Page 使用 React Router
**When** route param 为 `projectId`
**Then** 页面从 validated manifest 查找项目
**And** 不使用展示名、数字 id 或硬编码项目组件作为路由 key。

**Given** 用户在详情页顶部
**When** 需要返回或继续导航
**Then** 页面提供返回 Home Page 的路径和清晰的主要/次要 Entrypoint
**And** heading hierarchy 稳定。

### Story 2.2: 展示 Source Policy、来源和数据新鲜度

**Requirements Covered:** FR-10, FR-18, FR-26, FR-27, FR-28

As a Pokopia 创作者或维护者,
I want 在详情页看到 Landing Page 读取什么、不读取什么和内容来源,
So that 我可以信任它没有越界读取相邻项目内部数据。

**Acceptance Criteria:**

**Given** Project Detail Page 渲染 Source Policy Block
**When** 用户查看项目来源说明
**Then** 页面用“本页读取 / 本页不读取”的形式展示 `displaySource`、`initializedFrom`、`doesNotRead` 和 `dataFreshness`
**And** 路径、key 或 payload 名称使用 monospace 或等价清晰样式。

**Given** 用户查看 Decor Dex 详情页
**When** Source Policy 展开或显示摘要
**Then** 页面说明 Landing Page 不读取 raw image source directories、full item manifest、image source directories、`dist/docs/pokopia_image_sources/**` 或 build-only diagnostics
**And** 页面说明项目摘要来自人工维护的 Project Manifest 和记录的初始化来源。

**Given** 用户查看 Scene Editor 详情页
**When** Source Policy 展开或显示摘要
**Then** 页面说明 Landing Page 不读取 SceneDocument save payloads、localStorage UI preferences、export files、editor build artifacts 或未来内部数据集
**And** 除非未来显式提供 Public Project Manifest，否则不暗示读取编辑器运行时数据。

**Given** Project Card 或 Project Detail Page 展示 `dataFreshness`
**When** 数据是人工维护、构建期、project-manifest 或 unknown
**Then** 页面用用户可读标签表达该来源新鲜度
**And** 不把人工维护状态描述成实时或自动同步。

**Given** manifest 包含 maintainer notes
**When** 详情页展示 notes
**Then** notes 保持短备注用途
**And** 不替代项目 PRD 或长实现说明。

### Story 2.3: 表达 Related Projects 的语义关系

**Requirements Covered:** FR-11, FR-19

As a 回访或分享用户,
I want 理解 Decor Dex 和 Scene Editor 之间的关系,
So that 我不会误以为它们已经合并、同步或共享运行时数据。

**Acceptance Criteria:**

**Given** Scene Editor manifest 记录 relatedProjects 指向 Decor Dex
**When** 用户查看 Scene Editor 详情页
**Then** 页面展示 Decor Dex 的 related project link 和关系说明
**And** 关系被描述为 key semantics / reference relationship，而不是 runtime merge。

**Given** related project id 指向存在的项目
**When** Related Project Link 渲染
**Then** 链接跳转到目标 Project Detail Page
**And** link text 同时说明目标项目和关系。

**Given** manifest 中存在缺失或拼写错误的 related project id
**When** validation 运行
**Then** 校验失败并指出源项目 id、字段路径和缺失目标 id
**And** 不在生产 UI 中静默隐藏 broken relationship。

**Given** 详情页文案描述项目关系
**When** 用户阅读关系说明
**Then** 文案使用“语义关联”“参考关系”“独立工具”等措辞
**And** 不使用会暗示运行时合并的“同步”“集成”“共享数据”等措辞。

### Story 2.4: 提供未知项目路由和详情页恢复路径

**Requirements Covered:** FR-20, FR-29, FR-30

As a 回访或分享用户,
I want 在访问未知项目链接时看到清晰恢复路径,
So that 我可以回到有效项目，而不是遇到崩溃或空白页。

**Acceptance Criteria:**

**Given** 用户访问 `/projects/not-a-project`
**When** route resolution 找不到匹配项目
**Then** 页面渲染 Not Found 状态
**And** 应用不抛出未处理错误或显示空白页面。

**Given** Not Found 状态显示
**When** 用户需要恢复
**Then** 页面提供返回 Home Page 的操作
**And** 展示或链接到有效项目选项。

**Given** 用户使用移动端或键盘访问 Not Found 状态
**When** 操作恢复按钮或链接
**Then** 恢复操作可见、可聚焦且文本清楚
**And** 不依赖 hover 或颜色传达错误含义。

## Epic 3: 可信维护、扩展与发布就绪

维护者可以安全新增第三个 Project Card；应用能独立构建，不读取相邻项目内部数据，并通过响应式、可访问性和发布前质量验证。该 Epic 交付扩展路径、数据边界验证、状态含义文案、响应式体验和发布 smoke。

### Story 3.1: 验证新增第三个 Project Card 的扩展路径

**Requirements Covered:** FR-11, FR-12

As a Pokopia 工具维护者,
I want 新增合法 Project Card 后首页、详情页和筛选自动工作,
So that 未来接入第三个 Pokopia 工具时不需要重写页面逻辑。

**Acceptance Criteria:**

**Given** 维护者在 Project Manifest 中新增一张合法第三项目卡片
**When** validation、Home Page 和 Project Detail Page 渲染
**Then** 第三项目出现在首页列表、状态筛选、能力标签筛选和详情路由中
**And** 不需要新增项目专属 route component 或 Project Card branch。

**Given** 第三项目被其他项目通过 relatedProjects 引用
**When** 相关项目链接解析
**Then** 链接使用稳定 project id 指向对应详情页
**And** 缺失目标 id 在验证阶段失败。

**Given** 开发者检查组件实现
**When** Project Card、Detail Page、Entrypoint 和 Related Project 渲染项目差异
**Then** 差异来自 manifest 数据和集中 label maps
**And** UI 组件不使用项目展示名硬编码分支。

### Story 3.2: 固化独立构建和数据边界验证

**Requirements Covered:** FR-7, FR-9, FR-21, FR-22, FR-23, FR-24

As a Pokopia 工具维护者,
I want 构建和测试证明 Landing Page 不依赖相邻项目内部数据,
So that 目录页不会退化成新的跨项目数据管道。

**Acceptance Criteria:**

**Given** 开发者运行 `pnpm build`
**When** 相邻 Pokopia 仓库不存在或没有构建产物
**Then** build 仍能只依赖 landing-page 仓库内容完成
**And** runtime bundle 只包含项目级公开 metadata。

**Given** 代码库包含 build scripts、tests、UI code 和 data helpers
**When** 数据边界检查运行
**Then** 不存在对 `../pokopia-color-pattern/dist`、raw source data、图片资产目录、build diagnostics、SceneDocument payload 或 localStorage 数据的扫描、复制或导入
**And** 任何未来 ingestion 必须通过明确的 Public Project Manifest adapter 决策。

**Given** manifest 数据非法
**When** 缺少必填字段、enum 拼写错误、重复 id 或 unknown related project id 出现
**Then** validation 在 build/test 阶段失败
**And** 错误信息可定位到 project id、字段路径和原因。

**Given** Decor Dex 或其他外部 URL 暂时不可访问
**When** 静态 build 运行
**Then** build 不因外部 URL 不可达而失败
**And** link checking 如需加入只能作为后续可选检查。

**Given** Public Project Manifest 尚未存在
**When** MVP 构建和运行
**Then** 页面使用人工维护 Project Manifest 降级展示
**And** 不执行网络请求、文件系统扫描或通用上游项目爬取。

### Story 3.3: 定义状态含义和内容治理文案

**Requirements Covered:** FR-14, FR-25, FR-26, FR-27, FR-28

As a Pokopia 创作者或维护者,
I want 明确理解每个项目状态和内容新鲜度的含义,
So that 我不会把人工维护的目录状态误解成实时监控或已上线承诺。

**Acceptance Criteria:**

**Given** status label maps 定义项目状态
**When** 页面展示 `planned`、`in-development`、`available`、`experimental`、`maintenance` 或 `archived`
**Then** 每个状态都有用户可读含义
**And** `in-development` 不暗示工具可启动。

**Given** Project Card 或详情页展示人工维护状态
**When** 用户阅读状态和 dataFreshness 文案
**Then** 页面不把手动状态描述成 real-time、live、自动同步或监控数据
**And** 维护者能区分 manual、build-time、project-manifest 和 unknown。

**Given** Entrypoint 或项目状态不可用
**When** 页面展示状态说明
**Then** 说明靠近相关入口或状态徽标
**And** 用户能理解可执行下一步，例如查看详情、查看规划文档或等待公开 URL。

**Given** 维护者需要补充短备注
**When** manifest 包含 maintainer notes
**Then** notes 用于部署未知、边界提醒或维护说明
**And** 长实现理由仍留在 architecture、PRD 或 addendum 中。

### Story 3.4: 完成响应式和可访问性发布硬化

**Requirements Covered:** FR-3, FR-4, FR-6, FR-29, FR-30

As a Pokopia 创作者,
I want Landing Page 在桌面、平板、移动端和辅助技术下都可用,
So that 我可以稳定浏览项目、筛选和进入正确入口。

**Acceptance Criteria:**

**Given** 用户在 390x844、768x1024、1024x768 和 1440x900 视口打开 Home Page
**When** 页面渲染项目卡片和筛选控件
**Then** 核心项目信息、status、tags 和 primary Entrypoints 都可见可读
**And** filter toolbar 换行后不遮挡 Project Card 或造成水平溢出。

**Given** 用户在移动端查看 Project Card 和详情页
**When** 项目名称、capability tag 或 Entrypoint 文案较长
**Then** 文本正常换行且不重叠
**And** 触控目标高度不小于 44px 或达到等价可触控面积。

**Given** 用户只使用键盘
**When** Tab 经过 filters、Project Card links、Entrypoints、related project links 和 recovery actions
**Then** 顺序符合视觉和逻辑路径
**And** focus ring 可见，Enter/Space 行为符合元素语义。

**Given** 用户使用屏幕阅读器或颜色识别受限
**When** 状态徽标、disabled/tbd/local-only 入口、空状态和 not-found 状态被读取
**Then** 文本足以理解状态、原因和下一步
**And** 颜色不是唯一信息来源。

**Given** 发布前 smoke tests 运行
**When** Playwright 或等价浏览器检查 Home、有效详情、未知详情、filter empty state 和 mobile layout
**Then** smoke tests 通过
**And** 发现的重叠、不可聚焦或不可读问题必须修复后才能关闭 story。

### Story 3.5: 记录静态部署 fallback 和发布验证入口

**Requirements Covered:** FR-20, FR-21

As a Pokopia 工具维护者,
I want 清楚知道如何静态部署并验证 Project Detail route,
So that `/projects/:projectId` 直接打开时不会因为 host 配置错误而失败。

**Acceptance Criteria:**

**Given** 项目使用 Vite SPA 和 React Router
**When** 维护者阅读部署文档
**Then** 文档说明静态 host 需要把未知路径 fallback 到 `index.html`
**And** 明确 `/projects/:projectId` 直接刷新依赖该 fallback。

**Given** 目标 host 不支持通用 SPA fallback
**When** 维护者需要替代方案
**Then** 文档说明可以添加 host-specific fallback 文件或配置
**And** 不默认把产品路由改成 hash URL。

**Given** 开发者运行发布前验证
**When** `pnpm build` 和 `pnpm smoke` 执行
**Then** Home Page、Project Detail Page、unknown project route 和 mobile smoke 都有验证路径
**And** release docs 不要求相邻 Pokopia 项目仓库存在。
