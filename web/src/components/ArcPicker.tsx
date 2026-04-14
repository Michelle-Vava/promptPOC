/**
 * ArcPicker — Large circle pinned to the bottom-right corner of the map.
 *
 * The circle's centre sits at the corner so only the upper-left quadrant
 * is visible. Ticks + labels for EVERY hour are spread across the exposed
 * 90° arc. A needle rotates from the centre; a floating hub shows the time.
 *
 * Same interface as TimeWheel / DialPicker: { hourIdx, setHourIdx }.
 */
import { useRef, useEffect, useCallback } from 'react'
import { HOURS, T } from '../lib/data'
import { useTheme } from '../lib/theme'

interface ArcPickerProps {
  hourIdx: number
  setHourIdx: (i: number) => void
}

/* ── layout ───────────────────────────────────────────────────────── */
const R        = 320       // main radius — large so labels have room
const SVG      = R + 6     // viewBox = one quadrant
const CX       = SVG       // pivot at bottom-right corner
const CY       = SVG
const NEEDLE   = R - 50    // needle stops before the ticks
const HUB_R    = 32        // hub circle radius
const TICK_O   = R - 4     // tick outer edge
const TICK_I   = R - 20    // tick inner edge
const LABEL_R  = R - 42    // label radius (inside ticks)
const RING_R   = R - 60    // inner decorative ring
const GLOW_R   = 14        // active-hour glow dot radius

/* Visible arc: 90° (top) → 180° (left).
   index 0 → 180°, last index → 90°. */
const ARC_START = 180
const ARC_END   = 90

function angleForIndex(i: number): number {
  return ARC_START - (i / (HOURS.length - 1)) * (ARC_START - ARC_END)
}

function indexFromAngle(deg: number): number {
  const clamped = Math.max(ARC_END, Math.min(ARC_START, deg))
  return Math.round(((ARC_START - clamped) / (ARC_START - ARC_END)) * (HOURS.length - 1))
}

