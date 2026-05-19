import type { ProjectStatus } from '../domain/project-schema'
import { projectStatusLabels } from '../domain/project-labels'
import type { ProjectCard } from '../domain/project-schema'

export type StatusFilterOption = {
  status: ProjectStatus
  label: string
}

export function getStatusFilterOptions(projects: ProjectCard[]): StatusFilterOption[] {
  return Array.from(new Set(projects.map((project) => project.status))).map((status) => ({
    status,
    label: projectStatusLabels[status].label,
  }))
}

export function getCapabilityFilterOptions(projects: ProjectCard[]): string[] {
  return Array.from(
    new Set(projects.flatMap((project) => project.capabilities)),
  )
}
