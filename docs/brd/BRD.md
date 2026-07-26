Table of Contents

None selected
Skip to content Using Virtusa Corporation Mail with screen readers is:starred
1 of 30 Case Study Assignment Inbox
Maniveeraphani Gurram Attachments Wed, Jul 15, 5:25 PM (2 days ago) to me, Rajkumar, Sudarsan, Gurlinka
Hello Team,
Please find the attached case study and complete it at your earliest convenience.
Once you have completed the case study, you will be assigned one additional VeriKlick reassignment to complete.
If you have any questions or need any clarification regarding the learning materials, please feel free to reach out to Rajkumar Sivasubramania
Best Regards, Maniveeraphani Gurram
One attachment • Scanned by Gmail
1Capstone Project Business Case
1.1Wealth Management Advisor Console — Front-End Engineering Capstone
Field
Detail
Document Type
Capstone Project Business Case / Internal Engineering RFP
Program
Front-End Architecture & Engineering Excellence Capstone
Domain
Wealth Management / Financial Advisory (WealthTech)
Version
1.0
Classification
Internal — Learning & Development
Prepared For
Capstone Participants (Senior/Lead Front-End Engineers)
Prepared By
Office of the Chief Architect, Digital Wealth Platform
Review Cadence
Weekly milestone review + final architecture defense

1.21. Executive Summary
1.2.11.1 Business Background
Meridian Private Wealth (hereafter “the Firm”) is a mid-to-large wealth management institution serving approximately 42,000 households and managing roughly $88B in assets under management (AUM) across mass-affluent, high-net-worth (HNW), and ultra-high-net-worth (UHNW) segments. The Firm’s revenue is generated through advisory fees, managed-account programs, financial planning engagements, and custody arrangements with third-party custodians.
The Firm’s front-line producers — roughly 1,900 financial advisors (FAs) and relationship managers (RMs), supported by ~600 client service associates and a central investment/compliance operations team — depend daily on a patchwork of legacy desktop tools, spreadsheet-based models, a 12-year-old portfolio accounting system with a server-rendered web front end, and several vendor portals for market data, custody, and CRM. Advisors routinely operate 6–9 browser tabs and re-key data between systems to perform a single client review.
This fragmentation directly harms the two metrics the business cares about most: advisor productivity (time spent servicing versus prospecting) and client experience (speed and quality of advice delivery, proposal turnaround, and onboarding friction).
1.2.21.2 Current Challenges
Fragmented workflows. Preparing for a single client review meeting requires an advisor to pull holdings from the portfolio accounting system, live quotes from a market-data terminal, planning outputs from a separate planning tool, and account documents from a document management system — with manual reconciliation of positions and cost basis.
Stale and inconsistent data. Market values are typically batch-updated overnight. Advisors cannot see intraday drift, so rebalancing recommendations are often based on prior-day prices and require caveating in front of clients.
Slow proposal and report generation. Producing a compliant investment proposal or performance report is a multi-day, operations-assisted process. Turnaround is a recurring source of client dissatisfaction and lost prospects.
Compliance risk and audit gaps. Suitability checks, Reg BI (Regulation Best Interest) documentation, and concentration/restricted-security screening are performed inconsistently and often outside the system of record, creating audit exposure.
Onboarding friction. New-client onboarding and KYC/AML collection is paper- and email-heavy, with high rework rates and multi-week cycle times.
Poor accessibility and device support. Existing tools are desktop-only, are not accessible to advisors with disabilities, and cannot be used effectively during off-site client meetings on tablets.
1.2.31.3 Why This Application Is Needed
The Firm has approved a strategic initiative to build a unified Wealth Management Advisor Console (“the Console”) — a modern, single-pane-of-glass web application that consolidates portfolio management, real-time market data, analytics, rebalancing, proposal generation, compliance checks, goals tracking, and client onboarding into one cohesive, secure, high-performance experience.
The Console is explicitly a front-end-heavy, data-dense, real-time application. It must render large financial data grids and interactive charts, ingest streaming market data, orchestrate calls to multiple back-end and custodian APIs, and maintain sophisticated client-side state — all while meeting stringent security, accessibility, and performance bars appropriate for a regulated financial institution.
1.2.41.4 Expected Business Value
Value Driver
Baseline
Target Outcome
Advisor prep time per client review
~55 min
< 15 min
Proposal turnaround
2–4 business days
< 30 minutes (self-serve)
Client onboarding cycle time
3–5 weeks
< 5 business days
Rebalancing decisions on stale prices
Common
Eliminated (intraday data)
Compliance exceptions caught pre-trade
Post-hoc, sampled
Real-time, 100% screened
Advisor tools consolidated
6–9 tabs
1 console
The initiative is projected to return meaningful capacity back to the advisory force (equivalent to a multi-percentage-point uplift in servicing capacity), materially reduce compliance remediation cost, and improve prospect conversion through faster, higher-quality proposals.
1.2.51.5 Purpose of This Capstone
This capstone challenges participants to design and build the front-end of the Console to enterprise standards. Success is measured not by feature count alone but by architecture, engineering craftsmanship, performance, testability, and maintainability. The deliverable must be defensible in an architecture review and a code review, and must be demonstrably the participant’s own work (see Section 10, Constraints).

