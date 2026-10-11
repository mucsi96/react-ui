import { join } from 'node:path';
import type { Locator, Page, TestInfo } from '@playwright/test';
import { expect } from '@playwright/test';

interface CaptureOptions {
  target?: Locator;
  fullPage?: boolean;
}

export async function captureGallery(
  page: Page,
  testInfo: TestInfo,
  name: string,
  { target, fullPage = true }: CaptureOptions = {},
) {
  await page.evaluate(() => document.fonts.ready);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  // Full-page captures start at the top so fixed/sticky UI isn't composited mid-document.
  if (fullPage && !target)
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  const path = join(
    process.env.VISUAL_REVIEW_DIR ?? 'screenshots/gallery',
    testInfo.project.name,
    `${name}.png`,
  );
  const options = { path, animations: 'disabled', caret: 'hide', scale: 'css' } as const;
  const screenshot = target
    ? await target.screenshot(options)
    : await page.screenshot({ ...options, fullPage });
  expect(
    screenshot.readUInt32BE(16),
    'Screenshot must fit the configured viewport width',
  ).toBeLessThanOrEqual(page.viewportSize()!.width);
  await testInfo.attach(name, { path, contentType: 'image/png' });
}
