import { test, expect } from '@playwright/test';
import fixtureData from './fixtures/recognition-result.fixture.json' with { type: 'json' };

test.describe('Presentation Mode gating', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((data) => {
      window.localStorage.setItem('gujian-recognition-result', JSON.stringify(data));
    }, fixtureData);
  });

  test('A: does not render presentation report without presentation param', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('[data-testid="presentation-report"]')).toHaveCount(0);
  });

  test('B: renders presentation report with ?presentation=1 and shows fixture name', async ({ page }) => {
    await page.goto('/?presentation=1');

    const report = page.locator('[data-testid="presentation-report"]');
    await expect(report).toBeVisible();
    await expect(report).toContainText(fixtureData.name);
    await expect(page.locator('[data-testid="presentation-headline"]')).toContainText(fixtureData.name);
    await expect(page.locator('[data-testid="presentation-evidence"]')).toBeVisible();
    await expect(page.locator('[data-testid="presentation-nextshots"]')).toBeVisible();
  });
});
