/**
 * data.ts — Central data layer for Prompt.
 *
 * Contains all TypeScript interfaces, mock provider data, category definitions,
 * static color tokens (T), and mock notification data used across the app.
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

/** An in-app notification shown in the notifications drawer */
export interface Notification {
  id: number
  type: 'booking_confirmed' | 'slot_opened' | 'provider_accepted'
  message: string
  time: string    // Human-readable relative time e.g. "2 min ago"
  read: boolean
}

// ── Categories ────────────────────────────────────────────────────────────────

export const GROUPS: Group[] = [
  { id: 'hair',     icon: '✂️',  label: 'Hair',     color: '#FF5C00' },
  { id: 'repair',   icon: '🔧',  label: 'Repair',   color: '#3B82F6' },
  { id: 'beauty',   icon: '💅',  label: 'Beauty',   color: '#EC4899' },
  { id: 'wellness', icon: '💆',  label: 'Wellness', color: '#8B5CF6' },
  { id: 'dining',   icon: '🍽️', label: 'Dining',   color: '#F59E0B' },
  { id: 'outdoor',  icon: '🌿',  label: 'Outdoor',  color: '#10B981' },
  { id: 'stay',     icon: '🏠',  label: 'Stay',     color: '#06B6D4' },
  { id: 'doctor',   icon: '🩺',  label: 'Doctor',   color: '#EF4444' },
]

// ── Time slots ────────────────────────────────────────────────────────────────

/** Operating hours shown in the TimeWheel (9 AM – 8 PM) */
export const HOURS: string[] = [
  '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM',
  '3 PM', '4 PM', '5 PM', '6 PM', '8 PM',
]

