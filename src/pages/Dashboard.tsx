import { useState, useEffect } from 'react';
import { useAppStore } from '../context/AppContext';
import { format } from 'date-fns';
import { getStats } from '../lib/stats';
import { calculateGamification } from '../lib/gamification';
import { Target, Flame, CheckCircle, Bell, BellRing, Clock, Sparkles, Trophy, BarChart2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { requestNotificationPermission, showNotification } from '../lib/notifications';
import { cn } from '../lib/utils';
import { getGoalProgressList, getGoalMomentumScore } from '../lib/goalProgress';
import { getAchievements } from '../lib/achievements';

const QUOTES = [
  { text: 'Small promises kept daily become an undeniable aura.', author: 'Daily Aura' },
  { text: 'Make the next step beautiful, obvious, and complete.', author: 'Quiet Momentum' },
  { text: 'Your future self is built in calm, repeatable rituals.', author: 'Identity Ledger' },
  { text: 'Protect your focus. Let everything else get quieter.', author: 'Focus Ritual' },
  { text: 'Progress feels lighter when the path is clean.', author: 'No Zero Days' },
];

export default function Dashboard() {
  const { state } = useAppStore();
  const navigate = useNavigate();
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const stats = getStats(state, todayStr);
  const gamification = calculateGamification(state);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      setNotificationsEnabled(true);
    }
  }, []);

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationsEnabled(granted);
    if (granted) showNotification();
  };

  if (!stats) return null;

  const todaysLog = state.dailyLogs[todayStr];
  const lockedToday = !!todaysLog;
  const quote = QUOTES[stats.currentDay % QUOTES.length];
  const enabledHabits = state.userHabits.filter(habit => habit.enabled);
  const completedToday = todaysLog ? enabledHabits.filter(habit => todaysLog.tasks[habit.id]).length : 0;
  const dailyTarget = Math.max(enabledHabits.length, 1);
  const completionPercent = Math.round((completedToday / dailyTarget) * 100);
  const goalProgress = getGoalProgressList(state.customGoals || []);
  const goalMomentum = getGoalMomentumScore(state.customGoals || []);
  const topGoal = goalProgress.slice().sort((a, b) => b.percent - a.percent)[0];
  const achievements = getAchievements(state);
  const unlockedAchievements = achievements.filter(achievement => achievement.unlocked);
  const nextAchievement = achievements.find(achievement => !achievement.unlocked);

  const quickActions = [
    { label: 'Focus', sublabel: 'Start ritual', to: '/focus', icon: Clock },
    { label: 'Goals', sublabel: topGoal ? `${topGoal.percent}% top goal` : 'Set intention', to: '/goals', icon: Target },
    { label: 'Intel', sublabel: `${stats.weeklyAvg} week avg`, to: '/analytics', icon: BarChart2 },
  ];

  return (
    <div className="min-h-[100dvh] pb-24">
      <div className="max-w-md mx-auto p-4 pt-8 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] text-brand-green font-black uppercase tracking-[0.32em] mb-2">Daily Aura</p>
            <h1 className="text-4xl font-black tracking-tighter text-white">Make today glow.</h1>
            <p className="mt-2 text-xs text-brand-muted font-bold uppercase tracking-widest">
              {format(new Date(), 'EEEE, MMM d')} · Day {stats.currentDay}
            </p>
          </div>
          <button
            onClick={handleEnableNotifications}
            className={cn('shrink-0 p-3 rounded-full border transition-all', notificationsEnabled ? 'bg-brand-green text-black border-brand-green' : 'bg-brand-card border-brand-border text-brand-muted hover:text-white')}
            title={notificationsEnabled ? 'Reminders active' : 'Enable reminders'}
          >
            {notificationsEnabled ? <BellRing className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
          </button>
        </div>

        <section className="relative overflow-hidden rounded-[2rem] border border-brand-green/30 bg-brand-card p-5 shadow-2xl shadow-brand-green/10">
          <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-brand-green/20 blur-3xl" />
          <div className="absolute -left-12 bottom-0 h-36 w-36 rounded-full bg-pink-400/10 blur-3xl" />
          <div className="relative space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.28em] text-brand-muted">Current aura</span>
                <div className="mt-2 flex items-center gap-3">
                  <div className={cn('w-14 h-14 rounded-2xl border-2 flex items-center justify-center font-black text-2xl', gamification.rankBadgeColor, gamification.rankBorderColor)}>{gamification.level}</div>
                  <div>
                    <h2 className="text-2xl font-black leading-none text-white">{gamification.levelTitle}</h2>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-brand-muted">{gamification.totalXP.toLocaleString()} XP earned</p>
                  </div>
                </div>
              </div>
              <Sparkles className="h-7 w-7 text-brand-green drop-shadow-[0_0_18px_rgba(167,139,250,0.6)]" />
            </div>

            <div className="grid grid-cols-[0.95fr_1.05fr] gap-3 items-stretch">
              <div className="rounded-[1.5rem] border border-brand-border bg-black/40 p-4 text-center">
                <Flame className="mx-auto mb-2 h-8 w-8 text-orange-300" />
                <div className="text-6xl font-black tracking-tighter leading-none">{stats.streak}</div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-brand-muted">day streak</p>
              </div>
              <div className="rounded-[1.5rem] border border-brand-border bg-black/40 p-4 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-brand-muted">Today</p>
                  <h3 className="mt-1 text-3xl font-black text-white">{completionPercent}%</h3>
                  <p className="text-xs font-bold text-brand-muted">{completedToday}/{dailyTarget} rituals complete</p>
                </div>
                <div className="mt-4 h-2.5 rounded-full border border-brand-border bg-black/50 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-brand-green to-pink-400 transition-all duration-700" style={{ width: `${completionPercent}%` }} />
                </div>
              </div>
            </div>

            <button onClick={() => navigate('/check-in')} className="w-full rounded-[1.5rem] bg-brand-green p-4 text-left text-black shadow-lg shadow-brand-green/10 active:scale-95 transition-all flex items-center justify-between gap-3">
              <span>
                <span className="block text-xl font-black leading-none">{lockedToday ? 'Refine today’s log' : 'Complete today’s log'}</span>
                <span className="mt-1 block text-[10px] font-black uppercase tracking-widest opacity-70">{lockedToday ? 'Keep the glow accurate' : 'Earn XP and protect the streak'}</span>
              </span>
              <CheckCircle className="h-7 w-7 shrink-0" />
            </button>
          </div>
        </section>

        <div className="grid grid-cols-3 gap-2">
          {quickActions.map(({ label, sublabel, to, icon: Icon }) => (
            <button key={label} onClick={() => navigate(to)} className="rounded-2xl border border-brand-border bg-brand-card p-3 text-left active:scale-95 transition-all">
              <Icon className="mb-3 h-5 w-5 text-brand-green" />
              <span className="block text-sm font-black text-white">{label}</span>
              <span className="mt-1 block text-[9px] font-black uppercase tracking-widest text-brand-muted">{sublabel}</span>
            </button>
          ))}
        </div>

        <section className="grid grid-cols-2 gap-3">
          <button onClick={() => navigate('/goals')} className="rounded-[1.5rem] border border-brand-border bg-brand-card p-4 text-left">
            <Target className="mb-3 h-5 w-5 text-brand-green" />
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-muted">Momentum</p>
            <p className="mt-1 text-3xl font-black text-white">{goalMomentum}%</p>
            <p className="mt-1 truncate text-xs font-bold text-brand-muted">{topGoal ? topGoal.goal.title : 'Add your first goal'}</p>
          </button>
          <button onClick={() => navigate('/achievements')} className="rounded-[1.5rem] border border-brand-border bg-brand-card p-4 text-left">
            <Trophy className="mb-3 h-5 w-5 text-yellow-300" />
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-muted">Milestones</p>
            <p className="mt-1 text-3xl font-black text-white">{unlockedAchievements.length}</p>
            <p className="mt-1 truncate text-xs font-bold text-brand-muted">{nextAchievement ? `Next: ${nextAchievement.title}` : 'All unlocked'}</p>
          </button>
        </section>

        <section className="rounded-[2rem] border border-brand-green/25 bg-brand-green/10 p-5 relative overflow-hidden">
          <Sparkles className="absolute right-4 top-4 h-5 w-5 text-brand-green" />
          <p className="pr-6 text-lg font-black italic leading-snug text-white">“{quote.text}”</p>
          <p className="mt-3 text-[10px] font-black uppercase tracking-[0.28em] text-brand-green">— {quote.author}</p>
        </section>

        <button onClick={() => navigate('/analytics')} className="w-full rounded-full border border-brand-border bg-brand-card px-4 py-3 text-xs font-black uppercase tracking-widest text-brand-muted flex items-center justify-center gap-2 hover:text-white">
          View deeper progress <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
