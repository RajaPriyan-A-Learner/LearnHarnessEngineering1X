# Wealth Management Advisor Console

A unified, high-performance, single-pane-of-glass workspace for Financial Advisors (FAs) and Relationship Managers (RMs). This console integrates portfolio management, real-time market data streaming, asset rebalancing sandboxes, KYC client onboarding wizards, and pre-trade compliance checks.

This project is structured as a feature-based monorepo using npm workspaces to enforce clean module boundaries, separation of concerns, and high testability.

> [!TIP]
> **Getting Started**: For a top-down, hierarchical breakdown of the codebase, business specifications, design decisions, and agent evaluation rules, review the **[Onboarding & Framework Reading Guide](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/ONBOARDING.md)**. For a fun, high-level summary of the requirements using a toy room analogy, check the **[Simple Explanation Guide](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/SIMPLE_EXPLANATION.md)**. To begin implementing specific modules, refer to the copy-paste prompt commands listed in the **[Backlog Prompting & Instruction Guide](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/HOW_TO_INSTRUCT.md)**. To understand our division of labor and execution loops, check the **[Developer-Agent Collaboration Guide](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/operations/COLLABORATION.md)**.

## Project Structure

```
.
├── apps/
│   └── advisor-console/         # Main Vite + React + TS Application (the Shell)
├── packages/
│   ├── shared-ui/               # Reusable Atomic UI Components & Styling tokens
│   ├── shared-utils/            # Financial math, formatters, and API client layers
│   └── mock-server/             # Mock HTTP & WebSockets streaming server
├── docs/                        # Architecture and Decision logs
├── package.json                 # Monorepo configuration and workspace scripts
└── tsconfig.json                # Shared root TypeScript configuration
```

## Available Scripts

From the root directory, you can run the following commands across all workspaces:

### Development
```bash
# Starts the development servers (frontend + mock api/websocket)
npm run dev
```

### Build
```bash
# Compiles all packages and builds the production bundle for the console app
npm run build
```

### Linting & Formatting
```bash
# Lints all source files
npm run lint

# Formats code using Prettier rules
npm run format
```

### Type Checking
```bash
# Runs TypeScript compiler verification across the monorepo
npm run typecheck
```

### Testing
```bash
# Runs all unit and integration tests (Vitest)
npm run test

# Runs end-to-end integration tests (Playwright)
npm run test:e2e
```

## Architectural Principles
- **Clean Architecture Boundaries**: Presentation components never touch low-level details directly. All data access flows through typed clients in `@wma/shared-utils`.
- **Feature Isolation**: Modules (e.g., Onboarding, Rebalancing) are self-contained and lazy-loaded. Communication between modules is defined via public TypeScript interfaces.
- **Performance First**: Large lists utilize virtualized window rendering to ensure 60fps scrolling, and real-time WebSocket tick updates are coalesced and throttled to prevent component re-render loops.
- **Accessibility & Inclusion**: Designed to conform with WCAG 2.1 AA guidelines, supporting full keyboard operation, screen-reader landmarks/announcements, and appropriate color contrast ratios.
