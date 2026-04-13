/**
 * data.ts — Central data layer for PROMPT mobile.
 *
 * Contains all TypeScript interfaces, mock provider data,
 * category groups with distinct colours, time-slot constants,
 * and notification mocks. Platform-agnostic — shared between
 * web and mobile.
 *
 * Provider coverage: Halifax (25), Dartmouth (6), Bedford (5),
 * Tantallon (4) — 40 providers total across HRM.
 */

export interface Group {
  id: string
  icon: string
  label: string
  color: string
}

export interface Provider {
  id: number
  cat: string
  name: string
  lat: number
  lng: number
  rating: number
  reviews: number
  price: number
  dur: string
  slots: string[]
  addr: string
  badge: string | null
}

export interface Booking {
  id: number
  provider: Provider
  slot: string
  color: string
  icon: string
}

export interface WaitlistEntry {
  id: number
  provider: Provider
  hour: string
  color: string
  icon: string
}

export interface Notification {
  id: number
  type: 'booking_confirmed' | 'waitlist_opened' | 'provider_accepted'
  message: string
  time: string
  read: boolean
}

export const GROUPS: Group[] = [
  { id: 'hair',     icon: 'scissors',  label: 'Hair',     color: '#FF5C00' },
  { id: 'repair',   icon: 'tool',      label: 'Repair',   color: '#3B82F6' },
  { id: 'beauty',   icon: 'heart',     label: 'Beauty',   color: '#EC4899' },
  { id: 'wellness', icon: 'smile',     label: 'Wellness', color: '#8B5CF6' },
  { id: 'dining',   icon: 'coffee',    label: 'Dining',   color: '#F59E0B' },
  { id: 'outdoor',  icon: 'sun',       label: 'Outdoor',  color: '#10B981' },
  { id: 'stay',     icon: 'home',      label: 'Stay',     color: '#06B6D4' },
  { id: 'doctor',   icon: 'activity',  label: 'Doctor',   color: '#EF4444' },
]

export const HOURS: string[] = [
  '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM',
  '3 PM', '4 PM', '5 PM', '6 PM', '8 PM',
]

