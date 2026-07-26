# Documentation Index

This directory contains the detailed engineering specifications, business case materials, architectural decision records, and operational guidelines for the **Wealth Management Advisor Console**.

> [!TIP]
> **New to the Project?** Start by reading the **[Onboarding & Framework Reading Guide](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/ONBOARDING.md)** for a top-down, hierarchical breakdown of the codebase, business specifications, and validation rules.

---

## 📂 Documentation Directory Map

### 📋 1. Business Requirements (BRD)
*   **[BRD.md](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/brd/BRD.md)**: Extracted business case document containing background, problem statements, functional scope (FR-1 to FR-42), and non-functional metrics (NFR-1 to NFR-29).
*   **[SIMPLE_EXPLANATION.md](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/SIMPLE_EXPLANATION.md)**: Conceptual summary of the business requirements, modeled using a child-friendly "toy room" analogy.
*   **[GAP_ANALYSIS.md](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/brd/GAP_ANALYSIS.md)**: Evaluation of the system coverage matrix identifying NFR gaps and recommendation plans.
*   **[features.json](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/brd/features.json)**: Structured JSON backlog database mapping requirements into Epics, Features, and Stories with dependency sequences.


### 🏛️ 2. System Architecture & Decisions
*   **[ARCHITECTURE.md](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/architecture/ARCHITECTURE.md)**: Core architectural layers, real-time data throttling designs, virtualization mechanics, accessibility conformance rules, and data routing paths.
*   **[DIAGRAMS.md](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/architecture/DIAGRAMS.md)**: Visual component hierarchy diagrams, monorepo workspaces package dependencies graphs, and real-time state synchronization flows.
*   **[PRESENTATION.md](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/architecture/PRESENTATION.md)**: Executive architectural presentation outline, linking business requirements to technical choices and technical defense points.
*   **Architectural Decision Records (ADRs)**:
    *   **[ADR-001: State Management](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/architecture/adr/ADR-001-state-management.md)**: Selection details for Zustand and TanStack Query.
    *   **[ADR-002: Styling and Theming](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/architecture/adr/ADR-002-styling-strategy.md)**: Selection details for Vanilla CSS with CSS Modules.
    *   **[ADR-003: Testing Frameworks](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/architecture/adr/ADR-003-testing-strategy.md)**: Selection details for Vitest, Playwright, MSW, and Axe-Playwright.
    *   **[ADR-004: Monorepo Tooling](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/architecture/adr/ADR-004-monorepo-tooling.md)**: Selection details for standard npm Workspaces.

### ⚙️ 3. Operations & Guidelines
*   **[INSTALL.md](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/operations/INSTALL.md)**: Developer prerequisites and quickstart execution run parameters.
*   **[DEPLOYMENT.md](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/operations/DEPLOYMENT.md)**: Production compile pipelines, environment variables, Nginx servers configurations, and Docker definitions.
*   **[TESTING.md](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/operations/TESTING.md)**: Quality gates parameters, coverage requirements, E2E critical path specifications, and Axe scripts.
*   **[PERFORMANCE.md](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/operations/PERFORMANCE.md)**: Budget boundaries, window list calculations, and tick-coalescing algorithms.
*   **[COLLABORATION.md](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/operations/COLLABORATION.md)**: Division of labor specifications, validation checklists, and execution loops guide.


### 📅 4. Backlog Execution Plans
*   **[master_plan.md](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/plans/master_plan.md)**: Chronological backlog execution sequence and dependency flows mapping.
*   **[HOW_TO_INSTRUCT.md](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/HOW_TO_INSTRUCT.md)**: Backlog prompting and copy-paste instructions guide for all Epics and Features.
*   **Epic Plans (Step-by-Step Developer Guidance)**:
    *   **[epic1_auth_shell.md](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/plans/epic1_auth_shell.md)**: Workspaces setups, login/MFA forms, and timeouts.
    *   **[epic2_book_search.md](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/plans/epic2_book_search.md)**: Input debounces, key events, and directory selectors.
    *   **[epic3_grid_ticker.md](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/plans/epic3_grid_ticker.md)**: Virtual rendering lists, sockets connections, and cells animations.
    *   **[epic4_analytics_rebalance.md](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/plans/epic4_analytics_rebalance.md)**: Allocations graphics, drift engines, and sandbox order states.
    *   **[epic5_compliance_reports.md](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/plans/epic5_compliance_reports.md)**: Suitability rule checks, Reg BI overrides, and print stylesheets.
    *   **[epic6_goals_onboarding.md](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/plans/epic6_goals_onboarding.md)**: Goals probabilities gauges, KYC wizard steppers, and upload boxes.
    *   **[epic7_cross_cutting_nfrs.md](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/plans/epic7_cross_cutting_nfrs.md)**: PII mask toggles, network status listeners, and dynamic locale translators.

---

## 🤖 Agent Customization Settings (Skills & Rules)
These guidelines live in `.agents/` and are parsed automatically by project agents:
*   **[AGENTS.md](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/.agents/AGENTS.md)**: Global coding boundaries and style instructions.
*   **Customization Skills**:
    *   **[auth-session/SKILL.md](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/.agents/skills/auth-session/SKILL.md)**: Auth & timeouts.
    *   **[book-portfolio-grid/SKILL.md](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/.agents/skills/book-portfolio-grid/SKILL.md)**: Grids & aggregated summaries.
    *   **[market-data-rebalancing/SKILL.md](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/.agents/skills/market-data-rebalancing/SKILL.md)**: Stream ticks & sandbox.
    *   **[compliance-proposals/SKILL.md](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/.agents/skills/compliance-proposals/SKILL.md)**: Compliance flags & PDF.
    *   **[goals-onboarding/SKILL.md](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/.agents/skills/goals-onboarding/SKILL.md)**: Steppers, uploads, & Monte Carlo.
    *   **[architectural-flows/SKILL.md](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/.agents/skills/architectural-flows/SKILL.md)**: Procedural hooks & buffers.
    *   **[git-workflows-code-gen/SKILL.md](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/.agents/skills/git-workflows-code-gen/SKILL.md)**: Branching, commits, and code templates.
    *   **[nfr-security-a11y-resilience/SKILL.md](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/.agents/skills/nfr-security-a11y-resilience/SKILL.md)**: a11y, PII mask, errors, & i18n.
    *   **[evaluator/SKILL.md](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/.agents/skills/evaluator/SKILL.md)**: Code completeness and quality validator.

