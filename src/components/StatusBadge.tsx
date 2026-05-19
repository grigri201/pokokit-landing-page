import { projectStatusLabels } from '../domain/project-labels'
import type { ProjectStatus } from '../domain/project-schema'

type StatusBadgeProps = {
  status: ProjectStatus
  compact?: boolean
}

const compactStatusLabels: Partial<Record<ProjectStatus, string>> = {
  'in-development': 'WIP',
}

export function StatusBadge({ status, compact = false }: StatusBadgeProps) {
  const statusCopy = projectStatusLabels[status]
  const label = compact ? compactStatusLabels[status] ?? statusCopy.label : statusCopy.label
  const className = compact
    ? `status-badge status-badge--${status} status-badge--compact`
    : `status-badge status-badge--${status}`

  return (
    <span className={className}>
      <span>{label}</span>
      {compact ? null : <small>{statusCopy.description}</small>}
    </span>
  )
}
