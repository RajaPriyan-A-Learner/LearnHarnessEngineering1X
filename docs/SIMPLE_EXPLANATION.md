# The Toy Room Analogy: Project Requirements Explained Simply

This document provides a simple, high-level summary of the Wealth Management Advisor Console project, mapping our child-friendly **toy room analogies** directly to **real professional engineering requirements** and **framework implementation rules**.

---

## 🧸 The Core Concept

Imagine you are a helper who looks after giant toy collections (representing **Portfolios / Assets under Management**) for rich families (representing **Clients / Households**). 

Right now, managing these toys is a major challenge:
*   To see the list of toys, you have to look in **Room 1** (Tab 1).
*   To check how much the toys cost today, you have to run to **Room 2** (Tab 2).
*   To check the safety rules, you have to walk to **Room 3** (Tab 3).
*   Advisors end up running between **6 to 9 different rooms** all day long. They get exhausted, and by the time they finish checking the toys, the prices have already changed!

We are building a **Magic Control Room** (the unified single-pane-of-glass Console) that aggregates everything into one screen.

---

## 🕹️ Feature Analogy Map & Technical Implementation Guide

### 📋 1. The Giant Toy List
*   **The Toy Analogy**: Draw only the 30 toys you can see on the screen. As you scroll down, the old ones disappear, and new ones pop up instantly. It feels super smooth and never lags.
*   **The Real Specification**: **Holdings Grid Virtualization (FR-12, FR-13)**. Handles 10,000+ positions rows in real-time at 60fps scrolling speeds.
*   **How to Implement in the Framework**:
    *   **Folder Location**: `apps/advisor-console/src/features/holdings/components/`
    *   **Libraries**: Use `@tanstack/react-table` for column/sorting/grouping configurations and `@tanstack/react-virtual` for row coordinate windowing.
    *   **Rule**: Mount the table container inside a fixed-height parent wrapper and pass its DOM ref as the scrolling element to `useVirtualizer`.

---

### 🏷️ 2. Live Price Tags
*   **The Toy Analogy**: When a price goes up, the tag flashes **Green**! When it goes down, it flashes **Red**! To prevent your eyes from getting dizzy, we collect updates in a basket and refresh the tags twice a second instead of updating them a million times.
*   **The Real Specification**: **WebSocket Streaming & Tick Coalescing (FR-18, FR-19)**. Establishes live market quotes updates, throttled to protect rendering threads.
*   **How to Implement in the Framework**:
    *   **Folder Location**: `packages/mock-server` (for ws generation) & `apps/advisor-console/src/features/market-data/hooks/`
    *   **Code Pattern**: Build a client `useWebSocket` hook maintaining a JS `Map` buffer. Run a `requestAnimationFrame` loop to batch update the Zustand Ticker cache store every 500ms.
    *   **Rule**: Individual cell components subscribe to specific security price keys using Zustand selectors, preventing parent grid component re-render loops.

---

### 🏖️ 3. The "What-If" Sandbox
*   **The Toy Analogy**: A sandbox area where you can drag and drop play-trades: *"What if I sell 5 robot toys and buy 10 space lego sets?"* The sandbox instantly calculates pocket money, fee tags, and asset allocations—all in play money.
*   **The Real Specification**: **Rebalancing & What-If Order Staging (FR-23, FR-25)**. In-memory staging slices calculating cash drift, fees, and capital gains tax impacts.
*   **How to Implement in the Framework**:
    *   **Folder Location**: `apps/advisor-console/src/features/rebalancing/`
    *   **State Management**: Create a Zustand store slice (`useSandboxStore.ts`). Use React selectors to compute derived values in memory:
        *   `cashBalance = previousCash + sells - buys - fees`
        *   `taxImpact = calculated cost basis difference on sells`
    *   **Rule**: Never mutate the server HTTP query cache. Merge staged sandbox values with actual portfolio states purely inside selector functions before rendering layout wheels.

---

### 👮 4. The Safety Rules Cop
*   **The Toy Analogy**: A virtual referee blows his whistle on bad trades. A Red whistle blocks banned toys; an Amber whistle requires writing down why you need the toy before you submit.
*   **The Real Specification**: **Suitability Pre-Trade Gating & Reg BI Justification (FR-26, FR-27)**. Screening transactions against concentration rules, restricted lists, and profile suitability, requiring rationales.
*   **How to Implement in the Framework**:
    *   **Folder Location**: `apps/advisor-console/src/features/compliance/`
    *   **Code Pattern**: A validator hook `useComplianceCheck` analyzes staged order arrays. Restricted symbol match triggers a red-block state, disabling submit controls. Concentration limit warnings (>10% individual security) mount an override text area.
    *   **Rule**: Justification forms require `length >= 50` characters before enabling submission buttons. All override approvals are posted to the timeline audit API.

---

### 📝 5. The Easy Join Game
*   **The Toy Analogy**: A step-by-step game to sign up new families. If the iPad battery dies in the middle of step 3, it remembers all their entries so they can resume exactly where they left off.
*   **The Real Specification**: **Resumable KYC Onboarding Wizard (FR-36, FR-37)**. Step stepper forms validating entries and backing up drafts to local persistent stores.
*   **How to Implement in the Framework**:
    *   **Folder Location**: `apps/advisor-console/src/features/onboarding/`
    *   **Code Pattern**: Multi-step router paths (`/onboarding/step1` -> `/step2`). Use Zod schemas to validate inputs. Attach a form state observer that serializes and writes inputs to LocalStorage or IndexedDB on successful step updates.
    *   **Rule**: On wizard mount, scan for cached draft IDs matching active clients. If found, display a modal: `"Restore previous draft?"` to populate form states.

---

## 🔗 Navigating the Full Specifications
When you are ready to study the technical details:
*   Detailed Functional Specs: **[docs/brd/BRD.md](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/brd/BRD.md)**
*   System Architecture: **[docs/architecture/ARCHITECTURE.md](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/architecture/ARCHITECTURE.md)**
*   Backlog Task Map: **[docs/brd/features.json](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/brd/features.json)**
*   Developer Guides: **[docs/ONBOARDING.md](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/ONBOARDING.md)**
