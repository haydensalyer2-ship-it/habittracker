import { useState, useEffect } from 'react';
import { useAppStore } from '../context/AppContext';
import { format } from 'date-fns';
import { getStats } from '../lib/stats';
import { calculateGamification } from '../lib/gamification';
import { Target, Flame, Activity, TrendingUp, CheckCircle, Bell, BellRing, Zap, Clock, ShieldCheck, Award, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import JourneyMap from '../components/JourneyMap';
import { requestNotificationPermission, showNotification } from '../lib/notifications';
import { cn } from '../lib/utils';

const QUOTES = [
  { text: "There's no talent here, this is hard work. This is an obsession.", author: "Conor McGregor" },
  { text: "We're not here to take part, we're here to take over.", author: "Conor McGregor" },
  { text: "I visualized the exact outcome I wanted, and I worked backwards from there.", author: "Sean O'Malley" },
  { text: "What you think, you create. What you feel, you attract. What you imagine, you become.", author: "Law of Attraction" },
  { text: "I am cocky in prediction. I am confident in preparation.", author: "Conor McGregor" },
  { text: "I knew I was going to be the world champion. I saw it, I visualized it, I put the work in.", author: "Sean O'Malley" },
  { text: "Ask, believe, receive. The universe responds to your frequency.", author: "Law of Attraction" },
  { text: "I don't just see the win, I see exactly how it happens.", author: "Sean O'Malley" },
  { text: "Doubt is only removed by action. If you're not working then that's where doubt comes in.", author: "Conor McGregor" },
  { text: "Thoughts become things. If you see it in your mind, you will hold it in your hand.", author: "Bob Proctor" }
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
    if (granted) {
      showNotification();
    }
  };
  
  const quoteIndex = stats ? (stats.currentDay % QUOTES.length) : 0;
  const quote = QUOTES[quoteIndex];

  if (!stats) return null;

  const challengeLength = state.challengeLength || 90;
  const progress = Math.min((stats.currentDay / challengeLength) * 100, 100);

  // Streak multiplier display
  let streakMultiplier = '1.0x';
  if (stats.streak >= 90) streakMultiplier = '3.0x';
  else if (stats.streak >= 60) streakMultiplier = '2.5x';
  else if (stats.streak >= 30) streakMultiplier = '2.0x';
  else if (stats.streak >= 14) streakMultiplier = '1.5x';
  else if (stats.streak >= 7) streakMultiplier = '1.25x';
  else if (stats.streak >= 3) streakMultiplier = '1.1x';

  return (
    <div className="p-4 space-y-5 max-w-md mx-auto pt-6 pb-24">
      {/* Header with Title & Notification */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[10px] text-brand-green font-black uppercase tracking-widest mb-0.5">
            {challengeLength}-Day Lock In Challenge
          </p>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white">Dashboard</h1>
          <p className="text-xs text-brand-muted font-bold uppercase tracking-widest">{format(new Date(), 'EEEE, MMM d')}</p>
        </div>
        <button 
          onClick={handleEnableNotifications}
          className={cn(
            "p-2.5 rounded-full border transition-all",
            notificationsEnabled
              ? "bg-brand-green/10 border-brand-green text-brand-green"
              : "bg-black border-brand-border text-brand-muted hover:text-white"
          )}
          title={notificationsEnabled ? "Notifications active" : "Enable reminders"}
        >
          {notificationsEnabled ? <BellRing className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
        </button>
      </div>

      {/* Level & XP Player Banner */}
      <div className="bg-brand-card border border-brand-border rounded-xl p-4 space-y-3 relative overflow-hidden">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-11 h-11 rounded-lg border-2 flex items-center justify-center font-black text-lg shadow-lg shrink-0",
              gamification.rankBadgeColor,
              gamification.rankBorderColor
            )}>
              {gamification.level}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black uppercase tracking-wider text-white">
                  {gamification.levelTitle}
                </span>
                <Sparkles className="w-3.5 h-3.5 text-brand-green" />
              </div>
              <span className="text-[10px] text-brand-muted font-bold uppercase tracking-widest block">
                {gamification.totalXP.toLocaleString()} TOTAL XP
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-brand-green font-extrabold uppercase tracking-widest bg-brand-green/10 px-2 py-1 rounded border border-brand-green/20">
              {streakMultiplier} XP BOOST
            </span>
          </div>
        </div>

        {/* Level Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[9px] font-extrabold text-brand-muted uppercase tracking-widest">
            <span>Level {gamification.level}</span>
            <span>{gamification.xpInCurrentLevel} / {gamification.xpRequiredForNextLevel} XP</span>
            <span>Level {gamification.level + 1}</span>
          </div>
          <div className="w-full h-2 bg-black rounded-full overflow-hidden border border-brand-border/50">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-brand-green transition-all duration-700 rounded-full"
              style={{ width: `${gamification.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Streak Card */}
      <div className="bg-brand-card border border-brand-border rounded-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-brand-border">
          <div 
            className="h-full bg-brand-green transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="p-7 text-center flex flex-col items-center justify-center">
          <div className="relative mb-2">
            <div className="absolute inset-0 bg-orange-500 blur-[25px] opacity-25 rounded-full" />
            <Flame className="w-16 h-16 text-orange-500 relative z-10 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)] animate-pulse" strokeWidth={1.5} />
          </div>
          <h2 className="text-7xl font-black text-white leading-none tracking-tighter mb-1">{stats.streak}</h2>
          <span className="text-xs text-brand-green font-bold uppercase tracking-widest">Day Streak</span>
        </div>
        <div className="bg-black/40 p-3 text-center border-t border-brand-border flex justify-between items-center px-4">
          <span className="text-brand-muted text-[10px] font-bold tracking-widest uppercase">
            Day {stats.currentDay} of {challengeLength}
          </span>
          <span className="text-brand-green text-[10px] font-bold tracking-widest uppercase">
            No Zero Days
          </span>
        </div>
      </div>

      <JourneyMap currentDay={stats.currentDay} />

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-brand-card border border-brand-border rounded-lg p-3.5 flex flex-col items-center justify-center text-center">
          <Target className="w-5 h-5 text-brand-green mb-1.5" />
          <span className="text-2xl font-black text-white">{stats.todayScore}</span>
          <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Today Score</span>
        </div>

        <div className="bg-brand-card border border-brand-border rounded-lg p-3.5 flex flex-col items-center justify-center text-center">
          <Activity className="w-5 h-5 text-blue-400 mb-1.5" />
          <span className="text-2xl font-black text-white">{stats.weeklyAvg}</span>
          <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Weekly Avg</span>
        </div>

        <div className="bg-brand-card border border-brand-border rounded-lg p-3.5 flex flex-col items-center justify-center text-center">
          <CheckCircle className="w-5 h-5 text-purple-400 mb-1.5" />
          <span className="text-2xl font-black text-white">{stats.totalCleanDays}</span>
          <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">Clean Days</span>
        </div>

        <div 
          onClick={() => navigate('/focus')}
          className="bg-brand-card border border-brand-green/50 hover:border-brand-green rounded-lg p-3.5 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group"
        >
          <Clock className="w-5 h-5 text-brand-green mb-1.5 group-hover:scale-110 transition-transform" />
          <span className="text-lg font-black uppercase text-white tracking-tight">Lock In</span>
          <span className="text-[10px] text-brand-green font-bold uppercase tracking-wider">Focus Mode</span>
        </div>
      </div>

      {/* Action Banner: Check-In */}
      <div 
        onClick={() => navigate('/check-in')}
        className="bg-brand-green text-black rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-green-400 transition-all active:scale-95 shadow-lg shadow-brand-green/10"
      >
        <div className="flex flex-col">
          <span className="text-xs font-black uppercase tracking-widest opacity-80">Daily Protocol</span>
          <span className="text-xl font-black uppercase tracking-tight">Execute Daily Check-In</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-black text-brand-green flex items-center justify-center font-black">
          <TrendingUp className="w-5 h-5" />
        </div>
      </div>

      {/* Quote Banner */}
      <div className="bg-brand-card border border-brand-border rounded-xl p-5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-green" />
        <div className="pl-2">
          <p className="text-base font-bold italic text-white mb-2 leading-snug">"{quote.text}"</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-brand-green">— {quote.author}</p>
        </div>
      </div>
    </div>
  );
}