1.32. Business Problem
The Firm needs a moderately large, production-grade front-end application that unifies the advisor’s daily workflow. The problem is intentionally scoped to force real architectural decisions rather than a toy CRUD app.
Concretely, the application must simultaneously handle:
High data density. A single HNW household may hold 8–15 accounts, each with 30–400 positions across equities, fixed income, mutual funds, ETFs, options, alternatives, and cash. Advisors need to view and sort tens of thousands of rows across a book of 150–300 households without the UI degrading.
Real-time behavior. Quotes, position market values, portfolio-level P&L, and drift-from-target must update live as market-data ticks arrive, without full-grid re-renders or layout thrash.
Complex, interdependent client-side state. Selecting a household, toggling accounts, applying a “what-if” trade, and switching between “as-of” dates must consistently and instantly ripple through grids, charts, allocation wheels, and compliance panels.
Multiple back-end integrations. Portfolio, market data, custodian, CRM, planning, and document services are separate APIs with different auth, latencies, failure modes, and pagination semantics.
Regulated workflows. Every material action (proposal generation, trade order staging, KYC decision) must be auditable, suitability-checked, and access-controlled by role.
Multi-device, multi-role usage. Advisors on desktops in the office, on tablets in client meetings, and compliance officers and branch admins with entirely different views and permissions.
This combination — data density + real time + complex state + multi-integration + regulatory rigor + multi-device — is what makes the Console a credible test of front-end architecture rather than a form-heavy line-of-business app.

1.43. Business Objectives
BO-1 — Consolidate the advisor workflow into a single, coherent web application that eliminates tab-switching and manual re-keying.
BO-2 — Deliver real-time portfolio intelligence so advisors act on intraday, not overnight, data.
BO-3 — Accelerate proposal and reporting to near-instant self-service while enforcing compliance.
BO-4 — Reduce onboarding friction through a guided, digital KYC/AML workflow.
BO-5 — Embed compliance and auditability into the workflow rather than bolting it on afterward.
BO-6 — Meet enterprise non-functional bars for performance, accessibility (WCAG 2.1 AA), security, and reliability.
BO-7 — Establish a maintainable, scalable front-end platform whose architecture supports years of feature growth and multiple contributing teams.
BO-8 — Support multiple roles and devices with adaptive, role-aware experiences.

