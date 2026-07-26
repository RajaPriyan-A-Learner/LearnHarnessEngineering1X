# Onboarding & Framework Reading Guide

Welcome to the **Wealth Management Advisor Console** project workspace. If you are reviewing, analyzing, or starting development on this project, follow this hierarchical guide to systematically understand the framework.

---

## 🗺️ Hierarchical Roadmap to Understand the Framework

To gain a comprehensive understanding of the console, proceed through the documentation layers in this specific top-down sequence:

```
                  ┌──────────────────────────────┐
                  │    1. Business Intent (WHY)  │
                  │ (BRD.md, GAP_ANALYSIS.md, ...)│
                  └──────────────┬───────────────┘
                                 │
                                 ▼
                  ┌──────────────────────────────┐
                  │   2. Project Backlog (WHAT)  │
                  │        (features.json)       │
                  └──────────────┬───────────────┘
                                 │
                                 ▼
                  ┌──────────────────────────────┐
                  │   3. Architectural (HOW)     │
                  │   (ARCHITECTURE.md, ADRs,...)│
                  └──────────────┬───────────────┘
                                 │
                                 ▼
                  ┌──────────────────────────────┐
                  │ 4. Execution Plans (STEPS)   │
                  │   (master_plan.md, epics)    │
                  └──────────────┬───────────────┘
                                 │
                                 ▼
                  ┌──────────────────────────────┐
                  │ 5. Agent Constraints (WHO)   │
                  │   (AGENTS.md, Custom Skills) │
                  └──────────────────────────────┘
```

---

## 🔍 Detailed Reading Steps

### Step 1: Understand the Business Intent (WHY)
Understand the target domain, operational issues, user roles (FAs, RMs, Compliance Officers), and non-functional requirements (NFRs).
*   **Start with**: **[docs/brd/BRD.md](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/brd/BRD.md)**. Read the Business Background, Current Challenges, functional specifications (FR-1 to FR-42), and constraints.
*   **Follow up with**: **[docs/brd/GAP_ANALYSIS.md](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/brd/GAP_ANALYSIS.md)**. Review the analysis of how non-functional gaps (like i18n, auto-masking, offline states) were evaluated.

### Step 2: Review the Backlog Structure (WHAT)
Review how the business goals are mapped to actionable tickets.
*   **Inspect**: **[docs/brd/features.json](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/brd/features.json)**. Analyze how requirements are structured into Epics, Features, and Stories, noting the strict dependency indices mapping.

### Step 3: Analyze the System Architecture (HOW)
Examine the package boundaries, render pipelines, and core state synchronization architectures.
*   **Core Reading**: **[docs/architecture/ARCHITECTURE.md](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/architecture/ARCHITECTURE.md)**. Study the horizontal separation (Presentation, Zustand/Query State, Data client layers) and the WebSocket tick-coalescing hook.
*   **Visualizing Structure**: **[docs/architecture/DIAGRAMS.md](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/architecture/DIAGRAMS.md)**. Study the Mermaid graphs for Component Hierarchies, Package Modules, and Real-Time state data streams.
*   **Defense & Presentation**: **[docs/architecture/PRESENTATION.md](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/architecture/PRESENTATION.md)**. Review speaking outline and architectural defenses to present to senior leadership.
*   **Design Decision Rationale (ADRs)**: Review the Architectural Decision Records located in **[docs/architecture/adr/](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/architecture/adr/)**:
    *   [ADR-001 (State)](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/architecture/adr/ADR-001-state-management.md) — Zustand and TanStack Query selection logic.
    *   [ADR-002 (Styling)](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/architecture/adr/ADR-002-styling-strategy.md) — CSS Modules and Native Custom Properties selection logic.
    *   [ADR-003 (Testing)](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/architecture/adr/ADR-003-testing-strategy.md) — Vitest, Playwright, and MSW selection logic.
    *   [ADR-004 (Monorepo)](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/architecture/adr/ADR-004-monorepo-tooling.md) — npm Workspaces selection logic.

### Step 4: Examine the Backlog Execution Plans (STEPS)
Review the detailed, step-by-step coding directives.
*   **Overarching View**: **[docs/plans/master_plan.md](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/plans/master_plan.md)**. View the chronological development order.
*   **Detailed Action Guides**: Review the epic-specific plans in **[docs/plans/](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/plans/)**:
    *   [Epic 1: Auth & Layout Shell](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/plans/epic1_auth_shell.md)
    *   [Epic 2: Book & Search](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/plans/epic2_book_search.md)
    *   [Epic 3: Grid & WebSocket Ticker](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/plans/epic3_grid_ticker.md)
    *   [Epic 4: Analytics & Sandbox](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/plans/epic4_analytics_rebalance.md)
    *   [Epic 5: Compliance & PDFs](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/plans/epic5_compliance_reports.md)
    *   [Epic 6: Goals & KYC Wizard](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/plans/epic6_goals_onboarding.md)
    *   [Epic 7: Cross-Cutting NFRs](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/plans/epic7_cross_cutting_nfrs.md)

### Step 5: Understand Agent Automations & Rules (WHO)
If using an AI coding assistant (like Gemini Antigravity), understand the agent constraints and checklists.
*   **Inspect**: **[.agents/AGENTS.md](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/.agents/AGENTS.md)**. Read the coding boundaries and validation limits.
*   **Analyze Custom Skills**: Look through **[.agents/skills/](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/.agents/skills/)** to inspect the checklists loaded by the assistant during coding tasks.
*   **Quality Gating**: Study **[.agents/skills/evaluator/SKILL.md](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/.agents/skills/evaluator/SKILL.md)** to understand how the codebase is evaluated before final builds.

---

## 🛠️ Verification & Operations Reference
Once the directory structure makes sense, refer to:
*   **[docs/operations/INSTALL.md](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/operations/INSTALL.md)**: Workspace setup and local dev configurations.
*   **[docs/operations/DEPLOYMENT.md](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/operations/DEPLOYMENT.md)**: Server compilation and container settings.
*   **[docs/operations/TESTING.md](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/operations/TESTING.md)**: Automated validation gating scripts.
*   **[docs/operations/PERFORMANCE.md](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/operations/PERFORMANCE.md)**: Optimization standards.
