import React from 'react';
import { useOnlineStatus } from '../../../shared/offline/useOnlineStatus';
import { useTranslation } from 'react-i18next';
import styles from './OfflineBanner.module.css';

/**
 * Displays a banner when the application is offline.
 */
const OfflineBanner: React.FC = () => {
  const online = useOnlineStatus();
  const { t } = useTranslation();

  if (online) return null;

  return (
    <div className={styles.offlineBanner} role="alert">
      {t('offline_message')}
    </div>
  );
};

export default OfflineBanner;
