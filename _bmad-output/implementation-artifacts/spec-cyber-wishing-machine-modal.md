---
title: 'Cyber Wishing Machine header icon and modal'
type: 'feature'
created: '2026-05-29'
status: 'done'
baseline_commit: 'aef199eb2e21356d6acfe469eb014e6d610ce3d4'
context:
  - '{project-root}/_bmad-output/planning-artifacts/ux-design-specification.md'
  - '{project-root}/_bmad-output/planning-artifacts/architecture.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Home 页需要把 Scene Editor 放到项目列表左侧，并在 header 的 GitHub 图标左边加入一个使用用户提供图片的 @赛博许愿机入口。点击这个入口后，用户应看到一个像聊天界面的 modal，用轻量、可关闭的方式展示作者说明、勘误渠道和进度吐槽。

**Approach:** 保持现有 Compact Trust Index 首页和 header 结构，只调整 manifest 渲染顺序并在 `HomeRoute` 内新增一个可访问的作者 modal。新增图片作为 landing-page 自有小型站点资产放在 `public/`，复用同一张图作为 header icon 和 modal 左侧头像，不读取相邻项目运行时资产。

## Boundaries & Constraints

**Always:** Scene Editor 必须在默认首页两列布局中位于左侧；新增作者图标必须在 GitHub 链接左边，并且 hover/focus title 显示 `@赛博许愿机`；modal 必须可通过点击图标打开、点击关闭按钮/遮罩或按 Escape 关闭；对话框内容必须包含用户给出的三段中文文案，其中 issue 链接指向 `https://github.com/grigri201/pokokit-landing-page/issues/new`，QQ 号保持 `3693767633`；移动端不能产生水平溢出，暗色主题仍可读。

**Ask First:** 如果需要改变项目 schema、引入第三方 modal/tooltip/icon 库、把新增入口做成外链或可追踪 analytics 事件，先暂停确认。

**Never:** 不新增营销式 hero、不把作者 modal 文案写进 Project Card、不把 Scene Editor/Decor Dex 的运行时资产复制进本仓库、不移除现有 GitHub/语言/主题入口、不让 modal 只能鼠标操作。

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| 首页默认渲染 | 访问 `/`，manifest 含 Decor Dex 与 Scene Editor | Scene Editor 卡片在列表中先于 Decor Dex；header 操作顺序包含 theme、language、@赛博许愿机、GitHub | 不适用 |
| 打开作者 modal | 点击 @赛博许愿机图标按钮 | 页面出现 `dialog`，左侧显示同一张图片，右侧显示三条聊天气泡文案，issue 文本是可点击链接 | 关闭按钮、遮罩和 Escape 均可恢复到首页 |
| 英文模式 | 用户切换到英文 | 既有英文项目文案保持；作者按钮 title/tooltip 仍按需求显示 `@赛博许愿机`，modal 内容保持用户指定中文 | 不适用 |
| 窄屏/暗色 | 390px 宽或 `data-theme="dark"` | header 图标不挤出视口；modal 改为可读的单列/紧凑布局，无水平溢出 | 不适用 |

</frozen-after-approval>

## Code Map

- `src/routes/HomeRoute.tsx` -- 首页 header、项目列表渲染、语言/主题按钮和 GitHub 链接所在位置；适合承载作者按钮与 modal 状态。
- `src/routes/HomeRoute.test.tsx` -- HomeRoute 单元/DOM 行为断言；需要覆盖顺序、图标、modal 打开/关闭和 issue 链接。
- `src/data/projects.ts` -- 默认 manifest 项目顺序来源；可用最小改动让 Scene Editor 先渲染。
- `src/styles/layout.css` -- header control、project grid、modal、暗色主题和响应式样式集中位置。
- `tests/landing-page.spec.ts` -- Playwright smoke 与响应式/键盘验证；需要覆盖新增 tab 顺序和 modal 基本可用性。
- `public/cyber-wishing-machine-icon.png` -- 从用户提供的第一张图片生成/复制的小型站点资产。

## Tasks & Acceptance

