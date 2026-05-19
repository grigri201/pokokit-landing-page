---
title: "PRD: Pokopia Ecosystem Landing Page"
status: final
created: 2026-05-18
updated: 2026-05-18
---

# PRD: Pokopia Ecosystem Landing Page

## 0. Document Purpose

本文面向 landing-page 的产品、UX、架构和后续 epic/story 拆分工作。它把现有 Product Brief 转换为可执行 PRD：先定义生态首页的产品边界、目标用户、核心旅程和术语，再按功能组列出稳定编号的功能需求，最后给出 MVP 范围、成功指标、非目标、开放问题和假设索引。本文不替代 Pokopia Decor Dex 或 Pokopia Scene Editor 各自的 PRD；它只定义 landing page 作为生态目录和路由界面的要求。

## 1. Vision

Pokopia Ecosystem Landing Page 是 Pokopia 工具体系的统一入口。用户打开它时，第一眼看到的应是当前有哪些 Pokopia 工具、每个工具解决什么问题、当前是否可用、从哪里进入、以及不同工具之间是什么关系。

第一版重点服务两个项目：Pokopia Decor Dex 和 Pokopia Scene Editor。Decor Dex 帮用户围绕 Pokemon 色彩、偏好词和装饰推荐做搭配参考；Scene Editor 帮用户用 7x7 工作台规划 5x5 Pokopia 布景、建筑层、素材实例、技能标记、预览和保存恢复。Landing Page 的价值不是把它们合成一个大应用，而是让用户在一个轻量目录里正确理解和进入它们。

产品边界必须保持克制：Landing Page 消费项目级公开元数据，不读取各项目内部运行时数据、raw assets、构建产物或保存 payload。第一版采用人工维护的 Project Manifest；未来只有当项目显式提供稳定公开 manifest 时，Landing Page 才可以读取该项目暴露的安全摘要。[ASSUMPTION: Landing Page 第一版是静态 Web App，当前仓库还没有前端实现，具体框架由后续 architecture 决定。]

## 2. Target User

### 2.1 Primary Persona

**Pokopia 创作者** 是第一版主用户。他们会在 Decor Dex 和 Scene Editor 之间切换：先为某个 Pokemon 找装饰搭配灵感，再进入布景编辑器规划 5x5/7x7 场景。他们不应该需要理解多个 Git 仓库、BMAD 产物或项目内部数据边界，才能知道“我现在要打开哪个工具”。

### 2.2 Secondary Personas

**Pokopia 工具维护者** 需要一个稳定位置展示项目状态、入口、源码/文档、数据来源和维护边界。他们新增第三个 Pokopia 项目时，应只需增加一条符合 schema 的 Project Card，不需要改首页业务逻辑。

**回访和分享用户** 可能从 Pokemon 详情页、编辑器链接、README 或社交分享进入生态页。他们需要快速理解当前工具关系，避免误以为 Decor Dex 和 Scene Editor 已经合并成一个运行时产品。

### 2.3 Jobs To Be Done

- 当我想为 Pokemon 找装饰搭配时，我想快速进入 Decor Dex，并知道它是否支持可分享详情页。
- 当我想规划 Pokopia 布景时，我想快速找到 Scene Editor，并知道它当前是可用、开发中还是只有规划入口。
- 当我从一个项目跳到生态页时，我想理解相关项目之间的关系，但不想被仓库结构或内部实现细节打断。
- 当我维护 Pokopia 工具生态时，我想用一个结构化 manifest 管理项目卡片，避免每次新增项目都改页面逻辑。
- 当一个入口暂不可用时，我想看到明确原因和替代入口，而不是空链接或构建失败。

### 2.4 Non-Users (v1)

- 需要账号、云同步、社区互动、公开方案库或跨项目统一后端的用户。
- 想在 Landing Page 内直接编辑布景、运行推荐算法或浏览完整素材数据库的用户。
- 需要自动实时项目状态同步、CI 状态看板或生产监控的维护者。

