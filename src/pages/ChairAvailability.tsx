import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Armchair, Check, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Button } from '../components/UI';

export const ChairAvailability: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentBookingFlow, 
    chairs, 
    setBookingChair, 
    tickChairs,
    showToast 
  } = useStore();

  const [selectedChair, setSelectedChair] = useState<string>('');

  const shopId = currentBookingFlow.shopId || 'shop1';

  // Filter chairs for this shop
  const shopChairs = chairs.filter(c => c.shop_id === shopId);

  // Set up live ticking status simulation (toggles chair availability every 3.5s)
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
        // Selected chair got occupied by live update
        setSelectedChair('');
        setBookingChair('');
        showToast('Your selected chair was just occupied. Please select another!', 'info');
      }
    }
  }, [chairs, selectedChair, shopChairs, setBookingChair, showToast]);

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

  const handleProceed = () => {
    if (selectedChair) {
      navigate('/app/date');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-zinc-950 pb-24 relative select-none">
      
      {/* Header bar */}
      <header className="flex h-16 items-center justify-between px-4 bg-white dark:bg-zinc-900 border-b border-gray-150/20 dark:border-zinc-800 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="font-display font-extrabold text-lg text-gray-900 dark:text-white">
            Live Chair Status
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 dark:text-zinc-400">
            Live Stream active
          </span>
        </div>
      </header>

      {/* Main visual layouts */}
      <div className="max-w-md mx-auto w-full px-4 mt-8 flex-1 flex flex-col justify-between">
        
        <div className="flex flex-col items-center">
          {/* Mirrors screen direction */}
          <div className="w-4/5 h-2.5 rounded-full bg-zinc-350 dark:bg-zinc-700/80 shadow-inner mb-2" />
          <p className="text-[10px] text-gray-400 dark:text-zinc-550 uppercase tracking-widest font-extrabold mb-10">
            Stylist Mirror & Workspace
          </p>

          {/* Seat Grid layout */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-8 w-full px-6">
            {shopChairs.map((chair, index) => {
              const isSelected = selectedChair === chair.chair_id;
              const isOccupied = chair.status === 'occupied';

              return (
                <motion.div
                  key={chair.chair_id}
                  layoutId={`chair-${chair.chair_id}`}
                  onClick={() => handleSelectChair(chair.chair_id, chair.status)}
                  className="flex flex-col items-center gap-2 cursor-pointer"
                >
                  {/* Visual Chair element */}
                  <motion.div
                    animate={{
                      scale: isSelected ? 1.05 : 1,
                      boxShadow: isSelected ? '0 10px 25px -5px rgba(212, 175, 55, 0.4)' : 'none'
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={`relative w-20 h-20 rounded-2xl border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500 text-amber-500 dark:bg-amber-500/5'
                        : isOccupied
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-500/80 dark:bg-rose-500/5'
                        : 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-emerald-500 hover:border-emerald-400'
                    }`}
                  >
                    <Armchair className="h-9 w-9 transition-transform" />

                    {/* Small tag status */}
                    <div className="absolute -top-1.5 -right-1.5">
                      <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold border ${
                        isSelected 
                          ? 'bg-amber-500 border-amber-400 text-black' 
                          : isOccupied 
                          ? 'bg-rose-600 border-rose-500 text-white' 
                          : 'bg-emerald-600 border-emerald-500 text-white'
                      }`}>
                        {isSelected ? <Check className="h-3 w-3 stroke-[3]" /> : (index + 1)}
                      </span>
                    </div>

                    {/* Status pulsing effects */}
                    {!isOccupied && !isSelected && (
                      <span className="absolute bottom-1 right-1 flex h-1.5 w-1.5">
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                      </span>
                    )}
                  </motion.div>

                  <span className="text-xs font-bold text-gray-500 dark:text-zinc-400">
                    Chair {index + 1}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Legend Panel & Proceeds */}
        <div className="mt-12 flex flex-col gap-6 w-full">
          {/* Legend */}
          <div className="flex items-center justify-center gap-6 px-4 py-3 bg-white dark:bg-zinc-900 border border-gray-150/40 dark:border-zinc-800/80 rounded-2xl shadow-sm text-xs font-semibold">
            <div className="flex items-center gap-2">
              <div className="h-3.5 w-3.5 rounded bg-emerald-500/10 border border-emerald-500/30" />
              <span className="text-gray-600 dark:text-zinc-400">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3.5 w-3.5 rounded bg-rose-500/10 border border-rose-500/30" />
              <span className="text-gray-600 dark:text-zinc-400">Occupied</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3.5 w-3.5 rounded bg-amber-500/20 border border-amber-500" />
              <span className="text-gray-600 dark:text-zinc-400">Selected</span>
            </div>
          </div>

          {/* Action button */}
          <Button
            variant="primary"
            disabled={!selectedChair}
            onClick={handleProceed}
            fullWidth
            className="cursor-pointer"
          >
            Select Date & Time <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

      </div>

    </div>
  );
};
