import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MapPin, Compass, AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Button, GlassCard } from '../components/UI';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { 
    loginWithGoogle, 
    sendOTP, 
    verifyOTP, 
    otpSent, 
    user, 
    locationPermission, 
    setLocationPermission 
  } = useStore();

  const [phone, setPhone] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [phoneError, setPhoneError] = useState<string>('');
  const [otpError, setOtpError] = useState<string>('');

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setPhoneError('Please enter a valid phone number');
      return;
    }
    setPhoneError('');
    sendOTP(phone);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 4) {
      setOtpError('OTP must be a 4-digit code');
      return;
    }
    setOtpError('');
    const success = verifyOTP(otp);
    if (!success) {
      setOtpError('Incorrect code. Try "4827"');
    }
  };

  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  const handleGrantLocation = () => {
    setLocationPermission('granted');
    navigate('/app/home');
  };

  const handleDenyLocation = () => {
    setLocationPermission('denied');
  };

  return (
    <div className="relative min-h-screen w-screen bg-[#f3f4f6] dark:bg-zinc-950 flex flex-col items-center justify-center p-4 overflow-hidden select-none">
      
      {/* Decorative ambient background lights */}
      <div className="absolute top-[-20%] left-[-20%] h-[60%] w-[60%] rounded-full bg-amber-500/10 blur-[120px] dark:bg-amber-600/5 pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] h-[60%] w-[60%] rounded-full bg-amber-500/5 blur-[120px] dark:bg-amber-500/5 pointer-events-none" />

      {/* Main Login Panel */}
      <AnimatePresence mode="wait">
        {!user ? (
          <motion.div
            key="login-form"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ type: 'spring', damping: 20 }}
            className="w-full max-w-md z-10"
          >
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <img 
                src="/cutwalalogo.jpeg" 
                alt="CutWala Logo" 
                className="h-20 w-20 object-contain drop-shadow-xl mb-3 rounded-2xl"
              />
              <h2 className="font-display font-extrabold text-3xl tracking-tight text-gray-900 dark:text-white">
                Welcome to CutWala
              </h2>
              <p className="text-gray-500 dark:text-zinc-450 mt-1 text-sm text-center">
                Sign in to book premium grooming services near you
              </p>
            </div>

            <GlassCard className="relative overflow-hidden">
              {/* Option 1: Continue with Google */}
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 bg-white dark:bg-zinc-850 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-800 dark:text-gray-200 font-semibold py-3 px-4 rounded-2xl border border-gray-250/20 shadow-sm transition-all duration-200 active:scale-98 cursor-pointer"
              >
                {/* SVG Google Logo */}
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.579-7.859-7.989 0-4.41 3.529-7.989 7.859-7.989 2.47 0 4.12 1.023 5.059 1.926l3.245-3.117C18.29 1.838 15.539 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.985 0-.746-.08-1.32-.176-1.79H12.24z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Divider */}
              <div className="flex items-center my-6">
                <div className="flex-1 border-t border-gray-200 dark:border-zinc-800" />
                <span className="px-3 text-xs uppercase tracking-wider text-gray-400 dark:text-zinc-550 font-bold">
                  or
                </span>
                <div className="flex-1 border-t border-gray-200 dark:border-zinc-800" />
              </div>

              {/* Option 2: Phone Login Form */}
              <AnimatePresence mode="wait">
                {!otpSent ? (
                  <motion.form
                    key="phone-input"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={handleSendOTP}
                    className="flex flex-col gap-4"
                  >
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          placeholder="Enter 10-digit number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none text-gray-900 dark:text-white transition-all"
                        />
                      </div>
                      {phoneError && (
                        <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {phoneError}
                        </p>
                      )}
                    </div>

                    <Button variant="primary" type="submit" fullWidth>
                      Send OTP Code
                    </Button>
                  </motion.form>
                ) : (
                  <motion.form
                    key="otp-input"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleVerifyOTP}
                    className="flex flex-col gap-4"
                  >
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-2">
                        Verify OTP (Check Toast)
                      </label>
                      <input
                        type="text"
                        maxLength={4}
                        placeholder="Enter 4-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        className="w-full text-center tracking-[0.75em] text-lg font-bold py-3.5 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none text-gray-900 dark:text-white transition-all"
                      />
                      {otpError && (
                        <p className="mt-1 text-xs text-rose-500 flex items-center gap-1 justify-center">
                          <AlertCircle className="h-3 w-3" /> {otpError}
                        </p>
                      )}
                      <p className="mt-2 text-xs text-center text-gray-400">
                        Code sent to your phone. Use helper OTP: <span className="font-semibold text-amber-500">4827</span>
                      </p>
                    </div>

                    <Button variant="primary" type="submit" fullWidth>
                      Verify & Log In
                    </Button>

                    <button
                      type="button"
                      onClick={() => useStore.setState({ otpSent: false })}
                      className="text-xs text-center text-gray-500 hover:text-amber-500 transition-colors font-medium cursor-pointer"
                    >
                      Back to Edit Phone
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </GlassCard>
          </motion.div>
        ) : (
          /* Mandatory Location Permission Modal */
          <motion.div
            key="location-permission"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md z-20"
          >
            <GlassCard className="flex flex-col items-center text-center p-6 border-amber-500/20">
              <div className="h-16 w-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-6">
                <MapPin className="h-8 w-8 text-amber-500 animate-bounce" />
              </div>

              <h2 className="font-display font-extrabold text-2xl text-gray-900 dark:text-white">
                Location Access Required
              </h2>
              
              <p className="text-gray-500 dark:text-zinc-400 mt-3 text-sm leading-relaxed">
                To discover open barber shops nearby, view active chair status, and enable navigation tracking, CutWala requires location permission.
              </p>

              <div className="mt-8 flex flex-col gap-3.5 w-full">
                <Button variant="primary" onClick={handleGrantLocation} fullWidth>
                  <Compass className="mr-2 h-4 w-4" /> Grant Location Access
                </Button>

                {locationPermission === 'denied' && (
                  <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20 text-rose-500 text-xs font-semibold text-left flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>You rejected location permission. Please click "Grant" to access the application dashboard.</span>
                  </div>
                )}

                <button
                  onClick={handleDenyLocation}
                  className="text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-zinc-350 transition-colors py-1 cursor-pointer"
                >
                  No, thanks
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
