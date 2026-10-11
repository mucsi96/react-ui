# Gallery visual review

Screenshot evidence for the gallery visual fixes and syntax highlighting, reviewed on October 11, 2026.

The review covers all nine gallery pages at desktop (1280 × 720) and mobile (412 × 839) viewport sizes. The 72 after-fix captures include every page with examples collapsed and expanded, open overlays, validation messages, stacked notifications, and table selection/pagination/scrolling. Full-page captures start at the document top; open overlays use the actual viewport. Motion is reduced for stable capture.

These files are review evidence for this change. New runs write to the ignored `screenshots/gallery` directory and attach the captures to the Playwright report; CI also uploads a `gallery-screenshots` artifact.

## Findings and fixes

- Replace tiny, baseline-dependent text chevrons with centered SVG icons in menus, selects, split buttons, and related controls.
- Keep open icon/text button surfaces neutral instead of applying the filled-button pressed color.
- Contain mobile tables and nested menus within their available width. Keep table empty-state text and captions visible while scrolling.
- Keep the selected-row tint visible on hover.
- Keep the active mobile navigation item visible and focused controls clear of the sticky header.
- Keep badges and inline code sized to their content.
- Highlight TSX and CSS examples with Shiki and the GitHub Dark theme, loading the highlighter on expansion.

## Before / after

| Issue                 | Before                                     | After                                                                       |
| --------------------- | ------------------------------------------ | --------------------------------------------------------------------------- |
| Dropdown chevron      | [Desktop before](before/menus-desktop.png) | [Desktop after](desktop/menus.png)                                          |
| Mobile table overflow | [Mobile before](before/table-mobile.png)   | [Mobile after](mobile/table.png)                                            |
| Syntax highlighting   | —                                          | [TSX](desktop/inputs-donut-code.png) · [CSS](desktop/overview-css-code.png) |

## Every gallery page

| Page          | Desktop                                 | Mobile                                 | Expanded examples                                                                           |
| ------------- | --------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------- |
| Overview      | [Screenshot](desktop/overview.png)      | [Screenshot](mobile/overview.png)      | [Desktop](desktop/overview-examples.png) · [Mobile](mobile/overview-examples.png)           |
| Buttons       | [Screenshot](desktop/buttons.png)       | [Screenshot](mobile/buttons.png)       | [Desktop](desktop/buttons-examples.png) · [Mobile](mobile/buttons-examples.png)             |
| Inputs        | [Screenshot](desktop/inputs.png)        | [Screenshot](mobile/inputs.png)        | [Desktop](desktop/inputs-examples.png) · [Mobile](mobile/inputs-examples.png)               |
| Menus         | [Screenshot](desktop/menus.png)         | [Screenshot](mobile/menus.png)         | [Desktop](desktop/menus-examples.png) · [Mobile](mobile/menus-examples.png)                 |
| Dialogs       | [Screenshot](desktop/dialogs.png)       | [Screenshot](mobile/dialogs.png)       | [Desktop](desktop/dialogs-examples.png) · [Mobile](mobile/dialogs-examples.png)             |
| Data table    | [Screenshot](desktop/table.png)         | [Screenshot](mobile/table.png)         | [Desktop](desktop/table-examples.png) · [Mobile](mobile/table-examples.png)                 |
| Notifications | [Screenshot](desktop/notifications.png) | [Screenshot](mobile/notifications.png) | [Desktop](desktop/notifications-examples.png) · [Mobile](mobile/notifications-examples.png) |
| Loaders       | [Screenshot](desktop/loaders.png)       | [Screenshot](mobile/loaders.png)       | [Desktop](desktop/loaders-examples.png) · [Mobile](mobile/loaders-examples.png)             |
| Typography    | [Screenshot](desktop/typography.png)    | [Screenshot](mobile/typography.png)    | [Desktop](desktop/typography-examples.png) · [Mobile](mobile/typography-examples.png)       |

## Interaction and code-detail captures

Each named capture exists in both the [desktop](desktop) and [mobile](mobile) directories:

- `menus-triggers`, `menus-dropdown`, `menus-icon`, `menus-nested`
- `buttons-split-menu`, `buttons-tooltip`
- `inputs-select`, `inputs-autocomplete`, `inputs-validation`, `inputs-donut-code`
- `dialogs-confirmation`, `dialogs-form`, `dialogs-required-field`
- `table-selected`, `table-next-page`, `table-horizontal-scroll`
- `notifications-toasts`
- `overview-css-code`

## Verification

Formatting, linting, type checks, production builds, all 9 unit tests, and all 46 desktop/mobile browser tests passed. Browser coverage includes accessibility audits of every page with examples collapsed and expanded, viewport-width checks, dropdown icon alignment, neutral pressed surfaces, selection tint, native form validation, and keyboard/pointer interactions.
