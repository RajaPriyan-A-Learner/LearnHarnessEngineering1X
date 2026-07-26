import React, { useState } from 'react';
import styles from './StepFinancial.module.css';
import { useKycWizardStore } from '../../../stores/useKycWizardStore';

type Props = {
  onNext: () => void;
  onBack: () => void;
};

/**
 * StepFinancial – collects basic financial information.
 */
export const StepFinancial: React.FC<Props> = ({ onNext, onBack }) => {
  const updateData = useKycWizardStore(state => state.updateData);
  const financial = useKycWizardStore(state => state.data.financial);

  const [income, setIncome] = useState(financial.income);
  const [netWorth, setNetWorth] = useState(financial.netWorth);
  const [experience, setExperience] = useState(financial.experience);

  const handleNext = () => {
    updateData('financial', { income, netWorth, experience });
    onNext();
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Financial Information</h2>
      <div className={styles.field}>
        <label htmlFor="income">Annual Income ($)</label>
        <input
          id="income"
          type="number"
          value={income}
          onChange={e => setIncome(Number(e.target.value))}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="netWorth">Net Worth ($)</label>
        <input
          id="netWorth"
          type="number"
          value={netWorth}
          onChange={e => setNetWorth(Number(e.target.value))}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="experience">Investment Experience</label>
        <select
          id="experience"
          value={experience}
          onChange={e => setExperience(e.target.value)}
        >
          <option value="">Select…</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>
      <div className={styles.actions}>
        <button type="button" onClick={onBack} className={styles.backButton}>Back</button>
        <button type="button" onClick={handleNext} className={styles.nextButton}>Next</button>
      </div>
    </div>
  );
};
