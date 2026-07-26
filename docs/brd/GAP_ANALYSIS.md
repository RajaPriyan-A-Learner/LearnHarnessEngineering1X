# Gap Analysis: Acceptance Criteria Review

This analysis evaluates the coverage of the planned **Skill Acceptance Criteria** against the capstone functional (FR) and non-functional requirements (NFR), identifying gaps and providing recommendations for addition before active development.

---

## 1. Requirement Coverage Matrix

| Requirement Area | Source Requirements | Skill File Coverage | Status |
| :--- | :--- | :--- | :--- |
| **Auth & Session** | FR-1, FR-2, FR-3, FR-4 | `auth-session/SKILL.md` | **Fully Covered** |
| **Book & Client Search** | FR-5, FR-6, FR-7 | `book-portfolio-grid/SKILL.md` | **Fully Covered** |
| **Household & Portfolio** | FR-8, FR-9, FR-10, FR-11 | `book-portfolio-grid/SKILL.md` | **Fully Covered** |
| **Holdings Grid** | FR-12, FR-13, FR-14, FR-15, FR-16, FR-17 | `book-portfolio-grid/SKILL.md` | **Fully Covered** |
| **Real-Time Data** | FR-18, FR-19, FR-20 | `market-data-rebalancing/SKILL.md` | **Fully Covered** |
| **Rebalancing & What-If**| FR-21, FR-22, FR-23, FR-24, FR-25 | `market-data-rebalancing/SKILL.md` | **Fully Covered** |
| **Compliance & Suitability**| FR-26, FR-27, FR-28 | `compliance-proposals/SKILL.md` | **Fully Covered** |
| **Proposals & Reporting** | FR-29, FR-30, FR-31, FR-32 | `compliance-proposals/SKILL.md` | **Fully Covered** |
| **Goals & Planning** | FR-33, FR-34, FR-35 | `goals-onboarding/SKILL.md` | **Fully Covered** |
| **Onboarding & KYC** | FR-36, FR-37, FR-38, FR-39 | `goals-onboarding/SKILL.md` | **Fully Covered** |
| **Cross-Cutting Tools** | FR-40, FR-41, FR-42 | `goals-onboarding/SKILL.md` | **Fully Covered** |
| **Accessibility (a11y)** | NFR-11, NFR-12, NFR-13, NFR-14 | Scattered across grids & E2E plan | **Partial Coverage** |
| **Security & Masking** | NFR-15, NFR-16, NFR-17, NFR-18 | Mentioned in audit logging | **Partial Coverage** |
| **i18n & Localization** | NFR-28 | None | **Missing** |
| **Offline & Resilience** | NFR-22, NFR-23 | Mentioned in draft restoration | **Partial Coverage** |
| **Error Boundaries** | NFR-24, NFR-25 | Mentioned as generic wrappers | **Partial Coverage** |

---

## 2. Identified Gaps & Missing Acceptance Criteria

### Gap 1: Internationalization (i18n) Readiness (NFR-28)
*   **Context**: The application must externalize all user-facing strings and support locale-aware formatting for currencies, numbers, dates, and percentages. Right-to-Left (RTL) layout compatibility must be supported.
*   **Missing Criteria**:
    1.  All static UI labels, error messages, and table headers must be sourced from JSON dictionary files (e.g. `locales/en.json`) using an i18n hook (`t('key')`), rather than hardcoded string literals.
    2.  Number, currency, and date displays must pass the active locale code (e.g., `en-US`, `es-ES`) to formatting utilities.
    3.  Containers must use logical styling properties (e.g. `margin-inline-start` instead of `margin-left`) to maintain layout support if RTL text direction is loaded.

### Gap 2: Offline Synchronization & Conflict Resolution (NFR-22, NFR-23)
*   **Context**: The application must detect network outages, display statuses, and safeguard staged drafts (onboarding, sandbox).
*   **Missing Criteria**:
    1.  **Read-Only Freeze**: While network connectivity is lost, actions that push modifications to server APIs (e.g. submitting compliance reviews, activating accounts) must be visually blocked, and forms set to read-only mode.
    2.  **State Reconnection Sync**: Upon network restoration, if the advisor has updated onboarding drafts offline, prompt the user: `"Local changes detected. Do you want to sync your offline draft to the server?"` to resolve discrepancies.

### Gap 3: PII Security & Masking (NFR-17)
*   **Context**: Sensitive details (SSNs, Tax IDs, Account Numbers) must be masked by default. Revealing them requires a logged, audited event.
*   **Missing Criteria**:
    1.  **Interactive Toggle**: Masked strings must render inline with an option to reveal (`***-**-1234 [Show]`). Clicking the show button prompts a password re-verification or log check.
    2.  **Auto-Re-mask Timer**: Once revealed, the plain text field must auto-mask back to secure dots after 30 seconds of inactivity or focus loss, protecting the client's privacy if the screen is left unattended.

### Gap 4: Granular Error Boundaries (NFR-24)
*   **Context**: Failure in one component module must not crash the surrounding page layout.
*   **Missing Criteria**:
    1.  Individual chart widgets, holding table sectors, and search controls must be wrapped in separate React Error Boundary components.
    2.  If an Error Boundary catches a crash, it must display a fallback card containing a retry button: `"Widget failed to load. [Try Again]"`, allowing adjacent components (like the navigation or search panels) to remain fully interactive.

---

## 3. Recommended Actions

To resolve these gaps, we should:
1.  Extend `packages/shared-ui` to support locale-aware standard templates.
2.  Add a **`docs/adr/ADR-005-internationalization-i18n.md`** to log the choice of standard string mappings.
3.  Add an **`offline-resilience`** folder under `.agents/skills/` containing explicit sync acceptance tests.
