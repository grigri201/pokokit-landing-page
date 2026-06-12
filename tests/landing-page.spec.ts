import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

const responsiveViewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'small desktop', width: 1024, height: 768 },
  { name: 'wide desktop', width: 1440, height: 900 },
] as const

const longUnbrokenText =
  'PokopiaSceneEditorResponsiveReleaseHardeningLongUnbrokenProjectNameAndEntrypointLabel'

test('renders the manifest-backed landing baseline', async ({ page }) => {
  await setLightTheme(page)
  await page.goto('/')

  await expect(
    page.getByRole('heading', { name: 'pokokit', exact: true }),
  ).toBeVisible()
  await expect(page.getByRole('button', { name: '切换到深色模式' })).toBeVisible()
  await expect(page.getByRole('button', { name: '切换到英文' })).toHaveText('EN')
  await expect(page.getByRole('button', { name: '打开 @赛博许愿机 留言' })).toHaveAttribute(
    'title',
    '@赛博许愿机',
  )
  await expect(page.getByRole('link', { name: '打开 GitHub: grigri201' })).toHaveAttribute(
    'href',
    'https://github.com/grigri201',
  )
  await expect(page.getByRole('group', { name: 'Project filters' })).toHaveCount(0)
  await expect(page.getByRole('button', { name: '全部项目' })).toHaveCount(0)
  await expect(page.getByText('Pokopia Decor Dex')).toBeVisible()
  await expect(page.getByText('Pokopia Scene Editor')).toBeVisible()
  await expect(page.getByText('Pokokit Gallery')).toBeVisible()
  await expect(page.getByRole('article').first()).toHaveAttribute(
    'aria-labelledby',
    'pokopia-scene-editor-title',
  )
  await expect(page.getByRole('article').nth(1)).toHaveAttribute(
    'aria-labelledby',
    'pokokit-gallery-title',
  )
  await expect(page.getByRole('contentinfo', { name: '@' })).toContainText(
    '赛博许愿机',
  )
})

