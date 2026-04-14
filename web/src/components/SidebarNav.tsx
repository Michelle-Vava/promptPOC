import { useNavigate, useRouterState } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { T } from '../lib/data'
import { useTheme } from '../lib/theme'
import { usePickerStyle, PICKER_OPTIONS } from '../lib/picker-style'

interface SidebarNavProps {
  isOpen: boolean
  onClose: () => void
}

const NAV_ITEMS = [
  { label: 'Map',      path: '/map',      icon: (c: string) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg> },
  { label: 'Activity', path: '/activity', icon: (c: string) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
  { label: 'Services', path: '/services', icon: (c: string) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a4 4 0 0 0-8 0v2"/></svg> },
]

const HELP_ITEMS = [
  { label: 'FAQ',              path: '/help/faq',     icon: (c: string) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
  { label: 'Contact Support',  path: '/help/contact', icon: (c: string) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
  { label: 'Report an Issue',  path: '/help/report',  icon: (c: string) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
]

const LEGAL_ITEMS = [
  { label: 'Terms of Service', path: '/legal/terms' },
  { label: 'Privacy Policy',   path: '/legal/privacy' },
  { label: 'Cookie Policy',    path: '/legal/cookies' },
]

export default function SidebarNav({ isOpen, onClose }: SidebarNavProps) {
  const { tk, mode, toggle } = useTheme()
  const { pickerStyle, setPickerStyle } = usePickerStyle()
  const navigate = useNavigate()
  const pathname = useRouterState({ select: s => s.location.pathname })

  const go = (path: string) => {
    navigate({ to: path })
    onClose()
  }

  const isActive = (path: string) => pathname === path

  const rowStyle = (active: boolean): React.CSSProperties => ({
    width: '100%', display: 'flex', alignItems: 'center', gap: 14,
    padding: '11px 16px', borderRadius: 10,
    background: active ? `${T.accent}10` : 'transparent',
    border: 'none', cursor: 'pointer', textAlign: 'left',
    fontFamily: 'Sora,system-ui',
    transition: 'background .15s ease, color .15s ease',
  })

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="sidebar-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 9998,
              background: 'rgba(0,0,0,.15)',
            }}
          />

          {/* Drawer */}
          <motion.nav
            key="sidebar-drawer"
            initial={{ x: '-100%', opacity: 0.8 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0.8 }}
            transition={{ type: 'spring', stiffness: 380, damping: 38, mass: 0.8 }}
            style={{
              position: 'fixed', top: 0, left: 0, bottom: 0,
              width: 300, zIndex: 9999,
              background: tk.bg,
              borderRight: `1px solid ${tk.line}`,
              display: 'flex', flexDirection: 'column',
              fontFamily: 'Sora,system-ui',
              boxShadow: '8px 0 40px rgba(0,0,0,.12)',
            }}
          >
            {/* ── Header ── */}
            <div style={{
              padding: '20px 20px 16px', display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', borderBottom: `1px solid ${tk.line}`,
              flexShrink: 0,
            }}>
              {/* Logo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: T.green, animation: 'pulse 2s infinite' }} />
                <span style={{ fontSize: 16, fontWeight: 900, color: tk.text, letterSpacing: '-0.4px' }}>PROMPT</span>
              </div>
              {/* Close arrow */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                style={{
                  width: 34, height: 34, borderRadius: 10,
                  background: tk.inputBg, border: `1px solid ${tk.line}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'background .15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = tk.surface)}
                onMouseLeave={e => (e.currentTarget.style.background = tk.inputBg)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={tk.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="11 17 6 12 11 7" />
                  <line x1="6" y1="12" x2="18" y2="12" />
                </svg>
              </button>
            </div>

            {/* ── User card ── */}
            <button
              type="button"
              onClick={() => go('/profile')}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '18px 20px', borderBottom: `1px solid ${tk.line}`,
                background: 'transparent', border: 'none', borderBottomStyle: 'solid',
                borderBottomWidth: 1, borderBottomColor: tk.line,
                cursor: 'pointer', textAlign: 'left', width: '100%',
                fontFamily: 'Sora,system-ui', flexShrink: 0,
                transition: 'background .15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = tk.inputBg)}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 14,
                background: `${T.accent}14`, border: `1.5px solid ${T.accent}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 15, fontWeight: 800, color: T.accent, flexShrink: 0,
              }}>JD</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: tk.text, lineHeight: 1.3 }}>Jane Doe</div>
                <div style={{ fontSize: 12, color: tk.muted, fontWeight: 500, marginTop: 1 }}>Manage account</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={tk.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* ── Scrollable body ── */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px 10px' }}>
              {/* Nav items */}
              {NAV_ITEMS.map(item => {
                const active = isActive(item.path)
                const color = active ? T.accent : tk.muted
                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => go(item.path)}
                    style={rowStyle(active)}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.background = tk.inputBg }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
                  >
                    <span style={{ width: 22, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>{item.icon(color)}</span>
                    <span style={{ fontSize: 14, fontWeight: active ? 700 : 500, color: active ? T.accent : tk.text }}>{item.label}</span>
                  </button>
                )
              })}

              {/* Divider */}
              <div style={{ height: 1, background: tk.line, margin: '8px 16px' }} />

              {/* Help section */}
              <div style={{ padding: '6px 16px 4px', fontSize: 11, fontWeight: 600, color: tk.muted, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                Support
              </div>
              {HELP_ITEMS.map(item => {
                const active = isActive(item.path)
                const color = active ? T.accent : tk.muted
                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => go(item.path)}
                    style={rowStyle(active)}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.background = tk.inputBg }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
                  >
                    <span style={{ width: 22, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>{item.icon(color)}</span>
                    <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active ? T.accent : tk.text }}>{item.label}</span>
                  </button>
                )
              })}

              {/* Divider */}
              <div style={{ height: 1, background: tk.line, margin: '8px 16px' }} />

              {/* Dark mode */}
              <button
                type="button"
                onClick={toggle}
                style={rowStyle(false)}
                onMouseEnter={e => (e.currentTarget.style.background = tk.inputBg)}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <span style={{ width: 22, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                  {mode === 'dark'
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={tk.muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={tk.muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                  }
                </span>
                <span style={{ fontSize: 13, fontWeight: 500, color: tk.text }}>
                  {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </span>
              </button>

              {/* Divider */}
              <div style={{ height: 1, background: tk.line, margin: '8px 16px' }} />

              {/* Time picker style */}
              <div style={{ padding: '6px 16px 4px', fontSize: 11, fontWeight: 600, color: tk.muted, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                Time Picker
              </div>
              <div style={{ padding: '6px 16px 8px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {PICKER_OPTIONS.map(opt => {
                  const active = pickerStyle === opt.id
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPickerStyle(opt.id)}
                      style={{
                        padding: '6px 12px', borderRadius: 10,
                        fontSize: 12, fontWeight: active ? 700 : 500,
                        fontFamily: 'Sora,system-ui', cursor: 'pointer',
                        background: active ? `${T.accent}12` : tk.inputBg,
                        color: active ? T.accent : tk.muted,
                        border: `1px solid ${active ? T.accent + '35' : tk.line}`,
                        transition: 'all .15s',
                        display: 'flex', alignItems: 'center', gap: 5,
                      }}
                    >
                      <span style={{ fontSize: 13 }}>{opt.icon}</span>
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* ── Footer ── */}
            <div style={{ flexShrink: 0, borderTop: `1px solid ${tk.line}`, padding: '12px 20px 20px' }}>
              {/* Legal */}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
                {LEGAL_ITEMS.map(item => (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => go(item.path)}
                    style={{
                      background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                      fontSize: 11, color: tk.muted, fontWeight: 500,
                      fontFamily: 'Sora,system-ui', transition: 'color .15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = T.accent)}
                    onMouseLeave={e => (e.currentTarget.style.color = tk.muted)}
                  >{item.label}</button>
                ))}
              </div>

              {/* Sign out */}
              <button
                type="button"
                onClick={() => go('/')}
                style={{
                  width: '100%', padding: '10px 0', borderRadius: 10,
                  background: 'transparent', border: `1px solid ${tk.line}`,
                  color: tk.muted, fontSize: 13, fontWeight: 600,
                  fontFamily: 'Sora,system-ui',
                  cursor: 'pointer', transition: 'all .15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#EF4444'
                  e.currentTarget.style.color = '#EF4444'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = tk.line
                  e.currentTarget.style.color = tk.muted
                }}
              >Sign Out</button>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  )
}
