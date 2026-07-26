# Step-by-Step Plan: Epic 5 - Compliance Gating & Proposals

This document provides chronological instructions for implementing Epic 5 (`EP-5`) features: **Pre-Trade Compliance Checks (FE-5.1)**, **Proposal Document Generation (FE-5.2)**, and **Compliance Review Dashboard (FE-5.3)**.

---

## 🛠️ Step-by-Step Implementation Instructions

### Step 1: Implement Staged Order Compliance Validator (`FE-5.1`)
*   **Actions**:
    1.  Write a helper validator function `validateStagedOrders.ts` evaluating sandbox transactions:
        *   **Restricted List**: Checks if order symbol matches forbidden stock items.
        *   **Concentration Limits**: Checks if transaction positions push weight allocation > 10% on a single equity.
        *   **Suitability Index**: Checks if the target portfolio risk index is higher than client KYC tolerance levels.
    2.  Configure table grids to display warning status symbols (Amber warnings or Red blocked badges) directly on staged lines.

### Step 2: Implement Reg BI Rationale Overrides
*   **Actions**:
    1.  Block the "Submit/Finalize Proposal" buttons if compliance warning parameters are flagged.
    2.  Mount an override drawer input field requiring advisors to supply justification rationale (Reg BI compliance notes).
    3.  Configure validation checks: the text must be > 50 characters before enabling bypass gates. Red Block checks cannot be overridden.

### Step 3: Develop Branded PDF Generation and In-App Preview (`FE-5.2`)
*   **Actions**:
    1.  Design print layout preview components summarizing target allocations, disclaimers, fee calculations, and justification statements.
    2.  Write print stylesheet overrides (`@media print` rules) to format document columns, hide navigation sidebars, and prevent table row splits.
    3.  Integrate a print action script triggering browser system printing dialogs, or use a PDF builder utility to compile print frames into files.
    4.  Save proposal histories, mapping sequential version numbering (`v1`, `v2`) to client profiles.

### Step 4: Construct Compliance Officer Dashboard (`FE-5.3`)
*   **Actions**:
    1.  Create the Compliance Review page dashboard layout.
    2.  Fetch pending proposal pipelines requiring authorization review.
    3.  Render detailed cards containing the proposed transactions, drift outcomes, and advisor justification notes.
    4.  Add buttons to Approve or Reject reviews (triggering mock REST notifications and logging actions to audit logs).
