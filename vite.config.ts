import { createServer, type Plugin, type ViteDevServer } from 'vite'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

function staticHomeHtmlPlugin(): Plugin {
  let buildSsrServer: ViteDevServer | undefined

  async function loadRenderer(devServer?: ViteDevServer) {
    const server =
      devServer ??
      (buildSsrServer ??= await createServer({
        appType: 'custom',
        configFile: false,
        logLevel: 'error',
        plugins: [react()],
        root: process.cwd(),
        server: {
          middlewareMode: true,
        },
      }))

    return server.ssrLoadModule('/src/static-entry.tsx') as Promise<{
      renderStaticHome: () => string
    }>
  }

  return {
    name: 'pokokit-static-home-html',
    async closeBundle() {
      await buildSsrServer?.close()
      buildSsrServer = undefined
    },
    async transformIndexHtml(html, context) {
      const { renderStaticHome } = await loadRenderer(context.server)
      const staticHomeHtml = renderStaticHome()

      return html
        .replace('<html lang="en">', '<html lang="zh-CN" data-theme="light">')
        .replace('<div id="root"></div>', `<div id="root">${staticHomeHtml}</div>`)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), staticHomeHtmlPlugin()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{ts,tsx}', 'vitest/**/*.test.{ts,tsx}'],
    setupFiles: './src/test/setup.ts',
  },
})
