export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  profile_image: string;
  created_at: string;
}

export interface BarberShop {
  shop_id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  opening_time: string; // e.g. "09:00 AM"
  closing_time: string; // e.g. "09:00 PM"
  status: 'OPEN' | 'CLOSED';
  image: string;
  gallery: string[];
  description: string;
}

export interface Barber {
  barber_id: string;
  shop_id: string;
  name: string;
  experience: string;
  specialization: string;
  rating: number;
  availability: boolean;
  photo: string;
  isLastTimeBarber?: boolean;
}

export interface Chair {
  chair_id: string;
  shop_id: string;
  status: 'available' | 'occupied';
}

export interface Service {
  service_id: string;
  name: string;
  price: number;
  duration: string;
  category: 'Hair' | 'Beard' | 'Grooming' | 'Combo';
}

export interface Booking {
  booking_id: string;
  user_id: string;
  shop_id: string;
  barber_id: string;
  date: string;
  time: string;
  service: string;
  price: number;
  otp: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  created_at: string;
  chair_id?: string;
}

// Custom Services list shared or specific
export const mockServices: Service[] = [
  { service_id: 's1', name: 'Signature Haircut', price: 25, duration: '30 mins', category: 'Hair' },
  { service_id: 's2', name: 'Beard Sculpt & Trim', price: 15, duration: '20 mins', category: 'Beard' },
  { service_id: 's3', name: 'Luxury Hot Towel Shave', price: 20, duration: '25 mins', category: 'Beard' },
  { service_id: 's4', name: 'Hair Coloring & Highlight', price: 45, duration: '60 mins', category: 'Hair' },
  { service_id: 's5', name: 'Charcoal Face Mask & Peel', price: 12, duration: '15 mins', category: 'Grooming' },
  { service_id: 's6', name: 'The Gentlemen\'s Combo (Hair + Beard)', price: 35, duration: '50 mins', category: 'Combo' },
];

export const mockShops: BarberShop[] = [
  {
    shop_id: 'shop1',
    name: 'The Razor\'s Edge Parlour',
    address: '142 Golden Gate Ave, San Francisco, CA 94102',
    latitude: 37.7816,
    longitude: -122.4156,
    rating: 4.9,
    opening_time: '09:00 AM',
    closing_time: '08:00 PM',
    status: 'OPEN',
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&auto=format&fit=crop&q=80'
    ],
    description: 'Establishment dedicated to premium men\'s grooming since 2015. Known for vintage leather chairs, warm hospitality, and precision cuts.'
  },
  {
    shop_id: 'shop2',
    name: 'Fade & Blade Studio',
    address: '568 Market St, San Francisco, CA 94104',
    latitude: 37.7891,
    longitude: -122.4014,
    rating: 4.8,
    opening_time: '10:00 AM',
    closing_time: '09:00 PM',
    status: 'OPEN',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512864084360-7c0c4d0a0845?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1605497746444-ac9da58d7fd0?w=600&auto=format&fit=crop&q=80'
    ],
    description: 'A modern, high-energy studio specializing in contemporary skin fades, designs, and vibrant hair styling for the forward-thinking gentleman.'
  },
  {
    shop_id: 'shop3',
    name: 'Crown & Comb Parlour',
    address: '888 Brannan St, San Francisco, CA 94103',
    latitude: 37.7712,
    longitude: -122.4042,
    rating: 4.7,
    opening_time: '08:00 AM',
    closing_time: '07:00 PM',
    status: 'OPEN',
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1593702295094-aea22597af65?w=600&auto=format&fit=crop&q=80'
    ],
    description: 'Nestled in the heart of SOMA, this boutique offers a calm, green workspace. Unwind with a free craft beer or espresso with every premium service.'
  },
  {
    shop_id: 'shop4',
    name: 'Midnight Scissors (Closed)',
    address: '101 Hyde St, San Francisco, CA 94102',
    latitude: 37.7811,
    longitude: -122.4168,
    rating: 4.5,
    opening_time: '11:00 PM',
    closing_time: '06:00 AM',
    status: 'CLOSED', // This will be filtered out on the Home page search/map
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&auto=format&fit=crop&q=80'
    ],
    description: 'A late-night speakeasy-style barbershop catering to nocturnal creatives and late-shift professionals.'
  }
];

