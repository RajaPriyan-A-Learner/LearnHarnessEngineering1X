# Step-by-Step Plan: Epic 7 - Cross-Cutting NFRs

This document provides chronological instructions for implementing Epic 7 (`EP-7`) features: **PII Security & Masking (FE-7.1)**, **Offline Support & Sync (FE-7.2)**, and **i18n Readiness (FE-7.3)**.

---

## 🛠️ Step-by-Step Implementation Instructions

### Step 1: Implement PII Masking and Reveal Logs (`FE-7.1`)
*   **Actions**:
    1.  Create `PIIField.tsx` component that accepts a text string and a masking mask pattern.
    2.  By default, display masked value characters (e.g. `***-**-1234` for SSN) with a "Show" button.
    3.  On clicking "Show", display plain text, and dispatch audit log events containing target information (timestamp, user, context).
    4.  Set up an activity timer on focus: once revealed, trigger an auto-mask callback returning display to secure dots after 30 seconds of inactivity or focus loss.

### Step 2: Implement Offline Network Gating and Synchronization (`FE-7.2`)
*   **Actions**:
    1.  Create a connection monitor hook `useNetworkStatus.ts` tracking `window.navigator.onLine` and listening to `online`/`offline` window events.
    2.  Render status headers alerting users to connection drops.
    3.  Disable and lock out modification inputs: gray out transaction staging, document uploads, and onboarding wizard steps when connection is offline.
    4.  Read portfolio values from local IndexDB cache databases during outages.
    5.  On reconnection, check if local draft modifications were written; prompt users to synchronize offline edits to server APIs.

### Step 3: Implement Locale-Aware Translation Framework (`FE-7.3`)
*   **Actions**:
    1.  Scaffold locale mapping directories: `locales/en-US.json`, `locales/de-DE.json`.
    2.  Write custom translation hooks or configure i18next integrations to map UI headers, button text, and alerts dynamically.
    3.  Extend formatter utilities to swap decimal/thousands separators based on active locale codes (e.g., standardizing values to `1.250,50 $` when German configuration is active).
    4.  Verify CSS grids use logical spacing properties (e.g. `padding-inline-start`) instead of absolute properties (`padding-left`) to preserve layout alignment for Right-to-Left layouts.
