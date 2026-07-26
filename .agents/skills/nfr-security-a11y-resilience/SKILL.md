---
name: "Security, Accessibility, and Resilience Acceptance Criteria"
description: "Acceptance criteria and coding guidelines for WCAG 2.1 AA Compliance, PII Masking, Offline Sync, i18n Readiness, and Error Boundaries."
---

# NFR Security, Accessibility, & Resilience Criteria

Use these criteria to implement and verify non-functional requirements (NFRs) across all feature modules during coding.

---

## 1. Functional Requirements & Acceptance Criteria

### NFR-11 to NFR-14: Accessibility (WCAG 2.1 AA)
*   **Acceptance Criteria**:
    *   [ ] **Keyboard Focus**: Focus indicators must be highly visible (e.g. outline `2px solid var(--color-focus-blue)`). Focus must follow a logical top-to-bottom, left-to-right tab order.
    *   [ ] **Aria Landmarks**: Forms, tables, navigation headers, and charts must declare semantic landmarks (`role="grid"`, `aria-expanded`, `aria-invalid`, `aria-describedby`).
    *   [ ] **Live Region Alerts**: Connection drops, compliance drifts, and timeout prompts must use `<div aria-live="polite">` or `<div aria-live="assertive">` to alert assistive technologies.
    *   [ ] **Contrast check**: Contrast ratio of all text strings against background cards must meet a minimum rating of `4.5:1` (verified via browser Axe tool tests).

### NFR-15 to NFR-18: Security & PII Protection
*   **Acceptance Criteria**:
    *   [ ] **Tax ID Masking**: Render client tax IDs as masked (`***-**-1234`) by default.
    *   [ ] **Audit & Reveal**: Clicking a reveal toggle retrieves the decrypted field and writes an audit event containing context metadata.
    *   [ ] **Auto-Masking**: The revealed display must auto-mask back to secure dots after 30 seconds of inactive cursor focus.
    *   [ ] **In-Memory JWT**: Tokens cannot be saved to LocalStorage. Secure background closures handle in-memory values.

### NFR-22 to NFR-23: Offline Resilience
*   **Acceptance Criteria**:
    *   [ ] **Offline Detection**: Loss of connection displays a persistent header banner: `"Offline. Actions are restricted, viewing cached snapshots only."`
    *   [ ] **Write Gating**: Disabling submit buttons, transaction stage actions, and documents upload fields when connection status is offline.
    *   [ ] **Draft Reconnect Sync**: On reconnect, compare timestamps of offline drafts against database configurations and prompt users to sync if modifications exist.

### NFR-24 to NFR-25: Error Boundaries
*   **Acceptance Criteria**:
    *   [ ] **Granular Boundaries**: Wrap individual layout modules (Holdings Grid, Allocation Speedometer, Account Lists, Search Bar) in separate React Error Boundary classes.
    *   [ ] **Local Recovery**: Crashed widgets display fallback states: `"Something went wrong. [Try Again]"`. Re-triggering a widget reload must resolve local state slices without reloading the main console.

### NFR-28: Internationalization (i18n Readiness)
*   **Acceptance Criteria**:
    *   [ ] **External Strings**: No hardcoded static labels or warnings in components. Sourced from JSON mapping files using translating custom hooks.
    *   [ ] **Locale Math Formatting**: Currency displays, dates, and percentages must pass localized format values (e.g., swapping thousand/decimal separators according to target locales).
    *   [ ] **Logical CSS Grid Layouts**: Components must use logical CSS sizing parameters (`margin-inline-start`, `padding-block-end`) rather than fixed positions to ensure layout stability if loading Right-to-Left (RTL) text arrangements.

---

## 2. E2E Test Scenarios (Playwright Checklist)
*   [ ] Run Axe accessibility auditing checks on all pages; ensure 0 violations are returned.
*   [ ] Toggle the reveal button for Tax IDs; verify that the audit timeline shows an entry for the event. Wait 35 seconds and check that the ID is masked again.
*   [ ] Disconnect network cards; check that the offline banner appears, input controls lock down, and offline data is retrieved from IndexDB caches.
*   [ ] Simulate a Javascript rendering crash in the Allocation Speedometer; verify the parent navigation shell remains interactive, and clicking "Try Again" recovers the speedometer widget.
*   [ ] Swap local preferences from `en-US` to `de-DE`; verify currency formatting shifts from `$1,250.50` to `1.250,50 $`.