export const mockBarbers: Barber[] = [
  // Shop 1 Barbers
  {
    barber_id: 'b1',
    shop_id: 'shop1',
    name: 'Marcus Vance',
    experience: '6 years',
    specialization: 'Fades & Classic Tapers',
    rating: 4.9,
    availability: true,
    isLastTimeBarber: true,
    photo: 'https://images.unsplash.com/photo-1600486913747-55e5470d6f40?w=300&auto=format&fit=crop&q=80'
  },
  {
    barber_id: 'b2',
    shop_id: 'shop1',
    name: 'Carlos Ortiz',
    experience: '8 years',
    specialization: 'Beards & Straight Razor Shaves',
    rating: 4.8,
    availability: true,
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80'
  },
  {
    barber_id: 'b3',
    shop_id: 'shop1',
    name: 'Leo Sinclair',
    experience: '4 years',
    specialization: 'Scissor Cuts & Hair Flow',
    rating: 4.7,
    availability: false,
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
  },
  {
    barber_id: 'b8',
    shop_id: 'shop1',
    name: 'Derrick Sterling',
    experience: '5 years',
    specialization: 'Beard Sculpt & Trims',
    rating: 4.6,
    availability: false,
    photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80'
  },

  // Shop 2 Barbers
  {
    barber_id: 'b4',
    shop_id: 'shop2',
    name: 'Jaxson Reed',
    experience: '5 years',
    specialization: 'Skin Fades & Hair Art',
    rating: 4.9,
    availability: true,
    isLastTimeBarber: true,
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80'
  },
  {
    barber_id: 'b5',
    shop_id: 'shop2',
    name: 'Sofia Chen',
    experience: '7 years',
    specialization: 'Color Fades & Pompadours',
    rating: 4.9,
    availability: true,
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80'
  },
  {
    barber_id: 'b9',
    shop_id: 'shop2',
    name: 'Tariq Miller',
    experience: '6 years',
    specialization: 'Hot Towel & Razor Shave',
    rating: 4.7,
    availability: false,
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80'
  },

  // Shop 3 Barbers
  {
    barber_id: 'b6',
    shop_id: 'shop3',
    name: 'Ethan Hawke',
    experience: '9 years',
    specialization: 'Executive Grooming & Shaves',
    rating: 4.9,
    availability: true,
    isLastTimeBarber: true,
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80'
  },
  {
    barber_id: 'b7',
    shop_id: 'shop3',
    name: 'Maya Lin',
    experience: '3 years',
    specialization: 'Buzz Cuts & Hair Styling',
    rating: 4.6,
    availability: true,
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80'
  },
  {
    barber_id: 'b10',
    shop_id: 'shop3',
    name: 'Victor Rossi',
    experience: '8 years',
    specialization: 'Classic Scissor Cut',
    rating: 4.8,
    availability: false,
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80'
  }
];

export const mockChairs: Chair[] = [
  // Shop 1 Chairs
  { chair_id: 'c1_1', shop_id: 'shop1', status: 'available' },
  { chair_id: 'c1_2', shop_id: 'shop1', status: 'occupied' },
  { chair_id: 'c1_3', shop_id: 'shop1', status: 'available' },
  { chair_id: 'c1_4', shop_id: 'shop1', status: 'occupied' },
  { chair_id: 'c1_5', shop_id: 'shop1', status: 'available' },

  // Shop 2 Chairs
  { chair_id: 'c2_1', shop_id: 'shop2', status: 'occupied' },
  { chair_id: 'c2_2', shop_id: 'shop2', status: 'available' },
  { chair_id: 'c2_3', shop_id: 'shop2', status: 'occupied' },
  { chair_id: 'c2_4', shop_id: 'shop2', status: 'available' },

  // Shop 3 Chairs
  { chair_id: 'c3_1', shop_id: 'shop3', status: 'available' },
  { chair_id: 'c3_2', shop_id: 'shop3', status: 'available' },
  { chair_id: 'c3_3', shop_id: 'shop3', status: 'occupied' },
  { chair_id: 'c3_4', shop_id: 'shop3', status: 'occupied' },
];

export const mockBookingHistory: Booking[] = [
  {
    booking_id: 'bk_1',
    user_id: 'user_dev',
    shop_id: 'shop1',
    barber_id: 'b1',
    date: '2026-07-15',
    time: '11:00 AM',
    service: 'Signature Haircut',
    price: 25,
    otp: '7823',
    status: 'completed',
    created_at: '2026-07-14T10:30:00Z',
    chair_id: 'c1_1'
  },
  {
    booking_id: 'bk_2',
    user_id: 'user_dev',
    shop_id: 'shop2',
    barber_id: 'b4',
    date: '2026-06-28',
    time: '03:30 PM',
    service: 'The Gentlemen\'s Combo (Hair + Beard)',
    price: 35,
    otp: '1984',
    status: 'completed',
    created_at: '2026-06-27T14:15:00Z',
    chair_id: 'c2_2'
  },
  {
    booking_id: 'bk_3',
    user_id: 'user_dev',
    shop_id: 'shop3',
    barber_id: 'b6',
    date: '2026-07-02',
    time: '02:00 PM',
    service: 'Luxury Hot Towel Shave',
    price: 20,
    otp: '4481',
    status: 'cancelled',
    created_at: '2026-07-01T09:00:00Z',
    chair_id: 'c3_1'
  }
];
