import { access, readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { cwd } from 'node:process'
import ts from 'typescript'
import { describe, expect, it } from 'vitest'
import { projectManifest } from '../src/data/projects'

type ScannedFile = {
  fullPath: string
  kind: 'code' | 'text'
  relativePath: string
}

const repoRoot = cwd()
const scannedRoots = ['src', 'tests', 'public']
const rootFiles = [
  'package.json',
  'index.html',
  'vite.config.ts',
  'playwright.config.ts',
  'eslint.config.js',
  'tsconfig.json',
  'tsconfig.app.json',
  'tsconfig.node.json',
]

const allowedBoundaryTestFile = path.join('vitest', 'data-boundary.test.ts')
const codeExtensions = new Set(['.ts', '.tsx', '.js', '.mjs', '.cjs'])
const textExtensions = new Set(['.json', '.html', '.svg'])
const filesystemModules = /^(node:fs(?:\/promises)?|fs(?:\/promises)?|glob|fast-glob)$/
const networkModules = /^(node:https?|https?)$/

describe('data boundary enforcement', () => {
  it('does not import, scan, fetch, or read adjacent project internals', async () => {
    const files = await listScannedFiles()
    const violations = new Map<string, string[]>()

    for (const file of files) {
      if (file.relativePath === allowedBoundaryTestFile) {
        continue
      }

      const sourceText = await readFile(file.fullPath, 'utf8')
      const fileViolations =
        file.kind === 'code'
          ? collectCodeBoundaryViolations(file.relativePath, sourceText)
          : collectTextBoundaryViolations(file.relativePath, sourceText)

      if (fileViolations.length > 0) {
        violations.set(file.relativePath, fileViolations)
      }
    }

    expect(formatViolations(violations)).toEqual([])
  })

  it('keeps the app TypeScript config browser scoped', async () => {
    const tsconfigPath = path.join(repoRoot, 'tsconfig.app.json')
    const tsconfigApp = parseJsonConfig(await readFile(tsconfigPath, 'utf8'), tsconfigPath) as {
      compilerOptions?: {
        types?: string[]
      }
    }

    expect(tsconfigApp.compilerOptions?.types).toEqual([
      'vite/client',
      'vitest/globals',
    ])
  })

  it('keeps the MVP on manually maintained manifest metadata', () => {
    expect(
      projectManifest.projects.map((project) => ({
        id: project.id,
        dataFreshness: project.dataFreshness,
        displaySource: project.sourcePolicy.displaySource,
      })),
    ).toEqual([
      {
        id: 'pokopia-decor-dex',
        dataFreshness: 'manual',
        displaySource: 'landing-manifest',
      },
      {
        id: 'pokopia-scene-editor',
        dataFreshness: 'manual',
        displaySource: 'landing-manifest',
      },
      {
        id: 'pokokit-gallery',
        dataFreshness: 'manual',
        displaySource: 'landing-manifest',
      },
    ])
  })

  it('keeps build scripts local and avoids external link checking', async () => {
    const packageJson = JSON.parse(
      await readFile(path.join(repoRoot, 'package.json'), 'utf8'),
    ) as {
      scripts: Record<string, string>
    }

    expect(packageJson.scripts.build).toBe(
      'tsc -b && vitest run && vite build && vitest run vitest/dist-boundary.test.ts',
    )

    const violations = Object.entries(packageJson.scripts).flatMap(
      ([scriptName, command]) => collectScriptBoundaryViolations(scriptName, command),
    )

    expect(violations).toEqual([])
  })

  it('flags adjacent internals, dynamic fs access, fetch aliases, and localStorage aliases', () => {
    const fixture = `
      import sourceData from '../../pokopia-color-pattern/docs/pokopia_image_sources/summary.json'
      const scenePayload = '../../../pokopia-scene-editor/examples/SceneDocument.fixture.json'
      const diagnostics = '../pokopia-color-pattern/build-only-diagnostics/report.json'
      const sceneSource = '../../pokopia-scene-editor/src/runtime/SceneDocument.ts'
      await import('node:fs/promises')
      require('fs')
      fetch('https://example.com/project-manifest.json')
      const aliasedFetch = window.fetch.bind(window)
      window['fetch']('https://example.com/project-manifest.json')
      navigator.sendBeacon('/metrics')
      new WebSocket('wss://example.com')
      window['localStorage'].getItem('scene')
    `

    expect(collectCodeBoundaryViolations('src/fixture.ts', fixture)).toEqual(
      expect.arrayContaining([
        expect.stringContaining('adjacent project import is not allowed'),
        expect.stringContaining('adjacent project internal path is not allowed'),
        expect.stringContaining('filesystem scanning dynamic import is not allowed'),
        expect.stringContaining('filesystem scanning require is not allowed'),
        expect.stringContaining('runtime fetch is not allowed'),
        expect.stringContaining('runtime sendBeacon is not allowed'),
        expect.stringContaining('runtime WebSocket is not allowed'),
        expect.stringContaining('active localStorage access is not allowed'),
      ]),
    )
  })

  it('flags package scripts that copy or ingest adjacent project data', () => {
    expect(
      collectScriptBoundaryViolations(
        'build',
        'vite build && cp ../pokopia-color-pattern/dist/project-manifest.json public/',
      ),
    ).toEqual(
      expect.arrayContaining([
        expect.stringContaining('adjacent project copy/sync is not allowed'),
        expect.stringContaining('adjacent project internal script path is not allowed'),
      ]),
    )

    expect(
      collectScriptBoundaryViolations(
        'sync',
        'node scripts/import-pokopia-assets.mjs ../pokopia-scene-editor/src',
      ),
    ).toEqual(
      expect.arrayContaining([
        expect.stringContaining('scripted ingestion from adjacent projects is not allowed'),
        expect.stringContaining('adjacent project internal script path is not allowed'),
      ]),
    )
  })
})

async function listScannedFiles(): Promise<ScannedFile[]> {
  const files: ScannedFile[] = []

  for (const root of scannedRoots) {
    await collectFiles(path.join(repoRoot, root), files)
  }

  for (const file of rootFiles) {
    const fullPath = path.join(repoRoot, file)
    if (await fileExists(fullPath)) {
      addScannedFile(fullPath, files)
    }
  }

  return files
}

async function collectFiles(directory: string, files: ScannedFile[]): Promise<void> {
  const entries = await readdir(directory, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      await collectFiles(fullPath, files)
      continue
    }

    addScannedFile(fullPath, files)
  }
}

