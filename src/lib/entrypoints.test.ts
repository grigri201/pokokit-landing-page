import { describe, expect, it } from 'vitest'
import type { ProjectCard } from '../domain/project-schema'
import { getPrimaryEntrypoint, isSafeAvailableHref } from './entrypoints'

describe('entrypoint helpers', () => {
  it('rejects protocol-relative available hrefs', () => {
    expect(isSafeAvailableHref('//evil.example/path')).toBe(false)
    expect(isSafeAvailableHref('/projects/pokopia-scene-editor')).toBe(true)
    expect(isSafeAvailableHref('https://example.com/tool')).toBe(true)
    expect(isSafeAvailableHref('http://example.com/tool')).toBe(false)
  })

  it('does not promote an arbitrary available entrypoint over an unavailable primary', () => {
    const project = {
      id: 'example-project',
      entrypoints: [
        {
          id: 'primary-tool',
          kind: 'tool',
          availability: 'tbd',
          label: '公开工具待确认',
          note: '尚未确认公开部署 URL。',
          isPrimary: true,
        },
        {
          id: 'detail',
          kind: 'detail',
          availability: 'available',
          label: '查看项目详情',
          href: '/projects/example-project',
        },
      ],
    } as ProjectCard

    expect(getPrimaryEntrypoint(project).id).toBe('primary-tool')
  })
})
