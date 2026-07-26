import React, { useState } from 'react';
import styles from './StepRisk.module.css';
import { useKycWizardStore } from '../../../stores/useKycWizardStore';

type Props = {
  onNext: () => void;
  onBack: () => void;
};

/**
 * StepRisk - collects risk tolerance information.
 */
export const StepRisk: React.FC<Props> = ({ onNext, onBack }) => {
  const updateData = useKycWizardStore((state) => state.updateData);
  const risk = useKycWizardStore((state) => state.data.risk);

  const [tolerance, setTolerance] = useState<string>(risk.tolerance ?? '');

  const handleNext = () => {
    updateData('risk', { tolerance });
    onNext();
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Risk Tolerance</h2>
      <div className={styles.field}>
        <label htmlFor="tolerance">Select your risk tolerance</label>
        <select
          id="tolerance"
          value={tolerance}
          onChange={(e) => setTolerance(e.target.value)}
        >
          <option value="">Select...</option>
          <option value="Conservative">Conservative</option>
          <option value="Balanced">Balanced</option>
          <option value="Aggressive">Aggressive</option>
        </select>
      </div>
      <div className={styles.actions}>
        <button type="button" onClick={onBack} className={styles.backButton}>Back</button>
        <button type="button" onClick={handleNext} className={styles.nextButton}>Next</button>
      </div>
    </div>
  );
};
