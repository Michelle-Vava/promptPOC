/**
 * TermsScreen — Terms of Service page.
 */
import { useNavigate } from '@tanstack/react-router'
import { useTheme } from '../lib/theme'
import Shell from '../components/Shell'
import Footer from '../components/Footer'

export default function TermsScreen() {
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
            Terms of Service
          </div>
          <p style={{ fontSize: 12, color: tk.muted, marginBottom: 28 }}>Last updated: April 2025</p>

          {([
            { title: '1. Acceptance of Terms', body: 'By accessing or using PROMPT ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Platform.' },
            { title: '2. Description of Service', body: 'PROMPT is a same-day booking marketplace that connects customers with local service providers in Halifax. We facilitate the booking process but are not a party to the service agreement between customers and providers.' },
            { title: '3. User Accounts', body: 'You must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.' },
            { title: '4. Booking & Cancellation', body: 'Bookings are confirmed instantly. Customers may cancel free of charge up to 1 hour before the appointment. Late cancellations may affect your account standing.' },
            { title: '5. Provider Terms', body: 'Providers agree to a flat fee of $1.00 per confirmed booking. Providers are responsible for delivering services as described and maintaining accurate availability.' },
            { title: '6. Prohibited Conduct', body: 'Users may not: misuse the platform, create fake accounts, harass other users, or engage in any activity that disrupts the service or violates applicable law.' },
            { title: '7. Limitation of Liability', body: 'PROMPT is provided "as is." We make no warranties regarding the quality of services provided by third-party providers. Our liability is limited to the maximum extent permitted by law.' },
            { title: '8. Contact', body: 'Questions about these terms? Contact us at legal@prompt.app or through the in-app support chat.' },
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
