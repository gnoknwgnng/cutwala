import React, { useState } from 'react';
import { 
  Gift, 
  Users, 
  HelpCircle, 
  CheckCircle, 
  Award, 
  Share2, 
  Copy, 
  ChevronRight, 
  Plus
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { Button, DrawerModal } from '../components/UI';

export const Rewards: React.FC = () => {
  const { 
    stampsCount, 
    cycleNumber,
    referralPoints, 
    addStamp, 
    claimFreeHaircut,
    showToast 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'stamps' | 'referrals'>('stamps');
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Auto flip card when stamps reach 10
  React.useEffect(() => {
    if (stampsCount >= 10) {
      setIsFlipped(true);
    }
  }, [stampsCount]);

  const handleClaimReward = () => {
    claimFreeHaircut();
    setIsFlipped(false);
  };

  const referralCode = 'CUTWALA100';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    showToast('Referral code copied: CUTWALA100', 'success');
  };

  const handleShareInvite = () => {
    if (navigator.share) {
      navigator.share({
        title: 'CutWala Referral',
        text: `Use my code CUTWALA100 on CutWala and get 100 bonus points!`,
        url: window.location.origin,
      }).catch(() => {});
    } else {
      handleCopyCode();
    }
  };

  // Mock redeem options matching screenshot
  const redeemItems = [
    { id: 1, title: '₹50 OFF', points: 200, bg: 'bg-emerald-500', color: 'text-emerald-600', icon: '🏷️' },
    { id: 2, title: '₹100 OFF', points: 350, bg: 'bg-purple-600', color: 'text-purple-600', icon: '🎟️' },
    { id: 3, title: 'Beard Trim', points: 400, bg: 'bg-orange-500', color: 'text-orange-600', icon: '🧔' },
    { id: 4, title: 'Hair Wash', points: 150, bg: 'bg-sky-500', color: 'text-sky-600', icon: '🧴' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#faf8f5] dark:bg-[#0b0b0c] pb-24 relative overflow-y-auto no-scrollbar select-none">
      
      {/* 1. TOP HEADER (MATCHING SCREENSHOT) */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between px-4 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <h1 className="font-display font-extrabold text-base md:text-lg text-gray-900 dark:text-white">
            Rewards
          </h1>
        </div>

        <button
          onClick={() => setIsHowItWorksOpen(true)}
          className="flex items-center gap-1 text-xs font-bold text-orange-500 hover:underline cursor-pointer"
        >
          <span>How it works?</span>
          <HelpCircle className="h-4 w-4" />
        </button>
      </header>

      {/* 2. MAIN CONTAINER */}
      <div className="max-w-2xl mx-auto w-full px-4 pt-3 flex flex-col gap-4">
        
        {/* SEGMENTED TAB TOGGLE (MATCHING SCREENSHOT EXACTLY) */}
        <div className="relative flex items-center p-1 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200/80 dark:border-zinc-800 shadow-xs">
          <button
            onClick={() => setActiveTab('stamps')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'stamps'
                ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 shadow-xs'
                : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <span className="text-sm">💺</span>
            <span>Loyalty Stamps</span>
          </button>

          <button
            onClick={() => setActiveTab('referrals')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'referrals'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-xs'
                : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Referral Points</span>
          </button>
        </div>

        {/* TAB 1: LOYALTY STAMPS CONTENT */}
        {activeTab === 'stamps' && (
          <div className="flex flex-col gap-3.5 animate-fade-in">
            
            {/* 3D FLIPPABLE LOYALTY CARD CONTAINER */}
            <div className="w-full relative">
              <motion.div
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.8, type: 'spring', stiffness: 160, damping: 20 }}
                className="w-full relative"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* ---------------- CARD FRONT FACE ---------------- */}
                <div className={`rounded-3xl bg-[#f3ebe1] dark:bg-[#18181b] border-2 border-[#e2d6c6] dark:border-zinc-800 p-4 md:p-5 shadow-lg shadow-amber-900/5 flex flex-col gap-4 overflow-hidden ${
                  isFlipped ? 'hidden' : 'block'
                }`}>
                  
                  {/* Ticket Cutout Notch on Right Edge */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-[#faf8f5] dark:bg-[#0b0b0c] rounded-l-full border-l-2 border-y-2 border-[#e2d6c6] dark:border-zinc-800" />

                  {/* CARD TOP BRANDING BAR */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-serif italic font-extrabold text-xl text-[#3c2a21] dark:text-amber-100 tracking-tight leading-none">
                        CutWala
                      </h2>
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#8c7a6b] dark:text-zinc-400 block mt-0.5">
                        LOYALTY CARD
                      </span>
                    </div>

                    {/* Ribbon Tag: CYCLE 1 STARTED */}
                    <div className="px-3.5 py-1.5 rounded-bl-xl rounded-tr-xl bg-[#422b1d] text-[#f4eae0] text-[10px] font-extrabold tracking-wide uppercase shadow-sm flex items-center gap-1">
                      <span>CYCLE {cycleNumber}</span>
                      <span className="font-normal opacity-80">STARTED</span>
                    </div>
                  </div>

                  {/* 10 STAMPS GRID (2 ROWS OF 5) */}
                  <div className="grid grid-cols-5 gap-y-4 gap-x-2 py-2 justify-items-center">
                    {Array.from({ length: 10 }).map((_, idx) => {
                      const stampNum = idx + 1;
                      const isCollected = stampNum <= stampsCount;

                      return (
                        <div key={stampNum} className="flex flex-col items-center gap-1">
                          <motion.div
                            initial={false}
                            animate={isCollected ? { scale: [1, 1.15, 1] } : {}}
                            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                            className="relative"
                          >
                            {/* Stamp Circle Container (Pure White Inside) */}
                            <div className={`h-12 w-12 sm:h-14 sm:w-14 rounded-full flex items-center justify-center transition-all overflow-hidden p-0.5 bg-white dark:bg-zinc-900 ${
                              isCollected
                                ? 'border-2 border-emerald-600 shadow-md'
                                : 'border border-gray-300 dark:border-zinc-700 shadow-xs'
                            }`}>
                              <img
                                src={isCollected ? "/stamped.jpg" : "/unstamped.jpg"}
                                alt={isCollected ? "Stamped" : "Unstamped"}
                                className="h-full w-full object-contain rounded-full bg-white dark:bg-zinc-900"
                              />
                            </div>

                            {/* Green Checkmark Badge OUTSIDE on top-right */}
                            {isCollected && (
                              <div className="absolute -top-1 -right-1 h-4.5 w-4.5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md z-20 ring-2 ring-white dark:ring-zinc-900">
                                <CheckCircle className="h-3.5 w-3.5 stroke-[3]" />
                              </div>
                            )}
                          </motion.div>

                          {/* Stamp Number */}
                          <span className={`text-[11px] font-extrabold ${
                            isCollected ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-500 dark:text-zinc-500'
                          }`}>
                            {stampNum}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Dotted Divider Line */}
                  <div className="border-t border-dashed border-[#e2d6c3] dark:border-zinc-800 my-1" />

                  {/* BOTTOM STATS INSIDE CARD */}
                  <div className="grid grid-cols-2 gap-4 items-center">
                    
                    {/* Left Stat Box: Stamps Collected */}
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-500/20">
                        <Award className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="font-display font-extrabold text-base text-gray-900 dark:text-white leading-none">
                            {stampsCount}
                          </span>
                          <span className="text-xs font-bold text-gray-400 dark:text-zinc-500">
                            / 10
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-gray-600 dark:text-zinc-400 block">
                          Stamps Collected
                        </span>
                        <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                          {stampsCount >= 10 ? 'Reward Ready! 🎉' : 'Keep going!'}
                        </span>
                      </div>
                    </div>

                    {/* Right Stat Box: Next FREE Haircut */}
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-500/20">
                        <Gift className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-gray-500 dark:text-zinc-400 block">
                          Next FREE Haircut
                        </span>
                        <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 block leading-tight">
                          {stampsCount >= 10 ? '11th FREE Haircut!' : '11th Booking'}
                        </span>

                        {/* 10 Dots Progress Bar */}
                        <div className="flex items-center gap-1 mt-1.5">
                          {Array.from({ length: 10 }).map((_, i) => (
                            <div
                              key={i}
                              className={`h-2 w-2 rounded-full transition-all ${
                                i < stampsCount
                                  ? 'bg-emerald-600 scale-110'
                                  : 'bg-gray-300 dark:bg-zinc-700'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>

                </div>

                {/* ---------------- CARD BACK FACE (FLIPPED REWARD CELEBRATION VIEW FOR 11TH HAIRCUT) ---------------- */}
                <div className={`rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-900 border-2 border-emerald-400 p-5 shadow-2xl text-white flex flex-col gap-4 overflow-hidden ${
                  !isFlipped ? 'hidden' : 'block'
                }`}>
                  
                  {/* Ticket Cutout Notch on Right Edge */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-[#faf8f5] dark:bg-[#0b0b0c] rounded-l-full border-l-2 border-y-2 border-emerald-400" />

                  {/* CARD BACK HEADER */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-serif italic font-extrabold text-xl text-amber-300 tracking-tight leading-none">
                        CutWala
                      </h2>
                      <span className="text-[9px] font-black uppercase tracking-widest text-emerald-200 block mt-0.5">
                        FREE HAIRCUT VOUCHER
                      </span>
                    </div>

                    {/* Ribbon Tag: 11TH FREE HAIRCUT */}
                    <div className="px-3.5 py-1.5 rounded-bl-xl rounded-tr-xl bg-amber-400 text-gray-900 text-[10px] font-black tracking-wide uppercase shadow-md">
                      11th FREE HAIRCUT
                    </div>
                  </div>

                  {/* FLIPPED REWARD CONTENT */}
                  <div className="flex flex-col items-center text-center gap-3 py-4 my-1">
                    <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-md text-amber-300 flex items-center justify-center border-2 border-amber-300/40 shadow-lg text-3xl animate-bounce">
                      🎁
                    </div>

                    <div>
                      <h3 className="font-display font-extrabold text-xl text-white drop-shadow-md">
                        11th Haircut is 100% FREE! 🎉
                      </h3>
                      <p className="text-xs text-emerald-100 font-medium max-w-xs mx-auto mt-1 leading-relaxed">
                        Congratulations! You completed all 10 stamps in <span className="font-bold text-amber-300">CYCLE {cycleNumber}</span>. Claim your free 11th haircut now!
                      </p>
                    </div>

                    {/* CLAIM FREE HAIRCUT BUTTON */}
                    <Button
                      variant="primary"
                      onClick={handleClaimReward}
                      className="w-full max-w-xs h-12 text-xs font-black bg-amber-400 hover:bg-amber-300 text-gray-900 rounded-2xl cursor-pointer shadow-xl flex items-center justify-center gap-2 border-none active:scale-95 mt-1"
                    >
                      <span>Claim FREE 11th Haircut →</span>
                    </Button>
                    <span className="text-[10px] text-emerald-200 font-bold">
                      Claiming will unlock CYCLE {cycleNumber + 1}!
                    </span>
                  </div>

                </div>

              </motion.div>
            </div>

            {/* UNDERNEATH THE CARD (EXACT MATCH FOR USER'S HANDWRITTEN SKETCH) */}
            <div className="flex flex-col gap-2.5 px-1 pt-1">
              
              {/* Offer Text Underneath Card */}
              <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-center">
                <p className="text-xs font-black text-gray-900 dark:text-white">
                  Book at <span className="text-orange-600 dark:text-orange-400 font-extrabold">CutWala App</span> 10 times & Get Your <span className="text-orange-600 dark:text-orange-400 font-extrabold">11th Haircut FREE!</span>
                </p>
              </div>

              {/* Sub-info Line: Stamp terms on left, History on right */}
              <div className="flex items-center justify-between text-xs px-1">
                <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1">
                  ✦ Every Completed Booking = <span className="font-extrabold">1 Stamp</span>
                </span>

                <button
                  onClick={() => setIsHistoryOpen(true)}
                  className="text-[11px] font-extrabold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>History</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* How It Works Button Box at Bottom (Matching Sketch) */}
              <button
                onClick={() => setIsHowItWorksOpen(true)}
                className="w-full py-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-200 text-xs font-extrabold cursor-pointer hover:border-orange-500 transition-all flex items-center justify-center gap-1.5 shadow-xs"
              >
                <HelpCircle className="h-4 w-4 text-orange-500" />
                <span>How it works?</span>
              </button>

            </div>

            {/* DEMO STAMP ADDITION TEST BUTTON */}
            <div className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 flex items-center justify-between shadow-xs mt-1">
              <span className="text-[10px] font-extrabold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                Test Stamp Addition Animation:
              </span>
              <button
                onClick={addStamp}
                className="px-3 py-1.5 rounded-xl bg-orange-500 text-white text-xs font-extrabold cursor-pointer hover:bg-orange-600 transition-all flex items-center gap-1 shadow-md active:scale-95"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Stamp (+1)</span>
              </button>
            </div>

          </div>
        )}

        {/* TAB 2: REFERRAL POINTS CONTENT */}
        {activeTab === 'referrals' && (
          <div className="flex flex-col gap-4 animate-fade-in">
            
            {/* REFERRAL REWARDS CARD */}
            <div className="p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-emerald-500/20 shadow-md flex flex-col gap-4">
              
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-500/20">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-sm text-gray-900 dark:text-white">
                      Referral Rewards
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-zinc-400 font-medium mt-0.5">
                      Invite friends, earn points and redeem exciting rewards!
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsHowItWorksOpen(true)}
                  className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold flex items-center gap-1 border border-emerald-500/20 shrink-0 cursor-pointer"
                >
                  <span>How it works?</span>
                  <HelpCircle className="h-3 w-3" />
                </button>
              </div>

              {/* POINTS & INVITE CONTAINER (MATCHING SCREENSHOT) */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-zinc-950 border border-emerald-200/60 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                
                {/* Left: Referral Points Count */}
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full border-2 border-emerald-500 bg-white dark:bg-zinc-900 text-emerald-600 flex items-center justify-center shrink-0 shadow-md">
                    <Award className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <span className="font-display font-extrabold text-2xl text-emerald-600 dark:text-emerald-400 block leading-none">
                      {referralPoints}
                    </span>
                    <span className="text-xs font-bold text-gray-500 dark:text-zinc-400 block mt-1">
                      Referral Points
                    </span>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-gray-100 dark:bg-zinc-800 text-[10px] font-bold text-gray-600 dark:text-zinc-300 border border-gray-200 dark:border-zinc-700">
                      = ₹{(referralPoints / 100).toFixed(2)} Value
                    </span>
                  </div>
                </div>

                {/* Right: Invite Action */}
                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-xs font-extrabold text-gray-900 dark:text-white block">Invite 1 Friend</span>
                      <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">Get +100 Points</span>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    onClick={handleShareInvite}
                    className="w-full sm:w-auto px-5 h-10 text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl cursor-pointer shadow-md flex items-center justify-center gap-2"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    <span>Invite Friends</span>
                  </Button>
                </div>

              </div>

              {/* YOUR REFERRAL CODE CARD */}
              <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-zinc-950 border border-gray-200/60 dark:border-zinc-800 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider block">
                    Your Referral Code
                  </span>
                  <span className="font-mono font-black text-base text-gray-900 dark:text-white tracking-widest">
                    {referralCode}
                  </span>
                </div>

                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 rounded-xl bg-gray-200 dark:bg-zinc-800 hover:bg-orange-500 hover:text-white text-gray-700 dark:text-zinc-200 text-xs font-extrabold cursor-pointer transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Code</span>
                </button>
              </div>

            </div>

          </div>
        )}

        {/* 3. REDEEM POINTS CATALOG SECTION (MATCHING SCREENSHOT EXACTLY) */}
        <div className="flex flex-col gap-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-extrabold text-sm text-gray-900 dark:text-white">
              Redeem Points
            </h3>
            <button className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 hover:underline cursor-pointer">
              <span>View All</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* 4 REDEEM OFFER CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {redeemItems.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 flex flex-col items-center text-center gap-2 shadow-xs hover:border-emerald-500 transition-all cursor-pointer group"
              >
                <div className="text-2xl p-2 rounded-2xl bg-gray-50 dark:bg-zinc-950 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div>
                  <span className="text-xs font-extrabold text-gray-900 dark:text-white block">
                    {item.title}
                  </span>
                  <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                    {item.points} Points
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* HOW IT WORKS MODAL */}
      <DrawerModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        title="How Rewards Work"
      >
        <div className="flex flex-col gap-4 pt-2 text-xs">
          <div className="p-3.5 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex gap-3 items-start">
            <div className="h-8 w-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 font-bold">
              <span>1</span>
            </div>
            <div>
              <p className="font-extrabold text-gray-900 dark:text-white">Book & Complete Appointments</p>
              <p className="text-gray-500 dark:text-zinc-400 mt-0.5">Every completed haircut appointment automatically earns you 1 Loyalty Stamp.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex gap-3 items-start">
            <div className="h-8 w-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold">
              <span>2</span>
            </div>
            <div>
              <p className="font-extrabold text-gray-900 dark:text-white">Collect 10 Stamps = 11th Haircut FREE</p>
              <p className="text-gray-500 dark:text-zinc-400 mt-0.5">Once 10 stamps are collected, your 11th haircut voucher is unlocked 100% FREE!</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex gap-3 items-start">
            <div className="h-8 w-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold">
              <span>3</span>
            </div>
            <div>
              <p className="font-extrabold text-gray-900 dark:text-white">Refer Friends & Earn Points</p>
              <p className="text-gray-500 dark:text-zinc-400 mt-0.5">Share your referral code. Earn +100 points for every friend who joins CutWala!</p>
            </div>
          </div>
        </div>
      </DrawerModal>

      {/* STAMP HISTORY MODAL */}
      <DrawerModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        title="Stamp History"
      >
        <div className="flex flex-col gap-3 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-gray-900 dark:text-white block">Signature Haircut - CutWala Salon</span>
              <span className="text-[10px] text-gray-500">22 July 2026 • Completed</span>
            </div>
            <span className="font-extrabold text-emerald-600">+1 Stamp 💺</span>
          </div>

          <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-gray-900 dark:text-white block">Beard Styling - CutWala Studio</span>
              <span className="text-[10px] text-gray-500">15 July 2026 • Completed</span>
            </div>
            <span className="font-extrabold text-emerald-600">+1 Stamp 💺</span>
          </div>
        </div>
      </DrawerModal>

    </div>
  );
};
