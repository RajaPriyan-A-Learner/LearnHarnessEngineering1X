# Backlog Prompting & Instruction Guide

This document provides copy-pasteable prompt commands to instruct the AI coding assistant when starting implementation on any Epic or Feature.

---

## 💡 How the Prompting Flow Works

When you send any of the prompt commands below, the assistant will automatically:
1.  Locate the targeted feature in `docs/brd/features.json`.
2.  Open the corresponding step-by-step developer guideline file in `docs/plans/`.
3.  Load the required acceptance criteria checklists from `.agents/skills/`.
4.  Scaffold, write, and verify the feature code in accordance with `.agents/AGENTS.md` rules.

---

## 📋 Copy-Paste Prompt Registry

### 🛡️ Epic 1: Auth, Security & Portal Shell (EP-1)
*   **For Monorepo Setup & Workspace Scaffolding**:
    ```text
    Initialize the monorepo workspaces and shared tools configs (Prettier, ESLint, TypeScript) for Epic 1.
    ```
*   **For Feature 1.1 (Authentication & MFA)**:
    ```text
    Let's implement FE-1.1 (Authentication & MFA Gate)
    ```
*   **For Feature 1.2 (Session Management & Timers)**:
    ```text
    Let's implement FE-1.2 (Session Management & Silent Refresh)
    ```
*   **For Feature 1.3 (Portal Layout Shell)**:
    ```text
    Let's implement FE-1.3 (Advisor Shell & Layouts)
    ```

---

### 🔍 Epic 2: Book of Business & Client Search (EP-2)
*   **For Feature 2.1 (Client Search Input)**:
    ```text
    Let's implement FE-2.1 (Client Search Bar)
    ```
*   **For Feature 2.2 (Dashboards & Filtering)**:
    ```text
    Let's implement FE-2.2 (Book of Business Filters)
    ```

---

### 📊 Epic 3: Holdings Grid & Market Ticker (EP-3)
*   **For Feature 3.1 (Virtualized Holdings Grid)**:
    ```text
    Let's implement FE-3.1 (Virtualized Holdings Grid)
    ```
*   **For Feature 3.2 (WebSocket Price Ticker)**:
    ```text
    Let's implement FE-3.2 (WebSocket Market Data Streaming)
    ```

---

### 📈 Epic 4: Portfolio Analytics & Sandbox (EP-4)
*   **For Feature 4.1 (Allocation Wheels)**:
    ```text
    Let's implement FE-4.1 (Allocation Charts)
    ```
*   **For Feature 4.2 (Drift Engine)**:
    ```text
    Let's implement FE-4.2 (Model Drift Engine)
    ```
*   **For Feature 4.3 (Staging Sandbox)**:
    ```text
    Let's implement FE-4.3 (What-If Staging Sandbox)
    ```

---

### ⚖️ Epic 5: Compliance Gating & Proposals (EP-5)
*   **For Feature 5.1 (Pre-Trade Compliance Rules)**:
    ```text
    Let's implement FE-5.1 (Pre-Trade Compliance Checks)
    ```
*   **For Feature 5.2 (Proposals PDF generator)**:
    ```text
    Let's implement FE-5.2 (Proposal Document Generation)
    ```
*   **For Feature 5.3 (Compliance Dashboard)**:
    ```text
    Let's implement FE-5.3 (Compliance Review Dashboard)
    ```

---

### 🎯 Epic 6: Goals & Onboarding Wizard (EP-6)
*   **For Feature 6.1 (Financial Goals Dials)**:
    ```text
    Let's implement FE-6.1 (Financial Goals Dials)
    ```
*   **For Feature 6.2 (Resumable KYC Stepper)**:
    ```text
    Let's implement FE-6.2 (Resumable KYC stepper Wizard)
    ```
*   **For Feature 6.3 (Drag-and-Drop Uploader)**:
    ```text
    Let's implement FE-6.3 (Document Uploader Zone)
    ```

---

### ⚙️ Epic 7: Cross-Cutting NFRs (EP-7)
*   **For Feature 7.1 (Tax ID Masking)**:
    ```text
    Let's implement FE-7.1 (PII Security & Masking)
    ```
*   **For Feature 7.2 (Offline Gating & Sync)**:
    ```text
    Let's implement FE-7.2 (Offline Support & Sync)
    ```
*   **For Feature 7.3 (Locales & i18n)**:
    ```text
    Let's implement FE-7.3 (i18n Readiness)
    ```
