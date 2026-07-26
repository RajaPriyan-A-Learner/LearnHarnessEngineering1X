import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  RefreshCw, 
  ShieldAlert, 
  UserPlus, 
  LogOut, 
  Menu, 
  X, 
  Briefcase,
  Target
} from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import { useAuthRefresh } from '../features/auth/hooks/useAuthRefresh';
import { useSessionTimeout } from '../features/auth/hooks/useSessionTimeout';
import { useHouseholdStore } from '../stores/useHouseholdStore';
import { ErrorLayout } from './ErrorLayout';
import { SearchField } from '@wma/shared-ui';
import styles from './AuthenticatedLayout.module.css';

// Market Data streaming
import { useWebSocket } from '../hooks/useWebSocket';
import { ConnectionStatusBadge } from '../features/portfolio/components/ConnectionStatusBadge';

const roleAccessMap: Record<string, string[]> = {
  '/dashboard': ['Advisor', 'Relationship Manager', 'Client Service Associate', 'Compliance Officer', 'Branch Admin'],
  '/book': ['Advisor', 'Relationship Manager', 'Client Service Associate', 'Branch Admin'],
  '/sandbox': ['Advisor', 'Relationship Manager'],
  '/compliance': ['Compliance Officer'],
  '/onboarding': ['Advisor', 'Relationship Manager', 'Client Service Associate'],
  '/admin': ['Branch Admin']
};

const isRouteAllowed = (role: string, pathname: string): boolean => {
  const match = Object.keys(roleAccessMap).find(route => pathname.startsWith(route));
  if (match) {
    return roleAccessMap[match].includes(role);
  }
  return true;
};

export const AuthenticatedLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, user, clearSession } = useAuthStore();
  const { activeHousehold, setActiveHousehold } = useHouseholdStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const { refreshSession } = useAuthRefresh();
  const { showWarning, countdown, keepWorking, logout } = useSessionTimeout(refreshSession);
  // Initialize market data WebSocket streaming
  useWebSocket();


  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['Advisor', 'Relationship Manager', 'Client Service Associate', 'Compliance Officer', 'Branch Admin'] },
    { name: 'Book of Business', path: '/book', icon: Users, roles: ['Advisor', 'Relationship Manager', 'Client Service Associate', 'Branch Admin'] },
    { name: 'Rebalancing Sandbox', path: '/sandbox', icon: RefreshCw, roles: ['Advisor', 'Relationship Manager'] },
    { name: 'Compliance Review', path: '/compliance', icon: ShieldAlert, roles: ['Compliance Officer'] },
    { name: 'KYC Onboarding', path: '/onboarding', icon: UserPlus, roles: ['Advisor', 'Relationship Manager', 'Client Service Associate'] },
    { name: 'Goals', path: '/goals', icon: Target, roles: ['Advisor', 'Relationship Manager', 'Client Service Associate'] },
    { name: 'Admin Console', path: '/admin', icon: Briefcase, roles: ['Branch Admin'] },
  ].filter(item => user && item.roles.includes(user.role));

  const isAllowed = user ? isRouteAllowed(user.role, location.pathname) : false;

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      {/* Sidebar Navigation */}
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : styles.collapsed}`}>
        <div className={styles.sidebarHeader}>
          <Briefcase className={styles.sidebarLogo} />
          {isSidebarOpen && <span className={styles.sidebarTitle}>MPW Console</span>}
          <button 
            className={styles.toggleBtn} 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            type="button"
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className={styles.nav}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`${styles.navLink} ${isActive ? styles.active : ''}`}
              >
                <Icon size={20} className={styles.navIcon} />
                {isSidebarOpen && <span className={styles.linkLabel}>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <button className={styles.logoutBtn} onClick={handleLogout} type="button">
            <LogOut size={20} className={styles.navIcon} />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <div className={styles.mainContainer}>
        {/* Pinned Context Header Bar */}
        <header className={styles.header}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            {activeHousehold ? (
              <div className={styles.headerContext}>
                <span className={styles.contextLabel}>Active Household:</span>
                <span className={styles.contextName}>{activeHousehold.name}</span>
                <span className={styles.contextId}>({activeHousehold.id})</span>
                <span className={styles.divider}>|</span>
                <span className={styles.contextValue}>
                  Value: $
                  {activeHousehold.totalValue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span className={`${styles.contextChange} ${activeHousehold.dayChangePercent >= 0 ? styles.positive : styles.negative}`}>
                  {activeHousehold.dayChangePercent >= 0 ? '+' : ''}
                  {(activeHousehold.dayChangePercent * 100).toFixed(2)}%
                </span>
                <span className={styles.badge}>{activeHousehold.riskProfile}</span>
              </div>
            ) : (
              <div className={styles.headerContext}>
                <span className={styles.contextLabel}>No Active Household Selected</span>
              </div>
            )}
            <SearchField onSelect={(item) => setActiveHousehold(item)} />
            <ConnectionStatusBadge />
          </div>
        </header>

        {/* Viewport content */}
        <main className={styles.content}>
          {isAllowed ? (
            <Outlet />
          ) : (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
              <ErrorLayout 
                title="403 Access Forbidden" 
                message="Your current session role does not have authorization to view this module." 
              />
            </div>
          )}
        </main>
      </div>

      {showWarning && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="timeout-title">
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 id="timeout-title" className={styles.modalTitle}>Session Expiration Warning</h2>
            </div>
            <div className={styles.modalBody}>
              <p>Your session will expire in <span className={styles.countdownValue}>{countdown}</span> seconds due to inactivity.</p>
              <div className={styles.progressBarContainer}>
                <div 
                  className={styles.progressBar} 
                  style={{ width: `${(countdown / 60) * 100}%` }}
                />
              </div>
            </div>
            <div className={styles.modalActions}>
              <button onClick={keepWorking} className={styles.primaryBtn} type="button">
                Keep Working
              </button>
              <button onClick={logout} className={styles.secondaryBtn} type="button">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
