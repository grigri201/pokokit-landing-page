import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { extendedProjects } from '../test/project-fixtures'
import { HomeRoute } from './HomeRoute'

describe('HomeRoute', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/')
  })

  it('renders the Compact Trust Index without merged-runtime claims', () => {
    render(<HomeRoute />)

    expect(
      screen.getByRole('heading', { name: /^pokokit$/ }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '切换到深色模式' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '切换到英文' })).toHaveTextContent('EN')
    const authorButton = screen.getByRole('button', {
      name: '打开 @赛博许愿机 留言',
    })
    expect(authorButton).toHaveAttribute('title', '@赛博许愿机')
    expect(authorButton.querySelector('img')).toHaveAttribute(
      'src',
      '/cyber-wishing-machine-icon.png',
    )
    expect(screen.getByRole('link', { name: '打开 GitHub: grigri201' })).toHaveAttribute(
      'href',
      'https://github.com/grigri201',
    )
    expect(screen.getByRole('link', { name: '打开 GitHub: grigri201' })).toHaveAttribute(
      'rel',
      'noopener noreferrer',
    )
    expect(
      authorButton.compareDocumentPosition(
        screen.getByRole('link', { name: '打开 GitHub: grigri201' }),
      ) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    expect(screen.getByRole('contentinfo', { name: '@' })).toHaveTextContent(
      '@赛博许愿机',
    )
    expect(screen.queryByRole('group', { name: 'Project filters' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '全部项目' })).not.toBeInTheDocument()
    expect(screen.queryByText(/统一账号|统一后端|云同步|数据合并/)).not.toBeInTheDocument()
  })

  it('renders the initial Project Cards from the manifest', () => {
    render(<HomeRoute />)

    expect(screen.queryByRole('heading', { name: 'Status Tracker' })).not.toBeInTheDocument()
    expect(screen.getByRole('list', { name: /Projects/i })).toBeInTheDocument()
    expect(screen.getAllByRole('article').map((card) => card.getAttribute('aria-labelledby'))).toEqual([
      'pokopia-scene-editor-title',
      'pokokit-gallery-title',
      'pokopia-decor-dex-title',
    ])

    const galleryCard = screen.getByRole('article', { name: 'Pokokit Gallery' })
    expect(
      within(galleryCard).getByText('浏览公开 Pokopia 布景，并找回你保存到 Gallery 的场景。'),
    ).toBeInTheDocument()
    expect(galleryCard).toHaveAttribute('data-card-background', 'true')
    expect(galleryCard).toHaveAttribute('data-card-background-kind', 'gallery-cards')
    expect(galleryCard.style.getPropertyValue('--project-card-accent-color')).toBe(
      '#7bb8df',
    )
    expect(galleryCard.querySelector('.project-card__gallery-background')).toBeInTheDocument()
    expect(
      galleryCard.querySelectorAll('.project-card__gallery-card'),
    ).toHaveLength(5)
    expect(galleryCard.querySelector('.project-card__scene-grid')).not.toBeInTheDocument()
    expect(galleryCard.querySelector('.project-card__background')).not.toBeInTheDocument()
    expect(within(galleryCard).queryByText('公开场景')).not.toBeInTheDocument()
    expect(within(galleryCard).queryByText('查看本地仓库')).not.toBeInTheDocument()
    const galleryCardLink = screen.getByRole('link', { name: /打开 Gallery/ })
    expect(galleryCardLink).toContainElement(galleryCard)
    expect(galleryCardLink).toHaveAttribute('href', 'https://gallery.pokokit.com')
    expect(galleryCardLink).toHaveAttribute('rel', 'noopener noreferrer')

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
    expect(sceneCard).toHaveAttribute('data-card-background', 'true')
    expect(sceneCard).toHaveAttribute('data-card-background-kind', 'scene-grid')
    expect(sceneCard.style.getPropertyValue('--project-card-accent-color')).toBe(
      '#65d0b8',
    )
    expect(sceneCard.querySelector('.project-card__scene-grid')).toBeInTheDocument()
    expect(sceneCard.querySelectorAll('.project-card__scene-cell')).toHaveLength(49)
    expect(
      sceneCard.querySelectorAll('.project-card__scene-cell[data-scene-item]'),
    ).toHaveLength(11)
    expect(sceneCard.querySelector('.project-card__background')).not.toBeInTheDocument()
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

  it('opens and closes the Cyber Wishing Machine chat modal', () => {
    render(<HomeRoute />)

    fireEvent.click(screen.getByRole('button', { name: '打开 @赛博许愿机 留言' }))

    const dialog = screen.getByRole('dialog', { name: '@赛博许愿机' })
    const appContent = document.querySelector('.app-content')
    const closeButton = within(dialog).getByRole('button', {
      name: '关闭 @赛博许愿机 对话',
    })
    const issueLink = within(dialog).getByRole('link', { name: '发 issue' })
    expect(appContent).toHaveAttribute('aria-hidden', 'true')
    expect(appContent).toHaveAttribute('inert')
    expect(closeButton).toHaveFocus()
    expect(within(dialog).getByAltText('@赛博许愿机')).toHaveAttribute(
      'src',
      '/cyber-wishing-machine-icon.png',
    )
    expect(
      within(dialog).getByText('感谢你使用 pokokit，希望你喜欢这些工具'),
    ).toBeInTheDocument()
    expect(
      within(dialog).getByText(/抱歉，因为作者游戏进度比较慢/),
    ).toBeInTheDocument()
    expect(issueLink).toHaveAttribute(
      'href',
      'https://github.com/grigri201/pokokit-landing-page/issues/new',
    )
    expect(within(dialog).getByText(/QQ: 3693767633/)).toBeInTheDocument()
    expect(
      within(dialog).getByText('嘿嘿嘿嘿，正在憋一个大活。'),
    ).toBeInTheDocument()
    expect(
      within(dialog).getByText(
        '我的初心其实是可以让大家免登录直接使用，随用随走，可是这对保存多张岛建方案不利。我有点犹豫……',
      ),
    ).toBeInTheDocument()

    issueLink.focus()
    fireEvent.keyDown(window, { key: 'Tab' })
    expect(closeButton).toHaveFocus()

    fireEvent.keyDown(window, { key: 'Tab', shiftKey: true })
    expect(issueLink).toHaveFocus()

    fireEvent.click(closeButton)
    expect(screen.queryByRole('dialog', { name: '@赛博许愿机' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '打开 @赛博许愿机 留言' })).toHaveFocus()
    expect(appContent).not.toHaveAttribute('aria-hidden')
    expect(appContent).not.toHaveAttribute('inert')

    fireEvent.click(screen.getByRole('button', { name: '打开 @赛博许愿机 留言' }))
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.queryByRole('dialog', { name: '@赛博许愿机' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '打开 @赛博许愿机 留言' }))
    const reopenedDialog = screen.getByRole('dialog', { name: '@赛博许愿机' })
    fireEvent.click(reopenedDialog.parentElement as HTMLElement)
    expect(screen.queryByRole('dialog', { name: '@赛博许愿机' })).not.toBeInTheDocument()
  })

  it('ignores legacy filter query params while filtering is disabled', () => {
    window.history.replaceState({}, '', '/?status=available&capability=建筑层')

    render(<HomeRoute />)

    expect(window.location.search).toBe('?status=available&capability=%E5%BB%BA%E7%AD%91%E5%B1%82')
    expect(screen.queryByRole('group', { name: 'Project filters' })).not.toBeInTheDocument()
    expect(screen.getByRole('article', { name: 'Pokopia Decor Dex' })).toBeInTheDocument()
    expect(screen.getByRole('article', { name: 'Pokopia Scene Editor' })).toBeInTheDocument()
    expect(screen.getByRole('article', { name: 'Pokokit Gallery' })).toBeInTheDocument()
  })

  it('renders a legal additional project from injected manifest data', () => {
    render(<HomeRoute projectList={extendedProjects} />)

    expect(screen.getByRole('article', { name: 'Pokopia Map Planner' })).toBeInTheDocument()
    expect(screen.getByRole('article', { name: 'Pokokit Gallery' })).toBeInTheDocument()
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
    expect(screen.getByRole('button', { name: 'Open @赛博许愿机 message' })).toHaveAttribute(
      'title',
      '@赛博许愿机',
    )
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

    const galleryCard = screen.getByRole('article', { name: 'Pokokit Gallery' })
    expect(
      within(galleryCard).getByText(
        'Browse public Pokopia scenes and recover the scenes you saved to Gallery.',
      ),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Open Gallery/ })).toHaveAttribute(
      'href',
      'https://gallery.pokokit.com',
    )
  })
})
