# Performance and Optimization Report

This document details the performance engineering strategy, Core Web Vitals targets, and optimization details implemented to support high data density and real-time synchronization in the Wealth Management Advisor Console.

---

## 1. Core Web Vitals Targets

The Console establishes strict performance budgets aligned with enterprise NFRs:

| Metric | Target | How It Is Measured |
| :--- | :--- | :--- |
| **Largest Contentful Paint (LCP)** | `< 2.5s` | Initial shell load and dashboard navigation on simulated 3G/Corporate networks. |
| **Interaction to Next Paint (INP)** | `< 200ms` | Toggling portfolio aggregates, re-sorting 10,000 holdings, and sandbox staging updates. |
| **Cumulative Layout Shift (CLS)** | `< 0.1` | Asset allocation wheels, skeleton elements, and side drawer updates. |
| **FPS (Frame Rate)** | `~ 60fps` | Scrolling through dense holdings grids. |

---

## 2. Optimization Mechanics

### A. Rendering Virtualization (Dense Grids)
Rendering 10,000 table rows with multiple columns containing live prices can cause substantial DOM size bloat and rendering lag.
- **Solution**: Utilizing `@tanstack/react-virtual`, we display a virtualized viewport. The DOM only mounts the rows currently visible (roughly 30-40 rows depending on screen height) using absolute coordinate positioning, keeping memory consumption flat regardless of the size of the book of business.

```typescript
// Conceptual rendering block
const rowVirtualizer = useVirtualizer({
  count: rows.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 35, // fixed height in pixels
});
```

### B. Streaming Market Data Throttling
Streaming ticks via WebSockets can produce hundreds of event ticks per second during active trading hours. Direct component triggers on every tick will freeze the UI thread.
- **Solution**: A custom React Hook processes updates into a ring buffer. The updates are flushed at regular 500ms intervals using an requestAnimationFrame loop:

```typescript
// Throttled buffer flush hook
useEffect(() => {
  let frameId: number;
  const flushBuffer = () => {
    if (buffer.current.size > 0) {
      updateZustandStore(Array.from(buffer.current.values()));
      buffer.current.clear();
    }
    frameId = requestAnimationFrame(flushBuffer);
  };
  frameId = requestAnimationFrame(flushBuffer);
  return () => cancelAnimationFrame(frameId);
}, []);
```

### C. Bundle Budget Gating
To ensure LCP targets remain low over time, the build pipeline enforces a maximum bundle size budget:
*   **Initial Bundle Size**: `< 250kb` (Gzipped).
*   **Shared UI & Utils**: Built as tree-shakeable ESModules (`ESNext`).
*   **Asset Code Splitting**: Heavily dynamic features (e.g. PDF Proposal reports, Monte Carlo charting canvas) are dynamically imported and split into chunks loaded only when triggered by the advisor.

```typescript
// Route level lazy-loading
const ProposalsModule = React.lazy(() => import('@features/proposals'));
```

---

## 3. Telemetry & Observability
An internal developer debug surface measures rendering times, memory heap limits, WebSocket tick frequency, and active DOM node counts. This monitoring can be toggled using `Shift + Ctrl + D` inside the client application.
