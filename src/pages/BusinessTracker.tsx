import { useState } from 'react';
import { useAppStore } from '../context/AppContext';
import { format, subDays, addDays, startOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react';
import { cn } from '../lib/utils';
import { BusinessLog } from '../types';

const METRICS: { key: keyof BusinessLog['metrics']; label: string }[] = [
  { key: 'homeownerConv', label: 'Homeowner Convs' },
  { key: 'followUps', label: 'Follow-ups' },
  { key: 'inspections', label: 'Inspections' },
  { key: 'claims', label: 'Claims Filed' },
  { key: 'contracts', label: 'Contracts Signed' },
  { key: 'recruitingMsg', label: 'Recruiting Msgs' },
  { key: 'newReps', label: 'New Reps Added' },
];

export default function BusinessTracker() {
  const { state, updateBusinessLog } = useAppStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const dateStr = format(currentDate, 'yyyy-MM-dd');
  const log = state.businessLogs[dateStr] || {
    metrics: Object.fromEntries(METRICS.map(m => [m.key, 0])) as Record<string, number>
  };

  const updateMetric = (key: keyof BusinessLog['metrics'], change: number) => {
    const current = log.metrics[key] || 0;
    const newVal = Math.max(0, current + change);
    updateBusinessLog(dateStr, {
      metrics: { ...log.metrics, [key]: newVal }
    });
  };

  // Calculate Weekly Totals
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weeklyTotals = METRICS.reduce((acc, { key }) => {
    acc[key] = 0;
    for (let i = 0; i < 7; i++) {
      const dStr = format(addDays(weekStart, i), 'yyyy-MM-dd');
      const dayLog = state.businessLogs[dStr];
      if (dayLog && dayLog.metrics[key]) {
        acc[key] += dayLog.metrics[key];
      }
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto pt-6">
      <div className="flex justify-between items-center bg-brand-card p-2 rounded border border-brand-border">
        <button 
          onClick={() => setCurrentDate(prev => subDays(prev, 1))}
          className="p-2 hover:bg-white/5 rounded-sm transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h2 className="font-bold tracking-widest uppercase text-sm">{format(currentDate, 'EEE, MMM d')}</h2>
        </div>
        <button 
          onClick={() => setCurrentDate(prev => addDays(prev, 1))}
          className="p-2 hover:bg-white/5 rounded-sm transition-colors"
          disabled={dateStr === format(new Date(), 'yyyy-MM-dd')}
        >
          <ChevronRight className={cn("w-5 h-5", dateStr === format(new Date(), 'yyyy-MM-dd') ? 'opacity-20' : '')} />
        </button>
      </div>

      <div className="pb-2 border-b border-brand-border">
        <h1 className="text-2xl font-black uppercase tracking-tight">Business Metrics</h1>
      </div>

      <div className="grid grid-cols-2 gap-[1px] bg-brand-border border border-brand-border rounded overflow-hidden">
        {METRICS.map(({ key, label }) => {
          const value = log.metrics[key] || 0;
          return (
            <div key={key} className="bg-brand-card p-4 flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold text-brand-muted tracking-widest">{label}</span>
              <div className="flex items-center justify-between mt-2">
                <div className="text-2xl font-black text-white">{value}</div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => updateMetric(key, -1)}
                    className="w-8 h-8 rounded bg-brand-border flex items-center justify-center hover:bg-white/10 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => updateMetric(key, 1)}
                    className="w-8 h-8 rounded bg-brand-green/20 text-brand-green flex items-center justify-center hover:bg-brand-green/30 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <span className="text-[10px] text-brand-green font-bold tracking-wider mt-1 block">WK: {weeklyTotals[key]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
