import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Clock, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Button } from '../components/UI';

export const SelectTime: React.FC = () => {
  const navigate = useNavigate();
  const { currentBookingFlow, setBookingTime } = useStore();
  const [selectedTime, setSelectedTime] = useState<string>(currentBookingFlow.time || '');

  const timeSlots = [
    { time: '10:00 AM', isBooked: false },
    { time: '10:30 AM', isBooked: false },
    { time: '11:00 AM', isBooked: true },
    { time: '11:30 AM', isBooked: false },
    { time: '12:00 PM', isBooked: false },
  ];

  const handleSelectTime = (timeStr: string, isBooked: boolean) => {
    if (isBooked) return;
    setSelectedTime(timeStr);
    setBookingTime(timeStr);
  };

  const handleProceed = () => {
    if (selectedTime) {
      navigate('/app/summary');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-zinc-950 pb-24 relative select-none animate-fade-in">
      
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
            Select Appointment Time
          </span>
        </div>
      </header>

      {/* Main content grid */}
      <div className="max-w-md mx-auto w-full px-4 mt-8 flex-1 flex flex-col justify-between">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2.5 px-1">
            <Clock className="h-5 w-5 text-amber-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-550">
              Pick an available slot
            </h3>
          </div>

          {/* Time Slots Grid */}
          <div className="grid grid-cols-3 gap-3">
            {timeSlots.map((slot) => {
              const isSelected = selectedTime === slot.time;
              return (
                <motion.button
                  key={slot.time}
                  whileTap={{ scale: slot.isBooked ? 1 : 0.96 }}
                  onClick={() => handleSelectTime(slot.time, slot.isBooked)}
                  disabled={slot.isBooked}
                  className={`py-3 px-2.5 rounded-2xl border text-xs font-bold transition-all text-center select-none cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 border-amber-400 text-black shadow-lg shadow-amber-500/20'
                      : slot.isBooked
                      ? 'bg-gray-150 border-gray-200 text-gray-300 dark:bg-zinc-850 dark:border-zinc-800 dark:text-zinc-700 pointer-events-none line-through'
                      : 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-800 dark:text-zinc-300 hover:bg-gray-50/50 dark:hover:bg-zinc-850/40'
                  }`}
                >
                  {slot.time}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Proceed button */}
        <div className="mt-12 w-full">
          <Button
            variant="primary"
            disabled={!selectedTime}
            onClick={handleProceed}
            fullWidth
            className="cursor-pointer"
          >
            Review Summary <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

    </div>
  );
};
