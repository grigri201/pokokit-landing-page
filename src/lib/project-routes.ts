import type { ProjectCard } from '../domain/project-schema'

export function getProjectPath(projectId: string): string {
  return `/projects/${projectId}`
}

export function findProjectById(
  projects: ProjectCard[],
  projectId: string | undefined,
): ProjectCard | undefined {
  return projects.find((project) => project.id === projectId)
}
