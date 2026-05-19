import { expect, test } from '@playwright/test'

test('renders the manifest-backed landing baseline', async ({ page }) => {
  await page.goto('/')

  await expect(
    page.getByRole('heading', { name: 'Pokopia 工具目录' }),
  ).toBeVisible()
  await expect(page.getByText('Pokopia Decor Dex')).toBeVisible()
  await expect(page.getByText('Pokopia Scene Editor')).toBeVisible()
})