1.54. Functional Requirements
The following requirements are the functional scope for the capstone. Participants may mock back-end services (see Section 6, API Integration) but must implement the full front-end behavior.
1.5.14.1 Authentication, Authorization & Session
FR-1 The system shall authenticate advisors via a username/password + second-factor flow (mocked), issuing a short-lived access token and a refresh token.
FR-2 The system shall support role-based access control for at least: Advisor, Relationship Manager, Client Service Associate, Compliance Officer, and Branch Admin.
FR-3 The system shall silently refresh access tokens before expiry and gracefully redirect to re-authentication when the refresh token is invalid.
FR-4 The system shall enforce an idle-session timeout with a warning countdown and shall clear sensitive in-memory state on logout.
1.5.24.2 Book of Business & Client Search
FR-5 The system shall present the advisor’s book of business (households and accounts) with fast client-side and server-side search by name, account number, tax ID (masked), and segment.
FR-6 The system shall support type-ahead search with debouncing, keyboard navigation of results, and recent/favorite clients.
FR-7 The system shall allow filtering the book by segment (Mass Affluent/HNW/UHNW), advisor team, review-due status, and risk profile.
1.5.34.3 Household & Portfolio Overview
FR-8 The system shall display a household dashboard summarizing total AUM, day change, unrealized/realized gain-loss, asset allocation, and top holdings.
FR-9 The system shall aggregate multiple accounts into a household view and allow toggling individual accounts in/out of the aggregation.
FR-10 The system shall support “as-of date” selection to view historical portfolio states.
FR-11 The system shall render an interactive asset-allocation visualization (by asset class, sector, geography, and account) with drill-down.
1.5.44.4 Holdings Grid
FR-12 The system shall display a dense holdings grid with columns for symbol, description, quantity, price, market value, cost basis, unrealized gain-loss, weight, and asset class.
FR-13 The grid shall support virtualized rendering to handle thousands of rows smoothly.
FR-14 The grid shall support multi-column sorting, column reordering, resizing, pinning, and show/hide, with persisted user preferences.
FR-15 The grid shall support grouping (e.g., by asset class or account) with subtotal roll-ups.
FR-16 The grid shall highlight live price and market-value changes with subtle, accessible up/down indicators.
FR-17 The system shall support CSV/PDF export of the current grid view.
1.5.54.5 Real-Time Market Data
FR-18 The system shall subscribe to a streaming market-data feed (mocked via WebSocket/SSE) and update quotes, market values, and portfolio P&L in real time.
FR-19 The system shall throttle/coalesce high-frequency ticks to protect render performance.
FR-20 The system shall visibly indicate market-data connection status (live, delayed, disconnected) and degrade gracefully to last-known values.
1.5.64.6 Rebalancing & What-If Scenarios
FR-21 The system shall allow selection of a model portfolio / target allocation and compute drift between current and target allocations.
FR-22 The system shall generate proposed rebalancing trades to move the portfolio toward target within configurable tolerance bands.
FR-23 The system shall provide a “what-if” mode where the advisor stages hypothetical buys/sells and sees projected allocation, cash impact, estimated tax impact, and fee impact update live — without committing.
FR-24 The system shall support tax-aware rebalancing hints (e.g., flag short-term gains, wash-sale risk) as advisory signals.
FR-25 The system shall allow saving, naming, and comparing multiple scenarios side by side.
1.5.74.7 Compliance & Suitability
FR-26 The system shall screen staged trades and proposals against suitability rules, concentration limits, and restricted/watch lists, surfacing violations and warnings inline.
FR-27 The system shall require documented rationale (Reg BI-style) before a proposal containing flagged items can be finalized.
FR-28 The system shall provide a compliance officer view to review, approve, or reject flagged proposals with an audit trail.
1.5.84.8 Proposals & Reporting
FR-29 The system shall generate a client-ready investment proposal (allocation, rationale, projected outcomes, fees, disclosures) from the current or what-if state.
FR-30 The system shall generate performance and holdings reports for selectable periods, benchmarks, and account groupings.
FR-31 The system shall preview reports in-app and export to PDF with the Firm’s branding and required disclosures.
FR-32 The system shall maintain a history of generated proposals/reports with versioning and status.
1.5.94.9 Goals & Financial Planning
FR-33 The system shall allow creating and tracking client goals (retirement, education, major purchase) with target amount, horizon, and funding progress.
FR-34 The system shall visualize probability-of-success / on-track indicators for each goal (using pre-computed or mocked projection data).
FR-35 The system shall link accounts to goals and reflect goal funding changes when portfolios change.
1.5.104.10 Client Onboarding & KYC
FR-36 The system shall provide a multi-step, resumable onboarding wizard capturing personal, financial, suitability, and KYC/AML information.
FR-37 The system shall validate each step, support save-and-resume, and show progress; it shall block submission until required fields and documents are complete.
FR-38 The system shall support document upload with type/size validation and status tracking (pending, verified, rejected).
FR-39 The system shall run identity/risk screening (mocked) and surface results for review before account activation.
1.5.114.11 Cross-Cutting Advisor Tools
FR-40 The system shall provide a global notifications/alerts center (e.g., drift breaches, review-due, compliance actions, document expirations).
FR-41 The system shall provide an activity/audit timeline per household showing material actions and who performed them.
FR-42 The system shall provide user-configurable dashboards/widgets and persist layout per user.