### 2.5 Key User Journeys

- **UJ-1. 创作者选择正确工具。** Pokopia 创作者打开生态首页，第一屏看到 Decor Dex 和 Scene Editor 两张项目卡片。她通过状态、标签和短描述判断 Decor Dex 已可用、Scene Editor 仍在开发中。她点击 Decor Dex 主入口查看 Pokemon 装饰推荐；之后回到生态页，从相关项目提示理解 Scene Editor 会复用 Decor Dex 的 Pokemon key 语义。

- **UJ-2. 创作者查看开发中项目的可用路径。** Pokopia 创作者想进入 Scene Editor，但项目卡片显示 `In development`。主 CTA 没有伪装成可用工具，而是展示“查看项目详情”和状态说明。她进入详情页，看到该项目的目标、核心能力、当前入口、尚未部署原因和规划文档路径。

- **UJ-3. Pokopia 工具维护者新增第三个项目。** Pokopia 工具维护者要接入新的 Pokopia 数据工具。他在 Project Manifest 中新增一条 Project Card，填入 id、name、tagline、type、status、audiences、primaryUseCases、capabilities、entrypoints、sourcePolicy 和 dataFreshness。构建时 schema 校验通过后，首页自动出现新卡片，筛选和详情页也能识别它。

- **UJ-4. 回访和分享用户从外部链接理解生态关系。** 回访和分享用户从 Decor Dex 详情页或 README 进入 Landing Page。她不需要了解仓库名，能看到 Decor Dex 和 Scene Editor 的关系说明：Decor Dex 提供 Pokemon key 语义和搭配参考，Scene Editor 是独立编辑器，不共享运行时数据或保存格式。

## 3. Glossary

- **Landing Page** — Pokopia 生态目录和路由界面；只展示项目级公开元数据和入口，不接管项目内部功能。
- **Project Manifest** — Landing Page 仓库内人工维护的结构化项目列表，是首页和详情页的主要数据源。
- **Project Card** — Project Manifest 中的一条项目记录，包含项目名称、状态、标签、入口、数据来源和维护边界。
- **Project Detail Page** — 单个项目的摘要详情页，用于解释项目解决的问题、适合谁、核心能力、入口、状态、数据来源、相关项目和非目标。
- **Entrypoint** — 用户或维护者可以点击的入口，包括公开工具、详情页、源码仓库、规划文档或外部链接。
- **Entrypoint Availability** — 入口可用性状态，包括 `available`、`disabled`、`local-only`、`tbd`。
- **Project Status** — 项目状态，包括 `planned`、`in-development`、`available`、`experimental`、`maintenance`、`archived`。
- **Capability Tag** — 用于筛选和扫描的能力标签，例如 `Pokemon 色彩`、`装饰推荐`、`7x7 画布`、`建筑层`、`保存恢复`。
- **Source Policy** — Project Card 中说明 Landing Page 可读取什么展示来源、初始化自哪些文档、明确不读取哪些项目内部数据的策略。
- **Public Project Manifest** — 未来由某个 Pokopia 项目显式提供的小型公开 manifest，只暴露安全项目摘要，不暴露内部运行时数据。
- **Pokopia Decor Dex** — Pokemon 色彩、偏好词和装饰搭配目录。
- **Pokopia Scene Editor** — 5x5/7x7 Pokopia 布景编辑器。
- **SceneDocument** — Scene Editor 的保存/恢复 payload 契约；不是 Landing Page 的目录数据源。

## 4. Information Architecture

- **Home Page** — 生态定位、项目列表、状态筛选、能力标签筛选、第一批 Project Card、入口 CTA。
- **Project Detail Page** — 每个项目一页，路径建议为 `/projects/{projectId}`。[ASSUMPTION: 项目详情页路径由 Project Card 的稳定 `id` 派生。]
- **Manifest Source** — Landing Page 仓库内的 Project Manifest，第一版建议使用 JSON 或 TypeScript 常量，并在构建时校验必填字段。
- **Developer-Oriented Links** — 本地相邻仓库路径和规划文档路径只面向维护者，不应伪装成普通用户可访问的线上入口。[ASSUMPTION: 第三方访问者不需要直接访问本地相邻仓库路径；本地路径只在开发者模式、说明文本或详情页维护者区域出现。]

