import { expect, test } from '@playwright/test';

test('header wraps without overflow and keeps content aligned', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('#/layout-preview');
  const header = page.getByRole('banner');
  const main = page.getByRole('main');
  await expect(page.getByRole('heading', { name: 'Your workspace' })).toBeVisible();
  const headerBox = (await header.boundingBox())!;
  const mainBox = (await main.boundingBox())!;
  const brandBox = (await page.getByRole('link', { name: 'My application' }).boundingBox())!;
  const navBox = (await page.getByRole('navigation').boundingBox())!;
  expect(navBox.y).toBeGreaterThanOrEqual(brandBox.y + brandBox.height);
  expect(mainBox.y).toBeGreaterThanOrEqual(headerBox.y + headerBox.height);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
  await page.getByRole('button', { name: 'Profile menu' }).click();
  await expect(page.getByRole('menuitem', { name: 'Igor Bari' })).toBeVisible();
  await page.keyboard.press('Escape');

  await page.setViewportSize({ width: 1024, height: 768 });
  await page.addStyleTag({
    content: ':root { --bt-app-max-width: 800px; --bt-app-gutter: 24px; }',
  });
  const brand = (await page.getByRole('link', { name: 'My application' }).boundingBox())!;
  const heading = (await page.getByRole('heading', { name: 'Your workspace' }).boundingBox())!;
  expect(brand.x).toBe(136);
  expect(heading.x).toBe(brand.x);
});

test('safe-area insets add space without shrinking the header row', async ({ page, context }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  const session = await context.newCDPSession(page);
  await session.send('Emulation.setSafeAreaInsetsOverride', {
    insets: { top: 32, left: 40, right: 48, bottom: 24 },
  });
  await page.goto('#/layout-preview');
  await expect(page.getByRole('heading', { name: 'Your workspace' })).toBeVisible();
  const header = (await page.getByRole('banner').boundingBox())!;
  const brand = (await page.getByRole('link', { name: 'My application' }).boundingBox())!;
  const heading = (await page.getByRole('heading', { name: 'Your workspace' }).boundingBox())!;
  const profile = (await page.getByRole('button', { name: 'Profile menu' }).boundingBox())!;
  expect(header.height).toBe(97);
  expect(brand.y).toBeGreaterThanOrEqual(32);
  expect(brand.x).toBe(40);
  expect(heading.x).toBe(40);
  expect(profile.x + profile.width).toBeLessThanOrEqual(1024 - 48);
  expect(
    await page.getByRole('main').evaluate((element) => getComputedStyle(element).paddingBottom),
  ).toBe('24px');
});
