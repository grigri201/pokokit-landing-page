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
  project: ProjectCardData
}

type CardBackground = {
  accentColor: string
  kind: 'gallery-cards' | 'image' | 'scene-grid'
  sceneVariant?: 'editor'
  src?: string
}

type ProjectCardStyle = CSSProperties & {
  '--project-card-accent-color'?: string
}

const decorDexBackgrounds: readonly CardBackground[] = [
  {
    kind: 'image',
    src: '/pokemon-portraits/bulbasaur.png',
    accentColor: '#a2dccd',
  },
  {
    kind: 'image',
    src: '/pokemon-portraits/charmander.png',
    accentColor: '#f5b26b',
  },
  {
    kind: 'image',
    src: '/pokemon-portraits/squirtle.png',
    accentColor: '#86c2df',
  },
  {
    kind: 'image',
    src: '/pokemon-portraits/ditto.png',
    accentColor: '#d3bae8',
  },
]

function getProjectCardBackground(projectId: string): CardBackground | undefined {
  if (projectId === 'pokopia-scene-editor') {
    return {
      kind: 'scene-grid',
      accentColor: '#65d0b8',
      sceneVariant: 'editor',
    }
  }

  if (projectId === 'pokokit-gallery') {
    return {
      kind: 'gallery-cards',
      accentColor: '#7bb8df',
    }
  }

  if (projectId === 'pokopia-decor-dex') {
    return decorDexBackgrounds[deterministicIndex(projectId, decorDexBackgrounds.length)]
  }

  return undefined
}

function deterministicIndex(value: string, modulo: number): number {
  const hash = Array.from(value).reduce((currentHash, character) => {
    return (currentHash * 31 + character.charCodeAt(0)) >>> 0
  }, 0)

  return hash % modulo
}

const sceneItemCellsByVariant = {
  editor: new Map<number, string>([
    [9, 'apple'],
    [11, 'berry'],
    [16, 'lamp'],
    [18, 'table'],
    [23, 'bean'],
    [25, 'peach'],
    [31, 'rug'],
    [32, 'rug'],
    [33, 'seat'],
    [39, 'pond'],
    [45, 'wheat'],
  ]),
} satisfies Record<'editor', Map<number, string>>

const galleryCardTones = ['sky', 'mint', 'sun', 'coral', 'lilac'] as const

export function ProjectCard({ project }: ProjectCardProps) {
  const headingId = `${project.id}-title`
  const primaryEntrypoint = getPrimaryEntrypoint(project)
  const background = useMemo(
    () => getProjectCardBackground(project.id),
    [project.id],
  )
  const showStatusBadge = project.status !== 'available'
  const cardHref = primaryEntrypoint.href
  const canOpenCard =
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
      data-project-id={project.id}
      data-project-type={project.type}
      data-card-background={background ? 'true' : undefined}
      data-card-background-kind={background?.kind}
      style={cardStyle}
      aria-labelledby={headingId}
    >
      {background?.kind === 'image' ? (
        <img
          className="project-card__background"
          src={background.src}
          alt=""
          aria-hidden="true"
        />
      ) : null}
      {background?.kind === 'scene-grid' ? (
        <SceneGridBackground variant={background.sceneVariant ?? 'editor'} />
      ) : null}
      {background?.kind === 'gallery-cards' ? (
        <GalleryCardsBackground />
      ) : null}
      <div className="project-card__header">
        <div>
          <h3 id={headingId}>{project.name}</h3>
        </div>
        {showStatusBadge ? <StatusBadge status={project.status} compact /> : null}
      </div>

      <p className="project-card__tagline" data-project-tagline>
        {project.tagline}
      </p>

      <div className="project-card__footer">
        {canOpenCard ? (
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
      data-project-card-link={project.id}
      href={cardHref}
      rel={external ? 'noopener noreferrer' : undefined}
      target={external ? '_blank' : undefined}
      aria-label={`${project.name}: ${primaryEntrypoint.label}`}
    >
      {card}
    </a>
  )
}

function SceneGridBackground({ variant }: { variant: 'editor' }) {
  const sceneItemCells = sceneItemCellsByVariant[variant]

  return (
    <div className="project-card__scene-background" aria-hidden="true">
      <div className="project-card__scene-grid">
        {Array.from({ length: 49 }, (_, index) => {
          const item = sceneItemCells.get(index)
          const row = Math.floor(index / 7)
          const column = index % 7
          const zone = row === 0 || row === 6 || column === 0 || column === 6 ? 'edge' : 'core'

          return (
            <span
              className="project-card__scene-cell"
              data-scene-item={item}
              data-scene-zone={zone}
              key={index}
            />
          )
        })}
      </div>
    </div>
  )
}

function GalleryCardsBackground() {
  return (
    <div className="project-card__gallery-background" aria-hidden="true">
      {galleryCardTones.map((tone) => (
        <span className="project-card__gallery-card" data-gallery-card={tone} key={tone} />
      ))}
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
      data-primary-entrypoint-id={entrypoint.id}
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
