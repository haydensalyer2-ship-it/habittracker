import { Outlet, NavLink } from 'react-router-dom';
import { Home, CheckSquare, Clock, BarChart2, Target, Award, LogOut, Briefcase } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { signOut } = useAuth();
  const navItems = [
    { to: '/', icon: Home, label: 'HQ' },
    { to: '/check-in', icon: CheckSquare, label: 'Proof' },
    { to: '/focus', icon: Clock, label: 'Focus' },
    { to: '/analytics', icon: BarChart2, label: 'Intel' },
    { to: '/goals', icon: Target, label: 'Goals' },
    { to: '/achievements', icon: Award, label: 'Ranks' },
  ];

  return (
    <div className="flex flex-col min-h-[100dvh] bg-brand-dark text-white">
      <header className="flex justify-end p-2 absolute top-0 right-0 z-50">
        <button
          onClick={() => signOut()}
          className="text-brand-muted hover:text-white p-2 rounded-full"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 w-full bg-brand-card border-t border-brand-border pb-safe px-1 py-2 flex justify-around items-center z-50 overflow-x-auto no-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center p-1.5 rounded transition-all duration-200 min-w-[3.2rem]',
                isActive ? 'text-brand-green' : 'text-brand-muted hover:text-white'
              )
            }
          >
            <item.icon className="w-5 h-5 mb-1" strokeWidth={2.5} />
            <span className="text-[9px] font-bold tracking-wider uppercase">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
