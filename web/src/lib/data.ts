/**
 * data.ts — Central data layer for Prompt.
 *
 * Contains all TypeScript interfaces, mock provider data, category definitions,
 * static color tokens (T), and mock notification/waitlist data used across the app.
 *
 * In a production app this would be replaced by API calls. For the POC everything
 * lives here so all screens share a single source of truth.
 */

// ── Interfaces ────────────────────────────────────────────────────────────────

/** A service category (Hair, Repair, Wellness, etc.) */
export interface Group {
  id: string
  icon: string
  label: string
  color: string  // Hex used for pins, chips, and accent highlights
}

/** A bookable service provider on the map */
export interface Provider {
  id: number
  cat: string     // Matches a Group.id
  name: string
  lat: number     // Halifax peninsula — verified land coordinates
  lng: number
  rating: number
  reviews: number
  price: number   // 0 = free (dining, doctor)
  dur: string     // Human-readable duration e.g. "45 min"
  slots: string[] // Available time slots today, e.g. ["9 AM", "2 PM"]
  addr: string
  badge: string | null  // "Top Rated" | "Open Now" | "New" | "Fast" | "Hot" | null
}

/** A confirmed booking made by the customer */
export interface Booking {
  id: number
  provider: Provider
  slot: string   // Time slot that was booked
  color: string  // Copied from the provider's category color
  icon: string   // Copied from the provider's category icon
}

/** An entry on the customer's waitlist for a fully-booked provider */
export interface WaitlistEntry {
  id: number      // Same as provider.id — used for deduplication
  provider: Provider
  hour: string    // Time slot the customer wants
  color: string
  icon: string
}

/** An in-app notification shown in the notifications drawer */
export interface Notification {
  id: number
  type: 'booking_confirmed' | 'waitlist_opened' | 'provider_accepted'
  message: string
  time: string    // Human-readable relative time e.g. "2 min ago"
  read: boolean
}

// ── Categories ────────────────────────────────────────────────────────────────

export const GROUPS: Group[] = [
  { id: 'hair',     icon: '✂️',  label: 'Hair',     color: '#FF5C00' },
  { id: 'repair',   icon: '🔧',  label: 'Repair',   color: '#0066FF' },
  { id: 'beauty',   icon: '💅',  label: 'Beauty',   color: '#D4006E' },
  { id: 'wellness', icon: '💆',  label: 'Wellness', color: '#00855A' },
  { id: 'dining',   icon: '🍽️', label: 'Dining',   color: '#7C3AED' },
  { id: 'outdoor',  icon: '🌿',  label: 'Outdoor',  color: '#1A7A1A' },
  { id: 'stay',     icon: '🏠',  label: 'Stay',     color: '#C47300' },
  { id: 'doctor',   icon: '🩺',  label: 'Doctor',   color: '#CC2200' },
]

// ── Time slots ────────────────────────────────────────────────────────────────

/** Operating hours shown in the TimeWheel (9 AM – 8 PM) */
export const HOURS: string[] = [
  '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM',
  '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM',
]

// ── Providers ─────────────────────────────────────────────────────────────────
//
// 25 mock providers placed at verified Halifax peninsula land coordinates.
// Key geography: harbour is on the EAST side — lng > ~-63.572 at downtown
// latitudes puts you in the water. All coordinates below are on solid ground.

