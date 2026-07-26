---
name: "Wealth Management Console Architectural Flows"
description: "Core procedural guidelines and design patterns for building WebSocket tickers, sandbox rebalancing state updates, audit timelines, and multi-step KYC wizards in the Wealth Console."
---

# Wealth Management Console Architectural Flows

This skill file provides procedural instructions and patterns for implementing the critical data flows and state mutations of the Wealth Management Advisor Console. Use these flows when building or debugging feature modules.

---

## 1. WebSocket Ticker Coalescing Flow

To manage high-frequency market-data ticks without degrading grid scroll performance, implement a throttled ring buffer:

```
[WebSocket Feed] 
       │ (Push Tick Events)
       ▼
 ┌───────────┐
 │Ring Buffer│ (Keep latest tick per security symbol)
 └─────┬─────┘
       │ (rAF Loop pulls every 16ms / 60fps)
       ▼
 ┌───────────┐
 │Coalescer  │ (Batch update array)
 └─────┬─────┘
       │ (Single dispatch)
       ▼
┌─────────────┐
│Zustand Store│ (Optimized selectors trigger only changed cells)
└─────────────┘
```

### Reference Implementation Pattern
When coding the market-data stream connector:
1.  Initialize a WebSocket connection inside a dedicated client manager.
2.  Maintain a mutable Map as the buffer: `const tickBuffer = new Map<string, SecurityTick>();`
3.  On receiving a socket event, add it to the buffer: `tickBuffer.set(tick.symbol, tick);`
4.  Establish a `requestAnimationFrame` loop on component mount. In the callback:
    - If `tickBuffer.size === 0`, schedule the next frame.
    - If buffer contains ticks, extract the values, clear the buffer, and dispatch a single event: `updateSecurities(Array.from(tickBuffer.values()));`
5.  Ensure grid cells subscribe strictly using selectors referencing specific security symbols (e.g., `useSecurityPrice(symbol)`) to avoid triggering re-renders of the whole grid parent.

---

## 2. What-If Rebalancing Sandbox Flow

The rebalancing sandbox calculates hypothetical allocation drift, tax estimates, and suitability violations without writing to server state:

```
                  ┌───────────────────────────┐
                  │   Actual Holdings State   │
                  └─────────────┬─────────────┘
                                │
                                ▼
┌────────────────┐     ┌─────────────────┐     ┌───────────────────┐
│ Staging Orders ├────>│ Sandbox Merging ├────>│ Derived Analytics │
│ (Zustand Local)│     │  (Calculations) │     │ (Drift & Taxes)   │
└────────────────┘     └─────────────────┘     └─────────┬─────────┘
                                                         │
                                                         ▼
                                               ┌───────────────────┐
                                               │   Suitability &   │
                                               │ Compliance Alerts │
                                               └───────────────────┘
```

### Reference Action Flow
1.  **Staging State Store**: Maintain staged orders in a Zustand store slice as a map: `stagedOrders: Record<string, StagedOrder>` (where key is accountId-symbol).
2.  **Portfolio Aggregator**: Compute sandbox holdings by compiling a selector:
    - Deep-clone actual holdings state.
    - Loop through `stagedOrders` and apply additions/subtractions to the holding quantity and cost basis.
    - Recalculate cash positions (subtract buy value + fees, add sell value - fees).
3.  **Derived Drift Evaluator**:
    - Aggregate sandbox positions by asset class.
    - Calculate class allocations: `weight = assetClassValue / totalPortfolioValue`.
    - Subtract target allocation weight to output target drift variance.
4.  **Pre-Trade Compliance check**:
    - Pipe the sandbox holdings into a validator function checking against concentration guidelines (e.g. no single equity weight > 10%).
    - Flag compliance warnings or block requests if restrictions (e.g. wash sales, restricted symbol list) are violated.

---

## 3. KYC Onboarding Wizard State Flow

Manage step validation, draft persistence, and resumable state patterns for onboarding wizards:

1.  **Schema Validation**: Validate each step using step-specific schemas (e.g. Zod schemas) before permitting transition to the next step.
2.  **Draft Persistence**: On every successful step transition, write the unified form state to LocalStorage or IndexedDB under `draft_onboarding_[advisorId]`.
3.  **State Restore**: On wizard mount:
    - Verify if a local draft exists.
    - Compare timestamps; if the draft is less than 48 hours old, present a warning prompt: `"Would you like to resume your onboarding draft for [Client Name]?"`.
    - If accepted, populate the form state and route the user to the last validated step coordinate.
4.  **Form Reset**: Clear drafts from persistent stores only upon final mock risk screener approval and submission.

---

## 4. Audit Log Timeline Capture Flow

Ensure that all material actions write to an audit timeline structure:

*   **Trigger Events**: Masked field reveal (e.g. full tax ID reveal), sandbox scenario export, compliance bypass authorization, or onboarding draft saving.
*   **Context Payload**: Capture `timestamp`, `userId`, `householdId`, `actionType` (e.g. `REVEAL_TAX_ID`), and `metadata` (e.g. target client name, reason).
*   **Append Operation**: Push the log entry to the household's activity feed service.
