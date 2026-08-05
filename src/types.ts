export type LegacyCheckInTask =
  | 'noWeed'
  | 'noNicotine'
  | 'noGambling'
  | 'gym'
  | 'protein'
  | 'revenueActivity'
  | 'recruiting'
  | 'journal'
  | 'steps';

export type HabitCategory = 'cleans' | 'mindset' | 'health' | 'hustle' | 'custom';

export interface Habit {
  id: string;
  label: string;
  category: HabitCategory;
  type: 'do' | 'avoid';
  xp: number;
  enabled: boolean;
  iconName?: string;
  isCustom?: boolean;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  tasks: Record<string, boolean>; // Habit ID -> completion boolean
  notes: {
    wins: string;
    triggers: string;
    fix: string;
  };
}

export interface FocusSession {
  id: string;
  date: string;
  durationMinutes: number;
  xpEarned: number;
  category: string;
  notes?: string;
}

export interface GoalItem {
  id: string;
  title: string;
  target: string;
  current: string;
  unit?: string;
  category: 'fitness' | 'finance' | 'business' | 'mindset' | 'skill';
}

export interface BusinessLog {
  date: string; // YYYY-MM-DD
  metrics: Record<string, number>;
}

export interface Goals {
  bodyweight: string;
  cashSaved: string;
  roofingRevenue: string;
  teamProduction: string;
  activeReps: string;
  rafterAiCustomer: string;
  investment: string;
  cleanDays: string;
}

export interface WeeklyReview {
  weekStart: string; // YYYY-MM-DD
  wins: string;
  problem: string;
  cause: string;
  fix: string;
  focus: string;
}

export interface AppState {
  startDate: string | null;
  challengeLength: number; // 30, 60, 90, 100 days
  userHabits: Habit[];
  dailyLogs: Record<string, DailyLog>;
  focusSessions: FocusSession[];
  customGoals: GoalItem[];
  businessLogs: Record<string, BusinessLog>;
  goals: Goals;
  weeklyReviews: Record<string, WeeklyReview>;
  totalXPBonus?: number;
}