## 5. Features

### 5.1 Ecosystem Home Page

**Description:** Home Page 是第一版的主体验。它不使用营销式长 hero；第一屏应直接展示 Pokopia 生态定位、项目数量、状态筛选、能力筛选和第一批 Project Card。Realizes UJ-1, UJ-2, UJ-4.

#### FR-1: 生态定位摘要

Home Page 必须展示一段简洁说明，明确 Landing Page 是 Pokopia 生态目录和路由界面，而不是合并后的运行时应用。

**Consequences (testable):**
- 第一屏可见文案说明它用于查找和进入 Pokopia 工具。
- 第一屏文案不承诺统一账号、统一后端、云同步或跨项目数据合并。

#### FR-2: 第一批项目展示

Home Page 必须展示 `pokopia-decor-dex` 和 `pokopia-scene-editor` 的 Project Card。

**Consequences (testable):**
- 两个项目卡片都显示 name、tagline、type、status、capabilities 和至少一个 Entrypoint。
- 任一项目缺少必填字段时构建校验失败或显示可定位的错误。

#### FR-3: 状态筛选

用户可以按 Project Status 筛选 Project Card。

**Consequences (testable):**
- 用户选择 `available` 时只看到状态为 `available` 的项目。
- 用户清除筛选后恢复完整项目列表。
- 空结果状态说明没有匹配项目，而不是显示空白页面。

#### FR-4: 能力标签筛选

用户可以按 Capability Tag 筛选 Project Card。

**Consequences (testable):**
- 用户选择 `建筑层` 时能定位到 Scene Editor。
- 用户选择 `装饰推荐` 时能定位到 Decor Dex。
- 筛选条件同时生效时，列表只显示满足全部条件的项目。[ASSUMPTION: MVP 使用 AND 逻辑组合多筛选条件。]

#### FR-5: 项目卡片扫描性

每张 Project Card 都必须在不打开 Project Detail Page 的情况下可快速扫描和理解。

**Consequences (testable):**
- 卡片展示项目公开名称、短描述、状态、类型、关键标签、主要用户或核心场景。
- 用户能从卡片判断“这个工具现在能不能直接打开”。

#### FR-6: 状态可访问表达

Project Status 必须同时通过文字和视觉样式表达，不能只依赖颜色。

**Consequences (testable):**
- 每个状态徽标都有可见文字。
- 颜色移除或色弱模拟下仍能区分状态含义。

### 5.2 Project Manifest and Schema

**Description:** Project Manifest 是 Landing Page 的产品数据边界。第一版由 landing-page 仓库人工维护，使用结构化 schema 描述项目级公开元数据。Realizes UJ-3.

#### FR-7: Project Card 必填字段

Project Manifest 必须要求每张 Project Card 包含 `id`、`name`、`tagline`、`type`、`status`、`audiences`、`primaryUseCases`、`capabilities`、`entrypoints`、`sourcePolicy` 和 `dataFreshness`。

**Consequences (testable):**
- 缺少任一必填字段时，构建或校验命令失败。
- 错误信息指出缺失字段和项目 id。

#### FR-8: 稳定项目 ID

每张 Project Card 必须使用稳定的 kebab-case `id`，且该 `id` 不随 `name` 展示名变化。

**Consequences (testable):**
- `pokopia-decor-dex` 和 `pokopia-scene-editor` 是第一批稳定 id。
- Detail Page route 和 relatedProjects reference 使用 `id`，不使用展示名。

#### FR-9: 枚举约束

Project Manifest 必须把 `status`、`type`、`entrypoints.kind`、`entrypoints.availability`、`sourcePolicy.displaySource` 和 `dataFreshness` 约束在文档化的 enum 值内。

