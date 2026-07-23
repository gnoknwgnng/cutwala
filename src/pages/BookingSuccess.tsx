import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Calendar, MapPin, Scissors, Home } from 'lucide-react';
import type { Booking } from '../mock/mockData';
import { useStore } from '../store/useStore';
import { Button } from '../components/UI';

export const BookingSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { shops, barbers } = useStore();

  // Retrieve new booking passed from state
  const stateData = location.state as { booking?: Booking } | null;
  const booking = stateData?.booking;

  // Safeguard redirect if no booking details exist in state
  useEffect(() => {
    if (!booking) {
      navigate('/app/home');
    }
  }, [booking, navigate]);

  if (!booking) return null;

  const shop = shops.find(s => s.shop_id === booking.shop_id) || shops[0];
  const barber = barbers.find(b => b.barber_id === booking.barber_id) || barbers[0];

  return (
    <div className="flex-1 flex flex-col bg-[#fafafa] dark:bg-zinc-950 pb-20 justify-center items-center p-4 select-none relative overflow-hidden">
      
      {/* 1. CONFETTI EMITTERS (CSS particles explosion) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(24)].map((_, i) => {
          const delay = Math.random() * 0.8;
          const left = Math.random() * 100;
          const scale = 0.5 + Math.random() * 0.8;
          const colors = ['bg-amber-400', 'bg-emerald-400', 'bg-blue-400', 'bg-pink-400', 'bg-violet-400'];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];

          return (
            <motion.div
              key={i}
              initial={{ y: -20, x: 0, opacity: 1, rotate: 0 }}
              animate={{ 
                y: '105vh', 
                x: (Math.random() - 0.5) * 200, 
                opacity: 0,
                rotate: 360 * (Math.random() > 0.5 ? 1 : -1)
              }}
              transition={{ duration: 2.5 + Math.random() * 2, ease: 'easeOut', delay }}
              style={{ left: `${left}%`, scale }}
              className={`absolute top-0 w-2.5 h-2.5 rounded-full ${randomColor}`}
            />
          );
        })}
      </div>

      <div className="max-w-md w-full flex flex-col items-center z-10 text-center mt-6">
        
        {/* Animated Green Success Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="h-20 w-20 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 flex items-center justify-center border-2 border-emerald-500 mb-6 relative"
        >
          <Check className="h-10 w-10 text-emerald-500 stroke-[3.5]" />
          
          <motion.div 
            animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 rounded-full border border-emerald-500"
          />
        </motion.div>

        {/* Title details */}
        <h1 className="font-display font-extrabold text-3xl text-gray-900 dark:text-white">
          Booking Confirmed!
        </h1>
        <p className="text-gray-500 dark:text-zinc-450 text-sm mt-1">
          Your grooming slot has been secured.
        </p>

        {/* OTP highlight card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full bg-white dark:bg-zinc-900 rounded-3xl border border-gray-150/40 dark:border-zinc-800/80 p-5 mt-6 shadow-md flex flex-col items-center gap-2.5"
        >
          <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
            Check-In OTP Code
          </span>
          <h2 className="text-4xl font-extrabold tracking-[0.25em] text-amber-500 font-display pl-3">
            {booking.otp}
          </h2>
          <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed font-semibold max-w-[260px]">
            Show this OTP to the barber when you arrive at the shop.
          </p>

          {/* QR Code vector illustration */}
          <div className="mt-4 p-3 bg-white dark:bg-zinc-950 border border-gray-250/20 rounded-2xl flex items-center justify-center">
            <svg className="h-32 w-32 text-gray-800 dark:text-gray-200" viewBox="0 0 100 100">
              {/* Stylized QR Code borders */}
              <rect x="5" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="6" />
              <rect x="12" y="12" width="11" height="11" fill="currentColor" />

              <rect x="70" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="6" />
              <rect x="77" y="12" width="11" height="11" fill="currentColor" />

              <rect x="5" y="70" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="6" />
              <rect x="12" y="77" width="11" height="11" fill="currentColor" />

              {/* QR Dots simulation */}
              <rect x="40" y="5" width="10" height="5" fill="currentColor" />
              <rect x="55" y="15" width="5" height="15" fill="currentColor" />
              <rect x="40" y="25" width="15" height="5" fill="currentColor" />

              <rect x="5" y="45" width="15" height="5" fill="currentColor" />
              <rect x="25" y="40" width="10" height="10" fill="currentColor" />
              <rect x="15" y="55" width="15" height="5" fill="currentColor" />

              <rect x="40" y="40" width="5" height="20" fill="currentColor" />
              <rect x="50" y="45" width="15" height="5" fill="currentColor" />
              <rect x="55" y="55" width="10" height="15" fill="currentColor" />
              <rect x="45" y="80" width="10" height="10" fill="currentColor" />

              <rect x="75" y="40" width="15" height="15" fill="currentColor" />
              <rect x="70" y="65" width="25" height="5" fill="currentColor" />
              <rect x="80" y="75" width="15" height="10" fill="currentColor" />
            </svg>
          </div>
        </motion.div>

        {/* Info panel grid */}
        <div className="w-full bg-white dark:bg-zinc-900 rounded-3xl border border-gray-150/40 dark:border-zinc-800/80 p-5 mt-4 shadow-sm flex flex-col gap-3.5 text-left">
          {/* Shop */}
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <MapPin className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Barbershop</p>
              <h4 className="text-xs font-bold text-gray-900 dark:text-white">{shop.name}</h4>
              <p className="text-[10px] text-gray-500 dark:text-zinc-450 mt-0.5 truncate max-w-[280px]">{shop.address}</p>
            </div>
          </div>

          {/* Date & Stylist */}
          <div className="grid grid-cols-2 gap-4 border-t border-gray-100 dark:border-zinc-850 pt-3">
            <div className="flex items-start gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Date & Time</p>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white">{booking.time}</h4>
                <p className="text-[10px] text-gray-500 dark:text-zinc-450 mt-0.5">{booking.date.split('-').reverse().join('/')}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                <Scissors className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Stylist</p>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white">{barber.name}</h4>
                <p className="text-[10px] text-gray-500 dark:text-zinc-450 mt-0.5">{booking.service}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="mt-8 w-full">
          <Button
            variant="primary"
            onClick={() => navigate('/app/home')}
            fullWidth
            className="h-12 cursor-pointer bg-orange-500 hover:bg-orange-600 text-white font-extrabold"
          >
            <Home className="mr-2 h-4.5 w-4.5" /> Back to Home
          </Button>
        </div>

      </div>

    </div>
  );
};
