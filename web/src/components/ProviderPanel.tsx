/**
 * ProviderPanel — Provider detail panel with Framer Motion animations.
 *
 * Desktop: 320px sidebar. Mobile: rendered inside bottom sheet by MapScreen.
 * Spring slide-in. Book/waitlist CTAs have whileHover/whileTap micro-interactions.
 * Success state uses spring popIn with bounce. Price breakdown shown pre-confirm.
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GROUPS, Provider, T } from '../lib/data'
import { useTheme } from '../lib/theme'

interface ProviderPanelProps {
  provider: Provider
  hour: string
  onBook: (provider: Provider, hour: string) => void
  onWaitlist: (provider: Provider, hour: string) => void
  onClose: () => void
}

export default function ProviderPanel({ provider, hour, onBook, onWaitlist, onClose }: ProviderPanelProps) {
  const { tk } = useTheme()
  const cg = GROUPS.find(g => g.id === provider.cat)
  const isAvailable = provider.slots.includes(hour)
  const [done, setDone] = useState(false)
  const [waitlisted, setWaitlisted] = useState(false)

  const handleBook     = () => { setDone(true);      setTimeout(() => onBook(provider, hour), 900) }
  const handleWaitlist = () => { setWaitlisted(true); setTimeout(() => onWaitlist(provider, hour), 700) }

  return (
    <motion.div
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 40, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 32 }}
      style={{
        width: 320, height: '100%', background: tk.card,
        display: 'flex', flexDirection: 'column',
        borderLeft: `1px solid ${tk.line}`,
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Category colour bar */}
      <div style={{ height: 4, background: cg?.color, flexShrink: 0 }} />

      {/* Header — always dark */}
      <div style={{ background: T.ink, padding: '22px 20px 20px', flexShrink: 0 }}>
        <motion.button
          type="button"
          whileHover={{ scale: 1.1, background: 'rgba(255,255,255,.18)' }}
          whileTap={{ scale: 0.92 }}
          onClick={onClose}
          aria-label="Close panel"
          style={{
            position: 'absolute', top: 16, right: 16,
            width: 28, height: 28, borderRadius: '50%',
            background: 'rgba(255,255,255,.1)', border: 'none',
            color: 'rgba(255,255,255,.5)', fontSize: 16, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit',
          }}
        >×</motion.button>

        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.05 }}
            style={{
              width: 50, height: 50, borderRadius: 15,
              background: `${cg?.color}22`, border: `1px solid ${cg?.color}33`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0,
            }}
          >{cg?.icon}</motion.div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: T.white, letterSpacing: '-0.3px', fontFamily: 'Sora,system-ui' }}>
                {provider.name}
              </span>
              {provider.badge && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.12 }}
                  style={{ fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: `${cg?.color}30`, color: cg?.color }}
                >
                  {provider.badge}
                </motion.span>
              )}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.38)', marginTop: 3 }}>{provider.addr}</div>
            <div style={{ fontSize: 12, marginTop: 4, display: 'flex', gap: 4, alignItems: 'center' }}>
              <span style={{ color: '#FFA500' }}>{'★'.repeat(Math.floor(provider.rating))}</span>
              <span style={{ color: 'rgba(255,255,255,.7)', fontWeight: 600 }}>{provider.rating}</span>
              <span style={{ color: 'rgba(255,255,255,.3)' }}>({provider.reviews})</span>
            </div>
          </div>
        </div>

        {/* Price / duration pills */}
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          {([
            [provider.price === 0 ? 'Free' : `$${provider.price}`, '💳'],
            [provider.dur, '⏱'],
          ] as [string, string][]).map(([v, ic]) => (
            <div key={v} style={{
              flex: 1, background: 'rgba(255,255,255,.07)', borderRadius: 10,
              padding: '10px', textAlign: 'center', border: '1px solid rgba(255,255,255,.06)',
            }}>
              <div style={{ fontSize: 14 }}>{ic}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.white, marginTop: 3, fontFamily: 'Sora,system-ui' }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Time section */}
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${tk.line}` }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: tk.muted, textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: 8 }}>
          {isAvailable ? 'Your time — set by wheel' : 'Selected time — not available'}
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: isAvailable ? `${cg?.color}0D` : 'rgba(0,0,0,.04)',
          borderRadius: 12, padding: '12px 14px',
          border: `1px solid ${isAvailable ? cg?.color + '1A' : tk.line}`,
        }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, color: isAvailable ? tk.text : tk.muted, letterSpacing: '-0.5px', fontFamily: 'Sora,system-ui' }}>{hour}</div>
            <div style={{ fontSize: 11, color: tk.muted, marginTop: 2 }}>
              {isAvailable ? `today · ${provider.dur}` : 'no slot at this time'}
            </div>
          </div>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: isAvailable ? `${cg?.color}18` : 'rgba(0,0,0,.06)',
            border: `1.5px solid ${isAvailable ? cg?.color + '35' : tk.line}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {isAvailable ? (
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M1.5 6.5L4.5 9.5L11.5 2.5" stroke={cg?.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : <span style={{ fontSize: 14 }}>🔔</span>}
          </div>
        </div>
      </div>

      {/* All slots */}
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${tk.line}`, flex: 1, overflowY: 'auto' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: tk.muted, textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: 10 }}>
          All slots today
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {provider.slots.map(s => (
            <span key={s} style={{
              padding: '5px 11px', borderRadius: 8, fontSize: 12, fontWeight: 600,
              background: s === hour ? `${cg?.color}15` : tk.surface,
              color: s === hour ? cg?.color : tk.muted,
              border: `1px solid ${s === hour ? cg?.color + '28' : tk.line}`,
            }}>{s}</span>
          ))}
        </div>
      </div>

      {/* Price breakdown — always visible before action */}
      {!done && !waitlisted && (
        <div style={{ padding: '12px 20px 0', background: tk.surface, borderTop: `1px solid ${tk.line}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: tk.muted }}>
            <span>Your cost</span>
            <span style={{ fontWeight: 700, color: T.green }}>$0.00 — Free</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: tk.muted, marginTop: 4 }}>
            <span>Provider fee (charged to them)</span>
            <span style={{ fontWeight: 600 }}>$1.00</span>
          </div>
        </div>
      )}

      {/* CTA */}
      <div style={{ padding: '14px 20px 20px', flexShrink: 0 }}>
        <AnimatePresence mode="wait">
          {!done && !waitlisted ? (
            <motion.div key="cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {isAvailable ? (
                <motion.button
                  type="button"
                  onClick={handleBook}
                  whileHover={{ scale: 1.02, background: T.soft }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    width: '100%', padding: '15px', borderRadius: 13,
                    background: T.ink, color: T.white, fontSize: 14, fontWeight: 800,
                    border: 'none', cursor: 'pointer', letterSpacing: '-0.2px',
                    fontFamily: 'Sora,system-ui',
                  }}
                >
                  Confirm — Book {hour} free →
                </motion.button>
              ) : (
                <motion.button
                  type="button"
                  onClick={handleWaitlist}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    width: '100%', padding: '15px', borderRadius: 13,
                    background: `${cg?.color}15`, color: cg?.color, fontSize: 14, fontWeight: 800,
                    border: `1.5px solid ${cg?.color}35`, cursor: 'pointer', letterSpacing: '-0.2px',
                    fontFamily: 'Sora,system-ui',
                  }}
                >
                  🔔 Join Waitlist for {provider.name}
                </motion.button>
              )}
            </motion.div>
          ) : done ? (
            <motion.div
              key="done"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              style={{ textAlign: 'center' }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 16, delay: 0.1 }}
                style={{
                  width: 52, height: 52, borderRadius: 16, background: `${cg?.color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px',
                }}
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M4 11L8.5 15.5L18 6" stroke={cg?.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
              <div style={{ fontSize: 15, fontWeight: 800, color: tk.text, fontFamily: 'Sora,system-ui' }}>Booked!</div>
              <div style={{ fontSize: 12, color: tk.muted, marginTop: 3 }}>{provider.name} · {hour}</div>
            </motion.div>
          ) : (
            <motion.div
              key="waitlisted"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              style={{ textAlign: 'center' }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 16, delay: 0.1 }}
                style={{
                  width: 52, height: 52, borderRadius: 16, background: `${cg?.color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 10px', fontSize: 26,
                }}
              >🔔</motion.div>
              <div style={{ fontSize: 15, fontWeight: 800, color: tk.text, fontFamily: 'Sora,system-ui' }}>You're on the list!</div>
              <div style={{ fontSize: 12, color: tk.muted, marginTop: 3 }}>We'll ping you if {provider.name} opens up</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
