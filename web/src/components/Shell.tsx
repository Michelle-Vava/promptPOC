/**
 * Shell — Root layout wrapper injected around every screen.
 *
 * Responsibilities:
 *   - Loads the Sora Google Font
 *   - Applies a global CSS reset (box-sizing, margin, padding)
 *   - Defines all shared keyframe animations used across the app:
 *       fadeUp        — element rises in from below (cards, toasts, drawers)
 *       popIn         — springy scale-in (booking success states)
 *       slideInRight  — slides in from the right (provider panel, drawers)
 *       slideInUp     — slides up from bottom (mobile bottom sheet)
 *       pulse         — glowing dot animation (live indicator)
 *       shimmer       — horizontal shimmer (skeleton loaders)
 *       spin          — 360° rotation (loading spinners)
 */
interface ShellProps {
  children: React.ReactNode
}

export default function Shell({ children }: ShellProps) {
  return (
    <div style={{ fontFamily: "'Sora',system-ui,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }
        input::placeholder { color: rgba(255,255,255,.22); }
        select option { background: #1A1A1A; color: #fff; }
        @keyframes fadeUp      { from { opacity:0; transform:translateY(14px) }  to { opacity:1; transform:translateY(0) } }
        @keyframes popIn       { 0% { opacity:0; transform:scale(.9) } 70% { transform:scale(1.03) } 100% { opacity:1; transform:scale(1) } }
        @keyframes slideInRight{ from { opacity:0; transform:translateX(22px) }  to { opacity:1; transform:translateX(0) } }
        @keyframes slideInUp   { from { opacity:0; transform:translateY(100%) }  to { opacity:1; transform:translateY(0) } }
        @keyframes pulse       { 0%,100% { box-shadow:0 0 0 0 rgba(0,184,124,.5) } 60% { box-shadow:0 0 0 6px rgba(0,184,124,0) } }
        @keyframes shimmer     { 0% { background-position:-400px 0 } 100% { background-position:400px 0 } }
        @keyframes spin        { to { transform:rotate(360deg) } }
      `}</style>
      {children}
    </div>
  )
}
