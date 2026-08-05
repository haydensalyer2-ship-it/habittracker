import { differenceInDays, parseISO, subDays, startOfWeek } from 'date-fns';
import { AppState } from '../types';

export function getStats(state: AppState, todayStr: string) {
  if (!state.startDate) return null;

  const start = parseISO(state.startDate);
  const today = parseISO(todayStr);
  const currentDay = Math.max(1, differenceInDays(today, start) + 1);

  // Calculate clean days & streak
  let streak = 0;
  let totalCleanDays = 0;
  
  // Daily score for today
  const todayLog = state.dailyLogs[todayStr];
  let todayScore = 0;
  if (todayLog) {
    todayScore = Object.values(todayLog.tasks).filter(Boolean).length;
  }

  // Calculate streak looking backwards
  for (let i = 0; i <= currentDay; i++) {
    const dStr = subDays(today, i).toISOString().split('T')[0];
    const log = state.dailyLogs[dStr];
    if (log) {
      const score = Object.values(log.tasks).filter(Boolean).length;
      if (score === 10) {
        totalCleanDays++;
      }
    }
  }

  // Current Streak
  for (let i = 0; i <= currentDay; i++) {
    const dStr = subDays(today, i).toISOString().split('T')[0];
    const log = state.dailyLogs[dStr];
    if (i === 0) {
      // Today
      if (log && Object.values(log.tasks).filter(Boolean).length === 10) {
        streak++;
      }
    } else {
      if (log && Object.values(log.tasks).filter(Boolean).length === 10) {
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
          const log = state.dailyLogs[dStr];
          if (log) {
            weekSum += Object.values(log.tasks).filter(Boolean).length;
          }
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
