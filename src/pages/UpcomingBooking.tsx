import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Scissors, Navigation2, XCircle, RefreshCw, Eye, MapPin } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Button, Badge, DrawerModal } from '../components/UI';
import type { Booking } from '../mock/mockData';

export const UpcomingBooking: React.FC = () => {
  const navigate = useNavigate();
  const { bookings, cancelBooking, shops, barbers, setBookingShop, setBookingBarber, setBookingService } = useStore();

  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [selectedDetails, setSelectedDetails] = useState<Booking | null>(null);

  // Filter active vs history bookings
  const activeBookings = bookings.filter(b => b.status === 'upcoming');
  const pastBookings = bookings.filter(b => b.status !== 'upcoming');

  const handleCancel = (bookingId: string) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      cancelBooking(bookingId);
    }
  };

  const handleOpenNavigation = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
  };

  const handleBookAgain = (booking: Booking) => {
    setBookingShop(booking.shop_id);
    setBookingBarber(booking.barber_id);
    setBookingService('s1', booking.service, booking.price);
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
      
      {/* 1. TAB HEADER: Active Booking | History Booking (Matches User Screenshot) */}
      <div className="max-w-2xl mx-auto w-full mb-6">
        <div className="flex items-center justify-center border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl p-1.5 shadow-sm">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-3 text-center font-display font-extrabold text-sm md:text-base transition-all relative cursor-pointer ${
              activeTab === 'active'
                ? 'text-rose-600 dark:text-rose-500'
                : 'text-gray-500 dark:text-zinc-400 hover:text-gray-800 dark:hover:text-zinc-200'
            }`}
          >
            <span>Active Booking</span>
            {activeTab === 'active' && (
              <motion.div
                layoutId="booking-tab-underline"
                className="absolute bottom-0 left-4 right-4 h-1 bg-rose-600 dark:bg-rose-500 rounded-full"
              />
            )}
          </button>

          {/* Vertical Divider */}
          <div className="h-6 w-[1px] bg-gray-200 dark:bg-zinc-800 mx-1" />

          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 text-center font-display font-extrabold text-sm md:text-base transition-all relative cursor-pointer ${
              activeTab === 'history'
                ? 'text-rose-600 dark:text-rose-500'
                : 'text-gray-500 dark:text-zinc-400 hover:text-gray-800 dark:hover:text-zinc-200'
            }`}
          >
            <span>History Booking</span>
            {activeTab === 'history' && (
              <motion.div
                layoutId="booking-tab-underline"
                className="absolute bottom-0 left-4 right-4 h-1 bg-rose-600 dark:bg-rose-500 rounded-full"
              />
            )}
          </button>
        </div>
      </div>

      {/* 2. TAB CONTENT VIEW */}
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col gap-5">
        
        {/* === TAB A: ACTIVE BOOKINGS === */}
        {activeTab === 'active' && (
          activeBookings.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-zinc-900 border border-gray-150/40 dark:border-zinc-800/80 rounded-3xl shadow-sm min-h-[320px]"
            >
              <div className="h-16 w-16 rounded-full bg-orange-500/10 flex items-center justify-center mb-6">
                <Calendar className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="font-display font-extrabold text-xl text-gray-900 dark:text-white">
                No Active Appointments
              </h3>
              <p className="text-gray-500 dark:text-zinc-400 mt-2 text-sm max-w-sm leading-relaxed">
                You don't have any active bookings right now. Explore shops on the map to reserve your spot!
              </p>
              <Button
                variant="primary"
                onClick={() => navigate('/app/home')}
                className="mt-6 px-8 cursor-pointer bg-orange-500 hover:bg-orange-600 text-white font-extrabold"
              >
                Explore Barber Shops
              </Button>
            </motion.div>
          ) : (
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
                  <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-850 pb-3">
                    <div className="flex items-center gap-2">
                      <Badge status="upcoming" />
                    </div>
                    <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                      ID: {booking.booking_id.toUpperCase()}
                    </span>
                  </div>

                  {/* Progress Tracker */}
                  <div className="px-2">
                    <div className="flex justify-between text-[10px] font-bold text-gray-400 dark:text-zinc-550 uppercase tracking-wider mb-3">
                      <span className="text-orange-500">Scheduled</span>
                      <span>Arrived</span>
                      <span>In Service</span>
                      <span>Done</span>
                    </div>

                    <div className="h-1 bg-gray-100 dark:bg-zinc-800 rounded-full relative">
                      <div className="absolute top-0 bottom-0 left-0 w-1/4 rounded-full bg-orange-500" />
                      <div className="absolute top-1/2 left-0 -translate-y-1/2 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-zinc-900 bg-orange-500" />
                      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 h-3 w-3 rounded-full border-2 border-white dark:border-zinc-900 bg-gray-300 dark:bg-zinc-700" />
                      <div className="absolute top-1/2 left-2/3 -translate-y-1/2 h-3 w-3 rounded-full border-2 border-white dark:border-zinc-900 bg-gray-300 dark:bg-zinc-700" />
                      <div className="absolute top-1/2 left-[100%] -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full border-2 border-white dark:border-zinc-900 bg-gray-300 dark:bg-zinc-700" />
                    </div>
                  </div>

                  {/* OTP Panel */}
                  <div className="flex items-center justify-between bg-orange-500/5 dark:bg-orange-500/[0.02] border border-orange-500/20 rounded-2xl p-3.5">
                    <div className="min-w-0">
                      <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Share with stylist</p>
                      <p className="text-xs font-semibold text-gray-700 dark:text-zinc-350 mt-0.5">Show this OTP at check-in</p>
                    </div>
                    <h3 className="text-2xl font-extrabold tracking-widest text-orange-500 font-display">
                      {booking.otp}
                    </h3>
                  </div>

                  {/* Detail elements */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 dark:border-zinc-850 pt-4.5">
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

                    <div className="flex flex-col gap-2.5 justify-center">
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-zinc-350">
                        <Clock className="h-4 w-4 text-orange-500 shrink-0" />
                        <span>{booking.time} • {booking.date}</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-zinc-350">
                        <Scissors className="h-4 w-4 text-orange-500 shrink-0" />
                        <span>{barber.name} • {booking.service}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2.5 flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="primary"
                      onClick={() => handleOpenNavigation(shop.latitude, shop.longitude)}
                      fullWidth
                      className="h-11.5 cursor-pointer bg-orange-500 hover:bg-orange-600 text-white font-extrabold"
                    >
                      <Navigation2 className="mr-2 h-4.5 w-4.5 fill-white" /> Get Directions
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
          )
        )}

        {/* === TAB B: HISTORY BOOKINGS === */}
        {activeTab === 'history' && (
          pastBookings.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-zinc-900 border border-gray-150/40 dark:border-zinc-800/80 rounded-3xl shadow-sm min-h-[320px]"
            >
              <div className="h-16 w-16 rounded-full bg-orange-500/10 flex items-center justify-center mb-6">
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="font-display font-extrabold text-xl text-gray-900 dark:text-white">
                No Booking History
              </h3>
              <p className="text-gray-500 dark:text-zinc-400 mt-2 text-sm max-w-sm leading-relaxed">
                You haven't completed any visits yet. Your past appointments will appear here!
              </p>
            </motion.div>
          ) : (
            pastBookings.map((booking) => {
              return (
                <motion.div
                  key={booking.booking_id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-150/40 dark:border-zinc-800/80 shadow-sm p-4 flex flex-col gap-3.5 hover:border-orange-500/20 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <Badge status={booking.status} />
                    <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                      {booking.date}
                    </span>
                  </div>

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

                    <div className="text-right shrink-0">
                      <span className="text-sm font-extrabold text-gray-900 dark:text-white">
                        ${booking.price}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 border-t border-gray-100 dark:border-zinc-850 pt-3 mt-1.5">
                    <button
                      onClick={() => setSelectedDetails(booking)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-gray-50 dark:bg-zinc-850 text-gray-600 dark:text-zinc-400 font-bold text-xs rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" /> Details
                    </button>

                    <button
                      onClick={() => handleBookAgain(booking)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-orange-500/10 text-orange-500 font-bold text-xs rounded-xl hover:bg-orange-500/15 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="h-3.5 w-3.5" /> Book Again
                    </button>
                  </div>
                </motion.div>
              );
            })
          )
        )}
      </div>

      {/* Booking Details Overlay Modal */}
      <DrawerModal
        isOpen={selectedDetails !== null}
        onClose={() => setSelectedDetails(null)}
        title="Appointment Details"
      >
        {selectedDetails && (
          <div className="flex flex-col gap-4 text-sm mt-2">
            <div className="flex justify-between items-center py-2 bg-gray-50 dark:bg-zinc-900 rounded-2xl px-4 border border-gray-250/20">
              <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400">Booking Status</span>
              <Badge status={selectedDetails.status} />
            </div>

            <div className="flex flex-col gap-3 p-4 bg-gray-50 dark:bg-zinc-900/50 rounded-3xl border border-gray-250/20">
              <div className="flex items-start gap-3">
                <MapPin className="h-4.5 w-4.5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Barbershop</p>
                  <p className="font-bold text-gray-900 dark:text-white">{getShopName(selectedDetails.shop_id)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-4.5 w-4.5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Date & Time</p>
                  <p className="font-bold text-gray-900 dark:text-white">{selectedDetails.time} • {selectedDetails.date}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Scissors className="h-4.5 w-4.5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Stylist & Service</p>
                  <p className="font-bold text-gray-900 dark:text-white">
                    {getBarberName(selectedDetails.barber_id)} • <span className="text-orange-500">{selectedDetails.service}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center px-4 py-2 mt-2">
              <span className="font-bold text-gray-700 dark:text-zinc-300">Total Price Paid</span>
              <span className="text-lg font-extrabold text-orange-500">${selectedDetails.price.toFixed(2)}</span>
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
              className="mt-4 cursor-pointer bg-orange-500 hover:bg-orange-600 text-white font-extrabold"
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Book This Stylist Again
            </Button>
          </div>
        )}
      </DrawerModal>

    </div>
  );
};
