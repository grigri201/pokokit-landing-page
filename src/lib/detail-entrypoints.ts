import type { ProjectCard, ProjectEntrypoint } from '../domain/project-schema'
import { getPrimaryEntrypoint } from './entrypoints'
import { getProjectPath } from './project-routes'

export function getDetailEntrypoints(project: ProjectCard): {
  entrypoints: ProjectEntrypoint[]
  primaryEntrypoint: ProjectEntrypoint
} {
  const currentDetailPath = getProjectPath(project.id)
  const nonSelfEntrypoints = project.entrypoints.filter(
    (entrypoint) => entrypoint.href !== currentDetailPath,
  )
  const entrypoints =
    nonSelfEntrypoints.length > 0 ? nonSelfEntrypoints : project.entrypoints

  return {
    entrypoints,
    primaryEntrypoint: getPrimaryEntrypoint({
      ...project,
      entrypoints,
    }),
  }
}
