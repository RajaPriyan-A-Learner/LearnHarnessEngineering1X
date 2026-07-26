# ADR-003: Testing Framework Strategy

## Status
Approved

## Context
The Wealth Management Advisor Console is a complex, regulatory-gated financial application. Ensuring functionality, performance stability, and accessibility is critical. We need:
1.  **Unit Tests**: Fast testing of state store slices, formatters, and math drift logic.
2.  **Integration Tests**: UI verification of grid interactions and form updates without spin-up latency.
3.  **End-to-End Tests**: Cross-browser validation of complete advisor workflows.
4.  **Accessibility Audits**: Enforcing WCAG 2.1 AA design.

## Decision
We will employ:
*   **Vitest**: Fast, native bundler integration matching Vite's resolution hooks.
*   **Playwright**: Cross-browser E2E engine.
*   **Mock Service Worker (MSW)**: API mock interceptor.
*   **@axe-core/playwright**: Automated accessibility verification.

## Alternatives Considered
1.  **Jest**: Traditional standard, but requires complex Babel/TS configurations when paired with Vite. Replaced by Vitest.
2.  **Cypress**: Excellent E2E tool, but runs within its own browser environment, whereas Playwright runs natively via browser CDPs, facilitating multi-tab state testing (critical for streaming synchronization verifications).
3.  **Manual a11y checking only**: Brittle and prone to human oversight.

## Consequences
*   **Pros**:
    *   Vitest utilizes Vite configuration files directly, reducing duplicate setups.
    *   MSW mocks network endpoints uniformly for Vitest, Storybook, and local development.
    *   Playwright supports quick, parallel execution across Chrome, Firefox, and Webkit.
    *   Accessibility compliance audits run automatically on check-in pipelines.
*   **Cons**:
    *   Slightly higher initial config complexity due to managing multiple testing tools (Vitest + Playwright + MSW).
