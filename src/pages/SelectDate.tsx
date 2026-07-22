import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Calendar, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Button } from '../components/UI';

export const SelectDate: React.FC = () => {
  const navigate = useNavigate();
  const { currentBookingFlow, setBookingDate } = useStore();
  const [selectedDateStr, setSelectedDateStr] = useState<string>(currentBookingFlow.date || '');

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

  const handleSelectDate = (dateStr: string) => {
    setSelectedDateStr(dateStr);
    setBookingDate(dateStr);
  };

  const handleProceed = () => {
    if (selectedDateStr) {
      navigate('/app/time');
    }
  };

  const formatSelectedDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-zinc-950 pb-24 relative select-none">
      
      {/* Header bar */}
      <header className="flex h-16 items-center justify-between px-4 bg-white dark:bg-zinc-900 border-b border-gray-150/20 dark:border-zinc-800 sticky top-0 z-10 animate-fade-in">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="font-display font-extrabold text-lg text-gray-900 dark:text-white">
            Select Appointment Date
          </span>
        </div>
      </header>

      {/* Main calendar slider */}
      <div className="max-w-md mx-auto w-full px-4 mt-8 flex-1 flex flex-col justify-between">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2.5 px-1">
            <Calendar className="h-5 w-5 text-amber-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-550">
              When would you like to visit?
            </h3>
          </div>

          {/* Calendar List */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {datesList.map((item) => {
              const isSelected = selectedDateStr === item.fullDateStr;
              return (
                <motion.div
                  key={item.fullDateStr}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSelectDate(item.fullDateStr)}
                  className={`flex flex-col items-center justify-center p-4.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 border-amber-400 text-black shadow-lg shadow-amber-500/20'
                      : 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-800 dark:text-zinc-300 hover:bg-gray-50/50 dark:hover:bg-zinc-850/40'
                  }`}
                >
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-black/60' : 'text-gray-400 dark:text-zinc-500'}`}>
                    {item.monthName}
                  </span>
                  <span className="text-2xl font-extrabold font-display leading-tight my-1.5">
                    {item.dayNum}
                  </span>
                  <span className={`text-[10px] font-extrabold uppercase tracking-widest ${isSelected ? 'text-black' : 'text-gray-500 dark:text-zinc-400'}`}>
                    {item.dayName}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Selection Detail Panel */}
          {selectedDateStr && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-white dark:bg-zinc-900 border border-gray-150/40 dark:border-zinc-800/80 rounded-2xl shadow-sm text-center"
            >
              <p className="text-xs text-gray-500 dark:text-zinc-450 font-bold uppercase tracking-wider">
                Selected Date
              </p>
              <h4 className="text-base font-extrabold text-amber-500 dark:text-amber-400 mt-1">
                {formatSelectedDateDisplay(selectedDateStr)}
              </h4>
            </motion.div>
          )}
        </div>

        {/* Proceed button */}
        <div className="mt-12 w-full">
          <Button
            variant="primary"
            disabled={!selectedDateStr}
            onClick={handleProceed}
            fullWidth
            className="cursor-pointer"
          >
            Select Time Slot <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

    </div>
  );
};
