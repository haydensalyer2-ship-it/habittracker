import { useState } from 'react';
import { useAppStore } from '../context/AppContext';
import { Target, Flame, Zap, Shield, Sparkles, Trophy } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Onboarding() {
  const { startRun } = useAppStore();
  const [selectedLength, setSelectedLength] = useState(90);

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-brand-dark text-white p-6">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-brand-green/10 rounded-2xl flex items-center justify-center border border-brand-green/30 shadow-xl relative">
            <div className="absolute inset-0 bg-brand-green/20 blur-xl rounded-full" />
            <Flame className="w-10 h-10 text-brand-green relative z-10" />
          </div>
        </div>
        
        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-brand-green">Gamify Greatness</span>
          <h1 className="text-4xl font-black tracking-tight uppercase text-white">LOCK IN</h1>
          <p className="text-brand-muted text-sm font-bold uppercase tracking-wider">Level up your health, mindset, discipline & focus.</p>
        </div>

        {/* Challenge Duration Options */}
        <div className="bg-brand-card p-5 rounded-2xl border border-brand-border space-y-3 text-left shadow-2xl">
          <h3 className="font-black text-xs text-brand-green uppercase tracking-widest">Select Challenge Duration:</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { days: 30, title: '30-Day Sprint', desc: 'Build initial momentum' },
              { days: 60, title: '60-Day Lock In', desc: 'Transform habits' },
              { days: 90, title: '90-Day Greatness', desc: 'Complete overhaul' },
              { days: 100, title: '100-Day Legend', desc: 'Apex level execution' },
            ].map((opt) => (
              <button
                key={opt.days}
                type="button"
                onClick={() => setSelectedLength(opt.days)}
                className={cn(
                  "p-3 rounded-xl border text-left transition-all",
                  selectedLength === opt.days
                    ? "bg-brand-green/20 border-brand-green text-white"
                    : "bg-black/40 border-brand-border/60 text-brand-muted hover:text-white"
                )}
              >
                <span className="text-xs font-black uppercase block">{opt.title}</span>
                <span className="text-[10px] text-brand-muted font-medium block mt-0.5">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* The Protocol Preview */}
        <div className="bg-brand-card p-5 rounded-2xl text-left space-y-3 border border-brand-border">
          <h3 className="font-black text-xs text-white uppercase tracking-widest border-b border-brand-border pb-2 flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-brand-green" />
            Core Lock-In Protocol:
          </h3>
          <ul className="space-y-2 text-xs text-brand-muted font-bold">
            <li className="flex items-center gap-2.5"><span className="w-2 h-2 rounded-full bg-red-500" /> Clean Living (No Weed, Nicotine, Gambling, Junk)</li>
            <li className="flex items-center gap-2.5"><span className="w-2 h-2 rounded-full bg-brand-green" /> Gym Training & Daily Nutrition Macros</li>
            <li className="flex items-center gap-2.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> Monk Mode Deep Work Focus Sessions</li>
            <li className="flex items-center gap-2.5"><span className="w-2 h-2 rounded-full bg-purple-500" /> Daily Journaling, Reading & Step Goal</li>
          </ul>
        </div>

        <button
          onClick={() => startRun(selectedLength)}
          className="w-full bg-brand-green hover:bg-green-400 text-black font-black text-xl py-4 rounded-xl uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-brand-green/20"
        >
          Begin Lock In ({selectedLength} Days)
        </button>
      </div>
    </div>
  );
}
