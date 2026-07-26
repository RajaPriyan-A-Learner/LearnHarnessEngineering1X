# Installation & Local Setup Guide

This guide contains step-by-step instructions on setting up and running the Wealth Management Advisor Console monorepo locally.

---

## Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v20.0.0` or higher (Active LTS recommended. Tested on `v24.18.0`).
- **npm**: `v10.0.0` or higher (Tested on `v11.16.0`).
- **Git**: Command-line client.

---

## Local Setup

### 1. Initialize the Workspace
If you haven't already, navigate to your local project directory:
```powershell
cd "c:\Users\rajap\Downloads\Wealth Management Advisor"
```

### 2. Install Project Dependencies
Run the command below from the root of the project. This will install all dependencies across the root and workspace packages (`shared-ui`, `shared-utils`, `mock-server`, and `advisor-console`):
```bash
npm install
```

### 3. Run the Local Mock Server & Web Application
We provide an all-in-one command to start both the Express mock service (HTTP REST endpoints + WebSocket tick server) and the Vite frontend application:
```bash
# Runs mock-server and advisor-console in parallel
npm run dev
```

*   **Advisor Console UI**: `http://localhost:5173`
*   **REST Mock Server**: `http://localhost:3001/api`
*   **WebSocket Stream Feed**: `ws://localhost:3001/ws`

---

## Verifying the Setup

### Run Unit and Integration Tests
Verify that all unit tests and components build properly:
```bash
npm run test
```

### Run E2E Integration Tests (Playwright)
Install Playwright browser binaries if running E2E tests for the first time:
```bash
npx playwright install
```

Then run the E2E verification test suite:
```bash
npm run test:e2e
```

### Code Style Checks (Lint & Format)
Run code compliance checks:
```bash
# Verify ESLint rules
npm run lint

# Format files using Prettier
npm run format
```
