---
name: "Authentication and Session Acceptance Criteria"
description: "Acceptance criteria and coding guidelines for Authentication, Role-Based Access Control, Token Refresh, and Session Timeouts."
---

# Authentication & Session Acceptance Criteria

Use these criteria and test scenarios to implement and verify the authentication and session manager features (FR-1 to FR-4).

---

## 1. Functional Requirements & Acceptance Criteria

### FR-1: Core Authentication & MFA
*   **Description**: Authenticate advisors via username/password + MFA challenge code.
*   **Acceptance Criteria**:
    *   [ ] Display a clean login card. Form must validate fields (valid email layout, password > 8 chars).
    *   [ ] On form submit, trigger an API call and display an inline MFA screen requiring a 6-digit verification code.
    *   [ ] Mock validation: Any 6-digit numeric input starting with `12` is treated as valid; others throw validation errors.
    *   [ ] Successful login returns mock access token (expires in 15 mins) and refresh token (expires in 7 days).

### FR-2: Role-Based Access Control (RBAC)
*   **Description**: Restrict access to feature modules by role: Advisor, Relationship Manager, Client Service Associate, Compliance Officer, and Branch Admin.
*   **Acceptance Criteria**:
    *   [ ] Authenticated sessions contain a `role` field.
    *   [ ] Router blocks unauthorized entry (e.g. only "Compliance Officer" can access the `/compliance/review` dashboard; others receive a `403 Forbidden` view).
    *   [ ] Navigation items display dynamically based on the current user's role.

### FR-3: Silent Token Refresh
*   **Description**: Refresh access tokens silently prior to expiry.
*   **Acceptance Criteria**:
    *   [ ] Setup an interceptor or timer that triggers token refresh 1 minute prior to access token expiration.
    *   [ ] Silent refresh operations perform a background call without displaying visual loaders on active pages.
    *   [ ] If the background refresh fails (mock expired refresh token), automatically redirect the user to `/login` with an alert message: `"Session expired. Please log in again."`.

### FR-4: Session Idle Timeout
*   **Description**: Warn and log out inactive users.
*   **Acceptance Criteria**:
    *   [ ] Track user inactivity: monitor mouse moves, keypresses, and touch taps.
    *   [ ] After 14 minutes of inactivity, display an overlay modal countdown: `"Your session will expire in 60 seconds. [Keep Working] [Logout]"`.
    *   [ ] Clicking "Keep Working" resets the timer and runs silent token refresh.
    *   [ ] If the countdown reaches 0, clear in-memory tokens, wipe IndexedDB/LocalStorage cache data, and redirect to `/login`.

---

## 2. E2E Test Scenarios (Playwright Checklist)
*   [ ] Verify error displays on invalid login formats.
*   [ ] Verify entering valid MFA code triggers layout loading and route navigation.
*   [ ] Verify visiting restricted paths (e.g. `/admin`) with a non-admin role returns a `403` boundary page.
*   [ ] Verify the countdown warning displays after simulated inactivity timeout.
