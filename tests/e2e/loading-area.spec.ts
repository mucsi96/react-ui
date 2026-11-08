import { expect, test } from '@playwright/test';
import type { Locator } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { captureGallery } from './screenshots';

async function expectCentered(indicator: Locator, area: Locator) {
  const inner = (await indicator.boundingBox())!;
  const outer = (await area.boundingBox())!;
  expect(Math.abs(inner.x + inner.width / 2 - outer.x - outer.width / 2)).toBeLessThan(2);
  expect(Math.abs(inner.y + inner.height / 2 - outer.y - outer.height / 2)).toBeLessThan(2);
}

test('page loading fills the content below the header and resolves', async ({ page }, testInfo) => {
  await page.goto('#/loading-preview');
  const indicator = page.getByRole('progressbar', { name: 'Loading workspace' });
  await expect(indicator).toBeVisible();
  await expect(page.getByRole('progressbar')).toHaveCount(1);
  const main = page.getByRole('main');
  await expectCentered(indicator, main);
  const headerBox = (await page.getByRole('banner').boundingBox())!;
  const mainBox = (await main.boundingBox())!;
  expect(mainBox.y).toBeCloseTo(headerBox.y + headerBox.height, 0);
  expect(mainBox.y + mainBox.height).toBeCloseTo(page.viewportSize()!.height, 0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
    page.viewportSize()!.width,
  );
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await captureGallery(page, testInfo, 'loading-area-page');
  await page.getByRole('button', { name: 'Finish loading', exact: true }).click();
  await expect(indicator).toHaveCount(0);
  await expect(main).toContainText('Workspace ready.');
  await page.getByRole('button', { name: 'Reload workspace' }).click();
  await expect(indicator).toBeVisible();
});

test('section and dialog loaders remain local and respect reduced motion', async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('#/loaders');
  const section = page.getByRole('region', { name: 'Section loading', exact: true });
  const indicator = section.getByRole('progressbar', { name: 'Loading recent activity' });
  await expect(indicator).toBeVisible();
  await expect(section.getByRole('progressbar')).toHaveCount(1);
  await expectCentered(indicator, indicator.locator('..'));
  await expect(indicator.locator('..')).toHaveCSS('min-block-size', '192px');
  await expect(indicator.locator('span').first()).toHaveCSS('animation-name', 'none');
  await captureGallery(page, testInfo, 'loading-area-section', { target: section });
  await section.getByRole('button', { name: 'Finish section loading' }).click();
  await expect(indicator).toHaveCount(0);
  await expect(section).toContainText('Your activity is up to date.');

  const trigger = page.getByRole('button', { name: 'Open loading dialog' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Source options' });
  const dialogLoader = dialog.getByRole('progressbar', { name: 'Loading source options' });
  await expect(dialogLoader).toBeVisible();
  await expect(dialog.getByRole('progressbar')).toHaveCount(1);
  await expectCentered(dialogLoader, dialogLoader.locator('..'));
  await expect(dialogLoader.locator('..')).toHaveCSS('min-block-size', '192px');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await captureGallery(page, testInfo, 'loading-area-dialog', { fullPage: false });
  await dialog.getByRole('button', { name: 'Cancel' }).click();
  await expect(trigger).toBeFocused();
});
