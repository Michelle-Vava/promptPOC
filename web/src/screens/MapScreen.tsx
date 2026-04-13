import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { PROVIDERS, HOURS, GROUPS, Booking, Provider, WaitlistEntry, Notification, MOCK_NOTIFICATIONS, T } from '../lib/data'
import { useTheme } from '../lib/theme'
import { useWindowWidth } from '../hooks/useWindowWidth'
import { USER_LOCATION, roadDistanceKm, formatDistance, formatETA } from '../lib/geo'
import Shell from '../components/Shell'
import CategoryBar from '../components/CategoryBar'
import LeafletMap from '../components/LeafletMap'
import TimeWheel from '../components/TimeWheel'
import DialPicker from '../components/DialPicker'
import ProviderPanel from '../components/ProviderPanel'
import BookingsDrawer from '../components/BookingsDrawer'
import NotificationsDrawer from '../components/NotificationsDrawer'
import Toast, { ToastData } from '../components/Toast'
import { usePickerStyle } from '../lib/picker-style'

function LiveClock() {
  const [time, setTime] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  const h  = time.getHours() % 12 || 12
  const m  = String(time.getMinutes()).padStart(2, '0')
  const ap = time.getHours() < 12 ? 'AM' : 'PM'
  return <>{h}:{m} {ap}</>
}

