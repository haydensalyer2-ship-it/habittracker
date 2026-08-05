import { Habit } from '../types';

export const DEFAULT_HABITS: Habit[] = [
  // Cleans / Avoidances
  { id: 'noWeed', label: 'No Weed / Cannabis', category: 'cleans', type: 'avoid', xp: 50, enabled: true, iconName: 'Shield' },
  { id: 'noNicotine', label: 'No Nicotine / Vaping', category: 'cleans', type: 'avoid', xp: 50, enabled: true, iconName: 'ShieldAlert' },
  { id: 'noGambling', label: 'No Gambling', category: 'cleans', type: 'avoid', xp: 50, enabled: true, iconName: 'Ban' },
  { id: 'noAlcohol', label: 'No Alcohol', category: 'cleans', type: 'avoid', xp: 50, enabled: true, iconName: 'WineOff' },
  { id: 'noJunkFood', label: 'No Junk Food & Processed Sugar', category: 'cleans', type: 'avoid', xp: 50, enabled: false, iconName: 'Apple' },
  { id: 'noPorn', label: 'No Porn / PMO', category: 'cleans', type: 'avoid', xp: 75, enabled: false, iconName: 'EyeOff' },
  { id: 'noDoomscroll', label: 'No Doomscrolling (<30m Social)', category: 'cleans', type: 'avoid', xp: 50, enabled: false, iconName: 'SmartphoneOff' },

  // Health & Fitness
  { id: 'gym', label: 'Gym Workout / Training', category: 'health', type: 'do', xp: 100, enabled: true, iconName: 'Dumbbell' },
  { id: 'protein', label: 'Hit Daily Protein & Macros', category: 'health', type: 'do', xp: 75, enabled: true, iconName: 'Beef' },
  { id: 'steps', label: '10,000+ Daily Steps', category: 'health', type: 'do', xp: 75, enabled: true, iconName: 'Footprints' },
  { id: 'water', label: 'Drink 3+ Liters of Water', category: 'health', type: 'do', xp: 50, enabled: false, iconName: 'Droplets' },
  { id: 'sleep', label: '8 Hours Quality Sleep', category: 'health', type: 'do', xp: 50, enabled: false, iconName: 'Moon' },

  // Mindset & Discipline
  { id: 'journal', label: 'Daily Journaling & Reflection', category: 'mindset', type: 'do', xp: 50, enabled: true, iconName: 'BookOpen' },
  { id: 'coldShower', label: 'Cold Shower / Ice Bath', category: 'mindset', type: 'do', xp: 75, enabled: false, iconName: 'Zap' },
  { id: 'reading', label: '20+ Minutes Reading Non-Fiction', category: 'mindset', type: 'do', xp: 50, enabled: false, iconName: 'Book' },
  { id: 'meditation', label: '10+ Minutes Meditation / Mindfulness', category: 'mindset', type: 'do', xp: 50, enabled: false, iconName: 'Brain' },

  // Hustle & Execution
  { id: 'revenueActivity', label: '6 Hours Deep Work', category: 'hustle', type: 'do', xp: 100, enabled: true, iconName: 'Briefcase' },
  { id: 'recruiting', label: 'Outreach / Prospecting Activity', category: 'hustle', type: 'do', xp: 75, enabled: true, iconName: 'Send' },
  { id: 'skillBuilding', label: '1 Hour Skill Building / Coding / Study', category: 'hustle', type: 'do', xp: 75, enabled: false, iconName: 'Code' },
  { id: 'planTomorrow', label: 'Plan & Prioritize Tomorrow', category: 'hustle', type: 'do', xp: 50, enabled: false, iconName: 'ListTodo' }
];
