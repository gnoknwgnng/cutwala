import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Compass, Calendar, Sparkles, Sun, Moon, MapPin, ChevronDown, Check, Search, LogOut, Heart, Bell } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { DrawerModal, Button } from './UI';

export const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    user, 
    theme, 
    toggleTheme, 
    userAddress, 
    searchQuery, 
    setSearchQuery, 
    maxDistance, 
    genderFilter, 
    setFilters,
    showToast 
  } = useStore();

  // Saved locations state for header dropdown
  const savedAddresses = [
    { id: '1', tag: 'Current GPS', address: userAddress },
    { id: '2', tag: 'Home', address: 'HNo 1-7-201/2/1 Kamala Nagar, Hyderabad' },
    { id: '3', tag: 'Work', address: 'Building 4B, SOMA Tech District, SF' },
  ];
  
  const [activeAddress, setActiveAddress] = useState(savedAddresses[0]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState<boolean>(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState<boolean>(false);

  // Flashing rotating recommendation suggestions inside the search bar
  const recommendationList = [
    { text: '✨ Best Barber', query: 'Best Barber' },
    { text: '🔥 Top Rated', query: 'Top Rated' },
    { text: '💈 Crown Salon', query: 'Crown Salon' },
    { text: '✂️ Fade Studio', query: 'Fade Studio' },
    { text: '⚡ Razor Edge', query: 'Razor Edge' },
    { text: '🧔 Beard Sculpt', query: 'Beard Sculpt' },
  ];

  const [recIndex, setRecIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRecIndex((prev) => (prev + 1) % recommendationList.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [recommendationList.length]);

  // Filter state inside drawer
  const [tempDistance, setTempDistance] = useState<number>(maxDistance);
  const [tempGender, setTempGender] = useState<'men' | 'women' | 'all'>(genderFilter);

  const mainNavItems = [
    { path: '/app/home', label: 'Explore', icon: Compass, isAction: false },
    { path: '/app/favorites', label: 'Favorites', icon: Heart, isAction: false },
    { path: '/app/bookings', label: 'Bookings', icon: Calendar, isAction: false },
    { path: '#ai-hairstyle', label: 'AI Hairstyle', icon: Sparkles, isAction: true },
  ];

  // Bottom nav and sidebar only render on main tab routes
  const isMainTab = ['/app/home', '/app/favorites', '/app/bookings', '/app/history', '/app/profile'].includes(location.pathname);

  const handleNavClick = (item: typeof mainNavItems[0], e: React.MouseEvent) => {
    if (item.isAction) {
      e.preventDefault();
      showToast('AI Hairstyle recommendation is coming soon! Stay tuned.', 'info');
    }
  };

  const handleApplyFilter = () => {
    setFilters({ maxDistance: tempDistance, genderFilter: tempGender });
    setIsFilterModalOpen(false);
    showToast(`Filters Applied: ${tempGender.toUpperCase()} • ${tempDistance}km`, 'success');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#0b0b0c] dark:text-gray-100 flex flex-col md:flex-row transition-colors duration-300">
      
      {/* 1. DESKTOP LEFT SIDEBAR */}
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
                    key={item.label}
                    to={item.path}
                    onClick={(e) => handleNavClick(item, e)}
                    className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
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

          {/* Sidebar Footer */}
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

      {/* 2. MOBILE BOTTOM NAVIGATION BAR (Featuring AI Hairstyle on far right) */}
      {isMainTab && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border-t border-gray-100 dark:border-zinc-800 flex h-16 items-center justify-around px-2 shadow-2xl">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={(e) => handleNavClick(item, e)}
                className="relative flex flex-col items-center justify-center py-1 px-3 min-w-[70px] cursor-pointer"
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
        
        {/* TOP HEADER: Logo with Address + Gender Toggle + Full Search Bar + Notification Bell */}
        {isMainTab && (
          <header className="flex flex-col bg-white/95 dark:bg-zinc-900/95 border-b border-gray-100 dark:border-zinc-800 shrink-0 sticky top-0 z-35 backdrop-blur-md px-3 md:px-6 py-2.5 gap-2.5 shadow-sm">
            
            {/* ROW 1: Logo & Address (Left) | Gender Toggle (Center) | Notification Bell (Right) */}
            <div className="flex items-center justify-between gap-2 w-full">
              
              {/* Logo & User Address Stacked Directly Below */}
              <div className="flex flex-col justify-center min-w-0 shrink-0">
                {/* Logo */}
                <div className="flex items-center gap-1.5">
                  <img 
                    src="/cutwalalogo.jpeg" 
                    alt="CutWala Logo" 
                    className="h-7 w-7 object-contain rounded-lg shadow-sm"
                  />
                  <span className="font-display font-extrabold text-base md:text-lg bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                    CutWala
                  </span>
                </div>

                {/* USER ADDRESS VISIBLE DIRECTLY BELOW LOGO */}
                <button
                  onClick={() => setIsAddressModalOpen(true)}
                  className="flex items-center gap-1 text-[10px] font-extrabold text-gray-700 dark:text-zinc-300 hover:text-orange-500 transition-colors cursor-pointer max-w-[130px] sm:max-w-[200px] truncate mt-0.5"
                  title="Change Location"
                >
                  <MapPin className="h-3 w-3 text-orange-500 shrink-0 fill-orange-500" />
                  <span className="truncate">{activeAddress.tag} - {activeAddress.address}</span>
                  <ChevronDown className="h-3 w-3 text-gray-400 shrink-0" />
                </button>
              </div>

              {/* SLIDING MEN vs WOMEN TOGGLE BAR (NO 'ALL' OPTION, LEFT MEN - RIGHT WOMEN) */}
              <div className="relative flex items-center p-1 bg-gray-150 dark:bg-zinc-800 rounded-full border border-gray-250 dark:border-zinc-700 shrink-0 shadow-inner">
                {/* Sliding active orange background pill */}
                <motion.div
                  className="absolute top-1 bottom-1 rounded-full bg-orange-500 shadow-md"
                  initial={false}
                  animate={{
                    left: genderFilter === 'women' ? '50%' : '4px',
                    width: 'calc(50% - 4px)',
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />

                {/* Left: Men */}
                <button
                  onClick={() => setFilters({ genderFilter: 'men' })}
                  className={`relative z-10 px-3.5 py-1 text-xs font-black transition-colors cursor-pointer flex items-center gap-1 ${
                    genderFilter !== 'women'
                      ? 'text-white'
                      : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <span>👨 Men</span>
                </button>

                {/* Right: Women */}
                <button
                  onClick={() => setFilters({ genderFilter: 'women' })}
                  className={`relative z-10 px-3.5 py-1 text-xs font-black transition-colors cursor-pointer flex items-center gap-1 ${
                    genderFilter === 'women'
                      ? 'text-white'
                      : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <span>👩 Women</span>
                </button>
              </div>

              {/* NOTIFICATION BELL BUTTON (100% VISIBLE ON FAR RIGHT) */}
              <button
                onClick={() => setIsNotificationModalOpen(true)}
                className="relative h-9 w-9 rounded-2xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-200 flex items-center justify-center shrink-0 cursor-pointer transition-all active:scale-95 border border-gray-200/50 dark:border-zinc-700/50 ml-1"
                title="Notifications"
              >
                <Bell className="h-4.5 w-4.5 text-orange-500" />
                {/* Active Notification Badge Red Dot */}
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-zinc-900 animate-pulse"></span>
              </button>

            </div>

            {/* ROW 2: FULLY VISIBLE PROMINENT SEARCH BAR WITH FLASHING ANIMATED RECOMMENDATION */}
            <div className="w-full relative">
              <div className="relative w-full flex items-center">
                <Search className="absolute left-3.5 z-20 h-4 w-4 text-orange-500" />
                
                {/* FLASHING / ROTATING RECOMMENDATION PLACEHOLDER OVERLAY */}
                {!searchQuery && (
                  <div 
                    onClick={() => {
                      setSearchQuery(recommendationList[recIndex].query);
                    }}
                    className="absolute left-9.5 right-4 z-10 flex items-center gap-1.5 pointer-events-auto cursor-text text-xs font-bold text-gray-400 dark:text-zinc-500 overflow-hidden select-none"
                  >
                    <span className="shrink-0 text-gray-400 dark:text-zinc-500 font-normal text-[11px]">Search</span>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={recIndex}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="px-2 py-0.5 rounded-lg bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 font-extrabold text-[11px] border border-orange-500/20 flex items-center gap-1 shadow-sm"
                      >
                        {recommendationList[recIndex].text}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                )}

                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-9.5 pl-10 pr-4 text-xs font-semibold rounded-2xl bg-gray-100 dark:bg-zinc-800 border border-transparent focus:border-orange-500 focus:bg-white dark:focus:bg-zinc-900 text-gray-900 dark:text-white transition-all outline-none"
                />

                {/* SEARCH RECOMMENDATIONS POPOVER */}
                {isSearchFocused && (
                  <div className="absolute top-11 left-0 right-0 z-50 bg-white dark:bg-zinc-900 rounded-2xl p-3.5 shadow-2xl border border-gray-150 dark:border-zinc-800 flex flex-col gap-2.5 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                        Quick Suggestions
                      </span>
                      {searchQuery && (
                        <button
                          onMouseDown={() => setSearchQuery('')}
                          className="text-[10px] font-bold text-orange-500 hover:underline cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {recommendationList.map((rec) => (
                        <button
                          key={rec.text}
                          onMouseDown={() => {
                            setSearchQuery(rec.query);
                            setIsSearchFocused(false);
                          }}
                          className="px-2.5 py-1 rounded-xl text-xs font-extrabold bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 dark:hover:text-white transition-all cursor-pointer border border-orange-200/60 dark:border-orange-500/20 active:scale-95"
                        >
                          {rec.text}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </header>
        )}

        {/* Page view outlet */}
        <div className="flex-1 flex flex-col min-h-0">
          <Outlet />
        </div>
      </main>

      {/* 4. SIDE FILTER DRAWER MODAL */}
      <DrawerModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="Filter Barber Shops"
      >
        <div className="flex flex-col gap-6 pt-2">

          {/* B. DISTANCE RANGE SLIDER */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-extrabold text-gray-800 dark:text-zinc-200 uppercase tracking-wider">
                Distance Range
              </label>
              <span className="text-xs font-extrabold text-orange-500 bg-orange-50 dark:bg-orange-500/10 px-2.5 py-1 rounded-lg">
                Within {tempDistance} km
              </span>
            </div>
            
            <input
              type="range"
              min="1"
              max="25"
              step="1"
              value={tempDistance}
              onChange={(e) => setTempDistance(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <div className="flex justify-between text-[10px] font-bold text-gray-400 dark:text-zinc-500">
              <span>1 km</span>
              <span>10 km</span>
              <span>25 km</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setTempDistance(10);
                setTempGender('men');
              }}
              className="flex-1 h-12 text-xs font-extrabold cursor-pointer"
            >
              Reset
            </Button>
            <Button
              variant="primary"
              onClick={handleApplyFilter}
              className="flex-1 h-12 text-xs font-extrabold bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
            >
              Apply Filters
            </Button>
          </div>

        </div>
      </DrawerModal>

      {/* 5. NOTIFICATIONS DRAWER MODAL */}
      <DrawerModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        title="Notifications & Updates"
      >
        <div className="flex flex-col gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex gap-3 items-start">
            <div className="h-8 w-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-gray-900 dark:text-white">Active Appointment Scheduled</p>
              <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5">Your haircut at The Razor's Edge is confirmed for 10:30 AM.</p>
              <span className="text-[9px] font-bold text-orange-500 mt-1 block">10 mins ago</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex gap-3 items-start">
            <div className="h-8 w-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-gray-900 dark:text-white">CutWala AI Hairstyle Feature</p>
              <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5">AI virtual try-on features coming soon to your area!</p>
              <span className="text-[9px] font-bold text-emerald-500 mt-1 block">1 hour ago</span>
            </div>
          </div>
        </div>
      </DrawerModal>

      {/* 5. LOCATION SELECTION MODAL */}
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
