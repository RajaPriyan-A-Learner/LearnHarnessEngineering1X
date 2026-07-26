---
name: "Market Data and Rebalancing Sandbox Acceptance Criteria"
description: "Acceptance criteria and coding guidelines for Real-Time Streaming Tickers, Drift Calculations, and Sandbox What-If Trade Staging."
---

# Market Data & Rebalancing Acceptance Criteria

Use these criteria to implement and test the real-time ticker stream, rebalancing calculations, and what-if trade staging sandbox (FR-18 to FR-25).

---

## 1. Functional Requirements & Acceptance Criteria

### FR-18 to FR-20: Real-Time Market Data Streaming
*   **Acceptance Criteria**:
    *   [ ] Establish WebSocket connections; display status pill indicators: `Live` (Green, active sockets), `Delayed` (Amber, socket dropped, polling fallback active), and `Offline` (Red, network lost).
    *   [ ] Accumulate streaming quotes in an requestAnimationFrame buffer, merging multiple price changes into state updates every 500ms.
    *   [ ] Changing values trigger localized grid cell flashing (background flashes green for positive ticks, red for negative ticks) fading out in 800ms.
    *   [ ] Disconnecting the WebSocket updates status indicators and switches the dashboard data source to cached last-known portfolio calculations.

### FR-21 to FR-25: Rebalancing & What-If Sandbox
*   **Acceptance Criteria**:
    *   [ ] Selecting a Model Target Allocation calculates class weights and plots drift differentials.
    *   [ ] "Generate Trades" button creates a list of proposed buy/sell staging actions to adjust the drift back within configurable tolerances (e.g. +/- 5%).
    *   [ ] Staged trades display in a "Sandbox" workspace:
        *   Advisors can manually adjust order values or symbols.
        *   Staging updates the simulated cash balances, projected asset allocations, fee sums, and estimated tax impacts (e.g. short-term vs long-term gain warnings) instantly.
    *   [ ] Changes in the sandbox do not affect the main client portfolio database until explicitly approved and routed for execution.
    *   [ ] Supports naming, saving, and comparing multiple what-if sandbox scenarios side-by-side.

---

## 2. E2E Test Scenarios (Playwright Checklist)
*   [ ] Verify the price flashing animation occurs on receiving streaming updates.
*   [ ] Trigger a WebSocket network disconnection; check that status pill updates and values degrade to cached placeholders without crashing.
*   [ ] Apply a rebalancing template; check that the calculated buy/sell actions align with drift gaps.
*   [ ] Add a staged buy order in the Sandbox; verify cash matches the formula: `Previous Cash - Order Value - Fees`.
*   [ ] Check that short-term capital gains warnings trigger correctly when simulating a sell order for holdings bought less than 1 year ago.
