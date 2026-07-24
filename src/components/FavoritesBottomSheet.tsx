import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation, AnimatePresence, type PanInfo } from 'framer-motion';
import { MapPin, Star, ArrowRight, Heart, Clock, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { BarberShop } from '../mock/mockData';

interface FavoritesBottomSheetProps {
  onSelectShop?: (shop: BarberShop) => void;
}

export const FavoritesBottomSheet: React.FC<FavoritesBottomSheetProps> = ({ onSelectShop }) => {
  const navigate = useNavigate();
  const { shops, favoriteShops, setFavorite, setBookingShop, mapPanning } = useStore();
  const controls = useAnimation();

  // Snap states: 0 = Collapsed (~175px), 1 = Half (~45vh), 2 = Full (~82vh)
  const [snapState, setSnapState] = useState<0 | 1 | 2>(0);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  // Sync favourites from localStorage + store
  const [favIds, setFavIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('cutwala_favourites');
      return stored ? JSON.parse(stored) : favoriteShops;
    } catch {
      return favoriteShops;
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const stored = localStorage.getItem('cutwala_favourites');
        const next = stored ? JSON.parse(stored) : favoriteShops;
        setFavIds(prev => (JSON.stringify(prev) !== JSON.stringify(next) ? next : prev));
      } catch { /* ignore */ }
    }, 400);
    return () => clearInterval(interval);
  }, [favoriteShops]);

  const favouriteList = shops.filter(s => favIds.includes(s.shop_id));

  // AUTO-COLLAPSE ON MAP SCROLL / PAN:
  // When user drags or pans the map, automatically slide sheet to Collapsed position (snapState 0)
  useEffect(() => {
    if (mapPanning && snapState !== 0) {
      setSnapState(0);
    }
  }, [mapPanning, snapState]);

  // Animate sheet position based on snap state and mapPanning
  useEffect(() => {
    if (!isDismissed) {
      controls.start({
        ...getSnapTarget(snapState),
        y: mapPanning ? 350 : 0
      });
    }
  }, [snapState, mapPanning, isDismissed, controls]);

  const getSnapTarget = (state: 0 | 1 | 2) => {
    switch (state) {
      case 0: return { height: '175px' };
      case 1: return { height: '45vh' };
      case 2: return { height: '82vh' };
    }
  };

  // Tapping the drag handle pill (---) CLOSES / MINIMIZES the favourites card
  const handleHandleTap = () => {
    if (snapState > 0) {
      setSnapState(0); // If expanded, collapse first
    } else {
      setIsDismissed(true); // If already collapsed, close/dismiss it completely
    }
  };

  // Drag End handler with smooth snap physics
  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const velocity = info.velocity.y;
    const offset = info.offset.y;

    if (offset < -80 || velocity < -300) {
      // Dragging UP
      if (snapState === 0) setSnapState(1);
      else if (snapState === 1) setSnapState(2);
    } else if (offset > 80 || velocity > 300) {
      // Dragging DOWN
      if (snapState === 2) setSnapState(1);
      else if (snapState === 1) setSnapState(0);
      else if (snapState === 0 && offset > 100) setIsDismissed(true);
    }
  };

  const removeFavourite = (shopId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = favIds.filter(id => id !== shopId);
    setFavIds(next);
    localStorage.setItem('cutwala_favourites', JSON.stringify(next));
    setFavorite(shopId);
  };

  const handleOpenShop = (shop: BarberShop, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onSelectShop) onSelectShop(shop);
    setBookingShop(shop.shop_id);
    navigate(`/app/shop/${shop.shop_id}`);
  };

  const getChairStatus = (shopId: string) => {
    let total = 6, taken = 0;
    if (shopId === 'shop1') { total = 6; taken = 0; }
    if (shopId === 'shop2') { total = 6; taken = 2; }
    if (shopId === 'shop3') { total = 4; taken = 3; }
    return { total, available: total - taken };
  };

  if (favouriteList.length === 0) return null;

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          animate={controls}
          initial={{ height: '175px', y: 0 }}
          exit={{ height: 0, opacity: 0, y: 200 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
          className="fixed bottom-[68px] left-3 right-3 md:left-auto md:right-6 md:w-96 z-30 bg-white/98 dark:bg-zinc-900/98 backdrop-blur-xl rounded-[24px] shadow-2xl shadow-black/20 border border-gray-200/80 dark:border-zinc-800/80 flex flex-col overflow-hidden select-none pointer-events-auto"
        >
          {/* DRAG HANDLE & HEADER BAR */}
          <div 
            className="w-full flex items-center justify-between px-3 pt-2.5 pb-1 bg-white/95 dark:bg-zinc-900/95 shrink-0 relative"
          >
            {/* Left placeholder for balance */}
            <div className="w-6" />

            {/* CENTER DRAG HANDLE PILL */}
            <div
              onClick={handleHandleTap}
              className="py-1 px-4 cursor-pointer touch-none flex items-center justify-center"
              title="Drag or tap handle"
            >
              <div className="w-11 h-1.5 rounded-full bg-gray-300 dark:bg-zinc-600 hover:bg-gray-400 dark:hover:bg-zinc-500 transition-colors" />
            </div>

            {/* RIGHT CLOSE 'X' BUTTON — Direct Close */}
            <button
              onClick={(e) => { e.stopPropagation(); setIsDismissed(true); }}
              className="h-6 w-6 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
              title="Close Favourites Window"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

            {/* CARDS CONTAINER */}
            <div 
              className={`flex-1 px-3.5 pb-3.5 ${
                snapState === 0 
                  ? 'overflow-hidden flex items-center' 
                  : 'overflow-y-auto space-y-3 no-scrollbar'
              }`}
            >
              {/* COLLAPSED STATE: Single Favorite Preview Card */}
              {snapState === 0 ? (
                <div 
                  onClick={() => handleOpenShop(favouriteList[0])}
                  className="w-full bg-gray-50/80 dark:bg-zinc-800/60 hover:bg-gray-100/80 dark:hover:bg-zinc-800 rounded-2xl p-2.5 flex gap-3 cursor-pointer relative transition-all border border-gray-150/60 dark:border-zinc-700/60 group"
                >
                  {/* Shop Image */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 relative bg-zinc-200 dark:bg-zinc-700">
                    <img
                      src={favouriteList[0].image}
                      alt={favouriteList[0].name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-1 left-1 flex items-center gap-1 bg-emerald-500 px-1.5 py-0.5 rounded-full">
                      <span className="h-1 w-1 rounded-full bg-white animate-pulse" />
                      <span className="text-[7.5px] font-black text-white">LIVE</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between min-w-0 pr-6">
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-extrabold text-xs text-gray-900 dark:text-white truncate">
                          {favouriteList[0].name}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-bold text-gray-800 dark:text-zinc-200 flex items-center gap-0.5">
                          <Star className="h-3 w-3 text-orange-500 fill-orange-500" /> {favouriteList[0].rating}
                        </span>
                        <span className="text-[10px] text-gray-400 dark:text-zinc-500">
                          (128 Reviews)
                        </span>
                      </div>

                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="h-2.5 w-2.5 text-orange-500 shrink-0" />
                        <span className="text-[10px] text-gray-500 dark:text-zinc-400 truncate">
                          {favouriteList[0].address.split(',')[0]}
                        </span>
                      </div>
                    </div>

                    {/* Bottom row: Chair status + Book button */}
                    <div className="flex items-center justify-between pt-1 border-t border-gray-200/60 dark:border-zinc-700/60">
                      {(() => {
                        const { total, available } = getChairStatus(favouriteList[0].shop_id);
                        const color = available === total ? '#10b981' : available === 0 ? '#ef4444' : '#f59e0b';
                        return (
                          <div className="text-[9px] font-black" style={{ color }}>
                            🪑 {available}/{total} Available
                          </div>
                        );
                      })()}

                      <button
                        onClick={(e) => handleOpenShop(favouriteList[0], e)}
                        className="px-2.5 py-1 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-extrabold text-[10px] rounded-lg shadow-sm flex items-center gap-1 cursor-pointer"
                      >
                        <span>Book Now</span>
                        <ArrowRight className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  </div>

                  {/* Remove heart */}
                  <button
                    onClick={(e) => removeFavourite(favouriteList[0].shop_id, e)}
                    className="absolute top-2.5 right-2.5 h-6 w-6 rounded-full bg-pink-50 dark:bg-pink-900/40 text-pink-500 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                    title="Remove"
                  >
                    <Heart className="h-3 w-3 fill-pink-500" />
                  </button>
                </div>
              ) : (
                favouriteList.map((shop) => {
                  const { total, available } = getChairStatus(shop.shop_id);
                  const chairColor = available === total ? '#10b981' : available === 0 ? '#ef4444' : '#f59e0b';
                  const reviewCount = shop.shop_id === 'shop1' ? 128 : shop.shop_id === 'shop2' ? 94 : 61;

                  return (
                    <div
                      key={shop.shop_id}
                      onClick={() => handleOpenShop(shop)}
                      className="bg-gray-50/80 dark:bg-zinc-800/60 hover:bg-gray-100/80 dark:hover:bg-zinc-800 rounded-2xl p-3 flex gap-3 cursor-pointer relative transition-all border border-gray-150/60 dark:border-zinc-700/60 group"
                    >
                      {/* Image */}
                      <div className="w-20 h-24 rounded-xl overflow-hidden shrink-0 relative bg-zinc-200 dark:bg-zinc-700">
                        <img
                          src={shop.image}
                          alt={shop.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-1 left-1 flex items-center gap-1 bg-emerald-500 px-1.5 py-0.5 rounded-full">
                          <span className="h-1 w-1 rounded-full bg-white animate-pulse" />
                          <span className="text-[7.5px] font-black text-white">LIVE</span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between min-w-0 pr-6">
                        <div>
                          <h4 className="font-extrabold text-xs text-gray-900 dark:text-white truncate">
                            {shop.name}
                          </h4>

                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] font-bold text-gray-800 dark:text-zinc-200 flex items-center gap-0.5">
                              <Star className="h-3 w-3 text-orange-500 fill-orange-500" /> {shop.rating}
                            </span>
                            <span className="text-[10px] text-gray-400 dark:text-zinc-500">
                              ({reviewCount} Reviews)
                            </span>
                          </div>

                          <div className="flex items-center gap-1 mt-1">
                            <MapPin className="h-2.5 w-2.5 text-orange-500 shrink-0" />
                            <span className="text-[10px] text-gray-500 dark:text-zinc-400 truncate">
                              {shop.address.split(',')[0]}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 mt-0.5">
                            <Clock className="h-2.5 w-2.5 text-gray-400 shrink-0" />
                            <span className="text-[9.5px] text-gray-400 dark:text-zinc-500">
                              Closes at {shop.closing_time}
                            </span>
                          </div>
                        </div>

                        {/* Bottom Bar */}
                        <div className="flex items-center justify-between pt-1.5 border-t border-gray-200/60 dark:border-zinc-700/60 mt-1">
                          <div
                            className="px-2 py-0.5 rounded-md border text-[9px] font-black"
                            style={{ borderColor: chairColor, color: chairColor, background: `${chairColor}15` }}
                          >
                            {available}/{total} Available
                          </div>

                          <button
                            onClick={(e) => handleOpenShop(shop, e)}
                            className="px-3 py-1 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-extrabold text-[10px] rounded-lg shadow-sm flex items-center gap-1 cursor-pointer"
                          >
                            <span>Book Now</span>
                            <ArrowRight className="h-2.5 w-2.5" />
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={(e) => removeFavourite(shop.shop_id, e)}
                        className="absolute top-3 right-3 h-6 w-6 rounded-full bg-pink-50 dark:bg-pink-900/40 text-pink-500 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                        title="Remove"
                      >
                        <Heart className="h-3 w-3 fill-pink-500" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
  );
};
