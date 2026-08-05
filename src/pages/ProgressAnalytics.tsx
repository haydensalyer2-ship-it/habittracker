import { useMemo, useState } from 'react';
import { useAppStore } from '../context/AppContext';
import { format, subDays, addDays } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, LineChart, Line, Legend } from 'recharts';
import { getStats } from '../lib/stats';
import { DEFAULT_HABITS } from '../lib/defaultHabits';
import { Target, Users, Dumbbell, MessageSquare, ShieldCheck, Zap, TrendingUp, Clock, Brain } from 'lucide-react';

function KpiCard({ title, value, icon: Icon, color, subtitle }: any) {
  return (
    <div className="bg-brand-card border border-brand-border rounded-xl p-3.5 flex flex-col justify-between relative overflow-hidden group hover:border-brand-muted/30 transition-colors shadow-lg">
      <div className={`absolute -right-4 -top-4 w-16 h-16 rounded-full blur-[20px] opacity-10 ${color.replace('text-', 'bg-')}`} />
      <div className="flex justify-between items-start mb-3 relative z-10">
        <span className="text-[10px] font-bold tracking-widest uppercase text-brand-muted leading-tight">{title}</span>
        <Icon className={`w-4 h-4 ${color} shrink-0`} />
      </div>
      <div className="relative z-10">
        <div className="text-2xl font-black text-white tracking-tighter">{value}</div>
        {subtitle && <div className="text-[9px] font-bold uppercase text-brand-muted tracking-widest mt-1">{subtitle}</div>}
      </div>
    </div>
  );
}

export default function ProgressAnalytics() {
  const { state } = useAppStore();
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const stats = getStats(state, todayStr);
  const currentDay = stats?.currentDay || 1;

  const habitsList = state.userHabits && state.userHabits.length > 0 ? state.userHabits : DEFAULT_HABITS;

  const { totalCleanDays, totalFocusMinutes, habitConsistencyData } = useMemo(() => {
    let totalCleanDays = 0;
    let totalFocusMinutes = 0;

    (state.focusSessions || []).forEach(s => {
      totalFocusMinutes += s.durationMinutes || 0;
    });

    const numLoggedDays = Object.keys(state.dailyLogs).length || 1;
    const habitCounts: Record<string, number> = {};

    Object.values(state.dailyLogs || {}).forEach((log: any) => {
      const activeIds = habitsList.filter(h => h.enabled).map(h => h.id);
      const isPerfect = activeIds.length > 0 && activeIds.every(id => log.tasks?.[id] === true);
      if (isPerfect) totalCleanDays++;

      Object.entries(log.tasks || {}).forEach(([taskId, val]) => {
        if (val) {
          habitCounts[taskId] = (habitCounts[taskId] || 0) + 1;
        }
      });
    });

    const habitsMap = new Map(habitsList.map(h => [h.id, h.label]));

    const habitConsistencyData = Object.entries(habitCounts).map(([id, count]) => ({
      name: habitsMap.get(id) || id,
      percent: Math.round((count / numLoggedDays) * 100)
    })).sort((a, b) => b.percent - a.percent);

    return { totalCleanDays, totalFocusMinutes, habitConsistencyData };
  }, [state.dailyLogs, state.focusSessions, habitsList]);

  const dailyScoreData = useMemo(() => {
    const data = [];
    for (let i = 29; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const log = state.dailyLogs[dateStr];
      const score = log ? Object.values(log.tasks || {}).filter(Boolean).length : 0;
      data.push({
        date: format(date, 'MMM d'),
        score
      });
    }
    return data;
  }, [state.dailyLogs]);

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto pt-6 pb-24">
      <div className="pb-2 border-b border-brand-border flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white">Analytics</h1>
          <p className="text-[10px] text-brand-muted font-bold tracking-widest uppercase">Performance & Habit Metrics</p>
        </div>
        <span className="text-[10px] text-brand-muted font-bold tracking-widest uppercase">30-Day Range</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <KpiCard 
          title="Current Streak" 
          value={`${stats?.streak || 0} Days`} 
          icon={Zap} 
          color="text-brand-green" 
          subtitle="Streak Velocity"
        />
        <KpiCard 
          title="Focus Time" 
          value={`${Math.round(totalFocusMinutes / 60)} Hrs`} 
          icon={Clock} 
          color="text-blue-400" 
          subtitle={`${totalFocusMinutes} Total Mins`}
        />
        <KpiCard 
          title="Perfect Days" 
          value={totalCleanDays} 
          icon={ShieldCheck} 
          color="text-yellow-400" 
          subtitle="100% Score Days"
        />
        <KpiCard 
          title="Daily Score Avg" 
          value={stats?.weeklyAvg || 0} 
          icon={Target} 
          color="text-purple-400" 
          subtitle="Weekly Average"
        />
      </div>

      {/* 30-Day Discipline Score Chart */}
      <div className="space-y-2">
        <h3 className="font-bold uppercase tracking-widest text-[10px] text-brand-muted">30-Day Discipline Velocity</h3>
        <div className="h-56 bg-black border border-brand-border rounded-xl p-4 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-brand-green/10 blur-[50px] pointer-events-none rounded-full" />
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyScoreData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.6}/>
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="date" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#71717a'}} tickMargin={8} minTickGap={20} />
              <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#71717a'}} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#000', border: '1px solid #27272a', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
                itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                cursor={{ stroke: '#27272a', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" activeDot={{ r: 6, fill: '#10b981', stroke: '#000', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Habit Consistency Bar Chart */}
      <div className="space-y-2">
        <h3 className="font-bold uppercase tracking-widest text-[10px] text-brand-muted">Habit Consistency (%)</h3>
        <div className="h-80 bg-brand-card border border-brand-border rounded-xl p-4 shadow-lg">
          {habitConsistencyData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-brand-muted font-bold uppercase">
              No habit log history yet. Complete daily check-ins!
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={habitConsistencyData} layout="vertical" margin={{ left: 20, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={true} vertical={false} />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="name" type="category" stroke="#a1a1aa" fontSize={10} tickLine={false} axisLine={false} width={80} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                  formatter={(val) => [`${val}%`, 'Consistency']}
                  cursor={{ fill: '#27272a', opacity: 0.4 }}
                />
                <Bar dataKey="percent" fill="#10b981" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
