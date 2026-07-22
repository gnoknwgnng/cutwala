import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Star, DollarSign, ArrowRight, X, Compass, ChevronDown, Check } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Map } from '../components/Map';
import type { BarberShop } from '../mock/mockData';
import { Badge, DrawerModal } from '../components/UI';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { setBookingShop } = useStore();
  const [selectedShop, setSelectedShop] = useState<BarberShop | null>(null);
  
  // Saved locations state
  const savedAddresses = [
    { id: '1', tag: 'Home', address: 'HNo 1-7-201/2/1 Kamala Nagar, Hyderabad' },
    { id: '2', tag: 'Work', address: 'Building 4B, SOMA Tech District, SF' },
    { id: '3', tag: 'Current GPS', address: 'San Francisco, CA 94103' },
  ];
  
  const [activeAddress, setActiveAddress] = useState(savedAddresses[0]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState<boolean>(false);

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

  const getStartingPrice = (shopId: string) => {
    if (shopId === 'shop3') return '$20';
    return '$25';
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

      {/* 2. TOP ADDRESS BAR (Matches user screenshot: "Home - HNo 1-7-201/2/1 kamala naga... ⌄") */}
      <div className="absolute top-4 left-4 right-4 z-10 max-w-lg mx-auto w-[calc(100%-2rem)]">
        <button
          onClick={() => setIsAddressModalOpen(true)}
          className="w-full flex items-center justify-between gap-2.5 px-4 py-3 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-gray-200/80 dark:border-zinc-800 rounded-2xl shadow-xl hover:bg-white dark:hover:bg-zinc-900 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-2.5 min-w-0 flex-1 text-left">
            <div className="h-8 w-8 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <MapPin className="h-4.5 w-4.5 fill-orange-500 text-orange-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-extrabold text-gray-900 dark:text-white truncate tracking-tight">
                <span className="font-black text-gray-950 dark:text-white">{activeAddress.tag}</span>
                <span className="font-normal text-gray-600 dark:text-zinc-400"> - {activeAddress.address}</span>
              </p>
            </div>
          </div>

          <ChevronDown className="h-4.5 w-4.5 text-gray-400 dark:text-zinc-500 shrink-0 group-hover:text-orange-500 transition-colors" />
        </button>
      </div>

      {/* 3. Bottom Guidance Badge when no pin is selected */}
      {!selectedShop && (
        <div className="absolute bottom-6 left-4 right-4 z-10 max-w-sm mx-auto text-center pointer-events-none">
          <div className="bg-black/80 dark:bg-zinc-900/90 backdrop-blur-md text-white text-xs font-semibold py-2.5 px-4 rounded-full shadow-2xl border border-white/10 inline-flex items-center gap-2">
            <Compass className="h-4 w-4 text-orange-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Tap any pin on the map to view shop & book</span>
          </div>
        </div>
      )}

      {/* 4. Single Selected Shop Slide-Up Card (Google Maps style) */}
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
              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedShop(null);
                }}
                className="absolute top-3 right-3 h-7 w-7 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors z-10 cursor-pointer"
                title="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>

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
                    <span className="text-xs font-bold text-gray-800 dark:text-zinc-200 flex items-center gap-0.5">
                      <DollarSign className="h-3.5 w-3.5 text-emerald-500" /> {getStartingPrice(selectedShop.shop_id)}+
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

      {/* 5. INTERACTIVE ADDRESS SELECTION MODAL */}
      <DrawerModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        title="Select Grooming Location"
      >
        <div className="flex flex-col gap-3 pt-2">
          {savedAddresses.map((loc) => {
            const isSelected = activeAddress.id === loc.id;
            return (
              <div
                key={loc.id}
                onClick={() => {
                  setActiveAddress(loc);
                  setIsAddressModalOpen(false);
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-orange-500/10 border-orange-500 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 font-bold'
                    : 'bg-gray-50 dark:bg-zinc-850 border-gray-200 dark:border-zinc-800 text-gray-800 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-zinc-750 text-gray-600 dark:text-zinc-400'
                  }`}>
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold">{loc.tag}</p>
                    <p className="text-[11px] text-gray-500 dark:text-zinc-400 truncate mt-0.5">{loc.address}</p>
                  </div>
                </div>

                {isSelected && (
                  <Check className="h-4 w-4 text-orange-500 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </DrawerModal>

    </div>
  );
};