**Consequences (testable):**
- 拼写错误如 `inprogress` 或 `avaliable` 被校验拦截。
- 新增 enum 值需要显式更新 schema 和状态含义文案。

#### FR-10: Source Policy 边界

每张 Project Card 必须包含 Source Policy，说明 Landing Page 可以展示什么，以及明确不能读取什么。

**Consequences (testable):**
- Decor Dex 的 Source Policy 排除 raw image source directories、full item manifest 和 build-only diagnostics。
- Scene Editor 的 Source Policy 排除 SceneDocument save payloads、localStorage UI preferences 和 editor build artifacts，除非该项目提供 Public Project Manifest。

#### FR-11: 相关项目关系

Project Manifest 可以通过稳定 project id 和关系说明表达 relatedProjects。

**Consequences (testable):**
- Scene Editor can reference Decor Dex as related because SceneDocument selectedPokemonKey uses the Decor Dex Pokemon key space.
- Related project links resolve to existing Project Detail Pages when the referenced id exists.

#### FR-12: 新项目接入无需改页面逻辑

新增一张合法 Project Card 后，Home Page 和 Project Detail Page 应能渲染该项目，不需要新增项目专属页面逻辑。

**Consequences (testable):**
- 新增第三个项目后，首页列表、筛选、详情页路由和相关项目引用能基于 manifest 自动工作。
- 不需要为每个新项目新增硬编码页面组件。

### 5.3 Project Entrypoints

**Description:** Entrypoint 是用户从生态页进入项目或项目材料的路径。入口必须区分公开工具、详情页、源码仓库、规划文档和外部链接，并明确可用性。Realizes UJ-1, UJ-2, UJ-4.

#### FR-13: 主入口 CTA

每张 Project Card 必须基于最有用且可用的 Entrypoint 展示主 CTA。

**Consequences (testable):**
- Decor Dex 在配置公开 URL 时展示可用工具入口。[ASSUMPTION: Decor Dex current public entrypoint is `https://pokopia-decor-dex.tinytoolshelf.com`.]
- Scene Editor 在没有确认公开部署 URL 时，不展示伪装成可用工具的启动 CTA。[ASSUMPTION: Scene Editor has no confirmed public deployment URL at PRD time.]

#### FR-14: 不可用入口解释

`disabled`、`local-only` 或 `tbd` 的 Entrypoint 必须展示原因或说明。

**Consequences (testable):**
- A disabled Scene Editor tool entrypoint explains that the tool is in development or deployment URL is not confirmed.
- Local repository links are labeled as local/developer-oriented.

#### FR-15: 入口类型区分

Entrypoint 必须通过视觉和文字区分 kind：`tool`、`detail`、`repo`、`docs` 或 `external`。

**Consequences (testable):**
- `打开工具` is not used for docs or repo links.
- `查看仓库` and `查看规划文档` are separate actions.

#### FR-16: 外链来源提示

外部公开 URL 必须提示用户将离开 Landing Page 或打开相关项目。

**Consequences (testable):**
- Decor Dex public site link is labeled as a tool/external entrypoint.
- User can distinguish same-site detail links from external tool links.

### 5.4 Project Detail Pages

**Description:** Project Detail Page gives each project a stable explanatory page. It summarizes the project and its boundaries without duplicating the project PRD. Realizes UJ-2, UJ-4.

#### FR-17: 项目详情摘要

每个 Project Detail Page 必须展示项目解决的问题、目标用户、核心能力、当前状态和可用 Entrypoint。

**Consequences (testable):**
- Decor Dex detail page explains Pokemon color, palette, preference terms, recommendations, and shareable static detail pages.
- Scene Editor detail page explains 7x7 workspace, 5x5 core area, building levels, item instances, skill markers, previews, and save/restore.

#### FR-18: 数据来源说明

每个 Project Detail Page 必须以用户可读形式展示 Source Policy。

**Consequences (testable):**
- Detail page states Landing Page uses Project Manifest as display source.
- Detail page states which upstream docs initialized the card when available.
- Detail page states what the Landing Page does not read.

