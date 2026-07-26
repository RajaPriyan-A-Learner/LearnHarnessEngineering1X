# ADR-004: Monorepo Tooling Selection

## Status
Approved

## Context
The capstone requirements dictate a monorepo structure with separated packages (host apps, shared ui libs, mock service server, configuration presets) to prevent circular coupling and facilitate development. We need a monorepo manager that is simple, standard, and requires no complicated global tool setups.

## Decision
We will utilize **npm Workspaces** as the root package manager and dependency orchestrator.

## Alternatives Considered
1.  **Lerna**: Heavily utilized historically, but introduces complex, external CLI layers that are now mostly redundant with modern package manager workspaces.
2.  **Turborepo**: Highly optimized build system with remote caching features. It is a good choice for massive builds, but for this capstone, it introduces additional configuration overhead and depends on Go/Rust binaries that must be compiled or downloaded.
3.  **pnpm workspaces**: Excellent dependency management, but requires pnpm to be installed globally on developer systems, which diverges from standard Node.js installations.

## Consequences
*   **Pros**:
    *   **Zero Install**: Out-of-the-box support with Node.js/npm.
    *   **Unified Lockfile**: Root package manager maintains a single `package-lock.json` file, ensuring package version consistency across workspaces.
    *   **Simplicity**: Multi-package mapping is declared inside a simple root `package.json` arrays field.
*   **Cons**:
    *   Slower execution speeds compared to pnpm's global hard-link node_module store.
    *   Lacks the advanced dependency task caching of Turborepo (this is mitigated by Vite's fast local compilation cache).
