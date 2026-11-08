# LoadingArea visual evidence

Production gallery captures for [issue #13](https://github.com/mucsi96/react-ui/issues/13),
with reduced motion enabled. The page fills the space below the wrapping header;
section and dialog indicators center within their local content areas.

| Example           | Desktop (1280 × 720)                           | Mobile (412 × 839)                            |
| ----------------- | ---------------------------------------------- | --------------------------------------------- |
| Page              | [Screenshot](desktop/loading-area-page.png)    | [Screenshot](mobile/loading-area-page.png)    |
| Section (cropped) | [Screenshot](desktop/loading-area-section.png) | [Screenshot](mobile/loading-area-section.png) |
| Dialog            | [Screenshot](desktop/loading-area-dialog.png)  | [Screenshot](mobile/loading-area-dialog.png)  |

Reproduce with `npm run build` followed by
`npx playwright test tests/e2e/loading-area.spec.ts`. Captures are written to
`screenshots/gallery/{desktop,mobile}` and attached to the Playwright report.
Browser tests check centering, completion/reload, accessible names, reduced motion,
dialog focus restoration, and axe accessibility results.
