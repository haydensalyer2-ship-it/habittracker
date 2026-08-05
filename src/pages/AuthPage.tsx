import React, { useState } from 'react';
import { auth } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { ArrowRight, BarChart3, CheckCircle2, Dumbbell, Flame, LockKeyhole, ShieldCheck, Sparkles, Target, Timer } from 'lucide-react';

const features = [
  { icon: CheckCircle2, title: 'Daily proof', copy: 'Score clean days, habits, workouts, and wins in under a minute.' },
  { icon: BarChart3, title: 'Progress intel', copy: 'Spot patterns with streaks, weekly averages, XP, ranks, and momentum.' },
  { icon: Timer, title: 'Focus protocol', copy: 'Run phone-free sessions when cravings, distractions, or drift show up.' },
];

const stats = [
  { value: '90', label: 'Day reset' },
  { value: '1%', label: 'Better daily' },
  { value: '24/7', label: 'Accountability' },
];

export default function AuthPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#030604] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(57,255,136,0.22),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(132,204,22,0.14),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.04)_0,transparent_35%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />

      <main className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-brand-green/30 bg-brand-green/10 shadow-lg shadow-brand-green/10">
              <Dumbbell className="h-5 w-5 text-brand-green" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.28em] text-brand-green">Lock In OS</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">Habit tracker</p>
            </div>
          </div>
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="hidden rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-black uppercase tracking-widest text-white transition hover:border-brand-green/50 hover:text-brand-green disabled:opacity-50 sm:block"
          >
            Sign in
          </button>
        </nav>

        <section className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-green/25 bg-brand-green/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-brand-green">
              <Sparkles className="h-3.5 w-3.5" />
              Built for no-zero-day momentum
            </div>
            <h1 className="text-5xl font-black uppercase leading-[0.9] tracking-[-0.06em] text-white sm:text-7xl lg:text-8xl">
              Rebuild your days into proof.
            </h1>
            <p className="mt-6 max-w-2xl text-base font-medium leading-7 text-zinc-300 sm:text-lg">
              A disciplined command center for tracking habits, clean streaks, focus sessions, goals, and weekly reviews — so your next rep is always obvious.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-brand-green px-6 py-4 text-sm font-black uppercase tracking-widest text-black shadow-2xl shadow-brand-green/20 transition hover:-translate-y-0.5 hover:bg-lime-300 disabled:translate-y-0 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Start with Google'}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </button>
              <div className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-xs font-bold uppercase tracking-widest text-zinc-400">
                <LockKeyhole className="h-4 w-4 text-brand-green" />
                Private by default
              </div>
            </div>

            {error && (
              <div className="mt-5 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm font-bold text-red-200">
                {error}
              </div>
            )}

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                  <div className="mt-1 text-[10px] font-black uppercase tracking-widest text-brand-muted">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
            <div className="absolute -inset-6 rounded-[3rem] bg-brand-green/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2.5rem] border border-brand-green/20 bg-black/70 p-4 shadow-2xl shadow-black/60 backdrop-blur">
              <div className="rounded-[2rem] border border-white/10 bg-gradient-to-b from-zinc-900 to-black p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.28em] text-brand-green">Today</p>
                    <h2 className="text-2xl font-black uppercase tracking-tight">Command Center</h2>
                  </div>
                  <div className="rounded-full border border-brand-green/30 bg-brand-green/10 px-3 py-1 text-[10px] font-black text-brand-green">Live</div>
                </div>

                <div className="grid grid-cols-[0.95fr_1.05fr] gap-3">
                  <div className="rounded-3xl border border-orange-500/20 bg-orange-500/10 p-4 text-center">
                    <Flame className="mx-auto mb-3 h-10 w-10 text-orange-400" />
                    <div className="text-6xl font-black leading-none">14</div>
                    <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-orange-200">Day streak</p>
                  </div>
                  <div className="space-y-3">
                    <div className="rounded-3xl border border-brand-green/25 bg-brand-green/10 p-4">
                      <Target className="mb-3 h-6 w-6 text-brand-green" />
                      <p className="text-sm font-black uppercase">Daily log ready</p>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-black"><div className="h-full w-3/4 rounded-full bg-brand-green" /></div>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                      <ShieldCheck className="mb-3 h-6 w-6 text-brand-green" />
                      <p className="text-sm font-black uppercase">Rank: operator</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">2,480 XP earned</p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 grid gap-3">
                  {features.map(({ icon: Icon, title, copy }) => (
                    <div key={title} className="flex gap-3 rounded-3xl border border-white/10 bg-white/[0.035] p-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-green/10 text-brand-green">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-wide">{title}</h3>
                        <p className="mt-1 text-xs leading-5 text-zinc-400">{copy}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
