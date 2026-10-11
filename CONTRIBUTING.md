# Contributing

## Setup

Use the Node.js version in `.node-version`, then run `npm ci` and `npm run dev`.

The library lives in `packages/ui`; the gallery lives in `apps/gallery`. Components are co-located with their CSS Module and any behavior tests. Keep shared helpers private unless consumers have a clear reason to use them.

## Component conventions

- Write functional components and named exports. Keep state local and derive values during render; use effects for synchronization with external systems.
- Accept controlled values and change callbacks when the consumer needs to own state. Offer `defaultValue` or the React Aria equivalent for uncontrolled usage.
- Prefer composition to configuration-heavy APIs. Use React Aria for complex interaction and focus behavior.
- Style components with CSS Modules. Reuse `--bt-*` tokens and logical CSS properties. Reserve global styles for design tokens; application resets belong to the application.
- Preserve native form semantics, accessible labels, focus feedback, disabled behavior, and reduced-motion preferences.
- Export public prop types from `src/index.ts`. Keep React external to the library bundle.
- Add an interactive gallery example for public behavior, and meaningful regression coverage for complex interactions.

After changing library code, rebuild it with `npm run build:ui`; the gallery deliberately exercises the package exports rather than a source alias at runtime.

## Checks

```bash
npm run format
npm run check
npx playwright install chromium
npm run test:e2e
```

For Playwright, first build the production gallery (`npm run build` or `npm run check`). The report includes traces on failure and visual evidence. Do not replace behavior checks with implementation snapshots.

Use conventional commit messages such as `feat(button): add a new variant` or `fix(dialog): restore trigger focus`. Dependency changes should update both the relevant manifest and the root lockfile.
