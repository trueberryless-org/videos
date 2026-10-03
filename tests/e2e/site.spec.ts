import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test.describe('overview', () => {
  test('lists the videos', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveTitle(/All videos/)
    await expect(page.getByRole('link', { name: /Diploma Thesis/ }).first()).toBeVisible()
  })

  test('has the canonical url and the standard Open Graph image', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://videos.felixs.dev/')
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://videos.felixs.dev/og-image.png')
    await expect(page.locator('link[rel="shortcut icon"]')).toHaveAttribute('href', '/favicon.svg')
  })
})

test.describe('video page', () => {
  test('shows the course', async ({ page }) => {
    await page.goto('/videos/thesis/')

    await expect(page.getByRole('heading', { level: 1 })).toContainText('Diploma Thesis')
    await expect(page.getByRole('heading', { name: /Lesson 1/ })).toBeVisible()
  })

  test('answers an interactive question', async ({ page }) => {
    await page.goto('/videos/thesis/')

    const quiz = page.locator('sl-videos-quiz').first()

    await quiz.getByText('Real-time data ingestion').click()
    await quiz.getByRole('button', { name: 'Submit' }).click()
    await expect(quiz.getByRole('alert')).toHaveText('Correct')
  })
})

test('shows a 404 page', async ({ page }) => {
  const response = await page.goto('/does-not-exist/')

  expect(response?.status()).toBe(404)
})

test.describe('accessibility', () => {
  for (const path of ['/', '/videos/thesis/']) {
    for (const colorScheme of ['dark', 'light'] as const) {
      test(`${path} has no violations in ${colorScheme} mode`, async ({ page }) => {
        await page.emulateMedia({ colorScheme })
        await page.goto(path)

        const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()

        expect(violations.map(({ id, nodes }) => `${id}: ${nodes.map(({ target }) => target.join(' ')).join(', ')}`)).toEqual([])
      })
    }
  }

  test('does not scroll horizontally', async ({ page }) => {
    await page.goto('/videos/thesis/')

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)

    expect(overflow).toBeLessThanOrEqual(0)
  })
})