test('theme toggle switches the page between light and dark modes', async ({
  page,
}) => {
  await setLightTheme(page)
  await page.goto('/')

  await page.getByRole('button', { name: '切换到深色模式' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expect(page.getByRole('button', { name: '切换到浅色模式' })).toBeVisible()

  await page.getByRole('button', { name: '切换到浅色模式' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
})

test('language toggle switches home copy between Chinese and English', async ({
  page,
}) => {
  await setLightTheme(page)
  await page.goto('/')

  await page.getByRole('button', { name: '切换到英文' }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.getByRole('button', { name: 'Switch to dark mode' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Switch to Chinese' })).toHaveText('中')
  await expect(page.getByRole('button', { name: 'Open @赛博许愿机 message' })).toHaveAttribute(
    'title',
    '@赛博许愿机',
  )
  await expect(page.getByRole('link', { name: 'Open GitHub: grigri201' })).toBeVisible()
  await expect(
    page.getByText('A Pokopia dex for Pokemon colors, preference terms, and decor pairings.'),
  ).toBeVisible()
  await expect(page.getByRole('link', { name: /Open Decor Dex Tool/ })).toBeVisible()
  await expect(page.getByRole('link', { name: /Open Gallery/ })).toBeVisible()
  await expect(page.getByRole('contentinfo', { name: '@' })).toContainText(
    'Cyber Wishing Machine',
  )
  await expect(page.getByRole('link', { name: /Open Scene Editor Tool/ })).toBeVisible()
  await expect(page.getByText('Still debugging. Please wait a little longer.')).toHaveCount(0)

  await page.getByRole('button', { name: 'Switch to Chinese' }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN')
  await expect(page.getByRole('button', { name: '切换到深色模式' })).toBeVisible()
  await expect(page.getByText('Pokemon 色彩、偏好词和装饰搭配的 Pokopia 图鉴。')).toBeVisible()
})

test.describe('browser locale language detection', () => {
  test.use({ locale: 'en-US' })

  test('initializes English copy for non-Chinese browser locales', async ({
    page,
  }) => {
    await setLightTheme(page)
    await page.goto('/')

    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.getByRole('button', { name: 'Switch to Chinese' })).toHaveText('中')
    await expect(
      page.getByText(
        'A Pokopia dex for Pokemon colors, preference terms, and decor pairings.',
      ),
    ).toBeVisible()

    await page.getByRole('button', { name: 'Switch to Chinese' }).click()
    await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN')
    await expect(page.getByRole('button', { name: '切换到英文' })).toHaveText('EN')
  })
})

test('redirects unsupported paths back to root', async ({ page }) => {
  for (const unsupportedPath of [
    '/projects/pokopia-decor-dex',
    '/projects/pokopia-scene-editor',
    '/projects/pokokit-gallery',
    '/projects/not-a-project',
    '/unexpected-path',
    '/#/projects/pokopia-decor-dex',
  ]) {
    await page.goto(unsupportedPath)
    await expect(page).toHaveURL(/\/$/)
    await expect(
      page.getByRole('heading', { name: 'pokokit', exact: true }),
    ).toBeVisible()
    await expect(page.getByText('Pokopia Decor Dex')).toBeVisible()
    await expect(page.getByRole('heading', { name: '找不到项目' })).toHaveCount(0)
  }
})

for (const viewport of responsiveViewports) {
  test(`home layout remains readable without horizontal overflow at ${viewport.name}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport)
    await setLightTheme(page)
    await page.goto('/')

    await expectHomeCoreContent(page)
    await expectNoHorizontalOverflow(page)
    await expectNoVisibleBlockOverlap(page)

    if (viewport.width < 768) {
      await injectLongHomeTextStress(page)
      await expectNoHorizontalOverflow(page)
      await expectNoVisibleBlockOverlap(page)
      await expectMinimumTapTargetSizes(page)
    }
  })
}

test('keyboard users can reach theme and project actions without filters', async ({
  page,
}) => {
  await setLightTheme(page)
  await page.goto('/')

  await expectNextTabFocus(page, /切换到深色模式/)
  await expectNextTabFocus(page, /EN/)
  await expectNextTabFocus(page, /打开 @赛博许愿机 留言/)
  await expectNextTabFocus(page, /打开 GitHub: grigri201/)
  await expectNextTabFocus(page, /打开 Scene Editor 工具/)
})

test('Cyber Wishing Machine modal shows chat copy and closes with Escape', async ({
  page,
}) => {
  await setLightTheme(page)
  await page.goto('/')

  await page.getByRole('button', { name: '打开 @赛博许愿机 留言' }).click()

  const dialog = page.getByRole('dialog', { name: '@赛博许愿机' })
  await expect(dialog).toBeVisible()
  await expect(page.locator('.app-content')).toHaveAttribute('aria-hidden', 'true')
  await expect(page.locator('.app-content')).toHaveAttribute('inert', '')
  await expect(dialog.getByAltText('@赛博许愿机')).toHaveAttribute(
    'src',
    '/cyber-wishing-machine-icon.png',
  )
  await expect(dialog.getByText('感谢你使用 pokokit，希望你喜欢这些工具')).toBeVisible()
  await expect(dialog.getByText(/抱歉，因为作者游戏进度比较慢/)).toBeVisible()
  await expect(dialog.getByRole('link', { name: '发 issue' })).toHaveAttribute(
    'href',
    'https://github.com/grigri201/pokokit-landing-page/issues/new',
  )
  await expect(dialog.getByText(/QQ: 3693767633/)).toBeVisible()
  await expect(dialog.getByText('嘿嘿嘿嘿，正在憋一个大活。')).toBeVisible()
  await expect(
    dialog.getByText(
      '我的初心其实是可以让大家免登录直接使用，随用随走，可是这对保存多张岛建方案不利。我有点犹豫……',
    ),
  ).toBeVisible()

  await expect(dialog.getByRole('button', { name: '关闭 @赛博许愿机 对话' })).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(dialog.getByRole('link', { name: '发 issue' })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(dialog.getByRole('button', { name: '关闭 @赛博许愿机 对话' })).toBeFocused()

  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog', { name: '@赛博许愿机' })).toHaveCount(0)
  await expect(page.locator('.app-content')).not.toHaveAttribute('aria-hidden', 'true')
  await expect(page.locator('.app-content')).not.toHaveAttribute('inert', '')
  await expect(page.getByRole('button', { name: '打开 @赛博许愿机 留言' })).toBeFocused()
})

test('Cyber Wishing Machine modal supports close button, backdrop, mobile, and dark mode', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')

  await page.getByRole('button', { name: '打开 @赛博许愿机 留言' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expect(page.getByRole('dialog', { name: '@赛博许愿机' })).toBeVisible()
  await expectNoHorizontalOverflow(page)

  await page.getByRole('button', { name: '关闭 @赛博许愿机 对话' }).click()
  await expect(page.getByRole('dialog', { name: '@赛博许愿机' })).toHaveCount(0)

  await page.getByRole('button', { name: '打开 @赛博许愿机 留言' }).click()
  await page.locator('.author-modal-backdrop').click({ position: { x: 8, y: 8 } })
  await expect(page.getByRole('dialog', { name: '@赛博许愿机' })).toHaveCount(0)
})

test('legacy filter query keeps the root page readable', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/?status=available&capability=建筑层')

  await expect(page.getByText('Pokopia Decor Dex')).toBeVisible()
  await expect(page.getByText('Pokopia Scene Editor')).toBeVisible()
  await expect(page.getByText('Pokokit Gallery')).toBeVisible()
  await expect(page.getByRole('button', { name: '清除筛选' })).toHaveCount(0)
  await expectNoHorizontalOverflow(page)
  await expectNoVisibleBlockOverlap(page)
  await expectMinimumTapTargetSizes(page)
})

async function expectHomeCoreContent(page: Page) {
  await expect(
    page.getByRole('heading', { name: 'pokokit', exact: true }),
  ).toBeVisible()
  await expect(page.getByRole('button', { name: '切换到英文' })).toBeVisible()
  await expect(page.getByRole('button', { name: '打开 @赛博许愿机 留言' })).toBeVisible()
  await expect(page.getByRole('group', { name: 'Project filters' })).toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'Projects' })).toHaveCount(0)
  await expect(page.getByRole('list', { name: 'Projects' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Status Tracker' })).toHaveCount(0)
  await expect(page.getByText('Pokopia Decor Dex')).toBeVisible()
  await expect(page.getByText('Pokopia Scene Editor')).toBeVisible()
  await expect(page.getByText('Pokokit Gallery')).toBeVisible()
  await expect(page.getByRole('contentinfo')).toBeVisible()
  await expect(page.getByText('Available')).toHaveCount(0)
  await expect(page.getByText('WIP')).toHaveCount(0)
  await expect(page.getByLabel('Pokopia Decor Dex 能力标签')).toHaveCount(0)
  await expect(page.getByLabel('Pokopia Scene Editor 能力标签')).toHaveCount(0)
  await expect(page.getByRole('link', { name: /打开 Decor Dex 工具/ })).toBeVisible()
  await expect(page.getByRole('link', { name: /打开 Scene Editor 工具/ })).toBeVisible()
  await expect(page.getByRole('link', { name: /打开 Gallery/ })).toBeVisible()
  await expect(page.getByText('正在调试中，还要等一会儿哦')).toHaveCount(0)
}

async function setLightTheme(page: Page) {
  await page.emulateMedia({ colorScheme: 'light' })
}

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => {
    const documentElementOverflow =
      document.documentElement.scrollWidth - document.documentElement.clientWidth
    const bodyOverflow = document.body.scrollWidth - document.body.clientWidth

    return Math.max(documentElementOverflow, bodyOverflow)
  })

  expect(overflow).toBeLessThanOrEqual(1)
}

async function expectNoVisibleBlockOverlap(page: Page) {
  const overlaps = await page.evaluate(() => {
    const selectors = [
      '.filter-toolbar button',
      '.project-card',
      '.status-badge',
      '.capability-tag',
      '.entrypoint-button',
      '.entrypoint-note',
      '.empty-state',
    ].join(',')

    const visibleElements = Array.from(
      document.querySelectorAll<HTMLElement>(selectors),
    ).filter((element) => {
      const box = element.getBoundingClientRect()
      const style = window.getComputedStyle(element)

      return (
        box.width > 0 &&
        box.height > 0 &&
        style.visibility !== 'hidden' &&
        style.display !== 'none' &&
        element.textContent?.trim()
      )
    })

    const failures: string[] = []

    for (let index = 0; index < visibleElements.length; index += 1) {
      for (let compareIndex = index + 1; compareIndex < visibleElements.length; compareIndex += 1) {
        const first = visibleElements[index]
        const second = visibleElements[compareIndex]

        if (first.contains(second) || second.contains(first)) {
          continue
        }

        const firstBox = first.getBoundingClientRect()
        const secondBox = second.getBoundingClientRect()
        const overlapWidth =
          Math.min(firstBox.right, secondBox.right) - Math.max(firstBox.left, secondBox.left)
        const overlapHeight =
          Math.min(firstBox.bottom, secondBox.bottom) - Math.max(firstBox.top, secondBox.top)

        if (overlapWidth > 1 && overlapHeight > 1) {
          failures.push(
            `${first.textContent?.trim()} overlaps ${second.textContent?.trim()}`,
          )
        }
      }
    }

    return failures
  })

  expect(overlaps).toEqual([])
}

async function expectMinimumTapTargetSizes(page: Page) {
  const undersizedTargets = await page.evaluate(() => {
    const selector = [
      'button',
      '.project-card-link',
      'a.entrypoint-button',
    ].join(',')

    return Array.from(document.querySelectorAll<HTMLElement>(selector))
      .filter((element) => {
        const box = element.getBoundingClientRect()
        const style = window.getComputedStyle(element)

        return (
          box.width > 0 &&
          box.height > 0 &&
          style.visibility !== 'hidden' &&
          style.display !== 'none' &&
          !(box.width >= 43.5 && box.height >= 43.5) &&
          box.width * box.height < 1936
        )
      })
      .map((element) => ({
        text: element.textContent?.trim(),
        width: element.getBoundingClientRect().width,
        height: element.getBoundingClientRect().height,
      }))
  })

  expect(undersizedTargets).toEqual([])
}

async function expectFocusedElementHasVisibleRing(page: Page) {
  const outline = await page.evaluate(() => {
    const focused = document.activeElement

    if (!(focused instanceof HTMLElement)) {
      return null
    }

    const style = window.getComputedStyle(focused)
    return {
      color: style.outlineColor,
      offset: style.outlineOffset,
      style: style.outlineStyle,
      width: style.outlineWidth,
    }
  })

  expect(outline).not.toBeNull()
  expect(outline?.style).not.toBe('none')
  expect(outline?.color).not.toMatch(/transparent|rgba\(0,\s*0,\s*0,\s*0\)/)
  expect(Number.parseFloat(outline?.width ?? '0')).toBeGreaterThan(0)
  expect(Number.parseFloat(outline?.offset ?? '0')).toBeGreaterThanOrEqual(0)
}

async function expectNextTabFocus(page: Page, text: RegExp) {
  let activeText = ''

  for (let attempt = 0; attempt < 20; attempt += 1) {
    await page.keyboard.press('Tab')
    activeText = await page.evaluate(() => {
      const activeElement = document.activeElement

      if (!(activeElement instanceof HTMLElement)) {
        return ''
      }

      const focusableSelector =
        'a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])'

      if (!activeElement.matches(focusableSelector)) {
        return ''
      }

      return (
        activeElement.textContent?.replace(/\s+/g, ' ').trim() ||
        activeElement.getAttribute('aria-label') ||
        ''
      )
    })

    if (text.test(activeText)) {
      await expectFocusedElementHasVisibleRing(page)
      return
    }
  }

  expect(activeText).toMatch(text)
  await expectFocusedElementHasVisibleRing(page)
}

async function injectLongHomeTextStress(page: Page) {
  await page.evaluate((text) => {
    const projectTitle = document.querySelector<HTMLElement>('#pokopia-scene-editor-title')
    const teaserLabel = document.querySelector<HTMLElement>('.project-card__teaser-bubble')

    if (projectTitle) {
      projectTitle.textContent = text
    }

    if (teaserLabel) {
      teaserLabel.textContent = text
    }
  }, longUnbrokenText)
}
