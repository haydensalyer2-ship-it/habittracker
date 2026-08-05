import { useState, useEffect } from 'react';
import { useAppStore } from '../context/AppContext';
import { startOfWeek, format, subWeeks, addWeeks } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { WeeklyReview } from '../types';

export default function WeeklyReviewPage() {
  const { state, updateWeeklyReview } = useAppStore();
  const [currentWeekStart, setCurrentWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  
  const weekStr = format(currentWeekStart, 'yyyy-MM-dd');
  
  const review = state.weeklyReviews[weekStr] || {
    weekStart: weekStr,
    wins: '', problem: '', cause: '', fix: '', focus: ''
  };

  const handleChange = (field: keyof Omit<WeeklyReview, 'weekStart'>, value: string) => {
    updateWeeklyReview(weekStr, { ...review, [field]: value });
  };

  const fields: { key: keyof Omit<WeeklyReview, 'weekStart'>; label: string; placeholder: string }[] = [
    { key: 'wins', label: 'Biggest Wins This Week', placeholder: 'What went well?' },
    { key: 'problem', label: 'Biggest Problem This Week', placeholder: 'What went wrong?' },
    { key: 'cause', label: 'What Caused The Problem?', placeholder: 'Be honest.' },
    { key: 'fix', label: 'What Is The Fix Next Week?', placeholder: 'Actionable steps.' },
    { key: 'focus', label: 'Main Focus For Next Week', placeholder: 'The One Thing.' },
  ];

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto pt-6">
      <div className="flex justify-between items-center bg-brand-card p-2 rounded border border-brand-border">
        <button 
          onClick={() => setCurrentWeekStart(prev => subWeeks(prev, 1))}
          className="p-2 hover:bg-white/5 rounded-sm transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-center flex flex-col">
          <h2 className="font-bold tracking-widest uppercase text-sm">Week Of</h2>
          <span className="text-brand-green text-[10px] font-bold">{format(currentWeekStart, 'MMM d, yyyy')}</span>
        </div>
        <button 
          onClick={() => setCurrentWeekStart(prev => addWeeks(prev, 1))}
          className="p-2 hover:bg-white/5 rounded-sm transition-colors"
          disabled={weekStr === format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')}
        >
          <ChevronRight className={cn("w-5 h-5", weekStr === format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd') ? 'opacity-20' : '')} />
        </button>
      </div>

      <div className="pb-2 border-b border-brand-border">
        <h1 className="text-2xl font-black uppercase tracking-tight">Weekly Review</h1>
      </div>

      <div className="space-y-4">
        {fields.map(({ key, label, placeholder }) => (
          <div key={key} className="space-y-2">
            <label className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">{label}</label>
            <textarea 
              value={review[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              className="w-full bg-brand-card border border-brand-border rounded p-3 text-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green outline-none min-h-[100px]"
              placeholder={placeholder}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
