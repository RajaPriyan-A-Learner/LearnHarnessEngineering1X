import React, { useState } from 'react';
import { Goal, useGoalStore } from '../../../stores/useGoalStore';
import styles from './GoalDial.module.css';

interface GoalDialProps {
  goal: Goal;
}

export const GoalDial: React.FC<GoalDialProps> = ({ goal }) => {
  const [editing, setEditing] = useState(false);
  const [newTarget, setNewTarget] = useState(goal.target);
  const updateGoal = useGoalStore((state) => state.updateGoal);
  const percent = Math.min(100, (goal.current / goal.target) * 100);

  const handleSave = () => {
    updateGoal(goal.id, { target: Number(newTarget) });
    setEditing(false);
  };

  return (
    <div className={styles.dialContainer}>
      <svg viewBox="0 0 100 100" className={styles.dial}>
        <circle cx="50" cy="50" r="45" className={styles.bgCircle} />
        <circle
          cx="50"
          cy="50"
          r="45"
          className={styles.progressCircle}
          style={{ strokeDasharray: `${percent} 100` }}
        />
        <text x="50" y="55" textAnchor="middle" className={styles.percentage}>
          {Math.round(percent)}%
        </text>
      </svg>
      <div className={styles.label}>{goal.name}</div>
      {editing ? (
        <div className={styles.editBox}>
          <input
            type="number"
            value={newTarget}
            onChange={(e) => setNewTarget(Number(e.target.value))}
            className={styles.input}
          />
          <button onClick={handleSave} className={styles.saveBtn}>Save</button>
          <button onClick={() => setEditing(false)} className={styles.cancelBtn}>Cancel</button>
        </div>
      ) : (
        <button onClick={() => setEditing(true)} className={styles.editBtn}>Edit Target</button>
      )}
    </div>
  );
};
