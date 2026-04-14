/**
 * ProviderPanel — Provider detail panel with Framer Motion animations.
 *
 * Desktop: 320px sidebar. Mobile: rendered inside bottom sheet by MapScreen.
 * Spring slide-in. Book CTA has whileHover/whileTap micro-interactions.
 * Success state uses spring popIn with bounce. Price breakdown shown pre-confirm.
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GROUPS, Provider, T } from '../lib/data'
import { useTheme } from '../lib/theme'
import { USER_LOCATION, roadDistanceKm, formatDistance, formatETA } from '../lib/geo'

interface ProviderPanelProps {
  provider: Provider
  hour: string
  onBook: (provider: Provider, hour: string) => void
  onClose: () => void
  alreadyBooked?: boolean
}

export default function ProviderPanel({ provider, hour, onBook, onClose, alreadyBooked = false }: ProviderPanelProps) {
  const { tk } = useTheme()
  const cg = GROUPS.find(g => g.id === provider.cat)
  const isAvailable = provider.slots.includes(hour)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const dist = roadDistanceKm(USER_LOCATION.latitude, USER_LOCATION.longitude, provider.lat, provider.lng)

  const handleBook     = () => { setLoading(true); setTimeout(() => { setLoading(false); setDone(true); setTimeout(() => onBook(provider, hour), 900) }, 1200) }

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

      {/* Header — theme-aware */}
      <div style={{ background: tk.surface, padding: '22px 20px 20px', flexShrink: 0 }}>
        <motion.button
          type="button"
          whileHover={{ scale: 1.1, background: tk.inputBg }}
          whileTap={{ scale: 0.92 }}
          onClick={onClose}
          aria-label="Close panel"
          style={{
            position: 'absolute', top: 16, right: 16,
            width: 28, height: 28, borderRadius: '50%',
            background: tk.inputBg, border: 'none',
            color: tk.muted, fontSize: 16, cursor: 'pointer',
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
              <span style={{ fontSize: 16, fontWeight: 800, color: tk.text, letterSpacing: '-0.3px', fontFamily: 'Sora,system-ui' }}>
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
            <div style={{ fontSize: 12, color: tk.muted, marginTop: 3 }}>{provider.addr}</div>
            <div style={{ fontSize: 11, color: tk.sub, marginTop: 3, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>📍 {formatDistance(dist)}</span>
              <span style={{ color: tk.line }}>·</span>
              <span>🕐 {formatETA(dist)}</span>
            </div>
            <div style={{ fontSize: 12, marginTop: 4, display: 'flex', gap: 4, alignItems: 'center' }}>
              <span style={{ color: '#FFA500' }}>{'★'.repeat(Math.floor(provider.rating))}</span>
              <span style={{ color: tk.sub, fontWeight: 600 }}>{provider.rating}</span>
              <span style={{ color: tk.muted }}>({provider.reviews})</span>
            </div>
          </div>
        </div>

        {/* Micro bio */}
        <div style={{ fontSize: 12, color: tk.muted, marginTop: 10, fontStyle: 'italic', lineHeight: 1.5 }}>
          {cg?.id === 'hair' ? 'Specializes in modern cuts & natural styles' :
           cg?.id === 'beauty' ? 'Expert skincare & beauty treatments' :
           cg?.id === 'wellness' ? 'Holistic wellness & relaxation therapies' :
           cg?.id === 'repair' ? 'Fast, reliable repairs with warranty' :
           cg?.id === 'dining' ? 'Local favourite — fresh, seasonal menu' :
           cg?.id === 'outdoor' ? 'Guided experiences for all skill levels' :
           cg?.id === 'doctor' ? 'Walk-in friendly — no referral needed' :
           'Premium local service'}
        </div>

        {/* Price / duration pills */}
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          {([
            [provider.price === 0 ? 'Free' : `$${provider.price}`, '💳'],
            [provider.dur, '⏱'],
          ] as [string, string][]).map(([v, ic]) => (
            <div key={v} style={{
              flex: 1, background: tk.inputBg, borderRadius: 10,
              padding: '10px', textAlign: 'center', border: `1px solid ${tk.inputBorder}`,
            }}>
              <div style={{ fontSize: 14 }}>{ic}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: tk.text, marginTop: 3, fontFamily: 'Sora,system-ui' }}>{v}</div>
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
      {!done && !loading && (
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
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: 'center', padding: '10px 0' }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                style={{
                  width: 42, height: 42, borderRadius: 12, background: `${T.accent}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 10px',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              </motion.div>
              <div style={{ fontSize: 15, fontWeight: 800, color: tk.text, fontFamily: 'Sora,system-ui' }}>Confirming…</div>
              <div style={{ fontSize: 12, color: tk.muted, marginTop: 3 }}>Securing your slot</div>
            </motion.div>
          ) : alreadyBooked ? (
            <motion.div key="already" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '14px', borderRadius: 13,
                background: tk.surface, border: `1px solid ${tk.line}`,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span style={{ fontSize: 14, fontWeight: 700, color: tk.muted, fontFamily: 'Sora,system-ui' }}>Already booked for {hour}</span>
              </div>
            </motion.div>
          ) : !done ? (
            <motion.div key="cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {isAvailable ? (
                <motion.button
                  type="button"
                  onClick={handleBook}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    width: '100%', padding: '15px', borderRadius: 13,
                    background: tk.text, color: tk.bg, fontSize: 14, fontWeight: 800,
                    border: 'none', cursor: 'pointer', letterSpacing: '-0.2px',
                    fontFamily: 'Sora,system-ui',
                  }}
                >
                  Confirm — Book {hour} free →
                </motion.button>
              ) : (
                <div style={{
                  width: '100%', padding: '15px', borderRadius: 13,
                  background: tk.inputBg, fontSize: 14, fontWeight: 700,
                  border: `1px solid ${tk.line}`, textAlign: 'center',
                  color: tk.muted, fontFamily: 'Sora,system-ui',
                }}>
                  Not available at {hour}
                </div>
              )}
            </motion.div>
          ) : done ? (
            <motion.div
              key="done"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              style={{ textAlign: 'center', padding: '8px 0' }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 16, delay: 0.1 }}
                style={{
                  width: 64, height: 64, borderRadius: 20, background: `${cg?.color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px',
                }}
              >
                <svg width="28" height="28" viewBox="0 0 22 22" fill="none">
                  <path d="M4 11L8.5 15.5L18 6" stroke={cg?.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{ fontSize: 20, fontWeight: 900, color: tk.text, fontFamily: 'Sora,system-ui', letterSpacing: '-0.5px' }}
              >You're booked!</motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{ fontSize: 13, color: tk.muted, marginTop: 6 }}
              >{provider.name} · {hour}</motion.div>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                style={{
                  marginTop: 14, padding: '12px 14px', borderRadius: 12,
                  background: tk.surface, border: `1px solid ${tk.line}`,
                  fontSize: 12, color: tk.sub, lineHeight: 1.6,
                }}
              >
                📍 {provider.addr}<br/>
                🕐 Show up at <strong>{hour}</strong> · {provider.dur}<br/>
                💸 <span style={{ color: T.green, fontWeight: 700 }}>$0 — free for you</span>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
