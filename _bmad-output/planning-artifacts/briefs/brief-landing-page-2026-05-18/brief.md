---
title: "Product Brief: Pokopia Ecosystem Landing Page"
status: draft
created: 2026-05-18
updated: 2026-05-18
---

# Product Brief: Pokopia Ecosystem Landing Page

## 摘要

Pokopia Ecosystem Landing Page 是一个统一整合目录，用来把分散的 Pokopia 相关工具、资料和项目入口组织成一个可浏览、可比较、可继续扩展的生态首页。第一版聚焦两个处于规划、开发或可用状态的工具：Pokopia Decor Dex 和 Pokopia 5×5/7×7 Scene Editor。它不是新的大一统应用，也不是替代各项目 PRD 的上层 PRD；它的职责是帮助用户判断“我现在要用哪个 Pokopia 工具、它能解决什么问题、当前状态如何、从哪里进入、从哪里查看项目背景”。

第一版应采用轻量、可维护的目录模型：由 landing-page 仓库维护一份 project manifest，人工确认每个项目的公开名称、定位、入口、状态、能力标签、数据来源和外链策略。各项目自己的静态数据、构建产物和运行时资产不应被 landing page 直接读取或复制，除非该项目明确提供稳定的公开 manifest。这样可以避免把 Decor Dex 的运行时资产边界、Scene Editor 的 SceneDocument 数据契约和未来项目的内部实现耦合到目录页。

## 目标用户与核心场景

**Pokopia 创作者。** 他们想快速找到适合当前任务的工具：为 Pokemon 找装饰搭配时进入 Decor Dex；要规划一个 5×5 布景并记录建筑层、素材、技能标记和预览时进入 Scene Editor。成功标准是用户不用理解仓库结构，也能在首页上看懂每个工具的用途、状态和入口。

**Pokopia 工具维护者。** 他们需要一个稳定位置展示工具状态、公开入口、源码仓库、数据来源、维护边界和后续项目接入方式。成功标准是新增工具不需要改首页业务逻辑，只需要提交符合 schema 的 project card。

**回访和分享用户。** 他们可能从某个 Pokemon 详情页、布景编辑器链接、README 或社交分享进入生态页。成功标准是他们能从一个工具跳到相关工具，理解两个工具之间的关系，但不会误以为两个工具已经合并为同一个产品。

## 第一版必须展示的项目信息

首页必须以项目卡片为核心，每个卡片至少展示：

- 项目公开名称、短描述和一句话用途。
- 项目类型：目录、推荐工具、编辑器、资料库、实验原型等。
- 当前状态：规划中、开发中、可用、实验、维护中、已归档。
- 主要用户和核心使用场景。
- 关键能力标签，例如 `Pokemon 色彩`、`装饰推荐`、`静态详情页`、`7×7 画布`、`建筑层`、`保存恢复`。
- 主入口 CTA：打开工具、查看详情、查看仓库。不可用入口必须显示状态原因，而不是放空链接。
- 数据和内容来源：人工维护 manifest、项目 README、项目规划文档、项目公开 manifest、构建产物。
- 维护边界：landing page 只展示和路由，不接管该项目的数据生成、保存格式、推荐算法或编辑逻辑。

第一批项目初始定义：

| Project ID | 展示名称 | 类型 | 第一版定位 | 首要入口策略 |
| --- | --- | --- | --- | --- |
| `pokopia-decor-dex` | Pokopia Decor Dex | Pokemon 色彩与装饰搭配目录 | 为每只 Pokopia Pokemon 展示主色、色板、偏好词、推荐装饰和可分享详情页 | 指向公开站点和 `/pokemon/{slug}/` 详情页能力；详情页解释数据来源、推荐规则和构建边界 |
| `pokopia-scene-editor` | Pokopia Scene Editor | 5×5/7×7 布景编辑器 | 用 7×7 工作台表达 5×5 主体区、外围装饰区、建筑层、素材实例、技能标记、预览和保存恢复 | 若工具尚未部署，CTA 显示开发状态和仓库/规划入口；部署后指向编辑器入口 |

## Project Card Schema

每个项目接入 landing page 时必须提供一条结构化 project card。第一版 schema 应保持人工可维护，优先使用 `JSON` 或 `TypeScript` 常量，并在构建时校验必填字段。

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `id` | 是 | 稳定 kebab-case key，不随展示名变化。 |
| `name` | 是 | 首页展示名称。 |
| `tagline` | 是 | 一句话说明用户能用它做什么。 |
| `type` | 是 | `directory`、`dex`、`editor`、`data-tool`、`prototype` 等枚举。 |
| `status` | 是 | `planned`、`in-development`、`available`、`experimental`、`maintenance`、`archived`。 |
| `audiences` | 是 | 主要用户群，例如创作者、维护者、回访用户。 |
| `primaryUseCases` | 是 | 3-5 个用户可理解的使用场景。 |
| `capabilities` | 是 | 用于筛选和卡片标签的能力词。 |
| `entrypoints` | 是 | `primaryUrl`、`detailPath`、`repoPath`、`docsPath`，每个入口带可用状态。 |
| `sourcePolicy` | 是 | landing page 从哪里读取公开展示内容，以及明确不读取什么。 |
| `dataFreshness` | 是 | 人工维护、随构建更新、来自项目 manifest、未知。 |
| `relatedProjects` | 否 | 相关项目 ID 和关系说明，例如 Decor Dex 为 Scene Editor 提供 Pokemon key 语义。 |
| `badges` | 否 | 展示型状态徽标，例如 `Static Pages`、`Local Save`、`Mobile Read-only`。 |
| `notes` | 否 | 面向维护者的短备注，不替代项目 PRD。 |

