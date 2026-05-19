import {
  entrypointAvailabilityLabels,
  entrypointExternalTargetLabels,
  entrypointKindLabels,
} from '../domain/project-labels'
import type { ProjectEntrypoint } from '../domain/project-schema'
import { isExternalHref, isSafeAvailableHref } from '../lib/entrypoints'

type EntrypointButtonProps = {
  entrypoint: ProjectEntrypoint
  variant?: 'primary' | 'secondary'
}

export function EntrypointButton({
  entrypoint,
  variant = 'primary',
}: EntrypointButtonProps) {
  if (
    entrypoint.availability !== 'available' ||
    !entrypoint.href ||
    !isSafeAvailableHref(entrypoint.href)
  ) {
    return (
      <div className="entrypoint-note" role="note">
        <strong>
          <span>{entrypoint.label}</span>
          <span>{entrypointAvailabilityLabels[entrypoint.availability]}</span>
        </strong>
        <small>{entrypointKindLabels[entrypoint.kind]}</small>
        {entrypoint.note ? <span>{entrypoint.note}</span> : null}
      </div>
    )
  }

  const external = isExternalHref(entrypoint.href)

  return (
    <a
      className={`entrypoint-button entrypoint-button--${variant}`}
      href={entrypoint.href}
      rel={external ? 'noopener noreferrer' : undefined}
      target={external ? '_blank' : undefined}
    >
      <span>{entrypoint.label}</span>
      <small>{entrypointKindLabels[entrypoint.kind]}</small>
      {external ? (
        <span className="entrypoint-target">
          {entrypointExternalTargetLabels[entrypoint.kind]}
        </span>
      ) : null}
    </a>
  )
}
