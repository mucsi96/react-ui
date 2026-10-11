# React UI

[![CI](https://github.com/mucsi96/react-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/mucsi96/react-ui/actions/workflows/ci.yml)

A dark-first, accessible React component library with a cohesive semantic palette and small, functional APIs.

**[Explore the gallery](https://mucsi96.github.io/react-ui/)** · [Package documentation](packages/ui/README.md) · [Visual review](docs/visual-review/README.md) · [Contributing](CONTRIBUTING.md)

## The stack

- **React 19** and **strict TypeScript 7** — functional components, typed props, React 19 ref props, controlled and uncontrolled inputs.
- **CSS Modules** — locally scoped component styles; the shared `--bt-*` CSS custom properties are the public customization API.
- **React Aria Components** — accessible form controls, menus, dialogs, tooltips, and press interactions.
- **Vite 8** — an ESM library build, declaration output, and a route-split interactive gallery.
- **Vitest + Testing Library**, **Playwright + axe**, **Oxlint**, and **Prettier** — behavior, browser accessibility, and consistent code quality.
- **npm workspaces** — one lockfile and a clear boundary between the library and its documentation app.

All direct dependencies were installed from npm's latest stable versions. Exact application/tooling versions and the lockfile keep builds reproducible; Dependabot checks for updates weekly. React is a peer dependency of the library.

## Components

| Category          | Components                                                                                                     |
| ----------------- | -------------------------------------------------------------------------------------------------------------- |
| Actions           | `Button`, `LinkButton`, `SplitButton`, `Tooltip`                                                               |
| Inputs            | `TextField`, `Select`, `ComboBox`, `Checkbox`, `RadioGroup`, `Radio`, `Switch`, `DonutSlider`                  |
| Overlays          | `MenuTrigger`, `MenuPopover`, `Menu`, `MenuItem`, `MenuSeparator`, `SubmenuTrigger`, `DialogTrigger`, `Dialog` |
| Data              | `DataTable` with typed columns, sorting, pagination, and controlled selection                                  |
| Feedback          | `Alert`, `NotificationsProvider`, `useNotifications`, `BarLoader`, `Spinner`, `ProgressBar`                    |
| Surfaces and type | `Card`, `Badge`, `Heading`, `Text`, `Code`, `Divider`                                                          |

The design tokens, dark surfaces, semantic button colors, five-bar loader, split actions, and multi-turn rotary input share their visual foundation with [angular-material-theme](https://github.com/mucsi96/angular-material-theme) and [ui-elements](https://github.com/mucsi96/ui-elements).

## Develop

Use Node.js 24 LTS (the checked-in `.node-version` records the verified version).

```bash
npm ci
npm run dev
```

The gallery imports the built package through its real public exports. `dev` builds the library first; after changing library code, run `npm run build:ui` to update it. Gallery code has Vite hot reload.

```text
packages/ui/
  src/components/     # Co-located functional components, CSS Modules, behavior tests
  src/internal/       # Small private helpers
  src/styles/         # Public palette tokens
  src/index.ts        # Public component and type exports
apps/gallery/
  src/components/     # Shared documentation components
  src/pages/          # Lazy-loaded interactive examples
tests/e2e/            # Desktop/mobile browser and accessibility checks
.github/              # CI, gallery deployment, dependency maintenance
```

## Verify

```bash
npm run check                        # Format, lint, types, unit tests, production builds
npx playwright install chromium
npm run test:e2e                     # Tests the production gallery
npm pack --dry-run -w @mucsi96/react-ui
```

The browser suite checks every gallery page with axe, plus semantic button colors, disabled/focus behavior, keyboard and pointer menus, native form dialogs, combobox selection, pointer-driven multi-turn input, reduced motion, and responsive layouts. It also captures every page with examples collapsed and expanded, plus open overlays and selected/validation states, on desktop and mobile. Screenshots are saved under `screenshots/gallery/{desktop,mobile}` and attached to the Playwright report; CI uploads them as `gallery-screenshots`. These are visual-review evidence, not pixel-diff baselines. View them alongside the report:

```bash
npx playwright show-report
```

Gallery code examples use Shiki's TSX and CSS grammars with the GitHub Dark theme. The highlighter loads when an example is expanded, uses the JavaScript regex engine, and renders escaped React text tokens.

CI verifies and builds once, tests those production files, and deploys the same gallery artifact to GitHub Pages after successful checks. The hash-based gallery routes work on static hosting. To reproduce the Pages build locally:

```bash
GITHUB_PAGES=true npm run build
GITHUB_PAGES=true npm run test:e2e
```

## Use the package locally

The library is published as `@mucsi96/react-ui` by CI after successful verification on `main`. Its first automatic release requires the repository's `NPM_TOKEN` secret; see the [publishing setup](docs/publishing.md). After the first release:

```bash
npm install @mucsi96/react-ui
```

To use a local build before the first release:

```bash
npm run build:ui
npm pack -w @mucsi96/react-ui
# In the consuming app:
npm install /path/to/mucsi96-react-ui-0.1.0.tgz
```

```tsx
import { Button } from '@mucsi96/react-ui';
import '@mucsi96/react-ui/styles.css';

export function SaveAction() {
  return (
    <Button tone="success" onPress={() => save()}>
      Save changes
    </Button>
  );
}
```

See the [package guide](packages/ui/README.md) for form, overlay, notification, table, and theming APIs. Releases use automatic `ui-*` version tags, the verified build artifact, and either the repository token or npm trusted publishing. Setup and recovery are documented in the [publishing guide](docs/publishing.md).

## License

MIT © Igor Bari
