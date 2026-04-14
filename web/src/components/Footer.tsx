/**
 * Footer — Copyright bar shown at the bottom of full-page screens.
 *
 * Uses theme tokens for consistent appearance across light/dark modes.
 * Legal links navigate to actual route pages via TanStack Router.
 */
import { useNavigate } from '@tanstack/react-router'
import { useTheme } from '../lib/theme'

export default function Footer() {
  const { tk } = useTheme()
  const navigate = useNavigate()
  const yr = new Date().getFullYear()

  const LINKS: { label: string; to?: string; href?: string }[] = [
    { label: 'Terms', to: '/legal/terms' },
    { label: 'Privacy', to: '/legal/privacy' },
    { label: 'Cookies', to: '/legal/cookies' },
    { label: 'Support', href: 'mailto:hello@promptapp.ca' },
  ]

  return (
    <div style={{
      padding: '20px 40px', borderTop: `1px solid ${tk.line}`,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      flexWrap: 'wrap', gap: 10,
    }}>
      <span style={{ fontSize: 11, color: tk.muted, fontFamily: 'Sora,system-ui', lineHeight: 1.6, opacity: 0.7 }}>
        © {yr} Prompt Technologies Inc. · Halifax, NS
      </span>
      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
        {LINKS.map(l => (
          <span
            key={l.label}
            onClick={() => l.to ? navigate({ to: l.to }) : l.href && window.open(l.href)}
            style={{
              fontSize: 11, color: tk.muted, fontFamily: 'Sora,system-ui',
              textDecoration: 'none', cursor: 'pointer',
            }}
            onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
          >{l.label}</span>
        ))}
      </div>
    </div>
  )
}
