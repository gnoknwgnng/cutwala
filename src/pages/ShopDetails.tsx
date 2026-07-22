import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Star, Clock, MapPin, ChevronLeft, UserCheck, Armchair, Check, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Button, GlassCard, Badge } from '../components/UI';

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

  // Find shop
  const shop = shops.find(s => s.shop_id === shopId) || shops[0];
  const isFav = favoriteShops.includes(shop.shop_id);

  // Barbers working at this shop
  const shopBarbers = barbers.filter(b => b.shop_id === shop.shop_id);
  const shopChairs = chairs.filter(c => c.shop_id === shop.shop_id);

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

  const selectedBarber = barbers.find(b => b.barber_id === selectedBarberId);
  const canProceed = selectedBarberId && selectedChair;

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-zinc-950 pb-28 relative overflow-y-auto no-scrollbar">
      
      {/* 1. Header Banner & Floating buttons */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden shrink-0 border-b border-gray-150/20 dark:border-zinc-800">
        <img 
          src={shop.image} 
          alt={shop.name} 
          className="h-full w-full object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />

        {/* Back and Favorite buttons */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <button 
            onClick={() => {
              resetBookingFlow();
              navigate('/app/home');
            }}
            className="p-2.5 rounded-2xl bg-black/50 text-white backdrop-blur-md hover:bg-black/60 transition-colors border border-white/10 cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <button 
            onClick={() => setFavorite(shop.shop_id)}
            className={`p-2.5 rounded-2xl backdrop-blur-md transition-colors border cursor-pointer ${
              isFav 
                ? 'bg-amber-500 text-black border-amber-400 font-bold' 
                : 'bg-black/50 text-white border-white/10 hover:bg-black/60'
            }`}
          >
            <Heart className={`h-5 w-5 ${isFav ? 'fill-black' : ''}`} />
          </button>
        </div>

        {/* Shop Name & Details overlaid */}
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Badge status="OPEN" className="scale-90 origin-left" />
            <div className="flex items-center gap-1 text-xs font-semibold text-amber-400">
              <Star className="h-4 w-4 fill-amber-400" /> {shop.rating} (120+ reviews)
            </div>
          </div>
          <h1 className="font-display font-extrabold text-2xl md:text-4xl tracking-tight">
            {shop.name}
          </h1>
          <p className="text-sm text-gray-300 flex items-center gap-1.5 mt-1.5">
            <MapPin className="h-4 w-4 text-amber-500 shrink-0" /> {shop.address}
          </p>
        </div>
      </div>

      {/* 2. Content Panels */}
      <div className="max-w-3xl mx-auto w-full px-4 mt-6 flex flex-col gap-8">
        
        {/* Description & Operating Hours */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-550 mb-2">
              About the Shop
            </h3>
            <p className="text-sm text-gray-600 dark:text-zinc-450 leading-relaxed font-medium">
              {shop.description}
            </p>
          </div>

          <GlassCard className="!p-4 h-fit">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 mb-3 flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-amber-500" /> Working Hours
            </h4>
            <div className="flex justify-between text-xs font-semibold text-gray-700 dark:text-zinc-350">
              <span>Mon - Sun</span>
              <span>{shop.opening_time} - {shop.closing_time}</span>
            </div>
          </GlassCard>
        </div>

        {/* Gallery */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-550 mb-3">
            Gallery
          </h3>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1.5 snap-x">
            {shop.gallery.map((imgUrl, idx) => (
              <div 
                key={idx} 
                className="w-40 h-28 rounded-2xl overflow-hidden shrink-0 border border-gray-250/20 snap-start bg-zinc-150 dark:bg-zinc-800"
              >
                <img 
                  src={imgUrl} 
                  alt="Gallery preview" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 3. AVAILABLE BARBERS (Auto-selected first one by default) */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-450 dark:text-zinc-400 mb-4 flex items-center gap-2">
            <span>💈</span> Available Barbers (Default Selected)
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {shopBarbers.map((barber) => {
              const isSelected = selectedBarberId === barber.barber_id;
              return (
                <div
                  key={barber.barber_id}
                  onClick={() => handleSelectBarber(barber.barber_id)}
                  className={`flex items-start gap-4 p-4 rounded-3xl border transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500 shadow-md dark:bg-amber-500/5'
                      : 'bg-white dark:bg-zinc-900 border-gray-150 dark:border-zinc-850 hover:bg-gray-50/50 dark:hover:bg-zinc-850/30'
                  }`}
                >
                  <img
                    src={barber.photo}
                    alt={barber.name}
                    className="h-16 w-16 rounded-2xl object-cover border border-gray-250/20 bg-zinc-150 dark:bg-zinc-800"
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                        {barber.name}
                      </h4>
                      <p className="text-xs text-amber-500 dark:text-amber-400 font-semibold truncate mt-0.5">
                        {barber.specialization}
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-zinc-500 font-bold uppercase mt-1">
                        Exp: {barber.experience}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2.5">
                      <span className="text-[10px] bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-450 px-2 py-0.5 rounded-full font-bold">
                        ⭐ {barber.rating}
                      </span>
                      
                      <div className={`h-5 w-5 rounded-full border flex items-center justify-center transition-all ${
                        isSelected 
                          ? 'bg-amber-500 border-amber-400 text-black' 
                          : 'border-gray-300 dark:border-zinc-700'
                      }`}>
                        {isSelected && <Check className="h-3.5 w-3.5 text-black stroke-[3.5]" />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. LIVE CHAIR AVAILABILITY */}
        <div className="border-t border-gray-200/60 dark:border-zinc-850 pt-8 mb-6">
          <div className="flex items-center justify-between mb-6 px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-450 dark:text-zinc-400 flex items-center gap-2">
              <span>💺</span> Live Chair Status
            </h3>
            
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[9px] uppercase font-bold tracking-wider text-gray-400 dark:text-zinc-500">
                Live Polling Active
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center p-6 bg-white dark:bg-zinc-900 border border-gray-150/40 dark:border-zinc-800/80 rounded-3xl shadow-sm">
            {/* Mirrors line */}
            <div className="w-4/5 h-2 rounded-full bg-zinc-300 dark:bg-zinc-800 shadow-inner mb-2" />
            <p className="text-[9px] text-gray-400 dark:text-zinc-550 uppercase tracking-widest font-extrabold mb-10">
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
                          : 'bg-gray-50 dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 text-emerald-500 hover:border-emerald-400'
                      }`}
                    >
                      <Armchair className="h-7 w-7" />

                      {/* Small number tag */}
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
            <div className="mt-8 flex gap-6 text-[10px] font-semibold text-gray-500 dark:text-zinc-450 border-t border-gray-100 dark:border-zinc-850 pt-4 w-full justify-center">
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

      {/* 5. Sticky Checkout drawer at the bottom */}
      <div className="fixed bottom-18 md:bottom-0 left-0 right-0 md:left-64 z-30 p-4 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-zinc-800/80 shadow-2xl transition-all duration-300">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Selected highlights */}
          <div className="flex flex-wrap items-center gap-3.5 text-xs font-semibold">
            {selectedBarber ? (
              <div className="flex items-center gap-1.5 text-gray-800 dark:text-zinc-200 bg-gray-100 dark:bg-zinc-800 px-3 py-1.5 rounded-xl">
                <UserCheck className="h-3.5 w-3.5 text-amber-500" />
                <span>Stylist: {selectedBarber.name}</span>
              </div>
            ) : (
              <div className="text-gray-400 dark:text-zinc-500 flex items-center gap-1">
                <span>• Select a barber</span>
              </div>
            )}

            {selectedChair ? (
              <div className="flex items-center gap-1.5 text-gray-800 dark:text-zinc-200 bg-gray-100 dark:bg-zinc-800 px-3 py-1.5 rounded-xl">
                <Armchair className="h-3.5 w-3.5 text-amber-500" />
                <span>Chair: {selectedChair.split('_')[1] ? `Chair ${selectedChair.split('_')[1]}` : selectedChair}</span>
              </div>
            ) : (
              <div className="text-gray-400 dark:text-zinc-500 flex items-center gap-1">
                <span>• Choose an available chair</span>
              </div>
            )}
          </div>

          {/* Action button */}
          <Button
            variant="primary"
            disabled={!canProceed}
            onClick={() => navigate('/app/date')}
            className="sm:w-64 cursor-pointer"
          >
            Choose Date & Time <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

        </div>
      </div>

    </div>
  );
};