export const PROVIDERS: Provider[] = [
  // ── Halifax ──
  { id: 1,  cat: 'hair',     name: 'Stylish Cuts',       lat: 44.6474, lng: -63.5734, rating: 4.8, reviews: 124, price: 35,  dur: '45 min',  slots: ['9 AM', '11 AM', '2 PM', '4 PM'],         addr: '1505 Barrington St, Halifax',  badge: 'Top Rated' },
  { id: 2,  cat: 'hair',     name: 'The Barber Co.',      lat: 44.6434, lng: -63.5822, rating: 4.7, reviews: 201, price: 25,  dur: '30 min',  slots: ['10 AM', '1 PM', '5 PM', '6 PM'],         addr: '5476 Spring Garden Rd, Halifax', badge: null },
  { id: 3,  cat: 'hair',     name: 'Gloss Studio',        lat: 44.6467, lng: -63.5943, rating: 4.9, reviews: 88,  price: 55,  dur: '60 min',  slots: ['9 AM', '3 PM', '5 PM'],                  addr: '2182 Quinpool Rd, Halifax',    badge: 'New' },
  { id: 18, cat: 'hair',     name: 'Fade & Co.',          lat: 44.6565, lng: -63.5837, rating: 4.6, reviews: 93,  price: 30,  dur: '30 min',  slots: ['9 AM', '10 AM', '12 PM', '3 PM'],        addr: '2180 Gottingen St, Halifax',   badge: null },
  { id: 4,  cat: 'repair',   name: 'FixIt Fast',          lat: 44.6471, lng: -63.6058, rating: 4.5, reviews: 78,  price: 60,  dur: '45 min',  slots: ['10 AM', '12 PM', '3 PM', '5 PM'],        addr: '300 Mumford Rd, Halifax',      badge: null },
  { id: 5,  cat: 'repair',   name: 'TechFix HFX',         lat: 44.6402, lng: -63.5877, rating: 4.6, reviews: 61,  price: 75,  dur: '60 min',  slots: ['9 AM', '2 PM', '4 PM'],                  addr: '6155 Coburg Rd, Halifax',      badge: 'Fast' },
  { id: 6,  cat: 'repair',   name: 'Cycle Works',         lat: 44.6456, lng: -63.5989, rating: 4.4, reviews: 44,  price: 45,  dur: '60 min',  slots: ['11 AM', '1 PM', '3 PM'],                 addr: '12 Windsor St, Halifax',       badge: null },
  { id: 22, cat: 'repair',   name: 'Phone Rescue HFX',    lat: 44.6502, lng: -63.5903, rating: 4.5, reviews: 130, price: 50,  dur: '30 min',  slots: ['10 AM', '12 PM', '2 PM', '4 PM', '6 PM'], addr: '3600 Kempt Rd, Halifax',      badge: 'Fast' },
  { id: 7,  cat: 'beauty',   name: 'Luxe Nails',          lat: 44.6447, lng: -63.6012, rating: 4.7, reviews: 145, price: 50,  dur: '75 min',  slots: ['9 AM', '11 AM', '1 PM', '4 PM'],         addr: '7001 Bayers Rd, Halifax',      badge: null },
  { id: 8,  cat: 'beauty',   name: 'Glow Bar',            lat: 44.6388, lng: -63.5858, rating: 4.8, reviews: 203, price: 40,  dur: '50 min',  slots: ['10 AM', '2 PM', '5 PM'],                 addr: '5544 Clyde St, Halifax',       badge: 'Top Rated' },
  { id: 19, cat: 'beauty',   name: 'Skin Studio HFX',     lat: 44.6449, lng: -63.5802, rating: 4.8, reviews: 61,  price: 70,  dur: '60 min',  slots: ['10 AM', '1 PM', '4 PM'],                 addr: '1660 Hollis St, Halifax',      badge: 'New' },
  { id: 9,  cat: 'wellness', name: 'Zen Spa HFX',         lat: 44.6488, lng: -63.5871, rating: 4.9, reviews: 167, price: 80,  dur: '60 min',  slots: ['9 AM', '11 AM', '2 PM', '4 PM', '6 PM'], addr: '5657 North St, Halifax',       badge: 'Top Rated' },
  { id: 10, cat: 'wellness', name: 'Restore Body',        lat: 44.6535, lng: -63.5960, rating: 4.6, reviews: 92,  price: 65,  dur: '45 min',  slots: ['10 AM', '3 PM', '5 PM'],                 addr: '3060 Robie St, Halifax',       badge: null },
  { id: 20, cat: 'wellness', name: 'Float Tank HFX',      lat: 44.6523, lng: -63.5899, rating: 4.7, reviews: 44,  price: 90,  dur: '90 min',  slots: ['9 AM', '11 AM', '2 PM'],                 addr: '2742 Agricola St, Halifax',    badge: null },
  { id: 11, cat: 'dining',   name: 'Café Maison',         lat: 44.6444, lng: -63.5836, rating: 4.5, reviews: 312, price: 0,   dur: '60 min',  slots: ['11 AM', '12 PM', '1 PM', '6 PM', '8 PM'], addr: '1569 Dresden Row, Halifax',   badge: null },
  { id: 12, cat: 'dining',   name: 'Bistro Nord',         lat: 44.6456, lng: -63.5730, rating: 4.3, reviews: 289, price: 0,   dur: '90 min',  slots: ['12 PM', '8 PM'],                         addr: '1477 Lower Water St, Halifax', badge: 'Hot' },
  { id: 21, cat: 'dining',   name: 'The Canteen',         lat: 44.6484, lng: -63.5748, rating: 4.6, reviews: 411, price: 0,   dur: '45 min',  slots: ['11 AM', '12 PM', '1 PM', '5 PM'],        addr: '1256 Barrington St, Halifax',  badge: 'Hot' },
  { id: 13, cat: 'outdoor',  name: 'Kayak HFX',           lat: 44.6374, lng: -63.5806, rating: 4.7, reviews: 55,  price: 55,  dur: '2 hrs',   slots: ['9 AM', '11 AM', '2 PM'],                 addr: 'Point Pleasant Dr, Halifax',   badge: null },
  { id: 14, cat: 'outdoor',  name: 'Trail Guide Co.',     lat: 44.6299, lng: -63.5757, rating: 4.8, reviews: 40,  price: 40,  dur: '3 hrs',   slots: ['9 AM', '1 PM'],                          addr: 'Point Pleasant Park, Halifax', badge: 'New' },
  { id: 23, cat: 'outdoor',  name: 'Harbour Sail Co.',    lat: 44.6463, lng: -63.5720, rating: 4.9, reviews: 28,  price: 75,  dur: '3 hrs',   slots: ['9 AM', '1 PM'],                          addr: 'Halifax Waterfront',           badge: 'New' },
  { id: 15, cat: 'stay',     name: 'Halliday B&B',        lat: 44.6460, lng: -63.5793, rating: 4.8, reviews: 56,  price: 120, dur: '1 night', slots: ['3 PM'],                                  addr: '5184 Morris St, Halifax',      badge: null },
  { id: 24, cat: 'stay',     name: 'The Garrison Inn',    lat: 44.6491, lng: -63.5780, rating: 4.6, reviews: 102, price: 145, dur: '1 night', slots: ['3 PM', '4 PM'],                          addr: '1725 Market St, Halifax',      badge: null },
  { id: 16, cat: 'doctor',   name: 'Walk-In Clinic HFX',  lat: 44.6478, lng: -63.6139, rating: 4.4, reviews: 189, price: 0,   dur: '20 min',  slots: ['9 AM', '10 AM', '11 AM', '2 PM', '4 PM'], addr: '7071 Bayers Rd, Halifax',     badge: 'Open Now' },
  { id: 17, cat: 'doctor',   name: 'Dr. Patel Family',    lat: 44.6422, lng: -63.5901, rating: 4.9, reviews: 78,  price: 0,   dur: '30 min',  slots: ['9 AM', '1 PM', '3 PM'],                  addr: '6389 Coburg Rd, Halifax',      badge: null },
  { id: 25, cat: 'doctor',   name: 'Harbour Dental',      lat: 44.6543, lng: -63.5869, rating: 4.7, reviews: 55,  price: 0,   dur: '45 min',  slots: ['9 AM', '11 AM', '2 PM'],                 addr: '1545 Birmingham St, Halifax',  badge: 'Open Now' },

  // ── Dartmouth ──
  { id: 26, cat: 'hair',     name: 'Dartmouth Cuts',      lat: 44.6713, lng: -63.5619, rating: 4.6, reviews: 67,  price: 28,  dur: '30 min',  slots: ['9 AM', '11 AM', '1 PM', '4 PM'],         addr: '118 Portland St, Dartmouth',   badge: null },
  { id: 27, cat: 'beauty',   name: 'Harbour Glow Spa',    lat: 44.6659, lng: -63.5661, rating: 4.8, reviews: 92,  price: 60,  dur: '60 min',  slots: ['10 AM', '12 PM', '3 PM', '5 PM'],        addr: '46 Ochterloney St, Dartmouth', badge: 'New' },
  { id: 28, cat: 'dining',   name: 'Two If By Sea',       lat: 44.6643, lng: -63.5709, rating: 4.9, reviews: 520, price: 0,   dur: '45 min',  slots: ['9 AM', '10 AM', '11 AM', '12 PM', '2 PM'], addr: '66 Ochterloney St, Dartmouth', badge: 'Top Rated' },
  { id: 29, cat: 'repair',   name: 'Dartmouth Tech Fix',  lat: 44.6724, lng: -63.5584, rating: 4.4, reviews: 38,  price: 55,  dur: '45 min',  slots: ['10 AM', '1 PM', '3 PM'],                 addr: '60 Tacoma Dr, Dartmouth',      badge: null },
  { id: 30, cat: 'wellness', name: 'Calm Waters Yoga',    lat: 44.6681, lng: -63.5630, rating: 4.7, reviews: 73,  price: 25,  dur: '60 min',  slots: ['9 AM', '11 AM', '4 PM', '6 PM'],         addr: '15 King St, Dartmouth',        badge: null },
  { id: 31, cat: 'outdoor',  name: 'Banook Paddle Co.',   lat: 44.6600, lng: -63.5550, rating: 4.8, reviews: 31,  price: 45,  dur: '2 hrs',   slots: ['9 AM', '11 AM', '2 PM'],                 addr: 'Banook Lake, Dartmouth',       badge: 'New' },

  // ── Bedford ──
  { id: 32, cat: 'hair',     name: 'Bedford Barbers',     lat: 44.7325, lng: -63.6570, rating: 4.5, reviews: 112, price: 30,  dur: '30 min',  slots: ['9 AM', '10 AM', '12 PM', '2 PM', '4 PM'], addr: '1475 Bedford Hwy, Bedford',   badge: null },
  { id: 33, cat: 'beauty',   name: 'The Nail Room',       lat: 44.7291, lng: -63.6612, rating: 4.7, reviews: 84,  price: 45,  dur: '60 min',  slots: ['10 AM', '1 PM', '3 PM', '5 PM'],         addr: '1595 Bedford Hwy, Bedford',   badge: null },
  { id: 34, cat: 'doctor',   name: 'Bedford Walk-In',     lat: 44.7360, lng: -63.6530, rating: 4.3, reviews: 210, price: 0,   dur: '20 min',  slots: ['9 AM', '10 AM', '11 AM', '2 PM', '4 PM'], addr: '1090 Bedford Hwy, Bedford',  badge: 'Open Now' },
  { id: 35, cat: 'dining',   name: 'The Esquire',         lat: 44.7340, lng: -63.6555, rating: 4.5, reviews: 178, price: 0,   dur: '60 min',  slots: ['11 AM', '12 PM', '1 PM', '5 PM', '6 PM'], addr: '1535 Bedford Hwy, Bedford',  badge: null },
  { id: 36, cat: 'wellness', name: 'Bedford Massage Co.', lat: 44.7310, lng: -63.6590, rating: 4.8, reviews: 56,  price: 85,  dur: '60 min',  slots: ['9 AM', '11 AM', '2 PM', '4 PM'],         addr: '1660 Bedford Hwy, Bedford',   badge: null },

  // ── Tantallon ──
  { id: 37, cat: 'hair',     name: 'Coastal Cuts',        lat: 44.6545, lng: -63.7445, rating: 4.6, reviews: 45,  price: 32,  dur: '35 min',  slots: ['9 AM', '11 AM', '2 PM'],                 addr: '5178 St Margarets Bay Rd, Tantallon', badge: null },
  { id: 38, cat: 'repair',   name: 'Bay Road Auto',       lat: 44.6560, lng: -63.7490, rating: 4.4, reviews: 62,  price: 80,  dur: '60 min',  slots: ['9 AM', '10 AM', '1 PM', '3 PM'],         addr: '5230 St Margarets Bay Rd, Tantallon', badge: null },
  { id: 39, cat: 'dining',   name: 'Tantallon Bistro',    lat: 44.6530, lng: -63.7425, rating: 4.5, reviews: 97,  price: 0,   dur: '60 min',  slots: ['11 AM', '12 PM', '5 PM', '6 PM'],        addr: '5120 St Margarets Bay Rd, Tantallon', badge: null },
  { id: 40, cat: 'outdoor',  name: 'Bay Kayak Adventures', lat: 44.6480, lng: -63.7380, rating: 4.9, reviews: 22, price: 65,  dur: '3 hrs',   slots: ['9 AM', '1 PM'],                          addr: 'St Margarets Bay, Tantallon', badge: 'New' },
]

