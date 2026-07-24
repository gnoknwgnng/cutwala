import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Scissors } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Button } from '../components/UI';
import { Map } from '../components/Map';
import { FavoritesBottomSheet } from '../components/FavoritesBottomSheet';

export const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const { shops, favoriteShops } = useStore();

  const favShopList = shops.filter(s => favoriteShops.includes(s.shop_id));

  return (
    <div className="relative flex-1 flex flex-col h-full w-full bg-[#f3f4f6] dark:bg-zinc-950 overflow-hidden select-none">
      
      {/* 1. Full-screen Vector Map in background */}
      <div className="absolute inset-0 z-0">
        <Map 
          selectedShop={null} 
          onSelectShop={() => {}} 
          searchQuery="" 
        />
      </div>

      {favShopList.length === 0 ? (
        /* Empty Favorites State Overlay */
        <div className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-black/20 backdrop-blur-xs">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center p-6 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-gray-150/40 dark:border-zinc-800/80 rounded-3xl shadow-2xl max-w-sm w-full"
          >
            <div className="h-14 w-14 rounded-full bg-rose-500/10 flex items-center justify-center mb-4">
              <Heart className="h-7 w-7 text-rose-500" />
            </div>
            <h3 className="font-display font-extrabold text-lg text-gray-900 dark:text-white">
              No Favorite Shops Saved
            </h3>
            <p className="text-gray-500 dark:text-zinc-400 mt-1.5 text-xs leading-relaxed">
              Tap the pink heart icon on any map pin or shop card to save your favorite salons here!
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/app/home')}
              className="mt-5 px-6 py-2 text-xs cursor-pointer bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-xl"
            >
              <Scissors className="mr-1.5 h-3.5 w-3.5" /> Explore Barber Shops
            </Button>
          </motion.div>
        </div>
      ) : (
        /* Floating Bottom Favorites Preview Sheet */
        <FavoritesBottomSheet />
      )}

    </div>
  );
};
