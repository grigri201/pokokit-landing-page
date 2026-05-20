# 静态根页面部署和发布验证

Landing Page 是只发布根路径的 Vite 静态页面。部署时只发布 `dist/`，不需要相邻的 `pokopia-color-pattern`、`pokopia-scene-editor` 仓库、它们的构建产物、图片资产或本地保存数据。

## 路径边界

公开有效路径只有 `/`。

应用不维护 `/projects/*`、hash 子路由或独立 not-found 页面。开发服务器或目标 host 如果把其他路径返回给应用 shell，客户端会把当前 URL 归一化回 `/` 并渲染首页。

静态资源请求仍应按文件系统命中。缺失的 `/assets/*`、`/pokemon-portraits/*`、带扩展名的文件路径或其他站点资产不应被当成应用页面静默返回。

## Host 配置

`public/_headers` 随 Vite build 复制到 `dist/_headers`，用于给根 HTML、静态资源、`robots.txt` 和 `sitemap.xml` 配置缓存和基础安全 headers。

`public/_redirects` 只维护明确的根页面归一化规则：`/index.html` 和 `/projects/*` 回到 `/`。不配置通配 SPA rewrite，例如 `/* /index.html 200` 或 `/* / 200`，否则缺失资源路径会被错误返回为首页。

## 发布前验证

发布前至少运行：

```sh
pnpm build
pnpm smoke
```

`pnpm build` 会执行 typecheck、Vitest、Vite production build 和构建产物边界检查。它不执行外部 link checking，不要求外部 URL 可访问，也不读取相邻 Pokopia 项目仓库。

`pnpm smoke` 使用本地 Vite server 做应用级 smoke，验证：

- Home Page 可以渲染 Project Cards。
- `/projects/*` 和其他非根路径会回到 `/`。
- legacy filter query 不会隐藏 Project Cards。
- mobile layout、响应式视口、键盘路径和可访问文本保持可用。

发布到目标 host 后，需要直接打开 `/`，确认首页可用，并确认缺失静态资源仍按资源请求失败而不是被改写成应用页面。
