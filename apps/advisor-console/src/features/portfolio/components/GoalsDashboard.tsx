import React from 'react';
import { useGoalStore, Goal } from '../../../stores/useGoalStore';
import { GoalDial } from './GoalDial';
import styles from './GoalsDashboard.module.css';

export const GoalsDashboard: React.FC = () => {
  const goals = useGoalStore((state) => state.goals);
  const addGoal = useGoalStore((state) => state.addGoal);

  const handleAddGoal = () => {
    const name = window.prompt('Enter goal name');
    if (!name) return;
    const targetStr = window.prompt('Enter target amount');
    const target = Number(targetStr);
    if (isNaN(target) || target <= 0) return;
    const newGoal: Goal = {
      id: crypto.randomUUID(),
      name,
      target,
      current: 0,
    };
    addGoal(newGoal);
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h2>Financial Goals</h2>
        <button className={styles.addBtn} onClick={handleAddGoal}>Add Goal</button>
      </div>
      <div className={styles.grid}>
        {goals.map((goal) => (
          <GoalDial key={goal.id} goal={goal} />
        ))}
      </div>
    </div>
  );
};
