import { useState } from 'react';
import { useAppStore } from '../context/AppContext';
import { Flame, ShieldCheck, Swords, Trophy, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Onboarding() {
  const { startRun } = useAppStore();
  const [selectedLength, setSelectedLength] = useState(90);

  const durations = [
    { days: 30, title: '30-Day Reset', desc: 'Stop the bleeding and prove control.' },
    { days: 60, title: '60-Day Rewire', desc: 'Replace urges with repeatable systems.' },
    { days: 90, title: '90-Day Lock In', desc: 'Full identity shift and momentum.' },
    { days: 100, title: '100-Day Legend', desc: 'Elite consistency with receipts.' },
  ];

  return (
    <div className="min-h-[100dvh] bg-[radial-gradient(circle_at_top,#13331f_0%,#070707_42%,#020202_100%)] text-white px-5 py-8 overflow-hidden">
      <div className="max-w-md mx-auto space-y-6">
        <div className="relative rounded-[2rem] border border-brand-green/30 bg-black/70 p-6 shadow-2xl shadow-brand-green/10 overflow-hidden">
          <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-brand-green/20 blur-3xl" />
          <div className="relative space-y-5">
            <div className="flex items-center justify-between">
              <div className="rounded-2xl border border-brand-green/40 bg-brand-green/10 p-4 shadow-lg shadow-brand-green/10">
                <Flame className="h-9 w-9 text-brand-green" />
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-brand-green">
                Dopamine Detox RPG
              </span>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-black uppercase tracking-[0.35em] text-brand-green">For men ready to stop leaking time</p>
              <h1 className="text-5xl font-black uppercase leading-[0.9] tracking-tighter">
                Lock In.<br />Level Up.
              </h1>
              <p className="max-w-sm text-sm font-semibold leading-6 text-zinc-300">
                A gamified discipline system for young men cutting porn, scrolling, weed, gambling, junk food, and any loop keeping them weak.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                ['Kill', 'Bad loops'],
                ['Build', 'Daily proof'],
                ['Earn', 'XP & ranks'],
              ].map(([top, bottom]) => (
                <div key={top} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-center">
                  <div className="text-lg font-black uppercase text-white">{top}</div>
                  <div className="text-[9px] font-bold uppercase tracking-widest text-brand-muted">{bottom}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-brand-border bg-brand-card/95 p-5 space-y-3 shadow-2xl">
          <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-brand-green">
            <Swords className="h-4 w-4" /> Choose your campaign
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {durations.map((opt) => (
              <button
                key={opt.days}
                type="button"
                onClick={() => setSelectedLength(opt.days)}
                className={cn(
                  'rounded-2xl border p-3 text-left transition-all active:scale-95',
                  selectedLength === opt.days
                    ? 'border-brand-green bg-brand-green text-black shadow-lg shadow-brand-green/20'
                    : 'border-brand-border bg-black/50 text-white hover:border-brand-green/50'
                )}
              >
                <span className="block text-sm font-black uppercase">{opt.title}</span>
                <span className={cn('mt-1 block text-[10px] font-bold leading-4', selectedLength === opt.days ? 'text-black/70' : 'text-brand-muted')}>{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-brand-border bg-black p-5 space-y-4">
          <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-white">
            <Trophy className="h-4 w-4 text-brand-green" /> Starting protocol
          </h3>
          <div className="space-y-3 text-xs font-bold text-zinc-300">
            <p className="flex gap-3"><ShieldCheck className="h-4 w-4 shrink-0 text-red-400" /> Kill cheap dopamine: porn, doomscrolling, weed, nicotine, gambling, binge food.</p>
            <p className="flex gap-3"><Zap className="h-4 w-4 shrink-0 text-brand-green" /> Build status: training, sleep, steps, protein, reading, skill work, deep work.</p>
          </div>
        </div>

        <button
          onClick={() => startRun(selectedLength)}
          className="w-full rounded-2xl bg-brand-green py-4 text-xl font-black uppercase tracking-[0.18em] text-black shadow-2xl shadow-brand-green/20 transition-all hover:bg-green-300 active:scale-95"
        >
          Start {selectedLength}-Day Lock In
        </button>
      </div>
    </div>
  );
}
