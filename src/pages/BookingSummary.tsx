import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Scissors, Calendar, Clock, MapPin, Armchair, Receipt, ShieldCheck } from 'lucide-react';
import { useStore } from '../store/useStore';
import { mockServices } from '../mock/mockData';
import { Button, GlassCard } from '../components/UI';

export const BookingSummary: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentBookingFlow, 
    shops, 
    barbers, 
    confirmBooking,
    resetBookingFlow 
  } = useStore();

  const [isBooking, setIsBooking] = useState<boolean>(false);

  // Retrieve flow selections
  const shop = shops.find(s => s.shop_id === currentBookingFlow.shopId) || shops[0];
  const barber = barbers.find(b => b.barber_id === currentBookingFlow.barberId) || barbers[0];
  const service = mockServices.find(s => s.service_id === currentBookingFlow.serviceId) || mockServices[0];
  const dateStr = currentBookingFlow.date;
  const timeStr = currentBookingFlow.time;
  const chairId = currentBookingFlow.chairId;

  // Pricing calculations
  const basePrice = service.price;
  const serviceTax = parseFloat((basePrice * 0.08).toFixed(2));
  const totalFee = basePrice + serviceTax;

  const handleConfirm = () => {
    setIsBooking(true);
    // Simulate API delay
    setTimeout(() => {
      const newBookingObj = confirmBooking();
      setIsBooking(false);
      resetBookingFlow();
      navigate('/app/success', { state: { booking: newBookingObj } });
    }, 1500);
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
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
            Booking Summary
          </span>
        </div>
      </header>

      {/* Booking Receipts panel */}
      <div className="max-w-md mx-auto w-full px-4 mt-6 flex-1 flex flex-col justify-between">
        <div className="flex flex-col gap-5">
          
          {/* Shop Card brief */}
          <GlassCard className="flex gap-4">
            <img 
              src={shop.image} 
              alt={shop.name} 
              className="h-16 w-16 rounded-xl object-cover border border-gray-250/20"
            />
            <div className="min-w-0 flex flex-col justify-center">
              <h3 className="font-display font-bold text-base text-gray-900 dark:text-white truncate">
                {shop.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-zinc-450 truncate flex items-center gap-1 mt-0.5">
                <MapPin className="h-3.5 w-3.5 text-amber-500 shrink-0" /> {shop.address}
              </p>
            </div>
          </GlassCard>

          {/* Details breakdown */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-gray-150/40 dark:border-zinc-800/80 shadow-sm flex flex-col gap-4">
            
            {/* Barber Info */}
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-850 pb-3">
              <div className="flex items-center gap-3">
                <img 
                  src={barber.photo} 
                  alt={barber.name} 
                  className="h-10 w-10 rounded-full object-cover border border-gray-250/20"
                />
                <div>
                  <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Stylist</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{barber.name}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-0.5 justify-end">
                  <Armchair className="h-3 w-3 text-amber-500" /> Chair
                </p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  Chair {chairId ? chairId.split('_')[1] || '1' : '1'}
                </p>
              </div>
            </div>

            {/* Date & Time slots */}
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-850 pb-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-amber-500">
                  <Calendar className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Appointment Date</p>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">{formatDateDisplay(dateStr)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-amber-500">
                  <Clock className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Arrival Time</p>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">{timeStr}</p>
                </div>
              </div>
            </div>

            {/* Service brief */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-amber-500">
                  <Scissors className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Selected Service</p>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">{service.name}</p>
                </div>
              </div>

              <span className="text-sm font-bold text-gray-900 dark:text-white">
                ${service.price}
              </span>
            </div>

          </div>

          {/* Pricing detail receipts */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-gray-150/40 dark:border-zinc-800/80 shadow-sm flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 flex items-center gap-1.5 mb-1">
              <Receipt className="h-4 w-4 text-amber-500" /> Price Details
            </h4>
            
            <div className="flex justify-between text-xs font-semibold text-gray-600 dark:text-zinc-400">
              <span>Service Charge</span>
              <span>${basePrice.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between text-xs font-semibold text-gray-600 dark:text-zinc-400">
              <span>GST & Platform Taxes (8%)</span>
              <span>${serviceTax.toFixed(2)}</span>
            </div>

            <div className="border-t border-gray-100 dark:border-zinc-850 pt-2.5 mt-1 flex justify-between text-sm font-bold text-gray-900 dark:text-white">
              <span>Grand Total</span>
              <span className="text-base text-amber-500 font-extrabold">${totalFee.toFixed(2)}</span>
            </div>
          </div>

          {/* Trust statement */}
          <div className="flex items-center gap-2 justify-center text-[10px] text-gray-400 dark:text-zinc-550 font-semibold uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4 text-amber-500" /> Secure checkout. Pay at salon directly.
          </div>
        </div>

        {/* Action Book button */}
        <div className="mt-8 w-full">
          <Button
            variant="primary"
            disabled={isBooking}
            onClick={handleConfirm}
            fullWidth
            className="h-13 cursor-pointer"
          >
            {isBooking ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-black" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing Booking...
              </span>
            ) : (
              "Confirm & Book Appointment"
            )}
          </Button>
        </div>
      </div>

    </div>
  );
};
