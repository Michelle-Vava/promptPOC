/**
 * Footer — Copyright bar shown at the bottom of full-page screens
 * (Splash, Auth, Profile, ProviderDashboard).
 *
 * Props:
 *   dark — when true, renders for a dark background (Splash, Auth).
 *           when false (default), renders for a light background (Profile).
 *
 * Legal links are UI stubs — they preventDefault and do not navigate.
 * In production these would link to actual policy documents.
 */
interface FooterProps { dark?: boolean }

export default function Footer({ dark = false }: FooterProps) {
  const yr   = new Date().getFullYear()
  const text = dark ? 'rgba(255,255,255,.18)' : 'rgba(0,0,0,.28)'
  const link = dark ? 'rgba(255,255,255,.32)' : 'rgba(0,0,0,.44)'
  const bdr  = dark ? '1px solid rgba(255,255,255,.06)' : '1px solid rgba(0,0,0,.07)'

  return (
    <div style={{
      padding: '20px 40px', borderTop: bdr,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      flexWrap: 'wrap', gap: 10,
    }}>
      <span style={{ fontSize: 11, color: text, fontFamily: 'Sora,system-ui', lineHeight: 1.6 }}>
        © {yr} Prompt Technologies Inc. · Halifax, NS · All rights reserved.
      </span>
      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
        {([
          ['Terms of Service', '#'],
          ['Privacy Policy',   '#'],
          ['Cookie Policy',    '#'],
          ['Support',          'mailto:hello@promptapp.ca'],
        ] as [string, string][]).map(([label, href]) => (
          <a key={label} href={href}
            onClick={e => { if (href === '#') e.preventDefault() }}
            style={{ fontSize: 11, color: link, fontFamily: 'Sora,system-ui', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
          >{label}</a>
        ))}
      </div>
    </div>
  )
}
