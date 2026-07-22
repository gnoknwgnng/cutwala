import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Check, Calendar, Clock, ArrowRight, UserCheck } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Button } from '../components/UI';

// ==========================================
// Detailed SVG Graphic for Barber Chair & Seated Person
// ==========================================
const BarberChairGraphic: React.FC<{ status: 'available' | 'occupied' | 'selected' }> = ({ status }) => {
  const isOccupied = status === 'occupied';
  const isSelected = status === 'selected';
  
  // Theme color for accents (Green for available, Red for occupied, Orange for selected)
  const accentColor = isSelected ? '#ff6000' : isOccupied ? '#ef4444' : '#22c55e';

  return (
    <svg viewBox="0 0 200 220" className="w-full h-full object-contain">
      {/* Base & Shaft */}
      <ellipse cx="100" cy="195" rx="45" ry="12" fill="#121417" />
      <rect x="94" y="155" width="12" height="40" fill="#121417" />
      <line x1="80" y1="175" x2="94" y2="180" stroke="#121417" strokeWidth="4" strokeLinecap="round" />
      <circle cx="78" cy="174" r="4" fill="#121417" />

      {/* Footrest */}
      <rect x="125" y="172" width="35" height="10" rx="3" fill={accentColor} />
      <line x1="120" y1="145" x2="135" y2="172" stroke="#121417" strokeWidth="5" strokeLinecap="round" />

      {/* Seat Base Cushion */}
      <path d="M 60 135 C 60 130, 130 130, 130 135 L 125 155 C 125 158, 65 158, 65 155 Z" fill="#121417" />

      {/* Backrest */}
      <path d="M 45 65 C 45 60, 95 60, 95 65 L 90 140 C 90 142, 50 142, 50 140 Z" fill="#121417" stroke="#ffffff" strokeWidth="1" />

      {/* Headrest */}
      <rect x="55" y="32" width="30" height="22" rx="6" fill={accentColor} stroke="#ffffff" strokeWidth="0.8" />
      <rect x="65" y="54" width="10" height="10" fill="#121417" />

      {/* Armrests */}
      <path d="M 40 95 C 40 90, 85 90, 85 95 L 85 105 L 40 105 Z" fill={accentColor} />
      <rect x="38" y="95" width="8" height="35" rx="3" fill="#121417" />

      {/* OCCUPIED PERSON (ONLY VISIBLE WHEN CHAIR IS OCCUPIED) */}
      {isOccupied && (
        <g>
          {/* Head & Face in Profile */}
          <circle cx="110" cy="55" r="14" fill="#f8fafc" stroke="#121417" strokeWidth="2" />
          {/* Hair & Stylish Beard */}
          <path d="M 98 52 C 98 40, 118 40, 122 50 C 122 55, 118 55, 115 55 C 115 62, 108 65, 98 60 Z" fill="#121417" />
          {/* Neck */}
          <rect x="105" y="67" width="8" height="10" fill="#121417" />
          {/* Torso & Shirt */}
          <path d="M 85 75 C 95 72, 115 72, 120 78 L 125 115 C 115 120, 80 120, 75 115 Z" fill="#121417" stroke="#ffffff" strokeWidth="1" />
          {/* Arm resting forward */}
          <path d="M 100 85 Q 115 95, 130 95 L 135 98 C 130 102, 105 102, 95 90 Z" fill="#121417" />
          {/* Seated Legs */}
          <path d="M 85 118 Q 110 120, 125 135 L 138 165 C 132 170, 120 170, 115 140 L 80 125 Z" fill="#121417" stroke="#ffffff" strokeWidth="1" />
          {/* Shoes */}
          <ellipse cx="140" cy="170" rx="8" ry="4" fill="#121417" />
        </g>
      )}
    </svg>
  );
};

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
      const newBooking = confirmBooking();
      navigate('/app/success', { state: { booking: newBooking } });
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
      
      {/* 1. TOP HEADER BAR */}
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

      {/* 2. MAIN SELECTION FORM */}
      <div className="max-w-2xl mx-auto w-full px-4 pt-4 flex flex-col gap-6">
        
        {/* 1. DATE & TIME SELECTION (TOP) */}
        <div className="flex flex-col gap-3">
          <h3 className="font-display font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-orange-500" /> Select Date & Time
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
                      ? 'bg-orange-500 border-orange-400 text-white shadow-lg shadow-orange-500/25'
                      : 'bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-800 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span className={`text-[9px] font-bold uppercase tracking-wider ${isSelected ? 'text-white/80' : 'text-gray-400 dark:text-zinc-500'}`}>
                    {item.monthName}
                  </span>
                  <span className="text-xl font-extrabold font-display leading-tight my-1">
                    {item.dayNum}
                  </span>
                  <span className={`text-[9px] font-extrabold uppercase tracking-widest ${isSelected ? 'text-white' : 'text-gray-500 dark:text-zinc-400'}`}>
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

        {/* 2. LIVE CHAIR STATUS (STYLIST MIRRORS WORKSPACE GRID MATCHING REFERENCE IMAGE) */}
        <div className="flex flex-col gap-3 pt-2">
          
          {/* Header Title */}
          <div className="flex items-center justify-between">
            <h3 className="font-display font-extrabold text-base text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-1.5">
              <span>STYLIST MIRRORS</span>
              <span className="text-emerald-500">WORKSPACE</span>
            </h3>
            <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
              Tap green chair to select
            </span>
          </div>

          {/* 2x2 SQUARE SEAT CARDS GRID */}
          <div className="grid grid-cols-2 gap-4 w-full">
            {shopChairs.map((chair, index) => {
              const isSelected = selectedChair === chair.chair_id;
              const isOccupied = chair.status === 'occupied';
              const chairNum = index + 1;

              const currentStatus = isSelected ? 'selected' : isOccupied ? 'occupied' : 'available';

              return (
                <div
                  key={chair.chair_id}
                  onClick={() => handleSelectChair(chair.chair_id, chair.status)}
                  className={`flex flex-col items-center justify-between p-4 rounded-3xl border-2 transition-all cursor-pointer relative bg-zinc-950 text-white min-h-[220px] ${
                    isSelected
                      ? 'border-orange-500 ring-4 ring-orange-500/25 shadow-xl shadow-orange-500/20 scale-[1.02]'
                      : isOccupied
                      ? 'border-red-500/90 shadow-md opacity-95'
                      : 'border-emerald-500/90 hover:border-emerald-400 hover:scale-[1.01] shadow-md'
                  }`}
                >
                  {/* Top Right Badge Circle (Red 1 / Green 2,3,4 / Orange Checkmark) */}
                  <div className="absolute top-3 right-3">
                    <div className={`h-7 w-7 rounded-full flex items-center justify-center font-extrabold text-xs text-white shadow-lg ${
                      isSelected
                        ? 'bg-orange-500 border border-orange-300'
                        : isOccupied
                        ? 'bg-red-500 border border-red-400'
                        : 'bg-emerald-500 border border-emerald-400'
                    }`}>
                      {isSelected ? <Check className="h-4 w-4 stroke-[3.5]" /> : chairNum}
                    </div>
                  </div>

                  {/* Center Barber Chair SVG Graphic (With Seated Person if Occupied) */}
                  <div className="w-full h-36 flex items-center justify-center mt-2">
                    <BarberChairGraphic status={currentStatus} />
                  </div>

                  {/* Subtitle at Bottom */}
                  <span className="font-display font-extrabold text-sm text-gray-200 tracking-wide mt-2">
                    Chair {chairNum}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Legend Bar */}
          <div className="flex gap-6 text-[10px] font-bold text-gray-500 dark:text-zinc-450 border-t border-gray-200 dark:border-zinc-800 pt-3 w-full justify-center">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded bg-emerald-500 border border-emerald-400" />
              <span>Available (Empty)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded bg-red-500 border border-red-400" />
              <span>Occupied (Seated)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded bg-orange-500 border border-orange-400" />
              <span>Selected</span>
            </div>
          </div>

        </div>

        {/* 3. BARBERS & STYLISTS SELECTION (KEPT AT THE LAST) */}
        <div className="flex flex-col gap-3 pt-2 mb-4 border-t border-gray-150/60 dark:border-zinc-850">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-orange-500" /> Barbers & Stylists
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
                      ? 'border-orange-500 shadow-lg scale-105 ring-2 ring-orange-500/20' 
                      : 'border-transparent group-hover:border-gray-300 dark:group-hover:border-zinc-700'
                  }`}>
                    <img
                      src={barber.photo}
                      alt={barber.name}
                      className="h-full w-full object-cover"
                    />

                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-md">
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

      {/* 3. FIXED BOTTOM SUMMARY & CONFIRM BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-t border-gray-100 dark:border-zinc-800 shadow-2xl">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider truncate">
              {selectedBarber ? `Stylist: ${selectedBarber.name}` : 'Stylist: Auto'} • {selectedChair ? `Chair ${selectedChair.split('_')[1] || '1'}` : 'No Chair'}
            </span>
            <span className="text-xs font-extrabold text-orange-500 dark:text-orange-400 truncate mt-0.5">
              📅 {formatSelectedDateDisplay(selectedDateStr)} @ {selectedTimeStr}
            </span>
          </div>

          <Button
            variant="primary"
            disabled={!canProceed}
            onClick={handleProceed}
            className="w-48 sm:w-64 h-12 text-sm font-extrabold rounded-2xl cursor-pointer bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25 border-none"
          >
            <span>Confirm & Book</span>
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </div>
      </div>

    </div>
  );
};
