import React from 'react';
import { useMarketDataStore } from '../../../stores/useMarketDataStore';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import styles from './ConnectionStatusBadge.module.css';

export const ConnectionStatusBadge: React.FC = () => {
  const { connectionStatus } = useMarketDataStore();

  const config = {
    live: { label: 'Live', icon: ShieldCheck, className: styles.live },
    delayed: { label: 'Delayed', icon: Shield, className: styles.delayed },
    offline: { label: 'Offline', icon: ShieldAlert, className: styles.offline }
  }[connectionStatus] || { label: 'Offline', icon: ShieldAlert, className: styles.offline };

  const Icon = config.icon;

  return (
    <div className={`${styles.badge} ${config.className}`} data-testid="status-badge">
      <Icon size={14} className={styles.icon} />
      <span>Ticker Feed: {config.label}</span>
    </div>
  );
};