export default function ArcPicker({ hourIdx, setHourIdx }: ArcPickerProps) {
  const { mode } = useTheme()
  const dark = mode === 'dark'
  const svgRef = useRef<SVGSVGElement>(null)
  const dragging = useRef(false)

  const getAngle = useCallback((clientX: number, clientY: number) => {
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) return 135
    const scaleX = SVG / rect.width
    const scaleY = SVG / rect.height
    const sx = (clientX - rect.left) * scaleX
    const sy = (clientY - rect.top) * scaleY
    const dx = sx - CX
    const dy = sy - CY
    let a = (Math.atan2(-dy, dx) * 180) / Math.PI
    if (a < 0) a += 360
    return a
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

  const ndeg = angleForIndex(hourIdx)
  const nrad = (ndeg * Math.PI) / 180
  const nx = CX + Math.cos(nrad) * NEEDLE
  const ny = CY - Math.sin(nrad) * NEEDLE

  /* Needle tip (small triangle) */
  const tipLen = 8
  const perpX = Math.sin(nrad) * tipLen
  const perpY = Math.cos(nrad) * tipLen
  const tipPath = `M ${nx - perpX} ${ny + perpY} L ${nx + perpX} ${ny - perpY} L ${CX + Math.cos(nrad) * (NEEDLE + 12)} ${CY - Math.sin(nrad) * (NEEDLE + 12)} Z`

  /* arc edge points */
  const ax1 = CX + Math.cos((ARC_START * Math.PI) / 180) * R
  const ay1 = CY - Math.sin((ARC_START * Math.PI) / 180) * R
  const ax2 = CX + Math.cos((ARC_END * Math.PI) / 180) * R
  const ay2 = CY - Math.sin((ARC_END * Math.PI) / 180) * R
  const wedgePath = `M ${CX} ${CY} L ${ax1} ${ay1} A ${R} ${R} 0 0 1 ${ax2} ${ay2} Z`

  /* inner ring arc */
  const rx1 = CX + Math.cos((ARC_START * Math.PI) / 180) * RING_R
  const ry1 = CY - Math.sin((ARC_START * Math.PI) / 180) * RING_R
  const rx2 = CX + Math.cos((ARC_END * Math.PI) / 180) * RING_R
  const ry2 = CY - Math.sin((ARC_END * Math.PI) / 180) * RING_R

  /* hub position — along needle direction, offset into the visible area */
  const hubDist = NEEDLE - 56
  const hubAngle = nrad
  const hubX = CX + Math.cos(hubAngle) * hubDist
  const hubY = CY - Math.sin(hubAngle) * hubDist

  const gradId = 'arc-grad'
  const glowId = 'arc-glow'

  return (
    <div style={{
      position: 'absolute', right: 0, bottom: 0,
      width: SVG, height: SVG,
      overflow: 'hidden',
      zIndex: 2000, userSelect: 'none', touchAction: 'none',
      pointerEvents: 'all',
    }}>
      <svg
        ref={svgRef}
        width={SVG}
        height={SVG}
        viewBox={`0 0 ${SVG} ${SVG}`}
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
        style={{ cursor: 'grab', filter: 'drop-shadow(-4px -4px 28px rgba(0,0,0,.3))' }}
      >
        <defs>
          {/* Radial gradient for the wedge background */}
          <radialGradient id={gradId} cx={CX} cy={CY} r={R} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={dark ? 'rgba(20,20,20,.95)' : 'rgba(255,255,255,.97)'} />
            <stop offset="100%" stopColor={dark ? 'rgba(8,8,8,.82)' : 'rgba(240,240,240,.82)'} />
          </radialGradient>
          {/* Accent glow filter */}
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Background wedge */}
        <path d={wedgePath} fill={`url(#${gradId})`} />

        {/* Outer edge arc */}
        <path
          d={`M ${ax1} ${ay1} A ${R} ${R} 0 0 1 ${ax2} ${ay2}`}
          fill="none"
          stroke={dark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.07)'}
          strokeWidth={3}
        />

        {/* Inner decorative ring */}
        <path
          d={`M ${rx1} ${ry1} A ${RING_R} ${RING_R} 0 0 1 ${rx2} ${ry2}`}
          fill="none"
          stroke={dark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.04)'}
          strokeWidth={1.5}
          strokeDasharray="4 6"
        />

        {/* Straight edge lines (radii) */}
        <line x1={CX} y1={CY} x2={ax1} y2={ay1}
          stroke={dark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.04)'}
          strokeWidth={1.5}
        />
        <line x1={CX} y1={CY} x2={ax2} y2={ay2}
          stroke={dark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.04)'}
          strokeWidth={1.5}
        />

        {/* Tick marks + labels for EVERY hour */}
        {HOURS.map((h, i) => {
          const a = (angleForIndex(i) * Math.PI) / 180
          const x1 = CX + Math.cos(a) * TICK_I
          const y1 = CY - Math.sin(a) * TICK_I
          const x2 = CX + Math.cos(a) * TICK_O
          const y2 = CY - Math.sin(a) * TICK_O
          const active = i === hourIdx
          const lx = CX + Math.cos(a) * LABEL_R
          const ly = CY - Math.sin(a) * LABEL_R
          return (
            <g key={i}>
              {/* Active glow dot */}
              {active && (
                <circle
                  cx={CX + Math.cos(a) * ((TICK_I + TICK_O) / 2)}
                  cy={CY - Math.sin(a) * ((TICK_I + TICK_O) / 2)}
                  r={GLOW_R}
                  fill={`${T.accent}30`}
                  filter={`url(#${glowId})`}
                />
              )}
              <line
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={active ? T.accent : dark ? 'rgba(255,255,255,.22)' : 'rgba(0,0,0,.16)'}
                strokeWidth={active ? 4 : 2}
                strokeLinecap="round"
              />
              {/* Hour label — every slot */}
              <text
                x={lx} y={ly + 4}
                textAnchor="middle"
                fill={active ? T.accent : dark ? 'rgba(255,255,255,.5)' : 'rgba(0,0,0,.4)'}
                fontSize={active ? 13 : 11}
                fontWeight={active ? 800 : 600}
                fontFamily="Sora,system-ui"
                style={{ transition: 'fill .15s, font-size .15s' }}
              >
                {h}
              </text>
            </g>
          )
        })}

        {/* Needle line */}
        <line
          x1={CX} y1={CY} x2={nx} y2={ny}
          stroke={T.accent}
          strokeWidth={3}
          strokeLinecap="round"
          style={{ transition: 'x2 .14s ease-out, y2 .14s ease-out' }}
        />

        {/* Needle tip arrow */}
        <path
          d={tipPath}
          fill={T.accent}
          style={{ transition: 'd .14s ease-out' }}
        />

        {/* Hub — follows the needle */}
        <circle cx={hubX} cy={hubY} r={HUB_R}
          fill={dark ? 'rgba(13,13,13,.97)' : 'rgba(255,255,255,.97)'}
          stroke={T.accent}
          strokeWidth={2.5}
          style={{ transition: 'cx .14s ease-out, cy .14s ease-out' }}
        />
        <text
          x={hubX} y={hubY + 5}
          textAnchor="middle"
          fill={dark ? '#fff' : '#0D0D0D'}
          fontSize={14}
          fontWeight={800}
          fontFamily="Sora,system-ui"
          style={{ transition: 'x .14s ease-out, y .14s ease-out' }}
        >
          {HOURS[hourIdx]}
        </text>

        {/* Pivot dot */}
        <circle cx={CX} cy={CY} r={6} fill={T.accent} />
        <circle cx={CX} cy={CY} r={3} fill={dark ? '#0D0D0D' : '#fff'} />
      </svg>
    </div>
  )
}
