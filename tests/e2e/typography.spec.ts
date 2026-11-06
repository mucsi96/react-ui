import { expect, test } from '@playwright/test';

test('profile avatar uses system typography and supports keyboard menus', async ({ page }) => {
  await page.goto('#/menus');
  const avatar = page.getByRole('button', { name: 'User menu', exact: true });
  await expect(avatar).toHaveCSS('width', '40px');
  await expect(avatar).toHaveCSS('height', '40px');
  await expect(avatar).toHaveCSS('border-radius', '50%');
  await expect(avatar).toHaveCSS('font-family', 'system-ui');
  await expect(avatar).toHaveCSS('font-size', '18px');
  await expect(avatar).toHaveCSS('font-weight', '400');
  await avatar.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('menu', { name: 'User menu', exact: true })).toBeVisible();
  await expect(page.getByRole('menuitem', { name: 'Settings', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(avatar).toBeFocused();
  await expect(avatar).toHaveCSS('outline-style', 'solid');
  await expect(page.getByRole('button', { name: 'Disabled user menu' })).toBeDisabled();
});

test('typography reset normalizes headings and controls use the shared system font', async ({
  page,
}) => {
  await page.goto('#/typography');
  for (const name of ['Unstyled section heading', 'Unstyled card heading']) {
    const heading = page.getByRole('heading', { name, exact: true });
    await expect(heading).toHaveCSS('font-weight', '400');
    await expect(heading).toHaveCSS('font-size', '16px');
    await expect(heading).toHaveCSS('margin', '0px');
  }
  await expect(page.getByRole('heading', { name: 'Section heading', exact: true })).toHaveCSS(
    'font-weight',
    '400',
  );
  await expect(page.getByRole('heading', { name: 'Workspace', exact: true })).toHaveCSS(
    'font-family',
    'system-ui',
  );
  await page.goto('#/menus');
  await expect(page.getByRole('button', { name: 'Actions', exact: true })).toHaveCSS(
    'font-weight',
    '500',
  );
  await expect(page.getByRole('button', { name: 'Actions', exact: true })).toHaveCSS(
    'font-family',
    'system-ui',
  );
});
