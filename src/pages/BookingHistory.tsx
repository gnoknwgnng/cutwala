import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Eye, RefreshCw, Scissors, MapPin, Calendar } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Booking } from '../mock/mockData';
import { Button, DrawerModal, Badge } from '../components/UI';

export const BookingHistory: React.FC = () => {
  const navigate = useNavigate();
  const { bookings, shops, barbers, setBookingShop, setBookingBarber, setBookingService } = useStore();
  
  const [selectedDetails, setSelectedDetails] = useState<Booking | null>(null);

  // Past bookings (completed or cancelled)
  const pastBookings = bookings.filter(b => b.status !== 'upcoming');

  const handleBookAgain = (booking: Booking) => {
    // Prime the Zustand booking flow
    setBookingShop(booking.shop_id);
    setBookingBarber(booking.barber_id);
    
    // Find service metadata if available
    setBookingService('s1', booking.service, booking.price);
    
    // Navigate directly to Shop details to start booking
    navigate(`/app/shop/${booking.shop_id}`);
  };

  const getShopName = (shopId: string) => {
    const shop = shops.find(s => s.shop_id === shopId);
    return shop ? shop.name : 'Premium Barbershop';
  };

  const getBarberName = (barberId: string) => {
    const b = barbers.find(barb => barb.barber_id === barberId);
    return b ? b.name : 'Expert Stylist';
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-zinc-950 p-4 md:p-6 overflow-y-auto no-scrollbar select-none animate-fade-in">
      
      {/* Page Header */}
      <div className="max-w-2xl mx-auto w-full mb-6">
        <h1 className="font-display font-extrabold text-2xl md:text-3xl text-gray-900 dark:text-white">
          Booking History
        </h1>
        <p className="text-gray-500 dark:text-zinc-450 text-xs mt-1">
          Review details of your past visits and book them again
        </p>
      </div>

      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col gap-4">
        {pastBookings.length === 0 ? (
          /* Empty History State */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-zinc-900 border border-gray-150/40 dark:border-zinc-800/80 rounded-3xl shadow-sm min-h-[350px]">
            <div className="h-16 w-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-6">
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
            <h3 className="font-display font-extrabold text-xl text-gray-900 dark:text-white">
              No Booking History
            </h3>
            <p className="text-gray-500 dark:text-zinc-400 mt-2 text-sm max-w-sm leading-relaxed">
              You haven't visited any barbershops yet. Start your grooming journey by placing your first booking!
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/app/home')}
              className="mt-6 px-8 cursor-pointer"
            >
              Book Your First Cut
            </Button>
          </div>
        ) : (
          /* History Cards */
          pastBookings.map((booking) => {
            return (
              <motion.div
                key={booking.booking_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-150/40 dark:border-zinc-800/80 shadow-sm p-4 flex flex-col gap-3.5 hover:border-amber-500/10 transition-colors"
              >
                {/* Header tag */}
                <div className="flex items-center justify-between">
                  <Badge status={booking.status} />
                  <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                    {booking.date}
                  </span>
                </div>

                {/* Details layout */}
                <div className="flex justify-between items-start gap-4">
                  <div className="min-w-0">
                    <h4 className="font-display font-extrabold text-base text-gray-900 dark:text-white truncate">
                      {getShopName(booking.shop_id)}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-zinc-450 mt-1 truncate">
                      Stylist: <span className="font-semibold text-gray-700 dark:text-zinc-350">{getBarberName(booking.barber_id)}</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-zinc-450 truncate">
                      Service: <span className="font-semibold text-gray-750 dark:text-zinc-300">{booking.service}</span>
                    </p>
                  </div>
                </div>

                {/* Action buttons footer */}
                <div className="flex items-center gap-3 border-t border-gray-100 dark:border-zinc-850 pt-3 mt-1.5">
                  <button
                    onClick={() => setSelectedDetails(booking)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-gray-50 dark:bg-zinc-850 text-gray-600 dark:text-zinc-400 font-bold text-xs rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5" /> Details
                  </button>

                  <button
                    onClick={() => handleBookAgain(booking)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-500/10 text-amber-500 font-bold text-xs rounded-xl hover:bg-amber-500/15 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Book Again
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* 4. Booking Details Overlay Modal */}
      <DrawerModal
        isOpen={selectedDetails !== null}
        onClose={() => setSelectedDetails(null)}
        title="Appointment Details"
      >
        {selectedDetails && (
          <div className="flex flex-col gap-4 text-sm mt-2">
            
            {/* Status overview */}
            <div className="flex justify-between items-center py-2 bg-gray-50 dark:bg-zinc-900 rounded-2xl px-4 border border-gray-250/20">
              <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400">Booking Status</span>
              <Badge status={selectedDetails.status} />
            </div>

            <div className="flex flex-col gap-3 p-4 bg-gray-50 dark:bg-zinc-900/50 rounded-3xl border border-gray-250/20">
              {/* Shop info */}
              <div className="flex items-start gap-3">
                <MapPin className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Barbershop</p>
                  <p className="font-bold text-gray-900 dark:text-white">{getShopName(selectedDetails.shop_id)}</p>
                </div>
              </div>

              {/* Date / Time */}
              <div className="flex items-start gap-3">
                <Calendar className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Date & Time</p>
                  <p className="font-bold text-gray-900 dark:text-white">{selectedDetails.time} • {selectedDetails.date}</p>
                </div>
              </div>

              {/* Stylist */}
              <div className="flex items-start gap-3">
                <Scissors className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Stylist & Service</p>
                  <p className="font-bold text-gray-900 dark:text-white">
                    {getBarberName(selectedDetails.barber_id)} • <span className="text-amber-500">{selectedDetails.service}</span>
                  </p>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              onClick={() => {
                if (selectedDetails) {
                  handleBookAgain(selectedDetails);
                  setSelectedDetails(null);
                }
              }}
              fullWidth
              className="mt-4 cursor-pointer"
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Book This Stylist Again
            </Button>
          </div>
        )}
      </DrawerModal>

    </div>
  );
};
