/**
 * ActivityScreen — Bookings activity view for web.
 * Shows confirmed and past bookings.
 */
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { T, PROVIDERS, GROUPS } from '../lib/data'
import { useTheme } from '../lib/theme'
import PageLayout from '../components/PageLayout'

type Tab = 'upcoming' | 'history'

const MOCK_BOOKINGS = [
  { id: 1, provider: PROVIDERS[0], time: 'Today · 2:00 PM', status: 'confirmed' as const },
  { id: 3, provider: PROVIDERS[7], time: 'Tomorrow · 10:00 AM', status: 'confirmed' as const },
  { id: 4, provider: PROVIDERS[12], time: 'Tomorrow · 1:00 PM', status: 'confirmed' as const },
]

const MOCK_HISTORY = [
  { id: 101, provider: PROVIDERS[1], time: 'Apr 5 · 11:00 AM', status: 'completed' as const },
  { id: 102, provider: PROVIDERS[5], time: 'Apr 3 · 3:00 PM', status: 'completed' as const },
  { id: 103, provider: PROVIDERS[9], time: 'Apr 1 · 9:00 AM', status: 'cancelled' as const },
  { id: 104, provider: PROVIDERS[2], time: 'Mar 28 · 2:30 PM', status: 'completed' as const },
  { id: 105, provider: PROVIDERS[14], time: 'Mar 25 · 5:00 PM', status: 'completed' as const },
]

export default function ActivityScreen() {
  const { tk, mode } = useTheme()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('upcoming')

  const groupColor = (g: string) => GROUPS.find(gr => gr.id === g)?.color ?? T.accent

  return (
    <PageLayout>

          <div style={{ fontSize: 28, fontWeight: 900, color: tk.text, letterSpacing: '-1px', marginBottom: 6, fontFamily: 'Sora,system-ui' }}>
            Activity
          </div>
          <p style={{ fontSize: 14, color: tk.muted, marginBottom: 24 }}>Your bookings &amp; history</p>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 28, background: tk.inputBg, padding: 4, borderRadius: 12 }}>
            {(['upcoming', 'history'] as Tab[]).map(t => (
              <button type="button" key={t} onClick={() => setTab(t)} style={{
                flex: 1, padding: '10px', borderRadius: 9, border: 'none',
                fontSize: 13, fontWeight: 700,
                background: tab === t ? tk.text : 'transparent',
                color: tab === t ? tk.bg : tk.muted,
                fontFamily: 'Sora,system-ui', cursor: 'pointer', transition: 'all .15s',
                textTransform: 'capitalize',
              }}>
                {t}
              </button>
            ))}
          </div>

          {/* Upcoming bookings */}
          {tab === 'upcoming' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {MOCK_BOOKINGS.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: tk.muted }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
                  <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>No upcoming bookings</div>
                  <div style={{ fontSize: 13 }}>Book a service to get started</div>
                </div>
              ) : (
                <>
                  {/* Confirmed section */}
                  <div style={{ fontSize: 11, fontWeight: 700, color: tk.muted, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 4 }}>
                    Confirmed
                  </div>
                  {MOCK_BOOKINGS.filter(b => b.status === 'confirmed').map(b => (
                    <div key={b.id} style={{
                      background: tk.card, borderRadius: 16, padding: '16px 20px',
                      border: `1px solid ${tk.line}`, display: 'flex', alignItems: 'center', gap: 14,
                      boxShadow: '0 1px 8px rgba(0,0,0,.04)',
                    }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 12,
                        background: groupColor(b.provider.cat),
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18, color: '#fff', fontWeight: 800,
                      }}>
                        {b.provider.name.charAt(0)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: tk.text }}>{b.provider.name}</div>
                        <div style={{ fontSize: 12, color: tk.muted, marginTop: 2 }}>{b.time}</div>
                      </div>
                      <div style={{
                        padding: '4px 10px', borderRadius: 8,
                        background: 'rgba(0,184,124,.12)', color: T.green,
                        fontSize: 11, fontWeight: 700,
                      }}>
                        Confirmed
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {/* History */}
          {tab === 'history' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {MOCK_HISTORY.map(b => (
                <div key={b.id} style={{
                  background: tk.card, borderRadius: 16, padding: '16px 20px',
                  border: `1px solid ${tk.line}`, display: 'flex', alignItems: 'center', gap: 14,
                  boxShadow: '0 1px 8px rgba(0,0,0,.04)',
                  opacity: b.status === 'cancelled' ? 0.6 : 1,
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: groupColor(b.provider.cat),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, color: '#fff', fontWeight: 800,
                  }}>
                    {b.provider.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: tk.text }}>{b.provider.name}</div>
                    <div style={{ fontSize: 12, color: tk.muted, marginTop: 2 }}>{b.time}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <div style={{
                      padding: '4px 10px', borderRadius: 8,
                      background: b.status === 'completed' ? 'rgba(0,184,124,.12)' : 'rgba(204,0,0,.08)',
                      color: b.status === 'completed' ? T.green : '#CC2200',
                      fontSize: 11, fontWeight: 700,
                    }}>
                      {b.status === 'completed' ? 'Completed' : 'Cancelled'}
                    </div>
                    {b.status === 'completed' && (
                      <button type="button" style={{
                        background: 'none', border: 'none', color: T.accent,
                        fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora,system-ui',
                      }}>
                        Rebook
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
    </PageLayout>
  )
}
