/**
 * AppBar — Persistent top navigation bar for logged-in pages.
 *
 * Hamburger menu on the left opens SidebarNav drawer.
 * PROMPT logo in the center. Used by all post-auth screens except
 * MapScreen (which has its own compact nav).
 */
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { T } from '../lib/data'
import { useTheme } from '../lib/theme'
import SidebarNav from './SidebarNav'

export default function AppBar() {
  const { tk } = useTheme()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <nav style={{
        background: tk.surface, padding: '0 20px', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: `1px solid ${tk.line}`, flexShrink: 0, zIndex: 50,
      }}>
        {/* Hamburger */}
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
          style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'transparent', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={tk.text} strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Logo */}
        <div
          onClick={() => navigate({ to: '/' })}
          style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
        >
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: T.green, animation: 'pulse 2s infinite' }} />
          <span style={{
            fontSize: 17, fontWeight: 900, color: tk.text,
            letterSpacing: '-0.4px', fontFamily: 'Sora,system-ui',
          }}>PROMPT</span>
        </div>

        {/* User avatar */}
        <div
          onClick={() => setSidebarOpen(true)}
          style={{
            width: 34, height: 34, borderRadius: 12,
            background: `${T.accent}22`, border: `1.5px solid ${T.accent}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 800, color: T.accent, fontFamily: 'Sora,system-ui',
            cursor: 'pointer', transition: 'transform .15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
        >
          JD
        </div>
      </nav>

      <SidebarNav isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  )
}
