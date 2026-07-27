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
  category?: 'men' | 'women' | 'all';
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

export interface Review {
  review_id: string;
  shop_id: string;
  user_name: string;
  user_avatar: string;
  rating: number;
  date: string;
  comment: string;
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
    name: 'The Crown Salon',
    address: '142 Golden Gate Ave, San Francisco, CA 94102',
    latitude: 37.7816,
    longitude: -122.4156,
    rating: 4.8,
    opening_time: '09:00 AM',
    closing_time: '08:00 PM',
    status: 'OPEN',
    category: 'men',
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&auto=format&fit=crop&q=80',
    gallery: ['https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&auto=format&fit=crop&q=80'],
    description: 'Premium men\'s grooming since 2015. Known for vintage leather chairs and precision cuts.'
  },
  {
    shop_id: 'shop2',
    name: 'Fade Studio',
    address: '568 Market St, San Francisco, CA 94104',
    latitude: 37.7860,
    longitude: -122.4014,
    rating: 4.9,
    opening_time: '10:00 AM',
    closing_time: '09:00 PM',
    status: 'OPEN',
    category: 'men',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80',
    gallery: ['https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80'],
    description: 'Modern studio specializing in skin fades and contemporary styling.'
  },
  {
    shop_id: 'shop3',
    name: 'Beard & Blade',
    address: '888 Brannan St, San Francisco, CA 94103',
    latitude: 37.7760,
    longitude: -122.4080,
    rating: 4.7,
    opening_time: '08:00 AM',
    closing_time: '07:00 PM',
    status: 'OPEN',
    category: 'men',
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&auto=format&fit=crop&q=80',
    gallery: ['https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&auto=format&fit=crop&q=80'],
    description: 'Boutique barbershop with free craft beer or espresso with every premium service.'
  },
  {
    shop_id: 'shop4',
    name: 'Signature Lounge',
    address: '210 Hyde St, San Francisco, CA 94102',
    latitude: 37.7840,
    longitude: -122.4200,
    rating: 4.6,
    opening_time: '09:00 AM',
    closing_time: '08:00 PM',
    status: 'OPEN',
    category: 'women',
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&auto=format&fit=crop&q=80',
    gallery: ['https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&auto=format&fit=crop&q=80'],
    description: 'Signature cuts and luxury grooming in the heart of the city.'
  },
  {
    shop_id: 'shop5',
    name: 'Urban Cuts',
    address: '330 Castro St, San Francisco, CA 94114',
    latitude: 37.7750,
    longitude: -122.4030,
    rating: 4.5,
    opening_time: '10:00 AM',
    closing_time: '08:00 PM',
    status: 'OPEN',
    category: 'women',
    image: 'https://images.unsplash.com/photo-1512864084360-7c0c4d0a0845?w=600&auto=format&fit=crop&q=80',
    gallery: ['https://images.unsplash.com/photo-1512864084360-7c0c4d0a0845?w=600&auto=format&fit=crop&q=80'],
    description: 'Trendy neighborhood barbershop — a local favourite for clean fades and sharp lineups.'
  },
  {
    shop_id: 'shop6',
    name: 'Gentlemen\'s Haven',
    address: '450 Sutter St, San Francisco, CA 94108',
    latitude: 37.7890,
    longitude: -122.4060,
    rating: 4.9,
    opening_time: '08:30 AM',
    closing_time: '07:30 PM',
    status: 'OPEN',
    category: 'men',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80',
    gallery: ['https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80'],
    description: 'Exclusive private barbershop focusing on traditional razor cuts.'
  },
  {
    shop_id: 'shop7',
    name: 'VIP Razor Parlour',
    address: '720 Post St, San Francisco, CA 94109',
    latitude: 37.7875,
    longitude: -122.4130,
    rating: 4.7,
    opening_time: '09:00 AM',
    closing_time: '09:00 PM',
    status: 'OPEN',
    category: 'men',
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&auto=format&fit=crop&q=80',
    gallery: ['https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&auto=format&fit=crop&q=80'],
    description: 'Luxury grooming parlour with VIP hot towel facial treatments.'
  },
  {
    shop_id: 'shop8',
    name: 'The Barber\'s Club',
    address: '1050 Valencia St, San Francisco, CA 94110',
    latitude: 37.7550,
    longitude: -122.4210,
    rating: 4.8,
    opening_time: '10:00 AM',
    closing_time: '08:00 PM',
    status: 'OPEN',
    category: 'men',
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&auto=format&fit=crop&q=80',
    gallery: ['https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&auto=format&fit=crop&q=80'],
    description: 'High energy barbershop known for speed, style, and community vibes.'
  },
  {
    shop_id: 'shop9',
    name: 'Grooming & Co.',
    address: '220 Montgomery St, San Francisco, CA 94104',
    latitude: 37.7910,
    longitude: -122.4020,
    rating: 4.6,
    opening_time: '08:00 AM',
    closing_time: '06:00 PM',
    status: 'OPEN',
    category: 'women',
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&auto=format&fit=crop&q=80',
    gallery: ['https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&auto=format&fit=crop&q=80'],
    description: 'Financial district express grooming station for busy professionals.'
  },
  {
    shop_id: 'shop10',
    name: 'SOMA Fade Lounge',
    address: '600 Townsend St, San Francisco, CA 94103',
    latitude: 37.7720,
    longitude: -122.4010,
    rating: 4.9,
    opening_time: '09:00 AM',
    closing_time: '08:00 PM',
    status: 'OPEN',
    category: 'men',
    image: 'https://images.unsplash.com/photo-1512864084360-7c0c4d0a0845?w=600&auto=format&fit=crop&q=80',
    gallery: ['https://images.unsplash.com/photo-1512864084360-7c0c4d0a0845?w=600&auto=format&fit=crop&q=80'],
    description: 'Spacious SOMA lounge equipped with 6 master barber stations.'
  },
  {
    shop_id: 'shop11',
    name: 'Classic Clippers',
    address: '150 Fillmore St, San Francisco, CA 94117',
    latitude: 37.7710,
    longitude: -122.4300,
    rating: 4.5,
    opening_time: '09:30 AM',
    closing_time: '07:30 PM',
    status: 'OPEN',
    category: 'men',
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&auto=format&fit=crop&q=80',
    gallery: ['https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&auto=format&fit=crop&q=80'],
    description: 'Old-school clipper cuts and beard sculpting since 1998.'
  },
  {
    shop_id: 'shop12',
    name: 'Luxe Barber Bar',
    address: '800 Beach St, San Francisco, CA 94109',
    latitude: 37.8070,
    longitude: -122.4220,
    rating: 4.8,
    opening_time: '10:00 AM',
    closing_time: '09:00 PM',
    status: 'OPEN',
    category: 'women',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80',
    gallery: ['https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80'],
    description: 'Waterfront luxury salon offering craft cocktails and hair styling.'
  },
  {
    shop_id: 'shop13',
    name: 'Elite Shears Studio',
    address: '350 Bay St, San Francisco, CA 94133',
    latitude: 37.8050,
    longitude: -122.4110,
    rating: 4.6,
    opening_time: '09:00 AM',
    closing_time: '08:00 PM',
    status: 'OPEN',
    category: 'women',
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&auto=format&fit=crop&q=80',
    gallery: ['https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&auto=format&fit=crop&q=80'],
    description: 'Precision scissor cuts and hair conditioning treatments.'
  },
  {
    shop_id: 'shop14',
    name: 'Metro Cut & Shave',
    address: '900 Polk St, San Francisco, CA 94109',
    latitude: 37.7850,
    longitude: -122.4190,
    rating: 4.7,
    opening_time: '08:00 AM',
    closing_time: '08:00 PM',
    status: 'OPEN',
    category: 'men',
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&auto=format&fit=crop&q=80',
    gallery: ['https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&auto=format&fit=crop&q=80'],
    description: 'Fast, sharp, reliable urban haircutting station.'
  },
  {
    shop_id: 'shop15',
    name: 'Apex Grooming',
    address: '1200 Market St, San Francisco, CA 94102',
    latitude: 37.7780,
    longitude: -122.4140,
    rating: 4.9,
    opening_time: '09:00 AM',
    closing_time: '09:00 PM',
    status: 'OPEN',
    category: 'men',
    image: 'https://images.unsplash.com/photo-1512864084360-7c0c4d0a0845?w=600&auto=format&fit=crop&q=80',
    gallery: ['https://images.unsplash.com/photo-1512864084360-7c0c4d0a0845?w=600&auto=format&fit=crop&q=80'],
    description: 'Top rated downtown grooming club with executive membership perks.'
  },
  {
    shop_id: 'shop16',
    name: 'Vintage Chair Co.',
    address: '400 Haight St, San Francisco, CA 94117',
    latitude: 37.7725,
    longitude: -122.4290,
    rating: 4.8,
    opening_time: '10:00 AM',
    closing_time: '08:00 PM',
    status: 'OPEN',
    category: 'women',
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&auto=format&fit=crop&q=80',
    gallery: ['https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&auto=format&fit=crop&q=80'],
    description: 'Retro 1950s themed barber studio with vinyl music and classic cuts.'
  },
  {
    shop_id: 'shop17',
    name: 'Velvet Scissor Studio',
    address: '500 Division St, San Francisco, CA 94103',
    latitude: 37.7700,
    longitude: -122.4070,
    rating: 4.6,
    opening_time: '09:00 AM',
    closing_time: '07:00 PM',
    status: 'OPEN',
    category: 'women',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80',
    gallery: ['https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80'],
    description: 'Chic boutique studio specialized in textured haircuts and styling.'
  },
  {
    shop_id: 'shop18',
    name: 'Prime Trim Lounge',
    address: '1600 Mission St, San Francisco, CA 94103',
    latitude: 37.7715,
    longitude: -122.4180,
    rating: 4.7,
    opening_time: '08:30 AM',
    closing_time: '08:30 PM',
    status: 'OPEN',
    category: 'men',
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&auto=format&fit=crop&q=80',
    gallery: ['https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&auto=format&fit=crop&q=80'],
    description: 'Premier Mission district barbershop for sharp lineups and beard oils.'
  }
];

