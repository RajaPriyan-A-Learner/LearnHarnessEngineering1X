import React, { useState } from 'react';
import styles from './StepIdentity.module.css';
import { useKycWizardStore } from '../../../stores/useKycWizardStore';

type Props = {
  /** Callback to move to the next step */
  onNext: () => void;
};

/**
 * Real UI for the Identity step.
 * Collects full name, date of birth and SSN, then persists to the store.
 */
export const StepIdentity: React.FC<Props> = ({ onNext }) => {
  const updateData = useKycWizardStore(state => state.updateData);
  const identity = useKycWizardStore(state => state.data.identity);

  const [fullName, setFullName] = useState(identity.fullName);
  const [dob, setDob] = useState(identity.dob);
  const [ssn, setSsn] = useState(identity.ssn);

  const handleNext = () => {
    updateData('identity', { fullName, dob, ssn });
    onNext();
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Identity Verification</h2>
      <div className={styles.field}>
        <label htmlFor="fullName">Full Name</label>
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="dob">Date of Birth</label>
        <input id="dob" type="date" value={dob} onChange={e => setDob(e.target.value)} />
      </div>
      <div className={styles.field}>
        <label htmlFor="ssn">SSN</label>
        <input
          id="ssn"
          type="text"
          placeholder="123-45-6789"
          value={ssn}
          onChange={e => setSsn(e.target.value)}
        />
      </div>
      <div className={styles.actions}>
        <button type="button" onClick={handleNext} className={styles.nextButton}>
          Next
        </button>
      </div>
    </div>
  );
};
