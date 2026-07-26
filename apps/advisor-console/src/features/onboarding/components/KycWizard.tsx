import React, { useEffect, useState } from 'react';
import { useKycWizardStore } from '../../../stores/useKycWizardStore';
import { useTranslation } from 'react-i18next';
import { getItem } from '../../../shared/offline/offline';
import { StepFinancial } from './StepFinancial.tsx';
import { StepRisk } from './StepRisk.tsx';
import { StepDocumentUpload } from './StepDocumentUpload.tsx';
import { RestoreModal } from './RestoreModal.tsx';
import styles from './KycWizard.module.css';
import OfflineBanner from './OfflineBanner';

export const KycWizard: React.FC = () => {
  const { step, setStep, persist, restore } = useKycWizardStore();
  const [showRestore, setShowRestore] = useState(false);

  const { t } = useTranslation();

  // On mount, check for saved state using offline storage
  useEffect(() => {
    (async () => {
      const raw = await getItem<string>('kycWizardState');
      if (raw) {
        setShowRestore(true);
      }
    })();
  }, []);

  const handleNext = () => {
    const nextStep = step + 1;
    setStep(nextStep);
    persist();
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = () => {
    alert(t('kyc_submit_success'));
    useKycWizardStore.getState().reset();
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <div>Identity step placeholder - implement later</div>;
      case 1:
        return <StepFinancial onNext={handleNext} onBack={handleBack} />;
      case 2:
        return <StepRisk onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <StepDocumentUpload onSubmit={handleSubmit} onBack={handleBack} />;
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className={styles.wizardContainer}>
      <OfflineBanner />
      {showRestore && (
        <RestoreModal
          onRestore={() => {
            restore();
            setShowRestore(false);
          }}
          onDiscard={() => {
            useKycWizardStore.getState().reset();
            setShowRestore(false);
          }}
          title={t('restore_prompt')}
          confirmLabel={t('restore')}
          cancelLabel={t('discard')}
        />
      )}
      {renderStep()}
    </div>
  );
};