#### FR-19: 项目关系说明

Project Detail Page 必须在存在 relatedProjects 时展示相关项目关系。

**Consequences (testable):**
- Scene Editor detail page explains Decor Dex relationship as key semantics / reference relationship, not runtime merge.
- Missing related project ids are caught by validation or displayed as broken config errors during development.

#### FR-20: Unknown Project Handling

未知项目详情路由必须展示清晰的 not-found 状态，并提供返回 Home Page 的路径。

**Consequences (testable):**
- `/projects/not-a-project` does not crash.
- Not-found state lists valid project options or links back to Home Page.

### 5.5 Data Boundary and Independence

**Description:** Landing Page must stay independently buildable and must not couple to adjacent project internals. This is the highest-risk product constraint because it prevents the directory from turning into another data pipeline. Realizes UJ-3.

#### FR-21: 独立构建

Landing Page 必须能在不依赖相邻 Pokopia 项目仓库、项目构建产物、raw assets 或本地保存 payload 的情况下构建。

**Consequences (testable):**
- A clean checkout containing only landing-page repo files can build the Landing Page.
- Missing adjacent repository paths do not fail the build.

#### FR-22: 禁止扫描内部产物

Landing Page 不得扫描或复制相邻项目的 `dist/`、raw source data、图片资产目录、build diagnostics、SceneDocument payload 或 localStorage 数据。

**Consequences (testable):**
- Source code contains no filesystem scan of `../pokopia-color-pattern/dist`, raw image source directories, or SceneDocument examples as runtime input.
- 任何未来 ingestion 都需要 Public Project Manifest 和明确 architecture decision。

#### FR-23: Public Project Manifest 未来扩展

Landing Page 可以在后续阶段支持 Public Project Manifest 集成，但 MVP 默认它是可选且不存在的。

**Consequences (testable):**
- MVP Project Manifest 可以在不获取外部项目 manifest 的情况下表达项目。
- 如果未来的 Public Project Manifest URL 缺失或不可访问，Landing Page 降级使用人工维护的 Project Card 数据。[ASSUMPTION: `project.manifest.json` is a future extension mechanism, not an MVP dependency.]

#### FR-24: 构建失败边界

非法 Project Manifest 数据应触发构建期校验失败；不可用的外部项目 URL 不应导致静态构建失败。

**Consequences (testable):**
- Missing required Project Card fields fail validation.
- A temporarily unreachable Decor Dex external URL does not fail static build, though it may be flagged by optional link checking.

### 5.6 Content Governance

**Description:** Because Project Manifest is manually maintained in v1, the PRD must define enough governance so status and links stay trustworthy without pretending to be live telemetry. Realizes UJ-3.

#### FR-25: 状态含义文案

Landing Page 必须定义 `planned`、`in-development`、`available`、`experimental`、`maintenance` 和 `archived` 的用户可读含义。

**Consequences (testable):**
- Users can infer what action is safe for each status.
- `in-development` does not imply the tool is launchable.

#### FR-26: 内容新鲜度

每张 Project Card 必须展示或暴露 dataFreshness，取值为 manual、build-time、project-manifest 或 unknown。

**Consequences (testable):**
- Users and maintainers can distinguish manually curated project summaries from future project-provided summaries.
- Manual data is not described as real-time.

#### FR-27: 更新来源记录

当内容来自规划文档时，每张 Project Card 必须记录 initializedFrom 源路径或来源标签。

**Consequences (testable):**
- Decor Dex and Scene Editor cards list their source planning artifacts in Source Policy.
- Maintainers can audit where card content came from.

#### FR-28: 维护者备注

Project Card 可以包含短 maintainer notes，但 notes 不能替代项目 PRD。

**Consequences (testable):**
- Notes can explain deployment unknowns or boundary reminders.
- Long implementation rationale belongs in architecture or addendum, not card notes.

### 5.7 Accessibility and Responsive Behavior

