import { GoalItem } from '../types';

export interface GoalProgress {
  goal: GoalItem;
  currentValue: number | null;
  targetValue: number | null;
  percent: number;
  isComplete: boolean;
  unitLabel: string;
}

export function extractNumber(value: string | undefined): number | null {
  if (!value) return null;
  const match = value.replace(/,/g, '').match(/-?\d+(\.\d+)?/);
  if (!match) return null;
  const parsed = Number(match[0]);
  return Number.isFinite(parsed) ? parsed : null;
}

export function getGoalProgress(goal: GoalItem): GoalProgress {
  const currentValue = extractNumber(goal.current);
  const targetValue = extractNumber(goal.target);
  const unitLabel = goal.unit || goal.target.replace(/[\d$,.\s-]/g, '').trim();
  const percent = currentValue !== null && targetValue !== null && targetValue > 0
    ? Math.max(0, Math.min(100, Math.round((currentValue / targetValue) * 100)))
    : 0;

  return {
    goal,
    currentValue,
    targetValue,
    percent,
    isComplete: percent >= 100,
    unitLabel,
  };
}

export function getGoalProgressList(goals: GoalItem[] = []): GoalProgress[] {
  return goals.map(getGoalProgress);
}

export function getGoalMomentumScore(goals: GoalItem[] = []): number {
  if (!goals.length) return 0;
  const total = getGoalProgressList(goals).reduce((sum, item) => sum + item.percent, 0);
  return Math.round(total / goals.length);
}
