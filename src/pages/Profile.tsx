import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, Heart, LogOut, ShieldCheck, Sun, Moon, ChevronRight } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, favoriteShops, shops, bookings, theme, toggleTheme } = useStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Safe checks if user is loaded
  const currentUser = user || {
    name: 'Alexander Mercer',
    email: 'alexander.mercer@gmail.com',
    phone: '+1 (555) 019-2834',
    profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
  };

  // Filter favorite shops details
  const favShopDetails = shops.filter(s => favoriteShops.includes(s.shop_id));

  // Statistics calculation
  const completedVisits = bookings.filter(b => b.status === 'completed').length;
  const memberSince = new Date(currentUser.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-zinc-950 p-4 md:p-6 overflow-y-auto no-scrollbar select-none animate-fade-in pb-24">
      
      {/* Page Header */}
      <div className="max-w-2xl mx-auto w-full mb-6">
        <h1 className="font-display font-extrabold text-2xl md:text-3xl text-gray-900 dark:text-white">
          My Profile
        </h1>
        <p className="text-gray-500 dark:text-zinc-450 text-xs mt-1">
          Manage your account settings, statistics, and favorite shops
        </p>
      </div>

      <div className="max-w-2xl mx-auto w-full flex flex-col gap-6">
        
        {/* User Card Layout */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-150/40 dark:border-zinc-800/80 shadow-md p-5 flex flex-col sm:flex-row items-center gap-5">
          <img 
            src={currentUser.profile_image} 
            alt={currentUser.name} 
            className="h-20 w-20 rounded-full object-cover border-2 border-amber-500 bg-zinc-150 dark:bg-zinc-800 shrink-0"
          />
          <div className="text-center sm:text-left flex-1 min-w-0">
            <h2 className="font-display font-extrabold text-xl text-gray-900 dark:text-white truncate">
              {currentUser.name}
            </h2>
            <div className="flex flex-col gap-1 mt-2.5">
              <span className="text-xs text-gray-500 dark:text-zinc-400 font-semibold flex items-center justify-center sm:justify-start gap-2">
                <Mail className="h-3.5 w-3.5 text-amber-500 shrink-0" /> {currentUser.email}
              </span>
              <span className="text-xs text-gray-500 dark:text-zinc-400 font-semibold flex items-center justify-center sm:justify-start gap-2">
                <Phone className="h-3.5 w-3.5 text-amber-500 shrink-0" /> {currentUser.phone}
              </span>
            </div>
          </div>
        </div>

        {/* Statistical Tracker Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-150/40 dark:border-zinc-800/80 p-3.5 text-center shadow-sm">
            <h3 className="text-xl font-extrabold text-amber-500 font-display">{completedVisits}</h3>
            <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider mt-1">Total Visits</p>
          </div>
          
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-150/40 dark:border-zinc-800/80 p-3.5 text-center shadow-sm">
            <h3 className="text-xl font-extrabold text-amber-500 font-display">{favoriteShops.length}</h3>
            <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider mt-1">Fav Salons</p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-150/40 dark:border-zinc-800/80 p-3.5 text-center shadow-sm flex flex-col justify-center">
            <h3 className="text-[11px] font-extrabold text-gray-800 dark:text-white truncate">{memberSince}</h3>
            <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider mt-1">Joined</p>
          </div>
        </div>

        {/* Favorite Salons List */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-550 mb-3 flex items-center gap-1.5 px-1">
            <Heart className="h-4 w-4 text-amber-500 fill-amber-500" /> Favorite Barber Shops
          </h3>
          
          {favShopDetails.length === 0 ? (
            <div className="p-5 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-150/40 dark:border-zinc-800/80 text-center text-xs font-semibold text-gray-500 dark:text-zinc-450">
              You haven't favorited any shops yet.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {favShopDetails.map((shop) => (
                <div
                  key={shop.shop_id}
                  onClick={() => navigate(`/app/shop/${shop.shop_id}`)}
                  className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-150/40 dark:border-zinc-800/80 p-3.5 flex gap-4 cursor-pointer hover:border-amber-500/20 transition-colors"
                >
                  <img 
                    src={shop.image} 
                    alt={shop.name} 
                    className="h-12 w-12 rounded-xl object-cover border border-gray-250/20 shrink-0 bg-zinc-150 dark:bg-zinc-800"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">{shop.name}</h4>
                    <p className="text-[10px] text-gray-500 dark:text-zinc-450 truncate mt-0.5">{shop.address}</p>
                  </div>
                  <div className="flex items-center text-amber-500 font-bold text-xs shrink-0">
                    ⭐ {shop.rating} <ChevronRight className="h-4 w-4 ml-1 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Global Controls & Logout */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-150/40 dark:border-zinc-800/80 shadow-sm overflow-hidden divide-y divide-gray-100 dark:divide-zinc-850">
          
          {/* Theme Settings Toggle */}
          <div className="flex items-center justify-between p-4 font-semibold text-sm">
            <div className="flex items-center gap-3 text-gray-700 dark:text-zinc-300">
              {theme === 'light' ? <Sun className="h-5 w-5 text-gray-400" /> : <Moon className="h-5 w-5 text-amber-500" />}
              <span>Dark Theme</span>
            </div>
            
            <button 
              onClick={toggleTheme}
              className={`w-12 h-6.5 rounded-full p-1 transition-all duration-350 cursor-pointer ${
                theme === 'dark' ? 'bg-amber-500' : 'bg-gray-200 dark:bg-zinc-800'
              }`}
            >
              <div className={`h-4.5 w-4.5 rounded-full bg-white dark:bg-zinc-950 transition-transform duration-350 ${
                theme === 'dark' ? 'translate-x-5.5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Safety disclaimer */}
          <div className="flex items-center gap-3 p-4 font-semibold text-sm text-gray-750 dark:text-zinc-300">
            <ShieldCheck className="h-5 w-5 text-amber-500" />
            <span>Biometric login / TouchID</span>
            <span className="ml-auto text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full">Active</span>
          </div>

          {/* Logout Action */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-4 font-bold text-sm text-rose-500 hover:bg-rose-500/5 transition-colors cursor-pointer text-left"
          >
            <LogOut className="h-5 w-5 text-rose-500" />
            <span>Log Out Account</span>
          </button>
        </div>

      </div>

    </div>
  );
};