**Description:** Landing Page is a lightweight browsing surface. It must remain usable on desktop and mobile, and the project/status controls must be operable without relying on hover or color only.

#### FR-29: Responsive browsing

Home Page 和 Project Detail Page 必须支持桌面与移动端浏览，且不能隐藏核心项目信息。

**Consequences (testable):**
- On mobile, users can read Project Cards, status, tags, and primary Entrypoints.
- Filter controls remain usable without horizontal overflow.

#### FR-30: Keyboard and screen reader access

筛选控件、卡片和 Entrypoint 必须可键盘操作，并能被屏幕阅读器理解。

**Consequences (testable):**
- Users can tab through filters and CTAs in logical order.
- Status badges and disabled CTA notes have accessible text.

## 6. Non-Goals (Explicit)

- Landing Page will not merge `pokopia-color-pattern` and `pokopia-scene-editor` into one codebase or runtime application.
- Landing Page will not replace Decor Dex or Scene Editor PRD, architecture, UX spec, epics, stories, or sprint trackers.
- Landing Page will not run Decor Dex recommendation algorithms, OKLCH color logic, SSG generation, runtime asset manifest generation, or dist budget checks.
- Landing Page will not implement Scene Editor editing, SceneDocument v1 serialization, building level editing, material instance editing, save/restore, localStorage UI preferences, or mobile read-only enforcement.
- Landing Page will not introduce accounts, cloud sync, collaboration, comments, favorites, public scene gallery, community system, or unified backend in MVP.
- Landing Page will not scan or copy adjacent project `dist/`, raw source data, images, saved payloads, or build-only diagnostics.
- Landing Page will not promise automatic real-time project status sync unless a project explicitly provides a Public Project Manifest in a future phase.

## 7. MVP Scope

### 7.1 In Scope

- Static Home Page with ecosystem summary, status filter, capability filter, and Project Cards.
- Project Detail Page generated from Project Manifest for each project.
- Project Manifest schema and build-time validation.
- Initial Project Cards for Pokopia Decor Dex and Pokopia Scene Editor.
- Explicit Source Policy and maintenance boundary for each project.
- Entrypoints with availability states and notes.
- Text-and-visual status badges with accessible labels.
- Independent static build that does not require adjacent project build outputs.

### 7.2 Out of Scope for MVP

- Public Project Manifest ingestion from adjacent projects; deferred until a project provides a stable manifest contract.
- Screenshots, live status, version numbers, CI status, or recently updated timestamps; deferred until source of truth is confirmed.
- Runtime link health checking as a required build gate; optional later.
- Search across project docs or full-text content; filters are enough for v1.
- Analytics and click tracking; deferred until deployment and privacy posture are decided.
- Any backend, account, cloud storage, or cross-project data service.

## 8. Cross-Cutting NFRs

- **NFR-1: Independent buildability.** Landing Page must build from its own repository contents without adjacent Pokopia repos or generated artifacts.
- **NFR-2: Data minimization.** Runtime bundle must include only project-level public metadata needed for the directory experience.
- **NFR-3: Boundary safety.** Code must not import, parse, copy, or scan internal datasets from Decor Dex or Scene Editor.
- **NFR-4: Accessibility.** Interactive controls and links must be keyboard accessible and status must not rely on color alone.
- **NFR-5: Mobile readability.** Core card and detail information must remain visible and legible on mobile widths.
- **NFR-6: Maintainability.** Adding a project must primarily be a Project Manifest change plus optional content fields, not a component rewrite.
- **NFR-7: Build-time validation.** 非法 manifest 数据必须尽早失败，并提供可行动错误信息。
- **NFR-8: Graceful degradation.** 可选外部 URL、本地仓库路径或未来 public manifest 缺失时，UI 必须降级展示，且不破坏静态构建。
- **NFR-9: Clear provenance.** 项目摘要必须暴露 display source 和 initializedFrom 引用，供维护者审计。
- **NFR-10: No real-time claims.** 人工维护的项目状态不得被呈现为实时或自动同步状态。
- **NFR-11: Link clarity.** 公开工具链接、站内详情链接、docs 链接、repo 链接和 local-only 路径必须可区分。
- **NFR-12: Performance.** 在初始项目列表和小规模未来扩展范围内，Home Page 应从静态 bundle 渲染核心内容，不依赖外部运行时数据请求。目标：典型移动宽带连接下，首个有意义的项目列表在 2 秒内可见；本地 production preview 下在 1 秒内可见。[ASSUMPTION: MVP project count remains small enough for static in-bundle manifest rendering.]

