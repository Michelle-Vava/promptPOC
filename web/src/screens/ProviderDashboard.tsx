import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { T } from '../lib/data'
import { useTheme } from '../lib/theme'
import Shell from '../components/Shell'
import Footer from '../components/Footer'

interface Request { id: number; time: string; customer: string }
interface AcceptedBooking { id: number; time: string; customer: string }

const BILLING_ROWS = [
  { date: 'Apr 8, 2025', id: 'BK-1041', amount: '$1.00', status: 'Charged' },
  { date: 'Apr 8, 2025', id: 'BK-1040', amount: '$1.00', status: 'Charged' },
  { date: 'Apr 7, 2025', id: 'BK-1039', amount: '$1.00', status: 'Charged' },
  { date: 'Apr 7, 2025', id: 'BK-1038', amount: '$1.00', status: 'Charged' },
  { date: 'Apr 6, 2025', id: 'BK-1037', amount: '$1.00', status: 'Charged' },
  { date: 'Apr 5, 2025', id: 'BK-1036', amount: '$1.00', status: 'Charged' },
]

const SLOT_HOURS = ['8 AM','9 AM','10 AM','11 AM','12 PM','1 PM','2 PM','3 PM','4 PM','5 PM','6 PM','7 PM','8 PM']
const DURATIONS = [15, 20, 30, 45, 60, 90]

function to24(h: string) {
  const [n, m] = h.split(' ')
  let num = parseInt(n)
  if (m === 'PM' && num !== 12) num += 12
  if (m === 'AM' && num === 12) num = 0
  return num
}

function generateSlots(start: string, end: string, dur: number): string[] {
  const s = to24(start), e = to24(end)
  const slots: string[] = []
  for (let h = s; h < e; h++) {
    for (let m = 0; m < 60; m += dur) {
      if (h * 60 + m + dur > e * 60) break
      const hour = h > 12 ? h - 12 : h === 0 ? 12 : h
      const ampm = h < 12 ? 'AM' : 'PM'
      slots.push(m === 0 ? `${hour} ${ampm}` : `${hour}:${String(m).padStart(2,'0')} ${ampm}`)
    }
  }
  return slots
}

