/**
 * Chip — Category filter pill button used in CategoryBar.
 *
 * Active state: fills with the category's brand color + drop shadow.
 * Inactive state: ghosted, dark background.
 *
 * The color prop comes from GROUPS[n].color in data.ts.
 */
import { T } from '../lib/data'
import { useTheme } from '../lib/theme'

interface ChipProps {
  active: boolean
  color: string    // Category brand color (hex)
  onClick: () => void
  children: React.ReactNode
}

export default function Chip({ active, color, onClick, children }: ChipProps) {
  const { tk } = useTheme()
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '7px 14px',
        borderRadius: 20,
        border: active ? `1.5px solid ${color}38` : `1.5px solid ${tk.line}`,
        fontSize: 12,
        fontWeight: 700,
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        background: active ? color : tk.inputBg,
        color: active ? T.white : tk.muted,
        boxShadow: active ? `0 2px 14px ${color}40` : 'none',
        transition: 'all .15s',
        fontFamily: 'Sora,system-ui',
        letterSpacing: '-0.1px',
      }}
    >
      {children}
    </button>
  )
}
