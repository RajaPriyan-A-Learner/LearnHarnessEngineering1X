# Step-by-Step Plan: Epic 4 - Portfolio Analytics & Rebalancing Sandbox

This document provides chronological instructions for implementing Epic 4 (`EP-4`) features: **Allocation Charts (FE-4.1)**, **Model Drift Engine (FE-4.2)**, and **What-If Staging Sandbox (FE-4.3)**.

---

## 🛠️ Step-by-Step Implementation Instructions

### Step 1: Implement SVG/Recharts Allocation Wheels (`FE-4.1`)
*   **Actions**:
    1.  Install `@types/recharts` and `recharts` package.
    2.  Develop `AllocationWheel.tsx` rendering responsive SVG wheels displaying assets by Category, Sector, or Geography.
    3.  Configure slice components to render inline tooltips on cursor hover showing allocation weights.
    4.  Implement a drill-down detail drawer panel when clicking slice blocks.

### Step 2: Implement Model Drift Calculations (`FE-4.2`)
*   **Actions**:
    1.  Create target model database schemas (e.g. Moderate growth allocation: Equities 60%, Cash 10%, Fixed Income 30%).
    2.  Write a utility function `calculateDrift.ts` inside `packages/shared-utils/src/math.ts` to compute current allocation weights and calculate variance against model targets.
    3.  Create visual speedometers illustrating drift parameters (warning thresholds trigger highlight indicators if drift exceeds +/- 5% tolerance levels).

### Step 3: Implement Staged Order Store Slices (`FE-4.3`)
*   **Actions**:
    1.  Create a Zustand store slice `useSandboxStore.ts` containing a dictionary mapping staged actions: `stagedOrders: Record<string, StagedOrder>` (order contains fields: security symbol, quantity, transaction action (buy/sell), price).
    2.  Write actions inside the store slice to add, remove, and update staged staging order lines.

### Step 4: Develop Sandbox Order Worksheet
*   **Actions**:
    1.  Create the Sandbox Order Table UI workspace.
    2.  Compute simulated metrics reactively in memory using custom selectors:
        *   **Cash Impact**: recalculate active cash balance: `previous cash + sell proceeds - buy spends - transaction fee totals`.
        *   **Updated Allocation**: merge staged transactions with active holdings and redraw mock allocation wheels.
        *   **Estimated Capital Gains Taxes**: compute cost basis differences for sell orders, outputting alerts if short-term gains (bought < 1 year ago) are triggered.
    3.  Enable advisors to save, name, and compare multiple what-if sandbox worksheets side-by-side.
