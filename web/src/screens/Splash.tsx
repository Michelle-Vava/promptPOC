import { useEffect, useState } from 'react'
import { GROUPS, PROVIDERS, T } from '../lib/data'
import Shell from '../components/Shell'
import Footer from '../components/Footer'

type Role = 'customer' | 'provider'

interface SplashProps {
  onGetStarted: (role: Role) => void
}

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

export default function Splash({ onGetStarted }: SplashProps) {
  const [ready, setReady] = useState(false)
  const liveCount = PROVIDERS.length

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <Shell>
      <div style={{ minHeight: '100vh', background: T.ink, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'stretch', overflow: 'hidden' }}>

          {/* Left hero */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px 72px', position: 'relative' }}>
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'linear-gradient(rgba(255,255,255,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.022) 1px,transparent 1px)',
              backgroundSize: '36px 36px', pointerEvents: 'none',
            }} />
            <div style={{ position: 'relative' }}>
              {/* Live pill */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,92,0,.12)', border: '1px solid rgba(255,92,0,.22)',
                borderRadius: 10, padding: '6px 14px', marginBottom: 40,
                opacity: ready ? 1 : 0, transform: ready ? 'none' : 'translateY(8px)',
                transition: 'all .5s .1s',
              }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: T.accent, animation: 'pulse 2s infinite' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: T.accent, letterSpacing: '2px', textTransform: 'uppercase' }}>
                  Live in Halifax, NS
                </span>
              </div>

              <h1 style={{
                fontSize: 68, fontWeight: 900, color: T.white, lineHeight: .93,
                letterSpacing: '-3px', margin: '0 0 24px',
                opacity: ready ? 1 : 0, transform: ready ? 'none' : 'translateY(18px)',
                transition: 'all .55s .2s', fontFamily: 'Sora,system-ui',
              }}>
                Book it.<br /><span style={{ color: T.accent }}>Right now.</span>
              </h1>

              <p style={{
                fontSize: 17, color: 'rgba(255,255,255,.38)', lineHeight: 1.7,
                maxWidth: 400, margin: '0 0 48px', fontWeight: 300,
                opacity: ready ? 1 : 0, transform: ready ? 'none' : 'translateY(14px)',
                transition: 'all .55s .3s',
              }}>
                Real-time same-day bookings — hair, repair,<br />wellness & more. Free for customers, always.
              </p>

              <div style={{
                display: 'flex', gap: 12,
                opacity: ready ? 1 : 0, transform: ready ? 'none' : 'translateY(10px)',
                transition: 'all .55s .38s',
              }}>
                <button type="button" onClick={() => onGetStarted('customer')} style={{
                  padding: '15px 30px', borderRadius: 13, background: T.accent,
                  color: T.white, fontSize: 15, fontWeight: 800, border: 'none',
                  cursor: 'pointer', fontFamily: 'Sora,system-ui',
                  boxShadow: `0 4px 24px ${T.accent}55`, transition: 'transform .15s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
                >
                  Get Started — free
                </button>
                <button type="button" onClick={() => onGetStarted('provider')} style={{
                  padding: '15px 30px', borderRadius: 13,
                  background: 'rgba(255,255,255,.07)', color: 'rgba(255,255,255,.6)',
                  fontSize: 15, fontWeight: 600, border: '1px solid rgba(255,255,255,.1)',
                  cursor: 'pointer', fontFamily: 'Sora,system-ui', transition: 'background .15s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.11)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,.07)')}
                >
                  I'm a Provider
                </button>
              </div>

              {/* Live stats row */}
              <div style={{
                display: 'flex', gap: 24, marginTop: 36,
                opacity: ready ? 1 : 0, transition: 'all .5s .5s',
              }}>
                {([
                  [`${liveCount}`, 'providers live'],
                  ['$0', 'customer fee'],
                  ['$1', 'per booking'],
                ] as [string, string][]).map(([v, l]) => (
                  <div key={l}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: T.white, fontFamily: 'Sora,system-ui', letterSpacing: '-0.5px' }}>{v}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,.28)', marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div style={{
            width: 400, background: 'rgba(255,255,255,.03)',
            borderLeft: '1px solid rgba(255,255,255,.06)',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            padding: '60px 40px',
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
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', marginLeft: 4 }}>Halifax, NS · {liveCount} open today</span>
            </div>

            <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.28)', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: 28 }}>
              How it works
            </div>
            {([
              [T.accent,  '1', 'Pick a category',    'Hair, repair, wellness, dining & more'],
              ['#0066FF', '2', 'Spin the time wheel', 'See only who\'s open at that hour'],
              [T.green,   '3', 'Tap a map pin',       'View details & confirm instantly'],
              ['#7C3AED', '4', 'Done — it\'s free',   'Provider pays $1, you pay nothing'],
            ] as [string, string, string, string][]).map(([col, n, title, sub]) => (
              <div key={n} style={{ display: 'flex', gap: 14, marginBottom: 22, alignItems: 'flex-start' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: `${col}20`, border: `1px solid ${col}35`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 900, color: col, flexShrink: 0,
                }}>{n}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.white, letterSpacing: '-0.2px' }}>{title}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,.32)', marginTop: 3, lineHeight: 1.5 }}>{sub}</div>
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
        </div>

        <Footer dark />
      </div>
    </Shell>
  )
}
