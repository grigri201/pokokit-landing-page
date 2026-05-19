import { Link, useParams } from 'react-router'
import { CapabilityTag } from '../components/CapabilityTag'
import { EntrypointButton } from '../components/EntrypointButton'
import { EntrypointList } from '../components/EntrypointList'
import { SourcePolicyBlock } from '../components/SourcePolicyBlock'
import { StatusBadge } from '../components/StatusBadge'
import { projects } from '../data/projects'
import { getDetailEntrypoints } from '../lib/detail-entrypoints'
import { findProjectById } from '../lib/project-routes'

function TextList({ items }: { items: string[] }) {
  return (
    <ul className="detail-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

export function ProjectDetailRoute() {
  const { projectId } = useParams()
  const project = findProjectById(projects, projectId)

  if (!project) {
    return (
      <main className="app-shell detail-page">
        <Link className="back-link" to="/">
          返回工具目录
        </Link>
        <section className="not-found-state" aria-labelledby="project-not-found-title">
          <p className="eyebrow">Project Detail</p>
          <h1 id="project-not-found-title">找不到项目</h1>
          <p>当前项目链接没有匹配到 Landing Page 中维护的 Project Manifest 记录。</p>
        </section>
      </main>
    )
  }

  const { entrypoints, primaryEntrypoint } = getDetailEntrypoints(project)
  const detailSummary = project.detailSummary ?? []

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

        <SourcePolicyBlock project={project} />
      </article>
    </main>
  )
}
