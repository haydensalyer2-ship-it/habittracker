import { useState, FormEvent } from 'react';
import { useAppStore } from '../context/AppContext';
import { GoalItem } from '../types';
import { Target, Plus, Trash2, Edit3, Check, Flame, Trophy, Shield, Dumbbell, DollarSign, Briefcase, BookOpen, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { getGoalProgress, getGoalMomentumScore } from '../lib/goalProgress';

export default function GoalsPage() {
  const { state, updateCustomGoals, startRun, resetApp } = useAppStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [current, setCurrent] = useState('');
  const [category, setCategory] = useState<'fitness' | 'finance' | 'business' | 'mindset' | 'skill'>('fitness');

  const goalsList = state.customGoals && state.customGoals.length > 0 ? state.customGoals : [];
  const momentumScore = getGoalMomentumScore(goalsList);
  const completedGoals = goalsList.filter(goal => getGoalProgress(goal).isComplete).length;

  const handleAddGoal = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !target.trim()) return;

    const newGoal: GoalItem = {
      id: `goal_${Date.now()}`,
      title: title.trim(),
      target: target.trim(),
      current: current.trim() || '0',
      category,
    };

    updateCustomGoals([...goalsList, newGoal]);
    setTitle('');
    setTarget('');
    setCurrent('');
    setIsAdding(false);
  };

  const handleDeleteGoal = (id: string) => {
    updateCustomGoals(goalsList.filter(g => g.id !== id));
  };

  const handleUpdateGoalValue = (id: string, newCurrent: string) => {
    const updated = goalsList.map(g => g.id === id ? { ...g, current: newCurrent } : g);
    updateCustomGoals(updated);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'fitness': return Dumbbell;
      case 'finance': return DollarSign;
      case 'business': return Briefcase;
      case 'mindset': return BookOpen;
      default: return Target;
    }
  };

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto pt-6 pb-24">
      {/* Header */}
      <div className="flex justify-between items-end pb-2 border-b border-brand-border">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white">Target Goals</h1>
          <p className="text-[10px] text-brand-muted font-bold tracking-widest uppercase">Gamify Your Vision</p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1 text-xs font-black uppercase tracking-wider text-brand-green bg-brand-green/10 border border-brand-green/30 px-3 py-1.5 rounded-lg hover:bg-brand-green/20 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Goal</span>
        </button>
      </div>

      <div className="rounded-[2rem] border border-brand-green/25 bg-brand-green/10 p-5 relative overflow-hidden">
        <Sparkles className="absolute right-4 top-4 h-5 w-5 text-brand-green" />
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-brand-green">Goal Momentum</p>
        <div className="mt-2 flex items-end justify-between">
          <div className="text-6xl font-black tracking-tighter text-white">{momentumScore}%</div>
          <div className="text-right text-[10px] font-black uppercase tracking-widest text-brand-muted">
            <div>{completedGoals} Complete</div>
            <div>{goalsList.length} Active Goals</div>
          </div>
        </div>
        <div className="mt-4 h-3 rounded-full border border-brand-border bg-black/50 overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-brand-green to-pink-400" style={{ width: `${momentumScore}%` }} /></div>
      </div>

      {/* Challenge Duration Settings Banner */}
      <div className="bg-brand-card border border-brand-border rounded-xl p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-black uppercase text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" />
            Challenge Duration
          </span>
          <span className="text-xs font-black text-brand-green uppercase bg-brand-green/10 px-2 py-0.5 rounded border border-brand-green/20">
            {state.challengeLength || 90} Days Run
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {[30, 60, 90, 100].map((len) => (
            <button
              key={len}
              onClick={() => startRun(len)}
              className={cn(
                "py-2 text-xs font-black uppercase rounded border transition-all text-center",
                (state.challengeLength || 90) === len
                  ? "bg-brand-green text-black border-brand-green"
                  : "bg-black/40 border-brand-border text-brand-muted hover:text-white"
              )}
            >
              {len} Days
            </button>
          ))}
        </div>
      </div>

      {/* Add Goal Form */}
      {isAdding && (
        <form onSubmit={handleAddGoal} className="bg-brand-card border border-brand-green/50 rounded-xl p-4 space-y-3 animate-in fade-in">
          <h3 className="text-xs font-black uppercase tracking-wider text-brand-green">Create New Target</h3>

          <input
            type="text"
            placeholder="Goal Title (e.g. Bench 225lbs, Save $10k)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-black/60 border border-brand-border rounded-lg p-2.5 text-xs text-white outline-none focus:border-brand-green"
          />

          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Target Value (e.g. $10,000)"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="bg-black/60 border border-brand-border rounded-lg p-2.5 text-xs text-white outline-none focus:border-brand-green"
            />
            <input
              type="text"
              placeholder="Current Progress (e.g. $2,500)"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              className="bg-black/60 border border-brand-border rounded-lg p-2.5 text-xs text-white outline-none focus:border-brand-green"
            />
          </div>

          <div className="flex gap-2 items-center">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="bg-black/60 border border-brand-border rounded-lg p-2 text-xs text-white outline-none flex-1"
            >
              <option value="fitness">Fitness & Health</option>
              <option value="finance">Finance & Money</option>
              <option value="business">Career & Business</option>
              <option value="mindset">Mindset & Skill</option>
            </select>

            <button
              type="submit"
              className="px-5 py-2 bg-brand-green text-black font-black uppercase tracking-wider text-xs rounded-lg hover:bg-green-400 transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      )}

      {/* Goals Cards List */}
      <div className="space-y-3">
        {goalsList.map((goal) => {
          const CatIcon = getCategoryIcon(goal.category);
          const isEditing = editingId === goal.id;
          const progress = getGoalProgress(goal);

          return (
            <div key={goal.id} className="bg-brand-card border border-brand-border rounded-xl p-4 space-y-3 shadow-lg">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-brand-green/10 border border-brand-green/30 text-brand-green flex items-center justify-center shrink-0">
                    <CatIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-black uppercase tracking-tight text-white text-sm">{goal.title}</h3>
                    <span className="text-[9px] text-brand-muted font-bold uppercase tracking-widest">{goal.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingId(isEditing ? null : goal.id)}
                    className="p-1.5 text-brand-muted hover:text-white rounded"
                  >
                    {isEditing ? <Check className="w-4 h-4 text-brand-green" /> : <Edit3 className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="p-1.5 text-red-500 hover:text-red-400 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="bg-black/40 border border-brand-border/60 rounded-lg p-3 space-y-3 text-xs">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-brand-green">{progress.percent}% complete</span>
                  <span className="text-brand-muted">Next badge: {progress.percent >= 100 ? 'Mastered' : `${progress.percent < 25 ? 25 : progress.percent < 50 ? 50 : progress.percent < 75 ? 75 : 100}%`}</span>
                </div>
                <div className="h-2.5 rounded-full border border-brand-border bg-black overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-brand-green to-pink-400" style={{ width: `${progress.percent}%` }} /></div>
                <div className="flex justify-between items-center">
                <div>
                  <span className="text-[9px] font-bold text-brand-muted uppercase tracking-widest block">Current Progress</span>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={goal.current}
                      onBlur={(e) => handleUpdateGoalValue(goal.id, e.target.value)}
                      className="bg-black border border-brand-green text-white font-bold px-2 py-1 rounded text-xs mt-1 w-28"
                    />
                  ) : (
                    <span className="font-black text-brand-green text-sm">{goal.current}</span>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-[9px] font-bold text-brand-muted uppercase tracking-widest block">Target Goal</span>
                  <span className="font-black text-white text-sm">{goal.target}</span>
                </div>
              </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Danger Reset */}
      <div className="pt-8 flex justify-center">
        <button 
          onClick={resetApp}
          className="text-xs text-red-500 font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity"
        >
          Reset Challenge Data
        </button>
      </div>
    </div>
  );
}
