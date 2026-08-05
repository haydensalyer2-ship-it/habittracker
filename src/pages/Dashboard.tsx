import { useState, useEffect } from 'react';
import { useAppStore } from '../context/AppContext';
import { format } from 'date-fns';
import { getStats } from '../lib/stats';
import { calculateGamification } from '../lib/gamification';
import { Target, Flame, Activity, CheckCircle, Bell, BellRing, Clock, ShieldCheck, Sparkles, Skull, Dumbbell, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import JourneyMap from '../components/JourneyMap';
import { requestNotificationPermission, showNotification } from '../lib/notifications';
import { cn } from '../lib/utils';

const QUOTES = [
  { text: 'Urges are not orders. They are waves. Hold position.', author: 'Lock In Protocol' },
  { text: 'Every checked box is a vote for the man you are becoming.', author: 'Identity Ledger' },
  { text: 'You do not need motivation. You need fewer exits.', author: 'Discipline Rule' },
  { text: 'Cheap dopamine steals tomorrow. Earned dopamine builds it.', author: 'Rewire Doctrine' },
  { text: 'If the day gets hard, make the next rep obvious.', author: 'No Zero Days' },
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

  const challengeLength = state.challengeLength || 90;
  const progress = Math.min((stats.currentDay / challengeLength) * 100, 100);
  const quote = QUOTES[stats.currentDay % QUOTES.length];
  const todaysLog = state.dailyLogs[todayStr];
  const lockedToday = !!todaysLog;
  const streakMultiplier = stats.streak >= 90 ? '3.0x' : stats.streak >= 60 ? '2.5x' : stats.streak >= 30 ? '2.0x' : stats.streak >= 14 ? '1.5x' : stats.streak >= 7 ? '1.25x' : stats.streak >= 3 ? '1.1x' : '1.0x';

  return (
    <div className="min-h-[100dvh] bg-[radial-gradient(circle_at_top,#102819_0%,#070707_45%,#020202_100%)] pb-24">
      <div className="max-w-md mx-auto p-4 pt-6 space-y-5">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] text-brand-green font-black uppercase tracking-[0.32em] mb-1">Lock In OS</p>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Command Center</h1>
            <p className="text-xs text-brand-muted font-bold uppercase tracking-widest">{format(new Date(), 'EEEE, MMM d')} · Day {stats.currentDay}</p>
          </div>
          <button
            onClick={handleEnableNotifications}
            className={cn('p-3 rounded-2xl border transition-all', notificationsEnabled ? 'bg-brand-green text-black border-brand-green' : 'bg-black/70 border-brand-border text-brand-muted hover:text-white')}
            title={notificationsEnabled ? 'Reminders active' : 'Enable reminders'}
          >
            {notificationsEnabled ? <BellRing className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
          </button>
        </div>

        <div className="rounded-[2rem] border border-brand-green/25 bg-black/80 p-5 relative overflow-hidden shadow-2xl shadow-brand-green/10">
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-brand-green/20 blur-3xl" />
          <div className="relative space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.28em] text-brand-green">Current rank</span>
                <div className="mt-1 flex items-center gap-2">
                  <div className={cn('w-12 h-12 rounded-2xl border-2 flex items-center justify-center font-black text-xl', gamification.rankBadgeColor, gamification.rankBorderColor)}>{gamification.level}</div>
                  <div>
                    <h2 className="text-xl font-black uppercase leading-none">{gamification.levelTitle}</h2>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">{gamification.totalXP.toLocaleString()} XP earned</p>
                  </div>
                </div>
              </div>
              <div className="rounded-full border border-brand-green/30 bg-brand-green/10 px-3 py-1 text-[10px] font-black text-brand-green">{streakMultiplier} BOOST</div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-brand-muted"><span>Level {gamification.level}</span><span>{gamification.xpInCurrentLevel}/{gamification.xpRequiredForNextLevel} XP</span></div>
              <div className="h-3 rounded-full border border-brand-border bg-black overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-brand-green via-lime-300 to-white transition-all duration-700" style={{ width: `${gamification.progressPercent}%` }} /></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[1.2fr_0.8fr] gap-3">
          <div className="rounded-[2rem] border border-brand-border bg-brand-card p-5 text-center relative overflow-hidden">
            <div className="absolute left-1/2 top-8 h-24 w-24 -translate-x-1/2 rounded-full bg-orange-500/20 blur-2xl" />
            <Flame className="relative mx-auto mb-2 h-14 w-14 text-orange-500 drop-shadow-[0_0_18px_rgba(249,115,22,0.45)]" />
            <div className="text-7xl font-black tracking-tighter leading-none">{stats.streak}</div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-brand-green">Day streak</p>
            <div className="mt-4 h-2 rounded-full bg-black border border-brand-border overflow-hidden"><div className="h-full bg-brand-green" style={{ width: `${progress}%` }} /></div>
          </div>
          <div className="space-y-3">
            <button onClick={() => navigate('/check-in')} className="w-full h-[calc(50%-0.375rem)] rounded-[1.5rem] bg-brand-green p-4 text-left text-black shadow-lg shadow-brand-green/10 active:scale-95 transition-all">
              <CheckCircle className="h-6 w-6 mb-2" />
              <span className="block text-lg font-black uppercase leading-none">Daily Log</span>
              <span className="text-[10px] font-black uppercase opacity-70">{lockedToday ? 'Update proof' : 'Earn XP now'}</span>
            </button>
            <button onClick={() => navigate('/focus')} className="w-full h-[calc(50%-0.375rem)] rounded-[1.5rem] border border-brand-green/40 bg-black p-4 text-left text-white active:scale-95 transition-all">
              <Clock className="h-6 w-6 mb-2 text-brand-green" />
              <span className="block text-lg font-black uppercase leading-none">Focus</span>
              <span className="text-[10px] font-black uppercase text-brand-green">Phone-free run</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[{ icon: Target, value: stats.todayScore, label: 'Score' }, { icon: Activity, value: stats.weeklyAvg, label: 'Week Avg' }, { icon: ShieldCheck, value: stats.totalCleanDays, label: 'Clean Days' }].map(({ icon: Icon, value, label }) => (
            <div key={label} className="rounded-2xl border border-brand-border bg-brand-card p-3 text-center">
              <Icon className="mx-auto mb-1 h-5 w-5 text-brand-green" />
              <div className="text-2xl font-black">{value}</div>
              <div className="text-[9px] font-black uppercase tracking-widest text-brand-muted">{label}</div>
            </div>
          ))}
        </div>

        <div className="rounded-[2rem] border border-brand-border bg-brand-card p-4 space-y-3">
          <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-white"><Skull className="h-4 w-4 text-red-400" /> Today’s enemy list</h3>
          <div className="grid grid-cols-2 gap-2 text-[10px] font-black uppercase tracking-wider">
            <span className="rounded-xl bg-red-500/10 border border-red-500/20 p-2 text-red-200">Porn / PMO</span>
            <span className="rounded-xl bg-red-500/10 border border-red-500/20 p-2 text-red-200">Doomscrolling</span>
            <span className="rounded-xl bg-red-500/10 border border-red-500/20 p-2 text-red-200">Weed / Nicotine</span>
            <span className="rounded-xl bg-red-500/10 border border-red-500/20 p-2 text-red-200">Gambling / Binge</span>
          </div>
        </div>

        <JourneyMap currentDay={stats.currentDay} />

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-brand-border bg-black p-4"><Dumbbell className="h-5 w-5 text-brand-green mb-2" /><p className="text-xs font-black uppercase tracking-widest">Body gets hard</p><p className="text-[10px] text-brand-muted font-bold mt-1">Train, sleep, steps, protein.</p></div>
          <div className="rounded-2xl border border-brand-border bg-black p-4"><Brain className="h-5 w-5 text-brand-green mb-2" /><p className="text-xs font-black uppercase tracking-widest">Mind gets quiet</p><p className="text-[10px] text-brand-muted font-bold mt-1">Journal, read, build skill.</p></div>
        </div>

        <div className="rounded-[2rem] border border-brand-green/25 bg-brand-green/10 p-5 relative overflow-hidden">
          <Sparkles className="absolute right-4 top-4 h-5 w-5 text-brand-green" />
          <p className="pr-6 text-lg font-black italic leading-snug text-white">“{quote.text}”</p>
          <p className="mt-3 text-[10px] font-black uppercase tracking-[0.28em] text-brand-green">— {quote.author}</p>
        </div>
      </div>
    </div>
  );
}
