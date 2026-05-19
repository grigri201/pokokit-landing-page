import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HomeRoute } from './HomeRoute'

describe('HomeRoute', () => {
  it('renders the Compact Trust Index without merged-runtime claims', () => {
    render(<HomeRoute />)

    expect(
      screen.getByRole('heading', { name: 'Pokopia 工具目录' }),
    ).toBeInTheDocument()
    const filterPreview = screen.getByRole('group', {
      name: 'Project filters preview',
    })
    expect(filterPreview).toHaveTextContent('筛选预览，Story 1.3 启用')
    expect(within(filterPreview).getByRole('button', { name: 'Available' })).toBeDisabled()
    expect(within(filterPreview).getByRole('button', { name: '装饰推荐' })).toBeDisabled()
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

    const sceneCard = screen.getByRole('article', { name: 'Pokopia Scene Editor' })
    expect(within(sceneCard).getByText('In development')).toBeInTheDocument()
    expect(within(sceneCard).getByText('Editor')).toBeInTheDocument()
    expect(within(sceneCard).getByText('建筑层')).toBeInTheDocument()
    expect(
      within(sceneCard).getByRole('link', { name: '查看项目详情' }),
    ).toHaveAttribute('href', '/projects/pokopia-scene-editor')
  })
})
