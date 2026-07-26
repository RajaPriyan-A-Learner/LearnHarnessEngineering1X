# Developer-Agent Collaboration Guide

This guide defines the division of labor between the **Financial Advisor Console Developer (You)** and the **AI Coding Assistant (Me)**, ensuring clear validation loops and efficient execution.

---

## 🤖 1. Assistant Autonomous Responsibilities (Me)

When instructed to implement a specific feature or story, I will autonomously handle:

*   **Code Creation**: Writing components, TypeScript interfaces, global Zustand stores, server-state query caches, formatting utilities, and stylesheet modules.
*   **Mock Services**: Building local mock endpoints (HTTP REST) and mock WebSockets stream generators.
*   **Testing Suites**: Creating unit tests (Vitest + React Testing Library) and E2E browser tests (Playwright + Axe-core).
*   **Code Hardening**: Auditing ESLint configurations, fixing strict TypeScript compiler warnings, verifying CSS variables, and resolving test failures.

---

## 👤 2. Developer Responsibilities (You)

To control the project progression and validate compliance targets, your tasks include:

*   **Triggering backlogs**: Prompting me with the copy-paste commands located in the **[Backlog Prompting & Instruction Guide](file:///c:/Users/rajap/Downloads/Wealth%20Management%20Advisor/docs/HOW_TO_INSTRUCT.md)**.
*   **Approving terminal processes**: Approving proposed execution commands (like `npm install`, compile loops, or test runners) when prompted by the IDE.
*   **Manual verification**: Reviewing local development environments (`http://localhost:5173`) to visually audit transition animations, contrast ratios, and responsive reflows.

---

## 🚀 3. Getting Started Workflow

To initialize the project:
1.  Copy the setup command below:
    ```text
    Initialize the monorepo workspaces and shared tools configs (Prettier, ESLint, TypeScript) for Epic 1.
    ```
2.  Paste it into the chat console and submit.
3.  Approve the workspace installation command when prompted.
