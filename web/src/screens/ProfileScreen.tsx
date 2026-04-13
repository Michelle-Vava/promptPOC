import { useState } from 'react'
import { T } from '../lib/data'
import { useTheme } from '../lib/theme'
import Shell from '../components/Shell'
import Footer from '../components/Footer'

interface ProfileScreenProps {
  onBack: () => void
  onSignOut: () => void
}

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

export default function ProfileScreen({ onBack, onSignOut }: ProfileScreenProps) {
  const { tk, mode, toggle } = useTheme()
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
          background: T.ink, padding: '0 24px', height: 58,
          display: 'flex', alignItems: 'center', gap: 12,
          borderBottom: '1px solid rgba(255,255,255,.06)',
        }}>
          <button type="button" onClick={onBack} style={{
            background: 'none', border: 'none', color: 'rgba(255,255,255,.5)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 13, fontFamily: 'Sora,system-ui',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>
          <span style={{ fontSize: 16, fontWeight: 800, color: T.white, fontFamily: 'Sora,system-ui' }}>Profile</span>
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

            {/* Legal links */}
            <div style={{
              background: tk.card, borderRadius: 20, padding: '8px 24px',
              boxShadow: '0 1px 12px rgba(0,0,0,.06)', marginBottom: 20,
              border: `1px solid ${tk.line}`,
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: tk.muted, textTransform: 'uppercase', letterSpacing: '1.5px', padding: '14px 0 6px' }}>
                Legal
              </div>
              {(['Terms of Service', 'Privacy Policy', 'Cookie Policy'] as const).map(label => (
                <div key={label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '13px 0', borderBottom: `1px solid ${tk.line}`,
                }}>
                  <span style={{ fontSize: 14, color: tk.text, fontWeight: 500 }}>{label}</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 3l4 4-4 4" stroke={tk.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              ))}
            </div>

            {/* Sign out */}
            <button type="button" onClick={onSignOut} style={{
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
