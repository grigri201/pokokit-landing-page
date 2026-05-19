import { describe, expect, it } from 'vitest'
import { projectManifest } from '../data/projects'
import { extendedProjectManifest } from '../test/project-fixtures'
import { validateProjectManifest } from './project-validation'

describe('Project Manifest v1 validation', () => {
  it('accepts the first two stable Pokopia project records', () => {
    const manifest = validateProjectManifest(projectManifest)

    expect(manifest.projects.map((project) => project.id)).toEqual([
      'pokopia-decor-dex',
      'pokopia-scene-editor',
    ])
  })

  it('accepts a legal third project record without schema changes', () => {
    expect(extendedProjectManifest.projects.map((project) => project.id)).toEqual([
      'pokopia-decor-dex',
      'pokopia-scene-editor',
      'pokopia-map-planner',
    ])
  })

  it('reports project id, field path, and reason for missing required fields', () => {
    const invalidManifest = {
      version: 1,
      projects: [
        {
          id: 'broken-project',
          name: 'Broken Project',
          type: 'tool',
          status: 'available',
          audiences: ['Maintainer'],
          primaryUseCases: ['Check validation'],
          capabilities: ['Validation'],
          entrypoints: [
            {
              id: 'broken-tool',
              kind: 'tool',
              availability: 'available',
              label: '打开工具',
              href: '/',
            },
          ],
          sourcePolicy: {
            displaySource: 'landing-manifest',
            initializedFrom: ['manual fixture'],
            doesNotRead: ['adjacent project internals'],
          },
          dataFreshness: 'manual',
        },
      ],
    }

    expect(() => validateProjectManifest(invalidManifest)).toThrowError(
      /\[broken-project\] projects\.0\.tagline: Invalid input/,
    )
  })

  it('rejects duplicate project ids with actionable location context', () => {
    const invalidManifest = {
      ...projectManifest,
      projects: [
        projectManifest.projects[0],
        {
          ...projectManifest.projects[1],
          id: projectManifest.projects[0].id,
        },
      ],
    }

    expect(() => validateProjectManifest(invalidManifest)).toThrowError(
      /\[pokopia-decor-dex\] projects\.1\.id: duplicate project id/,
    )
  })

  it('rejects invalid enum values with project id and field path', () => {
    const invalidManifest = {
      ...projectManifest,
      projects: [
        {
          ...projectManifest.projects[0],
          status: 'live',
        },
      ],
    }

    expect(() => validateProjectManifest(invalidManifest)).toThrowError(
      /\[pokopia-decor-dex\] projects\.0\.status:/,
    )
  })

  it('rejects unknown related project ids', () => {
    const invalidManifest = {
      ...projectManifest,
      projects: [
        projectManifest.projects[0],
        {
          ...projectManifest.projects[1],
          relatedProjects: [
            {
              projectId: 'missing-project',
              relationship: 'reference relationship',
            },
          ],
        },
      ],
    }

    expect(() => validateProjectManifest(invalidManifest)).toThrowError(
      /\[pokopia-scene-editor\] projects\.1\.relatedProjects\.0\.projectId: unknown related project id "missing-project"/,
    )
  })

  it('requires exactly one primary entrypoint per project', () => {
    const invalidManifest = {
      ...projectManifest,
      projects: [
        {
          ...projectManifest.projects[0],
          entrypoints: projectManifest.projects[0].entrypoints.map((entrypoint) => ({
            ...entrypoint,
            isPrimary: false,
          })),
        },
      ],
    }

    expect(() => validateProjectManifest(invalidManifest)).toThrowError(
      /\[pokopia-decor-dex\] projects\.0\.entrypoints: exactly one primary entrypoint is required/,
    )
  })

  it('rejects unavailable primary entrypoints for available projects', () => {
    const invalidManifest = {
      ...projectManifest,
      projects: [
        {
          ...projectManifest.projects[0],
          entrypoints: [
            {
              ...projectManifest.projects[0].entrypoints[0],
              availability: 'tbd',
              href: undefined,
              note: 'Public deployment is not confirmed.',
            },
          ],
        },
      ],
    }

    expect(() => validateProjectManifest(invalidManifest)).toThrowError(
      /\[pokopia-decor-dex\] projects\.0\.entrypoints: available projects must use an available primary entrypoint/,
    )
  })

  it('rejects available entrypoints that point at adjacent repo paths', () => {
    const invalidManifest = {
      ...projectManifest,
      projects: [
        {
          ...projectManifest.projects[0],
          entrypoints: [
            {
              ...projectManifest.projects[0].entrypoints[0],
              href: '../pokopia-color-pattern',
            },
          ],
        },
      ],
    }

    expect(() => validateProjectManifest(invalidManifest)).toThrowError(
      /\[pokopia-decor-dex\] projects\.0\.entrypoints\.0\.href: available entrypoints must use a public URL or same-site path/,
    )
  })

  it('rejects protocol-relative available entrypoint URLs', () => {
    const invalidManifest = {
      ...projectManifest,
      projects: [
        {
          ...projectManifest.projects[0],
          entrypoints: [
            {
              ...projectManifest.projects[0].entrypoints[0],
              href: '//example.com/tool',
            },
          ],
        },
      ],
    }

    expect(() => validateProjectManifest(invalidManifest)).toThrowError(
      /\[pokopia-decor-dex\] projects\.0\.entrypoints\.0\.href: available entrypoints must use a public URL or same-site path/,
    )
  })

  it('requires local-only entrypoints to explain why they are local', () => {
    const invalidManifest = {
      ...projectManifest,
      projects: [
        {
          ...projectManifest.projects[0],
          entrypoints: [
            {
              ...projectManifest.projects[0].entrypoints[1],
              note: undefined,
              isPrimary: true,
            },
          ],
        },
      ],
    }

    expect(() => validateProjectManifest(invalidManifest)).toThrowError(
      /\[pokopia-decor-dex\] projects\.0\.entrypoints\.0\.note: local-only entrypoints must explain why they are unavailable/,
    )
  })

  it('rejects href on tbd or disabled entrypoints', () => {
    const invalidManifest = {
      ...projectManifest,
      projects: [
        {
          ...projectManifest.projects[1],
          entrypoints: [
            {
              ...projectManifest.projects[1].entrypoints[0],
              href: '/',
            },
          ],
        },
      ],
    }

    expect(() => validateProjectManifest(invalidManifest)).toThrowError(
      /\[pokopia-scene-editor\] projects\.0\.entrypoints\.0\.href: tbd entrypoints must not include href/,
    )
  })
})
