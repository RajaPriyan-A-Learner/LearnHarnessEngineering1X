---
name: "Book, Portfolio, and Holdings Grid Acceptance Criteria"
description: "Acceptance criteria and coding guidelines for Book of Business Search, Household Summaries, and Virtualized Holdings Grids."
---

# Book, Portfolio, & Grid Acceptance Criteria

Use these criteria to implement and test the Book of Business search, Household aggregation dashboards, and virtualized holdings grid components (FR-5 to FR-17).

---

## 1. Functional Requirements & Acceptance Criteria

### FR-5 to FR-7: Book of Business & Client Search
*   **Acceptance Criteria**:
    *   [ ] Search bar debounces user input by 200ms before querying endpoints.
    *   [ ] Supports search keywords matching client name, account number, or masked Tax ID.
    *   [ ] Keyboard interaction: pressing `Down Arrow` moves focus into result items, and `Enter` selects the highlighted item.
    *   [ ] Sidebar filters segment results by Mass Affluent ($100k-$1M), HNW ($1M-$10M), UHNW ($10M+), and review-due markers.

### FR-8 to FR-11: Household & Portfolio Overview
*   **Acceptance Criteria**:
    *   [ ] Display aggregate summaries for a household: total AUM, daily absolute/$ percentage drift, and unrealized gains.
    *   [ ] Multi-account selection: render checkbox toggles next to individual accounts. Checking/unchecking accounts triggers instant recalculation of AUM and holdings grid lines.
    *   [ ] Selection of "As-Of Date": changing the calendar date fetches historical holdings datasets and displays them with a banner: `"Viewing historical archive as of [Selected Date]"`.
    *   [ ] Render interactive asset-allocation wheels (Sector, Geography, Asset Class) with drill-down detail drawers.

### FR-12 to FR-17: Virtualized Holdings Grid
*   **Acceptance Criteria**:
    *   [ ] Virtualized scroll mapping: list must scroll smoothly at ~60fps without lag or blank flashes on grids populated with 10,000+ mock security lines.
    *   [ ] Sorting: click headers to sort multi-column arrangements; Alt-Click to append secondary sort guidelines.
    *   [ ] Pinning & Resizing: headers can be dragged to pin columns (left/right) or resize columns with persisted configurations saved to LocalStorage.
    *   [ ] Grouping: group rows by Asset Class (Equities, Fixed Income, Alternatives) showing collapsable node rows and subtotal values (e.g. Sub-total market value and weight).
    *   [ ] Action Links: export current grid data to CSV format directly from the user dashboard.

---

## 2. E2E Test Scenarios (Playwright Checklist)
*   [ ] Type search keys, verify request debounces, and check result count mapping.
*   [ ] Verify checking/unchecking a household account recalculates total asset class values on the dashboard.
*   [ ] Load a holdings grid with 10,000 records; scroll rapidly and verify layout does not crash and CPU usage is within normal levels.
*   [ ] Group by Asset Class and check that total sums of child rows match the subtotal headers.
