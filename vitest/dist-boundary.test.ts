import { access, readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { cwd } from 'node:process'
import { describe, expect, it } from 'vitest'

const distRoot = path.join(cwd(), 'dist')
const scannedExtensions = new Set(['.html', '.js', '.css', '.svg', '.json'])

describe('built runtime boundary', () => {
  it('does not ship adjacent project internals or active local project storage readers', async () => {
    if (!(await directoryExists(distRoot))) {
      return
    }

    const files = await listDistFiles(distRoot)
    const violations = new Map<string, string[]>()

    for (const file of files) {
      const sourceText = await readFile(file, 'utf8')
      const relativePath = path.relative(distRoot, file)
      const fileViolations = collectDistBoundaryViolations(sourceText)

      if (fileViolations.length > 0) {
        violations.set(relativePath, fileViolations)
      }
    }

    expect(formatViolations(violations)).toEqual([])
  })
})

async function directoryExists(directory: string): Promise<boolean> {
  try {
    await access(directory)
    return true
  } catch {
    return false
  }
}

async function listDistFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      files.push(...(await listDistFiles(fullPath)))
      continue
    }

    if (scannedExtensions.has(path.extname(fullPath))) {
      files.push(fullPath)
    }
  }

  return files
}

function collectDistBoundaryViolations(sourceText: string): string[] {
  const violations: string[] = []
  const adjacentInternalPaths =
    sourceText.match(/(?:\.\.\/)+pokopia-(?:color-pattern|scene-editor)\/\S*/gi) ?? []

  for (const match of adjacentInternalPaths) {
    violations.push(`adjacent project internal path shipped in dist: ${match}`)
  }

  const forbiddenRuntimeReaders = [
    [/\blocalStorage\s*\./, 'active localStorage property access shipped in dist'],
    [/\[\s*["'`]localStorage["'`]\s*\]/, 'active localStorage index access shipped in dist'],
    [/\b(?:node:fs|fs\/promises|fast-glob|glob)\b/, 'filesystem scanner token shipped in dist'],
    [/\bXMLHttpRequest\b/, 'XMLHttpRequest token shipped in dist'],
    [/\bWebSocket\b/, 'WebSocket token shipped in dist'],
    [/\bsendBeacon\b/, 'sendBeacon token shipped in dist'],
  ] as const

  for (const [pattern, message] of forbiddenRuntimeReaders) {
    if (pattern.test(sourceText)) {
      violations.push(message)
    }
  }

  return violations
}

function formatViolations(violations: Map<string, string[]>): string[] {
  return Array.from(violations.entries()).flatMap(([file, fileViolations]) =>
    fileViolations.map((violation) => `${file}: ${violation}`),
  )
}
