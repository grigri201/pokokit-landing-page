# 静态部署 Fallback 和发布验证

Landing Page 是 Vite SPA。部署时只发布 `dist/`，不需要相邻的 `pokopia-color-pattern`、`pokopia-scene-editor` 仓库、它们的构建产物、图片资产或本地保存数据。

## 必需 Fallback

静态 host 必须把未知路径 fallback 到 `index.html`。原因是 Project Detail 使用 React Router 路由，例如：

- `/projects/pokopia-decor-dex`
- `/projects/pokopia-scene-editor`
- `/projects/not-a-project`

这些路径在 `dist/` 中不会各自生成独立 HTML 文件。用户直接打开或刷新 `/projects/:projectId` 时，host 需要返回 `index.html`，再由前端路由渲染有效详情页或未知项目恢复页。

## Host-Specific 适配

如果目标 host 支持 SPA fallback，请在 host 配置中把 app routes 的未知路径 rewrites 到 `index.html`。静态资源请求仍应先按文件系统命中，缺失的 `/assets/*`、带扩展名的文件路径或其他站点资产不应被当成应用路由静默返回 shell。

如果目标 host 不支持通用 SPA fallback，可以添加 host-specific fallback 文件或部署配置，例如将同一次 build 输出的 `dist/index.html` 复制为该 host 需要的 fallback 文件，或在部署平台配置 rewrite。不要默认把产品路由改成 hash URL；只有在选定 host 明确无法支持 fallback 且后续架构决策批准时，才考虑 hash route。

## 发布前验证

发布前至少运行：

```sh
pnpm build
pnpm smoke
```

`pnpm build` 会执行 typecheck、Vitest、Vite production build 和构建产物边界检查。它不执行外部 link checking，不要求外部 URL 可访问，也不读取相邻 Pokopia 项目仓库。

`pnpm smoke` 使用本地 Vite server 做应用级 smoke，验证：

- Home Page 可以渲染 Project Cards。
- 有效 Project Detail route 可以直接打开。
- unknown project route 和 wildcard route 显示恢复路径。
- filter empty state 有清除操作。
- mobile layout、响应式视口、键盘路径和可访问文本保持可用。

如果 `pnpm smoke` 在本地通过，但部署后的 `/projects/:projectId` 直接刷新失败，优先检查 host fallback，而不是修改应用路由。

`pnpm smoke` 不能替代最终 host 的 rewrite 验证。发布到目标 host 后，还需要直接打开或刷新 `/projects/pokopia-scene-editor` 和 `/projects/not-a-project`，确认 host 返回应用 shell，并且缺失静态资源仍按资源请求失败而不是被改写成应用页面。
