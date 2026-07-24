import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Star, ArrowRight, Heart, Clock, ChevronDown, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Map } from '../components/Map';
import type { BarberShop } from '../mock/mockData';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { shops, maxDistance, setFilters, setBookingShop, setFavorite, mapPanning } = useStore();
  const [selectedShop, setSelectedShop] = useState<BarberShop | null>(null);

  // Card dismiss/close state
  const [isCardClosed, setIsCardClosed] = useState<boolean>(false);

  // 3 Snap Positions for Floating Bottom Sheet: 'collapsed' (~185px) | 'half' (~52vh) | 'full' (~82vh)
  const [snapState, setSnapState] = useState<'collapsed' | 'half' | 'full'>('collapsed');

  // Filter mode inside bottom sheet list: 'all' | 'favourites'
  const [listTab, setListTab] = useState<'all' | 'favourites'>('all');

  // Read favourite shop IDs from localStorage (synced with Map.tsx heart toggle)
  const [favShopIds, setFavShopIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('cutwala_favourites');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  // Keep local favShopIds synced with localStorage
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

  // Determine active displayed shop for single collapsed preview card
  const activeShop = selectedShop || openShops[0] || shops[0];

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
    setIsCardClosed(false); // Re-open card if user clicks a map pin
  };

  const handleOpenDetails = (shopId: string) => {
    setBookingShop(shopId);
    navigate(`/app/shop/${shopId}`);
  };

  const toggleShopFavourite = (shopId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorite(shopId);
    const next = favShopIds.includes(shopId)
      ? favShopIds.filter(id => id !== shopId)
      : [...favShopIds, shopId];
    setFavShopIds(next);
    localStorage.setItem('cutwala_favourites', JSON.stringify(next));
  };

  // Cycle snap positions on handle tap
  const cycleSnapState = () => {
    if (snapState === 'collapsed') setSnapState('half');
    else if (snapState === 'half') setSnapState('full');
    else setSnapState('collapsed');
  };

  // Calculate dynamic height style for bottom sheet snap positions
  const getSheetHeight = () => {
    if (isCardClosed) return '0px';
    if (snapState === 'collapsed') return '185px';
    if (snapState === 'half') return '52vh';
    return '82vh';
  };

  // List of shops to display inside expanded list
  const displayShops = listTab === 'favourites' ? favouriteShopList : openShops;

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

      {/* Floating Re-open Button when card is closed */}
      <AnimatePresence>
        {isCardClosed && !mapPanning && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsCardClosed(false)}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl shadow-xl border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white font-extrabold text-xs cursor-pointer hover:scale-105 active:scale-95 transition-all"
          >
            <span>💈 Show Salons</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* 2. FLOATING BOTTOM PREVIEW CARD / SHEET */}
      {/* Positioned directly flush above bottom nav (bottom-16) with ZERO gap. Slides TOTALLY to bottom on map scroll (y: mapPanning ? 350 : 0) */}
      <motion.div
        animate={{ 
          height: getSheetHeight(),
          y: mapPanning || isCardClosed ? 350 : 0,
          opacity: mapPanning || isCardClosed ? 0 : 1
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 400 }}
        className="absolute bottom-16 left-3 right-3 md:left-4 md:right-4 z-30 max-w-lg mx-auto w-[calc(100%-1.5rem)] rounded-3xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl shadow-2xl border border-gray-200/90 dark:border-zinc-800/90 flex flex-col overflow-hidden pointer-events-auto"
      >
        {/* DRAG HANDLE BAR (Top Center Drag Indicator + Close Button) */}
        <div 
          onClick={cycleSnapState}
          className="w-full flex flex-col items-center pt-2.5 pb-1.5 cursor-grab active:cursor-grabbing hover:bg-gray-50/50 dark:hover:bg-zinc-800/50 transition-colors shrink-0 touch-none relative"
        >
          {/* Light gray drag handle pill: 44px x 5px */}
          <div className="w-11 h-1.5 rounded-full bg-gray-300 dark:bg-zinc-600 shadow-xs" />
          
          {/* Dismiss / Close Button on top right of handle bar */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsCardClosed(true);
            }}
            className="absolute top-2 right-3 h-6 w-6 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
            title="Close Card"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          
          {/* Header controls visible in Half / Full states */}
          {snapState !== 'collapsed' && (
            <div className="w-full flex items-center justify-between px-4 pt-2 pb-1">
              {/* Tab Selector: All Salons vs Favourites */}
              <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-zinc-800 p-1 rounded-xl">
                <button
                  onClick={(e) => { e.stopPropagation(); setListTab('all'); }}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    listTab === 'all'
                      ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-xs'
                      : 'text-gray-500 dark:text-zinc-400'
                  }`}
                >
                  All ({openShops.length})
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setListTab('favourites'); }}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                    listTab === 'favourites'
                      ? 'bg-pink-500 text-white shadow-xs'
                      : 'text-gray-500 dark:text-zinc-400'
                  }`}
                >
                  <Heart className="h-3 w-3 fill-current" />
                  <span>Favourites ({favouriteShopList.length})</span>
                </button>
              </div>

              {/* Collapse button */}
              <button
                onClick={(e) => { e.stopPropagation(); setSnapState('collapsed'); }}
                className="h-7 w-7 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer"
                title="Collapse sheet"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-hidden flex flex-col">
          
          {/* STATE A: COLLAPSED PREVIEW CARD (Single Salon Card matching sketch & specs) */}
          {snapState === 'collapsed' ? (
            <div 
              onClick={() => handleOpenDetails(activeShop.shop_id)}
              className="p-3 pt-0 flex gap-3.5 items-center cursor-pointer h-full"
            >
              {/* Left: Shop Image with LIVE Badge */}
              <div className="w-[100px] h-[120px] rounded-2xl overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800 relative border border-gray-200/60 dark:border-zinc-700/60 shadow-xs">
                <img 
                  src={activeShop.image} 
                  alt={activeShop.name} 
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-emerald-500 px-1.5 py-0.5 rounded-full shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                  <span className="text-[8.5px] font-black text-white tracking-wide">LIVE</span>
                </div>
              </div>

              {/* Middle & Right: Details + Chair Status + Book Button */}
              <div className="flex-1 flex flex-col justify-between h-[120px] min-w-0">
                {/* Top row: Name & Favourite Heart */}
                <div>
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="font-display font-extrabold text-sm md:text-base text-gray-900 dark:text-white truncate leading-tight">
                      {activeShop.name}
                    </h3>
                    <button
                      onClick={(e) => toggleShopFavourite(activeShop.shop_id, e)}
                      className="shrink-0 h-6.5 w-6.5 rounded-full bg-pink-50 dark:bg-pink-900/30 flex items-center justify-center text-pink-500 hover:bg-pink-100 transition-colors cursor-pointer"
                      title="Toggle Favourite"
                    >
                      <Heart className={`h-3.5 w-3.5 ${favShopIds.includes(activeShop.shop_id) ? 'fill-pink-500 text-pink-500' : 'text-pink-500'}`} />
                    </button>
                  </div>

                  {/* Rating + Reviews */}
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Star className="h-3.5 w-3.5 text-orange-500 fill-orange-500 shrink-0" />
                    <span className="text-xs font-extrabold text-gray-800 dark:text-zinc-200">{activeShop.rating}</span>
                    <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500">
                      ({activeShop.shop_id === 'shop1' ? 128 : activeShop.shop_id === 'shop2' ? 94 : 61} Reviews)
                    </span>
                  </div>

                  {/* Location & Distance & Closing time */}
                  <div className="flex items-center gap-2 mt-1 truncate text-[10.5px] font-bold text-gray-500 dark:text-zinc-400">
                    <span className="flex items-center gap-0.5 truncate">
                      <MapPin className="h-3 w-3 text-orange-500 shrink-0" />
                      {activeShop.address.split(',')[0]} ({getDistanceStr(activeShop.shop_id)})
                    </span>
                    <span className="text-gray-300 dark:text-zinc-700">•</span>
                    <span className="flex items-center gap-0.5 shrink-0">
                      <Clock className="h-3 w-3 text-gray-400 shrink-0" />
                      Closes at {activeShop.closing_time}
                    </span>
                  </div>
                </div>

                {/* Bottom row: Chair Status Box + Book Now Button */}
                <div className="flex items-center justify-between border-t border-gray-100 dark:border-zinc-800 pt-2">
                  {/* Chair Status Box */}
                  {(() => {
                    const { total, available } = getChairStatus(activeShop.shop_id);
                    const chairColor = available === total ? '#10b981' : available === 0 ? '#ef4444' : '#f59e0b';
                    return (
                      <div 
                        className="flex flex-col items-center justify-center px-2.5 py-1 rounded-xl border font-extrabold leading-tight shadow-2xs"
                        style={{ borderColor: chairColor, color: chairColor, background: `${chairColor}15` }}
                      >
                        <span className="text-xs font-black">{available}/{total}</span>
                        <span className="text-[8px] tracking-wider uppercase">Available</span>
                      </div>
                    );
                  })()}

                  {/* Book Now Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDetails(activeShop.shop_id);
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 px-3.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
                  >
                    <span>Book Now</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            
            /* STATE B: EXPANDED LIST (Half & Full States - Scrollable Salon List) */
            <div className="flex-1 overflow-y-auto px-3.5 py-2 space-y-3 no-scrollbar pb-6">
              {displayShops.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-xs font-bold">
                  No favourite salons saved yet. Tap the pink heart on any map pin to add!
                </div>
              ) : (
                displayShops.map((shop) => {
                  const { total, available } = getChairStatus(shop.shop_id);
                  const chairColor = available === total ? '#10b981' : available === 0 ? '#ef4444' : '#f59e0b';
                  const reviewCount = shop.shop_id === 'shop1' ? 128 : shop.shop_id === 'shop2' ? 94 : 61;
                  const isFav = favShopIds.includes(shop.shop_id);

                  return (
                    <div
                      key={shop.shop_id}
                      onClick={() => handleOpenDetails(shop.shop_id)}
                      className="bg-white dark:bg-zinc-800 rounded-2xl p-3 shadow-md border border-gray-150 dark:border-zinc-700/80 flex gap-3 cursor-pointer hover:border-orange-500/40 transition-all"
                    >
                      {/* Left: Image */}
                      <div className="w-[85px] h-[105px] rounded-xl overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-700 relative">
                        <img 
                          src={shop.image} 
                          alt={shop.name} 
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute top-1 left-1 flex items-center gap-0.5 bg-emerald-500 px-1.5 py-0.5 rounded-full">
                          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                          <span className="text-[7.5px] font-black text-white">LIVE</span>
                        </div>
                      </div>

                      {/* Right: Info */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h3 className="font-extrabold text-xs md:text-sm text-gray-900 dark:text-white truncate leading-tight">
                              {shop.name}
                            </h3>
                            <button
                              onClick={(e) => toggleShopFavourite(shop.shop_id, e)}
                              className="shrink-0 h-6 w-6 rounded-full bg-pink-50 dark:bg-pink-900/30 flex items-center justify-center text-pink-500 hover:bg-pink-100 transition-colors cursor-pointer"
                            >
                              <Heart className={`h-3.5 w-3.5 ${isFav ? 'fill-pink-500 text-pink-500' : 'text-pink-500'}`} />
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Star className="h-3 w-3 text-orange-500 fill-orange-500 shrink-0" />
                            <span className="text-xs font-bold text-gray-800 dark:text-zinc-200">{shop.rating}</span>
                            <span className="text-[10px] text-gray-400 dark:text-zinc-500">({reviewCount} Reviews)</span>
                          </div>

                          <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-500 dark:text-zinc-400 truncate">
                            <MapPin className="h-2.5 w-2.5 text-orange-500 shrink-0" />
                            <span className="truncate">{shop.address.split(',')[0]}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-100 dark:border-zinc-700/60 pt-1.5 mt-1.5">
                          <div 
                            className="flex flex-col items-center justify-center px-2 py-0.5 rounded-lg border text-[8.5px] font-extrabold leading-tight"
                            style={{ borderColor: chairColor, color: chairColor, background: `${chairColor}15` }}
                          >
                            <span className="text-xs font-black">{available}/{total}</span>
                            <span className="text-[7.5px]">Available</span>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDetails(shop.shop_id);
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-[11px] rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
                          >
                            <span>Book Now</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

        </div>

      </motion.div>

    </div>
  );
};
