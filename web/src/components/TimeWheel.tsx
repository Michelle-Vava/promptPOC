/**
 * TimeWheel — Vertical drag-to-scroll time selector overlaid on the map.
 *
 * Positioned: absolute right, vertically centred. z-index 2000 (above Leaflet ~1000).
 *
 * Interaction:
 *   - Click an adjacent slot to jump directly
 *   - Drag/swipe up-down to scroll (30px per step)
 *   - touchmove registered with passive:false to prevent page scroll on mobile
 *
 * Renders 5 visible slots: 2 above current, current (large), 2 below.
 * Out-of-range slots render as blank.
 */
import { useRef, useEffect, useCallback } from 'react'
import { HOURS, T } from '../lib/data'

interface TimeWheelProps {
  hourIdx: number
  setHourIdx: (i: number) => void
}

export default function TimeWheel({ hourIdx, setHourIdx }: TimeWheelProps) {
  const dragging = useRef(false)
  const startY = useRef(0)
  const startIdx = useRef(0)

  const getY = (e: MouseEvent | TouchEvent) =>
    'touches' in e ? e.touches[0].clientY : e.clientY

  const down = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    dragging.current = true
    startY.current = 'touches' in e ? e.touches[0].clientY : e.clientY
    startIdx.current = hourIdx
    e.preventDefault()
    e.stopPropagation()
  }, [hourIdx])

  useEffect(() => {
    const mv = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return
      const d = -Math.round((getY(e) - startY.current) / 30)
      setHourIdx(Math.max(0, Math.min(HOURS.length - 1, startIdx.current + d)))
    }
    const up = () => { dragging.current = false }

    window.addEventListener('mousemove', mv)
    window.addEventListener('mouseup', up)
    window.addEventListener('touchmove', mv, { passive: false })
    window.addEventListener('touchend', up)
    return () => {
      window.removeEventListener('mousemove', mv)
      window.removeEventListener('mouseup', up)
      window.removeEventListener('touchmove', mv)
      window.removeEventListener('touchend', up)
    }
  }, [setHourIdx])

  return (
    <div
      onMouseDown={down}
      onTouchStart={down}
      style={{
        position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
        zIndex: 2000, userSelect: 'none', touchAction: 'none', cursor: 'grab',
        pointerEvents: 'all',
      }}
    >
      <div style={{
        background: 'rgba(8,8,8,.95)', borderRadius: 22, padding: '12px 8px',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,.14)', width: 72,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        boxShadow: '0 4px 24px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.04)',
      }}>
        <svg width="10" height="6" viewBox="0 0 10 6" style={{ marginBottom: 8, opacity: .22 }}>
          <path d="M1 5L5 1L9 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        {([-2, -1, 0, 1, 2] as const).map(off => {
          const i = hourIdx + off
          const ok = i >= 0 && i < HOURS.length
          const cur = off === 0
          const d = Math.abs(off)
          return (
            <div
              key={off}
              onClick={() => ok && setHourIdx(i)}
              style={{
                width: '100%', textAlign: 'center',
                padding: cur ? '10px 4px' : '5px 4px',
                fontSize: cur ? 14 : d === 1 ? 11 : 9,
                fontWeight: cur ? 800 : 400,
                color: cur ? '#fff' : `rgba(255,255,255,${d === 1 ? .28 : .1})`,
                background: cur ? 'rgba(255,255,255,.09)' : 'transparent',
                borderRadius: 9,
                cursor: ok ? 'pointer' : 'default',
                lineHeight: 1.1,
                transition: 'all .1s',
                fontFamily: 'Sora,system-ui',
                letterSpacing: cur ? '-0.3px' : '0',
              }}
            >
              {ok ? HOURS[i] : ''}
            </div>
          )
        })}

        <svg width="10" height="6" viewBox="0 0 10 6" style={{ marginTop: 8, opacity: .22, transform: 'rotate(180deg)' }}>
          <path d="M1 5L5 1L9 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div style={{
        width: 5, height: 5, borderRadius: '50%', background: T.accent,
        margin: '7px auto 0', boxShadow: `0 0 8px ${T.accent}`,
      }} />
      <div style={{
        fontSize: 9, color: 'rgba(0,0,0,.3)', textAlign: 'center',
        marginTop: 4, fontWeight: 700, letterSpacing: '1px', fontFamily: 'Sora,system-ui',
      }}>
        TIME
      </div>
    </div>
  )
}
