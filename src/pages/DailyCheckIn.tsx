import { useState } from 'react';
import { useAppStore } from '../context/AppContext';
import { format, subDays, addDays } from 'date-fns';
import { ChevronLeft, ChevronRight, Check, Settings2, Sparkles, Zap, Plus } from 'lucide-react';
import { cn } from '../lib/utils';
import { DEFAULT_HABITS } from '../lib/defaultHabits';
import { playLevelSound } from '../lib/gamification';
import HabitManagerModal from '../components/HabitManagerModal';

export default function DailyCheckIn() {
  const { state, updateDailyLog } = useAppStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastXPNotice, setLastXPNotice] = useState<string | null>(null);

  const activeHabits = (state.userHabits && state.userHabits.length > 0 ? state.userHabits : DEFAULT_HABITS).filter(h => h.enabled);
  
  const dateStr = format(currentDate, 'yyyy-MM-dd');
  const log = state.dailyLogs[dateStr] || {
    tasks: {},
    notes: { wins: '', triggers: '', fix: '' }
  };

  const handleToggle = (habitId: string, xpValue: number, label: string) => {
    const isCurrentlyChecked = !!log.tasks[habitId];
    const newTasks = { ...log.tasks, [habitId]: !isCurrentlyChecked };
    
    updateDailyLog(dateStr, { tasks: newTasks });

    if (!isCurrentlyChecked) {
      playLevelSound('check');
      setLastXPNotice(`+${xpValue} XP: ${label}`);
      setTimeout(() => setLastXPNotice(null), 2000);
    }
  };

  const handleNoteChange = (field: 'wins' | 'triggers' | 'fix', value: string) => {
    updateDailyLog(dateStr, {
      notes: { ...log.notes, [field]: value }
    });
  };

  const completedCount = activeHabits.filter(h => log.tasks[h.id]).length;
  const totalCount = activeHabits.length;

  return (
    <div className="p-4 space-y-5 max-w-md mx-auto pt-6 pb-24">
      {/* Date Navigation */}
      <div className="flex justify-between items-center bg-brand-card p-2 rounded-lg border border-brand-border">
        <button 
          onClick={() => setCurrentDate(prev => subDays(prev, 1))}
          className="p-2 hover:bg-white/5 rounded transition-colors text-brand-muted hover:text-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h2 className="font-bold tracking-widest uppercase text-xs text-white">{format(currentDate, 'EEEE, MMM d')}</h2>
        </div>
        <button 
          onClick={() => setCurrentDate(prev => addDays(prev, 1))}
          className="p-2 hover:bg-white/5 rounded transition-colors text-brand-muted hover:text-white"
          disabled={dateStr === format(new Date(), 'yyyy-MM-dd')}
        >
          <ChevronRight className={cn("w-5 h-5", dateStr === format(new Date(), 'yyyy-MM-dd') ? 'opacity-20' : '')} />
        </button>
      </div>

      {/* Header & Protocol Button */}
      <div className="flex justify-between items-end pb-2 border-b border-brand-border">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white">Check-In</h1>
          <p className="text-[10px] text-brand-muted font-bold tracking-widest uppercase">Daily Protocol Execution</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-brand-green bg-brand-green/10 border border-brand-green/30 px-2.5 py-1.5 rounded hover:bg-brand-green/20 transition-colors"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>Customize</span>
          </button>

          <div className="flex items-baseline gap-1 bg-black/40 px-3 py-1 rounded border border-brand-border">
            <span className="text-2xl font-black text-brand-green">{completedCount}</span>
            <span className="text-brand-muted font-bold text-sm">/ {totalCount}</span>
          </div>
        </div>
      </div>

      {/* Floating XP Gain Toast */}
      {lastXPNotice && (
        <div className="bg-brand-green text-black px-4 py-2 rounded-lg font-black text-xs tracking-wider uppercase shadow-lg text-center animate-in fade-in slide-in-from-top-2">
          {lastXPNotice}
        </div>
      )}

      {/* Habits Protocol Checklist */}
      <div className="border border-brand-border rounded-xl bg-brand-card overflow-hidden shadow-lg">
        {activeHabits.length === 0 ? (
          <div className="p-6 text-center space-y-3">
            <p className="text-xs text-brand-muted font-semibold">No habits selected for your protocol.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="py-2 px-4 bg-brand-green text-black font-black uppercase tracking-wider text-xs rounded"
            >
              Set Up Protocol
            </button>
          </div>
        ) : (
          activeHabits.map((habit, idx) => {
            const isChecked = !!log.tasks[habit.id];
            return (
              <div 
                key={habit.id}
                onClick={() => handleToggle(habit.id, habit.xp, habit.label)}
                className={cn(
                  "flex items-center justify-between p-3.5 cursor-pointer transition-colors hover:bg-white/5",
                  idx !== activeHabits.length - 1 && "border-b border-brand-border/60"
                )}
              >
                <div className="flex items-center gap-3.5">
                  <div className={cn(
                    "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                    isChecked ? "bg-brand-green border-brand-green text-black" : "border-brand-border bg-transparent"
                  )}>
                    {isChecked && <Check className="w-4 h-4" strokeWidth={3} />}
                  </div>
                  <span className={cn(
                    "font-bold uppercase text-xs tracking-wide",
                    isChecked ? "text-white line-through opacity-80" : "text-white"
                  )}>
                    {habit.label}
                  </span>
                </div>

                <span className={cn(
                  "text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded",
                  isChecked ? "bg-brand-green/20 text-brand-green" : "text-brand-muted"
                )}>
                  +{habit.xp} XP
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* End of Day Reflection */}
      <div className="space-y-3 pt-2">
        <h3 className="font-black uppercase tracking-wide text-lg text-white">End of Day Reflection</h3>
        
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">Wins Today</label>
          <textarea 
            value={log.notes.wins}
            onChange={(e) => handleNoteChange('wins', e.target.value)}
            className="w-full bg-brand-card border border-brand-border rounded-lg p-3 text-xs text-white focus:border-brand-green focus:ring-1 focus:ring-brand-green outline-none min-h-[70px]"
            placeholder="What went well today?"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">Triggers / Roadblocks</label>
          <textarea 
            value={log.notes.triggers}
            onChange={(e) => handleNoteChange('triggers', e.target.value)}
            className="w-full bg-brand-card border border-brand-border rounded-lg p-3 text-xs text-white focus:border-brand-green focus:ring-1 focus:ring-brand-green outline-none min-h-[70px]"
            placeholder="What almost threw you off focus?"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">Fix for Tomorrow</label>
          <textarea 
            value={log.notes.fix}
            onChange={(e) => handleNoteChange('fix', e.target.value)}
            className="w-full bg-brand-card border border-brand-border rounded-lg p-3 text-xs text-white focus:border-brand-green focus:ring-1 focus:ring-brand-green outline-none min-h-[70px]"
            placeholder="How will you execute better tomorrow?"
          />
        </div>
      </div>

      <HabitManagerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
