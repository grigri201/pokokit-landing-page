import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { cwd } from 'node:process'
import { describe, expect, it } from 'vitest'

const repoRoot = cwd()
const deploymentDocPath = path.join(repoRoot, 'docs', 'deployment-static-fallback.md')

describe('deployment fallback documentation', () => {
  it('documents direct detail-route fallback and release validation entrypoints', async () => {
    const doc = await readFile(deploymentDocPath, 'utf8')

    expect(doc).toMatch(/dist\//)
    expect(doc).toMatch(/fallback 到 `index\.html`/)
    expect(doc).toMatch(/\/projects\/:projectId/)
    expect(doc).toMatch(/直接打开或刷新/)
    expect(doc).toMatch(/host-specific fallback/)
    expect(doc).toMatch(/部署配置|rewrite|host 配置/)
    expect(doc).toMatch(/\/assets\/\*/)
    expect(doc).toMatch(/带扩展名/)
    expect(doc).toMatch(/dist\/index\.html/)
    expect(doc).toMatch(/不要默认把产品路由改成 hash URL/)
    expect(doc).toMatch(/pnpm build/)
    expect(doc).toMatch(/pnpm smoke/)
    expect(doc).toMatch(/应用级 smoke/)
    expect(doc).toMatch(/不能替代最终 host/)
    expect(doc).toMatch(/Home Page/)
    expect(doc).toMatch(/Project Detail route/)
    expect(doc).toMatch(/unknown project route/)
    expect(doc).toMatch(/filter empty state/)
    expect(doc).toMatch(/mobile layout/)
    expect(doc).toMatch(/不需要相邻的 `pokopia-color-pattern`/)
    expect(doc).toMatch(/不读取相邻 Pokopia 项目仓库/)
    expect(doc).not.toMatch(/link checking.*必须|必须.*link checking/)
    expect(doc).not.toMatch(
      /(?:cp|rsync|scp)\s+\.\.\/pokopia-|dist\/docs\/pokopia_image_sources|SceneDocument|localStorage UI preferences/,
    )
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
    expect(smokeSpec).toMatch(/renders a manifest-backed project detail route/)
    expect(smokeSpec).toMatch(/renders unknown project recovery paths/)
    expect(smokeSpec).toMatch(/renders wildcard route recovery paths/)
    expect(smokeSpec).toMatch(/filter empty state/)
    expect(smokeSpec).toMatch(/mobile detail route/)
    expect(smokeSpec).toMatch(/width: 390/)
  })
})
