import { AppState, Habit } from '../types';
import { DEFAULT_HABITS } from './defaultHabits';
import { getStats } from './stats';
import { format } from 'date-fns';

export interface LevelInfo {
  totalXP: number;
  level: number;
  levelTitle: string;
  rankBadgeColor: string;
  rankBorderColor: string;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  xpInCurrentLevel: number;
  xpRequiredForNextLevel: number;
  progressPercent: number;
}

// Calculate level threshold: Level N requires floor(180 * N^1.35) total XP
export function getXPForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.floor(180 * Math.pow(level, 1.35));
}

export function getRankTitle(level: number): { title: string; badgeColor: string; borderColor: string } {
  if (level >= 100) return { title: 'MYTHIC LOCK', badgeColor: 'bg-yellow-400 text-black', borderColor: 'border-yellow-400' };
  if (level >= 75) return { title: 'COMMANDER', badgeColor: 'bg-purple-500 text-white', borderColor: 'border-purple-500' };
  if (level >= 50) return { title: 'IRON MONK', badgeColor: 'bg-red-500 text-white', borderColor: 'border-red-500' };
  if (level >= 30) return { title: 'DOPAMINE DETOXED', badgeColor: 'bg-amber-500 text-black', borderColor: 'border-amber-500' };
  if (level >= 20) return { title: 'MISSION BUILDER', badgeColor: 'bg-emerald-400 text-black', borderColor: 'border-emerald-400' };
  if (level >= 15) return { title: 'STREAK ENFORCER', badgeColor: 'bg-blue-500 text-white', borderColor: 'border-blue-500' };
  if (level >= 10) return { title: 'LOCKED IN', badgeColor: 'bg-brand-green text-black', borderColor: 'border-brand-green' };
  if (level >= 5) return { title: 'REWIRED', badgeColor: 'bg-cyan-500 text-black', borderColor: 'border-cyan-500' };
  return { title: 'DAY ONE', badgeColor: 'bg-zinc-700 text-zinc-200', borderColor: 'border-zinc-600' };
}

export function getActiveHabits(state: AppState): Habit[] {
  if (state.userHabits && state.userHabits.length > 0) {
    return state.userHabits.filter(h => h.enabled);
  }
  return DEFAULT_HABITS.filter(h => h.enabled);
}

export function calculateGamification(state: AppState): LevelInfo {
  let totalXP = state.totalXPBonus || 0;
  const habits = getActiveHabits(state);
  const habitsMap = new Map<string, Habit>();
  
  // Combine custom habits and defaults
  const allHabits = [...DEFAULT_HABITS, ...(state.userHabits || [])];
  allHabits.forEach(h => habitsMap.set(h.id, h));

  // 1. Calculate XP from Daily Logs
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const stats = getStats(state, todayStr);
  const streak = stats ? stats.streak : 0;

  // Streak multiplier: 3d = 1.1x, 7d = 1.25x, 14d = 1.5x, 30d = 2x, 60d = 2.5x, 90d = 3x
  let multiplier = 1.0;
  if (streak >= 90) multiplier = 3.0;
  else if (streak >= 60) multiplier = 2.5;
  else if (streak >= 30) multiplier = 2.0;
  else if (streak >= 14) multiplier = 1.5;
  else if (streak >= 7) multiplier = 1.25;
  else if (streak >= 3) multiplier = 1.1;

  Object.values(state.dailyLogs || {}).forEach((log) => {
    let dayCompletedXP = 0;
    let completedCount = 0;
    let totalHabitsCount = 0;

    Object.entries(log.tasks || {}).forEach(([taskId, isChecked]) => {
      if (isChecked) {
        const habitDef = habitsMap.get(taskId);
        const taskXP = habitDef ? habitDef.xp : 50;
        dayCompletedXP += taskXP;
        completedCount++;
      }
      totalHabitsCount++;
    });

    // Apply streak multiplier to completed XP
    totalXP += Math.round(dayCompletedXP * multiplier);

    // Perfect Day bonus
    if (completedCount > 0 && completedCount === totalHabitsCount) {
      totalXP += 150; // +150 bonus for 100% daily score
    }

    // Daily reflection journal bonus
    if (log.notes?.wins || log.notes?.triggers || log.notes?.fix) {
      totalXP += 30;
    }
  });

  // 2. XP from Focus Sessions (Deep Work)
  (state.focusSessions || []).forEach((session) => {
    totalXP += session.xpEarned || Math.round(session.durationMinutes * 2);
  });

  // 3. Determine Level
  let level = 1;
  while (getXPForLevel(level + 1) <= totalXP) {
    level++;
  }

  const xpForCurrentLevel = getXPForLevel(level);
  const xpForNextLevel = getXPForLevel(level + 1);
  const xpInCurrentLevel = totalXP - xpForCurrentLevel;
  const xpRequiredForNextLevel = xpForNextLevel - xpForCurrentLevel;
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / xpRequiredForNextLevel) * 100)));

  const rank = getRankTitle(level);

  return {
    totalXP,
    level,
    levelTitle: rank.title,
    rankBadgeColor: rank.badgeColor,
    rankBorderColor: rank.borderColor,
    xpForCurrentLevel,
    xpForNextLevel,
    xpInCurrentLevel,
    xpRequiredForNextLevel,
    progressPercent: isNaN(progressPercent) ? 0 : progressPercent
  };
}

// Audio Feedback helper for checking habits & level ups
export function playLevelSound(type: 'check' | 'uncheck' | 'levelup' | 'focusComplete') {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === 'check') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } else if (type === 'levelup') {
      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5 chord
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.08 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.4);
      });
    } else if (type === 'focusComplete') {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.1 + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 0.5);
      });
    }
  } catch (e) {
    // Ignore audio context autoplay errors
  }
}
