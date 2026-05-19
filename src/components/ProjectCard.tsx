import { projectTypeLabels } from '../domain/project-labels'
import type { ProjectCard as ProjectCardData } from '../domain/project-schema'
import { getPrimaryEntrypoint } from '../lib/entrypoints'
import { CapabilityTag } from './CapabilityTag'
import { EntrypointButton } from './EntrypointButton'
import { EntrypointList } from './EntrypointList'
import { StatusBadge } from './StatusBadge'

type ProjectCardProps = {
  project: ProjectCardData
}

export function ProjectCard({ project }: ProjectCardProps) {
  const headingId = `${project.id}-title`
  const primaryEntrypoint = getPrimaryEntrypoint(project)

  return (
    <article className="project-card" aria-labelledby={headingId}>
      <div className="project-card__header">
        <div>
          <p className="project-card__type">{projectTypeLabels[project.type]}</p>
          <h3 id={headingId}>{project.name}</h3>
        </div>
        <StatusBadge status={project.status} />
      </div>

      <p className="project-card__tagline">{project.tagline}</p>

      <ul className="project-card__use-cases" aria-label={`${project.name} 核心使用场景`}>
        {project.primaryUseCases.slice(0, 2).map((useCase) => (
          <li key={useCase}>{useCase}</li>
        ))}
      </ul>

      <ul className="capability-list" aria-label={`${project.name} 能力标签`}>
        {project.capabilities.map((capability) => (
          <li key={capability}>
            <CapabilityTag label={capability} />
          </li>
        ))}
      </ul>

      <div className="project-card__actions">
        <EntrypointButton entrypoint={primaryEntrypoint} />
        <EntrypointList
          entrypoints={project.entrypoints}
          primaryEntrypointId={primaryEntrypoint.id}
        />
      </div>
    </article>
  )
}
