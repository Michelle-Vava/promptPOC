/**
 * DialPicker — Circular clock-face time selector overlaid on the map (web).
 *
 * A compact SVG dial (~130px) with tick marks. Drag or click to rotate
 * the needle to the desired hour. Centre shows selected time.
 *
 * Same interface as TimeWheel: { hourIdx, setHourIdx }.
 */
import { useRef, useEffect, useCallback } from 'react'
import { HOURS, T } from '../lib/data'
import { useTheme } from '../lib/theme'

interface DialPickerProps {
  hourIdx: number
  setHourIdx: (i: number) => void
}

const SIZE = 130
const R = SIZE / 2
const TICK_OUTER = R - 4
const TICK_INNER = R - 16
const NEEDLE_LEN = R - 24
const CENTER_R = 18

function angleForIndex(i: number): number {
  return (i / HOURS.length) * 360 - 90
}

function indexFromAngle(deg: number): number {
  let norm = (deg + 90) % 360
  if (norm < 0) norm += 360
  return Math.round((norm / 360) * HOURS.length) % HOURS.length
}

export default function DialPicker({ hourIdx, setHourIdx }: DialPickerProps) {
  const { mode } = useTheme()
  const dark = mode === 'dark'
  const svgRef = useRef<SVGSVGElement>(null)
  const dragging = useRef(false)

  const getAngle = useCallback((clientX: number, clientY: number) => {
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) return 0
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    return (Math.atan2(clientY - cy, clientX - cx) * 180) / Math.PI
  }, [])

  const handlePointerDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    dragging.current = true
    const { clientX, clientY } = 'touches' in e ? e.touches[0] : e
    setHourIdx(indexFromAngle(getAngle(clientX, clientY)))
    e.preventDefault()
    e.stopPropagation()
  }, [getAngle, setHourIdx])

  useEffect(() => {
    const mv = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return
      const { clientX, clientY } = 'touches' in e ? e.touches[0] : e
      setHourIdx(indexFromAngle(getAngle(clientX, clientY)))
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
  }, [getAngle, setHourIdx])

  const needleDeg = angleForIndex(hourIdx)
  const needleRad = (needleDeg * Math.PI) / 180
  const nx = R + Math.cos(needleRad) * NEEDLE_LEN
  const ny = R + Math.sin(needleRad) * NEEDLE_LEN

  return (
    <div style={{
      position: 'absolute', right: 16, bottom: 32,
      zIndex: 2000, userSelect: 'none', touchAction: 'none',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      pointerEvents: 'all',
    }}>
      <svg
        ref={svgRef}
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
        style={{ cursor: 'grab', filter: 'drop-shadow(0 4px 24px rgba(0,0,0,.5))' }}
      >
        {/* Background circle */}
        <circle cx={R} cy={R} r={R - 1} fill={dark ? 'rgba(8,8,8,.95)' : 'rgba(255,255,255,.95)'} stroke={dark ? 'rgba(255,255,255,.14)' : 'rgba(0,0,0,.1)'} strokeWidth={2} />

        {/* Inner ring */}
        <circle cx={R} cy={R} r={R - 5} fill="none" stroke={dark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.04)'} strokeWidth={3} />

        {/* Tick marks */}
        {HOURS.map((_, i) => {
          const aDeg = (i / HOURS.length) * 360 - 90
          const aRad = (aDeg * Math.PI) / 180
          const x1 = R + Math.cos(aRad) * TICK_INNER
          const y1 = R + Math.sin(aRad) * TICK_INNER
          const x2 = R + Math.cos(aRad) * TICK_OUTER
          const y2 = R + Math.sin(aRad) * TICK_OUTER
          const isActive = i === hourIdx
          return (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={isActive ? T.accent : (dark ? 'rgba(255,255,255,.3)' : 'rgba(0,0,0,.2)')}
              strokeWidth={isActive ? 3 : 2}
              strokeLinecap="round"
            />
          )
        })}

        {/* Needle */}
        <line
          x1={R} y1={R} x2={nx} y2={ny}
          stroke={T.accent}
          strokeWidth={3}
          strokeLinecap="round"
          style={{ transition: 'x2 .1s, y2 .1s' }}
        />

        {/* Center circle */}
        <circle cx={R} cy={R} r={CENTER_R} fill={dark ? 'rgba(13,13,13,.98)' : 'rgba(255,255,255,.98)'} stroke={T.accent} strokeWidth={2} />

        {/* Center text */}
        <text
          x={R} y={R + 4}
          textAnchor="middle"
          fill={dark ? '#fff' : '#0D0D0D'}
          fontSize={11}
          fontWeight={700}
          fontFamily="Sora,system-ui"
        >
          {HOURS[hourIdx]}
        </text>
      </svg>

      {/* Accent dot */}
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
