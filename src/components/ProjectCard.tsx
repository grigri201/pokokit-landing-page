import { useMemo } from 'react'
import type { CSSProperties } from 'react'
import {
  entrypointExternalTargetLabels,
  entrypointKindLabels,
} from '../domain/project-labels'
import type { ProjectCard as ProjectCardData } from '../domain/project-schema'
import {
  getPrimaryEntrypoint,
  isExternalHref,
  isSafeAvailableHref,
} from '../lib/entrypoints'
import { EntrypointButton } from './EntrypointButton'
import { StatusBadge } from './StatusBadge'

type ProjectCardProps = {
  languageMode?: 'zh' | 'en'
  project: ProjectCardData
}

type CardBackground = {
  accentColor: string
  src: string
}

type ProjectCardStyle = CSSProperties & {
  '--project-card-accent-color'?: string
}

const decorDexBackgrounds: readonly CardBackground[] = [
  {
    src: '/pokemon-portraits/bulbasaur.png',
    accentColor: '#a2dccd',
  },
  {
    src: '/pokemon-portraits/charmander.png',
    accentColor: '#f5b26b',
  },
  {
    src: '/pokemon-portraits/squirtle.png',
    accentColor: '#86c2df',
  },
  {
    src: '/pokemon-portraits/ditto.png',
    accentColor: '#d3bae8',
  },
]

const sceneEditorProjectId = 'pokopia-scene-editor'
const sceneEditorPlaceholderCopy = {
  zh: '正在调试中，还要等一会儿哦',
  en: 'Still debugging. Please wait a little longer.',
} as const

function getProjectCardBackground(projectId: string): CardBackground | undefined {
  if (projectId !== 'pokopia-decor-dex') {
    return undefined
  }

  return decorDexBackgrounds[Math.floor(Math.random() * decorDexBackgrounds.length)]
}

export function ProjectCard({ languageMode = 'zh', project }: ProjectCardProps) {
  const headingId = `${project.id}-title`
  const primaryEntrypoint = getPrimaryEntrypoint(project)
  const background = useMemo(
    () => getProjectCardBackground(project.id),
    [project.id],
  )
  const hasSceneEditorTeaser = project.id === sceneEditorProjectId
  const showStatusBadge = project.status !== 'available'
  const cardHref = primaryEntrypoint.href
  const canOpenCard =
    !hasSceneEditorTeaser &&
    primaryEntrypoint.availability === 'available' &&
    cardHref !== undefined &&
    isSafeAvailableHref(cardHref)
  const external = canOpenCard && cardHref !== undefined && isExternalHref(cardHref)
  const cardStyle: ProjectCardStyle | undefined = background
    ? { '--project-card-accent-color': background.accentColor }
    : undefined

  const card = (
    <article
      className="project-card"
      data-project-type={project.type}
      data-card-background={background ? 'true' : undefined}
      data-card-teaser={hasSceneEditorTeaser ? 'true' : undefined}
      style={cardStyle}
      aria-labelledby={headingId}
    >
      {background ? (
        <img
          className="project-card__background"
          src={background.src}
          alt=""
          aria-hidden="true"
        />
      ) : null}
      <div className="project-card__header">
        <div>
          <h3 id={headingId}>{project.name}</h3>
        </div>
        {showStatusBadge ? <StatusBadge status={project.status} compact /> : null}
      </div>

      <p className="project-card__tagline">{project.tagline}</p>

      <div className="project-card__footer">
        {hasSceneEditorTeaser ? (
          <SceneEditorTeaser languageMode={languageMode} />
        ) : canOpenCard ? (
          <ProjectCardCta external={external} entrypoint={primaryEntrypoint} />
        ) : (
          <EntrypointButton entrypoint={primaryEntrypoint} />
        )}
      </div>
    </article>
  )

  if (!canOpenCard || cardHref === undefined) {
    return card
  }

  return (
    <a
      className="project-card-link"
      href={cardHref}
      rel={external ? 'noopener noreferrer' : undefined}
      target={external ? '_blank' : undefined}
      aria-label={`${project.name}: ${primaryEntrypoint.label}`}
    >
      {card}
    </a>
  )
}

function SceneEditorTeaser({ languageMode }: { languageMode: 'zh' | 'en' }) {
  return (
    <div
      className="project-card__teaser"
      aria-label={
        languageMode === 'zh'
          ? 'Pokopia Scene Editor 占位对话'
          : 'Pokopia Scene Editor placeholder dialogue'
      }
    >
      <img
        className="project-card__teaser-avatar"
        src="/pokemon-portraits/ditto.png"
        alt=""
        aria-hidden="true"
      />
      <p className="project-card__teaser-bubble">
        {sceneEditorPlaceholderCopy[languageMode]}
      </p>
    </div>
  )
}

function ProjectCardCta({
  entrypoint,
  external,
}: {
  entrypoint: ProjectCardData['entrypoints'][number]
  external: boolean
}) {
  return (
    <span
      className="entrypoint-button entrypoint-button--primary project-card__cta"
      aria-hidden="true"
    >
      <span>{entrypoint.label}</span>
      <small>{entrypointKindLabels[entrypoint.kind]}</small>
      {external ? (
        <span className="entrypoint-target">
          {entrypointExternalTargetLabels[entrypoint.kind]}
        </span>
      ) : null}
    </span>
  )
}
