/**
 * NotificationsDrawer — Animated slide-in drawer for in-app notifications.
 * Uses Framer Motion for enter/exit — panel slides in from right, backdrop fades.
 * Unread items have coloured tint + dot. "Mark all read" clears the nav badge.
 */
import { motion, AnimatePresence } from 'framer-motion'
import { Notification, T } from '../lib/data'
import { useTheme } from '../lib/theme'

interface NotificationsDrawerProps {
  notifications: Notification[]
  onMarkAllRead: () => void
  onClose: () => void
  isOpen: boolean
}

const NOTIF_ICONS: Record<Notification['type'], string> = {
  booking_confirmed: '✅',
  waitlist_opened:   '🔔',
  provider_accepted: '👍',
}
const NOTIF_COLORS: Record<Notification['type'], string> = {
  booking_confirmed: '#00B87C',
  waitlist_opened:   '#FF5C00',
  provider_accepted: '#0066FF',
}

export default function NotificationsDrawer({ notifications, onMarkAllRead, onClose, isOpen }: NotificationsDrawerProps) {
  const { tk } = useTheme()
  const unread = notifications.filter(n => !n.read).length

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
            style={{ width: 380, background: tk.bg, height: '100%', overflowY: 'auto', boxShadow: '-8px 0 40px rgba(0,0,0,.2)' }}
          >
            <div style={{ background: tk.surface, padding: '28px 24px 22px', borderBottom: `1px solid ${tk.line}` }}>
              <button type="button" onClick={onClose} aria-label="Close" style={{
                background: 'none', border: 'none', color: tk.muted,
                fontSize: 22, cursor: 'pointer', display: 'block', marginBottom: 12, fontFamily: 'inherit',
              }}>×</button>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: tk.text, letterSpacing: '-0.5px', fontFamily: 'Sora,system-ui' }}>
                    Notifications
                  </div>
                  {unread > 0 && (
                    <div style={{ fontSize: 12, color: T.accent, fontWeight: 600, marginTop: 4 }}>{unread} unread</div>
                  )}
                </div>
                {unread > 0 && (
                  <button type="button" onClick={onMarkAllRead} style={{
                    padding: '7px 14px', borderRadius: 20,
                    background: tk.inputBg, border: `1px solid ${tk.inputBorder}`,
                    color: tk.muted, fontSize: 11, fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'Sora,system-ui',
                  }}>Mark all read</button>
                )}
              </div>
            </div>

            <div style={{ padding: '16px 20px' }}>
              {notifications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <div style={{ fontSize: 38, marginBottom: 12 }}>🔔</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: tk.text, fontFamily: 'Sora,system-ui' }}>All caught up</div>
                  <p style={{ fontSize: 13, color: tk.muted, marginTop: 6 }}>No notifications yet</p>
                </div>
              ) : notifications.map((n, i) => {
                const color = NOTIF_COLORS[n.type]
                return (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.22 }}
                    style={{
                      display: 'flex', gap: 12, alignItems: 'flex-start',
                      padding: '14px 16px', borderRadius: 14, marginBottom: 8,
                      background: n.read ? tk.card : `${color}0A`,
                      border: `1px solid ${n.read ? tk.line : color + '28'}`,
                    }}
                  >
                    <div style={{
                      width: 38, height: 38, borderRadius: 11, flexShrink: 0,
                      background: `${color}18`, border: `1px solid ${color}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                    }}>{NOTIF_ICONS[n.type]}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: n.read ? 500 : 700, color: tk.text, lineHeight: 1.4 }}>{n.message}</div>
                      <div style={{ fontSize: 11, color: tk.muted, marginTop: 4 }}>{n.time}</div>
                    </div>
                    {!n.read && (
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0, marginTop: 5 }} />
                    )}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
