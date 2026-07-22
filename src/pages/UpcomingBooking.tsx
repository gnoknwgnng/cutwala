import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Scissors, Navigation2, XCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Button, Badge } from '../components/UI';

export const UpcomingBooking: React.FC = () => {
  const navigate = useNavigate();
  const { bookings, cancelBooking, shops, barbers } = useStore();

  // Filter out active upcoming bookings
  const activeBookings = bookings.filter(b => b.status === 'upcoming');

  const handleCancel = (bookingId: string) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      cancelBooking(bookingId);
    }
  };

  const handleOpenNavigation = (lat: number, lng: number) => {
    // Open real Google Maps directions in a new tab
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-zinc-950 p-4 md:p-6 overflow-y-auto no-scrollbar select-none animate-fade-in">
      
      {/* Page Title */}
      <div className="max-w-2xl mx-auto w-full mb-6">
        <h1 className="font-display font-extrabold text-2xl md:text-3xl text-gray-900 dark:text-white">
          Active Bookings
        </h1>
        <p className="text-gray-500 dark:text-zinc-450 text-xs mt-1">
          Track and manage your upcoming grooming appointments
        </p>
      </div>

      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col gap-6">
        {activeBookings.length === 0 ? (
          /* Empty State */
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-zinc-900 border border-gray-150/40 dark:border-zinc-800/80 rounded-3xl shadow-sm min-h-[350px]"
          >
            <div className="h-16 w-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-6">
              <Calendar className="h-8 w-8 text-amber-500" />
            </div>
            <h3 className="font-display font-extrabold text-xl text-gray-900 dark:text-white">
              No Active Appointments
            </h3>
            <p className="text-gray-500 dark:text-zinc-400 mt-2 text-sm max-w-sm leading-relaxed">
              You don't have any bookings scheduled right now. Check out shops on the map to reserve your spot!
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/app/home')}
              className="mt-6 px-8 cursor-pointer"
            >
              Explore Barber Shops
            </Button>
          </motion.div>
        ) : (
          /* Bookings List */
          activeBookings.map((booking) => {
            const shop = shops.find(s => s.shop_id === booking.shop_id) || shops[0];
            const barber = barbers.find(b => b.barber_id === booking.barber_id) || barbers[0];

            return (
              <motion.div
                key={booking.booking_id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-150/40 dark:border-zinc-800/80 shadow-md p-5 flex flex-col gap-5"
              >
                {/* Header status bar */}
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-850 pb-3">
                  <div className="flex items-center gap-2">
                    <Badge status="upcoming" />
                  </div>
                  <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                    ID: {booking.booking_id.toUpperCase()}
                  </span>
                </div>

                {/* Progress Tracker (Uber Style) */}
                <div className="px-2">
                  <div className="flex justify-between text-[10px] font-bold text-gray-400 dark:text-zinc-550 uppercase tracking-wider mb-3">
                    <span className="text-amber-500">Scheduled</span>
                    <span>Arrived</span>
                    <span>In Service</span>
                    <span>Done</span>
                  </div>

                  {/* Progress Line */}
                  <div className="h-1 bg-gray-100 dark:bg-zinc-800 rounded-full relative">
                    <div className="absolute top-0 bottom-0 left-0 w-1/4 rounded-full bg-amber-500" />
                    
                    {/* Dots */}
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-zinc-900 bg-amber-500" />
                    <div className="absolute top-1/2 left-1/3 -translate-y-1/2 h-3 w-3 rounded-full border-2 border-white dark:border-zinc-900 bg-gray-255 dark:bg-zinc-700" />
                    <div className="absolute top-1/2 left-2/3 -translate-y-1/2 h-3 w-3 rounded-full border-2 border-white dark:border-zinc-900 bg-gray-255 dark:bg-zinc-700" />
                    <div className="absolute top-1/2 left-[100%] -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full border-2 border-white dark:border-zinc-900 bg-gray-255 dark:bg-zinc-700" />
                  </div>
                </div>

                {/* OTP Highlight Panel */}
                <div className="flex items-center justify-between bg-amber-500/5 dark:bg-amber-500/[0.02] border border-amber-500/20 rounded-2xl p-3.5">
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Share with stylist</p>
                    <p className="text-xs font-semibold text-gray-700 dark:text-zinc-350 mt-0.5">Show this OTP at check-in</p>
                  </div>
                  <h3 className="text-2xl font-extrabold tracking-widest text-amber-500 font-display">
                    {booking.otp}
                  </h3>
                </div>

                {/* Detail elements */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 dark:border-zinc-850 pt-4.5">
                  {/* Shop Details */}
                  <div className="flex gap-3">
                    <img 
                      src={shop.image} 
                      alt={shop.name} 
                      className="h-14 w-14 rounded-xl object-cover border border-gray-250/20"
                    />
                    <div className="min-w-0">
                      <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Barbershop</p>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">{shop.name}</h4>
                      <p className="text-[10px] text-gray-500 dark:text-zinc-450 truncate mt-0.5">{shop.address}</p>
                    </div>
                  </div>

                  {/* Stylist & Date details */}
                  <div className="flex flex-col gap-2.5 justify-center">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-zinc-350">
                      <Clock className="h-4 w-4 text-amber-500 shrink-0" />
                      <span>{booking.time} • {booking.date}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-zinc-350">
                      <Scissors className="h-4 w-4 text-amber-500 shrink-0" />
                      <span>{barber.name} • {booking.service}</span>
                    </div>
                  </div>
                </div>

                {/* Navigation and Cancellation Buttons */}
                <div className="mt-2.5 flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="primary"
                    onClick={() => handleOpenNavigation(shop.latitude, shop.longitude)}
                    fullWidth
                    className="h-11.5 cursor-pointer"
                  >
                    <Navigation2 className="mr-2 h-4.5 w-4.5 fill-black" /> Get Directions (Google Maps)
                  </Button>

                  <Button
                    variant="danger"
                    onClick={() => handleCancel(booking.booking_id)}
                    fullWidth
                    className="h-11.5 cursor-pointer"
                  >
                    <XCircle className="mr-2 h-4.5 w-4.5" /> Cancel Appointment
                  </Button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

    </div>
  );
};
