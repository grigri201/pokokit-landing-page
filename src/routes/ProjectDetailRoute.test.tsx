import { render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it } from 'vitest'
import type { ProjectCard } from '../domain/project-schema'
import { getDetailEntrypoints } from '../lib/detail-entrypoints'
import { extendedProjects } from '../test/project-fixtures'
import { ProjectDetailRoute } from './ProjectDetailRoute'

function renderDetail(path: string, projectList?: ProjectCard[]) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/projects/:projectId"
          element={<ProjectDetailRoute projectList={projectList} />}
        />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProjectDetailRoute', () => {
  it('renders Decor Dex detail content from the manifest', () => {
    renderDetail('/projects/pokopia-decor-dex')

    expect(
      screen.getByRole('heading', { level: 1, name: 'Pokopia Decor Dex' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Available')).toBeInTheDocument()
    expect(screen.getByText(/Pokemon 色彩、偏好词和装饰搭配/)).toBeInTheDocument()
    expect(screen.getByText('Pokopia 创作者')).toBeInTheDocument()
    expect(screen.getByText('Pokemon 色彩', { selector: '.capability-tag' })).toBeInTheDocument()
    expect(screen.getByText('装饰推荐')).toBeInTheDocument()
    expect(screen.getByText(/展示 Pokemon 主色、色板和偏好词/)).toBeInTheDocument()
    expect(screen.getByText(/可分享的静态详情页/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '来源和边界' })).toBeInTheDocument()
    expect(screen.getByText('人工维护')).toBeInTheDocument()
    expect(screen.getByText(/不是实时或自动同步数据/)).toBeInTheDocument()
    expect(screen.getByText('docs/pokopia_image_sources/**')).toBeInTheDocument()
    expect(screen.getByText('dist/docs/pokopia_image_sources/**')).toBeInTheDocument()
    expect(screen.getByText('full item manifest')).toBeInTheDocument()
    expect(screen.getByText(/Decor Dex 当前公开入口按 PRD 假设配置/)).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /打开 Decor Dex 工具/ }),
    ).toHaveAttribute('href', 'https://pokopia-decor-dex.tinytoolshelf.com')
    expect(screen.getByRole('link', { name: '返回工具目录' })).toHaveAttribute('href', '/')
  })

  it('renders Scene Editor detail content without a fake public tool link', () => {
    renderDetail('/projects/pokopia-scene-editor')

    expect(
      screen.getByRole('heading', { level: 1, name: 'Pokopia Scene Editor' }),
    ).toBeInTheDocument()
    expect(screen.getByText('In development')).toBeInTheDocument()
    expect(screen.getAllByText(/7x7 工作台/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/5x5 主体区/).length).toBeGreaterThan(0)
    expect(screen.getByText('建筑层')).toBeInTheDocument()
    expect(screen.getAllByText(/素材实例/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/技能标记/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/预览和保存恢复/).length).toBeGreaterThan(0)
    expect(screen.getByRole('heading', { name: '语义关联和参考关系' })).toBeInTheDocument()
    expect(
      screen.getByRole('link', {
        name: /Pokopia Decor Dex.*独立工具边界/,
      }),
    ).toHaveAttribute('href', '/projects/pokopia-decor-dex')
    expect(screen.getByText(/不代表运行时合并/)).toBeInTheDocument()
    expect(screen.getByText('SceneDocument save payloads')).toBeInTheDocument()
    expect(screen.getByText('localStorage UI preferences')).toBeInTheDocument()
    expect(screen.getByText('export files')).toBeInTheDocument()
    expect(screen.getByText('editor build artifacts')).toBeInTheDocument()
    expect(screen.getByText('future internal datasets')).toBeInTheDocument()
    expect(screen.getByText(/公开部署 URL 未确认前/)).toBeInTheDocument()

    const entrypoints = screen.getByLabelText('Project entrypoints')
    expect(within(entrypoints).getByText('公开工具入口待确认')).toBeInTheDocument()
    expect(
      within(entrypoints).queryByRole('link', { name: /公开工具入口待确认/ }),
    ).not.toBeInTheDocument()
    expect(
      within(entrypoints).queryByRole('link', { name: /查看项目详情/ }),
    ).not.toBeInTheDocument()
  })

  it('keeps a detail self-link when it is the only entrypoint', () => {
    const project = {
      id: 'self-link-only',
      entrypoints: [
        {
          id: 'self-detail',
          kind: 'detail',
          availability: 'available',
          label: '查看项目详情',
          href: '/projects/self-link-only',
          isPrimary: true,
        },
      ],
    } as ProjectCard

    const { entrypoints, primaryEntrypoint } = getDetailEntrypoints(project)

    expect(entrypoints).toHaveLength(1)
    expect(primaryEntrypoint.id).toBe('self-detail')
  })

  it('renders recovery paths for unknown project ids', () => {
    renderDetail('/projects/not-a-project')

    expect(screen.getByRole('heading', { level: 1, name: '找不到项目' })).toBeInTheDocument()
    expect(screen.getByText(/没有匹配到 Landing Page 中维护的 Project Manifest/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '返回工具目录' })).toHaveAttribute('href', '/')
    expect(
      screen.getByRole('link', { name: 'Pokopia Decor Dex 项目详情' }),
    ).toHaveAttribute('href', '/projects/pokopia-decor-dex')
    expect(
      screen.getByRole('link', { name: 'Pokopia Scene Editor 项目详情' }),
    ).toHaveAttribute('href', '/projects/pokopia-scene-editor')
  })

  it('renders a legal third project detail route from injected manifest data', () => {
    renderDetail('/projects/pokopia-map-planner', extendedProjects)

    expect(
      screen.getByRole('heading', { level: 1, name: 'Pokopia Map Planner' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Experimental')).toBeInTheDocument()
    expect(screen.getByText('路线规划')).toBeInTheDocument()
    expect(screen.getByText(/manifest-driven UI 扩展/)).toBeInTheDocument()
  })

  it('links to a legal third project from related project data', () => {
    renderDetail('/projects/pokopia-scene-editor', extendedProjects)

    expect(
      screen.getByRole('link', {
        name: /Pokopia Map Planner.*独立工具边界/,
      }),
    ).toHaveAttribute('href', '/projects/pokopia-map-planner')
  })
})
