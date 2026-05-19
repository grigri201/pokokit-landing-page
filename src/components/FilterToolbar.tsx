import type { ProjectCard, ProjectStatus } from '../domain/project-schema'
import { getCapabilityFilterOptions, getStatusFilterOptions } from '../lib/filter-options'
import type { ProjectFilters } from '../lib/filters'

type FilterToolbarProps = {
  projects: ProjectCard[]
  filters: ProjectFilters
  onStatusToggle: (status: ProjectStatus) => void
  onCapabilityToggle: (capability: string) => void
  onClear: () => void
}

export function FilterToolbar({
  projects,
  filters,
  onStatusToggle,
  onCapabilityToggle,
  onClear,
}: FilterToolbarProps) {
  const capabilityOptions = getCapabilityFilterOptions(projects)
  const statusOptions = getStatusFilterOptions(projects)
  const allProjectsSelected = !filters.status && !filters.capability

  return (
    <div className="filter-toolbar" role="group" aria-label="Project filters">
      <button
        type="button"
        aria-pressed={allProjectsSelected}
        onClick={onClear}
        disabled={allProjectsSelected}
      >
        全部项目
      </button>
      {statusOptions.map(({ status, label }) => (
        <button
          key={status}
          type="button"
          aria-pressed={filters.status === status}
          onClick={() => onStatusToggle(status)}
        >
          {label}
        </button>
      ))}
      {capabilityOptions.map((capability) => (
        <button
          key={capability}
          type="button"
          aria-pressed={filters.capability === capability}
          onClick={() => onCapabilityToggle(capability)}
        >
          {capability}
        </button>
      ))}
    </div>
  )
}
