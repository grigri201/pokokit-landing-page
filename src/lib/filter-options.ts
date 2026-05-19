import { projectStatusLabels } from '../domain/project-labels'
import type { ProjectCard } from '../domain/project-schema'

export function getStatusFilterOptions(projects: ProjectCard[]): string[] {
  return Array.from(new Set(projects.map((project) => project.status))).map(
    (status) => projectStatusLabels[status].label,
  )
}

export function getCapabilityFilterOptions(projects: ProjectCard[]): string[] {
  return Array.from(
    new Set(projects.flatMap((project) => project.capabilities)),
  )
}