1.65. Non-Functional Requirements
1.6.15.1 Performance
NFR-1 Largest Contentful Paint (LCP) < 2.5s on a mid-tier laptop over a simulated corporate network; Time to Interactive for the authenticated shell < 3.5s.
NFR-2 Interaction to Next Paint (INP) < 200ms for grid sort, filter, tab switch, and what-if updates.
NFR-3 The holdings grid shall maintain smooth (~60fps) scrolling with 10,000+ rows via virtualization.
NFR-4 Real-time updates shall not cause full-grid re-render; only changed cells/rows repaint.
1.6.25.2 Scalability
NFR-5 The architecture shall support growth to dozens of feature modules and multiple contributing teams without cross-feature coupling.
NFR-6 The state and data layers shall handle a book of 300 households and portfolios of 10,000+ aggregate positions without UX degradation.
NFR-7 Bundle strategy shall keep initial payload lean; feature growth shall not linearly grow the initial bundle (lazy loading required).
1.6.35.3 Maintainability
NFR-8 Code shall follow a documented, enforced style; modules shall be independently understandable and testable.
NFR-9 Shared logic and UI shall live in versioned shared packages, not be duplicated per feature.
NFR-10 Cyclomatic complexity and file size shall be kept within linted thresholds; dead code shall be removable via tree shaking.
1.6.45.4 Accessibility (WCAG 2.1 AA)
NFR-11 All interactive elements shall be fully keyboard operable, including the data grid, charts (with accessible alternatives), wizard, and dialogs.
NFR-12 Color shall never be the sole carrier of meaning (e.g., gains/losses also use icon/label); contrast ratios shall meet AA.
NFR-13 Components shall expose correct roles, names, states, and focus management; live regions shall announce real-time changes without overwhelming screen readers.
NFR-14 The application shall be usable at 200% zoom and with reduced-motion preferences honored.
1.6.55.5 Security
NFR-15 No sensitive data (tokens, tax IDs) shall be logged or persisted in insecure storage; tokens shall be handled per current best practice with appropriate storage and rotation.
NFR-16 The app shall be resilient to XSS (output encoding, safe templating), enforce a strict Content Security Policy posture, and avoid dangerous DOM injection.
NFR-17 Sensitive fields (SSN/tax ID, account numbers) shall be masked by default with explicit, audited reveal.
NFR-18 Role-based UI gating shall be enforced client-side and assume server-side enforcement; the client shall never trust its own gating alone.
1.6.65.6 Responsive Design
NFR-19 The application shall provide adaptive layouts for desktop, tablet, and mobile — not mere shrinking — with re-flowed navigation and prioritized content per breakpoint.
NFR-20 Touch targets, gestures, and off-canvas navigation shall be provided for tablet/mobile.
1.6.75.7 Cross-Browser Compatibility
NFR-21 The application shall support the current and prior major versions of Chrome, Edge, Firefox, and Safari.
1.6.85.8 Offline & Resilience Considerations
NFR-22 The application shall detect connectivity loss, communicate it clearly, and preserve in-progress work (e.g., onboarding wizard, what-if drafts) so it is not lost.
NFR-23 Read-only cached views (last-known portfolio snapshot) shall remain viewable during transient outages where feasible.
1.6.95.9 Error Handling
NFR-24 The application shall implement layered error boundaries so a failure in one feature does not crash the shell.
NFR-25 User-facing errors shall be actionable and non-technical; transient API errors shall be retried with backoff where safe.
1.6.105.10 Logging & Observability
NFR-26 The application shall emit structured, privacy-safe client logs and performance/telemetry hooks (mockable), with correlation identifiers for API calls.
NFR-27 Real-time connection health, error rates, and key web-vitals shall be observable via an internal debug/telemetry surface.
1.6.115.11 Internationalization Readiness
NFR-28 All user-facing strings shall be externalized; number, currency, date, and percentage formatting shall be locale-aware. Right-to-left layout readiness shall be considered in component design.
1.6.125.12 Configurability
NFR-29 Environment- and tenant-level configuration (API endpoints, feature toggles, branding/theme, tolerance defaults) shall be externalized and injectable at build and/or runtime without code changes.

