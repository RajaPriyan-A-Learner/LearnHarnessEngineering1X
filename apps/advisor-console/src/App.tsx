import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from './layouts/PublicLayout';
import { AuthenticatedLayout } from './layouts/AuthenticatedLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { ErrorLayout } from './layouts/ErrorLayout';

import { LoginPage } from './features/auth/pages/LoginPage';
import { BookPage } from './features/book/pages/BookPage';
import { GoalsDashboard } from './features/portfolio/components/GoalsDashboard';
import { DashboardPage } from './features/portfolio/pages/DashboardPage';
import { KycWizard } from './features/onboarding/components/KycWizard';

const SandboxPage = () => (
  <div>
    <h2>Staging & Rebalancing sandbox</h2>
    <p style={{ color: 'var(--color-text-secondary)' }}>Stage buy/sell transactions, project asset allocation drift, and evaluate tax consequences.</p>
  </div>
);

const CompliancePage = () => (
  <div>
    <h2>Suitability & Compliance Review Gating</h2>
    <p style={{ color: 'var(--color-text-secondary)' }}>Review restricted items validations, portfolio concentration alarms, and justification rationales.</p>
  </div>
);

const AdminCompliancePage = () => (
  <div>
    <h3>Pending Proposal Approvals</h3>
    <p style={{ color: 'var(--color-text-secondary)' }}>Review queue of manual exception requests requiring Compliance Officer override auth.</p>
  </div>
);

const AdminAuditPage = () => (
  <div>
    <h3>System Audit Logs</h3>
    <p style={{ color: 'var(--color-text-secondary)' }}>Read chronological history logs of sensitive actions and user context events.</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect Root path to Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Routes wrapper */}
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Authenticated Routes wrapper */}
        <Route element={<AuthenticatedLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/book" element={<BookPage />} />
          <Route path="/sandbox" element={<SandboxPage />} />
          <Route path="/compliance" element={<CompliancePage />} />
          <Route path="/onboarding" element={<KycWizard />} />
          <Route path="/goals" element={<GoalsDashboard />} />

          {/* Nested Admin Console Layout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/compliance" replace />} />
            <Route path="compliance" element={<AdminCompliancePage />} />
            <Route path="audit" element={<AdminAuditPage />} />
          </Route>
        </Route>

        {/* Fallback Catch-all Error page */}
        <Route path="*" element={
          <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg-app)' }}>
            <ErrorLayout title="404 Page Not Found" message="The requested dashboard path could not be located in this session." onRetry={() => window.location.href = '/dashboard'} />
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
