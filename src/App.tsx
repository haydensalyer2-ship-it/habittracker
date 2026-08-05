import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppStore } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DailyCheckIn from './pages/DailyCheckIn';
import BusinessTracker from './pages/BusinessTracker';
import GoalsPage from './pages/GoalsPage';
import ProgressAnalytics from './pages/ProgressAnalytics';
import WeeklyReview from './pages/WeeklyReview';
import Onboarding from './pages/Onboarding';
import AchievementsPage from './pages/AchievementsPage';
import FocusTimer from './pages/FocusTimer';
import AuthPage from './pages/AuthPage';
import { scheduleLocalNotification } from './lib/notifications';
import { format } from 'date-fns';

function AppRoutes() {
  const { state } = useAppStore();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!state.startDate) return;
    
    // Check every minute
    const interval = setInterval(() => {
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      const hasCheckedIn = state.dailyLogs[todayStr] !== undefined;
      // Remind at 8 PM (20:00)
      scheduleLocalNotification(hasCheckedIn, 20);
    }, 60000);

    return () => clearInterval(interval);
  }, [state]);

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-8 h-8 border-2 border-brand-green border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!user) {
    return <AuthPage />;
  }

  if (!state.startDate) {
    return <Onboarding />;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="check-in" element={<DailyCheckIn />} />
        <Route path="focus" element={<FocusTimer />} />
        <Route path="business" element={<BusinessTracker />} />
        <Route path="analytics" element={<ProgressAnalytics />} />
        <Route path="goals" element={<GoalsPage />} />
        <Route path="review" element={<WeeklyReview />} />
        <Route path="achievements" element={<AchievementsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}
