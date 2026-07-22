import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Star, 
  MapPin, 
  ChevronLeft, 
  Armchair, 
  Check, 
  Share2, 
  TrendingUp, 
  ArrowRight
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Button } from '../components/UI';

export const ShopDetails: React.FC = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const navigate = useNavigate();
  const { 
    shops, 
    barbers, 
    chairs,
    favoriteShops, 
    setFavorite, 
    currentBookingFlow,
    setBookingShop,
    setBookingBarber,
    setBookingChair,
    tickChairs,
    showToast,
    resetBookingFlow
  } = useStore();

  const [selectedChair, setSelectedChair] = useState<string>(currentBookingFlow.chairId || '');
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  // Find shop
  const shop = shops.find(s => s.shop_id === shopId) || shops[0];
  const isFav = favoriteShops.includes(shop.shop_id);

  // Barbers & chairs working at this shop
  const shopBarbers = barbers.filter(b => b.shop_id === shop.shop_id);
  const shopChairs = chairs.filter(c => c.shop_id === shop.shop_id);

  // Gallery photos list (hero image + gallery photos)
  const allImages = [shop.image, ...shop.gallery];

  // Initialize shop and default first barber in store
  useEffect(() => {
    if (shopId) {
      setBookingShop(shopId);
    }
  }, [shopId]);

  // Set up live ticking status simulation for chairs directly on this page
  useEffect(() => {
    const interval = setInterval(() => {
      tickChairs();
    }, 3500);

    return () => clearInterval(interval);
  }, [tickChairs]);

  // Keep internal selected chair in sync with status changes
  useEffect(() => {
    if (selectedChair) {
      const activeChair = shopChairs.find(c => c.chair_id === selectedChair);
      if (activeChair && activeChair.status === 'occupied') {
        setSelectedChair('');
        setBookingChair('');
        showToast('Your selected chair was just occupied. Please select another!', 'info');
      }
    }
  }, [chairs, selectedChair]);

  // Selected details from Zustand
  const selectedBarberId = currentBookingFlow.barberId;

  const handleSelectBarber = (id: string) => {
    setBookingBarber(id);
  };

  const handleSelectChair = (chairId: string, status: 'available' | 'occupied') => {
    if (status === 'occupied') {
      showToast('This chair is currently occupied. Please select an available one.', 'error');
      return;
    }

    if (selectedChair === chairId) {
      setSelectedChair('');
      setBookingChair('');
    } else {
      setSelectedChair(chairId);
      setBookingChair(chairId);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: shop.name,
        text: `Book your cut at ${shop.name} on CutWala!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      showToast('Shop link copied to clipboard!', 'info');
    }
  };

  const selectedBarber = barbers.find(b => b.barber_id === selectedBarberId);
  const canProceed = selectedBarberId && selectedChair;

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-[#0b0b0c] pb-24 relative overflow-y-auto no-scrollbar">
      
      {/* 1. TOP HEADER BAR */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between px-4 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800">
        <div className="flex items-center gap-3 min-w-0">
          <button 
            onClick={() => {
              resetBookingFlow();
              navigate('/app/home');
            }}
            className="p-1.5 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="font-display font-extrabold text-base text-gray-900 dark:text-white truncate">
            {shop.name}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleShare}
            className="p-2 text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
            title="Share"
          >
            <Share2 className="h-5 w-5" />
          </button>
          <button 
            onClick={() => setFavorite(shop.shop_id)}
            className="p-2 text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
            title="Favorite"
          >
            <Heart className={`h-5 w-5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>
      </header>

      {/* 2. MAIN CONTENT AREA */}
      <div className="max-w-2xl mx-auto w-full px-4 pt-4 flex flex-col gap-5">
        
        {/* HERO MAIN IMAGE DISPLAY */}
        <div className="relative w-full h-60 md:h-80 rounded-2xl overflow-hidden shadow-lg border border-gray-250/20 bg-zinc-900">
          <img 
            src={allImages[activeImageIndex] || shop.image} 
            alt={shop.name} 
            className="w-full h-full object-cover transition-all duration-300"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

          {/* Bottom Banner Strip across Poster */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/75 backdrop-blur-md py-2.5 px-4 text-center border-t border-white/10">
            <span className="text-xs font-bold text-white tracking-wide">
              🟢 Open Now • Working Hours: {shop.opening_time} - {shop.closing_time}
            </span>
          </div>
        </div>

        {/* HORIZONTAL PHOTO GALLERY THUMBNAILS (Replacing Virtual Tour & displaying all shop photos) */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
            Shop Photos ({allImages.length})
          </span>
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
            {allImages.map((imgUrl, idx) => (
              <div 
                key={idx} 
                onClick={() => setActiveImageIndex(idx)}
                className={`h-20 w-28 rounded-xl overflow-hidden shrink-0 border-2 cursor-pointer transition-all ${
                  activeImageIndex === idx 
                    ? 'border-amber-500 scale-105 shadow-md ring-2 ring-amber-500/20' 
                    : 'border-transparent opacity-75 hover:opacity-100'
                }`}
              >
                <img 
                  src={imgUrl} 
                  alt={`Shop photo ${idx + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* SUB-INFO LINE & BADGES */}
        <div className="flex flex-col gap-2.5 pt-1">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-gray-600 dark:text-zinc-350">
            <span className="flex items-center gap-1 font-bold text-gray-900 dark:text-white">
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" /> {shop.rating} (120+ reviews)
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-amber-500" /> SOMA, San Francisco
            </span>
            <span>•</span>
            <span className="font-bold text-amber-500">0.4 mi</span>
          </div>

          {/* Feature Badges */}
          <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wider">
            <span className="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border border-gray-200 dark:border-zinc-700">
              AIR CONDITIONED
            </span>
            <span className="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border border-gray-200 dark:border-zinc-700">
              FREE ESPRESSO & BEER
            </span>
            <span className="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border border-gray-200 dark:border-zinc-700">
              HIGH SPEED WIFI
            </span>
          </div>
        </div>

        {/* TAGLINE / DESCRIPTION */}
        <p className="text-xs text-gray-600 dark:text-zinc-400 font-medium leading-relaxed italic border-l-2 border-amber-500 pl-3 py-0.5">
          "{shop.description}"
        </p>

        {/* TRENDING HYPE BOX */}
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-blue-500/10 dark:bg-blue-500/10 border border-blue-500/20 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-600 text-white font-extrabold text-[10px] uppercase tracking-wider shrink-0 shadow-sm">
            <TrendingUp className="h-3.5 w-3.5" /> Trending
          </div>
          <span className="font-bold text-blue-700 dark:text-blue-300 text-xs">
            42 grooming appointments booked in last 24 hours
          </span>
        </div>

        {/* CAST / BARBERS & STYLISTS SECTION */}
        <div className="flex flex-col gap-3 pt-4 border-t border-gray-150/60 dark:border-zinc-850">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-extrabold text-base text-gray-900 dark:text-white">
              Barbers & Stylists
            </h3>
            <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
              Tap photo to select
            </span>
          </div>

          {/* Horizontal Swiping Photo Cards */}
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 pt-1">
            {shopBarbers.map((barber) => {
              const isSelected = selectedBarberId === barber.barber_id;
              return (
                <div
                  key={barber.barber_id}
                  onClick={() => handleSelectBarber(barber.barber_id)}
                  className="flex flex-col items-center w-24 shrink-0 cursor-pointer group"
                >
                  {/* Photo Container */}
                  <div className={`relative h-24 w-24 rounded-2xl overflow-hidden mb-2 border-2 transition-all ${
                    isSelected 
                      ? 'border-amber-500 shadow-lg scale-105 ring-2 ring-amber-500/20' 
                      : 'border-transparent group-hover:border-gray-300 dark:group-hover:border-zinc-700'
                  }`}>
                    <img
                      src={barber.photo}
                      alt={barber.name}
                      className="h-full w-full object-cover"
                    />

                    {/* Selected badge overlay */}
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-amber-500 text-black flex items-center justify-center shadow-md">
                        <Check className="h-3.5 w-3.5 stroke-[3.5]" />
                      </div>
                    )}
                  </div>

                  {/* Stylist Name */}
                  <h4 className="font-bold text-xs text-gray-900 dark:text-white text-center truncate w-full">
                    {barber.name}
                  </h4>
                  {/* Role / Specialization */}
                  <p className="text-[10px] text-gray-500 dark:text-zinc-450 text-center truncate w-full font-medium mt-0.5">
                    {barber.specialization.split('&')[0]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* LIVE CHAIR AVAILABILITY SECTION */}
        <div className="flex flex-col gap-4 pt-4 border-t border-gray-150/60 dark:border-zinc-850 mb-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
              <span>💺</span> Live Chair Status
            </h3>
            
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[9px] uppercase font-bold tracking-wider text-gray-400 dark:text-zinc-500">
                Live Polling
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-zinc-900 border border-gray-200/60 dark:border-zinc-800/80 rounded-3xl shadow-sm">
            {/* Mirrors line */}
            <div className="w-4/5 h-2 rounded-full bg-zinc-300 dark:bg-zinc-800 shadow-inner mb-2" />
            <p className="text-[9px] text-gray-400 dark:text-zinc-550 uppercase tracking-widest font-extrabold mb-8">
              Stylist Mirrors Workspace
            </p>

            {/* Seat Grid layout */}
            <div className="grid grid-cols-2 gap-x-12 gap-y-6 w-full max-w-xs justify-items-center">
              {shopChairs.map((chair, index) => {
                const isSelected = selectedChair === chair.chair_id;
                const isOccupied = chair.status === 'occupied';

                return (
                  <div
                    key={chair.chair_id}
                    onClick={() => handleSelectChair(chair.chair_id, chair.status)}
                    className="flex flex-col items-center gap-1.5 cursor-pointer"
                  >
                    <motion.div
                      animate={{
                        scale: isSelected ? 1.05 : 1,
                        boxShadow: isSelected ? '0 10px 20px -5px rgba(212, 175, 55, 0.3)' : 'none'
                      }}
                      className={`relative w-16 h-16 rounded-2xl border flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500 text-amber-500 dark:bg-amber-500/5'
                          : isOccupied
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-500/80 dark:bg-rose-500/5'
                          : 'bg-white dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 text-emerald-500 hover:border-emerald-400'
                      }`}
                    >
                      <Armchair className="h-7 w-7" />

                      <div className="absolute -top-1.5 -right-1.5">
                        <span className={`flex h-4.5 w-4.5 items-center justify-center rounded-full text-[8px] font-bold border ${
                          isSelected 
                            ? 'bg-amber-500 border-amber-400 text-black' 
                            : isOccupied 
                            ? 'bg-rose-600 border-rose-500 text-white' 
                            : 'bg-emerald-600 border-emerald-500 text-white'
                        }`}>
                          {isSelected ? <Check className="h-2.5 w-2.5 stroke-[3.5]" /> : (index + 1)}
                        </span>
                      </div>
                    </motion.div>

                    <span className="text-[10px] font-bold text-gray-500 dark:text-zinc-500">
                      Chair {index + 1}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Legend Box */}
            <div className="mt-8 flex gap-6 text-[10px] font-semibold text-gray-500 dark:text-zinc-450 border-t border-gray-200 dark:border-zinc-800 pt-4 w-full justify-center">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded bg-emerald-500/15 border border-emerald-500/30" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded bg-rose-500/15 border border-rose-500/30" />
                <span>Occupied</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded bg-amber-500/20 border border-amber-500" />
                <span>Selected</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* 3. FIXED FULL-WIDTH RED/AMBER BOTTOM BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-t border-gray-100 dark:border-zinc-800 shadow-2xl">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
              {selectedBarber ? `Stylist: ${selectedBarber.name}` : 'Stylist auto-selected'}
            </span>
            <span className="text-sm font-extrabold text-amber-500 dark:text-amber-400">
              {selectedChair ? `Chair ${selectedChair.split('_')[1] || '1'} Selected` : 'Tap a green chair above'}
            </span>
          </div>

          <Button
            variant="primary"
            disabled={!canProceed}
            onClick={() => navigate('/app/date')}
            className="w-48 sm:w-64 h-12 text-sm font-extrabold rounded-2xl cursor-pointer bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/25 border-none"
          >
            <span>Book Appointment</span>
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </div>
      </div>

    </div>
  );
};
