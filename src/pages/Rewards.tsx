import React, { useState } from 'react';
import { 
  Gift, 
  Users, 
  HelpCircle, 
  CheckCircle, 
  Award, 
  Share2, 
  Copy, 
  Calendar, 
  Sparkles, 
  Plus
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { Button, DrawerModal } from '../components/UI';

export const Rewards: React.FC = () => {
  const { 
    stampsCount, 
    referralPoints, 
    addStamp, 
    claimFreeHaircut, 
    addReferralPoints, 
    showToast 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'stamps' | 'referrals'>('stamps');
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState<boolean>(false);

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

  return (
    <div className="flex-1 flex flex-col bg-amber-50/30 dark:bg-[#0b0b0c] pb-24 relative overflow-y-auto no-scrollbar select-none">
      
      {/* 1. TOP HEADER */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between px-4 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-orange-500" />
          <h1 className="font-display font-extrabold text-base md:text-lg text-gray-900 dark:text-white">
            Rewards & Benefits
          </h1>
        </div>

        <button
          onClick={() => setIsHowItWorksOpen(true)}
          className="flex items-center gap-1 text-xs font-bold text-orange-500 hover:underline cursor-pointer"
        >
          <HelpCircle className="h-4 w-4" />
          <span>How it works?</span>
        </button>
      </header>

      {/* 2. MAIN CONTAINER */}
      <div className="max-w-2xl mx-auto w-full px-4 pt-4 flex flex-col gap-5">
        
        {/* SEGMENTED TAB TOGGLE (MATCHING IMAGE 1: Loyalty Stamps vs Referral Points) */}
        <div className="relative flex items-center p-1 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200/80 dark:border-zinc-800 shadow-sm">
          <button
            onClick={() => setActiveTab('stamps')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'stamps'
                ? 'bg-orange-500 text-white shadow-md'
                : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <span>💺 Loyalty Stamps</span>
          </button>

          <button
            onClick={() => setActiveTab('referrals')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'referrals'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Referral Points</span>
          </button>
        </div>

        {/* TAB 1: LOYALTY STAMPS CONTENT */}
        {activeTab === 'stamps' && (
          <div className="flex flex-col gap-4 animate-fade-in">
            
            {/* DIGITAL LOYALTY STAMP CARD HEADER */}
            <div className="p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-orange-500/20 shadow-md flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 border border-orange-500/20">
                    <Gift className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-sm text-gray-900 dark:text-white">
                      Digital Loyalty Stamp Card
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-zinc-400 font-medium mt-0.5">
                      Book at CutWala 10 times and get your <span className="font-bold text-orange-500">11th haircut FREE!</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsHowItWorksOpen(true)}
                  className="px-2.5 py-1 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-extrabold flex items-center gap-1 border border-orange-500/20 shrink-0"
                >
                  <span>How it works?</span>
                  <HelpCircle className="h-3 w-3" />
                </button>
              </div>

              {/* 10 STAMPS GRID (MATCHING IMAGE 3 EXACTLY) */}
              <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-zinc-950 border border-orange-200/60 dark:border-zinc-800">
                <div className="grid grid-cols-5 gap-3 sm:gap-4 justify-items-center">
                  {Array.from({ length: 10 }).map((_, idx) => {
                    const stampNum = idx + 1;
                    const isCollected = stampNum <= stampsCount;

                    return (
                      <div key={stampNum} className="flex flex-col items-center gap-1">
                        <motion.div
                          initial={false}
                          animate={isCollected ? { scale: [1, 1.2, 1] } : {}}
                          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                          className={`relative h-12 w-12 sm:h-14 sm:w-14 rounded-full flex items-center justify-center transition-all ${
                            isCollected
                              ? 'border-2 border-emerald-500 bg-white dark:bg-zinc-900 shadow-md ring-2 ring-emerald-500/20'
                              : 'border-2 border-dashed border-gray-300 dark:border-zinc-750 bg-gray-50 dark:bg-zinc-900/50'
                          }`}
                        >
                          {/* Barber Chair Icon */}
                          <span className={`text-xl sm:text-2xl ${isCollected ? 'text-orange-500' : 'text-gray-300 dark:text-zinc-700 opacity-60'}`}>
                            💺
                          </span>

                          {/* Green Checkmark Badge for collected stamps */}
                          {isCollected && (
                            <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                              <CheckCircle className="h-3.5 w-3.5 stroke-[3]" />
                            </div>
                          )}
                        </motion.div>

                        <span className={`text-[11px] font-extrabold ${isCollected ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-zinc-600'}`}>
                          {stampNum}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CONGRATULATIONS BANNER (WHEN 10 STAMPS COLLECTED, MATCHING IMAGE 1) */}
              {stampsCount >= 10 ? (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col gap-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                        <Gift className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-display font-extrabold text-sm text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                          Congratulations! 🎉
                        </h4>
                        <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">
                          You've collected all 10 stamps. <br />
                          <span className="font-black text-emerald-900 dark:text-emerald-200">Your 11th Haircut is FREE!</span>
                        </p>
                      </div>
                    </div>

                    {/* Badge */}
                    <div className="h-16 w-16 rounded-full bg-emerald-600 text-white text-[9px] font-black uppercase text-center flex flex-col items-center justify-center shrink-0 shadow-lg leading-tight p-1 border-2 border-white">
                      <span>11th</span>
                      <span>HAIRCUT</span>
                      <span>FREE</span>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    onClick={claimFreeHaircut}
                    className="w-full h-11 text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl cursor-pointer shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Claim FREE Haircut →</span>
                  </Button>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 text-center font-bold">
                    Valid for 30 days from today
                  </p>
                </div>
              ) : (
                /* IN PROGRESS PROGRESS BANNER */
                <div className="p-3.5 rounded-2xl bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/20 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-gray-900 dark:text-white flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-orange-500" />
                      {10 - stampsCount} haircuts away from FREE Haircut!
                    </span>
                    <span className="text-xs font-black text-orange-500">
                      {stampsCount} / 10
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2.5 rounded-full bg-gray-200 dark:bg-zinc-800 overflow-hidden p-0.5">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-orange-500 to-emerald-500 shadow-sm"
                      initial={{ width: 0 }}
                      animate={{ width: `${(stampsCount / 10) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              )}

              {/* STATS SUMMARY ROW (MATCHING IMAGE 1) */}
              <div className="grid grid-cols-3 gap-2.5 pt-1">
                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-zinc-950 border border-gray-200/60 dark:border-zinc-800 flex flex-col gap-1 items-start">
                  <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">
                    <Award className="h-4 w-4" />
                    <span>{stampsCount} / 10</span>
                  </div>
                  <span className="text-[10px] text-gray-500 dark:text-zinc-400 font-bold">Stamps Collected</span>
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${stampsCount >= 10 ? 'bg-emerald-500 text-white' : 'bg-orange-500/10 text-orange-500'}`}>
                    {stampsCount >= 10 ? 'Completed ✓' : 'In Progress'}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-zinc-950 border border-gray-200/60 dark:border-zinc-800 flex flex-col gap-1 items-start">
                  <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Reward Status</span>
                  </div>
                  <span className="text-[10px] text-gray-500 dark:text-zinc-400 font-medium">Use free haircut at any CutWala salon.</span>
                </div>

                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-zinc-950 border border-gray-200/60 dark:border-zinc-800 flex flex-col gap-1 items-start">
                  <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Valid Till</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">24 Jun 2026</span>
                  <span className="text-[9px] text-gray-400 dark:text-zinc-500 font-bold">(30 days left)</span>
                </div>
              </div>

              {/* DEMO TEST STAMP BUTTON FOR USER */}
              <div className="pt-2 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
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

          </div>
        )}

        {/* TAB 2: REFERRAL POINTS CONTENT (MATCHING IMAGE 2 EXACTLY) */}
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
                  className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold flex items-center gap-1 border border-emerald-500/20 shrink-0"
                >
                  <span>How it works?</span>
                  <HelpCircle className="h-3 w-3" />
                </button>
              </div>

              {/* POINTS & INVITE CONTAINER (MATCHING IMAGE 2) */}
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

              {/* SIMULATE REFERRAL INVITATION */}
              <div className="pt-2 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                  Test Referral Rewards:
                </span>
                <button
                  onClick={() => addReferralPoints(100)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-extrabold cursor-pointer hover:bg-emerald-700 transition-all flex items-center gap-1 shadow-md active:scale-95"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Simulate +100 Pts</span>
                </button>
              </div>

            </div>

          </div>
        )}

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

    </div>
  );
};
