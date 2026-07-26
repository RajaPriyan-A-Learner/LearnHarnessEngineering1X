---
name: "Goals, KYC Onboarding, and Cross-Cutting Tools Acceptance Criteria"
description: "Acceptance criteria and coding guidelines for Goal Trackers, Resumable KYC Wizards, Document Uploaders, and Audit Timeline Logs."
---

# Goals, Onboarding & Tools Acceptance Criteria

Use these criteria to implement and test the goal tracking cards, multi-step KYC wizard, uploader, audit trails, and global alert managers (FR-33 to FR-42).

---

## 1. Functional Requirements & Acceptance Criteria

### FR-33 to FR-35: Goals & Financial Planning
*   **Acceptance Criteria**:
    *   [ ] Display cards for each financial goal (e.g. "Retirement 2045") illustrating targets, target dates, funding gaps, and progress bars.
    *   [ ] Render interactive Monte Carlo success dials:
        *   Displays `On Track` (Green, > 80% success), `At Risk` (Amber, 50%-80%), or `Off Track` (Red, < 50%).
    *   [ ] Link accounts: mapping changes to portfolio values dynamically updates goal funding levels and recalculated success estimates.

### FR-36 to FR-39: Client Onboarding & KYC Wizard
*   **Acceptance Criteria**:
    *   [ ] Multi-step wizard layout: `1. Identity Check` -> `2. Financial Profile` -> `3. Risk Profile` -> `4. Document Upload`.
    *   [ ] Form Validation: block step transition until all required fields of the active step pass validation checks.
    *   [ ] Resume Capability: save form state to LocalStorage/IndexedDB on each successful step transition. If the wizard is closed and re-opened, prompt: `"Restore previous draft?"` to skip finished steps.
    *   [ ] Drag-and-drop file uploader:
        *   Accepts `.pdf`, `.png`, and `.jpg` (rejects other file types).
        *   Blocks files > 10MB.
        *   Displays visual uploading states (progress bar, speed indicators, retry triggers).
    *   [ ] Mock KYC AML screening: displays status (`Passed`, `Flagged for Review`) before permitting final account submission.

### FR-40 to FR-42: Cross-Cutting Tools
*   **Acceptance Criteria**:
    *   [ ] Global Notification Center: notification drawer displays active tasks (e.g. "Compliance Drift detected for Household Smith").
    *   [ ] Audit log trail: every material action (sandbox scenario saves, manual compliance overrides, SSN reveals) appends details to an audit view: `timestamp, user, action, target, metadata`.
    *   [ ] Configurable Dashboard: allow advisors to drag and rearrange widgets, persisting layouts in the user preferences store.

---

## 2. E2E Test Scenarios (Playwright Checklist)
*   [ ] Check that goals indicators update when accounts are linked or unlinked.
*   [ ] Run validation checks on wizard input fields; verify progress step indicators change.
*   [ ] Simulate a browser crash during Step 3 of onboarding; check that reload displays the restore alert and populates previous fields.
*   [ ] Upload a 12MB file; verify uploader blocks upload and outputs an error. Upload a `.exe` file; check that warning displays.
*   [ ] Audit tracking check: reveal a client's tax ID and verify that a new audit log record is written with target metadata.
