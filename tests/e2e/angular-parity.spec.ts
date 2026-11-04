import { expect, test } from '@playwright/test';
import { avatarReferenceStyle, compareAngularAvatar } from './avatar-reference';

// The reference is frozen Angular native-button markup, rendered in this same
// browser so host font packages cannot invalidate the visual comparison.
test('profile avatar preserves the Angular appearance and keyboard menu behavior', async ({
  page,
}, testInfo) => {
  await page.goto('#/menus');
  const avatar = page.getByRole('button', { name: 'User menu', exact: true });
  const stage = await page.addStyleTag({ content: avatarReferenceStyle('User menu') });
  expect(await compareAngularAvatar(page, avatar, testInfo)).toEqual({
    actualSize: [40, 40],
    expectedSize: [40, 40],
    differentPixels: 0,
  });
  await stage.evaluate((element) => element.parentNode?.removeChild(element));
  await avatar.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('menu', { name: 'User menu', exact: true })).toBeVisible();
  await expect(page.getByRole('menuitem', { name: 'Settings', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(avatar).toBeFocused();
  await expect(avatar).toHaveCSS('outline-style', 'solid');
  await expect(page.getByRole('button', { name: 'Disabled user menu' })).toBeDisabled();
});

test('Angular typography baseline prevents browser-bold headings and semibold controls', async ({
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
    '-apple-system, BlinkMacSystemFont, "SF Pro Text", Roboto, sans-serif',
  );
  await page.goto('#/menus');
  await expect(page.getByRole('button', { name: 'Actions', exact: true })).toHaveCSS(
    'font-weight',
    '500',
  );
  await expect(page.getByRole('button', { name: 'Actions', exact: true })).toHaveCSS(
    'font-family',
    'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  );
});