export const T = {
  ink:    '#0D0D0D',
  soft:   '#1A1A1A',
  smoke:  '#F5F3EF',
  paper:  '#FAFAF8',
  line:   '#E8E8E8',
  muted:  '#888',
  accent: '#FF5C00',
  green:  '#00B87C',
  white:  '#fff',
} as const

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 1, type: 'booking_confirmed',  message: 'Stylish Cuts confirmed your 11 AM booking',            time: '2 min ago',  read: false },
  { id: 2, type: 'waitlist_opened',    message: 'A spot opened at Zen Spa HFX for 2 PM — book now!',    time: '15 min ago', read: false },
  { id: 3, type: 'provider_accepted',  message: 'The Barber Co. accepted your 1 PM request',            time: '1 hr ago',   read: true  },
  { id: 4, type: 'booking_confirmed',  message: 'Walk-In Clinic HFX confirmed your 10 AM slot',         time: '3 hrs ago',  read: true  },
  { id: 5, type: 'waitlist_opened',    message: 'Glow Bar has a new 4 PM opening today',                time: 'Yesterday',  read: true  },
]

export interface PastBooking {
  id: number
  provider: Provider
  slot: string
  date: string
  category: string
  categoryColor: string
  categoryIcon: string
  status: 'completed' | 'cancelled'
}

