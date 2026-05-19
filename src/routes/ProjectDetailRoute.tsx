import { Link, useParams } from 'react-router'
import { CapabilityTag } from '../components/CapabilityTag'
import { EntrypointButton } from '../components/EntrypointButton'
import { EntrypointList } from '../components/EntrypointList'
import { RelatedProjectLinks } from '../components/RelatedProjectLinks'
import { SourcePolicyBlock } from '../components/SourcePolicyBlock'
import { StatusBadge } from '../components/StatusBadge'
import { projects } from '../data/projects'
import type { ProjectCard } from '../domain/project-schema'
import { getDetailEntrypoints } from '../lib/detail-entrypoints'
import { findProjectById, getProjectPath } from '../lib/project-routes'
import { resolveRelatedProjects } from '../lib/related-projects'

function TextList({ items }: { items: string[] }) {
  return (
    <ul className="detail-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

type ProjectDetailRouteProps = {
  projectList?: ProjectCard[]
}

export function ProjectDetailRoute({ projectList = projects }: ProjectDetailRouteProps) {
  const { projectId } = useParams()
  const project = findProjectById(projectList, projectId)

  if (!project) {
    return (
      <main className="app-shell detail-page">
        <section className="not-found-state" aria-labelledby="project-not-found-title">
          <p className="eyebrow">Unknown Project</p>
          <h1 id="project-not-found-title">找不到项目</h1>
          <p>
            当前链接没有匹配到 Landing Page 中维护的 Project Manifest 记录。可以返回工具目录，或直接进入一个有效项目详情页。
          </p>
          <div className="not-found-state__actions">
            <Link className="entrypoint-button" to="/">
              返回工具目录
            </Link>
          </div>
          <section aria-labelledby="valid-projects-title">
            <h2 id="valid-projects-title">有效项目</h2>
            <ul>
              {projectList.map((validProject) => (
                <li key={validProject.id}>
                  <Link to={getProjectPath(validProject.id)}>
                    {validProject.name} 项目详情
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </section>
      </main>
    )
  }

  const { entrypoints, primaryEntrypoint } = getDetailEntrypoints(project)
  const detailSummary = project.detailSummary ?? []
  const relatedProjects = resolveRelatedProjects(project, projectList)

  return (
    <main className="app-shell detail-page">
      <Link className="back-link" to="/">
        返回工具目录
      </Link>

      <article className="project-detail" aria-labelledby="project-detail-title">
        <header className="project-detail__header">
          <div className="project-detail__title-group">
            <p className="eyebrow">Project Detail</p>
            <h1 id="project-detail-title">{project.name}</h1>
            <StatusBadge status={project.status} />
          </div>
          <p>{project.tagline}</p>

          <div className="project-detail__entrypoints" aria-label="Project entrypoints">
            <EntrypointButton entrypoint={primaryEntrypoint} />
            <EntrypointList
              entrypoints={entrypoints}
              primaryEntrypointId={primaryEntrypoint.id}
            />
          </div>
        </header>

        <section className="detail-section" aria-labelledby="detail-problem-title">
          <h2 id="detail-problem-title">解决的问题</h2>
          <p>{project.problem}</p>
        </section>

        <section className="detail-section" aria-labelledby="detail-audience-title">
          <h2 id="detail-audience-title">适合谁</h2>
          <TextList items={project.audiences} />
        </section>

        <section className="detail-section" aria-labelledby="detail-use-case-title">
          <h2 id="detail-use-case-title">核心使用场景</h2>
          <TextList items={project.primaryUseCases} />
        </section>

        <section className="detail-section" aria-labelledby="detail-capability-title">
          <h2 id="detail-capability-title">核心能力</h2>
          <ul className="tag-list" aria-label="Project capabilities">
            {project.capabilities.map((capability) => (
              <li key={capability}>
                <CapabilityTag label={capability} />
              </li>
            ))}
          </ul>
        </section>

        {detailSummary.length > 0 ? (
          <section className="detail-section" aria-labelledby="detail-summary-title">
            <h2 id="detail-summary-title">项目说明</h2>
            <TextList items={detailSummary} />
          </section>
        ) : null}

        <RelatedProjectLinks relatedProjects={relatedProjects} />

        <SourcePolicyBlock project={project} />
      </article>
    </main>
  )
}
