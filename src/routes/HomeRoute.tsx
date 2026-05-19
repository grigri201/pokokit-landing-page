import { useEffect, useMemo, useState } from 'react'
import { EmptyState } from '../components/EmptyState'
import { FilterToolbar } from '../components/FilterToolbar'
import { ProjectCard } from '../components/ProjectCard'
import { projects } from '../data/projects'
import type { ProjectStatus } from '../domain/project-schema'
import {
  filterProjects,
  parseFilters,
  toFilterSearchParams,
  toggleCapabilityFilter,
  toggleStatusFilter,
} from '../lib/filters'

export function HomeRoute() {
  const [searchParams, setSearchParams] = useState(
    () => new URLSearchParams(window.location.search),
  )
  const filters = useMemo(() => parseFilters(searchParams, projects), [searchParams])
  const visibleProjects = filterProjects(projects, filters)

  useEffect(() => {
    const syncFiltersFromUrl = () => {
      setSearchParams(new URLSearchParams(window.location.search))
    }

    window.addEventListener('popstate', syncFiltersFromUrl)
    return () => window.removeEventListener('popstate', syncFiltersFromUrl)
  }, [])

  function updateFilters(nextFilters: typeof filters) {
    const nextSearchParams = toFilterSearchParams(nextFilters)
    const nextUrl = nextSearchParams.toString()
      ? `${window.location.pathname}?${nextSearchParams.toString()}`
      : window.location.pathname

    window.history.pushState({}, '', nextUrl)
    setSearchParams(nextSearchParams)
  }

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

        <FilterToolbar
          projects={projects}
          filters={filters}
          onStatusToggle={(status: ProjectStatus) =>
            updateFilters(toggleStatusFilter(filters, status))
          }
          onCapabilityToggle={(capability: string) =>
            updateFilters(toggleCapabilityFilter(filters, capability))
          }
          onClear={() => updateFilters({})}
        />
      </section>

      <section className="project-section" aria-labelledby="project-list-title">
        <h2 id="project-list-title">Project Cards</h2>
        {visibleProjects.length > 0 ? (
          <ul className="project-grid" aria-labelledby="project-list-title">
            {visibleProjects.map((project) => (
              <li key={project.id}>
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="没有匹配的项目"
            description="当前状态和能力标签组合没有对应的 Pokopia 工具。"
            actionLabel="清除筛选"
            onAction={() => updateFilters({})}
          />
        )}
      </section>
    </main>
  )
}
