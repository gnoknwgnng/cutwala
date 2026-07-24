import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Star, ArrowRight, X, Heart, Clock, ChevronDown } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Map } from '../components/Map';
import type { BarberShop } from '../mock/mockData';
import { Badge } from '../components/UI';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { shops, maxDistance, setFilters, setBookingShop, favoriteShops, setFavorite } = useStore();
  const [selectedShop, setSelectedShop] = useState<BarberShop | null>(null);
  const [showFavourites, setShowFavourites] = useState(false);

  // Read favourite shop IDs from localStorage (synced with Map.tsx heart toggle)
  const [favShopIds, setFavShopIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('cutwala_favourites');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  // Re-read when drawer opens or page focuses
  useEffect(() => {
    const sync = () => {
      try {
        const stored = localStorage.getItem('cutwala_favourites');
        setFavShopIds(stored ? JSON.parse(stored) : []);
      } catch { /* ignore */ }
    };
    window.addEventListener('focus', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('focus', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  // Also poll for changes every 500ms (Map.tsx heart toggle doesn't fire storage event on same tab)
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const stored = localStorage.getItem('cutwala_favourites');
        const next: string[] = stored ? JSON.parse(stored) : [];
        setFavShopIds(prev => {
          if (JSON.stringify(prev) !== JSON.stringify(next)) return next;
          return prev;
        });
      } catch { /* ignore */ }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const openShops = shops.filter(shop => shop.status === 'OPEN');
  const favouriteShopList = shops.filter(s => favShopIds.includes(s.shop_id));

  const totalAvailableSeats = openShops.reduce((sum, shop) => {
    let total = 6, taken = 0;
    if (shop.shop_id === 'shop1') { total = 6; taken = 0; }
    if (shop.shop_id === 'shop2') { total = 6; taken = 2; }
    if (shop.shop_id === 'shop3') { total = 4; taken = 3; }
    return sum + (total - taken);
  }, 0);

  const getDistanceStr = (shopId: string) => {
    if (shopId === 'shop1') return '0.8 km';
    if (shopId === 'shop2') return '1.2 km';
    if (shopId === 'shop3') return '1.8 km';
    return '1.1 km';
  };

  const getChairStatus = (shopId: string) => {
    let total = 6, taken = 0;
    if (shopId === 'shop1') { total = 6; taken = 0; }
    if (shopId === 'shop2') { total = 6; taken = 2; }
    if (shopId === 'shop3') { total = 4; taken = 3; }
    return { total, available: total - taken };
  };

  const handleSelectShop = (shop: BarberShop) => {
    setSelectedShop(shop);
    setShowFavourites(false);
  };

  const handleOpenDetails = (shopId: string) => {
    setBookingShop(shopId);
    navigate(`/app/shop/${shopId}`);
  };

  const removeFavourite = (shopId: string) => {
    const next = favShopIds.filter(id => id !== shopId);
    setFavShopIds(next);
    localStorage.setItem('cutwala_favourites', JSON.stringify(next));
    if (next.length === 0) setShowFavourites(false);
  };

  return (
    <div className="relative flex-1 flex flex-col h-full w-full bg-[#f3f4f6] dark:bg-zinc-950 overflow-hidden select-none">
      
      {/* 1. Full-screen Vector Map */}
      <div className="absolute inset-0 z-0">
        <Map 
          selectedShop={selectedShop} 
          onSelectShop={handleSelectShop} 
          searchQuery="" 
        />
      </div>

      {/* TOP MAP HEADER BAR & DISTANCE RADIUS FILTERS */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-col gap-2 max-w-lg mx-auto pointer-events-auto pr-12 md:pr-16">
        
        {/* Header Bar */}
        <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-2xl p-2 px-3 shadow-lg border border-gray-200/80 dark:border-zinc-800 flex items-center justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="font-display font-extrabold text-xs md:text-sm text-gray-900 dark:text-white leading-tight">
                Nearby Salons
              </h2>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            </div>
            <span className="text-[9.5px] font-bold text-gray-500 dark:text-zinc-400 truncate">
              Live Available Chairs
            </span>
          </div>
          <div className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-black shrink-0 flex items-center gap-1 shadow-xs">
            <span>💺</span>
            <span>{totalAvailableSeats} Seats</span>
            <span className="text-[10px] font-bold text-emerald-700/80 dark:text-emerald-300/80">({maxDistance}km)</span>
          </div>
        </div>

        {/* Distance Range Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 pr-2">
          {[0.5, 1, 2, 3, 5, 10].map((dist) => (
            <button
              key={dist}
              onClick={() => setFilters({ maxDistance: dist })}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer whitespace-nowrap shadow-sm border ${
                maxDistance === dist
                  ? 'bg-orange-500 text-white border-orange-500 shadow-orange-500/30 scale-105'
                  : 'bg-white/95 dark:bg-zinc-900/95 text-gray-700 dark:text-zinc-300 border-gray-200/80 dark:border-zinc-800 hover:bg-white'
              }`}
            >
              {dist === 0.5 ? '0.5 Km Closest' : dist === 10 ? 'Custom 🎛️' : `${dist} Km`}
            </button>
          ))}
        </div>
      </div>

      {/* Floating Favourites Tab Button (bottom-left, shown when there are favourites) */}
      <AnimatePresence>
        {favouriteShopList.length > 0 && !selectedShop && !showFavourites && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            onClick={() => setShowFavourites(true)}
            className="absolute bottom-6 left-4 z-30 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/97 dark:bg-zinc-900/97 backdrop-blur-xl shadow-xl border border-pink-200 dark:border-pink-800/60 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
          >
            <Heart className="h-4 w-4 fill-pink-500 text-pink-500" />
            <span className="font-extrabold text-xs text-pink-600 dark:text-pink-400">Favourites</span>
            <span className="bg-pink-500 text-white rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center text-[10px] font-black">
              {favouriteShopList.length}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* 2. Single Selected Shop Slide-Up Card (Google Maps style) */}
      <AnimatePresence>
        {selectedShop && (
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="absolute bottom-6 left-4 right-4 z-20 max-w-md mx-auto w-[calc(100%-2rem)]"
          >
            <div 
              onClick={() => handleOpenDetails(selectedShop.shop_id)}
              className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-3xl p-4 shadow-2xl border border-orange-500/30 flex gap-4 cursor-pointer relative group overflow-hidden"
            >
              {/* Top Action Buttons (Close & Favorite) */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFavorite(selectedShop.shop_id);
                  }}
                  className={`h-7 w-7 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                    favoriteShops.includes(selectedShop.shop_id)
                      ? 'bg-rose-500/10 text-rose-500'
                      : 'bg-gray-100 dark:bg-zinc-800 text-gray-400 hover:text-rose-500'
                  }`}
                  title="Favorite"
                >
                  <Heart className={`h-4 w-4 ${favoriteShops.includes(selectedShop.shop_id) ? 'fill-rose-500' : ''}`} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedShop(null);
                  }}
                  className="h-7 w-7 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                  title="Dismiss"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Shop Image */}
              <div className="h-24 w-24 rounded-2xl overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800 relative border border-gray-250/20">
                <img 
                  src={selectedShop.image} 
                  alt={selectedShop.name} 
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-1.5 left-1.5">
                  <Badge status="OPEN" className="scale-75 origin-left" />
                </div>
              </div>

              {/* Info panel */}
              <div className="flex-1 flex flex-col justify-between min-w-0 pr-6">
                <div>
                  <h3 className="font-display font-extrabold text-base text-gray-900 dark:text-white truncate">
                    {selectedShop.name}
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-zinc-400 truncate mt-0.5">
                    {selectedShop.address}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 dark:border-zinc-800 pt-2 mt-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold text-gray-800 dark:text-zinc-200 flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-orange-500 fill-orange-500" /> {selectedShop.rating}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 flex items-center gap-0.5">
                      <MapPin className="h-3 w-3 text-orange-500" /> {getDistanceStr(selectedShop.shop_id)}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDetails(selectedShop.shop_id);
                    }}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
                  >
                    <span>Book</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== FAVOURITES BOTTOM DRAWER ========== */}
      <AnimatePresence>
        {showFavourites && !selectedShop && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFavourites(false)}
              className="absolute inset-0 z-25 bg-black/25 backdrop-blur-[2px]"
            />

            {/* Drawer Panel */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 z-30 rounded-t-3xl bg-white dark:bg-zinc-900 shadow-2xl border-t border-pink-100 dark:border-pink-900/40 flex flex-col"
              style={{ maxHeight: '72vh' }}
            >
              {/* Handle bar */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-gray-200 dark:bg-zinc-700" />
              </div>

              {/* Drawer Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 fill-pink-500 text-pink-500" />
                  <h2 className="font-extrabold text-base text-gray-900 dark:text-white">My Favourites</h2>
                  <span className="bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400 text-xs font-black px-2 py-0.5 rounded-full">
                    {favouriteShopList.length}
                  </span>
                </div>
                <button
                  onClick={() => setShowFavourites(false)}
                  className="h-8 w-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              {/* Favourite Shop Cards */}
              <div className="overflow-y-auto flex-1 px-4 py-3 space-y-3 pb-8">
                {favouriteShopList.map((shop) => {
                  const { total, available } = getChairStatus(shop.shop_id);
                  const chairColor = available === total ? '#10b981' : available === 0 ? '#ef4444' : '#f59e0b';
                  const reviewCount = shop.shop_id === 'shop1' ? 128 : shop.shop_id === 'shop2' ? 94 : 61;

                  return (
                    <motion.div
                      key={shop.shop_id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -80 }}
                      className="bg-white dark:bg-zinc-800 rounded-2xl shadow-md border border-gray-100 dark:border-zinc-700 overflow-hidden flex"
                    >
                      {/* Left: Shop Image with Live Badge */}
                      <div className="w-[90px] shrink-0 relative">
                        <img
                          src={shop.image}
                          alt={shop.name}
                          className="w-full h-full object-cover"
                          style={{ minHeight: 110 }}
                        />
                        {/* Live Badge */}
                        <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-emerald-500 px-1.5 py-0.5 rounded-full">
                          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                          <span className="text-[8px] font-black text-white">LIVE</span>
                        </div>
                      </div>

                      {/* Right: Details */}
                      <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                        <div>
                          {/* Name + remove heart */}
                          <div className="flex items-start justify-between gap-1">
                            <h3 className="font-extrabold text-sm text-gray-900 dark:text-white leading-tight flex-1 truncate">
                              {shop.name}
                            </h3>
                            <button
                              onClick={() => removeFavourite(shop.shop_id)}
                              className="shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-pink-50 dark:bg-pink-900/30 transition-colors cursor-pointer hover:bg-pink-100"
                            >
                              <Heart className="h-3.5 w-3.5 fill-pink-500 text-pink-500" />
                            </button>
                          </div>

                          {/* Rating */}
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Star className="h-3 w-3 text-orange-500 fill-orange-500 shrink-0" />
                            <span className="text-xs font-bold text-gray-800 dark:text-zinc-200">{shop.rating}</span>
                            <span className="text-[10px] text-gray-400 dark:text-zinc-500">({reviewCount} Reviews)</span>
                          </div>

                          {/* Address */}
                          <div className="flex items-center gap-1 mt-1">
                            <MapPin className="h-2.5 w-2.5 text-orange-500 shrink-0" />
                            <span className="text-[10px] text-gray-500 dark:text-zinc-400 truncate">
                              {shop.address.split(',')[0]}
                            </span>
                          </div>

                          {/* Closing time */}
                          <div className="flex items-center gap-1 mt-0.5">
                            <Clock className="h-2.5 w-2.5 text-gray-400 shrink-0" />
                            <span className="text-[10px] text-gray-400 dark:text-zinc-500">
                              Closes at {shop.closing_time}
                            </span>
                          </div>
                        </div>

                        {/* Bottom row: Chair Status + Book Now */}
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-zinc-700">
                          {/* Chair status box */}
                          <div
                            className="flex flex-col items-center justify-center px-2.5 py-1 rounded-xl border font-extrabold leading-tight"
                            style={{ borderColor: chairColor, color: chairColor, background: `${chairColor}18` }}
                          >
                            <span className="text-xs font-black">{available}/{total}</span>
                            <span className="text-[8px]">Available</span>
                          </div>

                          {/* Book Now */}
                          <button
                            onClick={() => handleOpenDetails(shop.shop_id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-extrabold text-[11px] rounded-xl shadow-md transition-all cursor-pointer"
                          >
                            Book Now
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};
