# ADR-001: State Management Strategy

## Status
Approved

## Context
The Wealth Management Advisor Console must manage multiple forms of state:
1.  **Server State**: Real-time quotes, historical portfolio snapshots, account balances, and client contact profiles.
2.  **Transient UI State**: Toggle filters, virtual list coordinates, active dropdown values, and dialog displays.
3.  **Complex Staging State**: "What-if" order grids that allow advisors to generate trades, view simulated allocation wheels, calculate short-term vs long-term tax effects, and evaluate compliance lists prior to execution.
4.  **Derived State**: Drift calculations from targeted asset allocation thresholds.

Traditional Redux introduces heavy boilerplate, while React Context API causes unnecessary virtual DOM reconciliations (re-renders) on deep tree elements under fast WebSocket update rates.

## Decision
We will decouple State management into two lightweight, specialized managers:
1.  **TanStack Query (React Query)**: Responsible for server state caching, HTTP fetch queries, response pagination, caching limits, and invalidation rules.
2.  **Zustand**: Responsible for global transient states (e.g., active household) and sandbox staging state.

## Consequences
*   **Pros**:
    *   No boilerplate setup (no action-creators, reducers, or complex dispatch mappings).
    *   Fine-grained component subscriptions to state, preventing render cycles for unrelated changes.
    *   TanStack Query handles caching logic (stale-while-revalidate, retry configurations) out of the box.
    *   Very lightweight bundle footprint.
*   **Cons**:
    *   Developers must maintain clear boundaries: what belongs in Zustand vs what resides in the HTTP Query cache.
    *   Lack of a single global Redux devtool file (though React Query Devtools and Zustand middleware logging easily cover debugging).
