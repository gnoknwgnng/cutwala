import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Compass, Calendar, Clock, User, Sun, Moon, LogOut } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';

export const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, theme, toggleTheme, bookings } = useStore();

  const activeBookingsCount = bookings.filter(b => b.status === 'upcoming').length;

  const navItems = [
    { label: 'Home', path: '/app/home', icon: Compass },
    { label: 'Bookings', path: '/app/bookings', icon: Calendar, badge: activeBookingsCount },
    { label: 'History', path: '/app/history', icon: Clock },
    { label: 'Profile', path: '/app/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  // Bottom nav and sidebar only render on main tab routes
  const isMainTab = ['/app/home', '/app/bookings', '/app/history', '/app/profile'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#0b0b0c] dark:text-gray-100 flex flex-col md:flex-row transition-colors duration-300">
      
      {/* 1. DESKTOP LEFT SIDEBAR (Only visible on main tab routes) */}
      {isMainTab && (
        <aside className="hidden md:flex md:w-64 md:flex-col fixed top-0 bottom-0 left-0 bg-white dark:bg-zinc-900 border-r border-gray-100 dark:border-zinc-800 z-40 p-6 justify-between shadow-sm">
          <div className="flex flex-col gap-8">
            {/* Logo Brand */}
            <div className="flex items-center gap-3">
              <img 
                src="/logo.svg" 
                alt="CutWala Logo" 
                className="h-10 w-10 object-contain drop-shadow-md"
              />
              <span className="font-display font-extrabold text-2xl tracking-tight bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                CutWala
              </span>
            </div>

            {/* Navigation links */}
            <nav className="flex flex-col gap-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link 
                    key={item.path} 
                    to={item.path}
                    className={`group relative flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                      active 
                        ? 'bg-amber-500/10 text-amber-500 dark:bg-amber-500/5' 
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-zinc-800/40'
                    }`}
                  >
                    <Icon className={`h-5 w-5 transition-transform duration-200 group-hover:scale-105 ${active ? 'text-amber-500' : 'text-gray-400 dark:text-zinc-500'}`} />
                    <span>{item.label}</span>
                    
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-black px-1">
                        {item.badge}
                      </span>
                    )}

                    {active && (
                      <motion.div 
                        layoutId="sidebar-indicator"
                        className="absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r bg-amber-500"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User profile & Actions */}
          <div className="flex flex-col gap-4 border-t border-gray-100 dark:border-zinc-800 pt-4">
            {/* Light/Dark Toggle */}
            <button 
              onClick={toggleTheme}
              className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-zinc-800/40 cursor-pointer"
            >
              {theme === 'light' ? (
                <>
                  <Moon className="h-5 w-5 text-gray-400" />
                  <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun className="h-5 w-5 text-amber-500" />
                  <span>Light Mode</span>
                </>
              )}
            </button>

            {/* User brief */}
            {user && (
              <div className="flex items-center gap-3 p-2 rounded-2xl bg-gray-50 dark:bg-zinc-850">
                <img 
                  src={user.profile_image} 
                  alt={user.name} 
                  className="h-9 w-9 rounded-full object-cover border border-gray-250/20"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                  <p className="text-[10px] text-gray-500 dark:text-zinc-450 truncate">{user.email}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="h-4.5 w-4.5" />
                </button>
              </div>
            )}
          </div>
        </aside>
      )}

      {/* 2. MOBILE BOTTOM NAVIGATION (Only visible on main tab routes) */}
      {isMainTab && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-18 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-t border-gray-150/40 dark:border-zinc-800/80 z-40 flex items-center justify-around px-2 shadow-2xl safe-bottom">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={`flex flex-col items-center justify-center gap-1.5 py-1 w-16 relative text-xs font-medium transition-colors duration-200 ${
                  active ? 'text-amber-500' : 'text-gray-400 dark:text-zinc-500'
                }`}
              >
                <div className="relative">
                  <Icon className={`h-5.5 w-5.5 transition-transform duration-200 ${active ? 'scale-110' : ''}`} />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 text-[8px] font-bold text-black px-1">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-semibold tracking-wide">{item.label}</span>
                
                {active && (
                  <motion.div 
                    layoutId="mobile-indicator"
                    className="absolute bottom-[-4px] h-1 w-6 rounded bg-amber-500"
                  />
                )}
              </Link>
            );
          })}
        </nav>
      )}

      {/* 3. MAIN CONTENT CONTAINER */}
      <main className={`flex-1 min-h-screen relative flex flex-col ${isMainTab ? 'md:pl-64 pb-18 md:pb-0' : 'pb-0'}`}>
        {/* Mobile Header (Only visible on main tab routes) */}
        {isMainTab && (
          <header className="md:hidden flex h-14 items-center justify-between px-4 bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 shrink-0 sticky top-0 z-35 backdrop-blur-md bg-opacity-70 dark:bg-opacity-70">
            <div className="flex items-center gap-2.5">
              <img 
                src="/logo.svg" 
                alt="CutWala Logo" 
                className="h-7 w-7 object-contain"
              />
              <span className="font-display font-extrabold text-lg bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                CutWala
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={toggleTheme}
                className="p-2 text-gray-500 dark:text-zinc-400 hover:bg-gray-150/50 dark:hover:bg-zinc-800/60 rounded-full cursor-pointer"
              >
                {theme === 'light' ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5 text-amber-500" />}
              </button>
              {user && (
                <img 
                  src={user.profile_image} 
                  alt={user.name} 
                  className="h-7 w-7 rounded-full object-cover border border-gray-250/20"
                  onClick={() => navigate('/app/profile')}
                />
              )}
            </div>
          </header>
        )}

        {/* Routed Sub-pages Outlet */}
        <div className="flex-1 flex flex-col relative w-full overflow-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
