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
  await page.goto('/')

  await expect(
    page.getByRole('heading', { name: 'Pokopia 工具目录' }),
  ).toBeVisible()
  await expect(page.getByText('Pokopia Decor Dex')).toBeVisible()
  await expect(page.getByText('Pokopia Scene Editor')).toBeVisible()
})

test('renders a manifest-backed project detail route', async ({ page }) => {
  await page.goto('/projects/pokopia-scene-editor')

  await expect(
    page.getByRole('heading', { name: 'Pokopia Scene Editor' }),
  ).toBeVisible()
  await expect(
    page.getByText('用 7x7 工作台制作、预览、保存和恢复 5x5 Pokopia 布景。'),
  ).toBeVisible()
  await expect(page.getByRole('link', { name: '返回工具目录' })).toBeVisible()
})

test('renders unknown project recovery paths', async ({ page }) => {
  await page.goto('/projects/not-a-project')

  await expect(page.getByRole('heading', { name: '找不到项目' })).toBeVisible()
  await expect(page.getByRole('link', { name: '返回工具目录' })).toBeVisible()
  await expect(
    page.getByRole('link', { name: 'Pokopia Decor Dex 项目详情' }),
  ).toBeVisible()
})

test('renders wildcard route recovery paths', async ({ page }) => {
  await page.goto('/not-a-real-route')

  await expect(page.getByRole('heading', { name: '找不到项目' })).toBeVisible()
  await expect(page.getByRole('link', { name: '返回工具目录' })).toBeVisible()
})

for (const viewport of responsiveViewports) {
  test(`home layout remains readable without horizontal overflow at ${viewport.name}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport)
    await page.goto('/')

    await expectHomeCoreContent(page)
    await expectFilterToolbarBeforeCards(page)
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

for (const viewport of responsiveViewports) {
  test(`detail layout remains readable without horizontal overflow at ${viewport.name}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport)
    await page.goto('/projects/pokopia-scene-editor')

    await expectDetailCoreContent(page)
    await expectNoHorizontalOverflow(page)
    await expectNoVisibleBlockOverlap(page)

    if (viewport.width < 768) {
      await expectMinimumTapTargetSizes(page)
    }
  })
}

test('mobile detail route keeps long project copy and entrypoints readable', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/projects/pokopia-scene-editor')

  await expect(
    page.getByRole('heading', { name: 'Pokopia Scene Editor' }),
  ).toBeVisible()
  await expect(page.getByText('In development')).toBeVisible()
  await expect(
    page.getByLabel('Project capabilities').getByText('建筑层', { exact: true }),
  ).toBeVisible()
  await expect(page.getByText('公开工具入口待确认')).toBeVisible()
  await expect(page.getByText(/尚未确认公开部署 URL/)).toBeVisible()
  await expect(page.getByText('查看规划文档')).toBeVisible()
  await expect(page.getByRole('link', { name: /Pokopia Decor Dex/ })).toBeVisible()

  await injectLongDetailTextStress(page)
  await expectNoHorizontalOverflow(page)
  await expectNoVisibleBlockOverlap(page)
  await expectMinimumTapTargetSizes(page)
})

test('keyboard users can traverse filters and activate filter buttons', async ({
  page,
}) => {
  await page.goto('/')

  await expectNextTabFocus(page, /Available/)
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\?status=available/)
  await expect(page.getByText('Pokopia Decor Dex')).toBeVisible()
  await expect(page.getByText('Pokopia Scene Editor')).toHaveCount(0)

  await page.goto('/')
  await expectNextTabFocus(page, /Available/)
  await expectNextTabFocus(page, /In development/)
  await page.keyboard.press('Space')
  await expect(page).toHaveURL(/\?status=in-development/)
  await expect(page.getByText('Pokopia Scene Editor')).toBeVisible()

  await page.goto('/')
  await expectNextTabFocus(page, /Available/)
  await expectNextTabFocus(page, /In development/)
  await expectNextTabFocus(page, /Pokemon 色彩/)
  await expectNextTabFocus(page, /装饰推荐/)
  await expectNextTabFocus(page, /静态详情页/)
  await expectNextTabFocus(page, /可分享链接/)
  await expectNextTabFocus(page, /7x7 画布/)
  await expectNextTabFocus(page, /建筑层/)
  await expectNextTabFocus(page, /素材摆放/)
  await expectNextTabFocus(page, /技能标记/)
  await expectNextTabFocus(page, /保存恢复/)
  await expectNextTabFocus(page, /打开 Decor Dex 工具/)
  await expectNextTabFocus(page, /查看项目详情/)
})

test('keyboard users can reach detail, related, and recovery links by tabbing', async ({
  page,
}) => {
  await page.goto('/projects/pokopia-decor-dex')
  await expectNextTabFocus(page, /返回工具目录/)
  await expectNextTabFocus(page, /打开 Decor Dex 工具/)

  await page.goto('/projects/pokopia-scene-editor')
  await expectNextTabFocus(page, /返回工具目录/)
  await expectNextTabFocus(page, /Pokopia Decor Dex/)

  await page.goto('/projects/not-a-project')
  await expectNextTabFocus(page, /返回工具目录/)
  await expectNextTabFocus(page, /Pokopia Decor Dex 项目详情/)
})

