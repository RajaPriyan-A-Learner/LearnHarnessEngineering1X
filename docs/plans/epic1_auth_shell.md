# Step-by-Step Plan: Epic 1 - Auth, Security & Portal Shell

This document provides chronological instructions for implementing Epic 1 (`EP-1`) features: **Authentication & MFA Gate (FE-1.1)**, **Session Management & Silent Refresh (FE-1.2)**, and **Advisor Shell & Layouts (FE-1.3)**.

---

## 🛠️ Step-by-Step Implementation Instructions

### Step 1: Initialize Monorepo and Workspace Packages
*   **Actions**:
    1.  Create `package.json` at root declaring workspaces: `"workspaces": ["apps/*", "packages/*"]`.
    2.  Write root `tsconfig.json` declaring compiler rules (strict typings, bundler resolution).
    3.  Create directories: `apps/advisor-console`, `packages/shared-ui`, `packages/shared-utils`, `packages/mock-server`.
    4.  Configure root linting and formatting rules (`.prettierrc`, `eslint.config.js`).

### Step 2: Establish `@wma/shared-ui` and `@wma/shared-utils` Basics
*   **Actions**:
    1.  Write `packages/shared-ui/package.json` declaring peer dependencies for React.
    2.  Create `packages/shared-ui/src/tokens.css` declaring the global CSS variables (colors, fonts, sizes).
    3.  Write `packages/shared-utils/package.json` and scaffold core formatters (`formatCurrency`, `formatPercent`, `formatDate`).

### Step 3: Implement Authentication and MFA views (`FE-1.1`)
*   **Actions**:
    1.  Scaffold the login page inside `apps/advisor-console/src/features/auth/pages/LoginPage.tsx`.
    2.  Build the input form fields with validation (must be valid email address format, passwords > 8 digits).
    3.  On submission, alter state to render the MFA layout card.
    4.  Create the 6-digit MFA numeric input block. Implement mock code verification rule: check if string starts with `12` (mock success), outputting alert headers on other values.
    5.  Establish secure token memory stores: on success, save the access token to a local memory variable closures object; do not write to localStorage.

### Step 4: Setup Inactivity Session Timeout and Token Refresh (`FE-1.2`)
*   **Actions**:
    1.  Create the silent refresh custom hook `useAuthRefresh` inside `apps/advisor-console/src/features/auth/hooks/useAuthRefresh.ts`.
    2.  Use a `setTimeout` timer set to trigger 1 minute before access token expiry (14 minutes). On trigger, make background refresh post calls.
    3.  Create an inactivity tracker hook `useSessionTimeout.ts` listening to root elements for `mousemove`, `keydown`, and `click` triggers.
    4.  If no user inputs are captured for 14 minutes, mount the Warning Countdown Modal displaying a 60-second visual countdown.
    5.  If the count reaches 0, invoke the clean logout callback: wipe tokens, clear local states, and redirect navigation to `/login`.

### Step 5: Construct Advisor Shell and Layouts (`FE-1.3`)
*   **Actions**:
    1.  Create routing coordinates using `react-router-dom` in `apps/advisor-console/src/App.tsx`.
    2.  Build the main `AuthenticatedLayout.tsx` with a responsive navigation sidebar (collapses to bottom drawer on mobile widths).
    3.  Build the `PublicLayout.tsx` to handle authentication routes.
    4.  Develop the top **Household Context Header Bar**. Subscribe the header to the Zustand `useHouseholdStore` so it instantly updates when an advisor switches active households.
