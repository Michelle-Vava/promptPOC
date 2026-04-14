/**
 * PrivacyScreen — Privacy Policy page.
 */
import { useNavigate } from '@tanstack/react-router'
import { T } from '../lib/data'
import { useTheme } from '../lib/theme'
import PageLayout from '../components/PageLayout'

export default function PrivacyScreen() {
  const { tk, mode } = useTheme()
  const navigate = useNavigate()

  return (
    <PageLayout>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24, fontSize: 12, color: tk.muted, fontFamily: 'Sora,system-ui' }}>
            <span onClick={() => navigate({ to: '/profile' })} style={{ cursor: 'pointer', color: T.accent, fontWeight: 600 }}>Profile</span>
            <span>›</span>
            <span>Privacy</span>
          </div>

          <div style={{ fontSize: 28, fontWeight: 900, color: tk.text, letterSpacing: '-1px', marginBottom: 6, fontFamily: 'Sora,system-ui' }}>
            Privacy Policy
          </div>
          <p style={{ fontSize: 12, color: tk.muted, marginBottom: 28 }}>Last updated: April 2025</p>

          {([
            { title: '1. Information We Collect', body: 'We collect information you provide directly: name, email address, and booking details. We also collect device information, location data (with your permission), and usage analytics to improve the service.' },
            { title: '2. How We Use Your Information', body: 'Your data is used to: process bookings, communicate with you about appointments, improve our service, send important updates, and provide customer support. We never sell your personal data.' },
            { title: '3. Data Sharing', body: 'We share limited information with providers (your name and booking time) to fulfill your bookings. We do not share your data with third parties for marketing purposes.' },
            { title: '4. Data Storage & Security', body: 'Your data is stored securely using industry-standard encryption. We retain booking history for service improvement and comply with all applicable Canadian privacy regulations (PIPEDA).' },
            { title: '5. Your Rights', body: 'You can access, correct, or delete your personal data at any time through your profile settings or by contacting support. You may also request a full export of your data.' },
            { title: '6. Cookies & Analytics', body: 'We use essential cookies for authentication and preferences. Analytics cookies help us understand how the platform is used. You can manage cookie preferences in your browser settings.' },
            { title: '7. Contact', body: 'For privacy-related questions, contact our Privacy Officer at privacy@prompt.app or through in-app support.' },
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
