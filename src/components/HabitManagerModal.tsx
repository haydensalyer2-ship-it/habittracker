import { useState, FormEvent } from 'react';
import { useAppStore } from '../context/AppContext';
import { Habit, HabitCategory } from '../types';
import { DEFAULT_HABITS } from '../lib/defaultHabits';
import { X, Plus, Check, Shield, Dumbbell, BookOpen, Briefcase, Sparkles, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: { id: HabitCategory; label: string; icon: any }[] = [
  { id: 'cleans', label: 'Cleans & Avoidances', icon: Shield },
  { id: 'health', label: 'Health & Fitness', icon: Dumbbell },
  { id: 'mindset', label: 'Mindset & Discipline', icon: BookOpen },
  { id: 'hustle', label: 'Hustle & Career', icon: Briefcase },
  { id: 'custom', label: 'Custom Protocol', icon: Sparkles },
];

export default function HabitManagerModal({ isOpen, onClose }: Props) {
  const { state, updateHabits } = useAppStore();
  const [activeTab, setActiveTab] = useState<HabitCategory>('cleans');
  const [newHabitLabel, setNewHabitLabel] = useState('');
  const [newHabitXP, setNewHabitXP] = useState(50);
  const [newHabitType, setNewHabitType] = useState<'do' | 'avoid'>('do');

  if (!isOpen) return null;

  const currentHabits = state.userHabits || DEFAULT_HABITS;

  const handleToggleHabit = (id: string) => {
    const updated = currentHabits.map((h) =>
      h.id === id ? { ...h, enabled: !h.enabled } : h
    );
    updateHabits(updated);
  };

  const handleAddCustomHabit = (e: FormEvent) => {
    e.preventDefault();
    if (!newHabitLabel.trim()) return;

    const customHabit: Habit = {
      id: `custom_${Date.now()}`,
      label: newHabitLabel.trim(),
      category: 'custom',
      type: newHabitType,
      xp: Number(newHabitXP) || 50,
      enabled: true,
      isCustom: true,
    };

    updateHabits([...currentHabits, customHabit]);
    setNewHabitLabel('');
  };

  const handleDeleteHabit = (id: string) => {
    const updated = currentHabits.filter((h) => h.id !== id);
    updateHabits(updated);
  };

  const filteredHabits = currentHabits.filter((h) => h.category === activeTab);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-brand-card border border-brand-border rounded-xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="p-4 border-b border-brand-border flex justify-between items-center bg-black/50">
          <div>
            <h2 className="text-lg font-black uppercase tracking-tight text-white">Customize Protocol</h2>
            <p className="text-[10px] text-brand-muted font-bold tracking-widest uppercase">Select your daily Lock-In rules</p>
          </div>
          <button onClick={onClose} className="p-2 text-brand-muted hover:text-white rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex border-b border-brand-border bg-black/30 overflow-x-auto no-scrollbar px-2 py-1.5">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase rounded-lg whitespace-nowrap transition-colors mr-1",
                  activeTab === cat.id
                    ? "bg-brand-green/20 text-brand-green border border-brand-green/30"
                    : "text-brand-muted hover:text-white"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Habits List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredHabits.length === 0 ? (
            <div className="text-center py-8 text-brand-muted text-xs font-semibold">
              No habits in this category. Add a custom habit below!
            </div>
          ) : (
            filteredHabits.map((habit) => (
              <div
                key={habit.id}
                onClick={() => handleToggleHabit(habit.id)}
                className={cn(
                  "p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all",
                  habit.enabled
                    ? "bg-brand-card border-brand-green text-white"
                    : "bg-black/30 border-brand-border/40 opacity-60 text-brand-muted"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                      habit.enabled
                        ? "bg-brand-green border-brand-green text-black"
                        : "border-brand-border bg-transparent"
                    )}
                  >
                    {habit.enabled && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wide block">{habit.label}</span>
                    <span className="text-[9px] text-brand-green font-bold tracking-widest uppercase">+{habit.xp} XP</span>
                  </div>
                </div>

                {habit.isCustom && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteHabit(habit.id);
                    }}
                    className="p-1 text-red-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))
          )}

          {/* Add Custom Habit Form */}
          {activeTab === 'custom' && (
            <form onSubmit={handleAddCustomHabit} className="pt-4 border-t border-brand-border mt-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-brand-green">Create Custom Rule</h3>
              <input
                type="text"
                placeholder="Rule Name (e.g., Read 30m, Cold Shower)"
                value={newHabitLabel}
                onChange={(e) => setNewHabitLabel(e.target.value)}
                className="w-full bg-black/60 border border-brand-border rounded p-2.5 text-xs text-white outline-none focus:border-brand-green"
              />
              <div className="flex gap-2">
                <select
                  value={newHabitType}
                  onChange={(e) => setNewHabitType(e.target.value as 'do' | 'avoid')}
                  className="bg-black/60 border border-brand-border rounded p-2 text-xs text-white outline-none"
                >
                  <option value="do">Action (Do)</option>
                  <option value="avoid">Clean (Avoid)</option>
                </select>

                <input
                  type="number"
                  placeholder="XP"
                  value={newHabitXP}
                  onChange={(e) => setNewHabitXP(Number(e.target.value))}
                  className="w-20 bg-black/60 border border-brand-border rounded p-2 text-xs text-white outline-none"
                />

                <button
                  type="submit"
                  className="flex-1 bg-brand-green text-black font-black uppercase tracking-wider text-xs rounded py-2 hover:bg-green-400 transition-colors"
                >
                  Add Rule
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-brand-border bg-black/50 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-brand-green text-black font-black uppercase tracking-wider text-xs rounded hover:bg-green-400 transition-colors"
          >
            Save Protocol
          </button>
        </div>
      </div>
    </div>
  );
}
