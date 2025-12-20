import { test, expect } from '@playwright/test'

test('can filter recipes and clear filter to show all recipes', async ({
  page,
}) => {
  await page.goto('/')

  // Get initial count of all recipes
  const allRecipesLocator = page.locator('.grid > div')
  const initialCount = await allRecipesLocator.count()
  expect(initialCount).toBeGreaterThan(0)

  // Wait for any initial animations to complete
  await page.waitForTimeout(300)

  // Find the filter input
  const filterInput = page.getByPlaceholder('filter')
  await expect(filterInput).toBeVisible()

  // Type 'cran' to filter recipes
  await filterInput.fill('cran')

  // Wait for filtered recipes to appear (wait for count to change)
  await expect(async () => {
    const count = await page.locator('.grid > div').count()
    expect(count).toBeLessThan(initialCount)
  }).toPass({ timeout: 2000 })

  await page.waitForTimeout(300) // Wait for animations to complete

  // Verify filtered recipes appear (should be fewer than initial)
  const filteredRecipesLocator = page.locator('.grid > div')
  const filteredCount = await filteredRecipesLocator.count()
  expect(filteredCount).toBeGreaterThan(0)
  expect(filteredCount).toBeLessThan(initialCount)

  // Clear filter by setting value to empty string
  // This simulates clearing the filter and triggers the onChange event
  await filterInput.fill('')

  // Wait for all recipes to reappear (wait for count to return to initial)
  await expect(async () => {
    const count = await page.locator('.grid > div').count()
    expect(count).toBe(initialCount)
  }).toPass({ timeout: 2000 })

  await page.waitForTimeout(300) // Wait for animations to complete

  // Verify all recipes reappear
  const allRecipesAfterClear = page.locator('.grid > div')
  const finalCount = await allRecipesAfterClear.count()
  expect(finalCount).toBe(initialCount)

  // Verify the filter input is empty
  await expect(filterInput).toHaveValue('')
})
