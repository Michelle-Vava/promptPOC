/**
 * CookiesScreen — Cookie Policy page.
 */
import { useNavigate } from '@tanstack/react-router'
import { useTheme } from '../lib/theme'
import Shell from '../components/Shell'
import Footer from '../components/Footer'

export default function CookiesScreen() {
  const { tk, mode } = useTheme()
  const navigate = useNavigate()

  return (
    <Shell>
      <div style={{ minHeight: '100vh', background: tk.bg, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, maxWidth: 640, margin: '0 auto', width: '100%', padding: '40px 20px' }}>
          <button type="button" onClick={() => navigate({ to: '/profile' })} style={{
            background: 'none', border: 'none', color: tk.muted, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Sora,system-ui', fontSize: 13, marginBottom: 28,
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>

          <div style={{ fontSize: 28, fontWeight: 900, color: tk.text, letterSpacing: '-1px', marginBottom: 6, fontFamily: 'Sora,system-ui' }}>
            Cookie Policy
          </div>
          <p style={{ fontSize: 12, color: tk.muted, marginBottom: 28 }}>Last updated: April 2025</p>

          {([
            { title: '1. What Are Cookies?', body: 'Cookies are small text files stored on your device when you visit a website. They help us remember your preferences and understand how you use our platform.' },
            { title: '2. Essential Cookies', body: 'These cookies are required for the platform to function. They handle authentication, session management, and security. You cannot opt out of these cookies.' },
            { title: '3. Preference Cookies', body: 'These cookies remember your settings like theme preference (light/dark mode), language, and display options. Disabling these will reset your preferences on each visit.' },
            { title: '4. Analytics Cookies', body: 'We use analytics cookies to understand how users interact with PROMPT. This helps us improve the user experience. All analytics data is anonymized and aggregated.' },
            { title: '5. Third-Party Cookies', body: 'We do not use third-party advertising cookies. The only third-party cookies are from our mapping provider (Leaflet/OpenStreetMap) to display the service map.' },
            { title: '6. Managing Cookies', body: 'You can manage cookies through your browser settings. Note that disabling essential cookies may prevent the platform from working correctly.' },
            { title: '7. Contact', body: 'Questions about our cookie practices? Contact us at privacy@prompt.app.' },
          ]).map((section, i) => (
            <div key={i} style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: tk.text, marginBottom: 8, fontFamily: 'Sora,system-ui' }}>
                {section.title}
              </div>
              <p style={{ fontSize: 14, color: tk.sub, lineHeight: 1.7, margin: 0 }}>
                {section.body}
              </p>
            </div>
          ))}
        </div>
        <Footer dark={mode === 'dark'} />
      </div>
    </Shell>
  )
}
