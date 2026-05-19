import type { ProjectCard, ProjectEntrypoint } from '../domain/project-schema'

export function getPrimaryEntrypoint(project: ProjectCard): ProjectEntrypoint {
  const primaryEntrypoint = project.entrypoints.find(
    (entrypoint) => entrypoint.isPrimary && entrypoint.availability === 'available',
  )

  return primaryEntrypoint ?? project.entrypoints.find(
    (entrypoint) => entrypoint.isPrimary,
  ) ?? project.entrypoints[0]
}

export function isExternalHref(href: string): boolean {
  return /^https?:\/\//.test(href)
}

export function isSafeAvailableHref(href: string): boolean {
  return (href.startsWith('/') && !href.startsWith('//')) || /^https:\/\//.test(href)
}
