/**
 * BookingsDrawer — Animated slide-in drawer for bookings and waitlist.
 * Supports cancellation of both confirmed bookings and waitlist entries.
 * Uses Framer Motion spring for panel enter/exit + item stagger.
 */
import { motion, AnimatePresence } from 'framer-motion'
import { Booking, WaitlistEntry, T } from '../lib/data'
import { useTheme } from '../lib/theme'

interface BookingsDrawerProps {
  bookings: Booking[]
  waitlisted: WaitlistEntry[]
  onClose: () => void
  isOpen: boolean
  onCancelBooking: (id: number) => void
  onCancelWaitlist: (id: number) => void
}

export default function BookingsDrawer({ bookings, waitlisted, onClose, isOpen, onCancelBooking, onCancelWaitlist }: BookingsDrawerProps) {
  const { tk } = useTheme()
  const empty = bookings.length === 0 && waitlisted.length === 0

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex' }}
          onClick={e => { if (e.target === e.currentTarget) onClose() }}
        >
          {/* Backdrop */}
          <div style={{ flex: 1, background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(4px)' }} onClick={onClose} />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            style={{ width: 400, background: tk.bg, height: '100%', overflowY: 'auto', boxShadow: '-8px 0 40px rgba(0,0,0,.2)' }}
          >
            {/* Header */}
            <div style={{ background: T.ink, padding: '28px 24px 22px' }}>
              <button type="button" onClick={onClose} aria-label="Close" style={{
                background: 'none', border: 'none', color: 'rgba(255,255,255,.4)',
                fontSize: 22, cursor: 'pointer', display: 'block', marginBottom: 12, fontFamily: 'inherit',
              }}>×</button>
              <div style={{ fontSize: 22, fontWeight: 800, color: T.white, letterSpacing: '-0.5px', fontFamily: 'Sora,system-ui' }}>
                My Bookings
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
                <span style={{ fontSize: 12, color: T.green, fontWeight: 600 }}>{bookings.length} confirmed</span>
                {waitlisted.length > 0 && (
                  <span style={{ fontSize: 12, color: T.accent, fontWeight: 600 }}>{waitlisted.length} waitlisted</span>
                )}
              </div>
            </div>

            <div style={{ padding: '16px 20px' }}>
              {empty ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  style={{ textAlign: 'center', padding: '60px 20px' }}
                >
                  <div style={{ fontSize: 38, marginBottom: 12 }}>📅</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: tk.text, fontFamily: 'Sora,system-ui' }}>No bookings yet</div>
                  <p style={{ fontSize: 13, color: tk.muted, marginTop: 6, lineHeight: 1.6 }}>Tap a pin on the map to get started</p>
                </motion.div>
              ) : (
                <>
                  {/* Confirmed */}
                  {bookings.length > 0 && (
                    <>
                      <div style={{ fontSize: 10, fontWeight: 700, color: tk.muted, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 10 }}>
                        Confirmed
                      </div>
                      <AnimatePresence>
                        {bookings.map((b, i) => (
                          <motion.div
                            key={b.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: 40, scale: 0.96 }}
                            transition={{ delay: i * 0.04, duration: 0.22 }}
                            style={{
                              display: 'flex', gap: 12, alignItems: 'center',
                              padding: '14px 16px', borderRadius: 14, marginBottom: 8,
                              background: `${b.color}0A`, border: `1px solid ${b.color}28`,
                            }}
                          >
                            <div style={{
                              width: 38, height: 38, borderRadius: 11, flexShrink: 0,
                              background: `${b.color}18`, border: `1px solid ${b.color}30`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                            }}>{b.icon}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 13, fontWeight: 700, color: tk.text }}>{b.provider.name}</div>
                              <div style={{ fontSize: 11, color: tk.muted, marginTop: 3 }}>{b.slot} · {b.provider.dur}</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <div style={{ background: 'rgba(0,184,124,.1)', borderRadius: 9, padding: '4px 9px', fontSize: 11, fontWeight: 800, color: T.green }}>
                                Free
                              </div>
                              <motion.button
                                type="button"
                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.94 }}
                                onClick={() => onCancelBooking(b.id)}
                                style={{
                                  width: 26, height: 26, borderRadius: 8, border: 'none',
                                  background: 'rgba(204,0,0,.08)', color: '#CC0000',
                                  fontSize: 13, cursor: 'pointer', display: 'flex',
                                  alignItems: 'center', justifyContent: 'center',
                                }}
                              >✕</motion.button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </>
                  )}

                  {/* Waitlisted */}
                  {waitlisted.length > 0 && (
                    <>
                      <div style={{ fontSize: 10, fontWeight: 700, color: tk.muted, textTransform: 'uppercase', letterSpacing: '1.5px', margin: '16px 0 10px' }}>
                        Waitlisted
                      </div>
                      <AnimatePresence>
                        {waitlisted.map((w, i) => (
                          <motion.div
                            key={w.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: 40, scale: 0.96 }}
                            transition={{ delay: i * 0.04, duration: 0.22 }}
                            style={{
                              display: 'flex', gap: 12, alignItems: 'center',
                              padding: '14px 16px', borderRadius: 14, marginBottom: 8,
                              background: tk.card, border: `1px dashed ${w.color}40`,
                            }}
                          >
                            <div style={{
                              width: 38, height: 38, borderRadius: 11, flexShrink: 0,
                              background: `${w.color}18`, border: `1px solid ${w.color}30`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                            }}>{w.icon}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 13, fontWeight: 700, color: tk.text }}>{w.provider.name}</div>
                              <div style={{ fontSize: 11, color: tk.muted, marginTop: 3 }}>{w.hour} · waiting for slot</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <div style={{ background: `${w.color}12`, borderRadius: 9, padding: '4px 9px', fontSize: 14 }}>🔔</div>
                              <motion.button
                                type="button"
                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.94 }}
                                onClick={() => onCancelWaitlist(w.id)}
                                style={{
                                  width: 26, height: 26, borderRadius: 8, border: 'none',
                                  background: 'rgba(204,0,0,.08)', color: '#CC0000',
                                  fontSize: 13, cursor: 'pointer', display: 'flex',
                                  alignItems: 'center', justifyContent: 'center',
                                }}
                              >✕</motion.button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
