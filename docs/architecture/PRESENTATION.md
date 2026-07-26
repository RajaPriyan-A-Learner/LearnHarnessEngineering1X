# Architecture Presentation Guide

This guide bridges **Business Requirements** with **Technical Architecture** to help you present and defend your design decisions to senior leadership and architecture review boards.

---

## 🎙️ The 60-Second Elevator Pitch
> *"Meridian Private Wealth manages $88B in AUM. Currently, our 1,900 advisors waste hours switching across 6–9 fragmented browser tabs to review client accounts. The **Wealth Management Advisor Console** unifies this workflow into a single-pane-of-glass application. Our architecture couples a **domain-driven monorepo** with a **real-time tick coalescing engine** and a **hypothetical trade sandbox**, delivering instant portfolio drift insights while guaranteeing strict regulatory compliance, WCAG 2.1 AA accessibility, and 60fps rendering speeds."*

---

## 🏛️ The Three Pillars of the Presentation

Connect each business pain point directly to your architectural solution:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        BUSINESS NEED / CHALLENGE                       │
├────────────────────┬─────────────────────────────┬─────────────────────┤
│ 6-9 Tabs Fragment  │ Stale Overnight Portfolio   │ Compliance Audit &  │
│ Advisor Prep Time  │ Prices & Latency Drift      │ Suitability Risks   │
└─────────┬──────────┘              │              └──────────┬──────────┘
          │                         │                         │
┌─────────▼──────────┐              ▼              ┌──────────▼──────────┐
│ TECHNICAL SOLUTION │    ┌───────────────────┐    │ TECHNICAL SOLUTION │
│ Modular Monorepo   │    │  WebSocket Tick   │    │ Staged Sandbox &   │
│ & Lazy Routing     │    │ Coalescing Engine │    │ Pre-Trade Validator│
└────────────────────┘    └───────────────────┘    └────────────────────┘
```

### 1. Pillar 1: Workflow Consolidation (The Monorepo Shell)
*   **Business Need (BO-1, BO-8)**: Consolidate client lookup, profiles, and routing to reduce preparation time from 55 minutes to under 15 minutes.
*   **Architectural Response (D-4, ADR-004)**: Built a modular monorepo using **npm Workspaces**:
    *   `apps/advisor-console` acts as the routing shell.
    *   Feature boundaries (`/onboarding`, `/rebalancing`) are strictly separated and lazy-loaded dynamically to keep initial payloads small (<250kb).
    *   Shared visual assets live in `@wma/shared-ui` and mathematical algorithms live in `@wma/shared-utils`, avoiding code duplication.

### 2. Pillar 2: Intraday Intelligence (The Coalesced Data Stream)
*   **Business Need (BO-2)**: Transition rebalancing recommendations from prior-day batch prices to real-time intraday market values.
*   **Architectural Response (D-5, ADR-001)**: Implemented a decoupled state structure:
    *   **Zustand** controls local transient UI states, while **TanStack Query** manages server state caching.
    *   **WebSocket Tick Coalescing**: Ticks compile in a ring buffer Map. A `requestAnimationFrame` loop flushes and batches updates to Zustand every 500ms, preventing browser rendering freezes.
    *   **Virtualized Grids (NFR-3)**: Grids containing up to 10k rows render windowed viewports, achieving 60fps scrolling.

### 3. Pillar 3: Embedded Compliance & Risk Mitigation (The Sandbox Gate)
*   **Business Need (BO-5)**: Embed suitability checks and Regulation Best Interest (Reg BI) justifications directly into the workflow to eliminate compliance audit gaps.
*   **Architectural Response (FR-23, FR-26)**: Developed a **What-If Staging Sandbox**:
    *   Transactions stage in local Zustand memory slices, recalculating cash impact, fee schedules, asset weight drift, and capital gains tax estimations.
    *   A pre-trade validator screens orders before submission: concentration limits trigger Amber warning banners requiring a >50 character justification; restricted stock lists trigger Red block indicators disabling submission.

---

## 💡 Key Architectural Decisions & Rationale (ADR Highlights)

Be prepared to defend your technology selections:

*   **Q: Why Zustand + TanStack Query instead of Redux Toolkit?**
    *   *Defense*: Redux introduces massive boilerplate code. TanStack Query handles HTTP cache state rules (retry logs, garbage collections, background checks) out-of-the-box. Zustand provides simple hooks with atomic state selectors, avoiding full page component rendering loops on high-frequency WebSocket updates.
*   **Q: Why Vanilla CSS Modules instead of Tailwind or Styled Components?**
    *   *Defense*: CSS-in-JS (like styled-components) resolves styles dynamically on runtime threads, creating paint lag during virtual grid scrolling. Tailwind requires extra build configurations. CSS Modules compile into native, mini CSS files with zero runtime CPU cost, guaranteeing isolated styling boundaries.
*   **Q: How do you verify quality and accessibility?**
    *   *Defense*: We enforce **80%+ code coverage** on all utility packages using Vitest. Our E2E tests run automatically via **Playwright** across multiple web engines (Chrome, Safari, Firefox) with integrated **Axe-Playwright** assertions to guarantee WCAG 2.1 AA accessibility compliance.

---

## 🎯 Presentation Roadmap & Outline
1.  **Slide 1: Business Challenge** ($88B AUM, advisor workflow friction, compliance gaps).
2.  **Slide 2: System Architecture Diagram** (Separation of UI Components, Zustand State, Data Clients).
3.  **Slide 3: High-Frequency Synchronization Flow** (Show how WebSocket ticks coalesce in the buffer to protect rendering threads).
4.  **Slide 4: Staged Rebalancing Sandbox Demo** (Showcase the What-If layout calculations and suitability overrides).
5.  **Slide 5: Operations & Gating** (Docker deployment packages, Playwright regression pipelines, Axe WCAG test gates).
6.  **Q&A Session**.
