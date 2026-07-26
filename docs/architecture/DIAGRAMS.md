# Architectural Diagrams

This document contains visual diagrams mapping out the component hierarchy, feature modularity, and real-time state data flows of the Wealth Management Advisor Console.

---

## 1. Component Diagram (Atomic Design System)
*Reference Deliverable: D-3 Component Diagram*

The component design follows the Atomic Design principles, defining clear relationships between styling tokens, atomic controls, composite molecules, and fully integrated page structures:

```mermaid
graph TD
    %% Styling Tokens
    subgraph Tokens ["Design System Tokens"]
        CSSVars["CSS Custom Properties (--color, --spacing, --font)"]
    end

    %% Atoms
    subgraph Atoms ["1. Atoms (Base UI)"]
        Button["Button Component"]
        Input["Input / Masked Field"]
        Badge["Status Badge (a11y-aware)"]
        Skeleton["Skeleton Loader"]
    end
    CSSVars --> Button
    CSSVars --> Input
    CSSVars --> Badge
    CSSVars --> Skeleton

    %% Molecules
    subgraph Molecules ["2. Molecules (Composite UI)"]
        SearchField["Search Input (Debounced)"]
        MetricCard["Metric Summary Card"]
        UploadZone["Document Drag & Drop Uploader"]
    end
    Button --> SearchField
    Input --> SearchField
    Badge --> MetricCard
    Skeleton --> MetricCard
    Button --> UploadZone

    %% Organisms
    subgraph Organisms ["3. Organisms (Feature Components)"]
        HoldingsTable["Virtualized Holdings Grid"]
        AllocWheel["Allocation Charts (SVG Wheel)"]
        KYCWizard["Multi-step KYC Wizard"]
    end
    SearchField --> HoldingsTable
    MetricCard --> AllocWheel
    UploadZone --> KYCWizard

    %% Templates & Pages
    subgraph Layouts ["4. Templates & Page Shells"]
        Shell["Authenticated Advisor Layout"]
        PublicShell["Public Login / MFA Layout"]
    end
    HoldingsTable --> Shell
    AllocWheel --> Shell
    KYCWizard --> Shell
```

---

## 2. Monorepo Module Dependencies Graph
*Reference Deliverable: D-4 Module Diagram*

This diagram maps workspace package boundaries. Notice that dependencies point inward toward shared packages, and features remain completely decoupled to avoid circular conflicts:

```mermaid
graph TD
    %% Workspace Packages
    subgraph Apps ["Applications Layer"]
        Console["apps/advisor-console (Vite / React SPA)"]
    end

    subgraph Packages ["Shared Packages Layer"]
        UI["packages/shared-ui (Atomic UI Components & CSS modules)"]
        Utils["packages/shared-utils (Formatters, Types, API Client, Math)"]
    end

    subgraph Service ["External Mock Services"]
        MockServer["packages/mock-server (Express HTTP / WebSockets Tickers)"]
    end

    %% Dependency Connections
    Console -->|Imports Components| UI
    Console -->|Imports Math / REST Hooks| Utils
    UI -->|Uses TS Types| Utils
    Console -.->|Requests HTTP & WebSockets| MockServer

    %% Styling rules styling
    style Console fill:#4f46e5,stroke:#312e81,color:#fff
    style UI fill:#0ea5e9,stroke:#0369a1,color:#fff
    style Utils fill:#10b981,stroke:#047857,color:#fff
    style MockServer fill:#f59e0b,stroke:#b45309,color:#fff
```

---

## 3. State Management & Real-Time Sync Flows
*Reference Deliverable: D-5 State Management Diagram*

This diagram details client-side state mapping, illustrating how WebSockets stream ticks through coalescing buffers, while Rest APIs communicate via query caches:

```mermaid
graph TD
    %% Inputs
    WS[WebSocket Live Tickers Feed]
    REST[REST Gateway Endpoints]

    %% Store caching
    subgraph QueryCache ["TanStack Query Server State Cache"]
        ClientList["Client Book Cache"]
        HoldingsCache["Portfolio Holdings Cache"]
    end

    subgraph ZustandStore ["Zustand Transient App State"]
        ActiveHH["Active Household Selection Store"]
        StagingArea["Staged 'What-If' Sandbox Store"]
        TickerCache["Active Quotes Price Store"]
    end

    %% Coalescing engine
    subgraph Buffer ["Tick Coalescer"]
        RingBuffer["rAF 500ms Tick Accumulator Map"]
    end

    %% Flows
    WS -->|High Frequency Ticks| RingBuffer
    RingBuffer -->|Throttled Batched Update| TickerCache
    REST -->|Fetches Data| QueryCache

    %% Derived calculations
    HoldingsCache -->|Merge with| StagingArea
    StagingArea -->|Compute| Drift["Derived Drift Analytics Selector"]
    TickerCache -->|Compute| LiveMV["Derived Live Market Values Selector"]

    %% UI Consumption
    Drift -->|Triggers Paint| GridView["Virtualized Grid UI Rendering"]
    LiveMV -->|Triggers Paint| GridView
    ClientList -->|Triggers Navigation| SearchUI["Client Search UI Card"]
```
