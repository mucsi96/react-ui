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
