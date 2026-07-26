import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from './PublicLayout.module.css';

export const PublicLayout: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logoContainer}>
          <div className={styles.logoMark} />
          <h1 className={styles.logoText}>Meridian Private Wealth</h1>
        </div>
        <main className={styles.main}>
          <Outlet />
        </main>
        <footer className={styles.footer}>
          <p>© {new Date().getFullYear()} Meridian Private Wealth. All rights reserved.</p>
          <p className={styles.disclosure}>
            Internal Use Only. Access is monitored and governed by strict regulatory compliance requirements.
          </p>
        </footer>
      </div>
    </div>
  );
};
