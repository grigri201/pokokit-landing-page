import { z } from 'zod'

export const PROJECT_STATUSES = [
  'planned',
  'in-development',
  'available',
  'experimental',
  'maintenance',
  'archived',
] as const

export const PROJECT_TYPES = [
  'dex',
  'editor',
  'tool',
  'data',
  'utility',
  'showcase',
] as const

export const ENTRYPOINT_KINDS = [
  'tool',
  'detail',
  'repo',
  'docs',
  'external',
] as const

export const ENTRYPOINT_AVAILABILITIES = [
  'available',
  'disabled',
  'local-only',
  'tbd',
] as const

export const SOURCE_DISPLAY_SOURCES = [
  'landing-manifest',
  'planning-artifacts',
  'public-project-manifest',
  'manual-summary',
] as const

export const DATA_FRESHNESS_VALUES = [
  'manual',
  'build-time',
  'project-manifest',
  'unknown',
] as const

const projectIdSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'must be stable kebab-case')

function isAvailableEntrypointHref(href: string): boolean {
  return (href.startsWith('/') && !href.startsWith('//')) || /^https:\/\//.test(href)
}

export const entrypointSchema = z
  .object({
    id: z.string().min(1),
    kind: z.enum(ENTRYPOINT_KINDS),
    availability: z.enum(ENTRYPOINT_AVAILABILITIES),
    label: z.string().min(1),
    href: z.string().min(1).optional(),
    note: z.string().min(1).optional(),
    isPrimary: z.boolean().optional(),
  })
  .superRefine((entrypoint, context) => {
    if (entrypoint.availability === 'available' && !entrypoint.href) {
      context.addIssue({
        code: 'custom',
        path: ['href'],
        message: 'available entrypoints must include href',
      })
    }

    if (
      entrypoint.availability === 'available' &&
      entrypoint.href &&
      !isAvailableEntrypointHref(entrypoint.href)
    ) {
      context.addIssue({
        code: 'custom',
        path: ['href'],
        message: 'available entrypoints must use a public URL or same-site path',
      })
    }

    if (
      (entrypoint.availability === 'disabled' || entrypoint.availability === 'tbd') &&
      entrypoint.href
    ) {
      context.addIssue({
        code: 'custom',
        path: ['href'],
        message: `${entrypoint.availability} entrypoints must not include href`,
      })
    }

    if (entrypoint.availability !== 'available' && !entrypoint.note) {
      context.addIssue({
        code: 'custom',
        path: ['note'],
        message: `${entrypoint.availability} entrypoints must explain why they are unavailable`,
      })
    }
  })

export const sourcePolicySchema = z.object({
  displaySource: z.enum(SOURCE_DISPLAY_SOURCES),
  initializedFrom: z.array(z.string().min(1)).min(1),
  doesNotRead: z.array(z.string().min(1)).min(1),
})

export const relatedProjectSchema = z.object({
  projectId: projectIdSchema,
  relationship: z.string().min(1),
})

export const projectSchema = z.object({
  id: projectIdSchema,
  name: z.string().min(1),
  tagline: z.string().min(1),
  type: z.enum(PROJECT_TYPES),
  status: z.enum(PROJECT_STATUSES),
  audiences: z.array(z.string().min(1)).min(1),
  primaryUseCases: z.array(z.string().min(1)).min(1),
  capabilities: z.array(z.string().min(1)).min(1),
  entrypoints: z.array(entrypointSchema).min(1),
  sourcePolicy: sourcePolicySchema,
  dataFreshness: z.enum(DATA_FRESHNESS_VALUES),
  problem: z.string().min(1).optional(),
  detailSummary: z.array(z.string().min(1)).optional(),
  relatedProjects: z.array(relatedProjectSchema).optional(),
  maintainerNotes: z.array(z.string().min(1)).optional(),
})

export const projectManifestSchema = z.object({
  version: z.literal(1),
  projects: z.array(projectSchema).min(1),
})

export type ProjectStatus = (typeof PROJECT_STATUSES)[number]
export type ProjectType = (typeof PROJECT_TYPES)[number]
export type EntrypointKind = (typeof ENTRYPOINT_KINDS)[number]
export type EntrypointAvailability =
  (typeof ENTRYPOINT_AVAILABILITIES)[number]
export type SourceDisplaySource = (typeof SOURCE_DISPLAY_SOURCES)[number]
export type DataFreshness = (typeof DATA_FRESHNESS_VALUES)[number]
export type ProjectEntrypoint = z.infer<typeof entrypointSchema>
export type RelatedProject = z.infer<typeof relatedProjectSchema>
export type ProjectCard = z.infer<typeof projectSchema>
export type ProjectManifest = z.infer<typeof projectManifestSchema>
