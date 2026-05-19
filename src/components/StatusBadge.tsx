import { projectStatusLabels } from '../domain/project-labels'
import type { ProjectStatus } from '../domain/project-schema'

type StatusBadgeProps = {
  status: ProjectStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusCopy = projectStatusLabels[status]

  return (
    <span className={`status-badge status-badge--${status}`}>
      <span>{statusCopy.label}</span>
      <small>{statusCopy.description}</small>
    </span>
  )
}
