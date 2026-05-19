import { describe, expect, it } from 'vitest'
import { projectManifest } from '../data/projects'
import {
  dataFreshnessLabels,
  entrypointAvailabilityLabels,
  projectStatusLabels,
} from './project-labels'
import {
  DATA_FRESHNESS_VALUES,
  ENTRYPOINT_AVAILABILITIES,
  PROJECT_STATUSES,
} from './project-schema'

const launchableClaims =
  /可直接使用|可启动|已上线|已发布|launchable|ready to use|available/i
const positiveLiveClaims =
  /\b(real[- ]?time|live|monitoring|auto[- ]?sync(?:ed)?)\b|实时(?:数据|监控|更新|同步|状态)?|监控数据|自动同步(?:数据|状态)?|自动更新/i
const shortNoteMaxLength = 80
const deniedLiveClaimPhrases = [
  /不是实时或自动同步数据/g,
  /不是实时(?:数据)?/g,
  /非实时(?:数据)?/g,
  /不(?:是)?自动同步(?:数据|状态)?/g,
]
const unavailableFixtureEntrypoints = [
  {
    id: 'disabled-example',
    availability: 'disabled',
    label: '工具入口暂不可用',
    note: '维护中，暂不可用。',
  },
  {
    id: 'local-only-example',
    availability: 'local-only',
    label: '查看本地仓库',
    note: '本地开发路径，仅供维护者审计。',
  },
  {
    id: 'tbd-example',
    availability: 'tbd',
    label: '公开工具入口待确认',
    note: '尚未确认公开部署 URL。',
  },
] as const

describe('project content governance', () => {
  it('defines readable project status meanings without making in-development launchable', () => {
    expect(new Set(Object.keys(projectStatusLabels))).toEqual(new Set(PROJECT_STATUSES))

    for (const status of PROJECT_STATUSES) {
      expect(projectStatusLabels[status].label.trim()).not.toBe('')
      expect(projectStatusLabels[status].description.trim()).not.toBe('')
    }

    expect(projectStatusLabels['in-development'].description).not.toMatch(
      launchableClaims,
    )
    expect(projectStatusLabels.available.description).toMatch(/可直接使用/)
  })

  it('distinguishes data freshness values without describing manual data as live telemetry', () => {
    expect(new Set(Object.keys(dataFreshnessLabels))).toEqual(
      new Set(DATA_FRESHNESS_VALUES),
    )

    for (const freshness of DATA_FRESHNESS_VALUES) {
      expect(dataFreshnessLabels[freshness].label.trim()).not.toBe('')
      expect(dataFreshnessLabels[freshness].description.trim()).not.toBe('')
    }

    expect(dataFreshnessLabels.manual.description).toMatch(/人工|手动/)
    expect(dataFreshnessLabels.manual.description).toMatch(/不是实时|非实时|不.*自动同步/)
    expect(hasPositiveLiveClaim(dataFreshnessLabels.manual.description)).toBe(false)
    expect(hasPositiveLiveClaim('人工维护，但属于实时数据')).toBe(true)
    expect(hasPositiveLiveClaim('人工维护，但自动同步数据')).toBe(true)
    expect(hasPositiveLiveClaim('人工维护，但包含监控数据')).toBe(true)
    expect(dataFreshnessLabels['build-time'].description).toMatch(/构建/)
    expect(dataFreshnessLabels['project-manifest'].description).toMatch(/公开 manifest/i)
    expect(dataFreshnessLabels.unknown.description).toMatch(/未知|尚未/)
  })

  it('keeps unavailable entrypoints close to readable next-step explanations', () => {
    expect(new Set(Object.keys(entrypointAvailabilityLabels))).toEqual(
      new Set(ENTRYPOINT_AVAILABILITIES),
    )
    expect(entrypointAvailabilityLabels.disabled).toMatch(/不可用|停用/)
    expect(entrypointAvailabilityLabels['local-only']).toMatch(/本地|开发/)
    expect(entrypointAvailabilityLabels.tbd).toMatch(/待确认/)

    for (const availability of ENTRYPOINT_AVAILABILITIES) {
      expect(entrypointAvailabilityLabels[availability].trim()).not.toBe('')
    }

    const unavailableEntrypoints = projectManifest.projects.flatMap((project) =>
      project.entrypoints
        .filter((entrypoint) => entrypoint.availability !== 'available')
        .map((entrypoint) => ({
          projectId: project.id,
          ...entrypoint,
        })),
    )

    expect(
      new Set([
        ...unavailableFixtureEntrypoints.map((entrypoint) => entrypoint.availability),
        ...unavailableEntrypoints.map((entrypoint) => entrypoint.availability),
      ]),
    ).toEqual(new Set(['disabled', 'local-only', 'tbd']))

    for (const entrypoint of [...unavailableFixtureEntrypoints, ...unavailableEntrypoints]) {
      const entrypointContext =
        'projectId' in entrypoint
          ? `${entrypoint.projectId}:${entrypoint.id}`
          : entrypoint.id

      expect(entrypoint.note, entrypointContext).toMatch(
        /本地|开发中|尚未确认|公开部署|审计|维护中|不可用/,
      )
      expect(entrypoint.label).toMatch(/查看|待确认|入口|不可用/)
    }
  })

  it('keeps maintainer notes short and limited to deployment, boundary, or maintenance context', () => {
    const notes = projectManifest.projects.flatMap((project) =>
      (project.maintainerNotes ?? []).map((note) => ({
        note,
        projectId: project.id,
      })),
    )

    expect(notes.length).toBeGreaterThan(0)

    for (const { note, projectId } of notes) {
      expect(note.length, projectId).toBeLessThanOrEqual(shortNoteMaxLength)
      expect(note, projectId).not.toMatch(
        /\n|##|###|Acceptance Criteria|PRD|架构|实现|验收|完整理由|技术方案|实现细节/,
      )
      expect(note, projectId).toMatch(/部署|边界|维护|复核|公开|URL|启动工具/)
    }
  })
})

function hasPositiveLiveClaim(text: string): boolean {
  const scrubbed = deniedLiveClaimPhrases.reduce(
    (current, phrase) => current.replace(phrase, ''),
    text,
  )

  return positiveLiveClaims.test(scrubbed)
}
