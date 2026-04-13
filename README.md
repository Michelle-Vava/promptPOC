# Prompt — Real-time Same-Day Booking

A proof-of-concept web app for real-time same-day bookings in Halifax, NS. Customers book instantly for free; service providers pay $1 per confirmed booking.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 18 + TypeScript |
| Build tool | Vite 6 |
| Map | Leaflet.js + react-leaflet (CartoDB tiles) |
| Styling | Inline styles (no CSS framework) |
| Theming | Custom React Context (light/dark) |
| Deployment | Vercel |

---

## Project Structure

```
web/
├── public/
│   └── favicon.svg              # SVG favicon
├── src/
│   ├── main.tsx                 # App entry point, mounts React root
│   ├── App.tsx                  # Root component, screen router
│   │
│   ├── lib/
│   │   ├── data.ts              # All mock data, types, and the T (static tokens) object
│   │   └── theme.tsx            # ThemeProvider, useTheme hook, light/dark token sets
│   │
│   ├── hooks/
│   │   └── useWindowWidth.ts    # Responsive layout hook
│   │
│   ├── components/
│   │   ├── Shell.tsx            # Global font, keyframe animations, CSS reset wrapper
│   │   ├── Chip.tsx             # Category filter pill button
│   │   ├── CategoryBar.tsx      # Horizontally scrollable category filter row
│   │   ├── AuthInput.tsx        # Labelled input for auth forms
│   │   ├── LeafletMap.tsx       # Interactive Leaflet map with custom provider pins
│   │   ├── TimeWheel.tsx        # Drag-to-scroll time selector overlay on map
│   │   ├── ProviderPanel.tsx    # Provider detail sidebar / book or waitlist CTA
│   │   ├── BookingsDrawer.tsx   # Slide-in drawer listing confirmed + waitlisted bookings
│   │   ├── NotificationsDrawer.tsx  # Slide-in drawer for in-app notifications
│   │   ├── Toast.tsx            # Floating toast notification system
│   │   └── Footer.tsx           # Copyright, legal links footer
│   │
│   └── screens/
│       ├── Splash.tsx           # Landing page with live clock + how-it-works panel
│       ├── Auth.tsx             # Login / sign-up form (customer or provider)
│       ├── MapScreen.tsx        # Main customer map view (booking flow)
│       ├── ProfileScreen.tsx    # Customer profile, preferences, legal
│       └── ProviderDashboard.tsx  # Provider dashboard — slots, requests, account, billing
│
├── index.html                   # HTML shell with meta tags and OG tags
├── vite.config.ts               # Vite config — extension resolution order (.ts before .js)
├── tsconfig.json                # TypeScript strict config
├── vercel.json                  # Vercel SPA rewrite rules
└── package.json
```

---

## Screens & Navigation Flow

```
Splash
  ├── "Get Started" (customer)  → Auth → MapScreen → ProfileScreen
  └── "I'm a Provider"          → Auth → ProviderDashboard
```

| Screen | Route trigger | Key features |
|--------|--------------|--------------|
| `Splash` | Initial load | Live clock, provider count, how-it-works |
| `Auth` | Role selected | Login / signup, social buttons (UI), ToS consent |
| `MapScreen` | Customer auth | Leaflet map, time wheel, category filter, search, bookings drawer, notifications, toasts, mobile bottom sheet |
| `ProfileScreen` | Profile icon | User info, preference toggles, dark mode, legal links |
| `ProviderDashboard` | Provider auth | Live toggle, slot editor, request accept/reject, billing history |

---

## Key Design Decisions

### No CSS framework
All styles are written as inline React `style` objects. This was an intentional choice for the POC to keep everything co-located and avoid build-time CSS complexity. The lint rule flagging this is expected and suppressed.

### Static tokens (`T`) vs theme tokens (`tk`)
- `T` — always-dark values used in navbars and overlays that never change regardless of theme (e.g. `T.ink`, `T.accent`, `T.green`)
- `tk` — theme-aware values from `useTheme()` that change between light and dark mode (e.g. `tk.bg`, `tk.card`, `tk.text`)

### All providers always visible on map
Providers are never hidden based on availability. Unavailable pins render at 35% opacity. This lets customers see the full landscape and join a waitlist even when nothing is open at the selected time.

### Leaflet in Vite
Default Leaflet marker icons use absolute paths that break in Vite. Fixed by resolving asset URLs explicitly:
```ts
iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href
```

### Mobile bottom sheet
On viewports < 768px, the provider panel renders as a bottom sheet (`slideInUp` animation) instead of a sidebar. Controlled by `useWindowWidth()`.

### Extension resolution order
`vite.config.ts` resolves `.ts` and `.tsx` before `.js` and `.jsx` to prevent orphaned JSX files from shadowing their TypeScript replacements:
```ts
resolve: { extensions: ['.mjs', '.ts', '.tsx', '.js', '.jsx', '.json'] }
```

---

## Running Locally

```bash
cd web
npm install
npm run dev
```

Open `http://localhost:5173`.

---

## Building for Production

```bash
cd web
npm run build
# Output in web/dist/
```

TypeScript is checked first (`tsc -b`), then Vite bundles. Build will fail on type errors.

---

## Deploying to Vercel

1. Push repo to GitHub
2. Import project at [vercel.com/new](https://vercel.com/new)
3. Set **Root Directory** to `web`
4. Framework preset auto-detects as **Vite**
5. Deploy

`vercel.json` handles SPA routing — all paths rewrite to `index.html` so direct URL navigation works.

---

## Mock Data

All data is in `src/lib/data.ts`. There are 25 mock providers placed at verified Halifax peninsula coordinates. Providers span 8 categories:

| Category | Colour |
|----------|--------|
| ✂️ Hair | `#FF5C00` |
| 🔧 Repair | `#0066FF` |
| 💅 Beauty | `#D4006E` |
| 💆 Wellness | `#00855A` |
| 🍽️ Dining | `#7C3AED` |
| 🌿 Outdoor | `#1A7A1A` |
| 🏠 Stay | `#C47300` |
| 🩺 Doctor | `#CC2200` |

---

## Legal & Compliance (POC stubs)

The following are UI stubs — not legally binding documents:
- Terms of Service link (Auth, Profile)
- Privacy Policy link (Auth, Profile)
- Cookie Policy link (Profile, Footer)
- Copyright footer on all full-page screens

---

## License

© 2025 Prompt Technologies Inc. All rights reserved. This is a proof-of-concept and not a commercial product.
