import { test, expect } from '@playwright/test';

test('can view and interact with recipes', async ({ page }) => {
  await page.goto('/');

  // see that atleast one recipe exists
  const recipeLocator = page.locator('.grid > div:has(img)').first();
  await expect(recipeLocator).toBeVisible();

  const recipeImage = recipeLocator.getByRole('img');
  const recipeTitle = await recipeImage.getAttribute('alt');
  expect(recipeTitle).not.toBeNull();

  // open recipe
  await recipeImage.click();

  // see recipe image
  const imageLocator = page.getByRole('img', { name: recipeTitle! });
  await expect(imageLocator).toBeVisible();

  // see sections summary, ingredients, and preperation
  const summaryLocator = page.getByRole('heading', { name: 'Summary' });
  await expect(summaryLocator).toBeVisible();
  const ingredientsLocator = page.getByRole('heading', { name: 'Ingredients' });
  await expect(ingredientsLocator).toBeVisible();
  const preperationLocator = page.getByRole('heading', { name: 'Preparation' });
  await expect(preperationLocator).toBeVisible();

  // can change serving size and see ingredients update
  const servingsInput = page.getByTestId('servings-input');
  const originalValue = await servingsInput.inputValue();
  const ingredientLocator = page.getByTestId('ingredient').first();
  const originalIngredient = await ingredientLocator.textContent();

  await servingsInput.fill((parseInt(originalValue) * 2).toString());

  await expect(ingredientLocator).not.toHaveText(originalIngredient!);
});