export const PROVIDERS: Provider[] = [
  // ── Hair ────────────────────────────────────────────────────────────────────
  { id: 1,  cat: 'hair',     name: 'Stylish Cuts',       lat: 44.6474, lng: -63.5734, rating: 4.8, reviews: 124, price: 35,  dur: '45 min',  slots: ['9 AM', '11 AM', '2 PM', '4 PM'],         addr: '1505 Barrington St',  badge: 'Top Rated' },
  { id: 2,  cat: 'hair',     name: 'The Barber Co.',      lat: 44.6434, lng: -63.5822, rating: 4.7, reviews: 201, price: 25,  dur: '30 min',  slots: ['10 AM', '1 PM', '5 PM', '6 PM'],         addr: '5476 Spring Garden Rd', badge: null },
  { id: 3,  cat: 'hair',     name: 'Gloss Studio',        lat: 44.6467, lng: -63.5943, rating: 4.9, reviews: 88,  price: 55,  dur: '60 min',  slots: ['9 AM', '3 PM', '5 PM'],                  addr: '2182 Quinpool Rd',    badge: 'New' },
  { id: 18, cat: 'hair',     name: 'Fade & Co.',          lat: 44.6565, lng: -63.5837, rating: 4.6, reviews: 93,  price: 30,  dur: '30 min',  slots: ['9 AM', '10 AM', '12 PM', '3 PM'],        addr: '2180 Gottingen St',   badge: null },
  // ── Repair ──────────────────────────────────────────────────────────────────
  { id: 4,  cat: 'repair',   name: 'FixIt Fast',          lat: 44.6471, lng: -63.6058, rating: 4.5, reviews: 78,  price: 60,  dur: '45 min',  slots: ['10 AM', '12 PM', '3 PM', '5 PM'],        addr: '300 Mumford Rd',      badge: null },
  { id: 5,  cat: 'repair',   name: 'TechFix HFX',         lat: 44.6402, lng: -63.5877, rating: 4.6, reviews: 61,  price: 75,  dur: '60 min',  slots: ['9 AM', '2 PM', '4 PM'],                  addr: '6155 Coburg Rd',      badge: 'Fast' },
  { id: 6,  cat: 'repair',   name: 'Cycle Works',         lat: 44.6456, lng: -63.5989, rating: 4.4, reviews: 44,  price: 45,  dur: '60 min',  slots: ['11 AM', '1 PM', '3 PM'],                 addr: '12 Windsor St',       badge: null },
  { id: 22, cat: 'repair',   name: 'Phone Rescue HFX',    lat: 44.6502, lng: -63.5903, rating: 4.5, reviews: 130, price: 50,  dur: '30 min',  slots: ['10 AM', '12 PM', '2 PM', '4 PM', '6 PM'], addr: '3600 Kempt Rd',      badge: 'Fast' },
  // ── Beauty ──────────────────────────────────────────────────────────────────
  { id: 7,  cat: 'beauty',   name: 'Luxe Nails',          lat: 44.6447, lng: -63.6012, rating: 4.7, reviews: 145, price: 50,  dur: '75 min',  slots: ['9 AM', '11 AM', '1 PM', '4 PM'],         addr: '7001 Bayers Rd',      badge: null },
  { id: 8,  cat: 'beauty',   name: 'Glow Bar',            lat: 44.6388, lng: -63.5858, rating: 4.8, reviews: 203, price: 40,  dur: '50 min',  slots: ['10 AM', '2 PM', '5 PM'],                 addr: '5544 Clyde St',       badge: 'Top Rated' },
  { id: 19, cat: 'beauty',   name: 'Skin Studio HFX',     lat: 44.6449, lng: -63.5802, rating: 4.8, reviews: 61,  price: 70,  dur: '60 min',  slots: ['10 AM', '1 PM', '4 PM'],                 addr: '1660 Hollis St',      badge: 'New' },
  // ── Wellness ────────────────────────────────────────────────────────────────
  { id: 9,  cat: 'wellness', name: 'Zen Spa HFX',         lat: 44.6488, lng: -63.5871, rating: 4.9, reviews: 167, price: 80,  dur: '60 min',  slots: ['9 AM', '11 AM', '2 PM', '4 PM', '6 PM'], addr: '5657 North St',       badge: 'Top Rated' },
  { id: 10, cat: 'wellness', name: 'Restore Body',        lat: 44.6535, lng: -63.5960, rating: 4.6, reviews: 92,  price: 65,  dur: '45 min',  slots: ['10 AM', '3 PM', '5 PM'],                 addr: '3060 Robie St',       badge: null },
  { id: 20, cat: 'wellness', name: 'Float Tank HFX',      lat: 44.6523, lng: -63.5899, rating: 4.7, reviews: 44,  price: 90,  dur: '90 min',  slots: ['9 AM', '11 AM', '2 PM'],                 addr: '2742 Agricola St',    badge: null },
  // ── Dining ──────────────────────────────────────────────────────────────────
  { id: 11, cat: 'dining',   name: 'Café Maison',         lat: 44.6444, lng: -63.5836, rating: 4.5, reviews: 312, price: 0,   dur: '60 min',  slots: ['11 AM', '12 PM', '1 PM', '6 PM', '8 PM'], addr: '1569 Dresden Row',   badge: null },
  { id: 12, cat: 'dining',   name: 'Bistro Nord',         lat: 44.6456, lng: -63.5730, rating: 4.3, reviews: 289, price: 0,   dur: '90 min',  slots: ['12 PM', '7 PM', '8 PM'],                 addr: '1477 Lower Water St', badge: 'Hot' },
  { id: 21, cat: 'dining',   name: 'The Canteen',         lat: 44.6484, lng: -63.5748, rating: 4.6, reviews: 411, price: 0,   dur: '45 min',  slots: ['11 AM', '12 PM', '1 PM', '5 PM', '7 PM'], addr: '1256 Barrington St',  badge: 'Hot' },
  // ── Outdoor ─────────────────────────────────────────────────────────────────
  { id: 13, cat: 'outdoor',  name: 'Kayak HFX',           lat: 44.6374, lng: -63.5806, rating: 4.7, reviews: 55,  price: 55,  dur: '2 hrs',   slots: ['9 AM', '11 AM', '2 PM'],                 addr: 'Point Pleasant Dr',   badge: null },
  { id: 14, cat: 'outdoor',  name: 'Trail Guide Co.',     lat: 44.6299, lng: -63.5757, rating: 4.8, reviews: 40,  price: 40,  dur: '3 hrs',   slots: ['9 AM', '1 PM'],                          addr: 'Point Pleasant Park', badge: 'New' },
  { id: 23, cat: 'outdoor',  name: 'Harbour Sail Co.',    lat: 44.6463, lng: -63.5720, rating: 4.9, reviews: 28,  price: 75,  dur: '3 hrs',   slots: ['9 AM', '1 PM'],                          addr: 'Halifax Waterfront',  badge: 'New' },
  // ── Stay ────────────────────────────────────────────────────────────────────
  { id: 15, cat: 'stay',     name: 'Halliday B&B',        lat: 44.6460, lng: -63.5793, rating: 4.8, reviews: 56,  price: 120, dur: '1 night', slots: ['3 PM'],                                  addr: '5184 Morris St',      badge: null },
  { id: 24, cat: 'stay',     name: 'The Garrison Inn',    lat: 44.6491, lng: -63.5780, rating: 4.6, reviews: 102, price: 145, dur: '1 night', slots: ['3 PM', '4 PM'],                          addr: '1725 Market St',      badge: null },
  // ── Doctor ──────────────────────────────────────────────────────────────────
  { id: 16, cat: 'doctor',   name: 'Walk-In Clinic HFX',  lat: 44.6478, lng: -63.6139, rating: 4.4, reviews: 189, price: 0,   dur: '20 min',  slots: ['9 AM', '10 AM', '11 AM', '2 PM', '4 PM'], addr: '7071 Bayers Rd',     badge: 'Open Now' },
  { id: 17, cat: 'doctor',   name: 'Dr. Patel Family',    lat: 44.6422, lng: -63.5901, rating: 4.9, reviews: 78,  price: 0,   dur: '30 min',  slots: ['9 AM', '1 PM', '3 PM'],                  addr: '6389 Coburg Rd',      badge: null },
  { id: 25, cat: 'doctor',   name: 'Harbour Dental',      lat: 44.6543, lng: -63.5869, rating: 4.7, reviews: 55,  price: 0,   dur: '45 min',  slots: ['9 AM', '11 AM', '2 PM'],                 addr: '1545 Birmingham St',  badge: 'Open Now' },
]

