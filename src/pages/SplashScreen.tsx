import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scissors } from 'lucide-react';
import { useStore } from '../store/useStore';

export const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      // If user is already logged in, redirect to home. Otherwise, login.
      if (user) {
        navigate('/app/home');
      } else {
        navigate('/login');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [user, navigate]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-zinc-950 text-white overflow-hidden">
      {/* Brand logo container with spring animations */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 15, stiffness: 120, duration: 1 }}
        className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-amber-500 shadow-2xl shadow-amber-500/20"
      >
        <Scissors className="h-12 w-12 text-black" />
        
        {/* Decorative glowing background rings */}
        <div className="absolute -inset-4 rounded-[2.5rem] border border-amber-500/20 animate-pulse pointer-events-none" />
      </motion.div>

      {/* Brand Name */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="mt-6 font-display text-4xl font-extrabold tracking-tight bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent"
      >
        CutWala
      </motion.h1>

      {/* Premium subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="mt-2 text-sm uppercase tracking-[0.25em] text-gray-400 font-semibold"
      >
        Premium Grooming Discovery
      </motion.p>

      {/* Modern Loader animation */}
      <div className="mt-16 w-48 h-1 rounded-full bg-zinc-800 overflow-hidden relative">
        <motion.div
          initial={{ left: '-100%', width: '40%' }}
          animate={{ left: '100%', width: '60%' }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="absolute h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600"
        />
      </div>
    </div>
  );
};
