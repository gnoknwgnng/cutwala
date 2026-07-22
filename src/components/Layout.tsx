import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Compass, Calendar, Clock, User, Sun, Moon, LogOut, MapPin, ChevronDown, Check } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { DrawerModal } from './UI';

export const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, theme, toggleTheme, userAddress } = useStore();

  // Saved locations state for header dropdown
  const savedAddresses = [
    { id: '1', tag: 'Current GPS', address: userAddress },
    { id: '2', tag: 'Home', address: 'HNo 1-7-201/2/1 Kamala Nagar, Hyderabad' },
    { id: '3', tag: 'Work', address: 'Building 4B, SOMA Tech District, SF' },
  ];
  
  const [activeAddress, setActiveAddress] = useState(savedAddresses[0]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState<boolean>(false);

  const mainNavItems = [
    { path: '/app/home', label: 'Explore', icon: Compass },
    { path: '/app/bookings', label: 'Bookings', icon: Calendar },
    { path: '/app/history', label: 'History', icon: Clock },
    { path: '/app/profile', label: 'Profile', icon: User },
  ];

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
                src="/cutwalalogo.jpeg" 
                alt="CutWala Logo" 
                className="h-10 w-10 object-contain drop-shadow-md rounded-xl"
              />
              <span className="font-display font-extrabold text-2xl tracking-tight bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                CutWala
              </span>
            </div>

            {/* Address Capsule on Desktop Sidebar */}
            <button
              onClick={() => setIsAddressModalOpen(true)}
              className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-200/80 dark:border-zinc-700/60 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all cursor-pointer text-left group"
            >
              <div className="flex items-center gap-2 min-w-0">
                <MapPin className="h-4 w-4 text-orange-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase text-gray-400 dark:text-zinc-500 tracking-wider">Location</p>
                  <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                    {activeAddress.tag} - {activeAddress.address}
                  </p>
                </div>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            </button>

            {/* Navigation links */}
            <nav className="flex flex-col gap-1.5">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 ${
                      isActive
                        ? 'bg-orange-500 text-white font-bold shadow-lg shadow-orange-500/25'
                        : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-850 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer (Theme toggle & Logout) */}
          <div className="flex flex-col gap-3 pt-4 border-t border-gray-100 dark:border-zinc-800">
            <button
              onClick={toggleTheme}
              className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-gray-50 dark:bg-zinc-850 text-xs font-bold text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <span>{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</span>
              {theme === 'light' ? <Sun className="h-4 w-4 text-orange-500" /> : <Moon className="h-4 w-4 text-orange-400" />}
            </button>

            {user && (
              <div className="flex items-center justify-between px-2 pt-2">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={user.profile_image}
                    alt={user.name}
                    className="h-9 w-9 rounded-full object-cover border border-gray-250/20"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-gray-900 dark:text-white truncate">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-gray-500 dark:text-zinc-500 truncate">
                      {user.email}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/login')}
                  className="p-2 text-gray-400 hover:text-rose-500 rounded-xl transition-colors cursor-pointer"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </aside>
      )}

      {/* 2. MOBILE BOTTOM NAVIGATION BAR (Only visible on main tab routes) */}
      {isMainTab && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border-t border-gray-100 dark:border-zinc-800 flex h-16 items-center justify-around px-2 shadow-2xl">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative flex flex-col items-center justify-center py-1 px-3 min-w-[64px]"
              >
                <Icon
                  className={`h-5 w-5 transition-all duration-200 ${
                    isActive
                      ? 'text-orange-500 scale-110'
                      : 'text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300'
                  }`}
                />
                <span
                  className={`text-[10px] font-semibold mt-1 transition-colors duration-200 ${
                    isActive ? 'text-orange-500 font-bold' : 'text-gray-400 dark:text-zinc-500'
                  }`}
                >
                  {item.label}
                </span>

                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-indicator"
                    className="absolute bottom-[-4px] h-1 w-6 rounded bg-orange-500"
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
          <header className="md:hidden flex h-14 items-center justify-between px-3 bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 shrink-0 sticky top-0 z-35 backdrop-blur-md bg-opacity-95 dark:bg-opacity-95 gap-2">
            
            {/* Logo */}
            <div className="flex items-center gap-1.5 shrink-0">
              <img 
                src="/cutwalalogo.jpeg" 
                alt="CutWala Logo" 
                className="h-7 w-7 object-contain rounded-lg"
              />
              <span className="font-display font-extrabold text-base bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                CutWala
              </span>
            </div>

            {/* TOP HEADER ADDRESS CAPSULE (Matches exact user image: "Home - HNo 1-7-201/2/1 kamala naga... ⌄") */}
            <button
              onClick={() => setIsAddressModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-orange-50 dark:bg-zinc-800 border border-orange-200/60 dark:border-zinc-700/60 rounded-xl text-left min-w-0 max-w-[190px] xs:max-w-[230px] cursor-pointer hover:bg-orange-100/60 transition-colors"
            >
              <MapPin className="h-3.5 w-3.5 text-orange-500 shrink-0 fill-orange-500" />
              <p className="text-[11px] font-extrabold text-gray-900 dark:text-white truncate leading-tight min-w-0">
                <span className="font-black text-gray-950 dark:text-white">{activeAddress.tag}</span>
                <span className="font-normal text-gray-600 dark:text-zinc-400"> - {activeAddress.address}</span>
              </p>
              <ChevronDown className="h-3.5 w-3.5 text-gray-500 shrink-0" />
            </button>

            {/* User Profile / Theme Icon */}
            <div className="flex items-center gap-2 shrink-0">
              {user ? (
                <img 
                  src={user.profile_image} 
                  alt={user.name} 
                  className="h-7 w-7 rounded-full object-cover border border-gray-250/20"
                  onClick={() => navigate('/app/profile')}
                />
              ) : (
                <button 
                  onClick={toggleTheme}
                  className="p-1.5 text-gray-500 dark:text-zinc-400 hover:bg-gray-150/50 rounded-full"
                >
                  {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4 text-orange-500" />}
                </button>
              )}
            </div>
          </header>
        )}

        {/* Page view outlet */}
        <div className="flex-1 flex flex-col min-h-0">
          <Outlet />
        </div>
      </main>

      {/* 4. LOCATION SELECTION MODAL */}
      <DrawerModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        title="Select Delivery Address"
      >
        <div className="flex flex-col gap-3 pt-2">
          {savedAddresses.map((loc) => {
            const isSelected = activeAddress.id === loc.id;
            return (
              <div
                key={loc.id}
                onClick={() => {
                  setActiveAddress(loc);
                  setIsAddressModalOpen(false);
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-orange-500/10 border-orange-500 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 font-bold'
                    : 'bg-gray-50 dark:bg-zinc-850 border-gray-200 dark:border-zinc-800 text-gray-800 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-zinc-750 text-gray-600 dark:text-zinc-400'
                  }`}>
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold">{loc.tag}</p>
                    <p className="text-[11px] text-gray-500 dark:text-zinc-400 truncate mt-0.5">{loc.address}</p>
                  </div>
                </div>

                {isSelected && (
                  <Check className="h-4 w-4 text-orange-500 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </DrawerModal>

    </div>
  );
};
