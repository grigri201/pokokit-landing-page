import { describe, expect, it } from 'vitest'
import { projectManifest, projects } from '../data/projects'
import { validateProjectManifest } from '../domain/project-validation'
import { resolveRelatedProjects } from './related-projects'

describe('related project helpers', () => {
  it('resolves related project targets from stable manifest ids', () => {
    const sceneEditor = projects.find(
      (project) => project.id === 'pokopia-scene-editor',
    )

    expect(sceneEditor).toBeDefined()
    const relatedProjects = resolveRelatedProjects(sceneEditor!, projects)

    expect(relatedProjects).toHaveLength(1)
    expect(relatedProjects[0]?.targetProject.id).toBe('pokopia-decor-dex')
    expect(relatedProjects[0]?.relationship).toMatch(/独立工具边界/)
  })

  it('validation rejects missing related project targets with source path', () => {
    const invalidManifest = {
      ...projectManifest,
      projects: [
        projectManifest.projects[0],
        {
          ...projectManifest.projects[1],
          relatedProjects: [
            {
              projectId: 'missing-project',
              relationship: '语义关联和参考关系，保持独立工具边界。',
            },
          ],
        },
      ],
    }

    expect(() => validateProjectManifest(invalidManifest)).toThrowError(
      /\[pokopia-scene-editor\] projects\.1\.relatedProjects\.0\.projectId: unknown related project id "missing-project"/,
    )
  })
})
