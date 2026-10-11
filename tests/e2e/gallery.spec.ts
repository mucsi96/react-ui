import { expect, test } from '@playwright/test';
import type { Locator } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { captureGallery } from './screenshots';

const pages = [
  ['/', 'A clear foundation.'],
  ['/buttons', 'Buttons'],
  ['/inputs', 'Inputs'],
  ['/menus', 'Menus'],
  ['/dialogs', 'Dialogs'],
  ['/table', 'Data table'],
  ['/notifications', 'Notifications'],
  ['/loaders', 'Loaders'],
  ['/typography', 'Typography'],
] as const;

for (const [path, title] of pages) {
  test(`${title} renders without accessibility violations or horizontal overflow`, async ({
    page,
  }, testInfo) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(`#${path}`);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(title);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(results.violations).toEqual([]);
    expect(
      (await page.evaluate(() => document.documentElement.scrollWidth)) <=
        page.viewportSize()!.width,
    ).toBe(true);
    expect(errors).toEqual([]);
    await captureGallery(page, testInfo, path === '/' ? 'overview' : path.slice(1));
    const examples = page.locator('details > summary');
    const count = await examples.count();
    for (const example of await examples.all()) await example.click();
    await expect(page.locator('pre[data-language]')).toHaveCount(count);
    expect(
      (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
        .violations,
    ).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      page.viewportSize()!.width,
    );
    await captureGallery(page, testInfo, `${path === '/' ? 'overview' : path.slice(1)}-examples`);
    expect(errors).toEqual([]);
  });
}

async function colors(button: Locator) {
  return button.evaluate((element) => {
    const computed = getComputedStyle(element);
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const context = canvas.getContext('2d')!;
    function rgb(color: string) {
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = color;
      context.fillRect(0, 0, 1, 1);
      return [...context.getImageData(0, 0, 1, 1).data].slice(0, 3);
    }
    return { background: rgb(computed.backgroundColor), foreground: rgb(computed.color) };
  });
}

test('semantic colors coordinate all solid variants and disabled hover stays quiet', async ({
  page,
}, testInfo) => {
  await page.goto('#/buttons');
  const region = page.getByRole('region', { name: 'Semantic button colors' });
  await expect(region).toBeVisible();
  for (const tone of ['primary', 'success', 'warn', 'error']) {
    const filled = region.getByRole('button', { name: `filled ${tone}`, exact: true });
    const base = await colors(filled);
    expect(base.foreground).toEqual(tone === 'warn' ? [0, 0, 0] : [255, 255, 255]);
    for (const variant of ['raised', 'fab', 'mini-fab']) {
      expect(
        await colors(region.getByRole('button', { name: `${variant} ${tone}`, exact: true })),
      ).toEqual(base);
    }
    await filled.hover();
    await expect.poll(async () => (await colors(filled)).background).not.toEqual(base.background);
    const disabled = region.getByRole('button', { name: `Disabled ${tone}`, exact: true });
    const disabledBase = await colors(disabled);
    await disabled.hover({ force: true });
    expect(await colors(disabled)).toEqual(disabledBase);
    expect(await disabled.evaluate((element) => getComputedStyle(element).boxShadow)).toBe('none');
  }
  const focusButton = region.getByRole('button', { name: 'filled primary', exact: true });
  await page.keyboard.press('Tab');
  await focusButton.focus();
  await expect(focusButton).toBeFocused();
  expect(await focusButton.evaluate((element) => getComputedStyle(element).outlineStyle)).toBe(
    'solid',
  );
  await testInfo.attach('semantic-buttons', {
    body: await region.screenshot(),
    contentType: 'image/png',
  });
});

test('split buttons support keyboard menus and disabled halves', async ({ page }) => {
  await page.goto('#/buttons');
  const trigger = page.getByRole('button', { name: 'Save options' });
  await trigger.focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menu', { name: 'Save options' })).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status')).toContainText('Saved a copy');
  await expect(trigger).toBeFocused();
  await expect(page.getByRole('button', { name: 'Disabled split' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'More actions' })).toBeDisabled();
});

test('select and combobox expose usable choices and connected field errors', async ({ page }) => {
  await page.goto('#/inputs');
  await page.getByRole('button', { name: 'Favorite fruit' }).click();
  await page.getByRole('option', { name: 'Mango' }).click();
  await expect(page.getByRole('button', { name: 'Favorite fruit' })).toContainText('Mango');
  await page.getByRole('combobox', { name: 'Search fruits' }).fill('ban');
  // React Aria waits for the mobile on-screen keyboard before revealing the popup.
  await expect(page.getByRole('listbox').locator('..')).toHaveCSS('opacity', '1');
  await page.getByRole('option', { name: 'Banana' }).click();
  await expect(page.getByRole('combobox', { name: 'Search fruits' })).toHaveValue('Banana');
  const email = page.getByRole('textbox', { name: 'Email', exact: true });
  await email.fill('invalid');
  await email.press('Tab');
  await expect(email).toHaveAttribute('aria-invalid', 'true');
  await expect(email).toHaveAccessibleDescription('Enter a valid email address.');
});

test('dialog traps focus, submits a native form, and restores the trigger', async ({ page }) => {
  await page.goto('#/dialogs');
  const trigger = page.getByRole('button', { name: 'Create project' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'New project' });
  await expect(dialog).toBeVisible();
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations,
  ).toEqual([]);
  await page.getByRole('textbox', { name: 'Project name' }).fill('React workspace');
  await dialog.getByRole('button', { name: 'Create', exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(page.getByRole('status')).toContainText('Created React workspace');
  await trigger.click();
  for (let i = 0; i < 7; i++) {
    await page.keyboard.press('Tab');
    expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
});

test('nested menus support keyboard entry and dismissal', async ({ page }) => {
  await page.goto('#/menus');
  await page.getByRole('button', { name: 'Formatting' }).focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('menu', { name: 'Text style' })).toBeVisible();
  await page.keyboard.press('Escape');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Formatting' })).toBeFocused();
});

test('the donut slider tracks pointer capture across a full turn', async ({ page }) => {
  await page.goto('#/inputs');
  const slider = page.getByRole('slider', { name: 'Tip' });
  await slider.scrollIntoViewIfNeeded();
  const box = (await slider.boundingBox())!;
  const center = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  const radius = box.width * 0.4;
  await page.mouse.move(center.x - radius, center.y);
  await page.mouse.down();
  for (let angle = 275; angle <= 630; angle += 5) {
    const radians = ((angle - 90) * Math.PI) / 180;
    await page.mouse.move(
      center.x + radius * Math.cos(radians),
      center.y + radius * Math.sin(radians),
    );
  }
  await page.mouse.up();
  await expect(slider).toHaveAttribute('aria-valuenow', '35');
  await slider.focus();
  await page.keyboard.press('End');
  await expect(slider).toHaveAttribute('aria-valuenow', '100');
});

test('reduced motion disables animated loaders', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('#/loaders');
  const bars = page.getByRole('progressbar', { name: 'Loading your workspace' });
  await expect(bars).toBeVisible();
  expect(
    await bars
      .locator('span')
      .first()
      .evaluate((element) => getComputedStyle(element).animationName),
  ).toBe('none');
  expect(
    await page
      .getByRole('progressbar', { name: 'Fetching results' })
      .evaluate((element) => getComputedStyle(element).animationName),
  ).toBe('none');
});
