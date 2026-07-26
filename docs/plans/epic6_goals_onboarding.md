# Step-by-Step Plan: Epic 6 - Goals & KYC Onboarding

This document provides chronological instructions for implementing Epic 6 (`EP-6`) features: **Financial Goals Dials (FE-6.1)**, **Resumable KYC Stepper Wizard (FE-6.2)**, and **Document Uploader Zone (FE-6.3)**.

---

## 🛠️ Step-by-Step Implementation Instructions

### Step 1: Build Financial Goals Trackers (`FE-6.1`)
*   **Actions**:
    1.  Create target goal cards displaying progress status bars.
    2.  Write progress logic comparing assets value against targets.
    3.  Implement SVG gauges illustrating Monte Carlo projection rates: On Track (>80% probability), At Risk (50%-80%), or Off Track (<50%).
    4.  Establish database bindings: when portfolios change, recalculate goals progress metrics automatically.

### Step 2: Develop Resumable KYC stepper Wizard (`FE-6.2`)
*   **Actions**:
    1.  Design a multi-step stepper container component `OnboardingWizard.tsx` with progress progress indicators.
    2.  Divide form sections: `Step 1: Personal Profiles`, `Step 2: Suitability & Investment Profile`, `Step 3: Documents Upload`.
    3.  Integrate input validators checking field completeness before permitting step updates.

### Step 3: Implement Draft Recovery and Local Cache
*   **Actions**:
    1.  Create active backup hooks: serialize form data and save to LocalStorage or IndexedDB under `kyc_draft_[client_id]` on every step transition.
    2.  On page mount, check for existing backups. Show restore confirm dialogs if records exist.
    3.  Upon final onboarding submission, delete draft cache databases.

### Step 4: Construct Document Drag & Drop Uploader (`FE-6.3`)
*   **Actions**:
    1.  Create `DocumentUploader.tsx` component with drag-and-drop file upload capabilities.
    2.  Establish upload verification boundaries:
        *   Validate mime-types (accept only PDF, PNG, and JPG; reject `.exe`/executable files).
        *   Validate file sizes (block files > 10MB).
    3.  Display uploading visual indicators (loading progress bars, upload speed details, and error notifications).
    4.  Simulate document review statuses (Pending review, Approved, Rejected).