## 9. Aesthetic and Tone

The Landing Page should feel like a compact tool index, not a marketing landing page. The first viewport should prioritize project discovery and entry actions over decorative hero content. Tone should be clear, practical, and boundary-aware: it should tell users what each tool does, what is available now, and what is not part of this surface.

Visual treatment should support scanning and comparison: restrained sections, status chips with text labels, capability tags, and clear CTAs. Decorative elements should not obscure project state or make unavailable tools look launchable.

## 10. Initial Project Records

### 10.1 Pokopia Decor Dex

- **id:** `pokopia-decor-dex`
- **name:** Pokopia Decor Dex
- **type:** `dex`
- **status:** `available`
- **tagline:** Pokemon 色彩、偏好词和装饰搭配的 Pokopia 图鉴。
- **primary use cases:** 查看 Pokemon 主色和色板；寻找符合偏好词和色彩规则的装饰物品；分享或直接访问 Pokemon 详情页。
- **capabilities:** `Pokemon 色彩`、`装饰推荐`、`静态详情页`、`可分享链接`、`runtime assets`
- **entrypoints:** public tool URL, local repository link, optional detail page.
- **source boundary:** Landing Page does not read raw Pokopia source, full item manifest, image source directories, `dist/docs/pokopia_image_sources/**`, or build-only diagnostics.

### 10.2 Pokopia Scene Editor

- **id:** `pokopia-scene-editor`
- **name:** Pokopia Scene Editor
- **type:** `editor`
- **status:** `in-development`
- **tagline:** 用 7x7 工作台制作、预览、保存和恢复 5x5 Pokopia 布景。
- **primary use cases:** 规划 5x5 主体区和外围装饰区；表达 0 层到 n 层建筑层；标记素材实例技能、染色、朝向和备注；通过俯视图和正视图检查布景并保存恢复。
- **capabilities:** `7x7 画布`、`建筑层`、`素材摆放`、`技能标记`、`保存恢复`、`Mobile view-only`
- **entrypoints:** project detail page, local repository link, planning docs link; public tool URL remains TBD.
- **source boundary:** Landing Page does not read SceneDocument save payloads, localStorage UI preferences, export files, editor build artifacts, or future internal datasets unless a Public Project Manifest is explicitly provided.

## 11. Success Metrics

**Primary**

- **SM-1: Tool selection clarity.** A user can identify which of the two initial tools fits their task, whether it is currently usable, and the next action within 30 seconds. Validates FR-1, FR-2, FR-5, FR-13.
- **SM-2: Independent build.** A clean checkout of landing-page can build successfully without adjacent Pokopia project build artifacts. Validates FR-21, FR-22, NFR-1.
- **SM-3: Project addition path.** Adding a valid third Project Card renders it on Home Page and Project Detail Page without component rewrites. Validates FR-7, FR-12.

**Secondary**

- **SM-4: Boundary comprehension.** Project Detail Pages make it clear that Landing Page is not reading Decor Dex runtime data or Scene Editor SceneDocument data. Validates FR-18, FR-21, FR-22.
- **SM-5: Entry reliability.** No visible CTA points to an unavailable tool without a status explanation. Validates FR-14, FR-15.

**Counter-metrics (do not optimize)**

