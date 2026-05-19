import { ProjectCard } from '../components/ProjectCard'
import { projects } from '../data/projects'
import { getCapabilityFilterOptions, getStatusFilterOptions } from '../lib/filter-options'

export function HomeRoute() {
  const filterPreviewOptions = [
    '全部项目',
    ...getStatusFilterOptions(projects),
    ...getCapabilityFilterOptions(projects),
  ]

  return (
    <main className="app-shell">
      <section className="trust-index" aria-labelledby="page-title">
        <div className="trust-index__intro">
          <p className="eyebrow">Pokopia Ecosystem</p>
          <h1 id="page-title">Pokopia 工具目录</h1>
          <p>
            一个轻量的生态目录，用于判断当前有哪些 Pokopia 工具、是否可用、以及下一步应该进入哪里。
          </p>
        </div>

        <div
          className="filter-toolbar"
          role="group"
          aria-label="Project filters preview"
          aria-describedby="filter-preview-note"
        >
          <span id="filter-preview-note" className="filter-toolbar__note">
            筛选预览，Story 1.3 启用
          </span>
          {filterPreviewOptions.map((option) => (
            <button key={option} type="button" disabled>
              {option}
            </button>
          ))}
        </div>
      </section>

      <section className="project-section" aria-labelledby="project-list-title">
        <h2 id="project-list-title">Project Cards</h2>
        <ul className="project-grid" aria-labelledby="project-list-title">
          {projects.map((project) => (
            <li key={project.id}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
