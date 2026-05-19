import type { ProjectCard, ProjectStatus } from '../domain/project-schema'

export type ProjectFilters = {
  status?: ProjectStatus
  capability?: string
}

export function filterProjects(
  projects: ProjectCard[],
  filters: ProjectFilters,
): ProjectCard[] {
  return projects.filter((project) => {
    if (filters.status && project.status !== filters.status) {
      return false
    }

    if (filters.capability && !project.capabilities.includes(filters.capability)) {
      return false
    }

    return true
  })
}

export function parseFilters(
  searchParams: URLSearchParams,
  projects?: ProjectCard[],
): ProjectFilters {
  return {
    status: normalizeStatus(searchParams.get('status')),
    capability: normalizeCapability(searchParams.get('capability'), projects),
  }
}

export function toFilterSearchParams(filters: ProjectFilters): URLSearchParams {
  const searchParams = new URLSearchParams()

  if (filters.status) {
    searchParams.set('status', filters.status)
  }

  if (filters.capability) {
    searchParams.set('capability', filters.capability)
  }

  return searchParams
}

export function toggleStatusFilter(
  filters: ProjectFilters,
  status: ProjectStatus,
): ProjectFilters {
  return {
    ...filters,
    status: filters.status === status ? undefined : status,
  }
}

export function toggleCapabilityFilter(
  filters: ProjectFilters,
  capability: string,
): ProjectFilters {
  return {
    ...filters,
    capability: filters.capability === capability ? undefined : capability,
  }
}

export function hasActiveFilters(filters: ProjectFilters): boolean {
  return Boolean(filters.status || filters.capability)
}

function normalizeStatus(value: string | null): ProjectStatus | undefined {
  if (
    value === 'planned' ||
    value === 'in-development' ||
    value === 'available' ||
    value === 'experimental' ||
    value === 'maintenance' ||
    value === 'archived'
  ) {
    return value
  }

  return undefined
}

function normalizeCapability(
  value: string | null,
  projects?: ProjectCard[],
): string | undefined {
  const capability = value?.trim()

  if (!capability) {
    return undefined
  }

  if (!projects) {
    return capability
  }

  const knownCapabilities = new Set(
    projects.flatMap((project) => project.capabilities),
  )

  return knownCapabilities.has(capability) ? capability : undefined
}