// ── Static dark tokens (T) ────────────────────────────────────────────────────
//
// T is used for elements that are ALWAYS dark regardless of theme — navbars,
// overlays, auth screens. For theme-aware elements use useTheme() → tk instead.

export const T = {
  ink:    '#0D0D0D',  // Near-black — nav backgrounds
  soft:   '#1A1A1A',  // Slightly lifted dark — hover states
  smoke:  '#F5F3EF',  // Off-white — light backgrounds
  paper:  '#FAFAF8',  // Near-white — light card backgrounds
  line:   '#E8E8E8',  // Light border/divider
  muted:  '#888',     // Secondary text
  accent: '#FF5C00',  // Brand orange
  green:  '#00B87C',  // Confirmation / available / success
  white:  '#fff',
} as const

// ── Mock notifications ────────────────────────────────────────────────────────

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 1, type: 'booking_confirmed',  message: 'Stylish Cuts confirmed your 11 AM booking',            time: '2 min ago',  read: false },
  { id: 2, type: 'waitlist_opened',    message: 'A spot opened at Zen Spa HFX for 2 PM — book now!',    time: '15 min ago', read: false },
  { id: 3, type: 'provider_accepted',  message: 'The Barber Co. accepted your 1 PM request',            time: '1 hr ago',   read: true  },
  { id: 4, type: 'booking_confirmed',  message: 'Walk-In Clinic HFX confirmed your 10 AM slot',         time: '3 hrs ago',  read: true  },
  { id: 5, type: 'waitlist_opened',    message: 'Glow Bar has a new 4 PM opening today',                time: 'Yesterday',  read: true  },
]
