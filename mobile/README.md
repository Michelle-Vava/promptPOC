# PROMPT — Mobile App

> Instant same-day booking for local services across Halifax Regional Municipality.

Built with **Expo SDK 54**, **React Native 0.81**, **TypeScript 5.9**, and **expo-router 6** (file-based routing).

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Screens & Navigation](#screens--navigation)
- [Design System](#design-system)
- [Data Layer](#data-layer)
- [Components](#components)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Known Limitations](#known-limitations)

---

## Overview

PROMPT is a two-sided marketplace connecting **customers** with **local service providers** (barbers, repair techs, spas, restaurants, etc.) for same-day bookings. The mobile app provides:

- **Customers**: Map-based discovery, time-wheel slot selection, instant booking, activity tracking (list + calendar), and account management.
- **Providers**: Live toggle (go live / pause), incoming request management (accept / decline), booking history with billing, slot availability editor, and business account settings.

Both roles share the same app binary — role switching happens in Account settings.

---

## Architecture

```
expo-router (file-based)
├── splash           → Onboarding / landing
├── auth             → Login / sign-up (mock)
├── (tabs)           → Customer bottom-tab navigator
│   ├── index        → Map screen (Home)
│   ├── services     → Provider list with booking
│   ├── activity     → Bookings (list + calendar views)
│   └── account      → Settings, role switch, legal
├── (provider-tabs)  → Provider bottom-tab navigator
│   ├── index        → Dashboard (live toggle, requests)
│   ├── bookings     → Today + history + billing
│   ├── slots        → Availability editor
│   └── account      → Business info, payment, settings
└── legal            → Stack navigator
    ├── terms        → Terms of Service
    ├── privacy      → Privacy Policy
    └── cookies      → Cookie Policy
```

### State Management

| Layer | Tool | Scope |
|---|---|---|
| Theme | React Context (`ThemeProvider`) | App-wide dark/light mode |
| Bookings | React Context (`BookingsProvider`) | Confirmed + waitlisted bookings |
| Screen state | `useState` / `useMemo` | Per-screen UI state |

### Key Dependencies

| Package | Purpose |
|---|---|
| `expo-router` | File-based routing with typed navigation |
| `react-native-maps` | Interactive MapView with custom markers |
| `expo-haptics` | Haptic feedback on book/waitlist actions |
| `expo-network` | Offline detection |
| `@expo-google-fonts/sora` | Sora typeface (300–800 weights) |
| `react-native-gesture-handler` | Gesture support for panels and wheels |
| `react-native-safe-area-context` | Safe area insets for notches/islands |

---

## Screens & Navigation

### Customer Flow

| Screen | Tab | Description |
|---|---|---|
| **Home** (`index.tsx`) | Home | Interactive map with green pins for available providers. Control bar with search + category chips. Time wheel for hour selection. Tap pin → ProviderPanel bottom sheet → book instantly. |
| **Services** (`services.tsx`) | Services | Scrollable provider list with category filters. Tap a card → ProviderPanel → book. |
| **Activity** (`activity.tsx`) | Activity | Toggle between list and calendar views. List shows confirmed bookings + waitlisted with dates. Calendar shows month grid with dots; tap a day to see bookings. Cancel requires confirmation dialog. |
| **Account** (`account.tsx`) | Account | Editable name, role switch to provider, push notification toggle, dark/light mode toggle, legal links, logout. |

### Provider Flow

| Screen | Tab | Description |
|---|---|---|
| **Dashboard** (`index.tsx`) | Dashboard | Live/pause toggle, stats row (bookings/charged/rating), incoming requests with accept/decline, confirmed today list. |
| **Bookings** (`bookings.tsx`) | Bookings | Today's confirmed bookings, history section with amounts, monthly revenue total. |
| **Slots** (`slots.tsx`) | Slots | Configure availability: start hour, end hour, slot duration (15–90 min). Preview grid before saving. |
| **Account** (`account.tsx`) | Account | Business card (name, category, address, rating), payment method, billing history, role switch to customer, settings, legal, logout. |

### Shared Screens

| Screen | Description |
|---|---|
| **Splash** | Cinematic landing with live clock, provider count, staggered animations. Two CTAs: customer or provider. |
| **Auth** | Mock login/signup. Routes based on role param → `(tabs)` or `(provider-tabs)`. |
| **Legal** | Terms of Service (9 sections), Privacy Policy (8 sections), Cookie Policy (7 sections). |

---

## Design System

### Colour Palette

| Token | Value | Usage |
|---|---|---|
| `accent` | `#FF5C00` | Primary brand orange — CTAs, active states, badges |
| `green` | `#00B87C` | Available / bookable / confirmed |
| `ink` | `#0D0D0D` | Dark backgrounds, headers |
| `paper` | `#FAFAF8` | Light mode background |
| `smoke` | `#F5F3EF` | Light mode surface |
| `muted` | `#888` | Secondary text, dividers |

### Category Colours

Each service category has a distinct colour for visual differentiation:

| Category | Colour | Icon |
|---|---|---|
| Hair | `#FF5C00` (orange) | scissors |
| Repair | `#3B82F6` (blue) | tool |
| Beauty | `#EC4899` (pink) | heart |
| Wellness | `#8B5CF6` (purple) | smile |
| Dining | `#F59E0B` (amber) | coffee |
| Outdoor | `#10B981` (emerald) | sun |
| Stay | `#06B6D4` (cyan) | home |
| Doctor | `#EF4444` (red) | activity |

### Theme Modes

- **Dark mode**: `ink` background, elevated `#1A1A1A` cards, `#2A2A2A` surfaces
- **Light mode**: `paper` background, white cards, `smoke` surfaces
- Default: follows system `useColorScheme()`
- Toggle available in Account settings (both customer and provider)

### Typography

Sora typeface throughout:
- `Sora_800ExtraBold` — headings, logo, prices
- `Sora_700Bold` — section labels, provider names
- `Sora_600SemiBold` — buttons, chip text, settings
- `Sora_400Regular` — body, descriptions
- `Sora_300Light` — secondary info

### Responsive Scaling

`lib/scale.ts` provides three scaling functions:
- `s(n)` — horizontal scale based on 375px baseline
- `vs(n)` — vertical scale based on 812px baseline
- `ms(n)` — moderate scale (blended) for font sizes

---

## Data Layer

### Interfaces (`lib/data.ts`)

```typescript
Group       { id, icon, label, color }
Provider    { id, cat, name, lat, lng, rating, reviews, price, dur, slots, addr, badge }
Booking     { id, provider, slot, color, icon }
WaitlistEntry { id, provider, hour, color, icon }
Notification  { id, type, message, time, read }
```

### Mock Data

- **40 providers** across HRM:
  - Halifax: 25 providers (Barrington, Spring Garden, Quinpool, Gottingen, etc.)
  - Dartmouth: 6 providers (Portland St, Wyse Rd, Main St)
  - Bedford: 5 providers (Bedford Hwy, Dartmouth Rd, Larry Uteck)
  - Tantallon: 4 providers (St Margarets Bay Rd, Chain Lake Dr, Hubley)
- **11 time slots**: 9 AM – 6 PM + 8 PM (no 7 PM)
- **8 categories**: Hair, Repair, Beauty, Wellness, Dining, Outdoor, Stay, Doctor
- **3 notification types**: booking_confirmed, waitlist_opened, provider_accepted

### Bookings Context (`lib/bookings-context.tsx`)

In-memory state via React Context:
- `bookings[]` — confirmed appointments
- `waitlisted[]` — waitlist entries
- `addBooking()` / `removeBooking()` / `addWaitlist()` / `removeWaitlist()`

---

## Components

| Component | File | Description |
|---|---|---|
| `MapPin` | `components/MapPin.tsx` | Animated map marker with green pulse, staggered entrance, scale bounce on tap |
| `ProviderPanel` | `components/ProviderPanel.tsx` | Modal bottom sheet — provider details, all slots, price breakdown, book CTA with haptic feedback |
| `TimeWheel` | `components/TimeWheel.tsx` | Draggable vertical time selector overlay on map right edge |
| `NotificationsSheet` | `components/NotificationsSheet.tsx` | Modal sheet with unread count, mark-all-read, tap to navigate |
| `Toast` | `components/Toast.tsx` | Animated toast stack — success (green) / info (blue) / error (red) types |
| `CategoryBar` | `components/CategoryBar.tsx` | Horizontal scrollable category filter chips (standalone) |
| `BookingsSheet` | `components/BookingsSheet.tsx` | Alternative bookings bottom sheet (available but not currently used) |
| `Chip` | `components/Chip.tsx` | Generic pressable pill for filter toggles |
| `AuthInput` | `components/AuthInput.tsx` | Themed text input with floating label |
| `ErrorBoundary` | `components/ErrorBoundary.tsx` | Catch-all error boundary with retry UI |

---

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npx expo`)
- iOS Simulator or Android Emulator (or Expo Go on a physical device)

### Install & Run

```bash
cd mobile
npm install
npx expo start
```

Press `i` for iOS, `a` for Android, or `w` for web preview.

### Scripts

From the repo root:

```bash
npm run mobile        # starts Expo dev server from /mobile
```

---

## Project Structure

```
mobile/
├── app/                          # Expo Router file-based routes
│   ├── _layout.tsx               # Root layout — providers, fonts, error boundary
│   ├── splash.tsx                # Landing screen with animations
│   ├── auth.tsx                  # Login / sign-up (mock)
│   ├── (tabs)/                   # Customer bottom tabs
│   │   ├── _layout.tsx           # Tab config (Home, Services, Activity, Account)
│   │   ├── index.tsx             # Map screen — core booking experience
│   │   ├── services.tsx          # Provider list with booking
│   │   ├── activity.tsx          # Bookings (list + calendar)
│   │   └── account.tsx           # Settings & preferences
│   ├── (provider-tabs)/          # Provider bottom tabs
│   │   ├── _layout.tsx           # Tab config (Dashboard, Bookings, Slots, Account)
│   │   ├── index.tsx             # Dashboard — live toggle, requests
│   │   ├── bookings.tsx          # Booking history & billing
│   │   ├── slots.tsx             # Availability editor
│   │   └── account.tsx           # Business settings
│   └── legal/                    # Legal screens stack
│       ├── _layout.tsx           # Stack with slide animation
│       ├── terms.tsx             # Terms of Service
│       ├── privacy.tsx           # Privacy Policy
│       └── cookies.tsx           # Cookie Policy
├── components/                   # Reusable UI components
│   ├── MapPin.tsx                # Animated map marker
│   ├── ProviderPanel.tsx         # Booking bottom sheet
│   ├── TimeWheel.tsx             # Draggable time selector
│   ├── NotificationsSheet.tsx    # Notifications bottom sheet
│   ├── Toast.tsx                 # Animated toast notifications
│   ├── CategoryBar.tsx           # Category filter chips
│   ├── BookingsSheet.tsx         # Bookings bottom sheet
│   ├── Chip.tsx                  # Generic pressable chip
│   ├── AuthInput.tsx             # Themed auth input
│   └── ErrorBoundary.tsx         # Error catch boundary
├── lib/                          # Shared utilities & state
│   ├── data.ts                   # Interfaces, mock data, constants
│   ├── theme.tsx                 # Dark/light theme provider
│   ├── bookings-context.tsx      # Booking state context
│   └── scale.ts                  # Responsive scaling utils
├── app.json                      # Expo app config
├── package.json                  # Dependencies
└── tsconfig.json                 # TypeScript config
```

---

## Known Limitations

These are intentional simplifications for this proof-of-concept:

| Area | Limitation | Production Fix |
|---|---|---|
| **Auth** | Mock — no real login, JWT, or session persistence | Add Supabase / Firebase Auth, store tokens in SecureStore |
| **Data** | All mock, in-memory only — resets on restart | Backend API + AsyncStorage cache |
| **Bookings** | No real-time sync between customer and provider | WebSocket / Supabase Realtime subscriptions |
| **Payments** | Payment method is display-only | Stripe Connect for provider payouts |
| **Calendar** | Booking dates are computed relative to today | Store actual booking dates from backend |
| **Notifications** | Mock data, no push delivery | Expo Notifications + backend triggers |
| **Map** | Requires API key config for full functionality | Add Google Maps API key in `app.json` |
| **Search** | Client-side only, filters mock array | Server-side search with Algolia or Postgres full-text |
| **Offline** | Detection only, no offline-first capability | AsyncStorage + queue for offline actions |

---

## Colour Roles Quick Reference

| Colour | Meaning |
|---|---|
| 🟢 Green (`#00B87C`) | Available, confirmed, success |
| 🟠 Orange (`#FF5C00`) | Active selection, brand accent, CTAs |
| ⚪ Gray / muted | Structure, inactive, secondary |
| 🔴 Red | Destructive actions (cancel, logout) |

---

*Built as a proof of concept for the PROMPT same-day booking platform.*
