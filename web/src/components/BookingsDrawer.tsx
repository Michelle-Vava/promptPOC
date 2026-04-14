/**
 * BookingsDrawer — Animated slide-in drawer for bookings.
 * Supports cancellation of confirmed bookings.
 * Uses Framer Motion spring for panel enter/exit + item stagger.
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Booking, T } from '../lib/data'
import { useTheme } from '../lib/theme'

interface BookingsDrawerProps {
  bookings: Booking[]
  onClose: () => void
  isOpen: boolean
  onCancelBooking: (id: number) => void
}

export default function BookingsDrawer({ bookings, onClose, isOpen, onCancelBooking }: BookingsDrawerProps) {
  const { tk } = useTheme()
  const empty = bookings.length === 0
  const [confirmId, setConfirmId] = useState<{ id: number; name: string } | null>(null)

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
            <div style={{ background: tk.surface, padding: '28px 24px 22px', borderBottom: `1px solid ${tk.line}` }}>
              <button type="button" onClick={onClose} aria-label="Close" style={{
                background: 'none', border: 'none', color: tk.muted,
                fontSize: 22, cursor: 'pointer', display: 'block', marginBottom: 12, fontFamily: 'inherit',
              }}>×</button>
              <div style={{ fontSize: 22, fontWeight: 800, color: tk.text, letterSpacing: '-0.5px', fontFamily: 'Sora,system-ui' }}>
                My Bookings
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
                <span style={{ fontSize: 12, color: T.green, fontWeight: 600 }}>{bookings.length} confirmed</span>
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
                                onClick={() => setConfirmId({ id: b.id, name: b.provider.name })}
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

            {/* Cancel confirmation modal */}
            <AnimatePresence>
              {confirmId && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: 'absolute', inset: 0, background: 'rgba(0,0,0,.45)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(4px)', zIndex: 10,
                  }}
                  onClick={() => setConfirmId(null)}
                >
                  <motion.div
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.85, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 26 }}
                    onClick={e => e.stopPropagation()}
                    style={{
                      background: tk.card, borderRadius: 20, padding: '28px 24px',
                      width: 320, boxShadow: '0 12px 40px rgba(0,0,0,.2)',
                      border: `1px solid ${tk.line}`,
                    }}
                  >
                    <div style={{ fontSize: 28, textAlign: 'center', marginBottom: 12 }}>⚠️</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: tk.text, textAlign: 'center', fontFamily: 'Sora,system-ui' }}>
                      Cancel Booking?
                    </div>
                    <p style={{ fontSize: 13, color: tk.muted, textAlign: 'center', marginTop: 8, lineHeight: 1.6 }}>
                      Are you sure you want to cancel your booking with {confirmId.name}? The provider may have reserved this slot for you.
                    </p>
                    <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                      {/* Keep Booking = dominant/primary */}
                      <button type="button" onClick={() => setConfirmId(null)} style={{
                        flex: 1, padding: '13px', borderRadius: 12,
                        background: tk.text, color: tk.bg, fontSize: 13, fontWeight: 800,
                        border: 'none', cursor: 'pointer', fontFamily: 'Sora,system-ui',
                      }}>
                        Keep Booking
                      </button>
                      {/* Cancel = secondary/destructive */}
                      <button type="button" onClick={() => {
                        onCancelBooking(confirmId.id)
                        setConfirmId(null)
                      }} style={{
                        flex: 1, padding: '13px', borderRadius: 12,
                        background: 'rgba(204,0,0,.08)', color: '#CC0000', fontSize: 13, fontWeight: 600,
                        border: '1px solid rgba(204,0,0,.15)', cursor: 'pointer', fontFamily: 'Sora,system-ui',
                      }}>
                        Cancel Booking
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
