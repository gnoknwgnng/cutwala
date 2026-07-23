import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Check, Calendar, Clock, ArrowRight, UserCheck, Home, AlertTriangle } from 'lucide-react';
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
    confirmBooking,
    tickChairs,
    showToast 
  } = useStore();

  const shopId = currentBookingFlow.shopId || 'shop1';

  // Barbers and chairs for this shop
  const shopBarbers = barbers.filter(b => b.shop_id === shopId);
  const lastTimeBarbers = shopBarbers.filter(b => b.isLastTimeBarber);
  const availableBarbers = shopBarbers.filter(b => !b.isLastTimeBarber && b.availability);
  const notAvailableBarbers = shopBarbers.filter(b => !b.availability);
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

  // Time slots calculation from 10:00 AM to 12:00 AM based on selected date & barber
  const generateTimeSlots = (dateStr: string, barberId: string) => {
    const rawSlots = [
      '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
      '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
      '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
      '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
      '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM',
      '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM',
      '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM',
      '12:00 AM'
    ];

    // Seed pseudo-random generator based on date and barberId
    const seedStr = `${dateStr}_${barberId}`;
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
      hash = (hash << 5) - hash + seedStr.charCodeAt(i);
      hash |= 0;
    }

    return rawSlots.map((time, index) => {
      // Deterministic booked slots pattern per barber & date combination
      const isBooked = ((Math.abs(hash) + index * 7 + (index % 3)) % 5) === 0;
      return { time, isBooked };
    });
  };

  const [selectedChair, setSelectedChair] = useState<string>(currentBookingFlow.chairId || '');
  const [selectedBarberId, setSelectedBarberId] = useState<string>(
    currentBookingFlow.barberId || (shopBarbers[0] ? shopBarbers[0].barber_id : '')
  );

  const timeSlots = generateTimeSlots(selectedDateStr, selectedBarberId);

  const defaultTimeStr = currentBookingFlow.time || (timeSlots.find(s => !s.isBooked)?.time || '10:00 AM');
  const [selectedTimeStr, setSelectedTimeStr] = useState<string>(defaultTimeStr);

  // Auto-adjust selected time if it becomes booked on date or barber change
  useEffect(() => {
    const currentSlot = timeSlots.find(s => s.time === selectedTimeStr);
    if (!currentSlot || currentSlot.isBooked) {
      const firstAvailable = timeSlots.find(s => !s.isBooked);
      if (firstAvailable) {
        setSelectedTimeStr(firstAvailable.time);
        setBookingTime(firstAvailable.time);
      }
    }
  }, [selectedDateStr, selectedBarberId]);

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

  // Check if ALL chairs in the shop/slot are occupied
  const areAllChairsOccupied = shopChairs.length > 0 && shopChairs.every(c => c.status === 'occupied');

  const handleProceed = () => {
    if (areAllChairsOccupied) {
      showToast('All chairs are currently occupied for this slot.', 'error');
      return;
    }
    if (selectedBarberId && selectedChair && selectedDateStr && selectedTimeStr) {
      const newBooking = confirmBooking();
      navigate('/app/success', { state: { booking: newBooking } });
    } else if (!selectedChair) {
      showToast('Please select an available chair to proceed.', 'error');
    }
  };

  const canProceed = Boolean(!areAllChairsOccupied && selectedBarberId && selectedChair && selectedDateStr && selectedTimeStr);

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-[#0b0b0c] pb-24 relative select-none overflow-y-auto no-scrollbar">
      
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

      {/* 2. UNIFIED SINGLE SCREEN FORM */}
      <div className="max-w-2xl mx-auto w-full px-4 pt-4 flex flex-col gap-6">
        
        {/* 1. DATE & TIME SELECTION (TOP) */}
        <div className="flex flex-col gap-3">
          <h3 className="font-display font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-orange-500" /> Select Date & Time
          </h3>

          {/* Horizontal Date Strip */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {datesList.map((item) => {
              const isSelected = selectedDateStr === item.fullDateStr;
              return (
                <motion.div
                  key={item.fullDateStr}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSelectDate(item.fullDateStr)}
                  className={`flex flex-col items-center justify-center min-w-[52px] px-2 py-1.5 rounded-xl border transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-orange-500 border-orange-400 text-white shadow-md shadow-orange-500/20'
                      : 'bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-800 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span className={`text-[8px] font-bold uppercase tracking-wider ${isSelected ? 'text-white/80' : 'text-gray-400 dark:text-zinc-500'}`}>
                    {item.monthName}
                  </span>
                  <span className="text-sm font-extrabold font-display leading-tight my-0.5">
                    {item.dayNum}
                  </span>
                  <span className={`text-[8px] font-extrabold uppercase tracking-widest ${isSelected ? 'text-white' : 'text-gray-500 dark:text-zinc-400'}`}>
                    {item.dayName}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Time Slots Grid */}
          <div className="flex flex-col gap-2 pt-1">
            <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-orange-500" /> Time Slot
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
                        ? 'bg-orange-500 border-orange-400 text-white shadow-md'
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

        {/* 2. LIVE CHAIR STATUS (WITH REAL CHAIR IMAGES occupied.jpeg & unoccupied.jpeg) */}
        <div className="flex flex-col gap-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
              <span className="text-xl">💺</span> Live Chair Seating
            </h3>
            <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
              {areAllChairsOccupied ? 'All Seats Full' : 'Tap empty chair to select'}
            </span>
          </div>

          {/* ALL CHAIRS FULL ALERT BANNER */}
          {areAllChairsOccupied && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-rose-600 dark:text-rose-400"
            >
              <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0" />
              <div>
                <p className="text-xs font-black uppercase tracking-wider">All Chairs Currently Occupied</p>
                <p className="text-[11px] font-semibold opacity-90">All seats are full for this slot. Please select another slot or return to Home.</p>
              </div>
            </motion.div>
          )}

          <div className="flex flex-col items-center p-5 bg-gray-50 dark:bg-zinc-900 border border-gray-200/60 dark:border-zinc-800/80 rounded-3xl shadow-sm">
            {/* Mirrors line */}
            <div className="w-4/5 h-2 rounded-full bg-zinc-300 dark:bg-zinc-800 shadow-inner mb-2" />
            <p className="text-[9px] text-gray-400 dark:text-zinc-550 uppercase tracking-widest font-extrabold mb-6">
              Stylist Mirrors Workspace
            </p>

            {/* Seat Grid with Real Chair Images */}
            <div className="grid grid-cols-2 gap-x-10 gap-y-6 w-full max-w-xs justify-items-center">
              {shopChairs.map((chair, index) => {
                const isSelected = selectedChair === chair.chair_id;
                const isOccupied = chair.status === 'occupied';

                return (
                  <div
                    key={chair.chair_id}
                    onClick={() => handleSelectChair(chair.chair_id, chair.status)}
                    className="flex flex-col items-center gap-2 cursor-pointer group"
                  >
                    <motion.div
                      animate={{
                        scale: isSelected ? 1.06 : 1,
                      }}
                      className={`relative w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all bg-white dark:bg-zinc-900 p-1 ${
                        isSelected
                          ? 'border-orange-500 ring-4 ring-orange-500/30 shadow-xl scale-105'
                          : isOccupied
                          ? 'border-rose-500/40 opacity-85'
                          : 'border-emerald-500/50 hover:border-emerald-400 shadow-md'
                      }`}
                    >
                      {/* REAL CHAIR IMAGE (occupied.jpg vs unoccupied.jpg) */}
                      <img
                        src={isOccupied ? "/occupied.jpg" : "/unoccupied.jpg"}
                        alt={isOccupied ? "Occupied Barber Chair" : "Available Barber Chair"}
                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Numbered status badge */}
                      <div className="absolute top-1.5 right-1.5 z-10">
                        <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-black border shadow-md ${
                          isSelected 
                            ? 'bg-orange-500 border-orange-400 text-white' 
                            : isOccupied 
                            ? 'bg-rose-600 border-rose-500 text-white' 
                            : 'bg-emerald-600 border-emerald-500 text-white'
                        }`}>
                          {isSelected ? <Check className="h-3 w-3 stroke-[3.5]" /> : (index + 1)}
                        </span>
                      </div>
                    </motion.div>

                    <span className="text-xs font-extrabold text-gray-800 dark:text-zinc-200">
                      Chair {index + 1}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Legend Box with Image Samples */}
            <div className="mt-6 flex flex-wrap gap-5 text-[10px] font-bold text-gray-600 dark:text-zinc-400 border-t border-gray-200 dark:border-zinc-800 pt-4 w-full justify-center">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-lg overflow-hidden border border-emerald-500/50 bg-white p-0.5">
                  <img src="/unoccupied.jpg" alt="Vacant" className="h-full w-full object-contain" />
                </div>
                <span>Vacant (Green)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-lg overflow-hidden border border-rose-500/50 bg-white p-0.5">
                  <img src="/occupied.jpg" alt="Occupied" className="h-full w-full object-contain" />
                </div>
                <span>Occupied (Red)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-lg overflow-hidden border-2 border-orange-500 bg-white p-0.5 ring-2 ring-orange-500/30">
                  <img src="/unoccupied.jpg" alt="Selected" className="h-full w-full object-contain" />
                </div>
                <span>Selected (Orange)</span>
              </div>
            </div>

          </div>
        </div>

        {/* 3. BARBERS & STYLISTS SELECTION (ALL IN ONE HORIZONTAL LINE WITHOUT SUBHEADINGS) */}
        <div className="flex flex-col gap-3 pt-2 mb-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-orange-500" /> Barbers & Stylists
            </h3>
            <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
              Tap photo to select
            </span>
          </div>

          {/* SINGLE HORIZONTAL LINE FOR ALL BARBERS */}
          <div className="flex gap-4 overflow-x-auto no-scrollbar pt-1 pb-2">
            
            {/* 1. Last Time Barbers */}
            {lastTimeBarbers.map((barber) => {
              const isSelected = selectedBarberId === barber.barber_id;
              return (
                <div
                  key={barber.barber_id}
                  onClick={() => handleSelectBarber(barber.barber_id)}
                  className="flex flex-col items-center w-24 shrink-0 cursor-pointer group"
                >
                  <div className={`relative h-24 w-24 rounded-2xl overflow-hidden mb-1.5 border-2 transition-all ${
                    isSelected 
                      ? 'border-orange-500 shadow-lg scale-105 ring-2 ring-orange-500/30' 
                      : 'border-orange-400 dark:border-orange-500/50 group-hover:border-orange-500 shadow-md'
                  }`}>
                    <img
                      src={barber.photo}
                      alt={barber.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-orange-500 text-[8px] font-black text-white uppercase shadow-md">
                      ✨ Last Time
                    </div>
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-md">
                        <Check className="h-3.5 w-3.5 stroke-[3.5]" />
                      </div>
                    )}
                  </div>
                  <h4 className="font-bold text-xs text-gray-900 dark:text-white text-center truncate w-full">
                    {barber.name}
                  </h4>
                  <p className="text-[10px] text-orange-500 text-center truncate w-full font-bold">
                    ★ {barber.rating}
                  </p>
                </div>
              );
            })}

            {/* 2. Available Barbers */}
            {availableBarbers.map((barber) => {
              const isSelected = selectedBarberId === barber.barber_id;
              return (
                <div
                  key={barber.barber_id}
                  onClick={() => handleSelectBarber(barber.barber_id)}
                  className="flex flex-col items-center w-24 shrink-0 cursor-pointer group"
                >
                  <div className={`relative h-24 w-24 rounded-2xl overflow-hidden mb-1.5 border-2 transition-all ${
                    isSelected 
                      ? 'border-orange-500 shadow-lg scale-105 ring-2 ring-orange-500/20' 
                      : 'border-emerald-500/50 group-hover:border-emerald-500 shadow-sm'
                  }`}>
                    <img
                      src={barber.photo}
                      alt={barber.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-emerald-600 text-[8px] font-black text-white uppercase shadow-md">
                      Available
                    </div>
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-md">
                        <Check className="h-3.5 w-3.5 stroke-[3.5]" />
                      </div>
                    )}
                  </div>
                  <h4 className="font-bold text-xs text-gray-900 dark:text-white text-center truncate w-full">
                    {barber.name}
                  </h4>
                  <p className="text-[10px] text-gray-500 dark:text-zinc-450 text-center truncate w-full font-medium">
                    {barber.specialization.split('&')[0]}
                  </p>
                </div>
              );
            })}

            {/* 3. Not Available Barbers (Black & White Photos) */}
            {notAvailableBarbers.map((barber) => {
              return (
                <div
                  key={barber.barber_id}
                  className="flex flex-col items-center w-24 shrink-0 opacity-70 cursor-not-allowed pointer-events-none select-none"
                >
                  <div className="relative h-24 w-24 rounded-2xl overflow-hidden mb-1.5 border-2 border-gray-250 dark:border-zinc-800 bg-gray-200">
                    {/* BLACK AND WHITE PHOTO */}
                    <img
                      src={barber.photo}
                      alt={barber.name}
                      className="h-full w-full object-cover grayscale contrast-75"
                      style={{ filter: 'grayscale(100%)' }}
                    />
                    <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-zinc-800 text-[8px] font-black text-white uppercase shadow-md opacity-90">
                      Not Available
                    </div>
                  </div>
                  <h4 className="font-bold text-xs text-gray-400 dark:text-zinc-500 text-center truncate w-full line-through">
                    {barber.name}
                  </h4>
                  <p className="text-[9px] text-rose-500 text-center truncate w-full font-bold">
                    Occupied
                  </p>
                </div>
              );
            })}

          </div>
        </div>

      </div>

      {/* 3. FIXED BOTTOM ACTION CONTAINER */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-3 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-t border-gray-100 dark:border-zinc-800 shadow-2xl">
        <div className="max-w-2xl mx-auto w-full flex flex-col gap-2">
          
          {/* RETURN BACK TO HOME SCREEN BUTTON (APPEARS WHEN ALL CHAIRS FILLED) */}
          {areAllChairsOccupied && (
            <Button
              variant="outline"
              onClick={() => navigate('/app/home')}
              className="w-full h-11 text-xs font-extrabold rounded-2xl cursor-pointer bg-orange-500 hover:bg-orange-600 text-white border-none shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Home className="h-4 w-4" />
              <span>Return Back to Home Screen</span>
            </Button>
          )}

          {/* CONFIRM & BOOK BUTTON (DISABLED WHEN ALL CHAIRS FILLED) */}
          <Button
            variant="primary"
            disabled={!canProceed || areAllChairsOccupied}
            onClick={handleProceed}
            className={`w-full h-12 text-sm font-extrabold rounded-2xl border-none flex items-center justify-center gap-2 transition-all ${
              areAllChairsOccupied || !canProceed
                ? 'bg-gray-200 dark:bg-zinc-850 text-gray-400 dark:text-zinc-600 cursor-not-allowed opacity-60 pointer-events-none'
                : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25 cursor-pointer active:scale-95'
            }`}
          >
            <span>{areAllChairsOccupied ? 'Confirm & Book (Disabled)' : 'Confirm & Book'}</span>
            {!areAllChairsOccupied && <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>

    </div>
  );
};
