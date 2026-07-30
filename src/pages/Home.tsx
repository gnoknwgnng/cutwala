import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Star, X, Heart, Clock } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Map } from '../components/Map';
import type { BarberShop } from '../mock/mockData';
import { FeatureCarouselCard } from '../components/FeatureCarouselCard';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { chairs, setBookingShop, favoriteShops, setFavorite } = useStore();
  const [selectedShop, setSelectedShop] = useState<BarberShop | null>(null);

  const getDistanceStr = (shopId: string) => {
    const distMap: Record<string, string> = {
      shop1: '0.1 km', shop2: '0.1 km',
      shop3: '0.2 km', shop4: '0.2 km', shop5: '0.2 km',
      shop6: '0.3 km', shop7: '0.3 km', shop8: '0.3 km', shop9: '0.3 km',
      shop10: '0.4 km', shop11: '0.4 km', shop12: '0.4 km', shop13: '0.4 km',
      shop14: '0.5 km', shop15: '0.5 km', shop16: '0.5 km', shop17: '0.5 km', shop18: '0.5 km'
    };
    return distMap[shopId] || '0.4 km';
  };

  const handleSelectShop = (shop: BarberShop) => {
    setSelectedShop(shop);
  };

  const handleOpenDetails = (shopId: string) => {
    setBookingShop(shopId);
    navigate(`/app/shop/${shopId}`);
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


      {/* 2. Selected Shop Card with decreased compact height & adjusted content */}
      <AnimatePresence>
        {selectedShop && (() => {
          const shopChairs = chairs.filter(c => c.shop_id === selectedShop.shop_id);
          const chairList = shopChairs.length > 0 ? shopChairs.slice(0, 5) : [
            { chair_id: 'c1', status: 'occupied' as const },
            { chair_id: 'c2', status: 'occupied' as const },
            { chair_id: 'c3', status: 'occupied' as const },
            { chair_id: 'c4', status: 'available' as const },
            { chair_id: 'c5', status: 'available' as const }
          ];

          return (
            <motion.div
              initial={{ y: '100%', opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: '100%', opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute bottom-20 md:bottom-6 left-2 right-2 sm:left-6 sm:right-6 z-50 max-w-xl mx-auto w-[calc(100%-1rem)]"
            >
              <div 
                onClick={() => handleOpenDetails(selectedShop.shop_id)}
                className="bg-white/98 dark:bg-zinc-900/98 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-2 sm:p-2.5 px-2.5 sm:px-3.5 shadow-2xl border border-gray-200/90 dark:border-zinc-800 flex flex-row items-center gap-2 sm:gap-3 cursor-pointer relative overflow-hidden group"
              >
                {/* 1. Left: Compact Square Shop Image Thumbnail */}
                <div className="w-15 h-15 sm:w-17 sm:h-17 rounded-xl overflow-hidden shrink-0 bg-gray-100 dark:bg-zinc-800 relative border border-gray-200/60 dark:border-zinc-800 shadow-sm my-auto">
                  <img 
                    src={selectedShop.image} 
                    alt={selectedShop.name} 
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* 2. Center: Shop Info (Title, Live Badge, Rating, Address, Hours) */}
                <div className="flex-1 flex flex-col justify-center min-w-0 py-0.5 gap-0.5">
                  {/* Title + Live Badge */}
                  <div className="flex items-center gap-1 min-w-0">
                    <h3 className="font-display font-black text-xs sm:text-sm text-gray-900 dark:text-white truncate tracking-tight">
                      {selectedShop.name}
                    </h3>
                    <span className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[8px] font-bold border border-emerald-500/20 shrink-0">
                      <span className="relative flex h-1 w-1">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1 w-1 bg-emerald-500"></span>
                      </span>
                      Live
                    </span>
                  </div>

                  {/* Rating + Reviews */}
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-amber-400 fill-amber-400 shrink-0" />
                    <span className="font-extrabold text-[10px] sm:text-[11px] text-gray-800 dark:text-zinc-200">
                      {selectedShop.rating}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-gray-500 dark:text-zinc-400 font-medium">
                      (128 Reviews)
                    </span>
                  </div>

                  {/* Location Address */}
                  <div className="flex items-center gap-1 text-gray-600 dark:text-zinc-400 min-w-0">
                    <MapPin className="h-3 w-3 text-gray-400 shrink-0" />
                    <span className="text-[10px] sm:text-[11px] font-medium text-gray-600 dark:text-zinc-300 truncate">
                      {selectedShop.address}
                    </span>
                  </div>

                  {/* Closing Hours */}
                  <div className="flex items-center gap-1 text-gray-500 dark:text-zinc-400 min-w-0">
                    <Clock className="h-3 w-3 text-gray-400 shrink-0" />
                    <span className="text-[10px] sm:text-[11px] font-medium text-gray-500 dark:text-zinc-400 truncate">
                      Closes at {selectedShop.closing_time || '09:00 PM'}
                    </span>
                  </div>
                </div>

                {/* 3. Right: Distance + Heart + Dismiss + Chair Circles + Book Now Button */}
                <div className="flex flex-col justify-between items-end shrink-0 gap-1 min-w-[95px] sm:min-w-[130px] py-0.5">
                  {/* Top Right: Distance + Heart + Dismiss */}
                  <div className="flex items-center gap-1 justify-end w-full">
                    <span className="text-[10px] sm:text-[11px] font-extrabold text-gray-800 dark:text-zinc-200 mr-0.5">
                      {getDistanceStr(selectedShop.shop_id)}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFavorite(selectedShop.shop_id);
                      }}
                      className={`h-5.5 w-5.5 sm:h-6 sm:w-6 rounded-full border border-gray-200 dark:border-zinc-700 flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                        favoriteShops.includes(selectedShop.shop_id)
                          ? 'bg-rose-50 border-rose-200 text-rose-500 dark:bg-rose-500/10 dark:border-rose-500/30'
                          : 'bg-white dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 hover:text-rose-500'
                      }`}
                      title="Favorite"
                    >
                      <Heart className={`h-3 w-3 ${favoriteShops.includes(selectedShop.shop_id) ? 'fill-rose-500' : ''}`} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedShop(null);
                      }}
                      className="h-5.5 w-5.5 sm:h-6 sm:w-6 rounded-full border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                      title="Dismiss"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Middle Right: Row of Circular Chair Status Icons */}
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    {chairList.slice(0, 4).map((chair, i) => {
                      const isOccupied = chair.status === 'occupied';
                      return (
                        <div
                          key={chair.chair_id || i}
                          className={`w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                            isOccupied
                              ? 'border-rose-500 text-rose-500 bg-rose-50/40 dark:bg-rose-950/20'
                              : 'border-gray-300 dark:border-zinc-700 text-gray-400 dark:text-zinc-600 bg-gray-50/40 dark:bg-zinc-800/40'
                          }`}
                          title={isOccupied ? 'Occupied Chair' : 'Available Chair'}
                        >
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <rect x="9" y="2" width="6" height="3" rx="1" />
                            <path d="M8 6C8 5.44772 8.44772 5 9 5H15C15.5523 5 16 5.44772 16 6V12H8V6Z" />
                            <rect x="5" y="13" width="14" height="3" rx="1.5" />
                            <path d="M12 16V20M8 20H16M6 18L4 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </div>
                      );
                    })}
                  </div>

                  {/* Bottom Right: Pink/Magenta Book Now Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDetails(selectedShop.shop_id);
                    }}
                    className="w-full py-1 sm:py-1.5 px-2.5 sm:px-3.5 bg-[#ff0055] hover:bg-[#e0004c] text-white font-extrabold text-[10px] sm:text-[11px] rounded-xl shadow-md shadow-rose-500/25 transition-all active:scale-95 cursor-pointer text-center whitespace-nowrap"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* ========== FLOATING AUTO-SLIDING FEATURE CAROUSEL CARD (5s Duration) ========== */}
      {!selectedShop && (
        <FeatureCarouselCard onSelectShop={handleSelectShop} />
      )}

    </div>
  );
};
