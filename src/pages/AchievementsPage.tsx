import { useState } from 'react';
import { useAppStore } from '../context/AppContext';
import { getAchievements, Achievement, AchievementTier } from '../lib/achievements';
import { calculateGamification } from '../lib/gamification';
import { cn } from '../lib/utils';
import { Lock, Trophy, Award, Star, Crown, Shield, Zap, Sparkles } from 'lucide-react';

export default function AchievementsPage() {
  const { state } = useAppStore();
  const achievements = getAchievements(state);
  const gamification = calculateGamification(state);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  const categories = ['All', 'Discipline', 'Level & XP', 'Focus Time', 'Habits', 'Perfection'];

  const filteredAchievements = selectedCategory === 'All'
    ? achievements
    : achievements.filter(a => a.category === selectedCategory);

  const getTierColor = (tier: AchievementTier) => {
    switch (tier) {
      case 'apex': return 'bg-yellow-400/20 text-yellow-400 border-yellow-400/50';
      case 'diamond': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'gold': return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      case 'silver': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50';
      default: return 'bg-zinc-700/30 text-zinc-300 border-zinc-600/40';
    }
  };

  return (
    <div className="p-4 space-y-5 max-w-md mx-auto pt-6 pb-24">
      {/* Header */}
      <div className="flex justify-between items-end pb-2 border-b border-brand-border">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white">Achievements</h1>
          <p className="text-[10px] text-brand-muted font-bold tracking-widest uppercase">Gamified Greatness Badges</p>
        </div>
        <span className="text-xs font-black uppercase tracking-widest bg-brand-green/10 text-brand-green border border-brand-green/30 px-3 py-1 rounded-full">
          {unlockedCount} / {achievements.length} Unlocked
        </span>
      </div>

      {/* Gamification Summary Banner */}
      <div className="bg-brand-card border border-brand-border rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-12 h-12 rounded-lg border-2 flex items-center justify-center font-black text-xl shrink-0 shadow-lg",
            gamification.rankBadgeColor,
            gamification.rankBorderColor
          )}>
            {gamification.level}
          </div>
          <div>
            <span className="text-xs font-black uppercase text-white block">{gamification.levelTitle}</span>
            <span className="text-[10px] text-brand-green font-bold uppercase tracking-widest">
              {gamification.totalXP.toLocaleString()} Total XP
            </span>
          </div>
        </div>
        <Trophy className="w-8 h-8 text-yellow-400 opacity-80" />
      </div>

      {/* Category Pills Filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-3 py-1.5 text-xs font-bold uppercase rounded-full whitespace-nowrap transition-all border",
              selectedCategory === cat
                ? "bg-brand-green text-black border-brand-green"
                : "bg-brand-card border-brand-border text-brand-muted hover:text-white"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Achievements List */}
      <div className="space-y-3">
        {filteredAchievements.map((achievement) => {
          const Icon = achievement.icon;
          return (
            <div 
              key={achievement.id}
              className={cn(
                "p-4 rounded-xl border flex items-start gap-4 transition-all relative overflow-hidden",
                achievement.unlocked 
                  ? cn("bg-brand-card border-brand-border shadow-lg", achievement.borderColor)
                  : "bg-brand-card/30 border-brand-border/40 opacity-55 grayscale"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center shrink-0 border mt-0.5",
                achievement.unlocked ? achievement.bgColor : "bg-black/50 border-brand-border"
              )}>
                {achievement.unlocked ? (
                  <Icon className={cn("w-6 h-6", achievement.color)} />
                ) : (
                  <Lock className="w-5 h-5 text-brand-muted" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-black uppercase tracking-tight text-white text-sm truncate">
                    {achievement.title}
                  </h3>
                  <span className={cn("text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border", getTierColor(achievement.tier))}>
                    {achievement.tier}
                  </span>
                </div>

                <p className="text-[11px] text-brand-muted font-semibold tracking-wide leading-relaxed mb-2">
                  {achievement.description}
                </p>

                <div className="flex justify-between items-center text-[10px] font-bold tracking-wider">
                  <span className="text-brand-green uppercase">+{achievement.xpReward} XP REWARD</span>
                  {achievement.progressText && (
                    <span className="text-brand-muted">{achievement.progressText}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
