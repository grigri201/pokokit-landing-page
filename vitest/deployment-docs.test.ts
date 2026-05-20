import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { cwd } from 'node:process'
import { describe, expect, it } from 'vitest'

const repoRoot = cwd()
const deploymentDocPath = path.join(repoRoot, 'docs', 'deployment-static-fallback.md')

describe('deployment fallback documentation', () => {
  it('documents the static root-only deployment boundary', async () => {
    const doc = await readFile(deploymentDocPath, 'utf8')

    expect(doc).toMatch(/dist\//)
    expect(doc).toMatch(/只发布根路径/)
    expect(doc).toMatch(/公开有效路径只有 `\/`/)
    expect(doc).toMatch(/不维护 `\/projects\/\*`/)
    expect(doc).toMatch(/归一化回 `\/`/)
    expect(doc).toMatch(/\/assets\/\*/)
    expect(doc).toMatch(/\/pokemon-portraits\/\*/)
    expect(doc).toMatch(/带扩展名/)
    expect(doc).toMatch(/`public\/_headers`/)
    expect(doc).toMatch(/`public\/_redirects`/)
    expect(doc).toMatch(/不配置通配 SPA rewrite/)
    expect(doc).toMatch(/\/projects\/\*/)
    expect(doc).toMatch(/pnpm build/)
    expect(doc).toMatch(/pnpm smoke/)
    expect(doc).toMatch(/应用级 smoke/)
    expect(doc).toMatch(/Home Page/)
    expect(doc).toMatch(/非根路径会回到 `\/`/)
    expect(doc).toMatch(/legacy filter query/)
    expect(doc).toMatch(/mobile layout/)
    expect(doc).toMatch(/不需要相邻的 `pokopia-color-pattern`/)
    expect(doc).toMatch(/不读取相邻 Pokopia 项目仓库/)
    expect(doc).not.toMatch(/link checking.*必须|必须.*link checking/)
    expect(doc).not.toMatch(
      /(?:cp|rsync|scp)\s+\.\.\/pokopia-|dist\/docs\/pokopia_image_sources|SceneDocument|localStorage UI preferences/,
    )
    expect(doc).not.toMatch(/\/#\/projects/)
    expect(doc).not.toMatch(/Project Detail route/)
    expect(doc).not.toMatch(/host-specific fallback/)
    expect(doc).not.toMatch(/rewrite 到 `index\.html`/)
  })

  it('keeps App root-only without React Router project routes', async () => {
    const appSource = await readFile(path.join(repoRoot, 'src', 'App.tsx'), 'utf8')

    expect(appSource).toMatch(/redirectUnsupportedPathToRoot/)
    expect(appSource).not.toMatch(/ProjectDetailRoute/)
    expect(appSource).not.toMatch(/BrowserRouter/)
    expect(appSource).not.toMatch(/HashRouter/)
    expect(appSource).not.toMatch(/Route\s+path/)
  })

  it('keeps build and smoke scripts available for release validation', async () => {
    const packageJson = JSON.parse(
      await readFile(path.join(repoRoot, 'package.json'), 'utf8'),
    ) as {
      scripts: Record<string, string>
    }

    expect(packageJson.scripts.build).toContain('vite build')
    expect(packageJson.scripts.build).toContain('vitest run vitest/dist-boundary.test.ts')
    expect(packageJson.scripts.smoke).toBe('playwright test --project=chromium')
    expect(Object.values(packageJson.scripts).join(' ')).not.toMatch(
      /linkinator|lychee|curl|wget|\.\.\/pokopia-/,
    )
  })

  it('keeps smoke coverage aligned with the release documentation', async () => {
    const smokeSpec = await readFile(
      path.join(repoRoot, 'tests', 'landing-page.spec.ts'),
      'utf8',
    )

    expect(smokeSpec).toMatch(/renders the manifest-backed landing baseline/)
    expect(smokeSpec).toMatch(/redirects unsupported paths back to root/)
    expect(smokeSpec).toMatch(/legacy filter query/)
    expect(smokeSpec).toMatch(/width: 390/)
    expect(smokeSpec).not.toMatch(/project detail route/)
    expect(smokeSpec).not.toMatch(/wildcard route recovery/)
  })
})
