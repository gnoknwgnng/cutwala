import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Armchair, Check, Calendar, Clock, ArrowRight, UserCheck } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Button } from '../components/UI';

export const ChairAvailability: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentBookingFlow, 
    barbers,
    chairs, 
    setBookingBarber,
    setBookingChair, 
    setBookingDate,
    setBookingTime,
    tickChairs,
    showToast 
  } = useStore();

  const shopId = currentBookingFlow.shopId || 'shop1';

  // Barbers and chairs for this shop
  const shopBarbers = barbers.filter(b => b.shop_id === shopId);
  const shopChairs = chairs.filter(c => c.shop_id === shopId);

  // Generate next 14 days starting from today
  const getDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + i);
      
      const dayName = targetDate.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = targetDate.getDate();
      const monthName = targetDate.toLocaleDateString('en-US', { month: 'short' });
      const fullDateStr = targetDate.toISOString().split('T')[0]; // YYYY-MM-DD

      dates.push({ dayName, dayNum, monthName, fullDateStr });
    }
    return dates;
  };

  const datesList = getDates();
  const defaultDateStr = currentBookingFlow.date || datesList[0].fullDateStr;
  const [selectedDateStr, setSelectedDateStr] = useState<string>(defaultDateStr);

  const timeSlots = [
    { time: '10:00 AM', isBooked: false },
    { time: '10:30 AM', isBooked: false },
    { time: '11:00 AM', isBooked: true },
    { time: '11:30 AM', isBooked: false },
    { time: '12:00 PM', isBooked: false },
    { time: '01:30 PM', isBooked: true },
    { time: '02:00 PM', isBooked: false },
    { time: '03:00 PM', isBooked: false },
    { time: '04:00 PM', isBooked: true },
    { time: '04:30 PM', isBooked: false },
    { time: '05:30 PM', isBooked: false },
    { time: '06:00 PM', isBooked: false },
  ];

  const defaultTimeStr = currentBookingFlow.time || timeSlots[0].time;
  const [selectedTimeStr, setSelectedTimeStr] = useState<string>(defaultTimeStr);

  const [selectedChair, setSelectedChair] = useState<string>(currentBookingFlow.chairId || '');
  const [selectedBarberId, setSelectedBarberId] = useState<string>(
    currentBookingFlow.barberId || (shopBarbers[0] ? shopBarbers[0].barber_id : '')
  );

  // Synchronize store defaults on mount
  useEffect(() => {
    if (!currentBookingFlow.barberId && shopBarbers.length > 0) {
      setBookingBarber(shopBarbers[0].barber_id);
    }
    if (!currentBookingFlow.date) {
      setBookingDate(defaultDateStr);
    }
    if (!currentBookingFlow.time) {
      setBookingTime(defaultTimeStr);
    }
  }, [shopId]);

  // Live chair polling simulation
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
  }, [chairs, selectedChair, shopChairs, setBookingChair, showToast]);

  const handleSelectDate = (dateStr: string) => {
    setSelectedDateStr(dateStr);
    setBookingDate(dateStr);
  };

  const handleSelectTime = (timeStr: string, isBooked: boolean) => {
    if (isBooked) return;
    setSelectedTimeStr(timeStr);
    setBookingTime(timeStr);
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

  const handleSelectBarber = (id: string) => {
    setSelectedBarberId(id);
    setBookingBarber(id);
  };

  const handleProceed = () => {
    if (selectedBarberId && selectedChair && selectedDateStr && selectedTimeStr) {
      navigate('/app/summary');
    } else if (!selectedChair) {
      showToast('Please select an available chair to proceed.', 'error');
    }
  };

  const selectedBarber = barbers.find(b => b.barber_id === selectedBarberId);
  const canProceed = Boolean(selectedBarberId && selectedChair && selectedDateStr && selectedTimeStr);

  const formatSelectedDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-[#0b0b0c] pb-28 relative select-none overflow-y-auto no-scrollbar">
      
      {/* 1. HEADER BAR */}
      <header className="flex h-14 items-center justify-between px-4 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="font-display font-extrabold text-base text-gray-900 dark:text-white">
            Book Appointment
          </h1>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-[9px] uppercase font-bold tracking-wider text-gray-400 dark:text-zinc-500">
            Live Stream
          </span>
        </div>
      </header>

      {/* 2. UNIFIED SINGLE SCREEN FORM (Order: 1. Date & Time -> 2. Live Chair -> 3. Barber at Last) */}
      <div className="max-w-2xl mx-auto w-full px-4 pt-4 flex flex-col gap-6">
        
        {/* 1. DATE & TIME SELECTION (TOP) */}
        <div className="flex flex-col gap-3">
          <h3 className="font-display font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-amber-500" /> Select Date & Time
          </h3>

          {/* Horizontal Date Strip */}
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
            {datesList.map((item) => {
              const isSelected = selectedDateStr === item.fullDateStr;
              return (
                <motion.div
                  key={item.fullDateStr}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSelectDate(item.fullDateStr)}
                  className={`flex flex-col items-center justify-center min-w-[70px] px-3 py-3 rounded-2xl border transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-amber-500 border-amber-400 text-black shadow-lg shadow-amber-500/20'
                      : 'bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-800 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span className={`text-[9px] font-bold uppercase tracking-wider ${isSelected ? 'text-black/60' : 'text-gray-400 dark:text-zinc-500'}`}>
                    {item.monthName}
                  </span>
                  <span className="text-xl font-extrabold font-display leading-tight my-1">
                    {item.dayNum}
                  </span>
                  <span className={`text-[9px] font-extrabold uppercase tracking-widest ${isSelected ? 'text-black' : 'text-gray-500 dark:text-zinc-400'}`}>
                    {item.dayName}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Time Slots Grid */}
          <div className="flex flex-col gap-2 pt-1">
            <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-amber-500" /> Time Slot
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
              {timeSlots.map((slot) => {
                const isSelected = selectedTimeStr === slot.time;
                return (
                  <button
                    key={slot.time}
                    onClick={() => handleSelectTime(slot.time, slot.isBooked)}
                    disabled={slot.isBooked}
                    className={`py-2.5 px-2 rounded-xl border text-xs font-extrabold transition-all text-center select-none cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500 border-amber-400 text-black shadow-md'
                        : slot.isBooked
                        ? 'bg-gray-100 border-gray-200 text-gray-300 dark:bg-zinc-850 dark:border-zinc-800 dark:text-zinc-700 pointer-events-none line-through'
                        : 'bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-800 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {slot.time}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. LIVE CHAIR STATUS (MIDDLE) */}
        <div className="flex flex-col gap-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
              <Armchair className="h-5 w-5 text-amber-500" /> Live Chair Status
            </h3>
            <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
              Tap green chair to select
            </span>
          </div>

          <div className="flex flex-col items-center p-5 bg-gray-50 dark:bg-zinc-900 border border-gray-200/60 dark:border-zinc-800/80 rounded-3xl shadow-sm">
            {/* Mirrors line */}
            <div className="w-4/5 h-2 rounded-full bg-zinc-300 dark:bg-zinc-800 shadow-inner mb-2" />
            <p className="text-[9px] text-gray-400 dark:text-zinc-550 uppercase tracking-widest font-extrabold mb-6">
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
            <div className="mt-6 flex gap-6 text-[10px] font-semibold text-gray-500 dark:text-zinc-450 border-t border-gray-200 dark:border-zinc-800 pt-3.5 w-full justify-center">
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

        {/* 3. BARBERS & STYLISTS SELECTION (KEPT AT THE LAST) */}
        <div className="flex flex-col gap-3 pt-2 mb-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-amber-500" /> Barbers & Stylists
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

                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-amber-500 text-black flex items-center justify-center shadow-md">
                        <Check className="h-3.5 w-3.5 stroke-[3.5]" />
                      </div>
                    )}
                  </div>

                  <h4 className="font-bold text-xs text-gray-900 dark:text-white text-center truncate w-full">
                    {barber.name}
                  </h4>
                  <p className="text-[10px] text-gray-500 dark:text-zinc-450 text-center truncate w-full font-medium mt-0.5">
                    {barber.specialization.split('&')[0]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 3. FIXED BOTTOM SUMMARY & PROCEED BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-t border-gray-100 dark:border-zinc-800 shadow-2xl">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider truncate">
              {selectedBarber ? `Stylist: ${selectedBarber.name}` : 'Stylist: Auto'} • {selectedChair ? `Chair ${selectedChair.split('_')[1] || '1'}` : 'No Chair'}
            </span>
            <span className="text-xs font-extrabold text-amber-500 dark:text-amber-400 truncate mt-0.5">
              📅 {formatSelectedDateDisplay(selectedDateStr)} @ {selectedTimeStr}
            </span>
          </div>

          <Button
            variant="primary"
            disabled={!canProceed}
            onClick={handleProceed}
            className="w-48 sm:w-64 h-12 text-sm font-extrabold rounded-2xl cursor-pointer bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/25 border-none"
          >
            <span>Proceed to Summary</span>
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </div>
      </div>

    </div>
  );
};