schema 的关键约束是：目录页只消费“项目级公开元数据”。任何项目内部运行时数据都必须通过该项目明确暴露的 manifest 进入目录页，不能由 landing page 自行扫描 `dist/`、复制 assets、解析 SceneDocument 或读取 build-only 数据。

## 数据读取与维护策略

第一版应采用 **人工维护 manifest 为主、项目文档为初始化来源、项目公开 manifest 为未来扩展** 的策略。

**需要读取的内容。** 本次初始化可以从两个项目的 PRD、architecture、UX spec、epics 和 project-context 中提炼卡片文案、状态、能力标签和约束。后续维护时，landing page 应优先读取本仓库内的 project manifest；项目 README 只适合作为公开文案补充，不应作为唯一事实来源。

**不默认读取的内容。** 不直接读取各项目的静态数据、构建产物、raw assets 或本地保存 payload。Decor Dex 已明确将 raw Pokopia source 与 production runtime boundary 分离，landing page 不应重新引入 `docs/pokopia_image_sources/**` 这类重数据。Scene Editor 的 SceneDocument v1 是编辑器保存/恢复契约，不是生态目录的数据源。

**未来可接入的内容。** 如果某个项目需要在目录页展示动态状态，应由该项目提供小型公开 manifest，例如 `project.manifest.json`，只包含名称、版本、更新时间、可用入口、公开截图、状态徽标和安全的统计摘要。目录页可以读取这个 manifest，但不越权推断项目内部实现。

## 页面与导航范围

**首页。** 首页展示生态定位、项目列表、状态筛选、能力标签筛选和第一批项目卡片。首页不做营销式长 hero；第一屏应直接让用户看到项目和入口。

**项目详情页。** 每个项目详情页解释项目解决的问题、适合谁、核心功能、入口、状态、数据来源、相关项目和不属于该项目的内容。详情页可以引用对应 PRD/README，但应保持摘要性质。

**工具入口。** 所有工具入口必须区分 `打开工具`、`查看详情`、`查看仓库`、`查看规划文档`。外部工具未部署时，按钮保持可见但禁用或降级到详情页，并说明状态。

**状态标识。** 状态必须同时通过文本和视觉标识表达，不只靠颜色。建议第一版使用：`Available`、`In development`、`Planned`、`Experimental`、`Archived`，并为每个状态定义用户含义。

**外链策略。** 外链分为公开工具链接、同仓文档链接、相邻仓库链接和未来社交/分享链接。打开外部公开站点时应清楚标识来源；相邻仓库路径只用于开发者或本地文档，不应伪装成用户可访问的线上入口。

## 明确不做

- 不把 `pokopia-color-pattern` 和 `pokopia-scene-editor` 合并成一个代码库或一个运行时应用。
- 不替代两个项目各自的 PRD、architecture、UX spec、epics 或 story tracker。
- 不接管 Decor Dex 的推荐算法、OKLCH 色彩逻辑、SSG 页面生成、runtime asset manifest 或 dist budget。
- 不接管 Scene Editor 的 SceneDocument v1、建筑层模型、素材实例编辑、保存恢复、localStorage UI 偏好或移动端只读边界。
- 不在第一版引入账号、云同步、跨项目统一后端、公开方案库、评论、收藏或社区系统。
- 不扫描或复制各项目的 `dist/`、raw source data、图片资产、保存 payload 或 build-only diagnostics。
- 不承诺项目状态自动实时同步；除非项目提供公开 manifest，否则状态由 landing-page manifest 人工维护。

## 成功标准

第一版成功时，用户打开 landing page 后可以在 30 秒内判断两个工具分别用于什么、当前能不能使用、从哪里进入、两者如何关联、以及哪些能力仍在规划或开发中。维护者新增第三个 Pokopia 项目时，只需要增加一条通过 schema 校验的 project card，不需要改首页组件逻辑。

构建层面，landing page 应能在没有两个相邻项目构建产物的情况下独立构建；缺少外部入口或项目 manifest 时显示明确降级状态，而不是构建失败。目录页的产品边界保持清晰：它是 ecosystem index 和 routing surface，不是项目数据仓库。
