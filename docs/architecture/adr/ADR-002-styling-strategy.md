# ADR-002: Styling and Theming Strategy

## Status
Approved

## Context
The application is a data-dense, real-time platform intended for financial advisors. It requires:
1.  Excellent visual appeal (premium appearance, custom dark mode support, glassmorphism designs).
2.  High render performance (minimal stylesheet overhead, fast initial paint times, layout stability).
3.  Design consistency across independent packages (the main shell app and the shared components UI library).
4.  Standard web accessibility conformance (ensuring WCAG 2.1 AA text-to-background contrast ratios).

Tailwind CSS requires configuration setups and is not requested by the user, while CSS-in-JS (like styled-components) introduces significant runtime style resolution costs, which can slow down rendering when hundreds of virtualized grid rows re-paint from WebSocket tick updates.

## Decision
We will employ **Vanilla CSS with CSS Modules** combined with **CSS Custom Properties (Variables)** for design token management.

1.  **CSS Custom Properties**: Defined in a shared core sheet (`packages/shared-ui/src/tokens.css`). Contains standard design tokens for colors, spacing, typography scales, shadows, animations, and dark/light modes.
2.  **CSS Modules**: Applied on a component-by-component basis. Scopes class names locally (e.g. `[name]__[local]___[hash]`) to prevent cascading collisions and bleeding styles across feature modules.

## Consequences
*   **Pros**:
    *   **Zero runtime style calculations**: Browser parses native CSS, resulting in optimal rendering performance under high-frequency updates.
    *   **Isolation**: CSS Modules guarantee component encapsulation; changes in one module cannot affect another.
    *   **No Build bloat**: Modern bundlers (Vite/Rollup) bundle and minify native CSS modules efficiently.
    *   **Easy theming**: Dark/light modes are driven by swapping custom property classes at the document root level (`html.dark-theme`).
*   **Cons**:
    *   No utility class shorthand; requires writing traditional CSS files.
    *   Requires standard CSS syntax and clean class organization.
