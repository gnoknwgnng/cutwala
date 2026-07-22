import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

export const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (user) {
        navigate('/app/home');
      } else {
        navigate('/login');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [user, navigate]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#0c0d10] text-white overflow-hidden">
      {/* Brand logo container with spring animations */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15, stiffness: 120, duration: 1 }}
        className="relative flex h-32 w-32 items-center justify-center rounded-3xl bg-zinc-900/80 p-4 border border-orange-500/30 shadow-2xl shadow-orange-500/20 backdrop-blur-xl"
      >
        <img 
          src="/cutwalalogo.jpeg" 
          alt="CutWala Logo" 
          className="h-full w-full object-contain filter drop-shadow-[0_10px_20px_rgba(255,96,0,0.4)] rounded-2xl"
        />
        
        {/* Decorative glowing background rings */}
        <div className="absolute -inset-4 rounded-[2.5rem] border border-orange-500/30 animate-pulse pointer-events-none" />
      </motion.div>

      {/* Brand Name */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="mt-6 font-display text-4xl font-extrabold tracking-tight bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent"
      >
        CutWala
      </motion.h1>

      {/* Premium subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="mt-2 text-xs font-bold uppercase tracking-[0.3em] text-orange-400/90"
      >
        Barber & Chair Discovery
      </motion.p>

      {/* Modern Loader animation */}
      <div className="mt-14 w-48 h-1 rounded-full bg-zinc-850 overflow-hidden relative">
        <motion.div
          initial={{ left: '-100%', width: '40%' }}
          animate={{ left: '100%', width: '60%' }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="absolute h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg shadow-orange-500/50"
        />
      </div>
    </div>
  );
};
