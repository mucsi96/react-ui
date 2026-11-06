# Angular visual parity

Reference: `mucsi96/cooking-app` commit `ee5828c`, immediately before the React
migration, using `@mucsi96/angular-material-theme` 1.12.0. The original application
was served in Chromium and its computed styles and screenshots were inspected.

## Shared-library corrections

See [the full component audit](angular-component-audit.md) for the complete
inventory, additional corrections, observed reference values and exceptions.

- Restore the complete Angular system-font and monospace stacks.
- Expose the original Cooking body stack as `--bt-font-body`; cards, headings,
  and prose use it rather than switching their contents to a control font.
- Provide opt-in `@mucsi96/react-ui/typography.css` with the original native
  heading reset (`font-size`, `font-weight`, and `margin` unset). Keep the default
  component stylesheet free of global application resets.
- Use weight 400 for `Heading` and 500 for buttons, matching the original
  application headings and Material labels instead of 650/600.
- Provide `Button variant="avatar"`: 40px circle, outline-colored background,
  white 18px Arial initials at weight 400, preserving React Aria menu behavior.
  Arial is intentional: it is the computed font of the original native button.

The avatar regression snapshots come from the original Angular profile button
with user name `Igor Bari`, using Playwright's Desktop Chrome and Pixel 7 device
settings. Capture `getByRole('button', { name: 'Felhasználói menü' })` at rest,
after the initials have loaded, with screenshot scale `css`. The snapshots are
an independent Angular reference, not screenshots blessed from the React code.
Placement is normalized to integer coordinates and the backdrop to surface-1
for both versions; component geometry, colors, and fonts are not overridden.
Regenerate against the separately served reference app with
`ANGULAR_BASE_URL=http://127.0.0.1:4261 node scripts/capture-angular-avatar.ts`.

The checked-in PNGs are reference evidence. The automated visual assertion renders
`tests/e2e/fixtures/angular-avatar.html` (the frozen original native-button markup
and styles) in the **same browser context** as React. This avoids host font-package
differences between development and CI without accepting changed glyphs or shape.
It requires identical 40×40 dimensions and zero differing pixels, allowing only
two RGB levels per channel for HSL-to-hex rounding. Both images are attached to
the Playwright report on every run.

## Cooking integration after publication

The Cooking checkout is deliberately unchanged until the library is released.
Update its npm dependency and lockfile to the released version, then:

1. Import `@mucsi96/react-ui/typography.css` after `styles.css` from the library
   and before the application's stylesheet in `client/src/main.tsx`.
2. Remove the forced `Roboto, sans-serif` root font from `client/src/styles.css`.
   Keep the bundled Roboto fonts; the original Angular build bundled weights
   300, 400, and 500. Restore `html, body { height: 100%; }`.
3. Change the profile trigger in `client/src/App.tsx` from `variant="icon"` to
   `variant="avatar"`. Keep the existing accessible label and initials logic.

The following application-specific rules were also lost in the migration.
Port them from the reference commit into the corresponding CSS Modules and
markup. Importing a library cannot override an application's explicit layout:

| Area              | Angular reference to restore                                                                                          |
| ----------------- | --------------------------------------------------------------------------------------------------------------------- |
| Recipe list       | 1200px centered container; 1rem inline padding on mobile, 2rem on desktop; 2rem bottom padding                        |
| Grid              | Two columns above 340px; one below; 0.75rem gap. From 600px, auto-fill minmax(220px, 1fr), 1rem gap                   |
| Category heading  | 1.75rem, normal weight, -0.025em tracking, margin 2rem 0 1rem                                                         |
| Cards             | 16px corners; title padding-block 16px, margin 0, line-height 1.25, default text color, 0.95rem mobile / 1rem desktop |
| Header            | 88% surface-1 background; brand -0.02em tracking; navigation gap 0.25rem; original menu/add icons                     |
| Mobile navigation | 52px toolbar; blurred 92% surface-1 bottom bar; icon over 0.72rem label; original safe-area padding                   |
| Main spacing      | 50px top margin desktop, 28px mobile; original safe-area and bottom navigation padding                                |
| Recipe detail     | 800px centered container with 1rem/2rem inline padding; 16:9 desktop hero, 4:3 mobile; 12px/16px corners              |
| Detail title      | clamp(2rem, 8vw, 3rem), normal weight, line-height 1.05, -0.035em tracking; original title/actions grouping           |
| Description       | Muted text, line-height 1.6                                                                                           |
| Servings          | Outlined surface-1 pill with 0.15rem padding; centered 1.1rem value                                                   |
| Ingredients/steps | Original list markers, 1.8 line-height, 1.5rem indentation (1.25rem mobile), mobile row spacing                       |
| Printing          | Restore original print typography, category hiding, and section pagination rules                                      |

Source files: `client/src/app/app.component.{css,html}`,
`header/header.component.css`, `recipes/recipes.component.css`, and
`recipe-detail/recipe-detail.component.{css,html}` at the reference commit.

Full-page parity requires that consumer integration and desktop/mobile screenshot
comparison. The library regression tests cover shared components and the avatar;
they do not claim that the unmodified Cooking React pages are pixel-identical.
# System-font update

The current font policy supersedes the original font-stack findings below: all
font tokens and avatars use only `system-ui`. The heading reset remains opt-in.
Avatar regression checks preserve Angular geometry but explicitly render the
reference in `system-ui`; the original captured images remain historical evidence.
