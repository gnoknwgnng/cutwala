import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Star, 
  MapPin, 
  ChevronLeft, 
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
    favoriteShops, 
    setFavorite, 
    setBookingShop,
    showToast,
    resetBookingFlow
  } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  // Find shop
  const shop = shops.find(s => s.shop_id === shopId) || shops[0];
  const isFav = favoriteShops.includes(shop.shop_id);

  // Gallery photos list (hero image + gallery photos)
  const allImages = [shop.image, ...shop.gallery];

  const handleBookAppointment = () => {
    setBookingShop(shop.shop_id);
    navigate('/app/chairs');
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

      {/* 2. MAIN SHOP CONTENT AREA */}
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

        {/* HORIZONTAL PHOTO GALLERY THUMBNAILS */}
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

      </div>

      {/* 3. FIXED BOTTOM FULL-WIDTH BOOK APPOINTMENT BUTTON (Matches BookMyShow "Book tickets" button in Image 2) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-3 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-t border-gray-100 dark:border-zinc-800 shadow-2xl">
        <div className="max-w-2xl mx-auto w-full">
          <Button
            variant="primary"
            onClick={handleBookAppointment}
            className="w-full h-12 text-sm font-extrabold rounded-2xl cursor-pointer bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25 border-none flex items-center justify-center gap-2"
          >
            <span>Book Appointment</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

    </div>
  );
};
