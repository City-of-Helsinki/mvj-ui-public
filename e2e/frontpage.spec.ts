import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle('City of Helsinki plot and land renting system');
});

test('changes into Finnish', async ({ page }) => {
  await page.goto('/');

  const languageButton = page.getByLabel('Language');

  languageButton.click();
  
  const finnishButton = languageButton.getByText('Suomi');
  
  finnishButton.click();
  
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle('City of Helsinki plot and land renting system');
});