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
  userAddress: string;
  shops: BarberShop[];
  barbers: Barber[];
  chairs: Chair[];
  bookings: Booking[];
  currentBookingFlow: BookingFlow;
  favoriteShops: string[];
  searchQuery: string;
  maxDistance: number;
  genderFilter: 'men' | 'women' | 'all';
  theme: 'light' | 'dark';
  toast: { message: string; type: 'success' | 'error' | 'info'; id: number } | null;
  
  stampsCount: number;
  cycleNumber: number;
  referralPoints: number;
  lastStampAnimationTime: number;
  
  // Actions
  loginWithGoogle: () => void;
  sendOTP: (phone: string) => void;
  verifyOTP: (otp: string) => boolean;
  setLocationPermission: (status: 'granted' | 'denied') => void;
  requestRealLocation: () => void;
  updateShopsAroundLocation: (lat: number, lng: number) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: { maxDistance?: number; genderFilter?: 'men' | 'women' | 'all' }) => void;
  setFavorite: (shopId: string) => void;
  toggleTheme: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
  logout: () => void;
  addStamp: () => void;
  claimFreeHaircut: () => void;
  addReferralPoints: (pts: number) => void;
  
  // Booking Flow Actions
  setBookingShop: (shopId: string) => void;
  setBookingBarber: (barberId: string) => void;
  setBookingChair: (chairId: string) => void;
  setBookingDate: (date: string) => void;
  setBookingTime: (time: string) => void;
  setBookingService: (serviceId: string, name: string, price: number) => void;
  resetBookingFlow: () => void;
  confirmBooking: () => Booking;
  cancelBooking: (bookingId: string) => void;
  tickChairs: () => void;
}

const initialBookingFlow: BookingFlow = {
  shopId: 'shop1',
  barberId: 'barber1',
  chairId: 'chair1_1',
  date: '',
  time: '',
  serviceId: 's1',
  serviceName: 'Signature Haircut',
  price: 25
};