export const mockBarbers: Barber[] = [
  // Shop 1 Barbers
  { barber_id: 'b1', shop_id: 'shop1', name: 'Marcus Vance', experience: '6 years', specialization: 'Fades & Classic Tapers', rating: 4.9, availability: true, isLastTimeBarber: true, photo: 'https://images.unsplash.com/photo-1600486913747-55e5470d6f40?w=300&auto=format&fit=crop&q=80' },
  { barber_id: 'b2', shop_id: 'shop1', name: 'Carlos Ortiz', experience: '8 years', specialization: 'Beards & Straight Razor Shaves', rating: 4.8, availability: true, photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80' },

  // Shop 2 Barbers
  { barber_id: 'b4', shop_id: 'shop2', name: 'Jaxson Reed', experience: '5 years', specialization: 'Skin Fades & Hair Art', rating: 4.9, availability: true, isLastTimeBarber: true, photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80' },
  { barber_id: 'b5', shop_id: 'shop2', name: 'Sofia Chen', experience: '7 years', specialization: 'Color Fades & Pompadours', rating: 4.9, availability: true, photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80' },

  // Shop 3 Barbers
  { barber_id: 'b6', shop_id: 'shop3', name: 'Ethan Hawke', experience: '9 years', specialization: 'Executive Grooming & Shaves', rating: 4.9, availability: true, isLastTimeBarber: true, photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80' },
  { barber_id: 'b7', shop_id: 'shop3', name: 'Maya Lin', experience: '3 years', specialization: 'Buzz Cuts & Hair Styling', rating: 4.6, availability: true, photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80' }
];

export const mockChairs: Chair[] = [
  // shop1 — 0/4 GREEN
  { chair_id: 'c1_1', shop_id: 'shop1', status: 'available' },
  { chair_id: 'c1_2', shop_id: 'shop1', status: 'available' },
  { chair_id: 'c1_3', shop_id: 'shop1', status: 'available' },
  { chair_id: 'c1_4', shop_id: 'shop1', status: 'available' },

  // shop2 — 1/4 YELLOW
  { chair_id: 'c2_1', shop_id: 'shop2', status: 'occupied' },
  { chair_id: 'c2_2', shop_id: 'shop2', status: 'available' },
  { chair_id: 'c2_3', shop_id: 'shop2', status: 'available' },
  { chair_id: 'c2_4', shop_id: 'shop2', status: 'available' },

  // shop3 — 2/6 YELLOW
  { chair_id: 'c3_1', shop_id: 'shop3', status: 'occupied' },
  { chair_id: 'c3_2', shop_id: 'shop3', status: 'occupied' },
  { chair_id: 'c3_3', shop_id: 'shop3', status: 'available' },
  { chair_id: 'c3_4', shop_id: 'shop3', status: 'available' },
  { chair_id: 'c3_5', shop_id: 'shop3', status: 'available' },
  { chair_id: 'c3_6', shop_id: 'shop3', status: 'available' },

  // shop4 — 5/6 RED
  { chair_id: 'c4_1', shop_id: 'shop4', status: 'occupied' },
  { chair_id: 'c4_2', shop_id: 'shop4', status: 'occupied' },
  { chair_id: 'c4_3', shop_id: 'shop4', status: 'occupied' },
  { chair_id: 'c4_4', shop_id: 'shop4', status: 'occupied' },
  { chair_id: 'c4_5', shop_id: 'shop4', status: 'occupied' },
  { chair_id: 'c4_6', shop_id: 'shop4', status: 'available' },

  // shop5 — 1/4 YELLOW + FAVOURITE
  { chair_id: 'c5_1', shop_id: 'shop5', status: 'occupied' },
  { chair_id: 'c5_2', shop_id: 'shop5', status: 'available' },
  { chair_id: 'c5_3', shop_id: 'shop5', status: 'available' },
  { chair_id: 'c5_4', shop_id: 'shop5', status: 'available' },

  // shop6 — 0/2 GREEN
  { chair_id: 'c6_1', shop_id: 'shop6', status: 'available' },
  { chair_id: 'c6_2', shop_id: 'shop6', status: 'available' },

  // shop7 — 3/5 YELLOW
  { chair_id: 'c7_1', shop_id: 'shop7', status: 'occupied' },
  { chair_id: 'c7_2', shop_id: 'shop7', status: 'occupied' },
  { chair_id: 'c7_3', shop_id: 'shop7', status: 'occupied' },
  { chair_id: 'c7_4', shop_id: 'shop7', status: 'available' },
  { chair_id: 'c7_5', shop_id: 'shop7', status: 'available' },

  // shop8 — 4/4 RED
  { chair_id: 'c8_1', shop_id: 'shop8', status: 'occupied' },
  { chair_id: 'c8_2', shop_id: 'shop8', status: 'occupied' },
  { chair_id: 'c8_3', shop_id: 'shop8', status: 'occupied' },
  { chair_id: 'c8_4', shop_id: 'shop8', status: 'occupied' },

  // shop9 — 1/3 YELLOW
  { chair_id: 'c9_1', shop_id: 'shop9', status: 'occupied' },
  { chair_id: 'c9_2', shop_id: 'shop9', status: 'available' },
  { chair_id: 'c9_3', shop_id: 'shop9', status: 'available' },

  // shop10 — 0/6 GREEN
  { chair_id: 'c10_1', shop_id: 'shop10', status: 'available' },
  { chair_id: 'c10_2', shop_id: 'shop10', status: 'available' },
  { chair_id: 'c10_3', shop_id: 'shop10', status: 'available' },
  { chair_id: 'c10_4', shop_id: 'shop10', status: 'available' },
  { chair_id: 'c10_5', shop_id: 'shop10', status: 'available' },
  { chair_id: 'c10_6', shop_id: 'shop10', status: 'available' },

  // shop11 — 2/4 YELLOW
  { chair_id: 'c11_1', shop_id: 'shop11', status: 'occupied' },
  { chair_id: 'c11_2', shop_id: 'shop11', status: 'occupied' },
  { chair_id: 'c11_3', shop_id: 'shop11', status: 'available' },
  { chair_id: 'c11_4', shop_id: 'shop11', status: 'available' },

  // shop12 — 1/5 GREEN
  { chair_id: 'c12_1', shop_id: 'shop12', status: 'occupied' },
  { chair_id: 'c12_2', shop_id: 'shop12', status: 'available' },
  { chair_id: 'c12_3', shop_id: 'shop12', status: 'available' },
  { chair_id: 'c12_4', shop_id: 'shop12', status: 'available' },
  { chair_id: 'c12_5', shop_id: 'shop12', status: 'available' },

  // shop13 — 3/4 RED
  { chair_id: 'c13_1', shop_id: 'shop13', status: 'occupied' },
  { chair_id: 'c13_2', shop_id: 'shop13', status: 'occupied' },
  { chair_id: 'c13_3', shop_id: 'shop13', status: 'occupied' },
  { chair_id: 'c13_4', shop_id: 'shop13', status: 'available' },

  // shop14 — 0/3 GREEN
  { chair_id: 'c14_1', shop_id: 'shop14', status: 'available' },
  { chair_id: 'c14_2', shop_id: 'shop14', status: 'available' },
  { chair_id: 'c14_3', shop_id: 'shop14', status: 'available' },

  // shop15 — 2/5 YELLOW
  { chair_id: 'c15_1', shop_id: 'shop15', status: 'occupied' },
  { chair_id: 'c15_2', shop_id: 'shop15', status: 'occupied' },
  { chair_id: 'c15_3', shop_id: 'shop15', status: 'available' },
  { chair_id: 'c15_4', shop_id: 'shop15', status: 'available' },
  { chair_id: 'c15_5', shop_id: 'shop15', status: 'available' },

  // shop16 — 4/6 YELLOW
  { chair_id: 'c16_1', shop_id: 'shop16', status: 'occupied' },
  { chair_id: 'c16_2', shop_id: 'shop16', status: 'occupied' },
  { chair_id: 'c16_3', shop_id: 'shop16', status: 'occupied' },
  { chair_id: 'c16_4', shop_id: 'shop16', status: 'occupied' },
  { chair_id: 'c16_5', shop_id: 'shop16', status: 'available' },
  { chair_id: 'c16_6', shop_id: 'shop16', status: 'available' },

  // shop17 — 1/2 YELLOW
  { chair_id: 'c17_1', shop_id: 'shop17', status: 'occupied' },
  { chair_id: 'c17_2', shop_id: 'shop17', status: 'available' },

  // shop18 — 0/5 GREEN
  { chair_id: 'c18_1', shop_id: 'shop18', status: 'available' },
  { chair_id: 'c18_2', shop_id: 'shop18', status: 'available' },
  { chair_id: 'c18_3', shop_id: 'shop18', status: 'available' },
  { chair_id: 'c18_4', shop_id: 'shop18', status: 'available' },
  { chair_id: 'c18_5', shop_id: 'shop18', status: 'available' },
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

export const mockReviews: Review[] = [
  {
    review_id: 'r1',
    shop_id: 'shop1',
    user_name: 'Alex Rivera',
    user_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    date: '2 days ago',
    comment: 'Best haircut I have had in San Francisco! Marcus is a master of fades and the free espresso was top notch.'
  },
  {
    review_id: 'r2',
    shop_id: 'shop1',
    user_name: 'David Kim',
    user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    date: '1 week ago',
    comment: 'Super clean shop, great vintage leather chairs, and very friendly barbers. Highly recommended!'
  },
  {
    review_id: 'r3',
    shop_id: 'shop2',
    user_name: 'Brandon Taylor',
    user_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    rating: 4,
    date: '3 days ago',
    comment: 'Jaxson Reed gave me a crisp skin fade. Atmosphere is high energy and modern.'
  },
  {
    review_id: 'r4',
    shop_id: 'shop3',
    user_name: 'Michael Vance',
    user_avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    date: '5 days ago',
    comment: 'The executive hot towel shave is legendary. Ethan is a true craftsman!'
  }
];
