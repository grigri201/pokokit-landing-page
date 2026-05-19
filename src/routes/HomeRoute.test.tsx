import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { HomeRoute } from './HomeRoute'

describe('HomeRoute', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/')
  })

  it('renders the Compact Trust Index without merged-runtime claims', () => {
    render(<HomeRoute />)

    expect(
      screen.getByRole('heading', { name: 'Pokopia 工具目录' }),
    ).toBeInTheDocument()
    const filters = screen.getByRole('group', {
      name: 'Project filters',
    })
    expect(within(filters).getByRole('button', { name: '全部项目' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(within(filters).getByRole('button', { name: 'Available' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    expect(screen.queryByText(/统一账号|统一后端|云同步|数据合并/)).not.toBeInTheDocument()
  })

  it('renders both initial Project Cards from the manifest', () => {
    render(<HomeRoute />)

    expect(screen.getByRole('list', { name: /Project Cards/i })).toBeInTheDocument()

    const decorCard = screen.getByRole('article', { name: 'Pokopia Decor Dex' })
    expect(within(decorCard).getByText('Available')).toBeInTheDocument()
    expect(within(decorCard).getByText('Dex')).toBeInTheDocument()
    expect(within(decorCard).getByText('装饰推荐')).toBeInTheDocument()
    expect(
      within(decorCard).getByRole('link', { name: /打开 Decor Dex 工具/ }),
    ).toHaveAttribute('href', 'https://pokopia-decor-dex.tinytoolshelf.com')
    expect(
      within(decorCard).getByRole('link', { name: /打开 Decor Dex 工具/ }),
    ).toHaveAttribute('rel', 'noopener noreferrer')
    expect(within(decorCard).getByText('查看本地仓库')).toBeInTheDocument()
    expect(within(decorCard).getByText('开发者本地路径，不是公开工具入口。')).toBeInTheDocument()
    expect(
      within(decorCard).queryByRole('link', { name: /查看本地仓库/ }),
    ).not.toBeInTheDocument()

    const sceneCard = screen.getByRole('article', { name: 'Pokopia Scene Editor' })
    expect(within(sceneCard).getByText('In development')).toBeInTheDocument()
    expect(within(sceneCard).getByText('Editor')).toBeInTheDocument()
    expect(within(sceneCard).getByText('建筑层')).toBeInTheDocument()
    expect(
      within(sceneCard).getByRole('link', { name: /查看项目详情/ }),
    ).toHaveAttribute('href', '/projects/pokopia-scene-editor')
    expect(within(sceneCard).getByText('公开工具入口待确认')).toBeInTheDocument()
    expect(within(sceneCard).getByText('待确认')).toBeInTheDocument()
    expect(within(sceneCard).getByText(/尚未确认公开部署 URL/)).toBeInTheDocument()
    expect(
      within(sceneCard).queryByRole('link', { name: /公开工具入口待确认/ }),
    ).not.toBeInTheDocument()
    expect(within(sceneCard).getByText('查看规划文档')).toBeInTheDocument()
    expect(
      within(sceneCard).queryByRole('link', { name: /查看规划文档/ }),
    ).not.toBeInTheDocument()
  })

  it('filters by status and clears back to all projects', () => {
    render(<HomeRoute />)

    fireEvent.click(screen.getByRole('button', { name: 'Available' }))

    expect(window.location.search).toBe('?status=available')
    expect(screen.getByRole('article', { name: 'Pokopia Decor Dex' })).toBeInTheDocument()
    expect(screen.queryByRole('article', { name: 'Pokopia Scene Editor' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '全部项目' }))

    expect(window.location.search).toBe('')
    expect(screen.getByRole('article', { name: 'Pokopia Decor Dex' })).toBeInTheDocument()
    expect(screen.getByRole('article', { name: 'Pokopia Scene Editor' })).toBeInTheDocument()
  })

  it('syncs visible filters when browser history changes', async () => {
    render(<HomeRoute />)

    fireEvent.click(screen.getByRole('button', { name: 'Available' }))
    expect(screen.queryByRole('article', { name: 'Pokopia Scene Editor' })).not.toBeInTheDocument()

    window.history.pushState({}, '', '/')
    await act(async () => {
      window.dispatchEvent(new PopStateEvent('popstate'))
    })

    expect(window.location.search).toBe('')
    expect(screen.getByRole('article', { name: 'Pokopia Decor Dex' })).toBeInTheDocument()
    expect(screen.getByRole('article', { name: 'Pokopia Scene Editor' })).toBeInTheDocument()
  })

  it('ignores unknown capability query params', () => {
    window.history.replaceState({}, '', '/?capability=missing')

    render(<HomeRoute />)

    expect(screen.getByRole('article', { name: 'Pokopia Decor Dex' })).toBeInTheDocument()
    expect(screen.getByRole('article', { name: 'Pokopia Scene Editor' })).toBeInTheDocument()
  })

  it('filters by capability and combines filters with AND semantics', () => {
    render(<HomeRoute />)

    fireEvent.click(screen.getByRole('button', { name: '建筑层' }))
    expect(window.location.search).toBe('?capability=%E5%BB%BA%E7%AD%91%E5%B1%82')
    expect(screen.getByRole('article', { name: 'Pokopia Scene Editor' })).toBeInTheDocument()
    expect(screen.queryByRole('article', { name: 'Pokopia Decor Dex' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Available' }))
    expect(window.location.search).toBe(
      '?status=available&capability=%E5%BB%BA%E7%AD%91%E5%B1%82',
    )
    expect(screen.getByText('没有匹配的项目')).toBeInTheDocument()
    expect(screen.queryByRole('article')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '清除筛选' }))
    expect(window.location.search).toBe('')
    expect(screen.getByRole('article', { name: 'Pokopia Decor Dex' })).toBeInTheDocument()
    expect(screen.getByRole('article', { name: 'Pokopia Scene Editor' })).toBeInTheDocument()
  })
})
