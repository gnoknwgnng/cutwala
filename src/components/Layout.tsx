import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Compass, Calendar, Sparkles, Sun, Moon, MapPin, ChevronDown, Check, LogOut, Heart, Bell, Gift } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { DrawerModal, Button } from './UI';

export const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    user, 
    theme, 
    toggleTheme, 
    userAddress, 
    maxDistance,
    genderFilter, 
    setFilters,
    showToast,
    mapPanning,
    shops,
    chairs
  } = useStore();

  const openShops = shops.filter(s => s.status === 'OPEN');
  const availableSeatsCount = chairs.filter(c => c.status === 'available' && openShops.some(s => s.shop_id === c.shop_id)).length;

  // Saved locations state for header dropdown
  const savedAddresses = [
    { id: '1', tag: 'Current GPS', address: userAddress },
    { id: '2', tag: 'Home', address: 'HNo 1-7-201/2/1 Kamala Nagar, Hyderabad' },
    { id: '3', tag: 'Work', address: 'Building 4B, SOMA Tech District, SF' },
  ];
  
  const [activeAddress, setActiveAddress] = useState(savedAddresses[0]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState<boolean>(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState<boolean>(false);

  // Filter state inside drawer
  const [tempDistance, setTempDistance] = useState<number>(maxDistance);
  const [tempGender, setTempGender] = useState<'men' | 'women' | 'all'>(genderFilter);

  const mainNavItems = [
    { path: '/app/home', label: 'Explore', icon: Compass, isAction: false },
    { path: '/app/favorites', label: 'Favorites', icon: Heart, isAction: false },
    { path: '/app/rewards', label: 'Free', icon: Gift, isAction: false },
    { path: '/app/bookings', label: 'Bookings', icon: Calendar, isAction: false },
    { path: '#ai-hairstyle', label: 'AI Hairstyle', icon: Sparkles, isAction: true },
  ];

  // Bottom nav and sidebar only render on main tab routes
  const isMainTab = ['/app/home', '/app/favorites', '/app/rewards', '/app/bookings', '/app/history', '/app/profile'].includes(location.pathname);

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
        <motion.nav
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border-t border-gray-100 dark:border-zinc-800 flex h-16 items-center justify-around px-2 shadow-2xl"
          animate={{ y: mapPanning ? 80 : 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 400 }}
        >
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
        </motion.nav>
      )}

      {/* 3. MAIN CONTENT CONTAINER */}
      <motion.main
        className={`flex-1 min-h-screen relative flex flex-col ${isMainTab ? 'md:pl-64' : 'pb-0'}`}
        animate={{ paddingBottom: mapPanning ? 0 : (isMainTab ? 72 : 0) }}
        transition={{ type: 'spring', damping: 30, stiffness: 400 }}
      >
        
        {/* TOP HEADER — wrapped in overflow-hidden collapsing div so map physically expands */}
        {isMainTab && (
          <div
            style={{
              overflow: 'hidden',
              maxHeight: mapPanning ? 0 : 200,
              transition: 'max-height 0.22s cubic-bezier(0.4,0,0.2,1)',
              flexShrink: 0,
            }}
          >
          <motion.header
            className="flex flex-col bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 shrink-0 sticky top-0 z-35 backdrop-blur-md px-4 md:px-6 pt-3 pb-2 gap-0 shadow-sm"
            animate={{ opacity: mapPanning ? 0 : 1 }}
            transition={{ duration: 0.15 }}
          >

            {/* ── ROW 1: Logo + Location (left) | Bell + Men + Unisex (right) ── */}
            <div className="flex items-start justify-between gap-2 w-full">

              {/* LEFT: CutWala logo + location below */}
              <div className="flex flex-col gap-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <img
                    src="/cutwalalogo.jpeg"
                    alt="CutWala Logo"
                    className="h-8 w-8 object-contain rounded-xl shadow-sm shrink-0"
                  />
                  <span className="font-display font-extrabold text-xl bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent leading-none">
                    CutWala
                  </span>
                </div>

                {/* Location row below logo */}
                <button
                  onClick={() => setIsAddressModalOpen(true)}
                  className="flex items-center gap-1 text-[11px] font-bold text-gray-500 dark:text-zinc-400 hover:text-orange-500 transition-colors cursor-pointer ml-0.5 mt-0.5"
                  title="Change Location"
                >
                  <MapPin className="h-3 w-3 text-orange-500 fill-orange-500 shrink-0" />
                  <span className="truncate max-w-[160px]">{activeAddress.address?.split(',').slice(0,2).join(', ') || activeAddress.tag}</span>
                  <ChevronDown className="h-3 w-3 text-gray-400 shrink-0" />
                </button>
              </div>

              {/* RIGHT: Bell + Men pill + Unisex pill */}
              <div className="flex items-center gap-2 shrink-0 pt-0.5">
                {/* Notification Bell */}
                <button
                  onClick={() => setIsNotificationModalOpen(true)}
                  className="relative h-9 w-9 rounded-2xl bg-gray-100 dark:bg-zinc-800 border border-gray-200/60 dark:border-zinc-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-zinc-700 active:scale-95 transition-all cursor-pointer"
                  title="Notifications"
                >
                  <Bell className="h-4.5 w-4.5 text-gray-700 dark:text-zinc-200" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-1 ring-white dark:ring-zinc-900"></span>
                </button>

                {/* Men pill */}
                <button
                  onClick={() => setFilters({ genderFilter: 'men' })}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    genderFilter !== 'women'
                      ? 'bg-orange-50 border-orange-400 text-orange-600 dark:bg-orange-500/10 dark:border-orange-500 dark:text-orange-400'
                      : 'bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-300 hover:border-gray-300'
                  }`}
                >
                  <span>Men</span>
                </button>

                {/* Unisex pill */}
                <button
                  onClick={() => setFilters({ genderFilter: 'women' })}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    genderFilter === 'women'
                      ? 'bg-orange-50 border-orange-400 text-orange-600 dark:bg-orange-500/10 dark:border-orange-500 dark:text-orange-400'
                      : 'bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-300 hover:border-gray-300'
                  }`}
                >
                  <span>Unisex</span>
                </button>
              </div>
            </div>

            {/* ── ROW 2: "Nearby Salons" title ── */}
            <div className="mt-3">
              <h1 className="text-lg font-extrabold text-gray-900 dark:text-white leading-tight">Nearby Salons</h1>
            </div>

            {/* ── ROW 3: Live stats strip ── */}
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 dark:text-zinc-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0"></span>
                Showing only live available chairs
              </span>
              <span className="text-gray-300 dark:text-zinc-600 text-xs">|</span>
              <span className="text-[11px] font-bold text-blue-500">
                {openShops.length} Saloons
              </span>
              <span className="text-gray-300 dark:text-zinc-600 text-xs">|</span>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                {availableSeatsCount} Seats
              </span>
              <span className="ml-auto flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-emerald-500/40 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Live
              </span>
            </div>

            {/* ── ROW 4: Distance filter pills ── */}
            <div className="flex items-center gap-2 mt-2 overflow-x-auto no-scrollbar pb-1">
              {[0.1, 0.2, 0.3, 0.4, 0.5, 'custom'].map((dist) => (
                <button
                  key={dist}
                  onClick={() => setFilters({ maxDistance: typeof dist === 'number' ? dist : 5 })}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer whitespace-nowrap border shrink-0 ${
                    maxDistance === (typeof dist === 'number' ? dist : 5)
                      ? 'bg-white text-orange-500 border-orange-400 shadow-sm'
                      : 'bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 border-gray-200 dark:border-zinc-700 hover:border-gray-300'
                  }`}
                >
                  {dist === 'custom' ? (
                    <span>Custom</span>
                  ) : (
                    <span>{dist} Km{maxDistance === dist ? <span className="block text-[9px] font-semibold text-orange-400 leading-none">Closest</span> : null}</span>
                  )}
                </button>
              ))}
            </div>

          </motion.header>
          </div>
        )}

        {/* Page view outlet */}
        <div className="flex-1 flex flex-col min-h-0">
          <Outlet />
        </div>
      </motion.main>

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
