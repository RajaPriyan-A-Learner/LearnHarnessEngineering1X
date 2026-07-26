# Testing Strategy and Quality Gates

This document outlines the testing methodologies, tools, coverage targets, and E2E verification flows designed to secure the Wealth Management Advisor Console.

---

## 1. Test Automation Stack

The testing matrix is divided into three functional layers to balance execution speed, robustness, and fidelity:

```
┌─────────────────────────────────────────────────────────┐
│                    End-to-End Tests                     │
│    Playwright + Axe-Core (Cross-Browser Journeys)       │
└────────────────────────────┬────────────────────────────┘
                             │ Verifies Critical Paths
┌────────────────────────────▼────────────────────────────┐
│                    Integration Tests                    │
│      Vitest + Mock Service Worker (MSW) Interceptors    │
└────────────────────────────┬────────────────────────────┘
                             │ Validates State + API Flows
┌────────────────────────────▼────────────────────────────┐
│                       Unit Tests                        │
│               Vitest + React Testing Library            │
└─────────────────────────────────────────────────────────┘
```

### Framework Choices
*   **Vitest**: Fast, Vite-native test runner for Unit and React Component integration tests.
*   **React Testing Library (RTL)**: Handles DOM event simulation and structure queries in an accessible-friendly manner.
*   **Mock Service Worker (MSW)**: API network-level mocking. Intercepts HTTP requests at the fetch level, avoiding brittle client mock injection.
*   **Playwright**: Cross-browser automated browser testing (Chrome, Firefox, Safari/Webkit).
*   **Axe-Playwright**: Automated accessibility audit validation in end-to-end integration tests.

---

## 2. Test Coverage & Quality Gates

The pipeline enforces quality gates that prevent code integration if checks fail:

*   **Global Code Coverage**: Minimum **80% line and branch coverage** on core application and helper packages (`shared-utils`, client services, rebalancing engines).
*   **Linting Checks**: Zero errors allowed during ESLint strict typing evaluations.
*   **Type Safety**: TypeScript compiler check (`tsc --noEmit`) must execute cleanly across all packages.

---

## 3. End-to-End Critical Test Journeys

Playwright tests cover the following user flows:

### A. Authentication & Session Security
*   Valid credentials redirect advisor to client selection dashboard.
*   Idle-timer warning modal displays after 14 minutes, logging out the advisor after 15 minutes of inactivity and cleaning up index databases.

### B. Client Search & Drill-Down
*   Typing a client name (e.g. "Household Smith") debounces correctly.
*   Selecting a household updates the central state, dynamically reloading holdings and allocation indicators.

### C. Rebalancing What-If Sandbox
*   Staging buy/sell positions updates calculations: cash balances, tax consequences (warnings for wash sales), and target model drift parameters.
*   Comparing side-by-side scenarios and verifying compliance rule screens.

### D. Multi-Step Onboarding (KYC) Wizard
*   Submitting incomplete wizard stages triggers validation flags.
*   Auto-saves in-progress data to LocalStorage, reloading it after a simulated browser crash.
*   Uploading an incorrect document type (e.g., `.exe` files) outputs appropriate warnings.

---

## 4. Accessibility Testing (Axe Automation)

Playwright E2E tests are configured to scan every page post-navigation to prevent accessibility regressions:

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Holdings Grid page meets accessibility bar', async ({ page }) => {
  await page.goto('/holdings');
  
  // Wait for the virtualized grid to populate
  await page.waitForSelector('[role="grid"]');

  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag21aa'])
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```
