# Step-by-Step Plan: Epic 3 - Holdings Grid & Real-Time Data

This document provides chronological instructions for implementing Epic 3 (`EP-3`) features: **Virtualized Holdings Grid (FE-3.1)** and **WebSocket Market Data Streaming (FE-3.2)**.

---

## 🛠️ Step-by-Step Implementation Instructions

### Step 1: Install & Set Up Table & Virtualization Libraries
*   **Actions**:
    1.  Add dependencies: `@tanstack/react-table` (table logic) and `@tanstack/react-virtual` (virtual list rendering).
    2.  Write base container components mapping table borders, row heights, and layout rules.

### Step 2: Implement the Virtualized Holdings Grid (`FE-3.1`)
*   **Actions**:
    1.  Develop `HoldingsGrid.tsx` using `useVirtualizer` to calculate layout row height mappings based on viewport constraints.
    2.  Implement multi-column sorting: map click handlers on headers to update sort keys, and Alt-Click triggers secondary sorting guidelines.
    3.  Implement resizing columns: attach header divider event hooks enabling column dragging to alter widths. Save grid configurations in local state caches.
    4.  Implement grouping: configure tables to aggregate positions by Asset Class, calculating category sum headers dynamically.
    5.  Implement a export utility transforming active grid row arrays into CSV format downloads.

### Step 3: Implement WebSocket Ticker Streaming (`FE-3.2`)
*   **Actions**:
    1.  Configure the `mock-server` module utilizing Express and the `ws` package. Make a socket loop broadcasting random asset price fluctuations every 100ms.
    2.  Implement a client socket manager hook `useWebSocket.ts` listening to connection states.
    3.  Update status badges: render Live (Green, active sockets), Delayed (Amber, fallback polling REST service active on connection drops), and Offline (Red, network lost).

### Step 4: Implement Tick Coalescing and Price Flashing
*   **Actions**:
    1.  Build a ring buffer (a JavaScript Map) collecting ticks: `const tickBuffer = new Map<string, SecurityTick>()`.
    2.  Use a `requestAnimationFrame` loop to flush the buffer at 500ms intervals, merging ticks into the Zustand store.
    3.  Configure grid cell components to track specific security ticker values using selectors.
    4.  Animate updates using CSS Modules: apply a localized green background flash class for positive ticks and red background flash class for negative ticks, fading out using a 800ms transition curve.
