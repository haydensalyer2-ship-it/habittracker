import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AppState, DailyLog, BusinessLog, Goals, WeeklyReview, Habit, FocusSession, GoalItem } from '../types';
import { DEFAULT_HABITS } from '../lib/defaultHabits';
import { format } from 'date-fns';
import { useAuth } from './AuthContext';
import { db } from '../lib/firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

const defaultGoals: Goals = {
  bodyweight: '',
  cashSaved: '',
  roofingRevenue: '',
  teamProduction: '',
  activeReps: '',
  rafterAiCustomer: '',
  investment: '',
  cleanDays: '90',
};

const defaultCustomGoals: GoalItem[] = [
  { id: '1', title: 'Target Bodyweight', target: '180 lbs', current: '185 lbs', category: 'fitness' },
  { id: '2', title: 'Cash Reserves', target: '$25,000', current: '$8,500', category: 'finance' },
  { id: '3', title: 'Monthly Revenue', target: '$50,000', current: '$12,000', category: 'business' },
  { id: '4', title: 'Books Read', target: '12 Books', current: '3 Books', category: 'mindset' },
];

const initialState: AppState = {
  startDate: null,
  challengeLength: 90,
  userHabits: DEFAULT_HABITS,
  dailyLogs: {},
  focusSessions: [],
  customGoals: defaultCustomGoals,
  businessLogs: {},
  goals: defaultGoals,
  weeklyReviews: {},
  totalXPBonus: 0,
};

interface AppContextType {
  state: AppState;
  startRun: (challengeLength?: number) => void;
  updateDailyLog: (date: string, log: Partial<DailyLog>) => void;
  updateBusinessLog: (date: string, log: Partial<BusinessLog>) => void;
  updateGoals: (goals: Goals) => void;
  updateWeeklyReview: (date: string, review: WeeklyReview) => void;
  updateHabits: (habits: Habit[]) => void;
  addFocusSession: (session: FocusSession) => void;
  updateCustomGoals: (goals: GoalItem[]) => void;
  resetApp: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [state, setState] = useState<AppState>(initialState);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (!user) {
      setState(initialState);
      setDataLoaded(false);
      return;
    }

    const docRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setState({
          ...initialState,
          ...data,
          userHabits: data.userHabits && data.userHabits.length > 0 ? data.userHabits : DEFAULT_HABITS,
          customGoals: data.customGoals && data.customGoals.length > 0 ? data.customGoals : defaultCustomGoals,
        });
      } else {
        setState(initialState);
      }
      setDataLoaded(true);
    });

    return () => unsubscribe();
  }, [user]);

  // Sync back to firestore on state change
  const syncState = (newState: AppState) => {
    setState(newState);
    if (user && dataLoaded) {
      setDoc(doc(db, 'users', user.uid), newState);
    }
  };

  const startRun = (challengeLength: number = 90) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    syncState({ ...state, startDate: today, challengeLength });
  };

  const updateDailyLog = (date: string, log: Partial<DailyLog>) => {
    const existing = state.dailyLogs[date] || {
      date,
      tasks: {},
      notes: { wins: '', triggers: '', fix: '' }
    };
    
    const newLog = {
      ...existing,
      ...log,
      tasks: { ...existing.tasks, ...log.tasks },
      notes: { ...existing.notes, ...log.notes }
    };

    syncState({
      ...state,
      dailyLogs: { ...state.dailyLogs, [date]: newLog }
    });
  };

  const updateBusinessLog = (date: string, log: Partial<BusinessLog>) => {
    const existing = state.businessLogs[date] || {
      date,
      metrics: {
        homeownerConv: 0, followUps: 0, inspections: 0, claims: 0,
        contracts: 0, recruitingMsg: 0, newReps: 0
      }
    };

    const newLog = {
      ...existing,
      ...log,
      metrics: { ...existing.metrics, ...log.metrics }
    };

    syncState({
      ...state,
      businessLogs: { ...state.businessLogs, [date]: newLog }
    });
  };

  const updateGoals = (goals: Goals) => {
    syncState({ ...state, goals });
  };

  const updateWeeklyReview = (date: string, review: WeeklyReview) => {
    syncState({
      ...state,
      weeklyReviews: { ...state.weeklyReviews, [date]: review }
    });
  };

  const updateHabits = (userHabits: Habit[]) => {
    syncState({ ...state, userHabits });
  };

  const addFocusSession = (session: FocusSession) => {
    const focusSessions = [...(state.focusSessions || []), session];
    syncState({ ...state, focusSessions });
  };

  const updateCustomGoals = (customGoals: GoalItem[]) => {
    syncState({ ...state, customGoals });
  };

  const resetApp = () => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      syncState(initialState);
    }
  };

  if (user && !dataLoaded) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-8 h-8 border-2 border-brand-green border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <AppContext.Provider value={{
      state,
      startRun,
      updateDailyLog,
      updateBusinessLog,
      updateGoals,
      updateWeeklyReview,
      updateHabits,
      addFocusSession,
      updateCustomGoals,
      resetApp
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
}
