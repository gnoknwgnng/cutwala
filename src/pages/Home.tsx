import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, Heart, ArrowRight } from 'lucide-react';
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


      {/* 2. Ultra-Compact Single-Line Shop Pill Bar (Takes minimal space on map) */}
      <AnimatePresence>
        {selectedShop && (() => {
          const shopChairs = chairs.filter(c => c.shop_id === selectedShop.shop_id);
          const chairList = shopChairs.length > 0 ? shopChairs.slice(0, 4) : [
            { chair_id: 'c1', status: 'occupied' as const },
            { chair_id: 'c2', status: 'occupied' as const },
            { chair_id: 'c3', status: 'occupied' as const },
            { chair_id: 'c4', status: 'available' as const }
          ];

          return (
            <motion.div
              initial={{ y: '100%', opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: '100%', opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute bottom-20 sm:bottom-24 left-2 right-2 sm:left-6 sm:right-6 z-50 max-w-lg mx-auto w-[calc(100%-1rem)]"
            >
              <div 
                onClick={() => handleOpenDetails(selectedShop.shop_id)}
                className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-full p-1.5 px-2.5 sm:px-3.5 shadow-xl border border-gray-200/90 dark:border-zinc-800 flex items-center justify-between gap-1.5 sm:gap-2 cursor-pointer relative overflow-hidden group h-12 sm:h-13"
              >
                {/* 1. Left: Compact Shop Avatar */}
                <div className="relative shrink-0">
                  <img 
                    src={selectedShop.image} 
                    alt={selectedShop.name} 
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-white dark:border-zinc-800 shadow-sm"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-white dark:border-zinc-900 flex items-center justify-center">
                    <span className="h-1 w-1 rounded-full bg-white animate-pulse" />
                  </span>
                </div>

                {/* 2. Middle: Shop Name + Rating */}
                <div className="flex-1 flex items-center gap-1.5 min-w-0">
                  <h3 className="font-display font-black text-xs text-gray-900 dark:text-white truncate tracking-tight">
                    {selectedShop.name}
                  </h3>
                  <div className="flex items-center gap-0.5 text-[10px] font-extrabold text-amber-500 shrink-0">
                    <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                    <span>{selectedShop.rating}</span>
                  </div>
                  <span className="text-[9px] font-bold text-gray-400 shrink-0 hidden xs:inline">• {getDistanceStr(selectedShop.shop_id)}</span>
                </div>

                {/* 3. Right: Chairs + Heart + Book Button + Dismiss */}
                <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                  {/* Mini Chair Status Circles */}
                  <div className="flex items-center gap-0.5 shrink-0">
                    {chairList.slice(0, 4).map((chair, i) => {
                      const isOccupied = chair.status === 'occupied';
                      return (
                        <div
                          key={chair.chair_id || i}
                          className={`w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full border flex items-center justify-center shrink-0 ${
                            isOccupied
                              ? 'border-rose-500 text-rose-500 bg-rose-50/50'
                              : 'border-gray-300 text-gray-400 bg-gray-50/50'
                          }`}
                          title={isOccupied ? 'Occupied Chair' : 'Available Chair'}
                        >
                          <svg width="7" height="7" viewBox="0 0 24 24" fill="currentColor">
                            <rect x="9" y="2" width="6" height="3" rx="1" />
                            <path d="M8 6C8 5.44772 8.44772 5 9 5H15C15.5523 5 16 5.44772 16 6V12H8V6Z" />
                            <rect x="5" y="13" width="14" height="3" rx="1.5" />
                          </svg>
                        </div>
                      );
                    })}
                  </div>

                  {/* Favorite Heart */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFavorite(selectedShop.shop_id);
                    }}
                    className={`h-6 w-6 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                      favoriteShops.includes(selectedShop.shop_id)
                        ? 'bg-rose-50 text-rose-500'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                    title="Favorite"
                  >
                    <Heart className={`h-3 w-3 ${favoriteShops.includes(selectedShop.shop_id) ? 'fill-rose-500' : ''}`} />
                  </button>

                  {/* Book Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDetails(selectedShop.shop_id);
                    }}
                    className="py-1 px-2.5 sm:px-3.5 bg-[#ff0055] hover:bg-[#e0004c] text-white font-black text-[11px] sm:text-xs rounded-full shadow-md shadow-rose-500/25 flex items-center gap-0.5 transition-all active:scale-95 whitespace-nowrap cursor-pointer"
                  >
                    <span>Book</span>
                    <ArrowRight className="h-2.5 w-2.5" />
                  </button>

                  {/* Dismiss */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedShop(null);
                    }}
                    className="h-5 w-5 rounded-full text-gray-400 hover:text-gray-600 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                    title="Dismiss"
                  >
                    <X className="h-3 w-3" />
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
