import { create } from 'zustand';
import { 
  mockShops, 
  mockBarbers, 
  mockChairs, 
  mockBookingHistory 
} from '../mock/mockData';
import type { 
  BarberShop, 
  Barber, 
  Chair, 
  Booking, 
  User 
} from '../mock/mockData';

interface BookingFlow {
  shopId: string;
  barberId: string;
  chairId: string;
  date: string;
  time: string;
  serviceId: string;
  serviceName: string;
  price: number;
}

interface State {
  user: User | null;
  otpSent: boolean;
  phoneToVerify: string | null;
  locationPermission: 'prompt' | 'granted' | 'denied';
  userLocation: { latitude: number; longitude: number } | null;
  shops: BarberShop[];
  barbers: Barber[];
  chairs: Chair[];
  bookings: Booking[];
  currentBookingFlow: BookingFlow;
  favoriteShops: string[];
  theme: 'light' | 'dark';
  toast: { message: string; type: 'success' | 'error' | 'info'; id: number } | null;
  
  // Actions
  loginWithGoogle: () => void;
  sendOTP: (phone: string) => void;
  verifyOTP: (otp: string) => boolean;
  setLocationPermission: (status: 'granted' | 'denied') => void;
  requestRealLocation: () => void;
  setFavorite: (shopId: string) => void;
  toggleTheme: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
  logout: () => void;
  
  // Booking Flow Actions
  setBookingShop: (shopId: string) => void;
  setBookingBarber: (barberId: string) => void;
  setBookingChair: (chairId: string) => void;
  setBookingDate: (date: string) => void;
  setBookingTime: (time: string) => void;
  setBookingService: (serviceId: string, serviceName: string, price: number) => void;
  confirmBooking: () => Booking;
  cancelBooking: (bookingId: string) => void;
  resetBookingFlow: () => void;
  
  // Live Simulation
  tickChairs: () => void;
}

const initialBookingFlow: BookingFlow = {
  shopId: '',
  barberId: '',
  chairId: '',
  date: '',
  time: '',
  serviceId: '',
  serviceName: '',
  price: 0,
};