async function fileExists(file: string): Promise<boolean> {
  try {
    await access(file)
    return true
  } catch {
    return false
  }
}

function addScannedFile(fullPath: string, files: ScannedFile[]) {
  const extension = path.extname(fullPath)
  const kind = codeExtensions.has(extension)
    ? 'code'
    : textExtensions.has(extension)
      ? 'text'
      : null

  if (kind === null) {
    return
  }

  files.push({
    fullPath,
    kind,
    relativePath: path.relative(repoRoot, fullPath),
  })
}

function collectCodeBoundaryViolations(
  relativePath: string,
  sourceText: string,
): string[] {
  const sourceFile = ts.createSourceFile(
    relativePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    relativePath.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  )
  const violations: string[] = []

  function visit(node: ts.Node) {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
      const moduleSpecifier = node.moduleSpecifier

      if (moduleSpecifier && ts.isStringLiteral(moduleSpecifier)) {
        checkModuleSpecifier(moduleSpecifier.text, 'import', violations)
      }
    }

    if (ts.isCallExpression(node)) {
      checkCallExpression(node, sourceFile, violations)
    }

    if (ts.isPropertyAccessExpression(node)) {
      checkPropertyAccessExpression(node, sourceFile, violations)
    }

    if (ts.isElementAccessExpression(node)) {
      checkElementAccessExpression(node, sourceFile, violations)
    }

    if (ts.isIdentifier(node)) {
      checkIdentifier(node, violations)
    }

    if (ts.isStringLiteralLike(node)) {
      checkStringLiteral(node.text, violations)
    }

    ts.forEachChild(node, visit)
  }

  visit(sourceFile)

  return violations
}

function parseJsonConfig(sourceText: string, fileName: string): unknown {
  const parsed = ts.parseConfigFileTextToJson(fileName, sourceText)

  if (parsed.error) {
    throw new Error(ts.flattenDiagnosticMessageText(parsed.error.messageText, '\n'))
  }

  return parsed.config
}

function collectTextBoundaryViolations(
  relativePath: string,
  sourceText: string,
): string[] {
  const violations: string[] = []

  checkAdjacentProjectInternalText(sourceText, 'text', violations)

  if (relativePath === 'package.json') {
    const packageJson = JSON.parse(sourceText) as {
      scripts?: Record<string, string>
    }

    for (const [scriptName, command] of Object.entries(packageJson.scripts ?? {})) {
      violations.push(...collectScriptBoundaryViolations(scriptName, command))
    }
  }

  return violations
}

function collectScriptBoundaryViolations(
  scriptName: string,
  command: string,
): string[] {
  const violations: string[] = []

  if (/\b(curl|wget|link-check|linkinator|lychee)\b|https?:\/\//i.test(command)) {
    violations.push(`external link checking is not allowed in script ${scriptName}`)
  }

  if (/\b(cp|rsync|scp|tar)\b[^&|\n]*(?:\.\.\/)+pokopia-/i.test(command)) {
    violations.push(`adjacent project copy/sync is not allowed in script ${scriptName}`)
  }

  if (
    /\bnode\b[^&|\n]*(import|ingest|sync|scan|crawl|copy|asset|source|manifest)/i.test(
      command,
    )
  ) {
    violations.push(
      `scripted ingestion from adjacent projects is not allowed in script ${scriptName}`,
    )
  }

  checkAdjacentProjectInternalText(command, 'script path', violations)

  return violations
}

