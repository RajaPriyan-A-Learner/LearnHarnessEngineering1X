# Wealth Management Advisor Console - Coding and Agent Rules

These workspace-scoped rules govern agent behavior and design constraints when writing code for this repository.

---

## 1. Technology & Design Constraints
- **Styling**: Always use **Vanilla CSS with CSS Modules**. Do **NOT** install or use Tailwind CSS unless the user explicitly overrides this guideline and specifies a version.
- **Framework**: Implement interfaces strictly using **React, TypeScript, and Vite**.
- **State Management**: Decouple state:
  - **Zustand** for global transient / UI layout / rebalancing sandbox staging states.
  - **TanStack Query (React Query)** for HTTP cache server states.
  - **Derived values** must be computed in memory via selectors (never stored redundantly in component states).

---

## 2. Code Quality & Modularity Rules
- **Monorepo Workspaces**: Keep code modular. Do not cross-import feature-specific code. Use `@wma/shared-ui` for shared visual layout molecules and `@wma/shared-utils` for financial calculations or REST/WS clients.
- **Coverage**: All newly written modules, services, or selectors must reach a minimum of **80% line and branch test coverage** before compiling final builds.
- **Strict TypeScript**: Do **NOT** use `any` types. Run compiler verification checks (`tsc --noEmit`) to verify zero type alerts.

---

## 3. Security & Safety Rules
- **PII Data**: Mask sensitive variables like Tax IDs or SSNs by default. Logging full SSNs/Tax IDs to consoles or files is strictly prohibited.
- **Auth Tokens**: Manage JSON Web Tokens in-memory. Do not write access tokens directly to `localStorage`.
- **Mock Interfaces**: Build mock servers and WebSocket broadcasting loops for real-time tickers. Do not attempt connection setups with live custodians or actual client environments.
