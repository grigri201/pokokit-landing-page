import type { ProjectEntrypoint } from '../domain/project-schema'
import { EntrypointButton } from './EntrypointButton'

type EntrypointListProps = {
  entrypoints: ProjectEntrypoint[]
  primaryEntrypointId: string
}

export function EntrypointList({
  entrypoints,
  primaryEntrypointId,
}: EntrypointListProps) {
  const secondaryEntrypoints = entrypoints.filter(
    (entrypoint) => entrypoint.id !== primaryEntrypointId,
  )

  if (secondaryEntrypoints.length === 0) {
    return null
  }

  return (
    <ul className="entrypoint-list" aria-label="其他入口">
      {secondaryEntrypoints.map((entrypoint) => (
        <li key={entrypoint.id}>
          <EntrypointButton entrypoint={entrypoint} variant="secondary" />
        </li>
      ))}
    </ul>
  )
}
