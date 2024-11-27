import { test, expect } from '@playwright/test';
import finnishTranslations from '../src/i18n/fi/common.json' with { type: "json" };
import englishTranslations from '../src/i18n/en/common.json' with { type: "json" };
import swedishTranslations from '../src/i18n/sv/common.json' with { type: "json" };



test('has correct title in Finnish', async ({ page }) => {
  await page.goto('/');
  const finnishTitle = finnishTranslations['mainAppTitle'];
  await expect(page).toHaveTitle(finnishTitle);
});

test('has correct title in English', async ({ browser }) => {
  const context = await browser.newContext({locale: 'en'});
  const page = await context.newPage();
  await page.goto('/');
  await expect(page).toHaveTitle(englishTranslations['mainAppTitle']);
});

test('has correct title in Swedish', async ({ browser }) => {
  const context = await browser.newContext({locale: 'sv'});
  const page = await context.newPage();
  await page.goto('/');
  await expect(page).toHaveTitle(swedishTranslations['mainAppTitle']);

});

test('Accepting cookies hides cookie banner', async ({ page }) => {
  await page.goto('/');
  const cookieApproveButton = page.getByTestId('cookie-consent-approve-button');
  await cookieApproveButton.click();    
  await expect(cookieApproveButton).toHaveCount(0);
  });
