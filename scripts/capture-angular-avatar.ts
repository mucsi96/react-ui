import { chromium, devices } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { avatarReferenceStyle } from '../tests/e2e/avatar-reference.ts';

// Serve Cooking ee5828c separately; never point this at the React gallery.
const url = process.env.ANGULAR_BASE_URL ?? 'http://127.0.0.1:4261';
const output = 'tests/e2e/angular-parity.spec.ts-snapshots';
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
try {
  for (const [project, device] of [
    ['desktop', 'Desktop Chrome'],
    ['mobile', 'Pixel 7'],
  ]) {
    const context = await browser.newContext({ ...devices[device!] });
    const page = await context.newPage();
    await page.route('**/oauth2/userinfo', (route) =>
      route.fulfill({
        json: { email: 'igor@example.com', additionalClaims: { name: 'Igor Bari' } },
      }),
    );
    await page.route('**/api/recipes', (route) => route.fulfill({ json: [] }));
    await page.goto(url);
    if ((await page.locator('app-root[ng-version]').count()) !== 1) {
      throw new Error('Expected the Angular reference application');
    }
    const avatar = page.getByRole('button', { name: 'Felhasználói menü' });
    await avatar.getByText('IB', { exact: true }).waitFor();
    await page.addStyleTag({ content: avatarReferenceStyle('Felhasználói menü') });
    await avatar.screenshot({
      path: `${output}/angular-avatar-${project}-${process.platform}.png`,
      scale: 'css',
    });
    await context.close();
  }
} finally {
  await browser.close();
}
