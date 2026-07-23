import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Star, MapPin, ArrowRight, Scissors } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Button, Badge } from '../components/UI';

export const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const { shops, favoriteShops, setFavorite, setBookingShop } = useStore();

  const favShopList = shops.filter(s => favoriteShops.includes(s.shop_id));

  const handleOpenShop = (shopId: string) => {
    setBookingShop(shopId);
    navigate(`/app/shop/${shopId}`);
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-zinc-950 p-4 md:p-6 overflow-y-auto no-scrollbar select-none animate-fade-in">
      
      {/* Page Header */}
      <div className="max-w-2xl mx-auto w-full mb-6">
        <h1 className="font-display font-extrabold text-2xl md:text-3xl text-gray-900 dark:text-white flex items-center gap-2.5">
          <Heart className="h-7 w-7 text-rose-500 fill-rose-500" /> Favorite Barber Shops
        </h1>
        <p className="text-gray-500 dark:text-zinc-450 text-xs mt-1">
          Your saved grooming parlours for quick booking
        </p>
      </div>

      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col gap-4">
        {favShopList.length === 0 ? (
          /* Empty Favorites State */
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-zinc-900 border border-gray-150/40 dark:border-zinc-800/80 rounded-3xl shadow-sm min-h-[350px]"
          >
            <div className="h-16 w-16 rounded-full bg-rose-500/10 flex items-center justify-center mb-6">
              <Heart className="h-8 w-8 text-rose-500" />
            </div>
            <h3 className="font-display font-extrabold text-xl text-gray-900 dark:text-white">
              No Favorite Shops Saved
            </h3>
            <p className="text-gray-500 dark:text-zinc-400 mt-2 text-sm max-w-sm leading-relaxed">
              Save your favorite barber shops by tapping the heart icon on any shop to access them instantly here!
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/app/home')}
              className="mt-6 px-8 cursor-pointer bg-orange-500 hover:bg-orange-600 text-white font-extrabold"
            >
              <Scissors className="mr-2 h-4 w-4" /> Explore Barber Shops
            </Button>
          </motion.div>
        ) : (
          /* Favorite Shop Cards List */
          favShopList.map((shop) => {
            return (
              <motion.div
                key={shop.shop_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-150/40 dark:border-zinc-800/80 shadow-md p-4 flex flex-col sm:flex-row gap-4 relative group"
              >
                {/* Shop Image */}
                <div className="h-36 sm:h-32 sm:w-32 rounded-2xl overflow-hidden shrink-0 relative bg-zinc-100 dark:bg-zinc-800">
                  <img 
                    src={shop.image} 
                    alt={shop.name} 
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge status="OPEN" className="scale-85 origin-left" />
                  </div>

                  {/* Heart Toggle Button */}
                  <button
                    onClick={() => setFavorite(shop.shop_id)}
                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md flex items-center justify-center text-rose-500 shadow-md cursor-pointer hover:scale-110 transition-transform"
                    title="Remove from Favorites"
                  >
                    <Heart className="h-4.5 w-4.5 fill-rose-500" />
                  </button>
                </div>

                {/* Info Panel */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-display font-extrabold text-base text-gray-900 dark:text-white truncate">
                        {shop.name}
                      </h3>
                      <span className="text-xs font-extrabold text-amber-500 flex items-center gap-1 shrink-0 bg-amber-500/10 px-2 py-0.5 rounded-lg">
                        <Star className="h-3.5 w-3.5 fill-amber-500" /> {shop.rating}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-zinc-450 mt-1 flex items-start gap-1">
                      <MapPin className="h-3.5 w-3.5 text-orange-500 shrink-0 mt-0.5" />
                      <span className="truncate">{shop.address}</span>
                    </p>

                    <p className="text-[11px] text-gray-400 dark:text-zinc-500 mt-2 line-clamp-2">
                      {shop.description}
                    </p>
                  </div>

                  {/* Book Button */}
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-zinc-850 flex justify-end">
                    <Button
                      variant="primary"
                      onClick={() => handleOpenShop(shop.shop_id)}
                      className="h-10 px-5 text-xs font-extrabold bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Book Appointment</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

    </div>
  );
};
