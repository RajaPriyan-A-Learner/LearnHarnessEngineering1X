# Step-by-Step Plan: Epic 2 - Book of Business & Client Search

This document provides chronological instructions for implementing Epic 2 (`EP-2`) features: **Client Search Bar (FE-2.1)** and **Book of Business Filters (FE-2.2)**.

---

## 🛠️ Step-by-Step Implementation Instructions

### Step 1: Design Search Input & Result List Molecules
*   **Actions**:
    1.  Create `SearchField.tsx` inside `packages/shared-ui/src/components/SearchField/`.
    2.  Write styling module `SearchField.module.css` defining the search card styling, loading spinner icons, and search trigger button structures.
    3.  Create the overlay results drop-down menu component to show query match lines.

### Step 2: Implement Input Debouncing hook (`FE-2.1`)
*   **Actions**:
    1.  Create a custom utility hook `useDebounce.ts` in `packages/shared-utils/src/hooks/useDebounce.ts`.
    2.  Configure input changes to trigger the debounce handler, postponing API fetching queries by 200ms to avoid search performance bottleneck.
    3.  Define query API bindings matching typed client profiles (retrieving matches by name, account number, or masked tax ID).

### Step 3: Implement Keyboard Event Listeners
*   **Actions**:
    1.  Attach a `onKeyDown` keyboard event hook listener to the search input.
    2.  Pressing `ArrowDown` transfers active focus down the list; pressing `ArrowUp` returns focus upwards.
    3.  Pressing `Enter` triggers active selection, updating the Zustand state (`useHouseholdStore.getState().setActiveHousehold(selectedHH)`) and closing the drop-down panel.
    4.  Pressing `Escape` hides the drop-down overlay.

### Step 4: Develop Directory Filter Panels (`FE-2.2`)
*   **Actions**:
    1.  Create a filtering sidebar panel widget in the client lookup dashboard view.
    2.  Build checkbox toggles for categories: Mass Affluent ($100k-$1M), HNW ($1M-$10M), and UHNW ($10M+).
    3.  Build filter markers for review-due indicators and risk index parameters.
    4.  Connect checkboxes to the API fetch wrapper. Selecting multiple filters recalculates query arrays and triggers clean dashboard grid refreshes.
    5.  Include a "Recent Clients" tab displaying the last 5 households selected by reading/writing to LocalStorage.