// ── Providers ─────────────────────────────────────────────────────────────────
//
// 40 mock providers placed at verified Halifax-region land coordinates.
// Coverage: Halifax (25), Dartmouth (6), Bedford (5), Tantallon (4),
// Westphal (5), Lower Sackville (5), Cole Harbour (5), Spryfield (4),
// Clayton Park (4), Eastern Passage (4), Hammonds Plains (4), Fall River (4).
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
  { id: 12, cat: 'dining',   name: 'Bistro Nord',         lat: 44.6456, lng: -63.5730, rating: 4.3, reviews: 289, price: 0,   dur: '90 min',  slots: ['12 PM', '8 PM'],                         addr: '1477 Lower Water St', badge: 'Hot' },
  { id: 21, cat: 'dining',   name: 'The Canteen',         lat: 44.6484, lng: -63.5748, rating: 4.6, reviews: 411, price: 0,   dur: '45 min',  slots: ['11 AM', '12 PM', '1 PM', '5 PM'],        addr: '1256 Barrington St',  badge: 'Hot' },
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

  // ── Dartmouth ───────────────────────────────────────────────────────────────
  { id: 26, cat: 'hair',     name: 'Dartmouth Cuts',      lat: 44.6713, lng: -63.5619, rating: 4.6, reviews: 67,  price: 28,  dur: '30 min',  slots: ['9 AM', '11 AM', '1 PM', '4 PM'],         addr: '118 Portland St, Dartmouth',   badge: null },
  { id: 27, cat: 'beauty',   name: 'Harbour Glow Spa',    lat: 44.6659, lng: -63.5661, rating: 4.8, reviews: 92,  price: 60,  dur: '60 min',  slots: ['10 AM', '12 PM', '3 PM', '5 PM'],        addr: '46 Ochterloney St, Dartmouth', badge: 'New' },
  { id: 28, cat: 'dining',   name: 'Two If By Sea',       lat: 44.6643, lng: -63.5709, rating: 4.9, reviews: 520, price: 0,   dur: '45 min',  slots: ['9 AM', '10 AM', '11 AM', '12 PM', '2 PM'], addr: '66 Ochterloney St, Dartmouth', badge: 'Top Rated' },
  { id: 29, cat: 'repair',   name: 'Dartmouth Tech Fix',  lat: 44.6724, lng: -63.5584, rating: 4.4, reviews: 38,  price: 55,  dur: '45 min',  slots: ['10 AM', '1 PM', '3 PM'],                 addr: '60 Tacoma Dr, Dartmouth',      badge: null },
  { id: 30, cat: 'wellness', name: 'Calm Waters Yoga',    lat: 44.6681, lng: -63.5630, rating: 4.7, reviews: 73,  price: 25,  dur: '60 min',  slots: ['9 AM', '11 AM', '4 PM', '6 PM'],         addr: '15 King St, Dartmouth',        badge: null },
  { id: 31, cat: 'outdoor',  name: 'Banook Paddle Co.',   lat: 44.6600, lng: -63.5550, rating: 4.8, reviews: 31,  price: 45,  dur: '2 hrs',   slots: ['9 AM', '11 AM', '2 PM'],                 addr: 'Banook Lake, Dartmouth',       badge: 'New' },

  // ── Bedford ─────────────────────────────────────────────────────────────────
  { id: 32, cat: 'hair',     name: 'Bedford Barbers',     lat: 44.7325, lng: -63.6570, rating: 4.5, reviews: 112, price: 30,  dur: '30 min',  slots: ['9 AM', '10 AM', '12 PM', '2 PM', '4 PM'], addr: '1475 Bedford Hwy, Bedford',   badge: null },
  { id: 33, cat: 'beauty',   name: 'The Nail Room',       lat: 44.7291, lng: -63.6612, rating: 4.7, reviews: 84,  price: 45,  dur: '60 min',  slots: ['10 AM', '1 PM', '3 PM', '5 PM'],         addr: '1595 Bedford Hwy, Bedford',   badge: null },
  { id: 34, cat: 'doctor',   name: 'Bedford Walk-In',     lat: 44.7360, lng: -63.6530, rating: 4.3, reviews: 210, price: 0,   dur: '20 min',  slots: ['9 AM', '10 AM', '11 AM', '2 PM', '4 PM'], addr: '1090 Bedford Hwy, Bedford',  badge: 'Open Now' },
  { id: 35, cat: 'dining',   name: 'The Esquire',         lat: 44.7340, lng: -63.6555, rating: 4.5, reviews: 178, price: 0,   dur: '60 min',  slots: ['11 AM', '12 PM', '1 PM', '5 PM', '6 PM'], addr: '1535 Bedford Hwy, Bedford',  badge: null },
  { id: 36, cat: 'wellness', name: 'Bedford Massage Co.', lat: 44.7310, lng: -63.6590, rating: 4.8, reviews: 56,  price: 85,  dur: '60 min',  slots: ['9 AM', '11 AM', '2 PM', '4 PM'],         addr: '1660 Bedford Hwy, Bedford',   badge: null },

  // ── Tantallon ───────────────────────────────────────────────────────────────
  { id: 37, cat: 'hair',     name: 'Coastal Cuts',        lat: 44.6545, lng: -63.7445, rating: 4.6, reviews: 45,  price: 32,  dur: '35 min',  slots: ['9 AM', '11 AM', '2 PM'],                 addr: '5178 St Margarets Bay Rd',    badge: null },
  { id: 38, cat: 'repair',   name: 'Bay Road Auto',       lat: 44.6560, lng: -63.7490, rating: 4.4, reviews: 62,  price: 80,  dur: '60 min',  slots: ['9 AM', '10 AM', '1 PM', '3 PM'],         addr: '5230 St Margarets Bay Rd',    badge: null },
  { id: 39, cat: 'dining',   name: 'Tantallon Bistro',    lat: 44.6530, lng: -63.7425, rating: 4.5, reviews: 97,  price: 0,   dur: '60 min',  slots: ['11 AM', '12 PM', '5 PM', '6 PM'],        addr: '5120 St Margarets Bay Rd',    badge: null },
  { id: 40, cat: 'outdoor',  name: 'Bay Kayak Adventures', lat: 44.6480, lng: -63.7380, rating: 4.9, reviews: 22, price: 65,  dur: '3 hrs',   slots: ['9 AM', '1 PM'],                          addr: 'St Margarets Bay, Tantallon', badge: 'New' },

  // ── Westphal ────────────────────────────────────────────────────────────────
  { id: 41, cat: 'hair',     name: 'Westphal Barber Shop', lat: 44.6520, lng: -63.5220, rating: 4.5, reviews: 76,  price: 28,  dur: '30 min',  slots: ['9 AM', '10 AM', '12 PM', '3 PM', '5 PM'], addr: '55 Tacoma Dr, Westphal',      badge: null },
  { id: 42, cat: 'beauty',   name: 'Blossom Beauty',       lat: 44.6545, lng: -63.5185, rating: 4.7, reviews: 43,  price: 55,  dur: '60 min',  slots: ['10 AM', '1 PM', '4 PM'],                 addr: '120 Tacoma Dr, Westphal',     badge: 'New' },
  { id: 43, cat: 'repair',   name: 'Westphal Auto Care',   lat: 44.6490, lng: -63.5240, rating: 4.3, reviews: 98,  price: 70,  dur: '60 min',  slots: ['9 AM', '11 AM', '2 PM', '4 PM'],         addr: '33 Cole Harbour Rd, Westphal', badge: null },
  { id: 44, cat: 'dining',   name: 'Lakeside Grill',       lat: 44.6510, lng: -63.5160, rating: 4.6, reviews: 152, price: 0,   dur: '60 min',  slots: ['11 AM', '12 PM', '1 PM', '5 PM', '6 PM'], addr: '200 Montague Rd, Westphal',  badge: 'Hot' },
  { id: 45, cat: 'wellness', name: 'Serenity Massage',     lat: 44.6535, lng: -63.5205, rating: 4.8, reviews: 37,  price: 80,  dur: '60 min',  slots: ['9 AM', '11 AM', '2 PM', '4 PM'],         addr: '88 Tacoma Dr, Westphal',      badge: null },

  // ── Lower Sackville ─────────────────────────────────────────────────────────
  { id: 46, cat: 'hair',     name: 'Sackville Style Co.',  lat: 44.7605, lng: -63.6715, rating: 4.6, reviews: 89,  price: 30,  dur: '35 min',  slots: ['9 AM', '11 AM', '1 PM', '3 PM', '5 PM'], addr: '745 Sackville Dr, Lr Sackville', badge: null },
  { id: 47, cat: 'repair',   name: 'Sackville Tech Hub',   lat: 44.7580, lng: -63.6680, rating: 4.4, reviews: 57,  price: 55,  dur: '45 min',  slots: ['10 AM', '12 PM', '2 PM', '4 PM'],        addr: '680 Sackville Dr, Lr Sackville', badge: 'Fast' },
  { id: 48, cat: 'doctor',   name: 'Sackville Med Clinic', lat: 44.7620, lng: -63.6740, rating: 4.5, reviews: 245, price: 0,   dur: '20 min',  slots: ['9 AM', '10 AM', '11 AM', '2 PM', '4 PM'], addr: '810 Sackville Dr, Lr Sackville', badge: 'Open Now' },
  { id: 49, cat: 'dining',   name: 'The Sack Diner',       lat: 44.7590, lng: -63.6695, rating: 4.3, reviews: 134, price: 0,   dur: '45 min',  slots: ['11 AM', '12 PM', '1 PM', '5 PM', '8 PM'], addr: '720 Sackville Dr, Lr Sackville', badge: null },
  { id: 50, cat: 'beauty',   name: 'Glow Up Sackville',    lat: 44.7615, lng: -63.6725, rating: 4.7, reviews: 48,  price: 45,  dur: '50 min',  slots: ['10 AM', '1 PM', '3 PM', '5 PM'],         addr: '770 Sackville Dr, Lr Sackville', badge: 'New' },

  // ── Cole Harbour ────────────────────────────────────────────────────────────
  { id: 51, cat: 'hair',     name: 'Cole Harbour Cuts',     lat: 44.6540, lng: -63.4730, rating: 4.6, reviews: 85,  price: 30,  dur: '35 min',  slots: ['9 AM', '11 AM', '1 PM', '3 PM', '5 PM'], addr: '4 Forest Hills Dr, Cole Harbour',   badge: null },
  { id: 52, cat: 'dining',   name: 'Harbour House Café',    lat: 44.6575, lng: -63.4685, rating: 4.7, reviews: 198, price: 0,   dur: '45 min',  slots: ['10 AM', '11 AM', '12 PM', '1 PM', '5 PM'], addr: '10 Cole Harbour Rd, Cole Harbour', badge: 'Hot' },
  { id: 53, cat: 'wellness', name: 'Harmony Yoga Studio',   lat: 44.6555, lng: -63.4710, rating: 4.9, reviews: 62,  price: 30,  dur: '60 min',  slots: ['9 AM', '11 AM', '4 PM', '6 PM'],         addr: '50 Forest Hills Pkwy, Cole Harbour', badge: null },
  { id: 54, cat: 'repair',   name: 'Cole Harbour Auto',     lat: 44.6510, lng: -63.4760, rating: 4.3, reviews: 110, price: 65,  dur: '60 min',  slots: ['9 AM', '10 AM', '1 PM', '3 PM'],         addr: '85 Cole Harbour Rd, Cole Harbour',  badge: null },
  { id: 55, cat: 'doctor',   name: 'Cole Harbour Medical',  lat: 44.6560, lng: -63.4700, rating: 4.5, reviews: 320, price: 0,   dur: '20 min',  slots: ['9 AM', '10 AM', '11 AM', '2 PM', '4 PM'], addr: '30 Forest Hills Pkwy, Cole Harbour', badge: 'Open Now' },

  // ── Spryfield ───────────────────────────────────────────────────────────────
  { id: 56, cat: 'hair',     name: 'Spryfield Styles',      lat: 44.6170, lng: -63.6210, rating: 4.5, reviews: 54,  price: 28,  dur: '30 min',  slots: ['9 AM', '10 AM', '12 PM', '2 PM', '4 PM'], addr: '349 Herring Cove Rd, Spryfield',    badge: null },
  { id: 57, cat: 'beauty',   name: 'Blush Spa Spryfield',   lat: 44.6150, lng: -63.6240, rating: 4.7, reviews: 42,  price: 50,  dur: '60 min',  slots: ['10 AM', '1 PM', '3 PM'],                 addr: '419 Herring Cove Rd, Spryfield',    badge: 'New' },
  { id: 58, cat: 'dining',   name: 'Dee Dee\'s Diner',      lat: 44.6185, lng: -63.6190, rating: 4.4, reviews: 175, price: 0,   dur: '45 min',  slots: ['11 AM', '12 PM', '1 PM', '5 PM', '6 PM'], addr: '303 Herring Cove Rd, Spryfield',   badge: null },
  { id: 59, cat: 'outdoor',  name: 'McIntosh Run Adventures', lat: 44.6100, lng: -63.6280, rating: 4.8, reviews: 25, price: 40, dur: '2 hrs',   slots: ['9 AM', '1 PM'],                          addr: 'McIntosh Run Trail, Spryfield',     badge: 'New' },

  // ── Clayton Park ────────────────────────────────────────────────────────────
  { id: 60, cat: 'hair',     name: 'Clip & Co. Clayton',    lat: 44.6570, lng: -63.6350, rating: 4.6, reviews: 97,  price: 32,  dur: '30 min',  slots: ['9 AM', '11 AM', '1 PM', '3 PM', '5 PM'], addr: '278 Lacewood Dr, Clayton Park',     badge: null },
  { id: 61, cat: 'wellness', name: 'Balance Studio',        lat: 44.6590, lng: -63.6380, rating: 4.8, reviews: 73,  price: 70,  dur: '60 min',  slots: ['10 AM', '12 PM', '3 PM', '5 PM'],        addr: '301 Lacewood Dr, Clayton Park',     badge: null },
  { id: 62, cat: 'dining',   name: 'Clayton Park Kitchen',  lat: 44.6555, lng: -63.6370, rating: 4.5, reviews: 215, price: 0,   dur: '60 min',  slots: ['11 AM', '12 PM', '1 PM', '5 PM', '8 PM'], addr: '250 Lacewood Dr, Clayton Park',    badge: null },
  { id: 63, cat: 'repair',   name: 'Lacewood Tech Repair',  lat: 44.6580, lng: -63.6325, rating: 4.4, reviews: 68,  price: 55,  dur: '45 min',  slots: ['10 AM', '12 PM', '2 PM', '4 PM'],        addr: '310 Lacewood Dr, Clayton Park',     badge: 'Fast' },

  // ── Eastern Passage ─────────────────────────────────────────────────────────
  { id: 64, cat: 'hair',     name: 'Passage Barbers',       lat: 44.6340, lng: -63.5150, rating: 4.5, reviews: 63,  price: 25,  dur: '30 min',  slots: ['9 AM', '10 AM', '12 PM', '2 PM', '4 PM'], addr: '1007 Shore Rd, Eastern Passage',    badge: null },
  { id: 65, cat: 'dining',   name: 'Fisherman\'s Cove Grill', lat: 44.6280, lng: -63.5090, rating: 4.8, reviews: 340, price: 0, dur: '60 min',  slots: ['11 AM', '12 PM', '1 PM', '5 PM', '6 PM'], addr: '145 Shore Rd, Eastern Passage',    badge: 'Top Rated' },
  { id: 66, cat: 'outdoor',  name: 'Passage Paddle Co.',    lat: 44.6300, lng: -63.5120, rating: 4.7, reviews: 35,  price: 50,  dur: '2 hrs',   slots: ['9 AM', '11 AM', '2 PM'],                 addr: 'Shore Rd Wharf, Eastern Passage',   badge: 'New' },
  { id: 67, cat: 'beauty',   name: 'Coastal Glow Spa',      lat: 44.6350, lng: -63.5130, rating: 4.6, reviews: 45,  price: 55,  dur: '60 min',  slots: ['10 AM', '1 PM', '3 PM', '5 PM'],         addr: '980 Shore Rd, Eastern Passage',     badge: null },

  // ── Hammonds Plains ─────────────────────────────────────────────────────────
  { id: 68, cat: 'hair',     name: 'Plains Barber Shop',    lat: 44.7050, lng: -63.7020, rating: 4.5, reviews: 58,  price: 28,  dur: '30 min',  slots: ['9 AM', '11 AM', '1 PM', '3 PM'],         addr: '1558 Hammonds Plains Rd',           badge: null },
  { id: 69, cat: 'dining',   name: 'Board & Bean Café',     lat: 44.7080, lng: -63.7060, rating: 4.7, reviews: 132, price: 0,   dur: '45 min',  slots: ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM'], addr: '1620 Hammonds Plains Rd',          badge: 'Hot' },
  { id: 70, cat: 'wellness', name: 'Woodland Wellness',     lat: 44.7065, lng: -63.7040, rating: 4.8, reviews: 39,  price: 85,  dur: '60 min',  slots: ['9 AM', '11 AM', '2 PM', '4 PM'],         addr: '1580 Hammonds Plains Rd',           badge: null },
  { id: 71, cat: 'outdoor',  name: 'Kingswood Trails Co.',  lat: 44.7100, lng: -63.7090, rating: 4.9, reviews: 28,  price: 35,  dur: '3 hrs',   slots: ['9 AM', '1 PM'],                          addr: 'Kingswood Dr, Hammonds Plains',     badge: 'New' },

  // ── Fall River ──────────────────────────────────────────────────────────────
  { id: 72, cat: 'hair',     name: 'Fall River Fades',      lat: 44.7840, lng: -63.6120, rating: 4.6, reviews: 71,  price: 30,  dur: '30 min',  slots: ['9 AM', '10 AM', '12 PM', '2 PM', '4 PM'], addr: '2657 Fall River Rd, Fall River',    badge: null },
  { id: 73, cat: 'dining',   name: 'Lakeview Bistro',       lat: 44.7860, lng: -63.6150, rating: 4.5, reviews: 89,  price: 0,   dur: '60 min',  slots: ['11 AM', '12 PM', '1 PM', '5 PM', '6 PM'], addr: '2700 Fall River Rd, Fall River',   badge: null },
  { id: 74, cat: 'doctor',   name: 'Fall River Clinic',     lat: 44.7825, lng: -63.6100, rating: 4.4, reviews: 195, price: 0,   dur: '20 min',  slots: ['9 AM', '10 AM', '11 AM', '2 PM', '4 PM'], addr: '2610 Fall River Rd, Fall River',   badge: 'Open Now' },
  { id: 75, cat: 'wellness', name: 'Lakeside Retreat Spa',  lat: 44.7850, lng: -63.6135, rating: 4.9, reviews: 33,  price: 95,  dur: '90 min',  slots: ['9 AM', '11 AM', '2 PM'],                 addr: '2680 Fall River Rd, Fall River',    badge: 'Top Rated' },
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
  { id: 2, type: 'slot_opened',        message: 'A spot opened at Zen Spa HFX for 2 PM — book now!',    time: '15 min ago', read: false },
  { id: 3, type: 'provider_accepted',  message: 'The Barber Co. accepted your 1 PM request',            time: '1 hr ago',   read: true  },
  { id: 4, type: 'booking_confirmed',  message: 'Walk-In Clinic HFX confirmed your 10 AM slot',         time: '3 hrs ago',  read: true  },
  { id: 5, type: 'slot_opened',        message: 'Glow Bar has a new 4 PM opening today',                time: 'Yesterday',  read: true  },
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
  { id: 101, provider: PROVIDERS[0],  slot: '11 AM', date: 'Apr 10, 2026', category: 'Hair',     categoryColor: '#FF5C00', categoryIcon: '✂️', status: 'completed' },
  { id: 102, provider: PROVIDERS[5],  slot: '2 PM',  date: 'Apr 8, 2026',  category: 'Beauty',   categoryColor: '#EC4899', categoryIcon: '💅', status: 'completed' },
  { id: 103, provider: PROVIDERS[10], slot: '10 AM', date: 'Apr 6, 2026',  category: 'Dining',   categoryColor: '#F59E0B', categoryIcon: '🍽️', status: 'completed' },
  { id: 104, provider: PROVIDERS[2],  slot: '3 PM',  date: 'Apr 4, 2026',  category: 'Hair',     categoryColor: '#FF5C00', categoryIcon: '✂️', status: 'cancelled' },
  { id: 105, provider: PROVIDERS[15], slot: '1 PM',  date: 'Apr 2, 2026',  category: 'Wellness', categoryColor: '#8B5CF6', categoryIcon: '💆', status: 'completed' },
  { id: 106, provider: PROVIDERS[8],  slot: '4 PM',  date: 'Mar 30, 2026', category: 'Repair',   categoryColor: '#3B82F6', categoryIcon: '🔧', status: 'completed' },
  { id: 107, provider: PROVIDERS[20], slot: '9 AM',  date: 'Mar 28, 2026', category: 'Outdoor',  categoryColor: '#10B981', categoryIcon: '🌿', status: 'completed' },
  { id: 108, provider: PROVIDERS[12], slot: '5 PM',  date: 'Mar 25, 2026', category: 'Dining',   categoryColor: '#F59E0B', categoryIcon: '🍽️', status: 'completed' },
]
