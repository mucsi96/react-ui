import { expect, test } from '@playwright/test';

// Reference values measured in the Angular gallery at e77a509; see the audit.
// Guard density/shape regressions alongside the behavioral gallery suite.
test('buttons and split triggers retain Angular density', async ({ page }) => {
  await page.goto('#/buttons');
  const region = page.getByRole('region', { name: 'Semantic button colors' });
  const filled = region.getByRole('button', { name: 'filled primary', exact: true });
  await expect(filled).toHaveCSS('height', '40px');
  await expect(filled).toHaveCSS('padding-left', '24px');
  await expect(filled).toHaveCSS('font-weight', '500');
  await expect(region.getByRole('button', { name: 'fab primary', exact: true })).toHaveCSS(
    'border-radius',
    '16px',
  );
  await expect(region.getByRole('button', { name: 'mini-fab primary', exact: true })).toHaveCSS(
    'width',
    '40px',
  );
  await expect(page.getByRole('button', { name: 'Save options' })).toHaveCSS('min-width', '40px');
});

test('floating fields preserve labels, multiline sizing, errors and keyboard choices', async ({
  page,
}) => {
  await page.goto('#/inputs');
  const username = page.getByRole('textbox', { name: 'Username', exact: true });
  await expect(username).toHaveCSS('font-size', '16px');
  await expect(username).toHaveCSS('height', '56px');
  await expect(page.getByRole('textbox', { name: 'Bio', exact: true })).toHaveCSS(
    'height',
    '104px',
  );
  const outline = page.getByRole('textbox', { name: 'Outlined field', exact: true });
  await outline.fill('A visible value');
  await expect(outline).toHaveAccessibleName('Outlined field');
  const email = page.getByRole('textbox', { name: 'Email', exact: true });
  await email.fill('invalid');
  await email.press('Tab');
  await expect(email).toHaveAttribute('aria-invalid', 'true');
  await expect(email).toHaveAccessibleDescription('Enter a valid email address.');
  const select = page.getByRole('button', { name: 'Favorite fruit' });
  await select.focus();
  await page.keyboard.press('ArrowDown');
  const apple = page.getByRole('option', { name: 'Apple', exact: true });
  await expect(apple).toHaveCSS('min-height', '48px');
  await expect(apple).toHaveCSS('font-size', '16px');
  await page.keyboard.press('Enter');
  await expect(select).toBeFocused();
  await expect(select).toContainText('Apple');
});

test('menus and nested triggers keep the Angular row geometry', async ({ page }) => {
  await page.goto('#/menus');
  await page.getByRole('button', { name: 'Actions', exact: true }).click();
  const item = page.getByRole('menuitem', { name: 'Edit', exact: true });
  await expect(item).toHaveCSS('min-height', '48px');
  await expect(item).toHaveCSS('border-radius', '0px');
  await expect(item).toHaveCSS('font-weight', '500');
  await expect(item).toHaveCSS('font-size', '14px');
});

test('checkbox, radio and switch states remain keyboard accessible', async ({ page }) => {
  await page.goto('#/inputs');
  const checkbox = page.getByRole('checkbox', { name: 'Subscribe to newsletter' });
  await expect(checkbox).toBeChecked();
  await checkbox.focus();
  await page.keyboard.press('Space');
  await expect(checkbox).not.toBeChecked();
  await expect(page.getByRole('checkbox', { name: 'Partially selected' })).toBeChecked({
    indeterminate: true,
  });
  await expect(page.getByRole('checkbox', { name: 'Disabled option' })).toBeDisabled();
  await page.getByRole('radio', { name: 'Medium', exact: true }).focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('radio', { name: 'Large', exact: true })).toBeChecked();
  const toggle = page.getByRole('switch', { name: 'Notifications', exact: true });
  await expect(toggle).toBeChecked();
  await toggle.focus();
  await page.keyboard.press('Space');
  await expect(toggle).not.toBeChecked();
  await expect(page.getByRole('switch', { name: 'Disabled switch' })).toBeDisabled();
});

test('table density matches Angular', async ({ page }) => {
  await page.goto('#/table');
  const table = page.getByRole('table').first();
  await expect(table.getByRole('columnheader').first()).toHaveCSS('height', '48px');
  await expect(table.getByRole('cell').first()).toHaveCSS('height', '56px');
  await expect(table.getByRole('columnheader').first()).toHaveCSS('color', 'rgb(156, 163, 176)');
});

test('dialog title matches the reference without losing dismissal', async ({ page }) => {
  await page.goto('#/dialogs');
  const trigger = page.getByRole('button', { name: 'Create project', exact: true });
  await trigger.click();
  const title = page.getByRole('heading', { name: 'New project', exact: true });
  await expect(title).toHaveCSS('font-size', '24px');
  await expect(title).toHaveCSS('font-weight', '400');
  await expect(page.getByRole('dialog')).toHaveCSS('font-size', '14px');
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
});

test('donut geometry matches Angular and a full revolution has no progress dot', async ({
  page,
}) => {
  await page.goto('#/inputs');
  const dial = page.getByRole('slider', { name: 'Tip', exact: true });
  // Decorations have no accessible roles; inspect the rendered SVG geometry.
  const track = dial.locator('svg > circle').first();
  await expect(track).toHaveAttribute('stroke-width', '31');
  await expect(track).toHaveAttribute('r', '90.5');
  await dial.focus();
  await page.keyboard.press('Home');
  await expect(dial).toHaveAttribute('aria-valuenow', '0');
  await expect(dial.locator('svg > circle')).toHaveCount(2);
  await page.keyboard.press('ArrowRight');
  await expect(dial).toHaveAttribute('aria-valuenow', '1');
  await expect(dial.locator('svg > circle')).toHaveCount(3);
});