test('filter empty state and not-found recovery expose readable next actions', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/?status=available&capability=建筑层')

  await expect(page.getByRole('heading', { name: '没有匹配的项目' })).toBeVisible()
  await expect(page.getByText(/当前状态和能力标签组合/)).toBeVisible()
  await expect(page.getByRole('button', { name: '清除筛选' })).toBeVisible()
  await expectNoHorizontalOverflow(page)
  await expectNoVisibleBlockOverlap(page)
  await expectMinimumTapTargetSizes(page)

  await page.goto('/projects/not-a-project')
  await expect(page.getByRole('heading', { name: '找不到项目' })).toBeVisible()
  await expect(page.getByRole('link', { name: '返回工具目录' })).toBeVisible()
  await expect(
    page.getByRole('link', { name: 'Pokopia Scene Editor 项目详情' }),
  ).toBeVisible()
  await expectNoHorizontalOverflow(page)
  await expectNoVisibleBlockOverlap(page)
  await expectMinimumTapTargetSizes(page)
})

async function expectHomeCoreContent(page: Page) {
  await expect(
    page.getByRole('heading', { name: 'Pokopia 工具目录' }),
  ).toBeVisible()
  await expect(page.getByRole('group', { name: 'Project filters' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Project Cards' })).toBeVisible()
  await expect(page.getByText('Pokopia Decor Dex')).toBeVisible()
  await expect(page.getByText('Pokopia Scene Editor')).toBeVisible()
  await expect(page.getByText('Available').first()).toBeVisible()
  await expect(page.getByText('In development').first()).toBeVisible()
  await expect(
    page.getByLabel('Pokopia Decor Dex 能力标签').getByText('Pokemon 色彩', {
      exact: true,
    }),
  ).toBeVisible()
  await expect(
    page.getByLabel('Pokopia Scene Editor 能力标签').getByText('建筑层', {
      exact: true,
    }),
  ).toBeVisible()
  await expect(page.getByRole('link', { name: /打开 Decor Dex 工具/ })).toBeVisible()
  await expect(page.getByRole('link', { name: /查看项目详情/ }).first()).toBeVisible()
}

async function expectDetailCoreContent(page: Page) {
  await expect(
    page.getByRole('heading', { name: 'Pokopia Scene Editor' }),
  ).toBeVisible()
  await expect(page.getByText('In development')).toBeVisible()
  await expect(
    page.getByLabel('Project capabilities').getByText('建筑层', { exact: true }),
  ).toBeVisible()
  await expect(page.getByText('公开工具入口待确认')).toBeVisible()
  await expect(page.getByText(/尚未确认公开部署 URL/)).toBeVisible()
  await expect(page.getByText('查看规划文档')).toBeVisible()
  await expect(page.getByRole('link', { name: /Pokopia Decor Dex/ })).toBeVisible()
}

async function expectFilterToolbarBeforeCards(page: Page) {
  const toolbarBox = await page
    .getByRole('group', { name: 'Project filters' })
    .boundingBox()
  const cardHeadingBox = await page
    .getByRole('heading', { name: 'Project Cards' })
    .boundingBox()

  expect(toolbarBox).not.toBeNull()
  expect(cardHeadingBox).not.toBeNull()
  expect(cardHeadingBox!.y).toBeGreaterThan(toolbarBox!.y + toolbarBox!.height - 1)
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
      '.not-found-state__actions a',
      '.not-found-state li a',
      '.project-detail__header',
      '.detail-section',
      '.related-projects a',
      '.source-policy__grid section',
      '.source-policy__notes',
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
      'a.entrypoint-button',
      'a.back-link',
      '.entrypoint-list a',
      '.related-projects a',
      '.not-found-state a',
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

      return activeElement.textContent?.replace(/\s+/g, ' ').trim() ?? ''
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
    const capability = document
      .querySelector('[aria-label="Pokopia Scene Editor 能力标签"]')
      ?.querySelector<HTMLElement>('.capability-tag')
    const entrypointLabel = document
      .querySelector<HTMLElement>('[href="/projects/pokopia-scene-editor"] span')

    if (projectTitle) {
      projectTitle.textContent = text
    }

    if (capability) {
      capability.textContent = text
    }

    if (entrypointLabel) {
      entrypointLabel.textContent = text
    }
  }, longUnbrokenText)
}

async function injectLongDetailTextStress(page: Page) {
  await page.evaluate((text) => {
    const detailTitle = document.querySelector<HTMLElement>('#project-detail-title')
    const capability = document
      .querySelector('[aria-label="Project capabilities"]')
      ?.querySelector<HTMLElement>('.capability-tag')
    const entrypointNoteLabel = document
      .querySelector<HTMLElement>('.entrypoint-note strong span:first-child')

    if (detailTitle) {
      detailTitle.textContent = text
    }

    if (capability) {
      capability.textContent = text
    }

    if (entrypointNoteLabel) {
      entrypointNoteLabel.textContent = text
    }
  }, longUnbrokenText)
}
