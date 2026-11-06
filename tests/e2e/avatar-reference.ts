import { readFile } from 'node:fs/promises';
import type { Locator, Page, TestInfo } from '@playwright/test';

// Normalize only placement and the surface behind the circle. Gallery and app
// layouts differ; a fractional crop would introduce an extra screenshot row.
export function avatarReferenceStyle(label: string) {
  return `
    body::after {
      content: '';
      position: fixed;
      inset: 0;
      background: var(--bt-surface-1);
      z-index: 9998;
      pointer-events: none;
    }
    button[aria-label="${label}"] {
      position: fixed;
      inset: 16px auto auto 16px;
      z-index: 9999;
    }
  `;
}

export async function compareAngularAvatar(page: Page, avatar: Locator, testInfo: TestInfo) {
  const reference = await page.context().newPage();
  try {
    await reference.setContent(
      await readFile(new URL('./fixtures/angular-avatar.html', import.meta.url), 'utf8'),
    );
    // Typography deliberately differs from the frozen Angular fixture.
    await reference.addStyleTag({
      content: avatarReferenceStyle('Felhasználói menü') + '\n.avatar { font-family: system-ui; }',
    });
    const expected = await reference
      .getByRole('button', { name: 'Felhasználói menü' })
      .screenshot({ scale: 'css' });
    const actual = await avatar.screenshot({ scale: 'css' });
    await testInfo.attach('angular-avatar-reference', { body: expected, contentType: 'image/png' });
    await testInfo.attach('react-avatar', { body: actual, contentType: 'image/png' });
    return await page.evaluate(
      async ({ actual, expected }) => {
        const images = await Promise.all(
          [actual, expected].map(async (src) => {
            const image = new Image();
            image.src = src;
            await image.decode();
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            const context = canvas.getContext('2d')!;
            context.drawImage(image, 0, 0);
            return context.getImageData(0, 0, image.width, image.height);
          }),
        );
        const [rendered, original] = images;
        let differentPixels = 0;
        for (let offset = 0; offset < original!.data.length; offset += 4) {
          // HSL→hex production minification changes edge antialiasing by up to
          // two RGB levels. This does not permit glyph/geometry differences.
          if (
            [0, 1, 2, 3].some(
              (channel) =>
                Math.abs(rendered!.data[offset + channel]! - original!.data[offset + channel]!) > 2,
            )
          )
            differentPixels++;
        }
        return {
          actualSize: [rendered!.width, rendered!.height],
          expectedSize: [original!.width, original!.height],
          differentPixels,
        };
      },
      {
        actual: `data:image/png;base64,${actual.toString('base64')}`,
        expected: `data:image/png;base64,${expected.toString('base64')}`,
      },
    );
  } finally {
    await reference.close();
  }
}