1.76. Mandatory Technical Architecture Requirements
These requirements are the core of the capstone evaluation. Each sub-area below defines concrete expectations. Participants must be able to defend their choices in the architecture review.
1.7.16.1 Modular Architecture
Adopt a feature-based (domain-driven) modular structure: each business capability (Book, Portfolio, Holdings, Rebalancing, Compliance, Proposals, Goals, Onboarding, Admin) is a self-contained module with its own components, state, services, routes, and tests.
Maintain a shared component library and shared utilities (formatting, validation, financial calculations, API clients) consumed by features — no duplication.
Enforce separation of concerns: presentation, application/state, and data-access layers are distinct.
Organize folders by domain, not by file type at the top level; co-locate related code.
All feature modules shall be lazy-loaded and route-code-split; use dynamic imports for heavy, rarely-used surfaces (report/PDF preview, charts, scenario comparison).
UI components shall be reusable and composable, with clear public APIs and no hidden cross-feature dependencies.
1.7.26.2 Clean Code
Apply SOLID, DRY, and KISS; favor small, single-purpose units.
Follow Clean Architecture boundaries: domain/business logic must not depend on framework or UI details; dependencies point inward.
Target low coupling / high cohesion; feature modules communicate through well-defined contracts, not shared mutable internals.
Enforce consistent naming conventions, meaningful abstractions, and self-documenting code; add documentation (JSDoc/TSDoc and module READMEs) where intent is non-obvious.
Optimize for readability and maintainability over cleverness.
1.7.36.3 Performance Engineering
Meet Core Web Vitals targets (LCP, INP, CLS) as specified in NFRs.
Use code splitting, tree shaking, and bundle optimization; document bundle budgets and analyze the bundle.
Apply lazy loading for routes/modules/assets, image optimization, and virtual scrolling for large grids/lists.
Use memoization and render optimization to avoid needless re-renders; ensure efficient change detection (only changed cells update on ticks).
Implement API response caching, prefetching of likely-next data (e.g., prefetch household detail on hover), skeleton loading, and progressive loading of dense views.
1.7.46.4 State Management
The domain intentionally requires sophisticated state management. Participants must clearly separate and correctly manage: - Local/UI state (grid column config, dialog open state, wizard step). - Global/app state (authenticated user, role, active household, theme, feature flags). - Server/cache state (portfolios, holdings, quotes, proposals) with fetching, caching, invalidation, and background refresh. - Derived state (drift vs. target, aggregated allocation, what-if projections, goal on-track status) computed via selectors/memoized derivations — never stored redundantly. - Real-time synchronization: streaming ticks must merge into cache/state efficiently and consistently across all subscribed views. - Normalization of entities (households, accounts, positions, securities) to avoid duplication and update anomalies. - Persistence of user preferences and in-progress work (grid layout, dashboard layout, onboarding draft, what-if drafts), with clear rules for what is persisted and where. - A documented, explicit strategy for conflict/staleness (e.g., as-of date vs. live data) is expected.
1.7.56.5 Responsive UI
Provide genuinely adaptive layouts for desktop, tablet, and mobile: navigation, grid density, chart sizing, and information priority change per breakpoint.
Desktop favors multi-pane, information-dense layouts; tablet supports meeting/presentation use; mobile supports quick lookups and approvals.
1.7.66.6 Multi-Layout Architecture
Provide distinct, composable layouts: - Public layout (login, MFA, forgot-password, legal/disclosure pages). - Authenticated advisor layout (global nav, household context bar, notifications). - Dashboard layout (configurable widget canvas). - Admin layout (branch/compliance administration). - Error layout (404, 403, 500, offline). Navigation shall adapt to role and device.
1.7.76.7 Component Design
Use Atomic Design (or an equivalent, documented hierarchy: atoms → molecules → organisms → templates → pages).
Establish a design system with tokens (color, spacing, typography, elevation), theming, and a fully supported dark mode.
Components shall be accessibility-first and reusable, with documented props/variants and states (loading, empty, error, disabled).
1.7.86.8 Monorepo
Structure the solution as a monorepo with clearly separated packages: the application(s), a shared UI library, shared utilities, and shared configuration (lint, tsconfig, build).
Define a versioning strategy for shared packages and a dependency graph that prevents circular dependencies.
The specific monorepo tool is not prescribed; the participant must justify their choice and demonstrate correct package boundaries and build orchestration.
1.7.96.9 API Integration
All back-end calls go through an API abstraction layer (typed clients), never ad-hoc fetches in components.
Implement REST integration with authentication, token refresh, consistent error handling, retry with backoff, and request cancellation (e.g., on rapid household switching or search).
Provide mock APIs (mock server or in-app mocks) for portfolio, market data (WebSocket/SSE), custodian, CRM, planning, and documents, so the app runs end-to-end without real back ends.
Handle pagination, partial failures, and differing latencies across services gracefully.
1.7.106.10 Testing Requirements
Unit testing: components, utilities, services, and state logic. Minimum 80% line/branch coverage on business-critical modules (state, financial calculations, API layer, validation); overall coverage reported.
Integration testing: module-level integration (e.g., holdings grid + state + mocked API; onboarding wizard flow across steps).
End-to-end testing with Playwright covering critical journeys:
Authentication (login, MFA, token refresh, session timeout, logout).
Navigation across features and role-based gating.
Client search and household selection.
Holdings grid interactions (sort/filter/group/virtualization) and real-time update behavior.
What-if scenario and rebalancing flow.
Proposal generation and compliance flagging path.
Onboarding wizard (validation, save/resume, document upload).
Error scenarios (API failure, offline, 403).
Automated accessibility checks integrated into E2E (e.g., axe assertions on key screens).
1.7.116.11 CI/CD Readiness
The repo shall be CI-ready with linting, formatting checks, type checking, build validation, and automated test execution wired as pipeline stages.
Define quality gates: builds fail on lint/type errors, failing tests, or coverage below threshold. Bundle-budget checks are expected.
1.7.126.12 Coding Standards
ESLint and Prettier configured and enforced.
Strict TypeScript (strict mode on; no implicit any; typed API contracts and state).
A documented Git workflow (feature branches, PRs) using Conventional Commits.

