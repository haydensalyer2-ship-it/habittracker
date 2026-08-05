import { AppState } from '../types';
import { getStats } from './stats';
import { calculateGamification } from './gamification';
import { 
  Flame, Crown, DollarSign, Users, Dumbbell, Shield, MessageSquare, 
  Target, Zap, Rocket, Trophy, Star, Medal, PhoneCall, ClipboardCheck, 
  FileCheck, Send, BookOpen, Beef, Footprints, ShieldAlert, Award,
  Sparkles, Brain, Clock, ShieldCheck, Sword, Compass, CheckCircle2
} from 'lucide-react';
import { format } from 'date-fns';

export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'diamond' | 'apex';

export interface Achievement {
  id: string;
  title: string;
  category: 'Discipline' | 'Level & XP' | 'Focus Time' | 'Habits' | 'Perfection';
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
  unlocked: boolean;
  tier: AchievementTier;
  progressText?: string;
  xpReward: number;
}

export function getAchievements(state: AppState): Achievement[] {
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const stats = getStats(state, todayStr);
  const gamification = calculateGamification(state);
  
  if (!stats) return [];

  const { streak, totalCleanDays, currentDay } = stats;
  const { totalXP, level } = gamification;

  // Calculate stats from logs
  let totalGymDays = 0;
  let totalJournalDays = 0;
  let totalProteinDays = 0;
  let totalStepsDays = 0;
  let totalHabitsCompleted = 0;
  let perfectDaysCount = 0;

  Object.values(state.dailyLogs || {}).forEach(log => {
    let dayCount = 0;
    let dayTotal = 0;

    Object.entries(log.tasks || {}).forEach(([taskId, done]) => {
      if (done) {
        dayCount++;
        totalHabitsCompleted++;
        if (taskId === 'gym') totalGymDays++;
        if (taskId === 'journal') totalJournalDays++;
        if (taskId === 'protein') totalProteinDays++;
        if (taskId === 'steps') totalStepsDays++;
      }
      dayTotal++;
    });

    if (dayCount > 0 && dayCount === dayTotal) {
      perfectDaysCount++;
    }
  });

  // Calculate total focus time
  let totalFocusMinutes = 0;
  (state.focusSessions || []).forEach(s => {
    totalFocusMinutes += s.durationMinutes || 0;
  });
  const totalFocusHours = Math.floor(totalFocusMinutes / 60);

  return [
    // --- DISCIPLINE & STREAKS ---
    {
      id: 'streak_3',
      title: 'Ignition',
      category: 'Discipline',
      description: 'Reach a 3-day streak of pure execution.',
      icon: Flame,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
      unlocked: streak >= 3,
      tier: 'bronze',
      progressText: `${Math.min(streak, 3)} / 3 Days`,
      xpReward: 100
    },
    {
      id: 'streak_7',
      title: '7-Day Clean Streak',
      category: 'Discipline',
      description: 'Maintain 7 consecutive days of discipline.',
      icon: Flame,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
      unlocked: streak >= 7,
      tier: 'bronze',
      progressText: `${Math.min(streak, 7)} / 7 Days`,
      xpReward: 250
    },
    {
      id: 'streak_14',
      title: 'Iron Fortitude',
      category: 'Discipline',
      description: 'Maintain 14 consecutive days of relentless execution.',
      icon: ShieldCheck,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      unlocked: streak >= 14,
      tier: 'silver',
      progressText: `${Math.min(streak, 14)} / 14 Days`,
      xpReward: 500
    },
    {
      id: 'streak_30',
      title: '30-Day Locked In',
      category: 'Discipline',
      description: 'Maintain a 30-day streak. Your new default is set.',
      icon: Zap,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      unlocked: streak >= 30,
      tier: 'gold',
      progressText: `${Math.min(streak, 30)} / 30 Days`,
      xpReward: 1000
    },
    {
      id: 'streak_60',
      title: '60-Day Titan',
      category: 'Discipline',
      description: '60 consecutive days of pure discipline.',
      icon: Trophy,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      unlocked: streak >= 60,
      tier: 'diamond',
      progressText: `${Math.min(streak, 60)} / 60 Days`,
      xpReward: 2500
    },
    {
      id: 'streak_90',
      title: '90-Day Greatness',
      category: 'Discipline',
      description: 'Complete the entire 90-day transformation.',
      icon: Crown,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
      borderColor: 'border-yellow-400/30',
      unlocked: totalCleanDays >= 90 || streak >= 90,
      tier: 'apex',
      progressText: `${Math.min(totalCleanDays, 90)} / 90 Days`,
      xpReward: 5000
    },

    // --- LEVEL & XP ---
    {
      id: 'level_5',
      title: 'Disciplined Status',
      category: 'Level & XP',
      description: 'Reach Player Level 5.',
      icon: Award,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20',
      unlocked: level >= 5,
      tier: 'bronze',
      progressText: `Lv ${level} / 5`,
      xpReward: 200
    },
    {
      id: 'level_10',
      title: 'Locked In Master',
      category: 'Level & XP',
      description: 'Reach Player Level 10.',
      icon: Star,
      color: 'text-brand-green',
      bgColor: 'bg-brand-green/10',
      borderColor: 'border-brand-green/20',
      unlocked: level >= 10,
      tier: 'silver',
      progressText: `Lv ${level} / 10`,
      xpReward: 500
    },
    {
      id: 'level_25',
      title: 'Unstoppable Legend',
      category: 'Level & XP',
      description: 'Reach Player Level 25.',
      icon: Sparkles,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      unlocked: level >= 25,
      tier: 'gold',
      progressText: `Lv ${level} / 25`,
      xpReward: 1500
    },
    {
      id: 'xp_10k',
      title: '10,000 XP Overlord',
      category: 'Level & XP',
      description: 'Earn 10,000 Total XP across habits and focus.',
      icon: Medal,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
      borderColor: 'border-yellow-400/30',
      unlocked: totalXP >= 10000,
      tier: 'diamond',
      progressText: `${Math.min(totalXP, 10000)} / 10,000 XP`,
      xpReward: 2000
    },

    // --- FOCUS & DEEP WORK ---
    {
      id: 'focus_first',
      title: 'Flow State Initiate',
      category: 'Focus Time',
      description: 'Complete your first Deep Work Focus Session.',
      icon: Clock,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      unlocked: totalFocusMinutes > 0,
      tier: 'bronze',
      progressText: `${totalFocusMinutes} Mins Completed`,
      xpReward: 150
    },
    {
      id: 'focus_10h',
      title: '10 Hours In The Trench',
      category: 'Focus Time',
      description: 'Accumulate 10 total hours of deep work focus time.',
      icon: Brain,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/20',
      unlocked: totalFocusHours >= 10,
      tier: 'silver',
      progressText: `${totalFocusHours} / 10 Hours`,
      xpReward: 500
    },
    {
      id: 'focus_50h',
      title: 'Monk Mode Master',
      category: 'Focus Time',
      description: 'Log 50+ hours of distraction-free focus sessions.',
      icon: Rocket,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      unlocked: totalFocusHours >= 50,
      tier: 'gold',
      progressText: `${totalFocusHours} / 50 Hours`,
      xpReward: 1500
    },

    // --- HABITS MASTERY ---
    {
      id: 'gym_14',
      title: 'Iron Base',
      category: 'Habits',
      description: 'Log 14 workout/gym sessions.',
      icon: Dumbbell,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
      unlocked: totalGymDays >= 14,
      tier: 'bronze',
      progressText: `${totalGymDays} / 14 Gym Days`,
      xpReward: 250
    },
    {
      id: 'gym_45',
      title: 'Iron Physique',
      category: 'Habits',
      description: 'Log 45 workout/gym sessions.',
      icon: Dumbbell,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
      borderColor: 'border-yellow-400/30',
      unlocked: totalGymDays >= 45,
      tier: 'gold',
      progressText: `${totalGymDays} / 45 Gym Days`,
      xpReward: 1000
    },
    {
      id: 'jrn_14',
      title: 'Self-Aware Scholar',
      category: 'Habits',
      description: 'Log 14 daily journaling or reading entries.',
      icon: BookOpen,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      unlocked: totalJournalDays >= 14,
      tier: 'bronze',
      progressText: `${totalJournalDays} / 14 Days`,
      xpReward: 250
    },
    {
      id: 'stp_14',
      title: 'Step Machine',
      category: 'Habits',
      description: 'Hit 10k steps for 14 days.',
      icon: Footprints,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      unlocked: totalStepsDays >= 14,
      tier: 'bronze',
      progressText: `${totalStepsDays} / 14 Days`,
      xpReward: 250
    },
    {
      id: 'habits_100',
      title: 'Century of Execution',
      category: 'Habits',
      description: 'Check off 100 total habit items.',
      icon: CheckCircle2,
      color: 'text-brand-green',
      bgColor: 'bg-brand-green/10',
      borderColor: 'border-brand-green/20',
      unlocked: totalHabitsCompleted >= 100,
      tier: 'silver',
      progressText: `${totalHabitsCompleted} / 100 Habits`,
      xpReward: 500
    },

    // --- PERFECTION ---
    {
      id: 'perfect_1',
      title: 'First Flawless Day',
      category: 'Perfection',
      description: 'Complete 100% of your daily habits in a single day.',
      icon: Shield,
      color: 'text-brand-green',
      bgColor: 'bg-brand-green/10',
      borderColor: 'border-brand-green/20',
      unlocked: perfectDaysCount >= 1,
      tier: 'bronze',
      progressText: `${perfectDaysCount} / 1 Perfect Day`,
      xpReward: 300
    },
    {
      id: 'perfect_7',
      title: 'Flawless Week',
      category: 'Perfection',
      description: 'Achieve 7 perfect 100% score days.',
      icon: Crown,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
      borderColor: 'border-yellow-400/30',
      unlocked: perfectDaysCount >= 7,
      tier: 'gold',
      progressText: `${perfectDaysCount} / 7 Perfect Days`,
      xpReward: 1000
    }
  ];
}