- **SM-C1: Number of copied upstream data files.** This should remain zero. More copied data is a regression, not richness.
- **SM-C2: Number of hardcoded project-specific components.** This should not grow with each new project; the manifest should carry project variation.
- **SM-C3: Apparent feature breadth.** Do not make the Landing Page look like it supports editing, recommendation, cloud sync, or merged project workflows when it only routes to tools.

## 12. Constraints and Guardrails

- **Static-first constraint:** MVP should not require a backend or authenticated API.[ASSUMPTION: First release does not need accounts, backend APIs, or cloud state.]
- **Manual truth constraint:** Project Manifest is the source of truth for v1 project display, even when initialized from adjacent planning docs.
- **No internal ingestion constraint:** Adjacent project internals must remain out of Landing Page runtime and build pipeline.
- **Status honesty constraint:** A project with no confirmed public URL must be shown as in development, local-only, disabled, or TBD rather than launchable.
- **Terminology constraint:** Use Glossary terms consistently; especially `Project Manifest`, `Project Card`, `Entrypoint`, `Source Policy`, and `Public Project Manifest`.

## 13. Open Questions

1. Landing Page 的最终公开域名或部署 URL 是什么？Owner: deployment/maintainer. Revisit before release deployment.
2. Decor Dex 的公开 URL 是否就是 MVP 最终入口，还是应在部署前保持可配置？Owner: deployment/maintainer. Revisit when Project Manifest implementation starts.
3. Scene Editor 可用后应使用什么公开 URL？Owner: Scene Editor maintainer. Revisit when Scene Editor has a deployed entrypoint.
4. 本地仓库和规划文档路径是否对所有用户可见，还是隐藏在 maintainer/developer 区域？Owner: UX. Revisit during `bmad-create-ux-design`.
5. v1 是否包含项目截图；如果包含，截图是人工维护资产还是由未来 Public Project Manifest 提供？Owner: UX + architecture. Revisit during UX and architecture planning; non-blocking for MVP without screenshots.
6. 筛选状态应保存在 URL query parameters、localStorage，还是刷新后重置？Owner: UX + architecture. Revisit during interaction design and routing/data-state decisions.
7. 第一个静态实现完成后，Landing Page 是否应在 CI 中加入可选 link checking？Owner: architecture/dev. Revisit after first deployment pipeline exists.
8. Architecture 应为 Project Manifest 选择哪种 schema library 或校验方法？Owner: architecture. Revisit during `bmad-create-architecture`.

## 14. Assumptions Index

以下假设已完成 triage；它们不阻塞 PRD finalization。后续 workflow 应按 owner 和 revisit 条件处理。

- §1 — Landing Page 第一版是静态 Web App，当前仓库还没有前端实现，具体框架由后续 architecture 决定。Owner: architecture. Revisit during `bmad-create-architecture`.
- §4 — 项目详情页路径由 Project Card 的稳定 `id` 派生。Owner: architecture. Revisit during routing/data model design.
- §4 — 第三方访问者不需要直接访问本地相邻仓库路径；本地路径只在开发者模式、说明文本或详情页维护者区域出现。Owner: UX. Revisit during `bmad-create-ux-design`.
- FR-4 — MVP 使用 AND 逻辑组合多筛选条件。Owner: UX. Revisit during filter interaction design.
- FR-13 — Decor Dex 当前公开入口是 `https://pokopia-decor-dex.tinytoolshelf.com`。Owner: deployment/maintainer. Revisit when Project Manifest values are implemented.
- FR-13 — PRD 完成时 Scene Editor 还没有确认公开部署 URL。Owner: Scene Editor maintainer. Revisit when Scene Editor deployment exists.
- FR-23 — `project.manifest.json` 是未来扩展机制，不是 MVP 依赖。Owner: architecture. Revisit only if a project offers a stable Public Project Manifest.
- NFR-12 — MVP 项目数量足够小，适合静态 bundle 内 manifest 渲染。Owner: architecture/dev. Revisit if project count grows enough to affect bundle size or filtering UX.
- §12 — 第一版不需要账号、后端 API 或云端状态。Owner: product/architecture. Revisit only if future scope adds user-specific state.