1.87. Architecture Principles
Separation of concerns — presentation, application/state, and data layers are cleanly divided.
Single responsibility — every module, component, and function has one clear reason to change.
Composition over inheritance — build behavior by composing small pieces, not deep hierarchies.
Feature isolation — features are independently developable, testable, and lazy-loadable; no reaching into another feature’s internals.
Dependency inversion — high-level policy (domain logic) does not depend on low-level detail (frameworks, transports); both depend on abstractions.
Immutable state — state transitions are explicit and immutable; no hidden mutation.
Reusability — shared UI and logic live in shared packages with clear contracts.
Testability — code is designed to be tested; side effects are isolated and injectable.
Observability — the app is instrumented for logging, telemetry, and performance from day one.
Performance-first mindset — performance is a design input, not an afterthought.

1.98. Deliverables
#
Deliverable
Description
D-1
Source code
Complete monorepo, runnable end-to-end against mock APIs.
D-2
Architecture document
System overview, layer boundaries, key decisions, trade-offs.
D-3
Component diagram
Component hierarchy / design-system relationships.
D-4
Module diagram
Feature modules, shared packages, and dependencies.
D-5
State management diagram
Local/global/server/derived state and data flow, including real-time sync.
D-6
Folder structure
Documented, domain-driven organization with rationale.
D-7
Design decisions log
ADRs (Architecture Decision Records) for major choices.
D-8
Performance report
Bundle analysis, Core Web Vitals, virtualization/render notes.
D-9
Lighthouse report
Scores for performance, accessibility, best practices, SEO.
D-10
Test reports
Unit/integration coverage summary and results.
D-11
Playwright report
E2E run report covering the critical journeys and a11y checks.
D-12
README
Project overview, scripts, structure, conventions.
D-13
Installation guide
Prerequisites and step-by-step local setup.
D-14
Deployment guide
Build, environment/config, and deployment steps.

1.109. Evaluation Criteria
Scored out of 100 points. Presented to participants in advance to set expectations.
#
Category
Weight
What Is Assessed
1
Architecture
20
Modularity, feature isolation, monorepo/package boundaries, layering, clean architecture, scalability.
2
Code Quality
15
SOLID/DRY/KISS, readability, naming, strict TypeScript, low coupling/high cohesion, documentation.
3
Performance
12
Core Web Vitals, bundle/code-splitting, virtualization, render optimization, caching/prefetch.
4
Testing
12
Unit/integration coverage, quality of tests, Playwright E2E breadth and reliability.
5
State Management
10
Correct separation, normalization, derived state, real-time sync, persistence.
6
UI/UX
8
Design system, responsiveness/adaptive layouts, dark mode, interaction quality.
7
Accessibility
8
WCAG 2.1 AA conformance, keyboard/screen-reader support, automated + manual checks.
8
Documentation
6
Architecture doc, diagrams, ADRs, README, guides.
9
Engineering Practices
5
CI/CD readiness, linting/formatting, Git workflow, conventional commits, quality gates.
10
Presentation
4
Architecture defense, clarity of reasoning, code walkthrough.