**Execution:**
- [x] `public/cyber-wishing-machine-icon.png` -- 从 `/Users/grigri/Downloads/ChatGPT Image 2026年5月18日 12_15_57.png` 生成站点可用图片资产 -- 支持 header icon 与 modal avatar。
- [x] `src/data/projects.ts` -- 调整默认项目数组顺序，让 `pokopia-scene-editor` 位于 `pokopia-decor-dex` 前 -- 让两列桌面布局中 Scene Editor 落在左侧。
- [x] `src/routes/HomeRoute.tsx` -- 新增作者图标按钮、modal 状态、聊天内容、issue 链接和关闭交互 -- 满足用户指定入口与弹窗行为。
- [x] `src/styles/layout.css` -- 为作者图标、modal、聊天布局、遮罩、暗色和移动端布局补齐样式 -- 保持现有视觉系统和无溢出约束。
- [x] `src/routes/HomeRoute.test.tsx` -- 增加 DOM 行为测试 -- 覆盖首页顺序、tooltip/title、modal 内容、issue 链接和关闭。
- [x] `tests/landing-page.spec.ts` -- 更新键盘顺序并增加作者 modal smoke -- 防止新增按钮破坏可访问主路径。

**Acceptance Criteria:**
- Given 用户访问首页, when 项目列表渲染, then `Pokopia Scene Editor` 卡片在 DOM 与视觉顺序上都先于 `Pokopia Decor Dex`。
- Given 用户 hover/focus header 新增图标, when 浏览器显示 title, then 文案为 `@赛博许愿机`，且该图标位于 GitHub 链接左边。
- Given 用户点击新增图标, when modal 打开, then 左侧展示用户提供图片，右侧展示三条聊天气泡，其中 `[发 issue]` 链接打开指定 GitHub issue URL。
- Given modal 已打开, when 用户点击关闭按钮、遮罩或按 Escape, then modal 关闭且首页操作可继续。
- Given 运行中文/英文模式、light/dark 主题和移动端宽度, when 首页渲染, then header、Project Card 和 modal 不发生水平溢出或文字遮挡。

## Spec Change Log

## Design Notes

作者入口是 header utility control，不进入 Project Manifest schema；这样可避免把站点作者说明误建模成 Pokopia 工具卡片。modal 文案保持中文，因为用户指定了具体中文内容；英文模式只保证周边 chrome 的既有英文切换不被破坏。

## Verification

**Commands:**
- `pnpm test -- HomeRoute.test.tsx` -- expected: HomeRoute 单元测试通过。
- `pnpm run typecheck` -- expected: TypeScript 构建检查通过。
- `pnpm run smoke` -- expected: Playwright smoke 覆盖首页、键盘顺序、响应式与作者 modal。
- `pnpm run build` -- expected: 完整 build/test/dist-boundary gate 通过。
- `git diff --check` -- expected: 无 whitespace 错误。

## Suggested Review Order

**Entry Point And Modal Behavior**

- Header copy, trigger order, modal state, focus trap, and inert background.
  [`HomeRoute.tsx:36`](../../src/routes/HomeRoute.tsx#L36)

- Author button sits before GitHub and opens the dialog.
  [`HomeRoute.tsx:241`](../../src/routes/HomeRoute.tsx#L241)

- Chat modal renders the supplied avatar, messages, issue link, and close control.
  [`HomeRoute.tsx:296`](../../src/routes/HomeRoute.tsx#L296)

**Project Ordering**

- Scene Editor is prioritized before other validated manifest projects.
  [`projects.ts:125`](../../src/data/projects.ts#L125)

**Styling And Responsive States**

- Header icon shares the existing circular control system.
  [`layout.css:54`](../../src/styles/layout.css#L54)

- Modal surface, bubbles, dark theme, and mobile sizing live with layout CSS.
  [`layout.css:181`](../../src/styles/layout.css#L181)

- Mobile header and modal constraints preserve touch targets and no overflow.
  [`layout.css:1072`](../../src/styles/layout.css#L1072)

**Tests And Assets**

- DOM tests cover order, title, image, modal content, inert, and focus wrap.
  [`HomeRoute.test.tsx:136`](../../src/routes/HomeRoute.test.tsx#L136)

- Browser smoke covers keyboard order, focus trap, Escape, close, backdrop, mobile, and dark mode.
  [`landing-page.spec.ts:147`](../../tests/landing-page.spec.ts#L147)

- Static icon asset is a 512px PNG derived from the supplied image.
  [`cyber-wishing-machine-icon.png`](../../public/cyber-wishing-machine-icon.png)
