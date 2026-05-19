import { expect, test } from '@playwright/test'

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
