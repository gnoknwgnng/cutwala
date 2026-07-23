import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Compass, Calendar, Sparkles, Sun, Moon, MapPin, ChevronDown, Check, Search, SlidersHorizontal, LogOut } from 'lucide-react';
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

  // Filter state inside drawer
  const [tempDistance, setTempDistance] = useState<number>(maxDistance);
  const [tempGender, setTempGender] = useState<'men' | 'women' | 'all'>(genderFilter);

  const mainNavItems = [
    { path: '/app/home', label: 'Explore', icon: Compass, isAction: false },
    { path: '/app/bookings', label: 'Bookings', icon: Calendar, isAction: false },
    { path: '#ai-hairstyle', label: 'AI Hairstyle', icon: Sparkles, isAction: true },
  ];

  // Bottom nav and sidebar only render on main tab routes
  const isMainTab = ['/app/home', '/app/bookings', '/app/history', '/app/profile'].includes(location.pathname);

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
        
        {/* TOP HEADER: Search Bar with Side Filter (In Place of Profile) */}
        {isMainTab && (
          <header className="flex h-16 items-center justify-between px-3 md:px-6 bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 shrink-0 sticky top-0 z-35 backdrop-blur-md bg-opacity-95 dark:bg-opacity-95 gap-3">
            
            {/* Logo */}
            <div className="flex items-center gap-2 shrink-0">
              <img 
                src="/cutwalalogo.jpeg" 
                alt="CutWala Logo" 
                className="h-8 w-8 object-contain rounded-lg shadow-sm"
              />
              <span className="font-display font-extrabold text-lg bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent hidden sm:inline">
                CutWala
              </span>
            </div>

            {/* Address Capsule */}
            <button
              onClick={() => setIsAddressModalOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 dark:bg-zinc-800 border border-orange-200/60 dark:border-zinc-700/60 rounded-xl text-left cursor-pointer hover:bg-orange-100/60 transition-colors"
            >
              <MapPin className="h-3.5 w-3.5 text-orange-500 shrink-0 fill-orange-500" />
              <p className="text-xs font-extrabold text-gray-900 dark:text-white truncate leading-tight max-w-[200px]">
                <span className="font-black text-gray-950 dark:text-white">{activeAddress.tag}</span>
                <span className="font-normal text-gray-600 dark:text-zinc-400"> - {activeAddress.address}</span>
              </p>
              <ChevronDown className="h-3.5 w-3.5 text-gray-500 shrink-0" />
            </button>

            {/* SEARCH BAR WITH SIDE FILTER (Replaces Profile) */}
            <div className="flex-1 flex items-center gap-2 max-w-md ml-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search shops, barbers, services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 text-xs font-semibold rounded-2xl bg-gray-100 dark:bg-zinc-800 border border-transparent focus:border-orange-500 focus:bg-white dark:focus:bg-zinc-900 text-gray-900 dark:text-white transition-all outline-none"
                />
              </div>

              {/* Side Filter Icon Button */}
              <button
                onClick={() => setIsFilterModalOpen(true)}
                className="h-10 w-10 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0 cursor-pointer transition-all active:scale-95"
                title="Filter Options"
              >
                <SlidersHorizontal className="h-4.5 w-4.5" />
              </button>
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
          
          {/* A. MEN vs WOMEN TOGGLE BAR */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-extrabold text-gray-800 dark:text-zinc-200 uppercase tracking-wider">
              Gender Category
            </label>
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-gray-100 dark:bg-zinc-850 rounded-2xl border border-gray-200 dark:border-zinc-800">
              <button
                onClick={() => setTempGender('men')}
                className={`py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  tempGender === 'men'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                👨 Men
              </button>
              <button
                onClick={() => setTempGender('women')}
                className={`py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  tempGender === 'women'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                👩 Women
              </button>
              <button
                onClick={() => setTempGender('all')}
                className={`py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  tempGender === 'all'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                💈 All
              </button>
            </div>
          </div>

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