export default function ProviderDashboard() {
  const navigate = useNavigate()
  const { tk } = useTheme()
  const [tab, setTab]   = useState<'dashboard' | 'account'>('dashboard')
  const [isLive, setIsLive] = useState(true)

  // Slots state
  const [editingSlots, setEditingSlots] = useState(false)
  const [startHour, setStartHour] = useState('9 AM')
  const [endHour, setEndHour]     = useState('6 PM')
  const [slotDur, setSlotDur]     = useState(30)
  const [savedStart, setSavedStart] = useState('9 AM')
  const [savedEnd, setSavedEnd]     = useState('6 PM')
  const [savedDur, setSavedDur]     = useState(30)

  // Requests state
  const [requests, setRequests] = useState<Request[]>([
    { id: 1, time: '2:00 PM', customer: 'Alex K.' },
    { id: 2, time: '4:30 PM', customer: 'Sarah M.' },
  ])
  const [accepted, setAccepted] = useState<AcceptedBooking[]>([])

  const handleAccept = (r: Request) => {
    setAccepted(a => [...a, { id: r.id, time: r.time, customer: r.customer }])
    setRequests(rs => rs.filter(x => x.id !== r.id))
  }
  const handleReject = (id: number) => setRequests(rs => rs.filter(x => x.id !== id))

  const handleSaveSlots = () => {
    setSavedStart(startHour)
    setSavedEnd(endHour)
    setSavedDur(slotDur)
    setEditingSlots(false)
  }

  const previewSlots = generateSlots(startHour, endHour, slotDur)
  const bookingsToday = 3 + accepted.length
  const chargedToday  = 3 + accepted.length

  const TabBtn = ({ id, label }: { id: typeof tab; label: string }) => (
    <button type="button" onClick={() => setTab(id)} style={{
      padding: '8px 20px', borderRadius: 20, border: 'none', cursor: 'pointer',
      fontSize: 13, fontWeight: 700, fontFamily: 'Sora,system-ui',
      background: tab === id ? tk.card : 'transparent',
      color: tab === id ? tk.text : tk.muted,
      transition: 'all .15s',
    }}>{label}</button>
  )

  const selectStyle = {
    background: tk.surface, border: `1px solid ${tk.line}`, borderRadius: 8,
    color: tk.text, fontSize: 13, fontWeight: 600, padding: '8px 10px',
    cursor: 'pointer', fontFamily: 'Sora,system-ui', outline: 'none', width: '100%',
  }

  return (
    <Shell>
      <div style={{ minHeight: '100vh', background: tk.bg, display: 'flex', flexDirection: 'column' }}>
        {/* Nav */}
        <div style={{
          background: tk.surface, padding: '0 40px', height: 58,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: `1px solid ${tk.line}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: T.green, animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 16, fontWeight: 900, color: tk.text, letterSpacing: '-0.4px', fontFamily: 'Sora,system-ui' }}>PROMPT</span>
            <div style={{ display: 'flex', gap: 2, marginLeft: 16, background: tk.inputBg, borderRadius: 24, padding: 3 }}>
              <TabBtn id="dashboard" label="Dashboard" />
              <TabBtn id="account"   label="Account" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button type="button" onClick={() => navigate({ to: '/map' })} style={{
              padding: '7px 14px', borderRadius: 20,
              background: tk.inputBg, border: `1px solid ${tk.inputBorder}`,
              color: tk.muted, fontSize: 12, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'Sora,system-ui',
            }}>Customer view</button>
            <button type="button" onClick={() => navigate({ to: '/' })} style={{
              fontSize: 12, color: tk.muted, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            }}>Sign out</button>
          </div>
        </div>

        {/* ── Live toggle banner ────────────────────────────────────────────── */}
        <div style={{
          background: isLive ? 'rgba(0,184,124,.08)' : 'rgba(255,92,0,.06)',
          borderBottom: `1px solid ${isLive ? 'rgba(0,184,124,.18)' : 'rgba(255,92,0,.15)'}`,
          padding: '10px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: isLive ? T.green : T.accent, animation: isLive ? 'pulse 2s infinite' : 'none' }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: isLive ? T.green : T.accent, fontFamily: 'Sora,system-ui' }}>
              {isLive ? 'You\'re live · accepting bookings' : 'Paused · not visible to customers'}
            </span>
          </div>
          <button type="button" onClick={() => setIsLive(v => !v)} style={{
            padding: '7px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700,
            background: isLive ? 'rgba(204,0,0,.1)' : 'rgba(0,184,124,.15)',
            color: isLive ? '#CC2200' : T.green,
            border: `1px solid ${isLive ? 'rgba(204,0,0,.2)' : 'rgba(0,184,124,.25)'}`,
            cursor: 'pointer', fontFamily: 'Sora,system-ui', transition: 'all .15s',
          }}>
            {isLive ? 'Pause' : 'Go Live'}
          </button>
        </div>

        {/* ── Dashboard tab ─────────────────────────────────────────────────── */}
        {tab === 'dashboard' && (
          <div style={{ flex: 1 }}>
          <div style={{ maxWidth: 880, margin: '0 auto', padding: '40px' }}>
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: tk.text, letterSpacing: '-1px', fontFamily: 'Sora,system-ui' }}>Dashboard</div>
              <p style={{ fontSize: 14, color: tk.muted, marginTop: 4 }}>$1 per confirmed booking · Always</p>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
              {([
                ['📅', String(bookingsToday), 'Bookings today'],
                ['💰', `$${chargedToday}`, 'Platform fee today'],
                ['⭐', '4.8', 'Rating'],
                ['📈', '$847', 'Earned this week'],
              ] as [string, string, string][]).map(([ic, v, l]) => (
                <div key={l} style={{ background: tk.card, borderRadius: 18, padding: '24px 20px', boxShadow: '0 1px 8px rgba(0,0,0,.05)', textAlign: 'center', border: `1px solid ${tk.line}` }}>
                  <div style={{ fontSize: 28 }}>{ic}</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: tk.text, marginTop: 8, letterSpacing: '-1px', fontFamily: 'Sora,system-ui' }}>{v}</div>
                  <div style={{ fontSize: 12, color: tk.muted, marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

              {/* ── Availability card ── */}
              <div style={{ background: tk.card, borderRadius: 18, padding: '24px', boxShadow: '0 1px 8px rgba(0,0,0,.05)', border: `1px solid ${tk.line}` }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: tk.text, marginBottom: 16, fontFamily: 'Sora,system-ui' }}>Today's availability</div>

                {!editingSlots ? (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                      {([['Start', savedStart], ['End', savedEnd], ['Slot', `${savedDur} min`]] as [string, string][]).map(([l, v]) => (
                        <div key={l}>
                          <div style={{ fontSize: 10, color: tk.muted, textTransform: 'uppercase', letterSpacing: '1px' }}>{l}</div>
                          <div style={{ fontSize: 16, fontWeight: 800, color: tk.text, marginTop: 4, fontFamily: 'Sora,system-ui' }}>{v}</div>
                        </div>
                      ))}
                    </div>
                    {/* Slot chips preview */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 16 }}>
                      {generateSlots(savedStart, savedEnd, savedDur).map(s => (
                        <span key={s} style={{
                          fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 6,
                          background: `${T.green}18`, color: T.green, border: `1px solid ${T.green}28`,
                        }}>{s}</span>
                      ))}
                    </div>
                    <button type="button" onClick={() => setEditingSlots(true)} style={{
                      width: '100%', padding: '13px', borderRadius: 12,
                      background: tk.text, color: tk.bg, fontSize: 13, fontWeight: 700,
                      border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                    }}>Update my slots</button>
                  </>
                ) : (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
                      <div>
                        <div style={{ fontSize: 10, color: tk.muted, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 5 }}>Start</div>
                        <select value={startHour} onChange={e => setStartHour(e.target.value)} style={selectStyle}>
                          {SLOT_HOURS.slice(0, -1).map(h => <option key={h} value={h}>{h}</option>)}
                        </select>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: tk.muted, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 5 }}>End</div>
                        <select value={endHour} onChange={e => setEndHour(e.target.value)} style={selectStyle}>
                          {SLOT_HOURS.slice(1).map(h => <option key={h} value={h}>{h}</option>)}
                        </select>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: tk.muted, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 5 }}>Duration</div>
                        <select value={slotDur} onChange={e => setSlotDur(Number(e.target.value))} style={selectStyle}>
                          {DURATIONS.map(d => <option key={d} value={d}>{d} min</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Preview slots */}
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 10, color: tk.muted, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 7 }}>
                        Preview · {previewSlots.length} slots
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, maxHeight: 68, overflowY: 'auto' }}>
                        {previewSlots.length > 0
                          ? previewSlots.map(s => (
                              <span key={s} style={{
                                fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 6,
                                background: `${T.accent}15`, color: T.accent, border: `1px solid ${T.accent}28`,
                              }}>{s}</span>
                            ))
                          : <span style={{ fontSize: 12, color: tk.muted }}>End must be after start</span>
                        }
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <button type="button" onClick={handleSaveSlots} disabled={previewSlots.length === 0} style={{
                        flex: 1, padding: '11px', borderRadius: 10,
                        background: previewSlots.length > 0 ? T.green : tk.line,
                        color: previewSlots.length > 0 ? T.white : tk.muted,
                        fontSize: 13, fontWeight: 700, border: 'none',
                        cursor: previewSlots.length > 0 ? 'pointer' : 'not-allowed', fontFamily: 'inherit',
                      }}>Save</button>
                      <button type="button" onClick={() => { setStartHour(savedStart); setEndHour(savedEnd); setSlotDur(savedDur); setEditingSlots(false) }} style={{
                        flex: 1, padding: '11px', borderRadius: 10,
                        background: tk.surface, color: tk.text,
                        fontSize: 13, fontWeight: 600, border: `1px solid ${tk.line}`,
                        cursor: 'pointer', fontFamily: 'inherit',
                      }}>Cancel</button>
                    </div>
                  </>
                )}
              </div>

              {/* ── Requests card ── */}
              <div style={{ background: tk.card, borderRadius: 18, padding: '24px', boxShadow: '0 1px 8px rgba(0,0,0,.05)', border: `1px solid ${tk.line}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: tk.text, fontFamily: 'Sora,system-ui' }}>Incoming requests</div>
                  {requests.length > 0 && (
                    <span style={{ fontSize: 11, fontWeight: 700, background: `${T.accent}18`, color: T.accent, padding: '2px 8px', borderRadius: 8 }}>
                      {requests.length} pending
                    </span>
                  )}
                </div>

                {requests.length === 0 && accepted.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '24px 0', color: tk.muted, fontSize: 13 }}>No pending requests</div>
                )}

                {requests.map(r => (
                  <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderTop: `1px solid ${tk.line}` }}>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: tk.text }}>{r.time}</span>
                      <span style={{ fontSize: 12, color: tk.muted, marginLeft: 6 }}>· {r.customer}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button type="button" onClick={() => handleAccept(r)} style={{
                        padding: '7px 14px', borderRadius: 9, background: 'rgba(0,184,124,.1)',
                        color: T.green, fontSize: 12, fontWeight: 800, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                      }}>✓ $1</button>
                      <button type="button" onClick={() => handleReject(r.id)} style={{
                        padding: '7px 14px', borderRadius: 9, background: 'rgba(204,0,0,.08)',
                        color: '#CC0000', fontSize: 12, fontWeight: 800, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                      }}>✗</button>
                    </div>
                  </div>
                ))}

                {accepted.length > 0 && (
                  <>
                    <div style={{ fontSize: 10, fontWeight: 700, color: tk.muted, textTransform: 'uppercase', letterSpacing: '1px', marginTop: 16, marginBottom: 6 }}>Confirmed today</div>
                    {accepted.map(a => (
                      <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderTop: `1px solid ${tk.line}` }}>
                        <div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: tk.text }}>{a.time}</span>
                          <span style={{ fontSize: 12, color: tk.muted, marginLeft: 6 }}>· {a.customer}</span>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: T.green, background: 'rgba(0,184,124,.1)', padding: '3px 8px', borderRadius: 6 }}>Confirmed</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
          </div>
        )}

        {/* ── Account tab ───────────────────────────────────────────────────── */}
        {tab === 'account' && (
          <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px' }}>
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: tk.text, letterSpacing: '-1px', fontFamily: 'Sora,system-ui' }}>Account</div>
            </div>

            {/* Business info */}
            <div style={{ background: tk.card, borderRadius: 18, padding: '24px', marginBottom: 16, boxShadow: '0 1px 8px rgba(0,0,0,.05)', border: `1px solid ${tk.line}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: tk.muted, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 16 }}>Business</div>
              {([
                ['Business name', "Tom's Barbershop"],
                ['Category',      '✂️ Hair'],
                ['Address',       '88 Spring Garden Rd'],
                ['Rating',        '⭐ 4.8 (201 reviews)'],
              ] as [string, string][]).map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${tk.line}` }}>
                  <span style={{ fontSize: 13, color: tk.muted }}>{l}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: tk.text }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Payment method */}
            <div style={{ background: tk.card, borderRadius: 18, padding: '24px', marginBottom: 16, boxShadow: '0 1px 8px rgba(0,0,0,.05)', border: `1px solid ${tk.line}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: tk.muted, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 16 }}>Payment method</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 30, borderRadius: 6, background: '#1A1F71', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 10, fontWeight: 900, color: '#fff', letterSpacing: '0.5px' }}>VISA</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: tk.text }}>•••• •••• •••• 4242</div>
                    <div style={{ fontSize: 11, color: tk.muted, marginTop: 2 }}>Expires 09/27</div>
                  </div>
                </div>
                <button type="button" style={{
                  padding: '7px 14px', borderRadius: 10, background: tk.surface,
                  border: `1px solid ${tk.line}`, color: tk.text,
                  fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                }}>Update card</button>
              </div>
            </div>

            {/* Billing history */}
            <div style={{ background: tk.card, borderRadius: 18, padding: '24px', boxShadow: '0 1px 8px rgba(0,0,0,.05)', border: `1px solid ${tk.line}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: tk.muted, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 16 }}>Billing history</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 80px', gap: 0 }}>
                {['Date', 'Booking ID', 'Amount', 'Status'].map(h => (
                  <div key={h} style={{ fontSize: 10, fontWeight: 700, color: tk.muted, textTransform: 'uppercase', letterSpacing: '1px', padding: '0 0 10px' }}>{h}</div>
                ))}
                {BILLING_ROWS.map(row => (
                  <>
                    <div key={row.id + 'd'} style={{ fontSize: 13, color: tk.sub, padding: '10px 0', borderTop: `1px solid ${tk.line}` }}>{row.date}</div>
                    <div key={row.id + 'i'} style={{ fontSize: 13, color: tk.muted, padding: '10px 0', borderTop: `1px solid ${tk.line}`, fontFamily: 'monospace' }}>{row.id}</div>
                    <div key={row.id + 'a'} style={{ fontSize: 13, fontWeight: 700, color: tk.text, padding: '10px 0', borderTop: `1px solid ${tk.line}` }}>{row.amount}</div>
                    <div key={row.id + 's'} style={{ padding: '10px 0', borderTop: `1px solid ${tk.line}` }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: T.green, background: 'rgba(0,184,124,.1)', padding: '3px 8px', borderRadius: 6 }}>{row.status}</span>
                    </div>
                  </>
                ))}
              </div>
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${tk.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: tk.muted }}>This month · 6 bookings</span>
                <span style={{ fontSize: 16, fontWeight: 900, color: tk.text, fontFamily: 'Sora,system-ui' }}>$6.00</span>
              </div>
            </div>
          </div>
        )}
        <Footer />
      </div>
    </Shell>
  )
}
