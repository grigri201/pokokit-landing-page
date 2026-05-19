import { ZodError, type ZodIssue } from 'zod'
import { projectManifestSchema, type ProjectManifest } from './project-schema'

export class ProjectManifestValidationError extends Error {
  readonly issues: string[]

  constructor(issues: string[]) {
    super(`Project Manifest validation failed:\n${issues.join('\n')}`)
    this.name = 'ProjectManifestValidationError'
    this.issues = issues
  }
}

export function validateProjectManifest(input: unknown): ProjectManifest {
  const parsed = projectManifestSchema.safeParse(input)

  if (!parsed.success) {
    throw new ProjectManifestValidationError(
      parsed.error.issues.map((issue) => formatZodIssue(issue, input)),
    )
  }

  const crossRecordIssues = validateCrossRecordRules(parsed.data)
  if (crossRecordIssues.length > 0) {
    throw new ProjectManifestValidationError(crossRecordIssues)
  }

  return parsed.data
}

function validateCrossRecordRules(manifest: ProjectManifest): string[] {
  const issues: string[] = []
  const seenIds = new Set<string>()
  const projectIds = new Set(manifest.projects.map((project) => project.id))

  manifest.projects.forEach((project, projectIndex) => {
    if (seenIds.has(project.id)) {
      issues.push(
        formatIssue(project.id, `projects.${projectIndex}.id`, 'duplicate project id'),
      )
    }
    seenIds.add(project.id)

    const primaryEntrypoints = project.entrypoints.filter(
      (entrypoint) => entrypoint.isPrimary,
    )
    if (primaryEntrypoints.length !== 1) {
      issues.push(
        formatIssue(
          project.id,
          `projects.${projectIndex}.entrypoints`,
          'exactly one primary entrypoint is required',
        ),
      )
    } else if (
      project.status === 'available' &&
      primaryEntrypoints[0]?.availability !== 'available'
    ) {
      issues.push(
        formatIssue(
          project.id,
          `projects.${projectIndex}.entrypoints`,
          'available projects must use an available primary entrypoint',
        ),
      )
    }

    project.relatedProjects?.forEach((relatedProject, relatedIndex) => {
      if (!projectIds.has(relatedProject.projectId)) {
        issues.push(
          formatIssue(
            project.id,
            `projects.${projectIndex}.relatedProjects.${relatedIndex}.projectId`,
            `unknown related project id "${relatedProject.projectId}"`,
          ),
        )
      }
    })
  })

  return issues
}

function formatZodIssue(issue: ZodIssue, input: unknown): string {
  const path = issue.path.length > 0 ? issue.path.join('.') : 'manifest'
  const projectId = getProjectIdForPath(input, issue.path)
  return formatIssue(projectId, path, issue.message)
}

function getProjectIdForPath(input: unknown, path: readonly PropertyKey[]): string {
  if (path[0] !== 'projects' || typeof path[1] !== 'number') {
    return 'manifest'
  }

  if (!isRecord(input)) {
    return 'unknown-project'
  }

  const projects = input.projects
  if (!Array.isArray(projects)) {
    return 'unknown-project'
  }

  const project = projects[path[1]]
  if (!isRecord(project) || typeof project.id !== 'string') {
    return `projects.${path[1]}`
  }

  return project.id
}

function formatIssue(projectId: string, path: string, reason: string): string {
  return `[${projectId}] ${path}: ${reason}`
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function assertValidProjectManifest(input: unknown): asserts input is ProjectManifest {
  validateProjectManifest(input)
}

export function getValidationIssues(error: unknown): string[] {
  if (error instanceof ProjectManifestValidationError) {
    return error.issues
  }

  if (error instanceof ZodError) {
    return error.issues.map((issue) => issue.message)
  }

  return [String(error)]
}
