import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Heart, Sparkles, X, Gift } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { BarberShop } from '../mock/mockData';

interface FeatureCarouselCardProps {
  onSelectShop?: (shop: BarberShop) => void;
}

export const FeatureCarouselCard: React.FC<FeatureCarouselCardProps> = ({ onSelectShop }) => {
  const navigate = useNavigate();
  const { shops, favoriteShops, setBookingShop, mapPanning, showToast, stampsCount } = useStore();

  const [activeSlide, setActiveSlide] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  const isHoveredRef = useRef(false);

  // Sync favourites from localStorage or store
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
    }, 500);
    return () => clearInterval(interval);
  }, [favoriteShops]);

  const favouriteShop = shops.find(s => favIds.includes(s.shop_id)) || shops[0];

  // 4 Feature Slides list
  const slides = [
    {
      id: 'fav_shop',
      type: 'favorite',
      badge: 'FAVOURITE',
      image: favouriteShop.image,
      title: favouriteShop.name,
      subtitle: `⭐ ${favouriteShop.rating} (128 Reviews) • 🪑 6/6 Available`,
      buttonText: 'Book Now',
      action: () => {
        if (onSelectShop) onSelectShop(favouriteShop);
        setBookingShop(favouriteShop.shop_id);
        navigate(`/app/shop/${favouriteShop.shop_id}`);
      }
    },
    {
      id: 'loyalty_card',
      type: 'loyalty',
      badge: 'LOYALTY',
      image: 'loyalty', // rendered custom Loyalty Card graphic
      title: 'Digital Loyalty Stamp Card',
      subtitle: `Collect 10 stamps & get 11th service FREE! (${stampsCount}/10 collected)`,
      buttonText: 'View Card',
      action: () => {
        navigate('/app/rewards');
      }
    },
    {
      id: 'live_seats',
      type: 'seats',
      badge: 'LIVE TRACKER',
      image: 'seats', // rendered custom seats graphic
      title: 'Real-Time Chair Occupancy',
      subtitle: 'See live available seats at nearby salons in real-time',
      buttonText: 'Check Seats',
      action: () => {
        showToast('Real-time chair tracker updated! Live seats active.', 'info');
      }
    },
    {
      id: 'ai_hairstyle',
      type: 'ai',
      badge: 'AI FEATURE',
      image: 'ai', // rendered custom AI graphic
      title: 'AI Virtual Hairstyle Try-On',
      subtitle: 'Preview 20+ haircuts & fades using AI camera',
      buttonText: 'Try AI',
      action: () => {
        showToast('AI Virtual Hairstyle Try-On coming soon!', 'info');
      }
    }
  ];

  // 5-SECOND AUTO-SLIDE TIMER
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isHoveredRef.current && !isDismissed) {
        setActiveSlide((prev) => (prev + 1) % slides.length);
      }
    }, 5000); // 5 seconds duration

    return () => clearInterval(timer);
  }, [slides.length, isDismissed]);

  if (isDismissed) return null;

  const currentSlide = slides[activeSlide];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ 
        opacity: mapPanning ? 0 : 1, 
        y: mapPanning ? 350 : 0 
      }}
      transition={{ type: 'spring', damping: 28, stiffness: 300 }}
      onMouseEnter={() => { isHoveredRef.current = true; }}
      onMouseLeave={() => { isHoveredRef.current = false; }}
      onTouchStart={() => { isHoveredRef.current = true; }}
      onTouchEnd={() => { isHoveredRef.current = false; }}
      className="fixed bottom-[72px] left-3 right-3 max-w-lg mx-auto z-30 bg-white/98 dark:bg-zinc-900/98 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl shadow-black/15 border border-gray-200/80 dark:border-zinc-800/80 p-2.5 md:p-3 flex flex-col gap-2 select-none pointer-events-auto overflow-hidden"
    >
      {/* Top Header Row (Close Button) */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-[10px] font-black tracking-wider text-orange-600 dark:text-orange-400 uppercase">
            {currentSlide.badge}
          </span>
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          className="h-5 w-5 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
          title="Dismiss"
        >
          <X className="h-3 w-3" />
        </button>
      </div>

      {/* Main Slide Content with AnimatePresence */}
      <div className="relative min-h-[72px] flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3 w-full"
          >
            {/* Left Image / Visual Graphic */}
            <div className="w-20 h-16 rounded-xl overflow-hidden shrink-0 relative bg-zinc-900 border border-gray-200/60 dark:border-zinc-700/60 shadow-inner flex items-center justify-center">
              {currentSlide.type === 'favorite' ? (
                <>
                  <img
                    src={currentSlide.image}
                    alt={currentSlide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1 left-1 bg-rose-500 text-white rounded-full p-0.5">
                    <Heart className="h-2.5 w-2.5 fill-white" />
                  </div>
                </>
              ) : currentSlide.type === 'loyalty' ? (
                /* Loyalty Card Graphic matching user screenshot */
                <div className="w-full h-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-black p-1.5 flex flex-col justify-between relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[7px] font-black text-amber-400">CutWala</span>
                    <Gift className="h-2.5 w-2.5 text-amber-400" />
                  </div>
                  {/* Grid of gold dots representing stamps */}
                  <div className="grid grid-cols-5 gap-0.5 my-auto">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 w-1.5 rounded-full border border-amber-400/80 ${
                          i < stampsCount ? 'bg-amber-400' : 'bg-transparent'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[6px] font-extrabold text-amber-300 tracking-tighter">11th FREE</span>
                </div>
              ) : currentSlide.type === 'seats' ? (
                /* Live Seats Graphic */
                <div className="w-full h-full bg-emerald-950/80 flex flex-col items-center justify-center gap-1">
                  <span className="text-xl">💺</span>
                  <span className="text-[8px] font-black text-emerald-400">LIVE SEATS</span>
                </div>
              ) : (
                /* AI Hairstyle Graphic */
                <div className="w-full h-full bg-purple-950/80 flex flex-col items-center justify-center gap-1">
                  <Sparkles className="h-5 w-5 text-purple-400 animate-spin" />
                  <span className="text-[8px] font-black text-purple-300">AI TRY-ON</span>
                </div>
              )}
            </div>

            {/* Middle Title & Subtitle */}
            <div className="flex-1 min-w-0 pr-1">
              <h3 className="font-extrabold text-xs md:text-sm text-gray-900 dark:text-white truncate leading-tight">
                {currentSlide.title}
              </h3>
              <p className="text-[10px] md:text-[11px] font-medium text-gray-500 dark:text-zinc-400 line-clamp-2 mt-0.5">
                {currentSlide.subtitle}
              </p>
            </div>

            {/* Right Action Button (Orange pill like screenshot) */}
            <button
              onClick={currentSlide.action}
              className="px-3 py-1.5 rounded-xl border-2 border-orange-500 hover:bg-orange-500 text-orange-600 hover:text-white dark:text-orange-400 dark:hover:text-white font-extrabold text-xs transition-all active:scale-95 cursor-pointer shrink-0 shadow-xs flex items-center gap-1"
            >
              <span>{currentSlide.buttonText}</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Carousel Pagination Dots (Matching screenshot ● ○ ○ ○) */}
      <div className="flex items-center justify-center gap-1.5 pt-0.5 pb-0.5">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveSlide(idx)}
            className={`transition-all duration-300 cursor-pointer ${
              idx === activeSlide
                ? 'w-4 h-1.5 rounded-full bg-orange-500'
                : 'w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-zinc-700 hover:bg-gray-400'
            }`}
            title={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </motion.div>
  );
};
