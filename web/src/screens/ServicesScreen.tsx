/**
 * ServicesScreen — Card-based service listing with slot picker modal.
 *
 * Mirrors the mobile services.tsx: rich cards show open/closed status,
 * next available slot, slot count badge. Tapping a card opens a
 * SlotPicker modal where users pick a time and confirm booking.
 */
import { useState, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { PROVIDERS, GROUPS, Provider, Booking, T } from '../lib/data'
import { USER_LOCATION, roadDistanceKm, formatDistance, formatETA } from '../lib/geo'
import { useTheme } from '../lib/theme'
import Shell from '../components/Shell'

const MOCK_NOW_HOUR = 11

function parseHour(slot: string): number {
  const [h, ap] = slot.split(' ')
  let n = parseInt(h, 10)
  if (ap === 'PM' && n !== 12) n += 12
  if (ap === 'AM' && n === 12) n = 0
  return n
}

function getProviderStatus(p: Provider): { label: string; color: string; nextSlot: string | null } {
  const future = p.slots.filter(s => parseHour(s) >= MOCK_NOW_HOUR)
  if (future.length > 0) return { label: 'Open', color: T.green, nextSlot: future[0] }
  if (p.slots.length > 0) return { label: 'Closed', color: '#EF4444', nextSlot: null }
  return { label: 'No slots', color: T.muted, nextSlot: null }
}

/* ── SlotPicker modal ─────────────────────────────────────────────────────── */

function SlotPicker({ provider, onBook, onClose }: {
  provider: Provider
  onBook: (prov: Provider, slot: string) => void
  onClose: () => void
}) {
  const { tk } = useTheme()
  const cg = GROUPS.find(g => g.id === provider.cat)
  const status = getProviderStatus(provider)
  const [picked, setPicked] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const dist = roadDistanceKm(USER_LOCATION.latitude, USER_LOCATION.longitude, provider.lat, provider.lng)

  const handleConfirm = () => {
    if (!picked) return
    setDone(true)
    setTimeout(() => onBook(provider, picked), 900)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 5000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(6px)',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ scale: 0.92, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, y: 20, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 340, damping: 30 }}
        style={{
          width: '100%', maxWidth: 420, borderRadius: 20,
          overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,.3)',
        }}
      >
        {/* Header */}
        <div style={{ background: tk.surface, padding: '22px 20px 18px', position: 'relative', borderBottom: `1px solid ${tk.line}` }}>
          <button type="button" onClick={onClose} style={{
            position: 'absolute', top: 14, right: 14, width: 28, height: 28,
            borderRadius: '50%', background: tk.inputBg, border: 'none',
            color: tk.muted, fontSize: 16, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>×</button>

          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: `${cg?.color}22`, border: `1px solid ${cg?.color}33`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0,
            }}>{cg?.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: tk.text, fontFamily: 'Sora,system-ui' }}>{provider.name}</span>
                <span style={{
                  width: 7, height: 7, borderRadius: '50%', background: status.color,
                }} />
              </div>
              <div style={{ fontSize: 12, color: tk.muted, marginTop: 3 }}>{provider.addr}</div>
              <div style={{ fontSize: 11, color: tk.sub, marginTop: 3, display: 'flex', gap: 6 }}>
                <span>📍 {formatDistance(dist)}</span>
                <span style={{ color: tk.line }}>·</span>
                <span>🕐 {formatETA(dist)}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            {([
              [provider.price === 0 ? 'Free' : `$${provider.price}`, '💳'],
              [provider.dur, '⏱'],
              [`★ ${provider.rating}`, '⭐'],
            ] as [string, string][]).map(([v, ic]) => (
              <div key={v} style={{
                flex: 1, background: tk.inputBg, borderRadius: 10,
                padding: '8px', textAlign: 'center', border: `1px solid ${tk.inputBorder}`,
              }}>
                <div style={{ fontSize: 12 }}>{ic}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: tk.text, marginTop: 2, fontFamily: 'Sora,system-ui' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Slots grid */}
        <div style={{ background: tk.card, padding: '18px 20px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: tk.muted, textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: 10 }}>
            Available Times
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {provider.slots.map(s => {
              const isPast = parseHour(s) < MOCK_NOW_HOUR
              const isSelected = s === picked
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => !isPast && setPicked(s)}
                  style={{
                    padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                    fontFamily: 'Sora,system-ui', cursor: isPast ? 'not-allowed' : 'pointer',
                    opacity: isPast ? 0.35 : 1,
                    background: isSelected ? `${cg?.color}15` : tk.surface,
                    color: isSelected ? cg?.color : tk.text,
                    border: `1.5px solid ${isSelected ? cg?.color + '40' : tk.line}`,
                    transition: 'all .15s',
                  }}
                >{s}</button>
              )
            })}
          </div>
        </div>

        {/* Price breakdown + CTA */}
        <div style={{ background: tk.card, padding: '0 20px 20px', borderTop: `1px solid ${tk.line}` }}>
          {!done && (
            <>
              <div style={{ padding: '12px 0', display: 'flex', justifyContent: 'space-between', fontSize: 11, color: tk.muted }}>
                <span>Your cost</span>
                <span style={{ fontWeight: 700, color: T.green }}>$0.00 — Free</span>
              </div>
              <motion.button
                type="button"
                onClick={handleConfirm}
                disabled={!picked}
                whileHover={picked ? { scale: 1.02 } : {}}
                whileTap={picked ? { scale: 0.97 } : {}}
                style={{
                  width: '100%', padding: '14px', borderRadius: 13,
                  background: picked ? tk.text : tk.surface, color: picked ? tk.bg : tk.muted,
                  fontSize: 14, fontWeight: 800, border: 'none', cursor: picked ? 'pointer' : 'not-allowed',
                  fontFamily: 'Sora,system-ui', letterSpacing: '-0.2px',
                  opacity: picked ? 1 : 0.5, transition: 'all .15s',
                }}
              >
                {picked ? `Confirm — Book ${picked} free →` : 'Pick a time slot'}
              </motion.button>
            </>
          )}

          {done && (
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              style={{ textAlign: 'center', padding: '16px 0' }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 16, background: `${cg?.color}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px',
              }}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M4 11L8.5 15.5L18 6" stroke={cg?.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: tk.text, fontFamily: 'Sora,system-ui' }}>Booked!</div>
              <div style={{ fontSize: 12, color: tk.muted, marginTop: 3 }}>{provider.name} · {picked}</div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ── Main screen ──────────────────────────────────────────────────────────── */

export default function ServicesScreen() {
  const navigate = useNavigate()
  const { mode, tk } = useTheme()
  const [category, setCategory] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [pickerProv, setPickerProv] = useState<Provider | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])

  const filtered = useMemo(() => {
    let list = PROVIDERS
    if (category) list = list.filter(p => p.cat === category)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.addr.toLowerCase().includes(q))
    }
    return list
  }, [category, search])

  const handleBook = (prov: Provider, slot: string) => {
    const cg = GROUPS.find(g => g.id === prov.cat)
    setBookings(b => [...b, { id: Date.now(), provider: prov, slot, color: cg?.color ?? '', icon: cg?.icon ?? '' }])
    setPickerProv(null)
  }

  return (
    <Shell>
      <div style={{ minHeight: '100vh', background: tk.bg, display: 'flex', flexDirection: 'column' }}>

        {/* Nav */}
        <div style={{
          background: tk.surface, padding: '0 20px', height: 52,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0, borderBottom: `1px solid ${tk.line}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button type="button" onClick={() => navigate({ to: '/map' })} style={{
              background: tk.inputBg, border: `1px solid ${tk.inputBorder}`,
              borderRadius: 10, width: 34, height: 34, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={tk.muted} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <span style={{ fontSize: 16, fontWeight: 900, color: tk.text, fontFamily: 'Sora,system-ui', letterSpacing: '-0.4px' }}>Services</span>
            {bookings.length > 0 && (
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10,
                background: `${T.green}20`, color: T.green,
              }}>{bookings.length} booked</span>
            )}
          </div>
          <button type="button" onClick={() => navigate({ to: '/profile' })} style={{
            width: 34, height: 34, borderRadius: 10,
            background: tk.inputBg, border: `1px solid ${tk.inputBorder}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={tk.muted} strokeWidth="2" strokeLinecap="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </button>
        </div>

        {/* Search + Category filters */}
        <div style={{ padding: '14px 20px 0' }}>
          <div style={{ position: 'relative', marginBottom: 14 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={tk.muted} strokeWidth="2.5" strokeLinecap="round"
              style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search providers…"
              style={{
                width: '100%', padding: '10px 36px 10px 34px', borderRadius: 12,
                background: tk.surface, border: `1px solid ${tk.line}`,
                color: tk.text, fontSize: 13, fontFamily: 'Sora,system-ui', outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12 }}>
            <button type="button" onClick={() => setCategory(null)} style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
              fontFamily: 'Sora,system-ui', cursor: 'pointer', whiteSpace: 'nowrap',
              background: !category ? tk.text : tk.surface,
              color: !category ? tk.bg : tk.muted,
              border: `1px solid ${!category ? tk.text : tk.line}`,
            }}>All</button>
            {GROUPS.map(g => (
              <button key={g.id} type="button" onClick={() => setCategory(g.id === category ? null : g.id)} style={{
                padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                fontFamily: 'Sora,system-ui', cursor: 'pointer', whiteSpace: 'nowrap',
                background: g.id === category ? `${g.color}15` : tk.surface,
                color: g.id === category ? g.color : tk.muted,
                border: `1px solid ${g.id === category ? g.color + '40' : tk.line}`,
              }}>{g.icon} {g.label}</button>
            ))}
          </div>
        </div>

        {/* Provider cards */}
        <div style={{ flex: 1, padding: '0 20px 30px', overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: 14 }}>
            {filtered.map((p, i) => {
              const cg = GROUPS.find(g => g.id === p.cat)
              const status = getProviderStatus(p)
              const dist = roadDistanceKm(USER_LOCATION.latitude, USER_LOCATION.longitude, p.lat, p.lng)
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.25 }}
                  onClick={() => setPickerProv(p)}
                  style={{
                    background: tk.card, borderRadius: 16, padding: '16px',
                    border: `1px solid ${tk.line}`, cursor: 'pointer',
                    transition: 'box-shadow .15s, border-color .15s',
                  }}
                  whileHover={{ boxShadow: '0 4px 20px rgba(0,0,0,.08)', borderColor: cg?.color + '40' }}
                >
                  {/* Top row — icon + name + badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 12,
                      background: `${cg?.color}12`, border: `1px solid ${cg?.color}20`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0,
                    }}>{cg?.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 14, fontWeight: 800, color: tk.text, fontFamily: 'Sora,system-ui', letterSpacing: '-0.2px' }}>{p.name}</span>
                        {p.badge && (
                          <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 8, background: `${cg?.color}15`, color: cg?.color }}>{p.badge}</span>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: tk.muted, marginTop: 2 }}>{p.addr}</div>
                    </div>
                  </div>

                  {/* Status + price row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: status.color }} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: status.color }}>{status.label}</span>
                      {status.nextSlot && (
                        <span style={{ fontSize: 11, color: tk.muted, marginLeft: 4 }}>Next: {status.nextSlot}</span>
                      )}
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 800, color: tk.text, fontFamily: 'Sora,system-ui' }}>
                      {p.price === 0 ? 'Free' : `$${p.price}`}
                    </span>
                  </div>

                  {/* Bottom — rating + distance + slots badge */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
                      <span style={{ color: '#FFA500', fontWeight: 700 }}>★ {p.rating}</span>
                      <span style={{ color: tk.muted }}>({p.reviews})</span>
                      <span style={{ color: tk.muted }}>· {formatDistance(dist)}</span>
                    </div>
                    {p.slots.length > 0 && (
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 8,
                        background: `${T.green}15`, color: T.green,
                      }}>{p.slots.length} slots</span>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: 30, marginBottom: 10 }}>🔍</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: tk.text, fontFamily: 'Sora,system-ui' }}>No providers found</div>
              <div style={{ fontSize: 12, color: tk.muted, marginTop: 4 }}>Try a different search or category</div>
            </div>
          )}
        </div>
      </div>

      {/* Slot picker modal */}
      <AnimatePresence>
        {pickerProv && (
          <SlotPicker
            key={pickerProv.id}
            provider={pickerProv}
            onBook={handleBook}
            onClose={() => setPickerProv(null)}
          />
        )}
      </AnimatePresence>
    </Shell>
  )
}
