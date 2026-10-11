import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { captureGallery } from './screenshots';

test('dropdown, icon menu, and nested submenu render and accept pointer actions', async ({
  page,
}, testInfo) => {
  await page.goto('#/menus');
  await page.getByRole('heading', { level: 1, name: 'Menus' }).waitFor();
  const trigger = page.getByRole('button', { name: 'Actions', exact: true });
  const icon = trigger.locator('svg');
  await expect(icon).toHaveAttribute('aria-hidden', 'true');
  const triggerBox = (await trigger.boundingBox())!;
  const iconBox = (await icon.boundingBox())!;
  expect(iconBox.width).toBe(16);
  expect(
    Math.abs(iconBox.y + iconBox.height / 2 - triggerBox.y - triggerBox.height / 2),
  ).toBeLessThan(1);
  await captureGallery(page, testInfo, 'menus-triggers');
  await page.getByRole('button', { name: 'Actions', exact: true }).click();
  await expect(page.getByRole('menu', { name: 'Actions', exact: true })).toBeVisible();
  await captureGallery(page, testInfo, 'menus-dropdown', { fullPage: false });
  await page.getByRole('menuitem', { name: 'Duplicate', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Duplicated item');
  await page.getByRole('button', { name: 'Dismiss notification' }).click();
  await page.getByRole('button', { name: 'More', exact: true }).click();
  await expect(page.getByRole('button', { name: 'More', exact: true })).toHaveAttribute(
    'data-pressed',
    'true',
  );
  const quietSurface = await page
    .getByRole('button', { name: 'More', exact: true })
    .evaluate((element) => {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 1;
      const context = canvas.getContext('2d')!;
      context.fillStyle = getComputedStyle(element).backgroundColor;
      context.fillRect(0, 0, 1, 1);
      const channels = [...context.getImageData(0, 0, 1, 1).data].slice(0, 3);
      return Math.max(...channels) - Math.min(...channels);
    });
  expect(quietSurface, 'An open icon trigger must keep its neutral surface').toBeLessThan(25);
  await expect(page.getByRole('menuitem', { name: 'Move (disabled)' })).toHaveAttribute(
    'aria-disabled',
    'true',
  );
  await captureGallery(page, testInfo, 'menus-icon', { fullPage: false });
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Formatting', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Text style', exact: true }).click();
  await expect(page.getByRole('menu', { name: 'Text style', exact: true })).toBeVisible();
  for (const menu of await page.getByRole('menu').all()) {
    const box = (await menu.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(page.viewportSize()!.width);
  }
  await captureGallery(page, testInfo, 'menus-nested', { fullPage: false });
  await page.getByRole('menuitem', { name: 'Bold', exact: true }).click();
  await expect(page.getByRole('menu', { name: 'Formatting', exact: true })).not.toBeVisible();
});

test('split menus and tooltip render beside their triggers', async ({ page }, testInfo) => {
  await page.goto('#/buttons');
  await page.getByRole('button', { name: 'Save options' }).click();
  await expect(page.getByRole('menu', { name: 'Save options' })).toBeVisible();
  await captureGallery(page, testInfo, 'buttons-split-menu', { fullPage: false });
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Search', exact: true }).focus();
  await expect(page.getByRole('tooltip', { name: 'Search', exact: true })).toBeVisible();
  const focusedButton = (await page
    .getByRole('button', { name: 'Search', exact: true })
    .boundingBox())!;
  const header = (await page.getByRole('banner').boundingBox())!;
  expect(
    focusedButton.y,
    'Sticky header must not cover the focused control',
  ).toBeGreaterThanOrEqual(header.y + header.height);
  await captureGallery(page, testInfo, 'buttons-tooltip', { fullPage: false });
});

test('select, autocomplete, and field error surfaces render correctly', async ({
  page,
}, testInfo) => {
  await page.goto('#/inputs');
  await page.getByRole('button', { name: 'Favorite fruit' }).click();
  await expect(page.getByRole('option', { name: 'Apple', exact: true })).toBeVisible();
  await captureGallery(page, testInfo, 'inputs-select', { fullPage: false });
  await page.getByRole('option', { name: 'Mango', exact: true }).click();
  const combo = page.getByRole('combobox', { name: 'Search fruits' });
  await combo.fill('ban');
  await expect(page.getByRole('listbox').locator('..')).toHaveCSS('opacity', '1');
  await captureGallery(page, testInfo, 'inputs-autocomplete', { fullPage: false });
  await page.getByRole('option', { name: 'Banana', exact: true }).click();
  await page.getByRole('textbox', { name: 'Email', exact: true }).fill('invalid');
  await page.getByRole('textbox', { name: 'Username', exact: true }).click();
  await expect(page.getByText('Enter a valid email address.', { exact: true })).toBeVisible();
  await captureGallery(page, testInfo, 'inputs-validation');
});

test('confirmation and native form dialogs show their intended surfaces and validation', async ({
  page,
}, testInfo) => {
  await page.goto('#/dialogs');
  await page.getByRole('button', { name: 'Delete item', exact: true }).click();
  await expect(page.getByRole('alertdialog', { name: 'Delete this item?' })).toBeVisible();
  await captureGallery(page, testInfo, 'dialogs-confirmation', { fullPage: false });
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await page.getByRole('button', { name: 'Create project', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'New project' })).toBeVisible();
  await captureGallery(page, testInfo, 'dialogs-form', { fullPage: false });
  await page.getByRole('button', { name: 'Create', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Project name', exact: true })).toBeFocused();
  await captureGallery(page, testInfo, 'dialogs-required-field', { fullPage: false });
});

test('sorted and selected table rows retain their layout across pagination', async ({
  page,
}, testInfo) => {
  await page.goto('#/table');
  const directory = page.getByRole('table', { name: 'People directory' });
  await directory.getByRole('button', { name: 'Person' }).click();
  const row = directory.getByRole('row', { name: /Chris/ });
  await row.hover();
  const hoverSurface = await row.evaluate((element) => getComputedStyle(element).backgroundColor);
  await directory.getByRole('button', { name: 'Select Chris' }).click();
  await expect(directory.getByRole('button', { name: 'Select Chris' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  expect(
    await row.evaluate((element) => getComputedStyle(element).backgroundColor),
    'Hover must not cover the selection tint',
  ).not.toBe(hoverSurface);
  await captureGallery(page, testInfo, 'table-selected');
  await page
    .getByRole('navigation', { name: 'People directory pagination' })
    .getByRole('button', { name: 'Next page' })
    .click();
  await expect(directory.getByRole('cell', { name: 'Sarah', exact: true })).toBeVisible();
  await captureGallery(page, testInfo, 'table-next-page');
  await directory.getByRole('button', { name: 'Age' }).focus();
  await expect(directory.getByRole('button', { name: 'Age' })).toBeInViewport();
  expect((await directory.locator('caption span').boundingBox())!.x).toBeGreaterThanOrEqual(0);
  await captureGallery(page, testInfo, 'table-horizontal-scroll');
});

test('TSX and CSS examples have real syntax highlighting without changing source text', async ({
  page,
}, testInfo) => {
  await page.goto('#/inputs');
  const example = page.getByRole('region', { name: 'Donut slider', exact: true });
  await example.getByText('View React example', { exact: true }).click();
  const tsx = example.locator('pre[data-language="tsx"]');
  await expect(tsx).toContainText('const [tip, setTip] = useState(15);');
  await expect(tsx).toContainText('onChange={setTip}');
  const tsxColors = await tsx
    .locator('span')
    .evaluateAll((tokens) => [...new Set(tokens.map((token) => getComputedStyle(token).color))]);
  expect(tsxColors.length).toBeGreaterThanOrEqual(4);
  await captureGallery(page, testInfo, 'inputs-donut-code', { target: tsx });
  await page.goto('#/');
  const palette = page.getByRole('region', { name: 'Design tokens', exact: true });
  await palette.getByText('View CSS example', { exact: true }).click();
  const css = palette.locator('pre[data-language="css"]');
  await expect(css).toContainText('--bt-primary: hsl(280, 80%, 60%);');
  const cssColors = await css
    .locator('span')
    .evaluateAll((tokens) => [...new Set(tokens.map((token) => getComputedStyle(token).color))]);
  expect(cssColors.length).toBeGreaterThanOrEqual(3);
  await captureGallery(page, testInfo, 'overview-css-code', { target: css });
});

test('stacked notifications remain legible and dismiss independently', async ({
  page,
}, testInfo) => {
  await page.goto('#/notifications');
  await page.getByRole('button', { name: 'Show error', exact: true }).click();
  await page.getByRole('button', { name: 'Show success', exact: true }).click();
  const notifications = page.getByRole('region', { name: 'Notifications', exact: true });
  await expect(notifications.getByRole('button', { name: 'Dismiss notification' })).toHaveCount(2);
  await captureGallery(page, testInfo, 'notifications-toasts', { fullPage: false });
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations,
  ).toEqual([]);
  await notifications.getByRole('button', { name: 'Dismiss notification' }).first().click();
  await expect(notifications).toContainText('Changes saved');
  await expect(notifications).not.toContainText('Unable to save');
});
