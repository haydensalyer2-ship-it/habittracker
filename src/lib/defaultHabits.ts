import { Habit } from '../types';

export const DEFAULT_HABITS: Habit[] = [
  // Kill Switches: reduce cheap dopamine and relapse loops
  { id: 'noPorn', label: 'No Porn / PMO', category: 'cleans', type: 'avoid', xp: 100, enabled: true, iconName: 'EyeOff' },
  { id: 'noDoomscroll', label: 'No Doomscrolling After Wake-Up', category: 'cleans', type: 'avoid', xp: 75, enabled: true, iconName: 'SmartphoneOff' },
  { id: 'noWeed', label: 'No Weed / Cannabis', category: 'cleans', type: 'avoid', xp: 75, enabled: true, iconName: 'Shield' },
  { id: 'noNicotine', label: 'No Nicotine / Vaping', category: 'cleans', type: 'avoid', xp: 75, enabled: true, iconName: 'ShieldAlert' },
  { id: 'noGambling', label: 'No Gambling / Sportsbook Apps', category: 'cleans', type: 'avoid', xp: 75, enabled: true, iconName: 'Ban' },
  { id: 'noJunkFood', label: 'No Binge Food / Processed Sugar', category: 'cleans', type: 'avoid', xp: 50, enabled: true, iconName: 'Apple' },
  { id: 'noAlcohol', label: 'No Alcohol', category: 'cleans', type: 'avoid', xp: 50, enabled: false, iconName: 'WineOff' },

  // Body: rebuild baseline energy
  { id: 'gym', label: 'Train Hard / Lift / Sport', category: 'health', type: 'do', xp: 100, enabled: true, iconName: 'Dumbbell' },
  { id: 'steps', label: '10,000+ Steps Outside', category: 'health', type: 'do', xp: 75, enabled: true, iconName: 'Footprints' },
  { id: 'protein', label: 'Hit Protein & Whole Food Target', category: 'health', type: 'do', xp: 75, enabled: true, iconName: 'Beef' },
  { id: 'sleep', label: 'Phone Out, 8 Hours Sleep Window', category: 'health', type: 'do', xp: 75, enabled: true, iconName: 'Moon' },
  { id: 'water', label: '3+ Liters Water', category: 'health', type: 'do', xp: 50, enabled: false, iconName: 'Droplets' },

  // Mind: build control and identity
  { id: 'journal', label: 'Nightly Debrief Journal', category: 'mindset', type: 'do', xp: 50, enabled: true, iconName: 'BookOpen' },
  { id: 'reading', label: '20+ Minutes Reading / Study', category: 'mindset', type: 'do', xp: 50, enabled: true, iconName: 'Book' },
  { id: 'meditation', label: '10 Minutes Stillness / Breathwork', category: 'mindset', type: 'do', xp: 50, enabled: false, iconName: 'Brain' },
  { id: 'coldShower', label: 'Cold Shower Discipline Rep', category: 'mindset', type: 'do', xp: 50, enabled: false, iconName: 'Zap' },

  // Mission: convert energy into progress
  { id: 'deepWork', label: '2+ Hours Phone-Free Deep Work', category: 'hustle', type: 'do', xp: 125, enabled: true, iconName: 'Briefcase' },
  { id: 'skillBuilding', label: '1 Hour Skill Build / Career Move', category: 'hustle', type: 'do', xp: 75, enabled: true, iconName: 'Code' },
  { id: 'planTomorrow', label: 'Plan Tomorrow Before Bed', category: 'hustle', type: 'do', xp: 50, enabled: true, iconName: 'ListTodo' },
  { id: 'recruiting', label: 'Outreach / Application / Prospecting', category: 'hustle', type: 'do', xp: 75, enabled: false, iconName: 'Send' }
];
