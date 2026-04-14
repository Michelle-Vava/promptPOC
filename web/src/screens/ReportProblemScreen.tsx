/**
 * ReportProblemScreen — Report a problem form.
 */
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { T } from '../lib/data'
import { useTheme } from '../lib/theme'
import PageLayout from '../components/PageLayout'

const CATEGORIES = ['Booking issue', 'Payment problem', 'Provider complaint', 'App bug', 'Other']

export default function ReportProblemScreen() {
  const { tk, mode } = useTheme()
  const navigate = useNavigate()
  const [category, setCategory] = useState<string | null>(null)
  const [description, setDescription] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <PageLayout>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', padding: '40px 20px', animation: 'fadeUp .32s ease' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: tk.text, marginBottom: 8, fontFamily: 'Sora,system-ui' }}>
              Report Submitted
            </div>
            <p style={{ fontSize: 14, color: tk.muted, marginBottom: 24, maxWidth: 320, margin: '0 auto 24px' }}>
              Thanks for letting us know. Our team will review your report within 24 hours.
            </p>
            <button type="button" onClick={() => navigate({ to: '/profile' })} style={{
              padding: '14px 32px', borderRadius: 13, background: tk.text, color: tk.bg,
              fontSize: 14, fontWeight: 800, border: 'none', cursor: 'pointer', fontFamily: 'Sora,system-ui',
            }}>
              Back to Profile
            </button>
          </div>
          </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24, fontSize: 12, color: tk.muted, fontFamily: 'Sora,system-ui' }}>
            <span onClick={() => navigate({ to: '/profile' })} style={{ cursor: 'pointer', color: T.accent, fontWeight: 600 }}>Profile</span>
            <span>›</span>
            <span>Report</span>
          </div>

          <div style={{ fontSize: 28, fontWeight: 900, color: tk.text, letterSpacing: '-1px', marginBottom: 6, fontFamily: 'Sora,system-ui' }}>
            Report a Problem
          </div>
          <p style={{ fontSize: 14, color: tk.muted, marginBottom: 28 }}>We'll look into this right away</p>

          {/* Category */}
          <div style={{ fontSize: 12, fontWeight: 700, color: tk.sub, marginBottom: 10, fontFamily: 'Sora,system-ui' }}>
            What's the issue?
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
            {CATEGORIES.map(cat => (
              <button type="button" key={cat} onClick={() => setCategory(cat)} style={{
                padding: '8px 16px', borderRadius: 20,
                border: `1.5px solid ${category === cat ? T.accent : tk.line}`,
                background: category === cat ? 'rgba(255,92,0,.08)' : tk.card,
                color: category === cat ? T.accent : tk.text,
                fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Sora,system-ui',
                transition: 'all .15s',
              }}>
                {cat}
              </button>
            ))}
          </div>

          {/* Description */}
          <div style={{ fontSize: 12, fontWeight: 700, color: tk.sub, marginBottom: 10, fontFamily: 'Sora,system-ui' }}>
            Describe the problem
          </div>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Tell us what happened..."
            rows={5}
            style={{
              width: '100%', padding: '14px 16px', borderRadius: 13,
              border: `1.5px solid ${tk.inputBorder}`, background: tk.inputBg,
              color: tk.text, fontSize: 14, fontFamily: 'Sora,system-ui',
              resize: 'vertical', outline: 'none',
              boxSizing: 'border-box',
            }}
          />

          <button type="button" onClick={() => setSubmitted(true)} disabled={!category || !description.trim()} style={{
            width: '100%', padding: '15px', borderRadius: 13, marginTop: 24,
            background: (!category || !description.trim()) ? tk.muted : T.accent,
            color: '#fff', fontSize: 14, fontWeight: 800,
            border: 'none', cursor: (!category || !description.trim()) ? 'not-allowed' : 'pointer',
            fontFamily: 'Sora,system-ui', transition: 'opacity .15s',
          }}>
            Submit Report
          </button>
    </PageLayout>
  )
}
