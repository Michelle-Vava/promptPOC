import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { T } from '../lib/data'
import { useTheme } from '../lib/theme'
import { usePickerStyle, type PickerStyle } from '../lib/picker-style'
import Shell from '../components/Shell'
import Footer from '../components/Footer'

function Toggle({ on, onToggle, color = T.accent, 'aria-label': ariaLabel }: {
  on: boolean; onToggle: () => void; color?: string; 'aria-label'?: string
}) {
  return (
    <button type="button" onClick={onToggle} aria-label={ariaLabel} aria-pressed={on} style={{
      width: 44, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer',
      background: on ? color : 'rgba(0,0,0,.15)',
      position: 'relative', transition: 'background .2s', flexShrink: 0,
    }}>
      <div style={{
        position: 'absolute', top: 3, left: on ? 21 : 3,
        width: 20, height: 20, borderRadius: '50%', background: '#fff',
        transition: 'left .2s', boxShadow: '0 1px 4px rgba(0,0,0,.2)',
      }} />
    </button>
  )
}

export default function ProfileScreen() {
  const { tk, mode, toggle } = useTheme()
  const navigate = useNavigate()
  const { pickerStyle, setPickerStyle } = usePickerStyle()
  const [pushNotifs, setPushNotifs]         = useState(true)
  const [emailReminders, setEmailReminders] = useState(false)

  const initials    = 'JD'
  const name        = 'Jane Doe'
  const email       = 'jane@email.com'
  const memberSince = 'April 2025'

  const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 0', borderBottom: `1px solid ${tk.line}`,
    }}>
      <span style={{ fontSize: 14, color: tk.text, fontWeight: 500 }}>{label}</span>
      {children}
    </div>
  )

  return (
    <Shell>
      <div style={{ minHeight: '100vh', background: tk.bg, display: 'flex', flexDirection: 'column' }}>
        {/* Nav */}
        <div style={{
          background: tk.surface, padding: '0 24px', height: 58,
          display: 'flex', alignItems: 'center', gap: 12,
          borderBottom: `1px solid ${tk.line}`,
        }}>
          <button type="button" onClick={() => navigate({ to: '/map' })} style={{
            background: 'none', border: 'none', color: tk.muted,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 13, fontFamily: 'Sora,system-ui',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>
          <span style={{ fontSize: 16, fontWeight: 800, color: tk.text, fontFamily: 'Sora,system-ui' }}>Profile</span>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ maxWidth: 480, margin: '0 auto', padding: '32px 24px' }}>

            {/* Avatar card */}
            <div style={{
              background: tk.card, borderRadius: 20, padding: '28px 24px',
              boxShadow: '0 1px 12px rgba(0,0,0,.06)', marginBottom: 20,
              border: `1px solid ${tk.line}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 20,
                  background: `${T.accent}22`, border: `2px solid ${T.accent}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, fontWeight: 900, color: T.accent, fontFamily: 'Sora,system-ui',
                  flexShrink: 0,
                }}>{initials}</div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: tk.text, fontFamily: 'Sora,system-ui', letterSpacing: '-0.3px' }}>{name}</div>
                  <div style={{ fontSize: 13, color: tk.muted, marginTop: 3 }}>{email}</div>
                  <div style={{ fontSize: 11, color: tk.muted, marginTop: 4 }}>Member since {memberSince}</div>
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20,
            }}>
              {([
                ['12', 'Bookings'],
                ['$0', 'Total cost'],
                ['4.9', 'Avg rating'],
              ] as [string, string][]).map(([v, l]) => (
                <div key={l} style={{
                  background: tk.card, borderRadius: 16, padding: '16px 12px',
                  textAlign: 'center', border: `1px solid ${tk.line}`,
                  boxShadow: '0 1px 8px rgba(0,0,0,.04)',
                }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: tk.text, fontFamily: 'Sora,system-ui', letterSpacing: '-0.5px' }}>{v}</div>
                  <div style={{ fontSize: 11, color: tk.muted, marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>

            {/* Switch to provider */}
            <button type="button" onClick={() => navigate({ to: '/provider' })} style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: `${T.accent}0A`, borderRadius: 16, padding: '16px 20px',
              border: `1px solid ${T.accent}20`, cursor: 'pointer', marginBottom: 20,
              transition: 'background .15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = `${T.accent}14`)}
            onMouseLeave={e => (e.currentTarget.style.background = `${T.accent}0A`)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 12,
                  background: `${T.accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18,
                }}>🔧</div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: tk.text, fontFamily: 'Sora,system-ui' }}>Switch to Provider</div>
                  <div style={{ fontSize: 12, color: tk.muted, marginTop: 2 }}>Manage bookings · $1 per confirmed</div>
                </div>
              </div>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 3l5 5-5 5" stroke={T.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Preferences */}
            <div style={{
              background: tk.card, borderRadius: 20, padding: '8px 24px',
              boxShadow: '0 1px 12px rgba(0,0,0,.06)', marginBottom: 20,
              border: `1px solid ${tk.line}`,
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: tk.muted, textTransform: 'uppercase', letterSpacing: '1.5px', padding: '14px 0 6px' }}>
                Preferences
              </div>
              <Row label="Push Notifications">
                <Toggle on={pushNotifs} onToggle={() => setPushNotifs(v => !v)} aria-label="Push Notifications" />
              </Row>
              <Row label="Email Reminders">
                <Toggle on={emailReminders} onToggle={() => setEmailReminders(v => !v)} aria-label="Email Reminders" />
              </Row>
              <Row label={mode === 'dark' ? 'Dark Mode' : 'Light Mode'}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, color: tk.muted }}>{mode === 'dark' ? '🌙' : '☀️'}</span>
                  <Toggle on={mode === 'dark'} onToggle={toggle} color="#7C3AED" aria-label={mode === 'dark' ? 'Disable dark mode' : 'Enable dark mode'} />
                </div>
              </Row>
            </div>

            {/* Booking Preferences */}
            <div style={{
              background: tk.card, borderRadius: 20, padding: '8px 24px',
              boxShadow: '0 1px 12px rgba(0,0,0,.06)', marginBottom: 20,
              border: `1px solid ${tk.line}`,
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: tk.muted, textTransform: 'uppercase', letterSpacing: '1.5px', padding: '14px 0 6px' }}>
                Booking Preferences
              </div>
              <Row label="Time Picker Style">
                <div style={{ display: 'flex', gap: 6 }}>
                  {(['wheel', 'dial'] as PickerStyle[]).map(opt => {
                    const active = opt === pickerStyle
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setPickerStyle(opt)}
                        style={{
                          padding: '6px 14px', borderRadius: 12, fontSize: 12,
                          fontWeight: active ? 700 : 400,
                          fontFamily: 'Sora,system-ui', cursor: 'pointer',
                          background: active ? `${T.accent}18` : 'transparent',
                          border: `1px solid ${active ? T.accent + '50' : tk.line}`,
                          color: active ? T.accent : tk.muted,
                          transition: 'all .15s',
                        }}
                      >
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </button>
                    )
                  })}
                </div>
              </Row>
            </div>

            {/* Legal links */}
            <div style={{
              background: tk.card, borderRadius: 20, padding: '8px 24px',
              boxShadow: '0 1px 12px rgba(0,0,0,.06)', marginBottom: 20,
              border: `1px solid ${tk.line}`,
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: tk.muted, textTransform: 'uppercase', letterSpacing: '1.5px', padding: '14px 0 6px' }}>
                Legal
              </div>
              {(['Terms of Service', 'Privacy Policy', 'Cookie Policy'] as const).map(label => {
                const route = label === 'Terms of Service' ? '/legal/terms' : label === 'Privacy Policy' ? '/legal/privacy' : '/legal/cookies'
                return (
                <div key={label} onClick={() => navigate({ to: route })} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '13px 0', borderBottom: `1px solid ${tk.line}`, cursor: 'pointer',
                }}>
                  <span style={{ fontSize: 14, color: tk.text, fontWeight: 500 }}>{label}</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 3l4 4-4 4" stroke={tk.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )})}
            </div>

            {/* Help & Support */}
            <div style={{
              background: tk.card, borderRadius: 20, padding: '8px 24px',
              boxShadow: '0 1px 12px rgba(0,0,0,.06)', marginBottom: 20,
              border: `1px solid ${tk.line}`,
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: tk.muted, textTransform: 'uppercase', letterSpacing: '1.5px', padding: '14px 0 6px' }}>
                Help & Support
              </div>
              {([
                { label: 'FAQ', icon: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-14v1m0 4h.01', route: '/help/faq' },
                { label: 'Contact Support', icon: 'M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z', route: '/help/contact' },
                { label: 'Report a Problem', icon: 'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4m0 4h.01', route: '/help/report' },
              ]).map(item => (
                <div key={item.label} onClick={() => navigate({ to: item.route })} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '13px 0', borderBottom: `1px solid ${tk.line}`, cursor: 'pointer',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={item.icon} />
                    </svg>
                    <span style={{ fontSize: 14, color: tk.text, fontWeight: 500 }}>{item.label}</span>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 3l4 4-4 4" stroke={tk.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              ))}
            </div>

            {/* Sign out */}
            <button type="button" onClick={() => navigate({ to: '/' })} style={{
              width: '100%', padding: '15px', borderRadius: 13,
              background: 'rgba(204,0,0,.08)', color: '#CC2200',
              fontSize: 14, fontWeight: 700, border: '1px solid rgba(204,0,0,.15)',
              cursor: 'pointer', fontFamily: 'Sora,system-ui', transition: 'background .15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(204,0,0,.14)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(204,0,0,.08)')}
            >Sign out</button>

            <p style={{ fontSize: 11, color: tk.muted, textAlign: 'center', marginTop: 20, lineHeight: 1.7 }}>
              Prompt v1.0.0 · © {new Date().getFullYear()} Prompt Technologies Inc.
            </p>
          </div>
        </div>

        <Footer />
      </div>
    </Shell>
  )
}
