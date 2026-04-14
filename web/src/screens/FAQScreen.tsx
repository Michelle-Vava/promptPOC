/**
 * FAQScreen — Frequently asked questions page.
 */
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { T } from '../lib/data'
import { useTheme } from '../lib/theme'
import PageLayout from '../components/PageLayout'

const FAQS = [
  { q: 'How does PROMPT work?', a: 'PROMPT connects you with same-day service providers in Halifax. Browse providers on the map, pick an available time slot, and confirm your booking instantly. No waiting, no phone calls.' },
  { q: 'Is PROMPT free for customers?', a: 'Yes — PROMPT is 100% free for customers. No booking fees, no hidden charges, forever. Providers pay just $1 per confirmed booking.' },
  { q: 'How do I cancel a booking?', a: 'Open your Activity screen, find the booking you want to cancel, and tap the "Cancel" button. Cancellations are free if made at least 1 hour before your appointment.' },
  { q: 'What if my provider cancels?', a: 'If a provider cancels, you\'ll be notified immediately and we\'ll suggest similar available providers nearby so you can rebook quickly.' },
  { q: 'What happens if no slots are available?', a: 'If a provider has no open slots at your selected time, try adjusting the time wheel to find alternative times. You can also browse other providers in the same category.' },
  { q: 'What areas does PROMPT cover?', a: 'PROMPT currently serves the Halifax Regional Municipality, including Downtown Halifax, Dartmouth, Bedford, and surrounding areas. We\'re expanding soon!' },
  { q: 'How do I become a provider?', a: 'Tap "List Your Services" on the home screen and create a provider account. Set your availability, add your services, and start accepting bookings in minutes.' },
  { q: 'What does it cost for providers?', a: 'Providers pay a flat $1 fee per confirmed booking. That\'s it — no subscriptions, no percentages, no hidden fees. You keep everything else.' },
]

export default function FAQScreen() {
  const { tk, mode } = useTheme()
  const navigate = useNavigate()
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <PageLayout>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24, fontSize: 12, color: tk.muted, fontFamily: 'Sora,system-ui' }}>
            <span onClick={() => navigate({ to: '/profile' })} style={{ cursor: 'pointer', color: T.accent, fontWeight: 600 }}>Profile</span>
            <span>›</span>
            <span>FAQ</span>
          </div>

          <div style={{ fontSize: 28, fontWeight: 900, color: tk.text, letterSpacing: '-1px', marginBottom: 6, fontFamily: 'Sora,system-ui' }}>
            FAQ
          </div>
          <p style={{ fontSize: 14, color: tk.muted, marginBottom: 28 }}>Everything you need to know about PROMPT</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{
                background: tk.card, borderRadius: 16, border: `1px solid ${tk.line}`,
                overflow: 'hidden', boxShadow: '0 1px 8px rgba(0,0,0,.04)',
              }}>
                <button type="button" onClick={() => setOpenIdx(openIdx === i ? null : i)} style={{
                  width: '100%', padding: '16px 20px', background: 'none', border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  cursor: 'pointer', fontFamily: 'Sora,system-ui', textAlign: 'left',
                }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: tk.text }}>{faq.q}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{
                    transition: 'transform .2s', transform: openIdx === i ? 'rotate(180deg)' : 'none', flexShrink: 0, marginLeft: 12,
                  }}>
                    <path d="M4 6l4 4 4-4" stroke={tk.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {openIdx === i && (
                  <div style={{ padding: '0 20px 16px', fontSize: 13, color: tk.sub, lineHeight: 1.7 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
    </PageLayout>
  )
}