function checkCallExpression(
  node: ts.CallExpression,
  sourceFile: ts.SourceFile,
  violations: string[],
) {
  const expression = node.expression

  if (expression.kind === ts.SyntaxKind.ImportKeyword) {
    checkFirstStringArgument(node, 'dynamic import', violations)
  }

  if (ts.isIdentifier(expression) && expression.text === 'require') {
    checkFirstStringArgument(node, 'require', violations)
  }

  if (ts.isIdentifier(expression) && expression.text === 'fetch') {
    violations.push('runtime fetch is not allowed for project metadata')
  }

  if (
    ts.isPropertyAccessExpression(expression) &&
    expression.name.text === 'sendBeacon'
  ) {
    violations.push(
      `runtime sendBeacon is not allowed: ${expression.getText(sourceFile)}`,
    )
  }
}

function checkPropertyAccessExpression(
  node: ts.PropertyAccessExpression,
  sourceFile: ts.SourceFile,
  violations: string[],
) {
  if (node.name.text === 'fetch') {
    violations.push(`runtime fetch is not allowed: ${node.getText(sourceFile)}`)
  }

  if (node.name.text === 'localStorage') {
    violations.push('active localStorage access is not allowed')
  }

  if (node.name.text === 'sendBeacon') {
    violations.push(`runtime sendBeacon is not allowed: ${node.getText(sourceFile)}`)
  }
}

function checkElementAccessExpression(
  node: ts.ElementAccessExpression,
  sourceFile: ts.SourceFile,
  violations: string[],
) {
  const key = getStringArgument(node.argumentExpression)

  if (key === 'fetch') {
    violations.push(`runtime fetch is not allowed: ${node.getText(sourceFile)}`)
  }

  if (key === 'localStorage') {
    violations.push('active localStorage access is not allowed')
  }

  if (key === 'sendBeacon') {
    violations.push(`runtime sendBeacon is not allowed: ${node.getText(sourceFile)}`)
  }
}

function checkIdentifier(node: ts.Identifier, violations: string[]) {
  if (node.text === 'localStorage') {
    violations.push('active localStorage access is not allowed')
  }

  if (node.text === 'XMLHttpRequest') {
    violations.push('runtime XMLHttpRequest is not allowed')
  }

  if (node.text === 'WebSocket') {
    violations.push('runtime WebSocket is not allowed')
  }
}

function checkFirstStringArgument(
  node: ts.CallExpression,
  sourceKind: 'dynamic import' | 'require',
  violations: string[],
) {
  const [firstArgument] = node.arguments
  const value = getStringArgument(firstArgument)

  if (value) {
    checkModuleSpecifier(value, sourceKind, violations)
  }
}

function getStringArgument(node: ts.Node | undefined): string | null {
  if (!node) {
    return null
  }

  if (ts.isStringLiteralLike(node)) {
    return node.text
  }

  return null
}

function checkModuleSpecifier(
  specifier: string,
  sourceKind: 'import' | 'dynamic import' | 'require',
  violations: string[],
) {
  checkProjectInternalPath(specifier, 'path', violations)

  if (isAdjacentPokopiaPath(specifier)) {
    violations.push(`adjacent project import is not allowed: ${specifier}`)
  }

  if (filesystemModules.test(specifier)) {
    violations.push(`filesystem scanning ${sourceKind} is not allowed: ${specifier}`)
  }

  if (networkModules.test(specifier)) {
    violations.push(`network ${sourceKind} is not allowed: ${specifier}`)
  }
}

function checkStringLiteral(text: string, violations: string[]) {
  checkProjectInternalPath(text, 'path', violations)
}

function formatViolations(violations: Map<string, string[]>): string[] {
  return Array.from(violations.entries()).flatMap(([file, fileViolations]) =>
    fileViolations.map((violation) => `${file}: ${violation}`),
  )
}

function checkProjectInternalPath(
  value: string,
  sourceKind: 'path',
  violations: string[],
) {
  if (hasAdjacentProjectInternalPath(value)) {
    violations.push(`adjacent project internal ${sourceKind} is not allowed: ${value}`)
  }
}

function checkAdjacentProjectInternalText(
  value: string,
  sourceKind: 'text' | 'script path',
  violations: string[],
) {
  const matches = value.match(/(?:\.\.\/)+pokopia-(?:color-pattern|scene-editor)\/\S*/gi)

  for (const match of matches ?? []) {
    if (hasAdjacentProjectInternalPath(match)) {
      violations.push(`adjacent project internal ${sourceKind} is not allowed: ${match}`)
    }
  }
}

function hasAdjacentProjectInternalPath(value: string): boolean {
  if (!isAdjacentPokopiaPath(value)) {
    return false
  }

  const normalized = value.replaceAll('\\', '/')
  const match = normalized.match(
    /^(?:\.\.\/)+pokopia-(?:color-pattern|scene-editor)(?:\/(?<subpath>.*))?$/i,
  )
  const subpath = match?.groups?.subpath?.replace(/^\/+|\/+$/g, '')

  return Boolean(subpath)
}

function isAdjacentPokopiaPath(value: string): boolean {
  return /^(?:\.\.\/)+pokopia-(?:color-pattern|scene-editor)(?:\/|$)/i.test(value)
}
