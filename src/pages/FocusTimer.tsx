import { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../context/AppContext';
import { playLevelSound } from '../lib/gamification';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Brain, Clock, Zap, CheckCircle, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

type AmbientSound = 'none' | 'brown' | 'binaural' | 'rain';

const PRESETS = [
  { label: '15 Min Sprint', minutes: 15, xp: 50 },
  { label: '25 Min Pomodoro', minutes: 25, xp: 80 },
  { label: '45 Min Power', minutes: 45, xp: 150 },
  { label: '60 Min Monk Mode', minutes: 60, xp: 200 },
  { label: '90 Min Deep Flow', minutes: 90, xp: 320 },
  { label: '120 Min Ultra Lock', minutes: 120, xp: 450 },
];

const CATEGORIES = ['Deep Work', 'Coding & Build', 'Outreach & Sales', 'Reading & Learning', 'Strategy & Planning', 'Workout & Fitness'];

export default function FocusTimer() {
  const { addFocusSession } = useAppStore();
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [category, setCategory] = useState('Deep Work');
  const [ambientSound, setAmbientSound] = useState<AmbientSound>('none');
  const [isCompleted, setIsCompleted] = useState(false);
  const [sessionXP, setSessionXP] = useState(80);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  // Sync timer when preset selected
  const handleSelectPreset = (m: number, xp: number) => {
    if (isRunning) return;
    setSelectedMinutes(m);
    setTimeLeft(m * 60);
    setSessionXP(xp);
    setIsCompleted(false);
  };

  // Timer interval
  useEffect(() => {
    let timer: any = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      handleFinishSession();
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  // Ambient Sound Generator via Web Audio API
  useEffect(() => {
    stopAmbientSound();

    if (isRunning && ambientSound !== 'none') {
      startAmbientSound(ambientSound);
    }

    return () => {
      stopAmbientSound();
    };
  }, [isRunning, ambientSound]);

  const startAmbientSound = (type: AmbientSound) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      if (type === 'brown') {
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = data[i];
          data[i] *= 3.5;
        }
      } else if (type === 'rain') {
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          data[i] *= 0.11;
          b6 = white * 0.115926;
        }
      } else if (type === 'binaural') {
        // Create 200Hz base tone and 210Hz binaural beats
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.frequency.value = 200;
        osc2.frequency.value = 210;
        gain.gain.value = 0.08;
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start();
        osc2.start();
        noiseNodeRef.current = gain;
        return;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const gain = ctx.createGain();
      gain.gain.value = 0.15;

      noise.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
      noiseNodeRef.current = noise;
    } catch (e) {
      console.warn('Audio synthesis restricted', e);
    }
  };

  const stopAmbientSound = () => {
    if (noiseNodeRef.current) {
      try {
        (noiseNodeRef.current as any).stop?.();
      } catch (e) {}
      noiseNodeRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {}
      audioCtxRef.current = null;
    }
  };

  const handleFinishSession = () => {
    const earnedXP = Math.round(selectedMinutes * 3);
    addFocusSession({
      id: Date.now().toString(),
      date: format(new Date(), 'yyyy-MM-dd'),
      durationMinutes: selectedMinutes,
      xpEarned: earnedXP,
      category,
    });
    playLevelSound('focusComplete');
    setIsCompleted(true);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalSecs = selectedMinutes * 60;
  const progressPercent = Math.min(100, Math.max(0, ((totalSecs - timeLeft) / totalSecs) * 100));

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto pt-6 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center pb-2 border-b border-brand-border">
        <div>
          <span className="text-[10px] text-brand-green font-black uppercase tracking-widest block">Lock-In Mode</span>
          <h1 className="text-2xl font-black uppercase tracking-tight">Deep Work Focus</h1>
        </div>
        <div className="flex items-center gap-1 bg-brand-green/10 text-brand-green border border-brand-green/30 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5" />
          <span>+{Math.round(selectedMinutes * 3)} XP</span>
        </div>
      </div>

      {/* Main Timer Display */}
      <div className="bg-brand-card border border-brand-border rounded-xl p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
        {/* Glowing radial background when running */}
        {isRunning && (
          <div className="absolute inset-0 bg-brand-green/10 animate-pulse pointer-events-none" />
        )}

        <span className="text-xs font-bold text-brand-muted uppercase tracking-widest mb-4 z-10 flex items-center gap-1.5">
          <Brain className="w-4 h-4 text-brand-green" />
          {category}
        </span>

        {/* Circular Countdown Progress */}
        <div className="relative w-56 h-56 flex items-center justify-center my-2">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="112"
              cy="112"
              r="98"
              stroke="currentColor"
              strokeWidth="8"
              className="text-brand-border"
              fill="transparent"
            />
            <circle
              cx="112"
              cy="112"
              r="98"
              stroke="currentColor"
              strokeWidth="10"
              className="text-brand-green transition-all duration-1000 ease-linear"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 98}
              strokeDashoffset={2 * Math.PI * 98 * (1 - progressPercent / 100)}
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-black tracking-tighter text-white font-mono drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]">
              {formatTime(timeLeft)}
            </span>
            <span className="text-[10px] text-brand-muted uppercase font-bold tracking-widest mt-1">
              {isRunning ? 'LOCKED IN' : 'READY TO FOCUS'}
            </span>
          </div>
        </div>

        {/* Play / Pause / Reset Controls */}
        <div className="flex items-center gap-4 mt-6 z-10">
          <button
            onClick={() => {
              setIsRunning(false);
              setTimeLeft(selectedMinutes * 60);
            }}
            className="p-3 bg-brand-border/50 hover:bg-white/10 rounded-full text-brand-muted hover:text-white transition-colors"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className={cn(
              "px-8 py-4 rounded-full font-black uppercase tracking-wider text-sm flex items-center gap-2 shadow-lg transition-all active:scale-95",
              isRunning
                ? "bg-amber-500 text-black hover:bg-amber-400"
                : "bg-brand-green text-black hover:bg-green-400"
            )}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current ml-0.5" />
                <span>Lock In</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">
          Select Duration
        </label>
        <div className="grid grid-cols-2 gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.minutes}
              onClick={() => handleSelectPreset(p.minutes, p.xp)}
              disabled={isRunning}
              className={cn(
                "p-3 rounded border text-left flex justify-between items-center transition-all",
                selectedMinutes === p.minutes
                  ? "bg-brand-card border-brand-green text-white font-bold"
                  : "bg-brand-card/40 border-brand-border/60 text-brand-muted hover:text-white"
              )}
            >
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase">{p.label}</span>
                <span className="text-[10px] text-brand-green font-semibold">+{p.xp} XP</span>
              </div>
              <Clock className="w-4 h-4 opacity-50" />
            </button>
          ))}
        </div>
      </div>

      {/* Category Selector */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">
          Session Focus Category
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-bold uppercase whitespace-nowrap transition-colors border",
                category === cat
                  ? "bg-brand-green/20 border-brand-green text-brand-green"
                  : "bg-brand-card border-brand-border text-brand-muted hover:text-white"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Ambient Audio Synthesizer */}
      <div className="bg-brand-card border border-brand-border rounded p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-brand-green" />
            Ambient Focus Audio
          </span>
          <span className="text-[10px] text-brand-muted font-semibold uppercase">Synthesized</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {[
            { id: 'none', label: 'Off' },
            { id: 'brown', label: 'Brown Noise' },
            { id: 'rain', label: 'Heavy Rain' },
            { id: 'binaural', label: '40Hz Beats' },
          ].map((snd) => (
            <button
              key={snd.id}
              onClick={() => setAmbientSound(snd.id as AmbientSound)}
              className={cn(
                "py-2 px-1 text-[10px] font-bold uppercase rounded border text-center transition-all",
                ambientSound === snd.id
                  ? "bg-brand-green text-black border-brand-green"
                  : "bg-black/50 border-brand-border text-brand-muted hover:text-white"
              )}
            >
              {snd.label}
            </button>
          ))}
        </div>
      </div>

      {/* Session Completion Modal */}
      {isCompleted && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-brand-card border border-brand-green rounded-2xl p-6 text-center max-w-sm w-full space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-brand-green/20 border-2 border-brand-green flex items-center justify-center mx-auto text-brand-green">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-black uppercase tracking-tight text-white">Focus Session Complete!</h2>
            
            <p className="text-sm text-brand-muted font-medium">
              You stayed locked in for <strong className="text-white">{selectedMinutes} minutes</strong> of {category}.
            </p>

            <div className="bg-black/50 border border-brand-border rounded-lg p-3 text-brand-green font-black text-xl">
              +{Math.round(selectedMinutes * 3)} XP EARNED
            </div>

            <button
              onClick={() => setIsCompleted(false)}
              className="w-full py-3 bg-brand-green text-black font-black uppercase tracking-wider rounded-lg hover:bg-green-400 transition-colors"
            >
              Claim Greatness
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