export const useStore = create<State>((set, get) => ({
  user: null,
  otpSent: false,
  phoneToVerify: null,
  locationPermission: 'prompt',
  userLocation: null,
  shops: mockShops,
  barbers: mockBarbers,
  chairs: mockChairs,
  bookings: mockBookingHistory,
  currentBookingFlow: initialBookingFlow,
  favoriteShops: ['shop1'], // Default favorite
  theme: 'light', // default theme is white/light mode
  toast: null,

  loginWithGoogle: () => {
    const mockGoogleUser: User = {
      id: 'user_google_' + Math.random().toString(36).substr(2, 9),
      name: 'Alexander Mercer',
      email: 'alexander.mercer@gmail.com',
      phone: '+1 (555) 019-2834',
      profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      created_at: new Date().toISOString(),
    };
    set({ user: mockGoogleUser });
    get().showToast('Logged in successfully with Google!', 'success');
  },

  sendOTP: (phone: string) => {
    set({ otpSent: true, phoneToVerify: phone });
    get().showToast('OTP sent code: 4827', 'info');
  },

  verifyOTP: (otp: string) => {
    if (otp === '4827') {
      const mockPhoneUser: User = {
        id: 'user_phone_' + Math.random().toString(36).substr(2, 9),
        name: 'Guest Groomer',
        email: 'guest@groomer.com',
        phone: get().phoneToVerify || '+1 (555) 000-0000',
        profile_image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        created_at: new Date().toISOString(),
      };
      set({ user: mockPhoneUser, otpSent: false, phoneToVerify: null });
      get().showToast('Phone verified successfully!', 'success');
      return true;
    } else {
      get().showToast('Invalid OTP! Please try "4827"', 'error');
      return false;
    }
  },

  setLocationPermission: (status: 'granted' | 'denied') => {
    if (status === 'granted') {
      get().requestRealLocation();
    } else {
      set({ locationPermission: 'denied', userLocation: null });
      get().showToast('Location permission denied', 'error');
    }
  },

  requestRealLocation: () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          set({ 
            locationPermission: 'granted',
            userLocation: { latitude, longitude }
          });
          get().showToast('GPS Location detected!', 'success');
        },
        (error) => {
          console.warn('Geolocation error or denied:', error.message);
          // Fallback to Hyderabad / San Francisco if location denied/unavailable
          set({ 
            locationPermission: 'granted',
            userLocation: { latitude: 17.4065, longitude: 78.4772 }
          });
          get().showToast('City location loaded', 'info');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      set({ 
        locationPermission: 'granted',
        userLocation: { latitude: 17.4065, longitude: 78.4772 }
      });
    }
  },

  setFavorite: (shopId: string) => {
    set((state) => {
      const isFav = state.favoriteShops.includes(shopId);
      const newFavs = isFav
        ? state.favoriteShops.filter((id) => id !== shopId)
        : [...state.favoriteShops, shopId];
      
      return { 
        favoriteShops: newFavs,
        toast: {
          id: Date.now(),
          message: isFav ? 'Removed from favorites' : 'Added to favorites!',
          type: 'success'
        }
      };
    });
  },

  toggleTheme: () => {
    set((state) => {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light';
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
      return { theme: nextTheme };
    });
  },

  showToast: (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    set({ toast: { message, type, id: Date.now() } });
  },

  hideToast: () => {
    set({ toast: null });
  },

  logout: () => {
    set({ user: null, locationPermission: 'prompt', userLocation: null });
    get().showToast('Logged out safely', 'info');
  },

  // Booking actions
  setBookingShop: (shopId: string) => {
    const firstBarber = get().barbers.find(b => b.shop_id === shopId);
    const barberId = firstBarber ? firstBarber.barber_id : '';
    set((state) => ({ 
      currentBookingFlow: { 
        ...state.currentBookingFlow, 
        shopId,
        barberId,
        serviceId: 's1',
        serviceName: 'Signature Haircut',
        price: 25
      } 
    }));
  },

  setBookingBarber: (barberId: string) => {
    set((state) => ({ currentBookingFlow: { ...state.currentBookingFlow, barberId } }));
  },

  setBookingChair: (chairId: string) => {
    set((state) => ({ currentBookingFlow: { ...state.currentBookingFlow, chairId } }));
  },

  setBookingDate: (date: string) => {
    set((state) => ({ currentBookingFlow: { ...state.currentBookingFlow, date } }));
  },

  setBookingTime: (time: string) => {
    set((state) => ({ currentBookingFlow: { ...state.currentBookingFlow, time } }));
  },

  setBookingService: (serviceId: string, serviceName: string, price: number) => {
    set((state) => ({ 
      currentBookingFlow: { 
        ...state.currentBookingFlow, 
        serviceId, 
        serviceName, 
        price 
      } 
    }));
  },

  confirmBooking: () => {
    const flow = get().currentBookingFlow;
    const user = get().user;
    
    const newBooking: Booking = {
      booking_id: 'bk_' + Math.random().toString(36).substr(2, 9),
      user_id: user?.id || 'guest_user',
      shop_id: flow.shopId,
      barber_id: flow.barberId,
      chair_id: flow.chairId,
      date: flow.date,
      time: flow.time,
      service: flow.serviceName,
      price: flow.price,
      otp: Math.floor(1000 + Math.random() * 9000).toString(),
      status: 'upcoming',
      created_at: new Date().toISOString(),
    };

    set((state) => ({
      bookings: [newBooking, ...state.bookings],
    }));

    get().showToast('Appointment confirmed!', 'success');
    return newBooking;
  },

  cancelBooking: (bookingId: string) => {
    set((state) => ({
      bookings: state.bookings.map((b) => 
        b.booking_id === bookingId ? { ...b, status: 'cancelled' as const } : b
      )
    }));
    get().showToast('Booking cancelled successfully', 'info');
  },

  resetBookingFlow: () => {
    set({ currentBookingFlow: initialBookingFlow });
  },

  // Live simulation ticks: Toggles chair statuses randomly to feel active
  tickChairs: () => {
    set((state) => ({
      chairs: state.chairs.map((chair) => {
        // 15% chance to toggle a chair status randomly
        if (Math.random() < 0.15) {
          return {
            ...chair,
            status: chair.status === 'available' ? 'occupied' : 'available',
          };
        }
        return chair;
      }),
    }));
  },
}));
