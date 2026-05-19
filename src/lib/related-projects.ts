import type { ProjectCard } from '../domain/project-schema'

export type ResolvedRelatedProject = {
  sourceProject: ProjectCard
  targetProject: ProjectCard
  relationship: string
}

export function resolveRelatedProjects(
  sourceProject: ProjectCard,
  projects: ProjectCard[],
): ResolvedRelatedProject[] {
  const relatedProjects = sourceProject.relatedProjects ?? []

  return relatedProjects.map((relatedProject) => {
    const targetProject = projects.find(
      (project) => project.id === relatedProject.projectId,
    )

    if (!targetProject) {
      throw new Error(
        `[${sourceProject.id}] relatedProjects target not found: ${relatedProject.projectId}`,
      )
    }

    return {
      sourceProject,
      targetProject,
      relationship: relatedProject.relationship,
    }
  })
}