export const MOCK_PAST_BOOKINGS: PastBooking[] = [
  { id: 101, provider: PROVIDERS[0],  slot: '11 AM', date: 'Apr 10, 2026', category: 'Hair',     categoryColor: '#FF5C00', categoryIcon: 'scissors', status: 'completed' },
  { id: 102, provider: PROVIDERS[5],  slot: '2 PM',  date: 'Apr 8, 2026',  category: 'Beauty',   categoryColor: '#EC4899', categoryIcon: 'heart',    status: 'completed' },
  { id: 103, provider: PROVIDERS[10], slot: '10 AM', date: 'Apr 6, 2026',  category: 'Dining',   categoryColor: '#F59E0B', categoryIcon: 'coffee',   status: 'completed' },
  { id: 104, provider: PROVIDERS[2],  slot: '3 PM',  date: 'Apr 4, 2026',  category: 'Hair',     categoryColor: '#FF5C00', categoryIcon: 'scissors', status: 'cancelled' },
  { id: 105, provider: PROVIDERS[15], slot: '1 PM',  date: 'Apr 2, 2026',  category: 'Wellness', categoryColor: '#8B5CF6', categoryIcon: 'smile',    status: 'completed' },
  { id: 106, provider: PROVIDERS[8],  slot: '4 PM',  date: 'Mar 30, 2026', category: 'Repair',   categoryColor: '#3B82F6', categoryIcon: 'tool',     status: 'completed' },
  { id: 107, provider: PROVIDERS[20], slot: '9 AM',  date: 'Mar 28, 2026', category: 'Outdoor',  categoryColor: '#10B981', categoryIcon: 'sun',      status: 'completed' },
  { id: 108, provider: PROVIDERS[12], slot: '5 PM',  date: 'Mar 25, 2026', category: 'Dining',   categoryColor: '#F59E0B', categoryIcon: 'coffee',   status: 'completed' },
]
