import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Star, ArrowRight, X, Heart } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Map } from '../components/Map';
import type { BarberShop } from '../mock/mockData';
import { Badge } from '../components/UI';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { setBookingShop, favoriteShops, setFavorite } = useStore();
  const [selectedShop, setSelectedShop] = useState<BarberShop | null>(null);

  const handleSelectShop = (shop: BarberShop) => {
    setSelectedShop(shop);
  };

  const handleOpenDetails = (shopId: string) => {
    setBookingShop(shopId);
    navigate(`/app/shop/${shopId}`);
  };

  const getDistanceStr = (shopId: string) => {
    if (shopId === 'shop1') return '0.4 mi';
    if (shopId === 'shop2') return '0.7 mi';
    if (shopId === 'shop3') return '1.2 mi';
    return '1.5 mi';
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

    </div>
  );
};