export default function MapScreen() {
  const { mode, tk } = useTheme()
  const { pickerStyle } = usePickerStyle()
  const navigate = useNavigate()
  const width = useWindowWidth()
  const isMobile = width < 768

  // Core state
  const [category, setCategory]     = useState<string | null>('hair')
  const [hourIdx, setHourIdx]       = useState(2)
  const [activeId, setActiveId]     = useState<number | null>(null)
  const [bookings, setBookings]     = useState<Booking[]>([])
  const [waitlisted, setWaitlisted] = useState<WaitlistEntry[]>([])

  // UI state
  const [search, setSearch]               = useState('')
  const [drawer, setDrawer]               = useState(false)
  const [notifDrawer, setNotifDrawer]     = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS)
  const [toasts, setToasts]               = useState<ToastData[]>([])
  const [hintDismissed, setHintDismissed] = useState(false)

  const pushToast = useCallback((message: string, type: ToastData['type'] = 'success') => {
    const id = Date.now()
    setToasts(ts => [...ts, { id, message, type }])
  }, [])

  const dismissToast = useCallback((id: number) => {
    setToasts(ts => ts.filter(t => t.id !== id))
  }, [])

  const hour = HOURS[hourIdx]
  const G    = GROUPS.find(g => g.id === category)

  const categoryFiltered = PROVIDERS.filter(p => category ? p.cat === category : true)
  const searchFiltered   = search.trim()
    ? categoryFiltered.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.addr.toLowerCase().includes(search.toLowerCase())
      )
    : categoryFiltered

  const availableIds  = new Set(searchFiltered.filter(p => p.slots.includes(hour)).map(p => p.id))
  const waitlistedIds = new Set(waitlisted.map(w => w.id))
  const bookedAtHour  = new Set(bookings.filter(b => b.slot === hour).map(b => b.provider.id))
  const unreadNotifs  = notifications.filter(n => !n.read).length
  const activeProv    = PROVIDERS.find(p => p.id === activeId) ?? null

  const handleBook = (prov: Provider, slot: string) => {
    if (bookedAtHour.has(prov.id)) return
    const cg = GROUPS.find(g => g.id === prov.cat)
    setBookings(b => [...b, { id: Date.now(), provider: prov, slot, color: cg?.color ?? '', icon: cg?.icon ?? '' }])
    pushToast(`Booked! ${prov.name} · ${slot}`)
    setTimeout(() => setActiveId(null), 1200)
  }

  const handleWaitlist = (prov: Provider, slot: string) => {
    if (waitlistedIds.has(prov.id)) return
    const cg = GROUPS.find(g => g.id === prov.cat)
    setWaitlisted(w => [...w, { id: prov.id, provider: prov, hour: slot, color: cg?.color ?? '', icon: cg?.icon ?? '' }])
    pushToast(`Added to waitlist · ${prov.name}`, 'info')
    setTimeout(() => setActiveId(null), 1000)
  }

  const markAllRead = () => setNotifications(ns => ns.map(n => ({ ...n, read: true })))

  return (
    <Shell>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* ── Nav ─────────────────────────────────────────────────────────────── */}
        <div style={{
          background: tk.surface, padding: '0 20px', height: 52,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0, borderBottom: `1px solid ${tk.line}`, zIndex: 50,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: T.green, animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 16, fontWeight: 900, color: tk.text, letterSpacing: '-0.4px', fontFamily: 'Sora,system-ui' }}>PROMPT</span>
            {!isMobile && (
              <span style={{ fontSize: 11, color: tk.muted, letterSpacing: '0.5px', marginLeft: 2 }}>
                <LiveClock /> · Halifax
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {/* Status pill */}
            {!isMobile && (
              <div style={{
                background: tk.inputBg, borderRadius: 16, padding: '5px 10px',
                display: 'flex', alignItems: 'center', gap: 6, border: `1px solid ${tk.line}`,
              }}>
                <span style={{ fontSize: 11, color: G?.color ?? T.accent, fontWeight: 700 }}>
                  {category ? `${G?.icon} ${G?.label}` : 'All'}
                </span>
                <span style={{ fontSize: 10, color: tk.muted }}>@ {hour}</span>
                {availableIds.size > 0 && (
                  <span style={{ fontSize: 9, fontWeight: 700, color: T.green, background: 'rgba(0,184,124,.15)', padding: '2px 7px', borderRadius: 8 }}>
                    {availableIds.size} open
                  </span>
                )}
              </div>
            )}

            {/* Services */}
            <button type="button" onClick={() => navigate({ to: '/services' })} style={{
              padding: '5px 10px', borderRadius: 16,
              background: tk.inputBg, border: `1px solid ${tk.line}`,
              color: tk.muted, fontSize: 11, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'Sora,system-ui',
            }}>Services</button>

            {/* Provider view */}
            <button type="button" onClick={() => navigate({ to: '/provider' })} style={{
              padding: '5px 10px', borderRadius: 16,
              background: tk.inputBg, border: `1px solid ${tk.line}`,
              color: tk.muted, fontSize: 11, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'Sora,system-ui',
            }}>Provider</button>

            {/* Notifications */}
            <button type="button" title="Notifications" onClick={() => setNotifDrawer(true)} style={{
              position: 'relative', width: 34, height: 34, borderRadius: 10,
              background: tk.inputBg, border: `1px solid ${tk.line}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={tk.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              {unreadNotifs > 0 && (
                <div style={{
                  position: 'absolute', top: -4, right: -4, width: 16, height: 16,
                  borderRadius: '50%', background: T.accent,
                  fontSize: 9, fontWeight: 800, color: T.white,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{unreadNotifs}</div>
              )}
            </button>

            {/* Profile */}
            <button type="button" title="Profile" onClick={() => navigate({ to: '/profile' })} style={{
              width: 34, height: 34, borderRadius: 10,
              background: tk.inputBg, border: `1px solid ${tk.line}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={tk.muted} strokeWidth="2" strokeLinecap="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </button>

            {/* Bookings */}
            <button type="button" title="My bookings" onClick={() => setDrawer(true)} style={{
              position: 'relative', width: 34, height: 34, borderRadius: 10,
              background: tk.inputBg, border: `1px solid ${tk.line}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={tk.muted} strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {(bookings.length + waitlisted.length) > 0 && (
                <div style={{
                  position: 'absolute', top: -4, right: -4, width: 16, height: 16,
                  borderRadius: '50%', background: T.accent,
                  fontSize: 9, fontWeight: 800, color: T.white,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{bookings.length + waitlisted.length}</div>
              )}
            </button>
          </div>
        </div>

        {/* ── Search ──────────────────────────────────────────────────────────── */}
        <div style={{ background: tk.surface, padding: '8px 20px 10px', flexShrink: 0, borderBottom: `1px solid ${tk.line}` }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={tk.muted} strokeWidth="2.5" strokeLinecap="round"
              style={{ position: 'absolute', left: 12, pointerEvents: 'none' }}>
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search providers or addresses…"
              style={{
                width: '100%', padding: '9px 36px 9px 34px', borderRadius: 10,
                background: tk.inputBg, border: `1px solid ${tk.inputBorder}`,
                color: tk.text, fontSize: 13, fontFamily: 'Sora,system-ui', outline: 'none',
              }}
            />
            {search && (
              <button type="button" onClick={() => setSearch('')} style={{
                position: 'absolute', right: 10, background: 'none', border: 'none',
                color: tk.muted, fontSize: 16, cursor: 'pointer', lineHeight: 1,
              }}>×</button>
            )}
          </div>
        </div>

        {/* ── Category bar ────────────────────────────────────────────────────── */}
        <CategoryBar category={category} setCategory={setCategory} setActiveId={setActiveId} />

        {/* ── Map area ────────────────────────────────────────────────────────── */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <LeafletMap
              providers={searchFiltered}
              availableIds={availableIds}
              waitlistedIds={waitlistedIds}
              bookedIds={bookedAtHour}
              activeId={activeId}
              onPinClick={id => { setActiveId(activeId === id ? null : id); setHintDismissed(true) }}
              darkMode={mode === 'dark'}
            />
            {pickerStyle === 'dial'
              ? <DialPicker hourIdx={hourIdx} setHourIdx={setHourIdx} />
              : <TimeWheel hourIdx={hourIdx} setHourIdx={setHourIdx} />}

            {/* Open count badge — hidden when panel open */}
            {availableIds.size > 0 && !activeId && (
              <div style={{
                position: 'absolute', top: 14, left: 14, zIndex: 1000,
                background: mode === 'dark' ? 'rgba(13,13,13,.82)' : 'rgba(255,255,255,.92)',
                borderRadius: 16, padding: '6px 12px',
                backdropFilter: 'blur(12px)',
                border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.08)'}`,
                pointerEvents: 'none',
              }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: mode === 'dark' ? T.white : T.ink }}>{availableIds.size} open</span>
                <span style={{ fontSize: 11, color: mode === 'dark' ? 'rgba(255,255,255,.4)' : 'rgba(0,0,0,.4)' }}> @ {hour}</span>
              </div>
            )}

            {search && searchFiltered.length === 0 && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 999 }}>
                <div style={{
                  background: mode === 'dark' ? 'rgba(13,13,13,.92)' : 'rgba(255,255,255,.96)',
                  borderRadius: 18, padding: '24px 32px', textAlign: 'center',
                  boxShadow: '0 4px 28px rgba(0,0,0,.1)',
                  border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.06)'}`,
                }}>
                  <div style={{ fontSize: 30, marginBottom: 8 }}>🔍</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: tk.text, fontFamily: 'Sora,system-ui' }}>No results for "{search}"</div>
                </div>
              </div>
            )}

            {!search && availableIds.size === 0 && searchFiltered.length > 0 && !activeId && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 999 }}>
                <div style={{
                  background: mode === 'dark' ? 'rgba(13,13,13,.92)' : 'rgba(255,255,255,.96)',
                  borderRadius: 18, padding: '24px 32px', textAlign: 'center',
                  boxShadow: '0 4px 28px rgba(0,0,0,.1)',
                  border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.06)'}`,
                }}>
                  <div style={{ fontSize: 30, marginBottom: 8 }}>🕐</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: tk.text, fontFamily: 'Sora,system-ui' }}>Nobody open at {hour}</div>
                  <div style={{ fontSize: 12, color: tk.muted, marginTop: 4 }}>Adjust the time wheel → or tap a pin to waitlist</div>
                </div>
              </div>
            )}

            {availableIds.size > 0 && !activeId && !hintDismissed && (
              <div style={{
                position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
                background: mode === 'dark' ? 'rgba(13,13,13,.82)' : 'rgba(255,255,255,.92)',
                borderRadius: 20, padding: '8px 18px',
                backdropFilter: 'blur(12px)',
                border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.08)'}`,
                pointerEvents: 'none', animation: 'fadeUp .4s .4s ease both', zIndex: 999,
              }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: mode === 'dark' ? 'rgba(255,255,255,.7)' : 'rgba(0,0,0,.6)' }}>Tap a pin to book instantly</span>
              </div>
            )}

            {/* Distance / ETA overlay — shown when a pin is selected */}
            {activeId && activeProv && (() => {
              const dist = roadDistanceKm(USER_LOCATION.latitude, USER_LOCATION.longitude, activeProv.lat, activeProv.lng)
              return (
                <div style={{
                  position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
                  background: mode === 'dark' ? 'rgba(13,13,13,.85)' : 'rgba(255,255,255,.94)',
                  borderRadius: 20, padding: '7px 16px',
                  backdropFilter: 'blur(12px)',
                  border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.08)'}`,
                  display: 'flex', alignItems: 'center', gap: 8,
                  animation: 'fadeUp .3s ease both', zIndex: 999, pointerEvents: 'none',
                }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: mode === 'dark' ? 'rgba(255,255,255,.7)' : 'rgba(0,0,0,.6)' }}>
                    📍 {formatDistance(dist)}
                  </span>
                  <span style={{ width: 1, height: 12, background: mode === 'dark' ? 'rgba(255,255,255,.15)' : 'rgba(0,0,0,.12)' }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: mode === 'dark' ? 'rgba(255,255,255,.7)' : 'rgba(0,0,0,.6)' }}>
                    🕐 {formatETA(dist)}
                  </span>
                </div>
              )
            })()}
          </div>

          {/* Desktop sidebar panel — AnimatePresence handles spring enter/exit */}
          {!isMobile && (
            <AnimatePresence>
              {activeId && activeProv && (
                <ProviderPanel
                  key={activeId}
                  provider={activeProv}
                  hour={hour}
                  onBook={handleBook}
                  onWaitlist={handleWaitlist}
                  onClose={() => setActiveId(null)}
                  alreadyBooked={bookedAtHour.has(activeProv.id)}
                />
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Mobile bottom sheet — Framer Motion drag-to-dismiss */}
        <AnimatePresence>
          {isMobile && activeId && activeProv && (
            <motion.div
              key="sheet-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ position: 'fixed', inset: 0, zIndex: 4000, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
              onClick={e => { if (e.target === e.currentTarget) setActiveId(null) }}
            >
              <motion.div
                style={{ flex: 1, background: 'rgba(0,0,0,.45)', backdropFilter: 'blur(4px)' }}
                onClick={() => setActiveId(null)}
              />
              <motion.div
                key="sheet-panel"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', stiffness: 340, damping: 36 }}
                drag="y"
                dragConstraints={{ top: 0 }}
                dragElastic={0.15}
                onDragEnd={(_, info) => { if (info.offset.y > 120) setActiveId(null) }}
                style={{ width: '100%', maxHeight: '82vh', overflowY: 'auto', borderRadius: '20px 20px 0 0', position: 'relative' }}
              >
                {/* Drag handle */}
                <div style={{ position: 'sticky', top: 0, zIndex: 1, display: 'flex', justifyContent: 'center', paddingTop: 10, paddingBottom: 4, background: 'transparent', pointerEvents: 'none' }}>
                  <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,.25)' }} />
                </div>
                <ProviderPanel
                  provider={activeProv}
                  hour={hour}
                  onBook={handleBook}
                  onWaitlist={handleWaitlist}
                  onClose={() => setActiveId(null)}
                  alreadyBooked={bookedAtHour.has(activeProv.id)}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Drawers — always mounted, controlled by isOpen for AnimatePresence exit animations */}
      <BookingsDrawer
        isOpen={drawer}
        bookings={bookings}
        waitlisted={waitlisted}
        onClose={() => setDrawer(false)}
        onCancelBooking={id => setBookings(bs => bs.filter(b => b.id !== id))}
        onCancelWaitlist={id => setWaitlisted(ws => ws.filter(w => w.id !== id))}
      />
      <NotificationsDrawer
        isOpen={notifDrawer}
        notifications={notifications}
        onMarkAllRead={markAllRead}
        onClose={() => setNotifDrawer(false)}
      />
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </Shell>
  )
}
