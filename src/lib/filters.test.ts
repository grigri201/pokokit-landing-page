import { describe, expect, it } from 'vitest'
import { projects } from '../data/projects'
import { extendedProjects } from '../test/project-fixtures'
import { getCapabilityFilterOptions, getStatusFilterOptions } from './filter-options'
import {
  filterProjects,
  parseFilters,
  toFilterSearchParams,
  toggleCapabilityFilter,
  toggleStatusFilter,
} from './filters'

describe('project filters', () => {
  it('filters by status', () => {
    expect(
      filterProjects(projects, { status: 'available' }).map((project) => project.id),
    ).toEqual(['pokopia-decor-dex'])
  })

  it('filters by capability', () => {
    expect(
      filterProjects(projects, { capability: '建筑层' }).map((project) => project.id),
    ).toEqual(['pokopia-scene-editor'])

    expect(
      filterProjects(projects, { capability: '装饰推荐' }).map((project) => project.id),
    ).toEqual(['pokopia-decor-dex'])
  })

  it('combines status and capability filters with AND semantics', () => {
    expect(
      filterProjects(projects, {
        status: 'available',
        capability: '建筑层',
      }),
    ).toEqual([])
  })

  it('parses and serializes URL search params', () => {
    const searchParams = new URLSearchParams(
      'status=available&capability=%E8%A3%85%E9%A5%B0%E6%8E%A8%E8%8D%90',
    )

    const filters = parseFilters(searchParams, projects)
    expect(filters).toEqual({
      status: 'available',
      capability: '装饰推荐',
    })
    expect(toFilterSearchParams(filters).toString()).toBe(
      'status=available&capability=%E8%A3%85%E9%A5%B0%E6%8E%A8%E8%8D%90',
    )
  })

  it('toggles filter values off when selected again', () => {
    expect(toggleStatusFilter({ status: 'available' }, 'available')).toEqual({})
    expect(toggleCapabilityFilter({ capability: '建筑层' }, '建筑层')).toEqual({})
  })

  it('ignores unknown capability URL params when projects are provided', () => {
    const searchParams = new URLSearchParams('capability=missing')

    expect(parseFilters(searchParams, projects)).toEqual({})
  })

  it('derives filter options and results for a legal third project', () => {
    expect(getStatusFilterOptions(extendedProjects)).toContainEqual({
      status: 'experimental',
      label: 'Experimental',
    })
    expect(getCapabilityFilterOptions(extendedProjects)).toContain('路线规划')
    expect(
      filterProjects(extendedProjects, { status: 'experimental' }).map(
        (project) => project.id,
      ),
    ).toEqual(['pokopia-map-planner'])
    expect(
      filterProjects(extendedProjects, { capability: '路线规划' }).map(
        (project) => project.id,
      ),
    ).toEqual(['pokopia-map-planner'])
  })
})
