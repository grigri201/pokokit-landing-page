# Story 3.5: 记录静态部署 fallback 和发布验证入口

Status: done

## Story

As a Pokopia 工具维护者,
I want 清楚知道如何静态部署并验证 Project Detail route,
so that `/projects/:projectId` 直接打开时不会因为 host 配置错误而失败。

## Acceptance Criteria

1. Given 项目使用 Vite SPA 和 React Router, when 维护者阅读部署文档, then 文档说明静态 host 需要把未知路径 fallback 到 `index.html`, and 明确 `/projects/:projectId` 直接刷新依赖该 fallback。
2. Given 目标 host 不支持通用 SPA fallback, when 维护者需要替代方案, then 文档说明可以添加 host-specific fallback 文件或配置, and 不默认把产品路由改成 hash URL。
3. Given 开发者运行发布前验证, when `pnpm build` 和 `pnpm smoke` 执行, then Home Page、Project Detail Page、unknown project route 和 mobile smoke 都有验证路径, and release docs 不要求相邻 Pokopia 项目仓库存在。

## Tasks / Subtasks

- [x] Task 1: 编写静态部署 fallback 文档 (AC: 1, 2)
  - [x] 新增 `docs/deployment-static-fallback.md`，说明 `dist/` 是唯一部署产物，未知路径必须 fallback 到 `index.html`。
  - [x] 明确 `/projects/:projectId` 直接刷新依赖 SPA fallback。
  - [x] 说明不支持通用 fallback 的 host 可添加 host-specific fallback 文件或配置，不默认改 hash route。
- [x] Task 2: 记录发布前验证入口 (AC: 3)
  - [x] 文档列出 `pnpm build` 和 `pnpm smoke` 的职责。
  - [x] 明确 smoke 覆盖 Home、有效详情、未知详情、filter empty state 和 mobile layout。
  - [x] 明确 release docs 不要求相邻 Pokopia 项目仓库存在，也不需要 link checking 或网络访问。
- [x] Task 3: 增加文档回归测试 (AC: 1-3)
  - [x] 增加测试确认部署文档包含 fallback、direct detail route、host-specific fallback/hash route、build/smoke 和无相邻仓库要求。
  - [x] 确认 `package.json` 保留 `build` 和 `smoke` 脚本入口。
- [x] Task 4: 运行质量门禁并更新记录 (AC: 1-3)
  - [x] 运行 `pnpm typecheck`、`pnpm test`、`pnpm lint`、`pnpm build`、`pnpm smoke`。
  - [x] 更新 Dev Agent Record、File List、Change Log，并将状态推进到 review。

## Dev Notes

- Architecture 要求 `dist/` 是唯一部署产物；部署文档必须说明 `/projects/:projectId` 直接加载所需的 SPA fallback。[Source: `_bmad-output/planning-artifacts/architecture.md#deployment-structure`]
- 若 host 不能支持通用 SPA fallback，可添加 host-specific fallback 文件或部署配置；不要默认把产品路由改为 hash URL。[Source: `_bmad-output/planning-artifacts/architecture.md#routing-architecture`]
- `pnpm build` 已包含 typecheck、Vitest、Vite build 和 post-build dist boundary test；`pnpm smoke` 已覆盖 Home、有效详情、未知详情、filter empty state、mobile layout 和键盘/响应式检查。
- Story 3.2 已证明 build 不需要相邻 Pokopia repo；Story 3.5 文档必须保持这一发布假设，不要求 Decor Dex 或 Scene Editor 本地仓库存在。

### References

- `_bmad-output/planning-artifacts/epics.md#story-35-记录静态部署-fallback-和发布验证入口`
- `_bmad-output/planning-artifacts/architecture.md#deployment-structure`
- `_bmad-output/planning-artifacts/implementation-readiness-report-2026-05-19.md#warnings`
- `package.json`
- `tests/landing-page.spec.ts`

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

- 新增静态部署 fallback 文档，说明 `dist/` 是唯一部署产物，`/projects/:projectId` 直接打开/刷新依赖 host fallback 到 `index.html`。
- 文档说明 host-specific fallback 文件或配置是替代方案，不默认改 hash route。
- 文档记录 `pnpm build` / `pnpm smoke` 发布前验证入口，明确不需要相邻 Pokopia 仓库、link checking 或网络访问。
- 新增文档回归测试，锁定 fallback、direct detail route、host-specific fallback/hash route、build/smoke 和无相邻仓库要求。
- 按 code review 明确 smoke 是应用级验证，不替代最终 host rewrite 验证；补充静态资源排除、`dist/index.html` fallback 文件来源和相邻仓库复制/网络 link checking 负向断言。

### File List

- `_bmad-output/implementation-artifacts/3-5-记录静态部署-fallback-和发布验证入口.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `docs/deployment-static-fallback.md`
- `vitest/deployment-docs.test.ts`

### Change Log

- 2026-05-19: Created Story 3.5 from Epic 3 backlog and moved it to in-progress.
- 2026-05-19: Added static deployment fallback docs/tests and moved Story 3.5 to review.
- 2026-05-19: Addressed code-review findings for host fallback caveats and release-doc regression tests.
