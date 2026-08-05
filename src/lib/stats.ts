import { differenceInDays, parseISO, subDays, startOfWeek } from 'date-fns';
import { AppState } from '../types';

export function getStats(state: AppState, todayStr: string) {
  if (!state.startDate) return null;

  const start = parseISO(state.startDate);
  const today = parseISO(todayStr);
  const currentDay = Math.max(1, differenceInDays(today, start) + 1);

  const enabledHabits = (state.userHabits || []).filter(habit => habit.enabled);
  const dailyTarget = enabledHabits.length;
  const getCompletedCount = (dateKey: string) => {
    const log = state.dailyLogs[dateKey];
    if (!log) return 0;

    if (dailyTarget > 0) {
      return enabledHabits.filter(habit => log.tasks[habit.id]).length;
    }

    return Object.values(log.tasks || {}).filter(Boolean).length;
  };
  const isPerfectDay = (dateKey: string) => dailyTarget > 0 && getCompletedCount(dateKey) >= dailyTarget;

  // Calculate clean days & streak
  let streak = 0;
  let totalCleanDays = 0;
  
  // Daily score for today
  const todayScore = getCompletedCount(todayStr);

  // Calculate perfect days completed in the current challenge window.
  for (let i = 0; i <= currentDay; i++) {
    const dStr = subDays(today, i).toISOString().split('T')[0];
    if (isPerfectDay(dStr)) {
      totalCleanDays++;
    }
  }

  // Current Streak
  for (let i = 0; i <= currentDay; i++) {
    const dStr = subDays(today, i).toISOString().split('T')[0];
    if (i === 0) {
      // Today
      if (isPerfectDay(dStr)) {
        streak++;
      }
    } else {
      if (isPerfectDay(dStr)) {
        streak++;
      } else {
        break; // Streak broken
      }
    }
  }

  
  // Weekly average
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday start
  let weekSum = 0;
  let weekDays = 0;
  for(let i=0; i<7; i++) {
      const dStr = subDays(today, i).toISOString().split('T')[0];
      const d = parseISO(dStr);
      if (d >= weekStart && d <= today) {
          weekSum += getCompletedCount(dStr);
          weekDays++;
      }
  }
  const weeklyAvg = weekDays > 0 ? (weekSum / weekDays).toFixed(1) : '0.0';

  return {
    currentDay,
    streak,
    totalCleanDays,
    todayScore,
    weeklyAvg
  };
}
