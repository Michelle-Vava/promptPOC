/**
 * CategoryBar — Horizontally scrollable row of category filter chips.
 *
 * Renders an "All" chip followed by one chip per GROUPS entry.
 * Selecting an active category a second time deselects it (toggles back to All).
 * Changing category also clears the active provider panel (setActiveId(null)).
 *
 * A right-edge fade gradient hints that more chips are available to scroll.
 * The scrollbar is hidden via scrollbarWidth/msOverflowStyle for cleanliness.
 */
import { GROUPS, T } from '../lib/data'
import { useTheme } from '../lib/theme'
import Chip from './Chip'

interface CategoryBarProps {
  category: string | null
  setCategory: (cat: string | null) => void
  setActiveId: (id: number | null) => void
}

export default function CategoryBar({ category, setCategory, setActiveId }: CategoryBarProps) {
  const { tk, mode } = useTheme()
  return (
    <div style={{ background: tk.surface, flexShrink: 0, borderBottom: `1px solid ${tk.line}`, position: 'relative' }}>
      <div style={{
        padding: '10px 20px 12px',
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}>
        {GROUPS.map(g => (
          <Chip
            key={g.id}
            active={category === g.id}
            color={g.color}
            onClick={() => { setCategory(category === g.id ? null : g.id); setActiveId(null) }}
          >
            {g.icon} {g.label}
          </Chip>
        ))}
      </div>
      {/* Fade gradient — indicates more chips off-screen to the right */}
      <div style={{
        position: 'absolute', top: 0, right: 0, width: 48, height: '100%',
        background: `linear-gradient(to left, ${mode === 'dark' ? 'rgba(17,17,17,1)' : 'rgba(245,243,239,1)'} 0%, ${mode === 'dark' ? 'rgba(17,17,17,0)' : 'rgba(245,243,239,0)'} 100%)`,
        pointerEvents: 'none',
      }} />
    </div>
  )
}
