import type { ProjectEntrypoint } from '../domain/project-schema'
import { isExternalHref, isSafeAvailableHref } from '../lib/entrypoints'

type EntrypointButtonProps = {
  entrypoint: ProjectEntrypoint
}

export function EntrypointButton({ entrypoint }: EntrypointButtonProps) {
  if (
    entrypoint.availability !== 'available' ||
    !entrypoint.href ||
    !isSafeAvailableHref(entrypoint.href)
  ) {
    return (
      <div className="entrypoint-note" role="note">
        <strong>{entrypoint.label}</strong>
        {entrypoint.note ? <span>{entrypoint.note}</span> : null}
      </div>
    )
  }

  const external = isExternalHref(entrypoint.href)

  return (
    <a
      className="entrypoint-button"
      href={entrypoint.href}
      rel={external ? 'noopener noreferrer' : undefined}
      target={external ? '_blank' : undefined}
    >
      {entrypoint.label}
      {external ? <span className="entrypoint-target">外部工具</span> : null}
    </a>
  )
}
