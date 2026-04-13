import { useState } from 'react'
import { T } from '../lib/data'
import Shell from '../components/Shell'
import AuthInput from '../components/AuthInput'
import Footer from '../components/Footer'

type Role = 'customer' | 'provider'
type AuthMode = 'login' | 'signup'

interface AuthProps {
  role: Role
  onBack: () => void
  onSubmit: () => void
}

function SocialBtn({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button type="button" style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      padding: '12px', borderRadius: 11, border: '1.5px solid rgba(255,255,255,.1)',
      background: 'rgba(255,255,255,.05)', color: 'rgba(255,255,255,.7)',
      fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Sora,system-ui',
      transition: 'background .15s',
    }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.09)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,.05)')}
    >
      {icon}{label}
    </button>
  )
}

export default function Auth({ role, onBack, onSubmit }: AuthProps) {
  const [authMode, setAuthMode] = useState<AuthMode>('login')

  return (
    <Shell>
      <div style={{ minHeight: '100vh', background: T.ink, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
          <div style={{ width: '100%', maxWidth: 420, animation: 'fadeUp .32s ease' }}>
            <button type="button" onClick={onBack} style={{
              background: 'none', border: 'none', color: 'rgba(255,255,255,.35)',
              fontSize: 13, cursor: 'pointer', marginBottom: 28,
              display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Sora,system-ui',
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back
            </button>

            <div style={{ fontSize: 30, fontWeight: 900, color: T.white, letterSpacing: '-1px', marginBottom: 6, fontFamily: 'Sora,system-ui' }}>
              {role === 'customer' ? 'Welcome.' : 'List your slots.'}
            </div>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,.32)', marginBottom: 28, lineHeight: 1.6 }}>
              {role === 'customer' ? 'Book anything today. Zero fees, forever.' : '$1 per booking confirmed.'}
            </p>

            {/* Social login */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              <SocialBtn label="Apple" icon={
                <svg width="16" height="16" viewBox="0 0 16 16" fill="rgba(255,255,255,.7)">
                  <path d="M11.182 0c.087.7-.205 1.403-.618 1.9-.414.498-1.053.87-1.69.82-.1-.65.22-1.33.614-1.8C9.886.46 10.57.09 11.182 0zM13.5 10.8c-.28.85-.65 1.64-1.15 2.35-.67.96-1.37 1.92-2.44 1.93-1.05.01-1.39-.62-2.6-.61-1.2.01-1.57.63-2.62.62-1.07-.01-1.74-.96-2.4-1.92C1 11.36.5 9.1.5 6.9c0-3.28 2.13-5.02 4.23-5.05.98-.02 1.9.66 2.5.66.6 0 1.72-.81 2.9-.69.5.02 1.9.2 2.8 1.51-.07.04-1.67.97-1.65 2.9.02 2.29 2.02 3.05 2.22 3.12z"/>
                </svg>
              } />
              <SocialBtn label="Google" icon={
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" fill="rgba(255,255,255,.7)"/>
                </svg>
              } />
            </div>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.08)' }} />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,.24)', fontWeight: 600 }}>or continue with email</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.08)' }} />
            </div>

            {/* Tab toggle */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 24, background: 'rgba(255,255,255,.06)', padding: 4, borderRadius: 12 }}>
              {(['login', 'signup'] as AuthMode[]).map(m => (
                <button type="button" key={m} onClick={() => setAuthMode(m)} style={{
                  flex: 1, padding: '10px', borderRadius: 9, border: 'none',
                  fontSize: 13, fontWeight: 700,
                  background: authMode === m ? T.white : 'transparent',
                  color: authMode === m ? T.ink : 'rgba(255,255,255,.4)',
                  fontFamily: 'Sora,system-ui', cursor: 'pointer', transition: 'all .15s',
                }}>
                  {m === 'login' ? 'Log in' : 'Sign up'}
                </button>
              ))}
            </div>

            {authMode === 'signup' && role === 'provider' && (
              <AuthInput label="Business name" placeholder="e.g. Tom's Barbershop" />
            )}
            {authMode === 'signup' && <AuthInput label="Full name" placeholder="Jane Doe" />}
            <AuthInput label="Email" placeholder="you@email.com" type="email" />
            <AuthInput label="Password" placeholder="••••••••" type="password" />
            {authMode === 'signup' && role === 'provider' && (
              <>
                <AuthInput label="Business address" placeholder="123 Barrington St" />
                <AuthInput label="Service category" placeholder="Hair, Repair, Wellness…" />
              </>
            )}

            <button type="button" onClick={onSubmit} style={{
              width: '100%', padding: '15px', borderRadius: 13,
              background: T.white, color: T.ink, fontSize: 14, fontWeight: 800,
              border: 'none', cursor: 'pointer', fontFamily: 'Sora,system-ui',
              marginTop: 8, transition: 'background .15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = '#F0EDE8')}
              onMouseLeave={e => (e.currentTarget.style.background = T.white)}
            >
              {authMode === 'login' ? 'Log in →' : 'Create account →'}
            </button>

            {authMode === 'signup' && (
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,.2)', textAlign: 'center', marginTop: 16, lineHeight: 1.7 }}>
                By creating an account you agree to our{' '}
                <a href="#" onClick={e => e.preventDefault()} style={{ color: 'rgba(255,255,255,.42)', textDecoration: 'underline' }}>Terms of Service</a>
                {' '}and{' '}
                <a href="#" onClick={e => e.preventDefault()} style={{ color: 'rgba(255,255,255,.42)', textDecoration: 'underline' }}>Privacy Policy</a>.
              </p>
            )}
          </div>
        </div>
        <Footer dark />
      </div>
    </Shell>
  )
}
