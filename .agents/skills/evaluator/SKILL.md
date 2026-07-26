---
name: "Project Completeness and Quality Evaluator"
description: "Guidelines and validation checklists for evaluating the advisor console codebase against all functional (FR), non-functional (NFR), and deliverable (D) requirements."
---

# Project Completeness & Quality Evaluator

Use this skill to evaluate code completeness, architectural standards, and project deliverables before building or submitting the final Capstone repository.

---

## 1. Deliverables Audit Checklist (D-1 to D-14)

Verify that the workspace contains all required artifacts and formats:

*   [ ] **D-1: Source Code**: Check that a runnable monorepo exists containing `apps/advisor-console`, `packages/shared-ui`, `packages/shared-utils`, and `packages/mock-server`.
*   [ ] **D-2: Architecture Document**: Ensure `docs/architecture/ARCHITECTURE.md` exists detailing layered boundaries and state models.
*   [ ] **D-3, D-4, D-5: Diagrams**: Ensure `docs/architecture/DIAGRAMS.md` displays component hierarchies, monorepo dependency layouts, and real-time state sync graphs.
*   [ ] **D-6: Folder Structure**: Verify `README.md` details workspace paths.
*   [ ] **D-7: ADR Log**: Check `docs/architecture/adr/` contains records 001 through 004.
*   [ ] **D-8: Performance Report**: Check `docs/operations/PERFORMANCE.md` outlines virtual grid buffers and tick coalescing.
*   [ ] **D-9: Lighthouse Targets**: Ensure Lighthouse scores meet targets (Performance/Accessibility/SEO > 90).
*   [ ] **D-10, D-11: Testing & E2E Reports**: Check `docs/operations/TESTING.md` is complete and test files are populated in workspaces.
*   [ ] **D-12, D-13, D-14: Guides**: Verify root `README.md`, `docs/operations/INSTALL.md`, and `docs/operations/DEPLOYMENT.md` are present.

---

## 2. Functional Requirements Audit Checklist (FR-1 to FR-42)

Verify the codebase implementation of functional requirements:

### EP-1: Auth, Security & Portal Shell (FR-1 to FR-4)
*   [ ] Access tokens are stored in-memory (no localStorage backups). Refresh tokens use secure HTTPOnly cookies.
*   [ ] Navigating to `/admin` gates checks role permissions; unauthorized roles see `403 Forbidden` fallbacks.
*   [ ] Inactivity tracker triggers countdown warning at 14 minutes, logging users out at 15 minutes of idle state.

### EP-2: Book & Client Search (FR-5 to FR-7)
*   [ ] Search bar inputs are debounced by 200ms.
*   [ ] Search results allow Up/Down arrow selections, loading households on Enter key clicks.

### EP-3: Holdings Grid & Market Ticker (FR-12 to FR-20)
*   [ ] Grid components handle 10,000+ rows smoothly using virtualization wrappers.
*   [ ] WebSocket streaming updates are throttled to 500ms intervals using requestAnimationFrame coalescers.
*   [ ] Price ticks animate cell backgrounds (Green/Red) fading out over 800ms.

### EP-4: Portfolio Analytics & Rebalancing Sandbox (FR-21 to FR-25)
*   [ ] Drift metrics calculate variance against target model parameters.
*   [ ] Sandbox staging order Zustand stores reactively update cash totals, allocation charts, and tax warnings.

### EP-5: Compliance Gating & Proposals (FR-26 to FR-32)
*   [ ] Staged transactions throw Amber warnings on concentration limits (>10% per position) or Red blocks on restricted list matches.
*   [ ] Amber warning overrides require >50 characters of justification notes.
*   [ ] Client proposal pages apply CSS media print rules to export structured PDFs.

### EP-6: Goals & KYC Onboarding (FR-33 to FR-39)
*   [ ] Wizard steppers write drafts to LocalStorage/IndexDB on each step transition.
*   [ ] Document drop zones filter formats (accept PDF/PNG/JPG) and block files > 10MB.

---

## 3. Non-Functional Requirements (NFR) Validation Checks

Run the following diagnostics to check compliance:

### A. Accessibility Scan
1.  Navigate to critical dashboards (Login, Portfolio, Sandbox, Onboarding).
2.  Run Axe-core accessibility scanners:
    ```bash
    npx playwright test --grep @accessibility
    ```
3.  Ensure zero critical violations are returned. Confirm keyboard focus rings are visible on all interactive tags.

### B. Security & PII Check
1.  Inspect console log output. Verify no SSNs, Tax IDs, or API keys are written.
2.  Reveal Tax ID; verify that it auto-masks back to dots after 30 seconds of inactivity.

### C. Performance & Virtualization
1.  Run local Lighthouse audit:
    ```bash
    npm run audit:lighthouse
    ```
2.  Scroll the virtualized grid rapidly; check frame rate diagnostics inside developer tools. Ensure rendering times are < 16ms per frame.

### D. Test Coverage Gate
1.  Run coverage reporter:
    ```bash
    npm run test:coverage
    ```
2.  Check that global line and branch coverage exceeds **80%** for `shared-utils` and core hooks.
