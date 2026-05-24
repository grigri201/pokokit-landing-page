import { render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { extendedProjects } from '../test/project-fixtures'
import { HomeRoute } from './HomeRoute'

describe('HomeRoute', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/')
  })

  it('renders the Compact Trust Index without merged-runtime claims', () => {
    render(<HomeRoute />)

    expect(screen.getByRole('heading', { name: 'pokokit' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '切换到深色模式' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '切换到英文' })).toHaveTextContent('EN')
    expect(screen.getByRole('link', { name: '打开 GitHub: grigri201' })).toHaveAttribute(
      'href',
      'https://github.com/grigri201',
    )
    expect(screen.getByRole('link', { name: '打开 GitHub: grigri201' })).toHaveAttribute(
      'rel',
      'noopener noreferrer',
    )
    expect(screen.getByRole('contentinfo', { name: '@' })).toHaveTextContent(
      '@赛博许愿机',
    )
    expect(screen.queryByRole('group', { name: 'Project filters' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '全部项目' })).not.toBeInTheDocument()
    expect(screen.queryByText(/统一账号|统一后端|云同步|数据合并/)).not.toBeInTheDocument()
  })

  it('renders both initial Project Cards from the manifest', () => {
    render(<HomeRoute />)

    expect(screen.queryByRole('heading', { name: 'Status Tracker' })).not.toBeInTheDocument()
    expect(screen.getByRole('list', { name: /Projects/i })).toBeInTheDocument()

    const decorCard = screen.getByRole('article', { name: 'Pokopia Decor Dex' })
    expect(decorCard).toHaveAttribute('data-card-background', 'true')
    expect(decorCard.style.getPropertyValue('--project-card-accent-color')).toMatch(
      /^#[0-9a-f]{6}$/i,
    )
    const decorCardBackground = decorCard.querySelector('.project-card__background')
    expect(decorCardBackground?.getAttribute('src')).toMatch(
      /pokemon-portraits\/(?:bulbasaur|charmander|squirtle|ditto)\.png/,
    )
    expect(decorCardBackground).toHaveAttribute('alt', '')
    expect(decorCardBackground).toHaveAttribute('aria-hidden', 'true')
    expect(within(decorCard).queryByText('Available')).not.toBeInTheDocument()
    expect(within(decorCard).queryByText('Dex')).not.toBeInTheDocument()
    expect(within(decorCard).queryByLabelText('Pokopia Decor Dex 能力标签')).not.toBeInTheDocument()
    expect(within(decorCard).queryByText('装饰推荐')).not.toBeInTheDocument()
    expect(within(decorCard).queryByText('+2')).not.toBeInTheDocument()
    const decorCardLink = screen.getByRole('link', { name: /打开 Decor Dex 工具/ })
    expect(decorCardLink).toContainElement(decorCard)
    expect(decorCardLink).toHaveAttribute(
      'href',
      'https://decor-dex.pokokit.com',
    )
    expect(decorCardLink).toHaveAttribute('rel', 'noopener noreferrer')
    expect(within(decorCard).queryByText('查看 Pokemon 主色和色板')).not.toBeInTheDocument()
    expect(within(decorCard).queryByText('查看本地仓库')).not.toBeInTheDocument()
    expect(
      within(decorCard).queryByText('开发者本地路径，不是公开工具入口。'),
    ).not.toBeInTheDocument()
    expect(
      within(decorCard).queryByRole('link', { name: /查看本地仓库/ }),
    ).not.toBeInTheDocument()

    const sceneCard = screen.getByRole('article', { name: 'Pokopia Scene Editor' })
    expect(
      within(sceneCard).getByText('用 7*7 工作台记录和分享你的Pokopia布景'),
    ).toBeInTheDocument()
    expect(sceneCard).not.toHaveAttribute('data-card-background')
    expect(sceneCard).not.toHaveAttribute('data-card-teaser')
    expect(within(sceneCard).queryByText('WIP')).not.toBeInTheDocument()
    expect(within(sceneCard).queryByText('In development')).not.toBeInTheDocument()
    expect(within(sceneCard).queryByText('Editor')).not.toBeInTheDocument()
    expect(within(sceneCard).queryByLabelText('Pokopia Scene Editor 能力标签')).not.toBeInTheDocument()
    expect(within(sceneCard).queryByText('建筑层')).not.toBeInTheDocument()
    expect(within(sceneCard).queryByText('+3')).not.toBeInTheDocument()
    const sceneCardLink = screen.getByRole('link', { name: /打开 Scene Editor 工具/ })
    expect(sceneCardLink).toContainElement(sceneCard)
    expect(sceneCardLink).toHaveAttribute(
      'href',
      'https://scene-editor.pokokit.com',
    )
    expect(sceneCardLink).toHaveAttribute('rel', 'noopener noreferrer')
    expect(
      within(sceneCard).queryByLabelText('Pokopia Scene Editor 占位对话'),
    ).not.toBeInTheDocument()
    expect(
      within(sceneCard).queryByText('正在调试中，还要等一会儿哦'),
    ).not.toBeInTheDocument()
    expect(within(sceneCard).queryByText('规划 5x5 主体区和外围装饰区')).not.toBeInTheDocument()
    expect(within(sceneCard).queryByText('公开工具入口待确认')).not.toBeInTheDocument()
    expect(within(sceneCard).queryByText('待确认')).not.toBeInTheDocument()
    expect(within(sceneCard).queryByText(/尚未确认公开部署 URL/)).not.toBeInTheDocument()
    expect(
      within(sceneCard).queryByRole('link', { name: /公开工具入口待确认/ }),
    ).not.toBeInTheDocument()
    expect(within(sceneCard).queryByText('查看规划文档')).not.toBeInTheDocument()
    expect(
      within(sceneCard).queryByRole('link', { name: /查看规划文档/ }),
    ).not.toBeInTheDocument()
  })

  it('ignores legacy filter query params while filtering is disabled', () => {
    window.history.replaceState({}, '', '/?status=available&capability=建筑层')

    render(<HomeRoute />)

    expect(window.location.search).toBe('?status=available&capability=%E5%BB%BA%E7%AD%91%E5%B1%82')
    expect(screen.queryByRole('group', { name: 'Project filters' })).not.toBeInTheDocument()
    expect(screen.getByRole('article', { name: 'Pokopia Decor Dex' })).toBeInTheDocument()
    expect(screen.getByRole('article', { name: 'Pokopia Scene Editor' })).toBeInTheDocument()
  })

  it('renders a legal third project from injected manifest data', () => {
    render(<HomeRoute projectList={extendedProjects} />)

    expect(screen.getByRole('article', { name: 'Pokopia Map Planner' })).toBeInTheDocument()
    expect(screen.getByRole('article', { name: 'Pokopia Decor Dex' })).toBeInTheDocument()
    expect(screen.getByRole('article', { name: 'Pokopia Scene Editor' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Experimental' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '路线规划' })).not.toBeInTheDocument()
  })

  it('renders an empty manifest state without filter recovery actions', () => {
    render(<HomeRoute projectList={[]} />)

    expect(screen.getByText('暂无项目')).toBeInTheDocument()
    expect(screen.getByText('当前 manifest 中没有可展示的 Pokopia 工具。')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '清除筛选' })).not.toBeInTheDocument()
  })

  it('renders English home copy when the language is switched', () => {
    render(<HomeRoute languageMode="en" themeMode="dark" />)

    expect(screen.getByRole('button', { name: 'Switch to light mode' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Switch to Chinese' })).toHaveTextContent('中')
    expect(screen.getByRole('link', { name: 'Open GitHub: grigri201' })).toHaveAttribute(
      'href',
      'https://github.com/grigri201',
    )
    expect(screen.getByRole('contentinfo', { name: '@' })).toHaveTextContent(
      '@Cyber Wishing Machine',
    )

    const decorCard = screen.getByRole('article', { name: 'Pokopia Decor Dex' })
    expect(
      within(decorCard).getByText(
        'A Pokopia dex for Pokemon colors, preference terms, and decor pairings.',
      ),
    ).toBeInTheDocument()
    expect(within(decorCard).queryByText(/Pokemon 色彩/)).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Open Decor Dex Tool/ })).toHaveAttribute(
      'href',
      'https://decor-dex.pokokit.com',
    )

    const sceneCard = screen.getByRole('article', { name: 'Pokopia Scene Editor' })
    expect(
      within(sceneCard).getByText(
        'Record and share your Pokopia scenes on a 7*7 workspace.',
      ),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Open Scene Editor Tool/ })).toHaveAttribute(
      'href',
      'https://scene-editor.pokokit.com',
    )
    expect(
      within(sceneCard).queryByLabelText('Pokopia Scene Editor placeholder dialogue'),
    ).not.toBeInTheDocument()
    expect(
      within(sceneCard).queryByText('Still debugging. Please wait a little longer.'),
    ).not.toBeInTheDocument()
  })
})
