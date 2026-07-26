---
name: "Compliance Gating and Proposals Acceptance Criteria"
description: "Acceptance criteria and coding guidelines for Compliance Gating, Reg BI Rationale Capture, Proposal Generation, and PDF Reporting."
---

# Compliance & Proposals Acceptance Criteria

Use these criteria to implement and test the compliance check rules, justification interfaces, and client proposal document export features (FR-26 to FR-32).

---

## 1. Functional Requirements & Acceptance Criteria

### FR-26 to FR-28: Compliance & Suitability
*   **Acceptance Criteria**:
    *   [ ] Screen staged trades in the rebalancing sandbox against a series of validation checks:
        *   **Concentration Limit**: Warning if any asset class weight > 40% or individual security weight > 10%.
        *   **Restricted List**: Strict error blocking the execution if symbol matches a company listed on the client's restriction list.
        *   **Suitability**: Warning if selected products deviate from the client's risk tolerance profile.
    *   [ ] Trade actions triggering compliance alerts are marked with status symbols (Amber Warning or Red Block) on the staging rows.
    *   [ ] Overriding an Amber Warning requires filling out a Reg BI (Regulation Best Interest) justification text field (minimum 50 characters). Red Blocks cannot be overridden.
    *   [ ] High-risk proposals are routed to the **Compliance Officer Dashboard** for final approval, creating an immutable audit log entry.

### FR-29 to FR-32: Proposals & Reporting
*   **Acceptance Criteria**:
    *   [ ] Generates a print-ready, branded client proposal:
        *   Summarizes current vs proposed allocation wheels.
        *   Includes rationale notes, fee schedules, disclosures, and risk statistics.
    *   [ ] Display interactive in-app preview cards of the document before exporting.
    *   [ ] "Export PDF" compiles client views, applying clean print-ready CSS stylesheets to output formatted PDF documents.
    *   [ ] Proposals are version-controlled; modifications to a proposal increment the version (e.g. `v1` to `v2`) and save history to the database.

---

## 2. E2E Test Scenarios (Playwright Checklist)
*   [ ] Stage a trade for a restricted stock symbol; verify a Red Block warning displays and the "Finalize Proposal" button is disabled.
*   [ ] Stage a trade exceeding concentration limit; verify Amber warning displays. Check that the justification field displays and requires input before validation passes.
*   [ ] Check that a Compliance Officer user can view pending review requests and trigger "Approve" or "Reject" choices.
*   [ ] Trigger proposal PDF export; verify print layout headers, footers, and page breaks format properly without overlaps.
