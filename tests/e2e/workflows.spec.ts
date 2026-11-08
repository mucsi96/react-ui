import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('numeric bounds, required groups, and native form values', async ({ page }) => {
  await page.goto('#/workflows');
  const limit = page.getByRole('textbox', { name: 'Daily limit', exact: true });
  await limit.fill('150');
  await limit.press('Tab');
  await expect(limit).toHaveValue('100');
  await limit.fill('1');
  await limit.press('ArrowDown');
  await expect(limit).toHaveValue('1');
  await page.getByRole('button', { name: 'Save preferences' }).click();
  await expect(page.getByRole('status', { name: 'Saved preferences' })).toBeEmpty();
  const vocabulary = page.getByRole('checkbox', { name: 'Vocabulary' });
  await vocabulary.focus();
  await vocabulary.press('Space');
  await page.getByRole('button', { name: 'Save preferences' }).click();
  await expect(page.getByRole('status', { name: 'Saved preferences' })).toHaveText('1: vocabulary');
  await expect(page.getByRole('checkbox', { name: 'Speech' })).toBeDisabled();
  await expect(page.getByRole('textbox', { name: 'Disabled limit', exact: true })).toBeDisabled();
  await limit.fill('');
  await page.getByRole('button', { name: 'Save preferences' }).click();
  await expect(limit).toHaveValue('');
  await expect(limit).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByRole('status', { name: 'Saved preferences' })).toHaveText('1: vocabulary');
});

test('multiple selection and tabs support keyboard navigation', async ({ page }) => {
  await page.goto('#/workflows');
  await page.getByRole('button', { name: 'Topics', exact: false }).click();
  await page.getByRole('option', { name: 'Vocabulary', exact: true }).click();
  await page.getByRole('option', { name: 'Grammar', exact: true }).click();
  await expect(page.getByRole('option', { name: 'Vocabulary', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(page.getByRole('option', { name: 'Grammar', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(page.getByRole('option', { name: 'Speech', exact: true })).toHaveAttribute(
    'aria-disabled',
    'true',
  );
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: /Topics/ })).toBeFocused();
  await page.getByRole('tab', { name: 'Items', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Summary', exact: true })).toBeFocused();
  await expect(page.getByRole('tabpanel', { name: 'Summary', exact: true })).toHaveText(
    'Your collection summary appears here.',
  );
  await page.keyboard.press('Home');
  await expect(page.getByRole('region', { name: 'No items yet' })).toBeVisible();
  await page.getByRole('button', { name: 'Add item', exact: true }).click();
  await expect(page.getByRole('status', { name: 'Saved preferences' })).toHaveText(
    'Item requested',
  );
});

test('long dialog keeps actions visible in a short mobile viewport and submits its form', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 400 });
  await page.goto('#/workflows');
  const trigger = page.getByRole('button', { name: 'Edit collection', exact: true });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Edit collection' });
  const save = dialog.getByRole('button', { name: 'Save collection' });
  await expect(save).toBeInViewport();
  await save.click();
  await expect(dialog).toBeVisible();
  await dialog.getByRole('textbox', { name: 'Collection name' }).fill('German');
  await dialog.getByRole('textbox', { name: 'Note 12', exact: true }).fill('Last note');
  await expect(save).toBeInViewport();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await save.click();
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(page.getByRole('status', { name: 'Saved preferences' })).toHaveText(
    'Collection saved',
  );
});