export const useStore = create<State>((set, get) => ({
  user: null,
  otpSent: false,
  phoneToVerify: null,
  locationPermission: 'prompt',
  userLocation: null,
  userAddress: 'HNo 1-7-201/2/1 Kamala Nagar, Hyderabad',
  shops: mockShops,
  barbers: mockBarbers,
  chairs: mockChairs,
  bookings: mockBookingHistory,
  currentBookingFlow: initialBookingFlow,
  favoriteShops: ['shop1'], // Default favorite
  theme: 'light', // default theme is white/light mode
  toast: null,
  searchQuery: '',
  maxDistance: 10,
  genderFilter: 'men',
  stampsCount: 5, // Default 5/10 stamps collected
  cycleNumber: 1, // Default Cycle 1
  referralPoints: 450, // Default 450 referral points
  lastStampAnimationTime: 0,

  addStamp: () => {
    const current = get().stampsCount;
    if (current >= 10) {
      get().showToast('🎉 You already unlocked 10/10 stamps! Claim your FREE 11th haircut now.', 'success');
      return;
    }
    const nextCount = current + 1;
    set({ stampsCount: nextCount, lastStampAnimationTime: Date.now() });
  },

  claimFreeHaircut: () => {
    const nextCycle = get().cycleNumber + 1;
    set({ stampsCount: 1, cycleNumber: nextCycle });
    get().showToast(`🎉 Congratulations! FREE Haircut claimed! Started Cycle ${nextCycle}.`, 'success');
  },

  addReferralPoints: (pts: number) => {
    const nextPts = get().referralPoints + pts;
    set({ referralPoints: nextPts });
    get().showToast(`🎉 +${pts} Referral Points added! Total: ${nextPts} pts`, 'success');
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  setFilters: (filters) => {
    set((state) => ({
      maxDistance: filters.maxDistance !== undefined ? filters.maxDistance : state.maxDistance,
      genderFilter: filters.genderFilter !== undefined ? filters.genderFilter : state.genderFilter
    }));
  },

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
      set({ user: mockPhoneUser });
      get().showToast('Logged in successfully!', 'success');
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

  updateShopsAroundLocation: (lat: number, lng: number) => {
    // Generate realistic shop locations distributed around user coordinates (300m - 1km radius)
    const offsets = [
      { dLat: 0.0032, dLng: 0.0025 },
      { dLat: -0.0028, dLng: 0.0041 },
      { dLat: 0.0045, dLng: -0.0035 },
      { dLat: -0.0039, dLng: -0.0021 },
    ];

    const updatedShops = get().shops.map((shop, idx) => {
      const offset = offsets[idx % offsets.length];
      return {
        ...shop,
        latitude: lat + offset.dLat,
        longitude: lng + offset.dLng,
      };
    });

    set({ shops: updatedShops });
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

          // Position all shops around user's real location
          get().updateShopsAroundLocation(latitude, longitude);

          // Reverse geocode to get city/street name for header
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
            .then(res => res.json())
            .then(data => {
              if (data && data.display_name) {
                const parts = data.display_name.split(',');
                const addressStr = parts.slice(0, 3).join(', ');
                set({ userAddress: addressStr });
              }
            })
            .catch(() => {});

          get().showToast('GPS Location detected! Nearby shops loaded.', 'success');
        },
        (error) => {
          console.warn('Geolocation error or denied:', error.message);
          const fallbackLat = 17.4065;
          const fallbackLng = 78.4772;
          set({ 
            locationPermission: 'granted',
            userLocation: { latitude: fallbackLat, longitude: fallbackLng }
          });
          get().updateShopsAroundLocation(fallbackLat, fallbackLng);
          get().showToast('Showing nearby shops for your area', 'info');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      const fallbackLat = 17.4065;
      const fallbackLng = 78.4772;
      set({ 
        locationPermission: 'granted',
        userLocation: { latitude: fallbackLat, longitude: fallbackLng }
      });
      get().updateShopsAroundLocation(fallbackLat, fallbackLng);
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
    set({ 
      user: null, 
      otpSent: false, 
      phoneToVerify: null,
      currentBookingFlow: initialBookingFlow 
    });
    get().showToast('Logged out successfully', 'info');
  },

  // Booking Flow Actions
  setBookingShop: (shopId: string) => {
    set((state) => ({
      currentBookingFlow: {
        ...state.currentBookingFlow,
        shopId
      }
    }));
  },

  setBookingBarber: (barberId: string) => {
    set((state) => ({
      currentBookingFlow: {
        ...state.currentBookingFlow,
        barberId
      }
    }));
  },

  setBookingChair: (chairId: string) => {
    set((state) => ({
      currentBookingFlow: {
        ...state.currentBookingFlow,
        chairId
      }
    }));
  },

  setBookingDate: (date: string) => {
    set((state) => ({
      currentBookingFlow: {
        ...state.currentBookingFlow,
        date
      }
    }));
  },

  setBookingTime: (time: string) => {
    set((state) => ({
      currentBookingFlow: {
        ...state.currentBookingFlow,
        time
      }
    }));
  },

  setBookingService: (serviceId: string, name: string, price: number) => {
    set((state) => ({
      currentBookingFlow: {
        ...state.currentBookingFlow,
        serviceId,
        serviceName: name,
        price
      }
    }));
  },

  resetBookingFlow: () => {
    set({ currentBookingFlow: initialBookingFlow });
  },

  confirmBooking: () => {
    const { currentBookingFlow, user, bookings, stampsCount } = get();
    const newBooking: Booking = {
      booking_id: 'bk_' + Math.random().toString(36).substr(2, 9),
      user_id: user ? user.id : 'guest',
      shop_id: currentBookingFlow.shopId,
      barber_id: currentBookingFlow.barberId,
      chair_id: currentBookingFlow.chairId,
      date: currentBookingFlow.date || new Date().toISOString().split('T')[0],
      time: currentBookingFlow.time || '10:00 AM',
      service: currentBookingFlow.serviceName || 'Signature Haircut',
      price: currentBookingFlow.price || 25,
      otp: Math.floor(1000 + Math.random() * 9000).toString(),
      status: 'upcoming',
      created_at: new Date().toISOString()
    };

    const nextStamps = Math.min(10, stampsCount + 1);

    set({ 
      bookings: [newBooking, ...bookings],
      currentBookingFlow: initialBookingFlow,
      stampsCount: nextStamps,
      lastStampAnimationTime: Date.now()
    });

    return newBooking;
  },

  cancelBooking: (bookingId: string) => {
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.booking_id === bookingId ? { ...b, status: 'cancelled' as const } : b
      ),
    }));
    get().showToast('Booking cancelled', 'info');
  },

  // Live ticking simulation toggling chair status
  tickChairs: () => {
    set((state) => {
      const updatedChairs = state.chairs.map((chair) => {
        // 15% chance to toggle status on each tick
        if (Math.random() < 0.15) {
          return {
            ...chair,
            status: chair.status === 'available' ? 'occupied' : 'available'
          } as Chair;
        }
        return chair;
      });
      return { chairs: updatedChairs };
    });
  }
}));
