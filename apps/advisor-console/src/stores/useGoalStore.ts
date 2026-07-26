import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Goal {
  id: string;
  name: string;
  target: number; // target amount
  current: number; // current amount saved/invested
}

interface GoalState {
  goals: Goal[];
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, updates: Partial<Omit<Goal, 'id'>>) => void;
  removeGoal: (id: string) => void;
}

export const useGoalStore = create<GoalState>()(
  devtools((set) => ({
    goals: [],
    addGoal: (goal) => set((state) => ({ goals: [...state.goals, goal] })),
    updateGoal: (id, updates) =>
      set((state) => ({
        goals: state.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
      })),
    removeGoal: (id) => set((state) => ({ goals: state.goals.filter((g) => g.id !== id) })),
  })),
);
