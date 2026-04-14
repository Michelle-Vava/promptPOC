/**
 * CookiesScreen — Cookie Policy page.
 */
import { useNavigate } from '@tanstack/react-router'
import { T } from '../lib/data'
import { useTheme } from '../lib/theme'
import PageLayout from '../components/PageLayout'

export default function CookiesScreen() {
  const { tk, mode } = useTheme()
  const navigate = useNavigate()

  return (
    <PageLayout>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24, fontSize: 12, color: tk.muted, fontFamily: 'Sora,system-ui' }}>
            <span onClick={() => navigate({ to: '/profile' })} style={{ cursor: 'pointer', color: T.accent, fontWeight: 600 }}>Profile</span>
            <span>›</span>
            <span>Cookies</span>
          </div>

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
    </PageLayout>
  )
}
