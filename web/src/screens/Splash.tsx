import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { GROUPS, PROVIDERS, T } from '../lib/data'
import { useTheme } from '../lib/theme'
import { useWindowWidth } from '../hooks/useWindowWidth'
import Shell from '../components/Shell'
import Footer from '../components/Footer'

type Role = 'customer' | 'provider'

function LiveClock() {
  const [time, setTime] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  const h = time.getHours() % 12 || 12
  const m = String(time.getMinutes()).padStart(2, '0')
  const ap = time.getHours() < 12 ? 'AM' : 'PM'
  return <>{h}:{m} {ap}</>
}

export default function Splash() {
  const navigate = useNavigate()
  const [ready, setReady] = useState(false)
  const { tk, mode } = useTheme()
  const width = useWindowWidth()
  const isMobile = width < 768
  const liveCount = PROVIDERS.length

  const onGetStarted = (role: Role) => navigate({ to: '/auth', search: { role } })

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80)
    return () => clearTimeout(t)
  }, [])

  const gridColor = mode === 'dark' ? 'rgba(255,255,255,.022)' : 'rgba(0,0,0,.04)'
  const mutedAlpha = mode === 'dark' ? 'rgba(255,255,255,.28)' : 'rgba(0,0,0,.28)'
  const subtleAlpha = mode === 'dark' ? 'rgba(255,255,255,.3)' : 'rgba(0,0,0,.35)'

  return (
    <Shell>
      <div style={{ height: '100vh', background: tk.bg, display: 'flex', flexDirection: 'column', overflow: isMobile ? 'auto' : 'hidden' }}>
        {/* ── Top bar ── */}
        <nav style={{
          padding: '0 24px', height: 56, display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexShrink: 0, borderBottom: `1px solid ${tk.line}`,
          background: tk.surface, zIndex: 50,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: T.green, animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 17, fontWeight: 900, color: tk.text, letterSpacing: '-0.4px', fontFamily: 'Sora,system-ui' }}>PROMPT</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button type="button" onClick={() => onGetStarted('customer')} style={{
              padding: '8px 18px', borderRadius: 10, border: `1.5px solid ${tk.line}`,
              background: 'transparent', color: tk.text, fontSize: 13, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'Sora,system-ui', transition: 'background .15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = tk.inputBg)}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >Log in</button>
            <button type="button" onClick={() => onGetStarted('customer')} style={{
              padding: '8px 18px', borderRadius: 10, border: 'none',
              background: tk.text, color: tk.bg, fontSize: 13, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'Sora,system-ui', transition: 'opacity .15s',
            }}>Sign up</button>
          </div>
        </nav>

        <div style={{ flex: 1, display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'stretch', overflow: 'hidden' }}>

          {/* Left hero */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: isMobile ? '32px 20px' : '40px 56px', position: 'relative' }}>
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: `linear-gradient(${gridColor} 1px,transparent 1px),linear-gradient(90deg,${gridColor} 1px,transparent 1px)`,
              backgroundSize: '36px 36px', pointerEvents: 'none',
            }} />
            <div style={{ position: 'relative' }}>
              {/* Live pill */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,92,0,.12)', border: '1px solid rgba(255,92,0,.22)',
                borderRadius: 10, padding: '6px 14px', marginBottom: isMobile ? 20 : 24,
                opacity: ready ? 1 : 0, transform: ready ? 'none' : 'translateY(8px)',
                transition: 'all .5s .1s',
              }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: T.accent, animation: 'pulse 2s infinite' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: T.accent, letterSpacing: '2px', textTransform: 'uppercase' }}>
                  Live in Halifax, NS
                </span>
              </div>

              <h1 style={{
                fontSize: isMobile ? 40 : 52, fontWeight: 900, color: tk.text, lineHeight: .93,
                letterSpacing: '-2px', margin: `0 0 ${isMobile ? 16 : 18}px`,
                opacity: ready ? 1 : 0, transform: ready ? 'none' : 'translateY(18px)',
                transition: 'all .55s .2s', fontFamily: 'Sora,system-ui',
              }}>
                Book it.<br /><span style={{ color: T.accent }}>Right now.</span>
              </h1>

              <p style={{
                fontSize: isMobile ? 14 : 15, color: tk.muted, lineHeight: 1.7,
                maxWidth: 400, margin: `0 0 ${isMobile ? 18 : 20}px`, fontWeight: 300,
                opacity: ready ? 1 : 0, transform: ready ? 'none' : 'translateY(14px)',
                transition: 'all .55s .3s',
              }}>
                Same-day bookings — hair, repair, wellness & more.<br />
                Customers pay nothing. Providers pay $1. That's it.
              </p>

              {/* Traction banner */}
              <div style={{
                display: 'flex', gap: 12, marginBottom: isMobile ? 18 : 20,
                opacity: ready ? 1 : 0, transform: ready ? 'none' : 'translateY(10px)',
                transition: 'all .55s .34s',
                flexWrap: isMobile ? 'wrap' : 'nowrap',
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 14px', borderRadius: 10,
                  background: `${T.green}10`, border: `1px solid ${T.green}22`,
                }}>
                  <span style={{ fontSize: 15, fontWeight: 900, color: T.green, fontFamily: 'Sora,system-ui' }}>847</span>
                  <span style={{ fontSize: 11, color: tk.muted }}>bookings this week</span>
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 14px', borderRadius: 10,
                  background: `${T.accent}10`, border: `1px solid ${T.accent}22`,
                }}>
                  <span style={{ fontSize: 15, fontWeight: 900, color: T.accent, fontFamily: 'Sora,system-ui' }}>{liveCount}</span>
                  <span style={{ fontSize: 11, color: tk.muted }}>providers live now</span>
                </div>
              </div>

              {/* Category grid */}
              <div style={{
                display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: isMobile ? 20 : 24,
                opacity: ready ? 1 : 0, transform: ready ? 'none' : 'translateY(10px)',
                transition: 'all .55s .36s',
              }}>
                {GROUPS.map(g => (
                  <div key={g.id} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '7px 14px', borderRadius: 12,
                    background: `${g.color}10`, border: `1px solid ${g.color}20`,
                    cursor: 'pointer', transition: 'transform .15s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
                  >
                    <span style={{ fontSize: 14 }}>{g.icon}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: g.color }}>{g.label}</span>
                  </div>
                ))}
              </div>

              <div style={{
                display: 'flex', gap: 12, flexDirection: isMobile ? 'column' : 'row',
                opacity: ready ? 1 : 0, transform: ready ? 'none' : 'translateY(10px)',
                transition: 'all .55s .38s',
              }}>
                <button type="button" onClick={() => onGetStarted('customer')} style={{
                  padding: isMobile ? '14px 24px' : '15px 30px', borderRadius: 13, background: T.accent,
                  color: T.white, fontSize: 15, fontWeight: 800, border: 'none',
                  cursor: 'pointer', fontFamily: 'Sora,system-ui',
                  boxShadow: `0 4px 24px ${T.accent}55`, transition: 'transform .15s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
                >
                  Get Started — it's free
                </button>
                <button type="button" onClick={() => onGetStarted('provider')} style={{
                  padding: '15px 30px', borderRadius: 13,
                  background: tk.inputBg, color: tk.muted,
                  fontSize: 15, fontWeight: 600, border: `1px solid ${tk.inputBorder}`,
                  cursor: 'pointer', fontFamily: 'Sora,system-ui', transition: 'background .15s',
                }}>
                  I'm a Provider
                </button>
              </div>

              {/* Live stats row */}
              <div style={{
                display: isMobile ? 'none' : 'flex', gap: 24, marginTop: 24,
                opacity: ready ? 1 : 0, transition: 'all .5s .5s',
              }}>
                {([
                  [`${liveCount}`, 'providers live'],
                  ['$0', 'customer cost — always'],
                  ['$1', 'per booking — providers keep the rest'],
                ] as [string, string][]).map(([v, l]) => (
                  <div key={l}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: tk.text, fontFamily: 'Sora,system-ui', letterSpacing: '-0.5px' }}>{v}</div>
                    <div style={{ fontSize: 11, color: tk.muted, marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel — hidden on mobile */}
          {!isMobile && (
          <div style={{
            width: 400, background: tk.surface,
            borderLeft: `1px solid ${tk.line}`,
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            padding: '40px 32px',
            opacity: ready ? 1 : 0, transform: ready ? 'none' : 'translateX(18px)',
            transition: 'all .6s .32s',
          }}>
            {/* Live clock */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32,
              padding: '10px 16px', background: 'rgba(0,184,124,.08)',
              borderRadius: 12, border: '1px solid rgba(0,184,124,.15)',
            }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: T.green, animation: 'pulse 2s infinite', flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: T.green, fontFamily: 'Sora,system-ui' }}>
                <LiveClock />
              </span>
              <span style={{ fontSize: 11, color: tk.muted, marginLeft: 4 }}>Halifax, NS · {liveCount} open today</span>
            </div>

            <div style={{ fontSize: 10, fontWeight: 700, color: tk.muted, letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: 28 }}>
              How it works
            </div>
            {([
              [T.accent,  '1', 'Pick a category',    'Hair, repair, wellness, dining & more'],
              ['#0066FF', '2', 'Spin the time wheel', 'See only who\'s open at that hour'],
              [T.green,   '3', 'Tap a map pin',       'View details & confirm instantly'],
              ['#7C3AED', '4', 'Done — $0 for you', 'Provider pays just $1. They keep everything else'],
            ] as [string, string, string, string][]).map(([col, n, title, sub]) => (
              <div key={n} style={{ display: 'flex', gap: 14, marginBottom: 22, alignItems: 'flex-start' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: `${col}20`, border: `1px solid ${col}35`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 900, color: col, flexShrink: 0,
                }}>{n}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: tk.text, letterSpacing: '-0.2px' }}>{title}</div>
                  <div style={{ fontSize: 12, color: tk.muted, marginTop: 3, lineHeight: 1.5 }}>{sub}</div>
                </div>
              </div>
            ))}

            <div style={{ marginTop: 12, display: 'flex', gap: 7, flexWrap: 'wrap' }}>
              {GROUPS.map(g => (
                <div key={g.id} style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '5px 10px', borderRadius: 20,
                  background: `${g.color}15`, border: `1px solid ${g.color}22`,
                }}>
                  <span style={{ fontSize: 12 }}>{g.icon}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: g.color }}>{g.label}</span>
                </div>
              ))}
            </div>
          </div>
          )}
        </div>

        <Footer />
      </div>
    </Shell>
  )
}
