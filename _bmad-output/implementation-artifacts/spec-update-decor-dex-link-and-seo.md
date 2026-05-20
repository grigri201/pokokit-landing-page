---
title: 'Update Decor Dex Link and SEO'
type: 'feature'
created: '2026-05-20T10:16:21+0800'
status: 'in-review'
baseline_commit: 'd78373bd718e6b60bcc8ddcc586c2d490dfa6831'
context: []
---

<frozen-after-approval reason="human-owned intent -- do not modify unless human renegotiates">

## Intent

**Problem:** Landing Page 仍把 Pokopia Decor Dex 指向旧的公开入口，`index.html` 也只有基础 title/viewport，搜索结果和社交分享无法用英文清楚表达 pokokit 是 Pokopia tool directory。

**Approach:** 将 Decor Dex primary tool entrypoint 统一更新为 `https://decor-dex.pokokit.com`，并补齐不依赖最终 landing page 域名的静态 SEO metadata。SEO 文案和 `<title>` 必须使用英文，围绕 pokokit、Pokopia tool directory、Decor Dex、Scene Editor、状态与入口发现，不改变页面运行时结构。

## Boundaries & Constraints

**Always:** 保持 Landing Page 只消费本仓库的人工 project manifest；外部公开 URL 必须是 `https://`；Decor Dex CTA、中文/英文测试断言、manifest 校验必须一致；SEO metadata 必须静态存在于 `index.html`，并可由测试直接验证；构建不能访问外网，也不能因为 Decor Dex URL 暂时不可达而失败。

**Ask First:** 如果需要写入 landing page 自己的 canonical URL、`og:url`、绝对分享图 URL 或最终部署域名，先询问用户，因为当前规划文档仍记录 landing page 正式公开域名未确认。

**Never:** 不读取、复制或扫描相邻 `pokopia-color-pattern` / `pokopia-scene-editor` 仓库、它们的 `dist/`、raw image source、SceneDocument、完整 item manifest 或 build-only diagnostics；不加入 analytics、tracking pixel、外部 link checking、网络请求、API key 或私有 URL；不把 Scene Editor 改成可启动工具入口。

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Decor Dex public link | 用户在中文或英文首页打开 Pokopia Decor Dex 卡片 CTA | CTA `href` 为 `https://decor-dex.pokokit.com`，仍使用 `rel="noopener noreferrer"` | URL 必须通过现有 public URL schema 校验 |
| Static SEO metadata | 搜索引擎、爬虫或分享预览只读取 `index.html` | 英文 `title`、`description`、robots、Open Graph 和 Twitter summary metadata 描述 pokokit/Pokopia tool directory | 没有确认 landing page 域名时不输出臆造 canonical 或 `og:url` |
| Build boundary | `pnpm build` 在只有 landing-page 仓库的 checkout 中运行 | typecheck、Vitest、Vite build 和 dist boundary test 成功 | 不执行外部 URL 探测；外部 URL 不可访问也不阻断 build |

</frozen-after-approval>

## Code Map

- `src/data/projects.ts` -- 人工维护的 Project Manifest；Decor Dex primary entrypoint 的当前旧 URL 位于这里。
- `src/routes/HomeRoute.test.tsx` -- 首页中文/英文 CTA 行为断言，目前硬编码旧 Decor Dex URL。
- `index.html` -- Vite 静态 HTML shell；当前 SEO 只有基础 title/viewport，适合补静态 metadata。
- `vitest/dist-boundary.test.ts` -- build 后边界测试；需要确保新增 SEO 内容不引入相邻项目路径、网络读取或禁用 runtime token。
- `_bmad-output/planning-artifacts/prds/prd-landing-page-2026-05-18/prd.md` -- 记录 landing page 最终公开域名未确认，以及外部 URL 不应阻断静态构建。

## Tasks & Acceptance

**Execution:**
- [x] `src/data/projects.ts` -- 将 `decor-dex-public-tool.href` 改为 `https://decor-dex.pokokit.com`，并把 maintainer note 从“发布前待复核”调整为已确认公开入口的中性说明。
- [x] `src/routes/HomeRoute.test.tsx` -- 更新中文和英文首页 CTA 断言，确保 Decor Dex 卡片链接指向新域名且安全外链属性保留。
- [x] `index.html` -- 增强静态 SEO metadata：更明确的英文 title、description、robots、Open Graph locale/site/type/title/description、Twitter summary/title/description；不要添加需要最终 landing page 域名的 canonical 或 `og:url`。
- [x] `vitest/seo-metadata.test.ts` -- 新增 HTML metadata 回归测试，读取 `index.html` 并断言英文 SEO 文案存在、没有旧 Decor Dex URL、没有臆造 canonical/`og:url`。

**Acceptance Criteria:**
- Given 用户看到 Decor Dex 卡片, when 点击主 CTA, then 打开的公开工具入口是 `https://decor-dex.pokokit.com`。
- Given 英文模式渲染首页, when 查询 `Open Decor Dex Tool` 链接, then 其 `href` 同样是 `https://decor-dex.pokokit.com`。
- Given crawler 只读取 `index.html`, when 解析 head metadata, then 能获得英文 pokokit/Pokopia tool directory 相关的 title、description、Open Graph 和 Twitter summary 信息。
- Given landing page 正式部署域名尚未确认, when 检查 `index.html`, then 不存在硬编码 canonical URL 或 `og:url`。
- Given 维护者运行 `pnpm build`, when 测试和构建完成, then 不因为外部 Decor Dex URL 可达性或相邻 Pokopia 项目状态而失败。

## Spec Change Log

- 2026-05-20: Human requested SEO language to be English, including title. Updated frozen intent, metadata task wording, and acceptance criteria to require English SEO/title while preserving the no-canonical/no-`og:url` boundary.

## Verification

**Commands:**
- `pnpm test` -- expected: Vitest suites pass, including HomeRoute and SEO metadata regression.
- `pnpm build` -- expected: typecheck, Vitest, Vite production build, and `vitest/dist-boundary.test.ts` pass.
