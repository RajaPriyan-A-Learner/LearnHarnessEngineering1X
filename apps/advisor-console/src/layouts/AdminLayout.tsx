import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import styles from './AdminLayout.module.css';

export const AdminLayout: React.FC = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>Branch Operations & Compliance Administration</h2>
        <nav className={styles.nav}>
          <Link to="/admin/compliance" className={styles.link}>System Approvals</Link>
          <Link to="/admin/audit" className={styles.link}>Global Audit Trails</Link>
        </nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};