Total
100


1.1110. Constraints
C-1 — No AI coding assistants or generative AI tools. The use of AI code-generation or generative-AI assistants (including but not limited to code-completion copilots, chat-based code generators, and AI debugging/test-generation tools) is strictly prohibited during design, development, debugging, testing, and code generation for this capstone. Participants must design, write, debug, and test all code independently to demonstrate their own skills.
C-2 — Originality validation. Evaluation includes code reviews and live architecture discussions to validate that the work is the participant’s own and that they understand every decision and line submitted. Inability to explain submitted code will materially affect scoring.
C-3 — Mock back ends only. No connection to real client data, real custodians, or real market-data vendors. All integrations use mock services with synthetic data. No real PII may be used.
C-4 — Approved technology envelope. Front-end framework and libraries must be modern, mainstream, and defensible; the monorepo tool is the participant’s choice but must be justified.
C-5 — Security & data handling. No real credentials, tokens, or secrets committed to the repo; synthetic data only; sensitive-field masking must be demonstrated.
C-6 — Timebox. All deliverables are due within the 8-week window (Section 11).
C-7 — Individual work. This is an individual capstone unless explicitly designated otherwise; collaboration is limited to instructor guidance.

1.1211. Suggested Timeline
An 8-week implementation roadmap. Weekly milestone reviews are expected.
Week
Milestone
Key Activities & Exit Criteria
1
Foundation & Architecture
Monorepo scaffolding, shared config (lint/Prettier/tsconfig strict), CI skeleton, design-system tokens, layouts, routing shell, ADRs for major decisions. Exit: app boots, lint/type/test pipeline green.
2
Design System & Shared Libraries
Atomic component library (atoms→organisms), theming + dark mode, shared utilities (formatting, financial calcs), API abstraction layer + mock server. Exit: reusable components documented and tested.
3
Auth, Shell & Book of Business
Login/MFA/token refresh/session timeout, role-based gating, global nav + household context, client search and book views. Exit: authenticated navigation and search working against mocks.
4
Holdings Grid & Real-Time Data
Virtualized holdings grid (sort/group/pin/persist), streaming market-data integration, efficient tick merge and cell-level updates. Exit: 10k-row grid smooth; live updates without full re-render.
5
Portfolio Analytics & Rebalancing
Household dashboard, allocation visualizations, drift vs. target, rebalancing engine, what-if scenarios with live projections. Exit: what-if mode updates allocation/cash/tax/fee impact live.
6
Compliance, Proposals & Reporting
Suitability/concentration/restricted screening, rationale capture, proposal generation, report preview + PDF export, compliance review view. Exit: flagged proposal path enforced end-to-end.
7
Goals, Onboarding/KYC & Hardening
Goals tracking, resumable onboarding wizard with document upload, error boundaries, offline/resilience, accessibility remediation, i18n externalization. Exit: WCAG 2.1 AA checks passing on key screens.
8
Testing, Performance & Presentation
Fill coverage gaps, Playwright E2E for critical journeys + a11y assertions, Lighthouse/bundle/performance tuning, finalize docs/diagrams/guides, architecture defense. Exit: all deliverables submitted; quality gates green.

1.1312. Stretch Goals
These are optional and rewarded as evidence of advanced engineering (they do not substitute for the core bar):
Micro Frontends / Module Federation — split the Console into independently deployable micro frontends (e.g., Onboarding, Compliance) with a host shell.
Offline support & PWA — installable app, service-worker caching of last-known portfolio snapshots, background sync for onboarding drafts.
Feature flags & runtime configuration — toggle features per role/branch/tenant and reconfigure endpoints/branding at runtime without redeploy.
Localization — full multi-locale support with locale-aware currency/number/date formatting and at least one additional language; RTL readiness.
Advanced real-time — presence, multi-tab state synchronization, and optimistic concurrency for staged orders.
Web Workers — offload heavy computations (portfolio aggregation, drift, projections, large CSV export) off the main thread.
Advanced caching — tiered cache with stale-while-revalidate, prefetch-on-hover, and intelligent invalidation on market events.
Telemetry dashboard — in-app observability surface for web-vitals, error rates, and market-data connection health.

End of Business Case. use-case-2-wealth-management-advisor-console.md Displaying use-case-2-wealth-management-advisor-console.md.